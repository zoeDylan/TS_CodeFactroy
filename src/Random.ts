/**
 * 获取范围内随机值(整数)
 * @param max 最大值
 * @description 从0开始到指定值
 */
export function randomInt(max: number): number
/**
 * 获取范围内随机值(整数)
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

/** 获取 0 - 1 的随机小数 */
export function randomFloat(): number
/** 
 * 获取 0 - max 的随机小数
 * @param max 最大值
 */
export function randomFloat(max: number): number
/** 
 * 获取 min - max 的随机小数
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
