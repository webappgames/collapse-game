import TimeVector2 from './TimeVector2';

export interface ITouch {
    id: string;
    type: 'TOUCH' | 'MOUSE';
    start: number;//todo Date
    //maybe todo element: HTMLElement;
    //finished: boolean;
    points: TimeVector2[];
}

//class Touch


export default class TouchController {


    public ongoingTouches: ITouch[] = [];

    constructor(public element: HTMLElement) {
    }


    private _subscribers: ((touch: ITouch) => void)[] = [];

    subscribe(subscriber: ((touch: ITouch) => void)) {
        this._subscribers.push(subscriber);
    }

    //todo unsubscribe


    touchStart(touch: ITouch) {
        this.ongoingTouches.push(touch);
    }

    touchMove(id: string, event: { clientX: number, clientY: number }) {
        const index = this._ongoingTouchIndexById(id);
        if (index !== -1) {
            //console.log("continuing touch " + index);

            this.ongoingTouches[index].points.push(new TimeVector2(
                event.clientX / this.element.clientWidth,
                event.clientY / this.element.clientHeight,
                performance.now()
            ));

            //ongoingTouches.splice(index, 1, copyTouch(touches[i])); // swap in the new touch record
        } else {
            console.log("can't figure out which touch to continue");
        }
    }

    touchEnd(id: string, callSubscribers: boolean) {
        const index = this._ongoingTouchIndexById(id);
        if (index !== -1) {
            if (callSubscribers) {
                this._subscribers.forEach((subscriber) => subscriber(this.ongoingTouches[index]));
            }
            this.ongoingTouches.splice(index, 1);
        } else {
            console.log("can't figure out which touch to end");
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

}