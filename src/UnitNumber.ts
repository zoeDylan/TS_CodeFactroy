import BigNumber from "bignumber.js";

/** 单位数字输入类型 */
export type UnitNumberInputType = string | number | BigNumber | UnitNumber;

/** 单位数字截取小数长度类型 */
export type UnitNumberCutDecimalsLenType = number | [number, -1] | [-1, number];

/** 单位数字比较类型 */
export type UnitNumberCompareType = "<" | "<=" | "=" | ">=" | ">";

/** 单位数字计算类型 */
export type UnitNumberComputeType = "+" | "-" | "*" | "/";

/** 单位数字 */
export class UnitNumber {
    /** 输出debug信息 */
    private static debugLog(...str: any[]) { console.error("【UnitNumber】", ...str); }

    /** 单位字符串列表 */
    private static get unitStrList() { return ["", "k", "m", "g", "b", "t", "aa", "ab", "ac", "ad", "ae", "af", "ba", "bb", "bc", "bd", "be", "bf", "ca", "cb", "cc", "cd", "ce", "cf", "da", "db", "dc", "dd", "de", "df", "ea", "eb", "ec", "ed", "ee", "ef", "fa", "fb", "fc", "fd", "fe", "ff"]; }

    /** 单位进位比例 */
    private static readonly unitCarry = 1000;

    /** 单位进位比例列表 */
    private static readonly unitCarryList: BigNumber[] = UnitNumber.unitStrList.map((v, i) => new BigNumber(UnitNumber.unitCarry).pow(i));

    /** 小数位长度限制 */
    private static readonly defaultDecimalsLen = 2;

    /** 默认值 */
    private static readonly defaultNumber = 0;

    /** 单位数字字符串正则 */
    public static unitNumberStrRegExp = new RegExp(`^([\\+\\-]?\\d+(\\.\\d+)?(e[\\+\\-]?\\d+)?)(${UnitNumber.unitStrList.join("|").replace(" ", "")})?$`, "i");

    /** 单位字符串正则 */
    private static unitStrRegExp = new RegExp(`(${UnitNumber.unitStrList.join("|").replace(" ", "")})?$`, "i");

    /**
     * 获取单位字符倍率
     * @param unitStr 单位字符串
     */
    private static getUnitStrMultiple(unitStr: string): BigNumber {
        let unitIndex = UnitNumber.unitStrList.indexOf(unitStr.toLowerCase());
        if (unitIndex == -1) {
            UnitNumber.debugLog("Current Error By UnitNumber.getUnitStrMultiple", "单位异常,按最小单位处理", unitStr);
            unitIndex = 0;

        }
        return UnitNumber.unitCarryList[unitIndex];
    }

    /** 
     * 清理单位字符串单位
     * @param targetVal 目标值
     */
    private static clearUnitStr(targetVal: string): string {
        return targetVal.replace(UnitNumber.unitStrRegExp, "");
    }

    /**
     * 获取数据单位
     * @param targetVal 字符串
     */
    private static getUnitStr(targetVal: UnitNumberInputType): string {

        let val = "";

        if (!UnitNumber.checkUnitNumber(targetVal)) UnitNumber.debugLog("Last Error By UnitNumber.getUnitStr", "验证字符串失败，使用最小单位");
        else if (typeof targetVal == "number") val = targetVal.toString();
        else if (targetVal instanceof UnitNumber) val = targetVal._number.toFixed();
        else if (BigNumber.isBigNumber(targetVal)) val = targetVal.toFixed();
        else val = targetVal;

        /** 单位字符 */
        let unitStr = val.match(UnitNumber.unitStrRegExp)[0];

        if (unitStr) val = unitStr
        else {
            const absBigNumber = new BigNumber(val).abs();
            let whileCount = 0;
            while (whileCount < UnitNumber.unitCarryList.length) {
                let min = UnitNumber.unitCarryList[whileCount];
                if (min.eq(1)) min = new BigNumber(0);
                const max = UnitNumber.unitCarryList[whileCount + 1];
                if (!max || (absBigNumber.gte(min) && absBigNumber.lt(max))) {
                    val = UnitNumber.unitStrList[whileCount];
                    whileCount = UnitNumber.unitCarryList.length;
                }

                whileCount += 1;
            }

        }

        return val;
    }

