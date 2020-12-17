import { randomFloat, randomInt } from "../src/Random"

describe("#Random.ts", function () {

    describe("#randomFloat()", function () {

        it("#randomFloat()", done => {
            const min = 0;
            const max = 1;
            let errValue = [];
            for (let i = 0; i < 1000; i++) {
                let num = randomFloat();
                if (num > max || num < min || Number.isNaN(num)) errValue.push(num);
            }

            if (errValue.length > 0) done(`异常数据 => [${errValue.join()}]`);
            else done();
        });

        it("#randomFloat( max = 100 )", done => {
            const min = 0;
            const max = 100;
            let errValue = [];
            for (let i = 0; i < 1000; i++) {
                let num = randomFloat(max);
                if (num > max || num < min || Number.isNaN(num)) errValue.push(num);
            }

            if (errValue.length > 0) done(`异常数据 => [${errValue.join()}]`);
            else done();
        });

        it("#randomFloat( max = -100 )", done => {
            const min = 0;
            const max = -100;
            let errValue = [];
            for (let i = 0; i < 1000; i++) {
                let num = randomFloat(max);
                if (num > min || num < max || Number.isNaN(num)) errValue.push(num);
            }

            if (errValue.length > 0) done(`异常数据 => [${errValue.join()}]`);
            else done();
        });

        it("#randomFloat( min = 100, max = 500 )", done => {
            const min = 100;
            const max = 500;
            let errValue = [];
            for (let i = 0; i < 1000; i++) {
                let num = randomFloat(min, max);
                if (num > max || num < min || Number.isNaN(num)) errValue.push(num);
            }
            if (errValue.length > 0) done(`异常数据 => [${errValue.join()}]`);
            else done();
        });

        it("#randomFloat( min = 500, max = 100 )", done => {
            const min = 500;
            const max = 100;
            let errValue = [];
            for (let i = 0; i < 1000; i++) {
                let num = randomFloat(min, max);
                if (num > min || num < max || Number.isNaN(num)) errValue.push(num);
            }
            if (errValue.length > 0) done(`异常数据 => [${errValue.join()}]`);
            else done();
        });
    })


    describe("#randomInt()", function () {
 
        it("#randomInt( max = 100 )", done => {
            const min = 0;
            const max = 100;
            let errValue = [];
            for (let i = 0; i < 1000; i++) {
                let num = randomInt(max);
                if (num > max || num < min || Number.isNaN(num)) errValue.push(num);
            }

            if (errValue.length > 0) done(`异常数据 => [${errValue.join()}]`);
            else done();
        });

        it("#randomInt( max = -100 )", done => {
            const min = 0;
            const max = -100;
            let errValue = [];
            for (let i = 0; i < 1000; i++) {
                let num = randomInt(max);
                if (num > min || num < max || Number.isNaN(num)) errValue.push(num);
            }

            if (errValue.length > 0) done(`异常数据 => [${errValue.join()}]`);
            else done();
        });

        it("#randomInt( min = 100, max = 500 )", done => {
            const min = 100;
            const max = 500;
            let errValue = [];
            for (let i = 0; i < 1000; i++) {
                let num = randomInt(min, max);
                if (num > max || num < min || Number.isNaN(num)) errValue.push(num);
            }
            if (errValue.length > 0) done(`异常数据 => [${errValue.join()}]`);
            else done();
        });

        it("#randomInt( min = 500, max = 100 )", done => {
            const min = 500;
            const max = 100;
            let errValue = [];
            for (let i = 0; i < 1000; i++) {
                let num = randomInt(min, max);
                if (num > min || num < max || Number.isNaN(num)) errValue.push(num);
            }
            if (errValue.length > 0) done(`异常数据 => [${errValue.join()}]`);
            else done();
        });
    })
})