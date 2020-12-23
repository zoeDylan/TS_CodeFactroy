/** 
 * 根据传入数组随机获取指定长度数组
 * @param baseArray 随机的目标数组
 * @param len 
 * @description 长度不够只会获取最多个数的数组
 */
export function randomArrayByArray<T = any>(baseArray: T[], len: number): T[] {
    /** 目标数组 */
    const targetArray = baseArray.concat();
    const result = [];
    while (len > 0 && targetArray.length > 0) {
        len -= 1;
        const randomIndex = randomInt(0, targetArray.length - 1);
        result.push(targetArray[randomIndex]);
        targetArray.splice(randomIndex, 1);
    }

    return result;
}
/** 数组随机排序 */
export function randomArraySort<T = any>(array: T[]): T[] {
    for (let i = 1; i < array.length + 1; i++) {
        let randomIndex = randomInt(0, array.length - i);
        //数据交换
        [array[randomIndex], array[array.length - i]] = [array[array.length - i], array[randomIndex]];
    }
    return array;
}
/** 随机布尔值 */
export function randomBoolean(): boolean { return Math.random() > .5 }


/** 随机字符串参照类型 */
export enum E_randomStringReferType {
    /** 所有字母/符号 */
    All,

    /** 数字 */
    Number,
    /** 所有字母 */
    Letter,
    /** 符号 */
    Symbol,

    /** 大写字母 */
    UpperLetter,
    /** 小写字母 */
    LowerLetter,
}



/** 基础参照字符串 */
const _randomString_referBase = {
    [E_randomStringReferType.Number]: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
    [E_randomStringReferType.UpperLetter]: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
    [E_randomStringReferType.LowerLetter]: [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122],
    [E_randomStringReferType.Symbol]: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126],
};

/** 
 * 随机字符串
 * @param len 字符串长度
 * @param referStr 参考字符串/类型,传入字符串表示使用字符串随机，传入类型使用定义类型的数据随机,默认：全部类型
 * @param excludeStr 排除字符,可以是字符串或者十进制的Ascii码
 */
export function randomString(len = 1, referStr: string | E_randomStringReferType | E_randomStringReferType[] = E_randomStringReferType.All, excludeStr: string | number[] = ""): string {
    // 可用的字符串
    let useCharCodeArr: number[] = [];

    if (typeof referStr == "string") useCharCodeArr = referStr.split("").map(v => v.charCodeAt(0));
    else {
        if (!Array.isArray(referStr)) referStr = [referStr];

        if (referStr.includes(E_randomStringReferType.All)) referStr = [E_randomStringReferType.All];
        if (referStr.length > 1) referStr = Array.from(new Set(referStr)); // 去重

        referStr.forEach(type => {
            switch (type) {
                case E_randomStringReferType.All: {

                    useCharCodeArr.push(..._randomString_referBase[E_randomStringReferType.Number].concat()); // 数字
                    useCharCodeArr.push(...randomArrayByArray(_randomString_referBase[E_randomStringReferType.UpperLetter].concat(), 10)); // 大写字母
                    useCharCodeArr.push(...randomArrayByArray(_randomString_referBase[E_randomStringReferType.LowerLetter].concat(), 10)); // 小写字母
                    useCharCodeArr.push(...randomArrayByArray(_randomString_referBase[E_randomStringReferType.Symbol].concat(), 10)); // 符号

                    break;
                }
                case E_randomStringReferType.Number: {
                    useCharCodeArr = useCharCodeArr.concat(_randomString_referBase[E_randomStringReferType.Number].concat());
                    break;
                }
                case E_randomStringReferType.Letter: {

                    useCharCodeArr.push(...randomArrayByArray(_randomString_referBase[E_randomStringReferType.UpperLetter].concat(), 13)); // 大写字母
                    useCharCodeArr.push(...randomArrayByArray(_randomString_referBase[E_randomStringReferType.LowerLetter].concat(), 13)); // 小写字母

                    break;
                }
                case E_randomStringReferType.UpperLetter: {

                    useCharCodeArr.push(...randomArrayByArray(_randomString_referBase[E_randomStringReferType.UpperLetter].concat(), 10)); // 大写字母

                    break;
                }
                case E_randomStringReferType.LowerLetter: {

                    useCharCodeArr.push(...randomArrayByArray(_randomString_referBase[E_randomStringReferType.LowerLetter].concat(), 10)); // 小写字母

                    break;
                }
                case E_randomStringReferType.Symbol: {

                    useCharCodeArr.push(...randomArrayByArray(_randomString_referBase[E_randomStringReferType.Symbol].concat(), 10)); // 小写字母

                    break;
                }
            }
        })
    }

    // 排除更新
    if (typeof excludeStr == "string") excludeStr = excludeStr.split("").map(v => v.charCodeAt(0))

    // 过滤
    useCharCodeArr = useCharCodeArr.filter(v => !(excludeStr as number[]).includes(v));

    // 乱序
    useCharCodeArr = randomArraySort(useCharCodeArr);

    if (useCharCodeArr.length == 0) {
        console.error("Current Error By randomString", "解析出空字符串，默认返回空字符串");
        return "";
    } else {
        let result = "";
        while (len > 0) {
            len -= 1;
            result += String.fromCharCode(useCharCodeArr[randomInt(0, useCharCodeArr.length)]);
        }
        return result;
    }

}

/** 随机字符串参照类型 */
randomString.E_randomStringReferType = E_randomStringReferType;
/** 获取 0 - 1 区间的随机小数 */
export function randomFloat(): number
/** 
 * 获取 0 - max 区间的随机小数
 * @param max 最大值
 */
export function randomFloat(max: number): number
/** 
 * 获取 min - max 区间的随机小数
 * @param min 最小值
 * @param max 最大值
 */
export function randomFloat(min: number, max: number): number
export function randomFloat(...param: number[]) {
    // 参数处理
    let min = param[0];
    let max = param[1];

    if (typeof min == "undefined" && typeof max == "undefined") {
        min = 0;
        max = 1;
    } else if (typeof max == "undefined") {
        max = min;
        min = 0;
    }

    // 大小处理
    [min, max] = min > max ? [max, min] : [min, max];
    return min + Math.random() * (max - min);
}

/**
 * 获取区间内随机值(整数)
 * @param max 最大值
 * @description 从0开始到指定值
 */
export function randomInt(max: number): number
/**
 * 获取区间内随机值(整数)
 * @param min 最小值
 * @param max 最大值
 */
export function randomInt(min: number, max: number): number
export function randomInt(...param: number[]): number {
    // 参数处理
    let min = param[0];
    let max = param[1];


    if (typeof max == 'undefined') {
        max = min;
        min = 0;
    }

    // 大小处理
    ;[min, max] = min > max ? [max, min] : [min, max];
    return Math.floor(randomFloat(min, max + 1));
}