    /** 
     * 获取单位索引
     * @param targetVal 目标值
     */
    private static getUnitStrIndex(targetVal: UnitNumberInputType): number {
        let result: number = UnitNumber.unitStrList.indexOf(targetVal as string);

        if (result == -1) {
            if (typeof targetVal == "string" && !UnitNumber.checkUnitNumber(targetVal)) {
                UnitNumber.debugLog("Last Error By UnitNumber.getUnitStrIndex", "非正常单位数字，返回最小单位");
                result = 0;

            } else {
                // 无法直接获取单位索引，尝试转换为单位进行获取
                const unitStr = UnitNumber.getUnitStr(targetVal);
                result = UnitNumber.unitStrList.indexOf(unitStr);

            }
        }

        return result;
    }

    /** 
     * 截取为指定小数的字符串
     * @param targetVal 目标值
     * @param decimalsLen 分数部分长度 默认：UnitNumber.decimalsStrLenLimit
     * @description decimalsLen => UnitNumber.decimalsStrLenLimit 显示配置的小数位数,不足补0
     * @description decimalsLen => [2,-1] 至少显示2两位小数,不足补0
     * @description decimalsLen => [-1,2] 最多显示2两位小数
     */
    private static cutDecimalsStr(targetVal: UnitNumberInputType, decimalsLen: UnitNumberCutDecimalsLenType = UnitNumber.defaultDecimalsLen): string {
        if (!UnitNumber.checkUnitNumber(targetVal)) {
            UnitNumber.debugLog("Last Error By UnitNumber.cutDecimalsStr", "异常值，使用默认值", `Val=${typeof targetVal} ${targetVal} defaultVal=${UnitNumber.defaultNumber}`);
            targetVal = UnitNumber.defaultNumber;

        }

        const targetValArr = UnitNumber.converToLongStr(targetVal).split('.');
        /** 整数部分 */
        const integerStr = targetValArr[0];
        /** 小数部分 */
        let decimalsStr = targetValArr[1] || '0';

        if (Array.isArray(decimalsLen)) {
            const firstNum = decimalsLen[0];
            const lastNum = decimalsLen[1];

            if (firstNum == -1 && lastNum > 0 || firstNum > 0 || lastNum == -1) {

                if (firstNum > 0) {
                    if (decimalsStr.length < firstNum) decimalsStr = UnitNumber.addSuffixZeroToString(decimalsStr, firstNum - decimalsStr.length);
                } else if (lastNum > 0) {
                    decimalsStr = decimalsStr.substr(0, lastNum);
                    decimalsStr = decimalsStr.replace(/0*$/g, ''); // 去掉末尾所有0
                }

            } else {
                UnitNumber.debugLog("Current Error By UnitNumber.cutDecimalsStr", "异常小数长度配置,使用默认长度", `Val=${targetVal} defaultVal=${UnitNumber.defaultDecimalsLen}`);
                decimalsStr = decimalsStr.substr(0, UnitNumber.defaultDecimalsLen);
                if (decimalsStr.length < UnitNumber.defaultDecimalsLen) decimalsStr = UnitNumber.addSuffixZeroToString(decimalsStr, UnitNumber.defaultDecimalsLen - decimalsStr.length);

            }
        } else {
            if (decimalsLen < 0) {
                UnitNumber.debugLog("Current Error By UnitNumber.cutDecimalsStr", "异常小数长度配置,使用默认长度", `Val=${targetVal} defaultVal=${UnitNumber.defaultDecimalsLen}`);
                decimalsStr = decimalsStr.substr(0, UnitNumber.defaultDecimalsLen);
                if (decimalsStr.length < UnitNumber.defaultDecimalsLen) decimalsStr = UnitNumber.addSuffixZeroToString(decimalsStr, UnitNumber.defaultDecimalsLen - decimalsStr.length);

            } else {
                decimalsStr = decimalsStr.substr(0, decimalsLen);
                if (decimalsStr.length < decimalsLen) decimalsStr = UnitNumber.addSuffixZeroToString(decimalsStr, decimalsLen - decimalsStr.length);
            }
        }

        let result: string;
        // 合并
        if (decimalsStr.length > 0) result = integerStr + '.' + decimalsStr;
        else result = integerStr;

        return result;
    }


