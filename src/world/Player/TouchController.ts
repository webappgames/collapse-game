//import {Vector2} from 'gridbuilding';


export class Vector2 {
    constructor(public x: number,
                public y: number) {
    }

    static Zero() {
        return new Vector2(0, 0);
    }

    add(vector3: Vector2): Vector2 {
        return new Vector2(
            this.x + vector3.x,
            this.y + vector3.y
        );
    }

    subtract(vector3: Vector2): Vector2 {
        return new Vector2(
            this.x - vector3.x,
            this.y - vector3.y
        );
    }

    scale(scale: number): Vector2 {
        return new Vector2(
            this.x * scale,
            this.y * scale
        );
    }

    length(vector2: Vector2 = Vector2.Zero()): number {
        return Math.sqrt(
            Math.pow(this.x - vector2.x, 2) +
            Math.pow(this.y - vector2.y, 2)
        )
    }

    toArray(): [number, number] {
        return [this.x, this.y];
    }
}


export class TimeVector2 extends Vector2 {
    constructor(x: number,
                y: number,
                public t: number) {
        super(x, y);
    }

    static Zero() {
        return new TimeVector2(0, 0, 0);
    }

}


export interface ITouch {
    id: string;
    type: 'TOUCH' | 'MOUSE';
    start: number;//todo Date
    //maybe todo element: HTMLElement;
    //finished: boolean;
    points: TimeVector2[];
}


export default class TouchController {


    public ongoingTouches: ITouch[] = [];

    /*static copyTouch(touch:) {
        return {identifier: touch.identifier,clientX: touch.clientX,clientY: touch.clientY};
    }*/


    constructor(public element: HTMLElement, handleMouse = true) {
        element.addEventListener("touchstart", (event) => this._handleTouchStart(event), false);
        element.addEventListener("touchend", (event) => this._handleTouchEnd(true, event), false);
        element.addEventListener("touchcancel", (event) => this._handleTouchEnd(false, event), false);
        //todo element.addEventListener("touchleave", (event)=>this._handleTouchEnd(true,event), false);
        element.addEventListener("touchmove", (event) => this._handleTouchMove(event), false);


        if (handleMouse) {
            element.addEventListener("mousedown", (event) => this._handleMouseDown(event), false);
            element.addEventListener("mousemove", (event) => this._handleMouseMove(event), false);
            element.addEventListener("mouseup", (event) => this._handleMouseUp(true, event), false);
        }

    }


    private _subscribers: ((touch: ITouch) => void)[] = [];

    subscribe(subscriber: ((touch: ITouch) => void)) {
        this._subscribers.push(subscriber);
    }

    //todo unsubscribe


    private _handleTouchStart(event: TouchEvent) {
        event.preventDefault();
        const touches = event.changedTouches;
        for (let i = 0, l = touches.length; i < l; i++) {
            this.ongoingTouches.push({
                id: 'touch' + touches[i].identifier,
                type: 'TOUCH',
                start: performance.now(),//new Date,
                //element: this.element,
                points: []
            });
        }
    }


    private _handleTouchMove(event: TouchEvent) {
        event.preventDefault();
        const touches = event.changedTouches;
        for (let i = 0, l = touches.length; i < l; i++) {
            const index = this._ongoingTouchIndexById('touch' + touches[i].identifier);
            if (index !== -1) {
                //console.log("continuing touch " + index);

                this.ongoingTouches[index].points.push(new TimeVector2(
                    touches[i].clientX / this.element.clientWidth,
                    touches[i].clientY / this.element.clientHeight,
                    performance.now()
                ));

                //ongoingTouches.splice(index, 1, copyTouch(touches[i])); // swap in the new touch record
            } else {
                console.log("can't figure out which touch to continue");
            }
        }
    }

    private _handleTouchEnd(callSubscribers: boolean, event: TouchEvent) {
        event.preventDefault();
        const touches = event.changedTouches;
        for (let i = 0, l = touches.length; i < l; i++) {
            const index = this._ongoingTouchIndexById('touch' + touches[i].identifier);
            if (index !== -1) {
                if (callSubscribers) {
                    this._subscribers.forEach((subscriber) => subscriber(this.ongoingTouches[index]));
                }
                this.ongoingTouches.splice(index, 1);
            } else {
                console.log("can't figure out which touch to end");
            }
        }
    }


    private _ongoingTouchIndexById(idToFind: string): number {
        for (let i = 0; i < this.ongoingTouches.length; i++) {
            const id = this.ongoingTouches[i].id;

            if (id === idToFind) {
                return i;
            }
        }
        return -1; // not found
    }


    private _handleMouseDown(event: MouseEvent) {
        event.preventDefault();

        //todo DRY
        this.ongoingTouches.push({
            id: 'mouse',//todo mouse button
            type: 'MOUSE',
            start: performance.now(),//new Date,
            //element: this.element,
            points: []
        });

    }

    private _handleMouseMove(event: MouseEvent) {
        event.preventDefault();

        //todo DRY
        const index = this._ongoingTouchIndexById('mouse');
        if (index !== -1) {

            this.ongoingTouches[index].points.push(new TimeVector2(
                event.clientX / this.element.clientWidth,
                event.clientY / this.element.clientHeight,
                performance.now() - this.ongoingTouches[index].start
            ));

            //ongoingTouches.splice(index, 1, copyTouch(touches[i])); // swap in the new touch record
        } else {
            //console.log("can't figure out which touch to continue");
        }

    }


    private _handleMouseUp(callSubscribers: boolean, event: MouseEvent) {
        event.preventDefault();

        //todo DRY
        const index = this._ongoingTouchIndexById('mouse');
        if (index !== -1) {
            if (callSubscribers) {
                this._subscribers.forEach((subscriber) => subscriber(this.ongoingTouches[index]));
            }
            this.ongoingTouches.splice(index, 1);
        } else {
            console.log("can't figure out which touch to end");
        }
    }


}