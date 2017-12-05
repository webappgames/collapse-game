import AbstractTouchController from './AbstractTouchController';

export default class TouchController extends AbstractTouchController {


    constructor(element: HTMLElement, handleMouse = true) {
        super(element);
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

    private _handleTouchStart(event: TouchEvent) {
        event.preventDefault();
        const touches = event.changedTouches;
        for (let i = 0, l = touches.length; i < l; i++) {
            this.touchStart({
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
            this.touchMove('touch' + touches[i].identifier, touches[i]);
        }
    }

    private _handleTouchEnd(callSubscribers: boolean, event: TouchEvent) {
        event.preventDefault();
        const touches = event.changedTouches;
        for (let i = 0, l = touches.length; i < l; i++) {
            this.touchEnd('touch' + touches[i].identifier, callSubscribers);
        }
    }



    private _handleMouseDown(event: MouseEvent) {
        event.preventDefault();
        this.touchStart({
            id: 'mouse',//todo mouse button
            type: 'MOUSE',
            start: performance.now(),//new Date,
            //element: this.element,
            points: []
        });

    }

    private _handleMouseMove(event: MouseEvent) {
        event.preventDefault();
        //todo mouse button
        this.touchMove('mouse', event);
    }


    private _handleMouseUp(callSubscribers: boolean, event: MouseEvent) {
        event.preventDefault();
        this.touchEnd('mouse', callSubscribers);
    }


}