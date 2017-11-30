import * as BABYLON from 'babylonjs';
import * as GridBuilding from 'gridbuilding';
import World from '../world/World';
import Brick from '../world/Brick';

export default class WorldGenerator{
    constructor(
        private world:World
    ){}

    generateWorld() {



        const center = new BABYLON.Vector3(
            0,
            0,
            50
        );

        const FLOOR = `       
+:::+:::+
:::::::::
+:::+:::+
::::::::|
+:::+---+
`;

        const building = GridBuilding.Building.fromFloorStrings([
            FLOOR,
            FLOOR,
            FLOOR,
            FLOOR,
            FLOOR,
            FLOOR,
            FLOOR
        ]);

        building.getBricks().forEach((brick) => {

            new Brick(
                this.world,
                'stone-plain',
                {mass:200, restitution: 0.01},
                new BABYLON.Vector3(brick.size.x, brick.size.z, brick.size.y),
                new BABYLON.Vector3(brick.center.x, brick.center.z, brick.center.y).add(center)
            );
        });

    }
}