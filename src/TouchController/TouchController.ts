import AbstractTouchController from './AbstractTouchController';
import Touch from './Touch';

export default class TouchController extends AbstractTouchController {


    constructor(element: HTMLElement, handleMouse = true, preventContextMenu = true) {
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

        if (preventContextMenu) {
            element.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                event.stopPropagation();
            }, false);
        }

    }

    private _handleTouchStart(event: TouchEvent) {
        event.preventDefault();
        const touches = event.changedTouches;
        for (let i = 0, l = touches.length; i < l; i++) {
            this.touchStart(new Touch(
                'touch' + touches[i].identifier,
                'TOUCH'
            ));
        }
    }

    private _handleTouchMove(event: TouchEvent) {
        event.preventDefault();
        const touches = event.changedTouches;
        for (let i = 0, l = touches.length; i < l; i++) {
            this.touchMove('touch' + touches[i].identifier, false, touches[i]);
        }
    }

    private _handleTouchEnd(callSubscribers: boolean, event: TouchEvent) {
        event.preventDefault();
        const touches = event.changedTouches;
        for (let i = 0, l = touches.length; i < l; i++) {
            this.touchMove('touch' + touches[i].identifier, callSubscribers, touches[i]);
        }
    }


    private _handleMouseDown(event: MouseEvent) {
        event.preventDefault();
        this.touchStart(new Touch(
            'mouse' + event.button,
            'MOUSE'
        ));
    }

    private _handleMouseMove(event: MouseEvent) {
        event.preventDefault();
        this.touchMove('mouse' + event.button, false, event);
    }


    private _handleMouseUp(callSubscribers: boolean, event: MouseEvent) {
        event.preventDefault();
        this.touchMove('mouse' + event.button, callSubscribers, event);
    }


}