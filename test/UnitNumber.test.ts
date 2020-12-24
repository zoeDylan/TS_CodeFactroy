import { UnitNumber } from "../src/UnitNumber";

describe("#UnitNumber.ts", function () {
    describe("#new UnitNumber", () => {
        ;[
            100, "100", "0.1K", "0.0001M", "0.0000001G",
            -100, "-100", "-0.1K", "-0.0001M", "-0.0000001G",
            1e2, "1e2",
            -1e2, "-1e2",
            1e+2, "1e+2",
            -1e+2, "-1e+2",
            10000e-2, "10000e-2",
            -10000e-2, "-10000e-2",
            +1e+2, "+1e+2",
            -1e+2, "-1e+2",
        ].forEach(v => {
            var a = new UnitNumber(v);
            const target = a.lt(0) ? "-100" : "100";
            it(`new UnitNumber( ${typeof v} ${v} ) => ${a.number.toFixed()} == ${target}`, done => {
                if (a.number.toFixed() == target) done();
                else done(`${typeof v} ${v} 无法转换`);
            })
        })
    });
    describe("#UnitNumber.checkUnitNumber", () => {
        ;[
            100, "100", "0.1K", "0.0001M", "0.0000001G",
            -100, "-100", "-0.1K", "-0.0001M", "-0.0000001G",
            1e2, "1e2",
            -1e2, "-1e2",
            1e+2, "1e+2",
            -1e+2, "-1e+2",
            10000e-2, "10000e-2",
            -10000e-2, "-10000e-2",
            +1e+2, "+1e+2",
            -1e+2, "-1e+2",
            .1,
            +.1,
            -.1
        ].forEach(v => {
            var a = UnitNumber.checkUnitNumber(v)
            it(`UnitNumber.checkUnitNumber( ${typeof v} ${v} ) => ${a}`, done => {
                if (a) done();
                else done(` ${typeof v} ${v} 无法验证`);
            })
        })
    });

    describe("#UnitNumber.min", () => {
        ;[
            [[100, 200, 300], 100],
            [['1k', '1m', '1g'], '1k']
        ].forEach(v => {
            var val = UnitNumber.min(...(v[0] as Array<any>).map(vv => new UnitNumber(vv)));
            it(`UnitNumber.min( ${(v[0] as Array<any>).join()} ) => ${v[1]}`, done => {
                if (val.eq(v[1] as any)) done()
                else done('获取最小值错误')
            });
        })
    });

    describe("#UnitNumber.max", () => {
        ;[
            [[100, 200, 300], 300],
            [['1k', '1m', '1g'], '1g']
        ].forEach(v => {
            var val = UnitNumber.max(...(v[0] as Array<any>).map(vv => new UnitNumber(vv)));
            it(`UnitNumber.max( ${(v[0] as Array<any>).join()} ) => ${v[1]}`, done => {
                if (val.eq(v[1] as any)) done()
                else done('获取最大值错误')
            });
        })
    });
})