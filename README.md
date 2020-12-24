# TS_CodeFactroy
TS代码工厂，封装一些开发中用到的代码。

# 目录

+ `TS_CodeFactroy`
    + `Random.ts` 随机处理
        + [`randomString` 随机字符串](./doc/Random.ts.md#randomString)
        + [`E_randomStringReferType` 随机字符串参照类型](./doc/Random.ts.md#E_randomStringReferType)
        + [`randomArrayByArray` 根据传入数组随机获取指定长度数组](./doc/Random.ts.md#randomArrayByArray)
        + [`randomArraySort` 随机数组排序/数组乱序](./doc/Random.ts.md#randomArraySort)
        + [`randomBoolean` 随机布尔值](./doc/Random.ts.md#randomBoolean)
        + [`randomFloat` 随机浮点数](./doc/Random.ts.md#randomFloat)
        + [`randomInt` 随机整数](./doc/Random.ts.md#randomInt)
    + `UnitNumber.ts` 单位数字,1K/1M/1B
        + [`UnitNumber.addPrefixZeroToString` 在字符串开头补0](./doc/UnitNumber.ts.md#addPrefixZeroToString)
        + [`UnitNumber.addSuffixZeroToString` 在字符串末尾补0](./doc/UnitNumber.ts.md#addSuffixZeroToString)
        + [`UnitNumber.checkUnitNumber` 检查传入值是否是单位数字](./doc/UnitNumber.ts.md#checkUnitNumber)
        + [`UnitNumber.clearUnitStr` 清理单位字符串单位](./doc/UnitNumber.ts.md#clearUnitStr)
        + [`UnitNumber.clone` 克隆单位字符](./doc/UnitNumber.ts.md#clone)
        + [`UnitNumber.compare` 对传入值进行比较](./doc/UnitNumber.ts.md#compare)
        + [`UnitNumber.compute` 对传入值进行计算](./doc/UnitNumber.ts.md#compute)
        + [`UnitNumber.converToBigNumber` 将传入值转换为大数字类型](./doc/UnitNumber.ts.md#converToBigNumber)
        + [`UnitNumber.converToLongStr` 将传入值转换到长字符串格式](./doc/UnitNumber.ts.md#converToLongStr)
        + [`UnitNumber.cutDecimalsStr` 将传入值截取为指定小数的字符串](./doc/UnitNumber.ts.md#cutDecimalsStr)
        + [`UnitNumber.debugLog` 打印专有Debug信息](./doc/UnitNumber.ts.md#debugLog)
        + [`UnitNumber.getUnitStr` 获取单位数字单位](./doc/UnitNumber.ts.md#getUnitStr)
        + [`UnitNumber.getUnitStrIndex` 获取单位数字的单位索引](./doc/UnitNumber.ts.md#getUnitStrIndex)
        + [`UnitNumber.getUnitStrMultiple` 获取单位字符倍率](./doc/UnitNumber.ts.md#getUnitStrMultiple)
        + [`const unitNumber = new UnitNumber( targetValue )`](./doc/UnitNumber.ts.md#constructor)
            + [`unitNumber.number` 获取bigNumber值](./doc/UnitNumber.ts.md#unitNumber.number)
            + [`unitNumber.getValue` 获取值](./doc/UnitNumber.ts.md#unitNumber.number)
            + [`unitNumber.clone` 克隆单位字符](./doc/UnitNumber.ts.md#unitNumber.number)
            + 比较
            + [`unitNumber.compare` 对传入值进行比较](./doc/UnitNumber.ts.md#unitNumber.number)
            + [`unitNumber.lt` 是否小于目标](./doc/UnitNumber.ts.md#unitNumber.number)
            + [`unitNumber.lte` 是否小于等于目标](./doc/UnitNumber.ts.md#unitNumber.number)
            + [`unitNumber.eq` 是否等于目标](./doc/UnitNumber.ts.md#unitNumber.number)
            + [`unitNumber.gt` 是否大于等于目标](./doc/UnitNumber.ts.md#unitNumber.number)
            + [`unitNumber.gte` 是否大于目标](./doc/UnitNumber.ts.md#unitNumber.number)

            + 计算
            + [`unitNumber.compute` 对传入值进行计算](./doc/UnitNumber.ts.md#unitNumber.number)
            + [`unitNumber.plus` 进行加法操作](./doc/UnitNumber.ts.md#unitNumber.number)
            + [`unitNumber.minus` 进行加法操作](./doc/UnitNumber.ts.md#unitNumber.number)
            + [`unitNumber.multiply` 进行乘法操作](./doc/UnitNumber.ts.md#unitNumber.number)
            + [`unitNumber.div` 进行除法操作](./doc/UnitNumber.ts.md#unitNumber.number)
