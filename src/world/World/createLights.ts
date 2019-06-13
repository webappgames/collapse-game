import * as BABYLON from 'babylonjs';

export default function createLights(scene: BABYLON.Scene): BABYLON.Light[] {
    const light1 = new BABYLON.DirectionalLight('dir01', new BABYLON.Vector3(1, -2, 1), scene);
    light1.position = new BABYLON.Vector3(20, 3, 20);
    light1.intensity = 0.3;

    const light2 = new BABYLON.DirectionalLight('dir01', new BABYLON.Vector3(-1, -2, 1), scene);
    light2.position = new BABYLON.Vector3(-20, 30, 20);
    light2.intensity = 0.3;

    return [light2];
}