    /** 
     * 字符开头补0
     * @param val 要补0的字符串
     * @param count 要补0的个数
     */
    private static addPrefixZeroToString(val: string, count: number) {
        if (count <= 0) return val;
        return Array(count + 1).join('0') + val;
    }
    /** 
     * 字符末尾补0
     * @param val 要补0的字符串
     * @param count 要补0的个数
     */
    private static addSuffixZeroToString(val: string, count: number) {
        if (count <= 0) return val;
        return val + Array(count + 1).join('0');
    }


    /**
     * 转换为大数字类型
     * @param targetVal 目标值 
     */
    private static converToBigNumber(targetVal: UnitNumberInputType): BigNumber {
        let val: BigNumber;

        if (typeof targetVal == "number") val = new BigNumber(targetVal);
        else if (targetVal instanceof UnitNumber) val = new BigNumber(targetVal._number);
        else if (BigNumber.isBigNumber(targetVal)) val = new BigNumber(targetVal.toFixed())
        else if (typeof targetVal == "string") {
            if (!UnitNumber.checkUnitNumber(targetVal)) {
                UnitNumber.debugLog("Last Error By UnitNumber.converToBigNumber", "无法转换为大数字类型,使用默认值", `Val=${typeof targetVal} ${targetVal} defaultVal=${UnitNumber.defaultNumber}`);
                val = new BigNumber(UnitNumber.defaultNumber);

            } else val = new BigNumber(UnitNumber.converToLongStr(targetVal));
        } else {
            UnitNumber.debugLog("Currect Error By UnitNumber.converToBigNumber", "类型错误,使用默认值.", `Val=${typeof targetVal} ${targetVal} defaultVal=${UnitNumber.defaultNumber}`);
            val = new BigNumber(UnitNumber.defaultNumber);

        }

        return val;
    }

    /**
     * 转换到长字符串格式
     * @param targetVal 转换值
     * @description 长字符串无单位
     */
    private static converToLongStr(targetVal: UnitNumberInputType): string {
        let val: string;

        if (typeof targetVal == "number") val = new BigNumber(targetVal).toFixed();
        else if (typeof targetVal == "string") {
            if (!UnitNumber.checkUnitNumber(targetVal)) {
                UnitNumber.debugLog("Last Error By UnitNumber.converToLongStr", "无法转换为长字符串格式，使用默认值", `Val=${typeof targetVal} ${targetVal} defaultVal=${UnitNumber.defaultNumber}`);
                val = UnitNumber.defaultNumber.toString();

            } else {
                if (!/\d$/.test(targetVal)) {
                    // 非数字结尾，需要进行单位处理
                    /** 数字单位 */
                    const unitStr = UnitNumber.getUnitStr(targetVal);
                    val = new BigNumber(UnitNumber.clearUnitStr(targetVal))
                        .multipliedBy(UnitNumber.getUnitStrMultiple(unitStr)) // 乘与单位倍率
                        .toFixed();

                } else {
                    val = targetVal;

                }

            }
        } else if (BigNumber.isBigNumber(targetVal)) val = targetVal.toFixed();
        else if (targetVal instanceof UnitNumber) val = targetVal._number.toFixed();
        else {
            UnitNumber.debugLog("Current Error By UnitNumber.converToLongStr", "值类型错误，使用默认值.", `Val=${typeof targetVal} ${targetVal} defaultVal=${UnitNumber.defaultNumber}`);
            val = UnitNumber.defaultNumber.toString();

        }

        return val;
    }


