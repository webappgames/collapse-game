import Vector2 from './Vector2';

export default class TimeVector2 extends Vector2 {
    constructor(x: number,
                y: number,
                public t: number) {
        super(x, y);
    }

    static Zero() {
        return new TimeVector2(0, 0, 0);
    }

}