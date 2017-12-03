//import {Vector2} from 'gridbuilding';


export interface ITouch {
    id: string;
    //finished: boolean;
    points: ITouchPoint[];
}

export interface ITouchPoint {
    x: number;
    y: number;
    t: number;
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

                this.ongoingTouches[index].points.push({
                    x: touches[i].clientX,
                    y: touches[i].clientY,
                    t: performance.now()
                });

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
            points: []
        });

    }

    private _handleMouseMove(event: MouseEvent) {
        event.preventDefault();

        //todo DRY
        const index = this._ongoingTouchIndexById('mouse');
        if (index !== -1) {

            this.ongoingTouches[index].points.push({
                x: event.clientX,
                y: event.clientY,
                t: performance.now()
            });

            //ongoingTouches.splice(index, 1, copyTouch(touches[i])); // swap in the new touch record
        } else {
            console.log("can't figure out which touch to continue");
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