/**
 * 获取范围内随机值(整数)
 * @param min 最小值
 * @param max 最大值
 * @description 如果不传最大值，将获取 0 到指定的随机整数
 * 
 * @example
 * ```
 * randomInt(0,5); // 0|1|2|3|4|5
 * randomInt(-1,5); // -1|0|1|2|3|4|5
 * ```
 */
export function randomInt(min: number, max?: number) {
    if (typeof max === 'undefined') {
        max = min;
        min = 0;
    }
    // 大小处理
    ;[min, max] = min > max ? [max, min] : [min, max];
    return Math.floor(randomFloat(min, max + 1));
}

/**
 * 获取范围内随机值（小数）
 * @param min 最小值
 * @param max 最大值
 * @example
 * ```
 * randomFloat(0,5); // 0 - 5小数
 * randomFloat(-1,5); // -1 - 5小数
 * ```
 */
export function randomFloat(min: number, max: number) {
    // 大小处理
    [min, max] = min > max ? [max, min] : [min, max];
    return min + Math.random() * (max - min);
}
