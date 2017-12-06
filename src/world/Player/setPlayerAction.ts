import * as BABYLON from 'babylonjs';
//import {Vector2} from 'gridbuilding';
import {TouchController,listeners} from '../../TouchController';
//import {TimeVector2} from './TouchController';
import Player from './index';
import Brick from '../../world/Brick';


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

}
groupArray;


function slowDown(impostor:BABYLON.PhysicsImpostor){
    impostor.setLinearVelocity(new BABYLON.Vector3(0,1.5,0));
}

export default function setPlayerAction(player: Player) {


    //player.world.scene.getPhysicsEngine().setTimeStep(1/100);

    const touchController = new TouchController(player.world.canvasElement);
    touchController.addListener(new listeners.TouchListener());
    touchController.addListener(new listeners.MouseListener(true));
    touchController.subscribe('START',(touch) => {


        //player.world.scene.getPhysicsEngine().setTimeStep(0.000001);


        //console.log(touch);


        //const length = groupArray(touch.points, 2).reduce((sum, currentValue) => sum + currentValue[0].length(currentValue[1]), 0);
        //const delta = touch.points[touch.points.length - 1].subtract(touch.points[0]);


        const brick = new Brick(
            player.world,
            'clay-bricks',
            {mass: 8000, restitution: 0.5},
            new BABYLON.Vector3(2, 2, 2),
            player.mesh.position.add(player.direction1.scale(10)),
            BABYLON.Vector3.Zero(),
            /*player.direction1.scale(length * 100).add(new BABYLON.Vector3(
                100 * delta.x,
                100 * -delta.y,
                0
            )),
            new BABYLON.Vector3(
                (Math.random() - .5) * Math.PI * 10,
                (Math.random() - .5) * Math.PI * 10,
                (Math.random() - .5) * Math.PI * 10
            )*/
        );


        brick.mesh.physicsImpostor.registerBeforePhysicsStep(slowDown);




        touch.subscribe('MOVE',(lastPoint)=>{

            const pickInfo = player.world.scene.pick(lastPoint.x, lastPoint.y , (mesh)=>mesh===player.world.skyboxMesh||mesh===player.world.groundMesh);
            if (pickInfo.hit) {
                brick.linearVelocity = BABYLON.Vector3.Zero();


                    brick.mesh.position = pickInfo.pickedPoint
                    .scale(1 / pickInfo.pickedPoint.length() * 10)


                    if(brick.mesh.position.y<brick.size.y/2){
                        brick.mesh.position.y = brick.size.y/2;
                    }
            }

        });


        touch.subscribe('END',(lastPoint)=>{


            brick.mesh.physicsImpostor.unregisterBeforePhysicsStep(slowDown);

            //player.world.scene.getPhysicsEngine().setTimeStep(1/100);

            const pickInfo = player.world.scene.pick(lastPoint.x, lastPoint.y , (mesh)=>mesh===player.world.skyboxMesh||mesh===player.world.groundMesh);
            if (pickInfo.hit) {
                brick.linearVelocity = pickInfo.pickedPoint
                    .scale(1/pickInfo.pickedPoint.length()*100)
                    .add(new BABYLON.Vector3(
                        0,
                        30,
                        0
                    ));
            }else{
                //todo
            }





            //brick.mesh.physicsImpostor.setMass(8000);

            /*brick.linearVelocity = player.direction1.scale(100).add(new BABYLON.Vector3(
                0,
                30,
                0
            ));*/

            /*brick.angularVelocity = new BABYLON.Vector3(
                (Math.random() - .5) * Math.PI * 10,
                (Math.random() - .5) * Math.PI * 10,
                (Math.random() - .5) * Math.PI * 10
            );*/


        });




    });


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