    /** 检查字符串缓存 Map< 缓存字符, [ 调用计时器, 验证状态, 错误消息] > */
    private static checkUnitNumberMap: Map<string, [number, boolean, string]> = new Map();
    /** 缓存上限 */
    private static checkUnitNumberMapLimit: number = 200;
    /** 
     * 检查字符串是否支持单位字符串
     * @param targetVal 目标值
     */
    public static checkUnitNumber(targetVal: UnitNumberInputType): boolean {

        if (typeof targetVal != "string") return true;

        /** 验证状态 */
        let state = false;
        /** 错误消息 */
        let errMsg = "";
        if (UnitNumber.checkUnitNumberMap.has(targetVal)) {
            // 缓存获取
            const cacheVal = UnitNumber.checkUnitNumberMap.get(targetVal);
            state = cacheVal[1];
            errMsg = cacheVal[2];
        } else {

            if (targetVal.length == 0) {
                errMsg = "空字符串";

            } else if (/ /g.test(targetVal)) {
                errMsg = "字符串存在空格";
            } else if (!UnitNumber.unitNumberStrRegExp.test(targetVal)) {
                errMsg = "非正常单位数字格式";

            }
        }

        state = errMsg.length == 0;

        if (errMsg) UnitNumber.debugLog("Current Error By UnitNumber.checkUnitNumber", errMsg, typeof targetVal, targetVal);

        /// 缓存存储
        // 已达到缓存上限,删除一半数据
        if (UnitNumber.checkUnitNumberMap.size >= UnitNumber.checkUnitNumberMapLimit) {
            /** 删除key */
            let removeArr = Array
                .from(UnitNumber.checkUnitNumberMap.entries())
                /** 距当前时间远近排序 */
                .sort((a, b) => a[1][0] < b[1][0] ? -1 : 1);
            const removeLen = Math.floor(UnitNumber.checkUnitNumberMapLimit / 2);
            for (let i = 0; i < removeLen; i++) {
                UnitNumber.checkUnitNumberMap.delete(removeArr[i][0]);
            }
        }
        // 设置/更新缓存
        UnitNumber.checkUnitNumberMap.set(targetVal, [Date.now(), state, errMsg]);

        return state
    }

    /** 
    * 比较
    * @param firstVal 第一个值
    * @param type 比较类型
    * @param lastVal 第二个值
    */
    public static compare(firstVal: UnitNumberInputType, type: UnitNumberCompareType, lastVal: UnitNumberInputType): boolean {
        let result = false;
        firstVal = UnitNumber.converToBigNumber(firstVal);
        lastVal = UnitNumber.converToBigNumber(lastVal);

        switch (type) {
            case "<": {
                result = firstVal.lt(lastVal);
                break;
            }
            case "<=": {
                result = firstVal.lte(lastVal);
                break;
            }
            case "=": {
                result = firstVal.eq(lastVal);
                break
            }
            case ">=": {
                result = firstVal.gte(lastVal);
                break;
            }
            case ">": {
                result = firstVal.gt(lastVal);
                break;
            }
            default: {
                UnitNumber.debugLog("Current Error By UnitNumber.compare", "无法获取正确的比较类型", type)
            }
        }

        return result;
    }

    /** 
     * 计算
     * @param type 计算类型
     * @param targetVals 目标值
     */
    public static compute(type: UnitNumberComputeType, targetVals: UnitNumberInputType[]): UnitNumber {
        let result: UnitNumber;

        if (targetVals.length > 1) {

            result = new UnitNumber();
            switch (type) {
                case "+": {
                    targetVals.forEach(val => result._number = result._number.plus(UnitNumber.converToBigNumber(val)));
                    break;
                }
                case "-": {
                    targetVals.forEach(val => result._number = result._number.minus(UnitNumber.converToBigNumber(val)));
                    break;
                }
                case "*": {
                    targetVals.forEach(val => result._number = result._number.multipliedBy(UnitNumber.converToBigNumber(val)));
                    break;
                }
                case "/": {
                    targetVals.forEach((val, i) => {
                        const bigVal = UnitNumber.converToBigNumber(val);
                        if (i == 0) { // 第一个为被除数
                            result = new UnitNumber(val);
                        } else {
                            if (bigVal.eq(0)) {
                                UnitNumber.debugLog("Current Error By UnitNumber.compare", "0不能做除数,不进行计算。", `在${targetVals} 下标:${i}`);

                            } else result._number = result._number.div(bigVal);

                        }

                    });
                    break;
                }
                default: {
                    UnitNumber.debugLog("Current Error By UnitNumber.compare", "无法获取正确的计算类型", type)

                }
            }

        } else if (targetVals.length > 0) result = new UnitNumber(targetVals[0]);
        else result = new UnitNumber();

        return result;
    }

    constructor(targetVal: UnitNumberInputType = UnitNumber.defaultNumber) {
        this._number = UnitNumber.converToBigNumber(targetVal);
    }

    /** 当前类数值 */
    private _number: BigNumber

    /** 获取数字对象 */
    public get number() {
        return this.clone()._number
    }

