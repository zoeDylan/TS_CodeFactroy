import { UnitNumber } from "../src/UnitNumber";

describe("#UnitNumber.ts", function () {
    describe("#new UnitNumber()", () => {
        const numberArrr = [
            "1", "-1", "+1",
            1, -1, +1,

            ".1", "0.1", "+0.1", "-0.1",
            .1, 0.1, +0.1, -0.1,

            "1e1", "+1e1", "-1e1",
            1e1, +1e1, -1e1,

            "1e-1", "+1e-1", "-1e-1",
            1e-1, +1e-1, -1e-1,

            "1e+1", "+1e+1", "-1e+1",
            1e+1, +1e+1, -1e+1,

            "1K", "-1K", "+1K",
            1000, -1000, +1000,

            "1.1K", "-1.1K", "+1.1K",
            1000.1, -1000.1, +1000.1,

            ".1K", "-.1K", "+.1K",
            "0.1K", "-0.1K", "+0.1K",

        ].forEach(v => {
            it(`new UnitNumber( ${typeof v} ${v} )`, deon => {
                var a = new UnitNumber(v);
                console.log(`${v} => ${a.number.toFixed()}`);
                deon();
            })
        })
    });
})