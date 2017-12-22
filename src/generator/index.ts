import * as BABYLON from 'babylonjs';
import * as GridBuilding from 'gridbuilding';
import World from '../world/World';
import Brick from '../world/Brick';
const PALETTE = ['#e4572e','#f0f66e','#f0f8ea','#a8c686','#9d9c62'];

export default class WorldGenerator{

    //public colorPalette ;

    constructor(
        private world:World
    ){
        //this.colorPalette = [];
    }

    private _randomColor():string{
        return PALETTE[Math.floor(Math.random()*PALETTE.length)];
    }

    generateWorld() {



        const center = new BABYLON.Vector3(
            0,
            0,
            50
        ).add(new BABYLON.Vector3(
           20,
           0,
           20
        ));

        const FLOOR1 = `       
+:::+:::+
:::::::::
+:::+:::+
:::::::::
+:::+:::+
`;

        const FLOOR2 = `       
---------
|:::|:::|
|-------|
|:::|:::|
---------
`;

        const building = GridBuilding.Building.fromFloorStrings([
            FLOOR1,
            FLOOR1,
            FLOOR2,
            FLOOR2,
        ]);

        this._randomColor;
        building.getBricks().forEach((brick) => {

            new Brick(
                this.world,
                /*this._randomColor()*/'stone-bricks',
                {mass:200, restitution: 0.001},
                new BABYLON.Vector3(brick.size.x, brick.size.z, brick.size.y),
                new BABYLON.Vector3(brick.center.x, brick.center.z, brick.center.y).add(center)
            );
        });

    }
}