    /**
     * 获取值
     * @param decimalsLen 分数部分长度 默认：UnitNumber.decimalsStrLenLimit
     * @param hasUnitStr 是否携带单位字符串 默认：None
     * @param hasUnitStr.None 不携带单位
     * @param hasUnitStr.LowerCase 携带小写单位
     * @param hasUnitStr.UpperCase 携带答谢单位
     * @description decimalsLen => 查看 UnitNumber.cutDecimalsStr 规则
     * 
     */
    public getValue(decimalsLen: UnitNumberCutDecimalsLenType = UnitNumber.defaultDecimalsLen, hasUnitStr: "None" | "LowerCase" | "UpperCase" = "None"): string {
        let val: string;

        /** 单位 */
        const unitStr = UnitNumber.getUnitStr(this);

        /** 单位进位值 */
        let unitCarryNum = UnitNumber.getUnitStrMultiple(unitStr);

        /** 长字符串 */
        const logStr = this._number.div(unitCarryNum).toFixed();

        val = UnitNumber.cutDecimalsStr(logStr, decimalsLen);

        // 单位合并
        if (hasUnitStr == "UpperCase") val += unitStr.toUpperCase();
        else if (hasUnitStr == "LowerCase") val += unitStr.toLowerCase();

        return val;
    }

    // 对比
    /**
     * 是否小于目标
     * @param targetVal 目标
     */
    public lt(targetVal: UnitNumberInputType): boolean {
        return UnitNumber.compare(this, "<", targetVal);
    }
    /**
     * 是否小于等于目标
     * @param targetVal 目标
     */
    public lte(targetVal: UnitNumberInputType): boolean {
        return UnitNumber.compare(this, "<=", targetVal);
    }
    /**
     * 是否等于目标
     * @param targetVal 目标
     */
    public eq(targetVal: UnitNumberInputType): boolean {
        return UnitNumber.compare(this, "=", targetVal);
    }
    /**
     * 是否大于等于目标
     * @param targetVal 目标
     */
    public gte(targetVal: UnitNumberInputType): boolean {
        return UnitNumber.compare(this, ">=", targetVal);
    }
    /**
     * 是否大于目标
     * @param targetVal 目标
     */
    public gt(targetVal: UnitNumberInputType): boolean {
        return UnitNumber.compare(this, ">", targetVal);
    }

    // 加减乘除
    /**
     * 加法操作
     * @param targetVal 目标值
     * @returns 返回的是当前对象本身，并且当前对象值已经是计算后的值
     */
    public plus(targetVal: UnitNumberInputType): UnitNumber {
        this._number = this.compute("+", targetVal)._number;
        return this;
    }
    /**
     * 减法操作
     * @param targetVal 目标值
     * @returns 返回的是当前对象本身，并且当前对象值已经是计算后的值
     */
    public minus(targetVal: UnitNumberInputType) {
        this._number = this.compute("-", targetVal)._number;
        return this;
    }
    /**
     * 乘法操作
     * @param targetVal 目标值
     * @returns 返回的是当前对象本身，并且当前对象值已经是计算后的值
     */
    public multiply(targetVal: UnitNumberInputType) {
        this._number = this.compute("*", targetVal)._number;
        return this;
    }
    /**
     * 加除法操作
     * @param targetVal 目标值
     * @returns 返回的是当前对象本身，并且当前对象值已经是计算后的值
     */
    public div(targetVal: UnitNumberInputType) {
        this._number = this.compute("/", targetVal)._number;
        return this;
    }

    // eval
    /**
     * 比较
     * @param type 比较类型
     * @param targetVal 目标值
     */
    public compare(type: UnitNumberCompareType, targetVal: UnitNumberInputType): boolean {
        return UnitNumber.compare(this, type, targetVal);
    }

    /** 
     * 计算
     * @param type 计算类型
     * @param targetVals 目标值
     * @returns 返回的是当前对象本身，并且当前对象值已经是计算后的值
     */
    public compute(type: UnitNumberComputeType, targetVals: UnitNumberInputType | UnitNumberInputType[]): UnitNumber {

        this._number = UnitNumber.compute(type, Array.isArray(targetVals) ? targetVals : [targetVals])._number;

        return this;
    }

    /** 克隆 */
    public clone() {
        return new UnitNumber(this)
    }
}