import * as BABYLON from 'babylonjs';
//import {Vector2} from 'gridbuilding';
import TouchController from './TouchController';
import {ITouch, ITouchPoint} from './TouchController';
import Player from './index';
import Brick from '../../world/Brick';

/*
function groupArray<T>(array: T[], inGroup: number): T[][] {

    //todo test inGroup

    const l = array.length - inGroup + 1;
    //if(l<1)return [];

    const result = []
    for (let i = 0; i < l; i++) {
        const group = []
        for (let j = 0; j < inGroup; j++) {
            group.push(array[i + j]);
        }
        result.push(group);
    }

    return result;

}*/


function throwBrick(player: Player, path: ITouchPoint[]) {

    //const x = (event.clientX / document.documentElement.clientWidth)-.5;
    //const y = (event.clientY / document.documentElement.clientHeight)-.5;


    /*const length = groupArray(path, 2).reduce(

        (sum:number, currentValue:ITouchPoint[]) => sum + Math.sqrt(Math.pow(currentValue[0].,2)+Math.pow(,2))

        , 0);*/
    //const delta = path[path.length - 1].subtract(path[0]);

    //console.log(length);

    const length = 2;
    const delta = {x: 0, y: 0};


    new Brick(
        player.world,
        'clay-bricks',
        {mass: 5000, restitution: 0.5},
        new BABYLON.Vector3(2, 2, 2),
        player.mesh.position.add(player.direction1),
        BABYLON.Vector3.Zero(),
        player.direction1.scale(length * 100).add(new BABYLON.Vector3(
            100 * delta.x,
            100 * -delta.y,
            0
        )),
        new BABYLON.Vector3(
            (Math.random() - .5) * Math.PI * 10,
            (Math.random() - .5) * Math.PI * 10,
            (Math.random() - .5) * Math.PI * 10
        )
    );
}


export default function setPlayerAction(player: Player) {


    const touchController = new TouchController(player.world.canvasElement);
    touchController.subscribe((touch: ITouch) => throwBrick(player, touch.points));


    /*let pointerDown: boolean = false;
    let path: Vector2[];


    player.world.canvasElement.addEventListener(
        "pointerdown",
        (event) => {

            pointerDown = true;
            path = [];
            //todo duplicite
            path.push(new Vector2(
                event.clientX / document.documentElement.clientWidth,
                event.clientY / document.documentElement.clientHeight
            ));


        });


    player.world.canvasElement.addEventListener(
        "pointermove",
        (event) => {
            if (pointerDown) {
                path.push(new Vector2(
                    event.clientX / document.documentElement.clientWidth,
                    event.clientY / document.documentElement.clientHeight
                ));
            }
        });


    player.world.canvasElement.addEventListener(
        "pointerup",
        (event) => {
            throwBrick(player,path);
        });
    */

}