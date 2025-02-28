import * as THREE from 'three'
import StarMap from 'views/StarMap.js'

export default class Stars {

  constructor() {
    this.view = new THREE.Object3D();

    this.materials = [];
    this.roughness = 0.8;
    this.metalness = 0.5;
    this.emissiveIntensity = 1.0;

    this.resolution = 1024;
    this.size = 50000;

    this.starMaps = [];

    this.setup();
  }

  setup() {
    this.starMap = new StarMap();
    this.starMaps = this.starMap.maps;

    for (let i=0; i<6; i++) {
      let material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xFFFFFF),
        side: THREE.BackSide,
      });
      this.materials[i] = material;
    }

    let geo = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
    let radius = this.size;
    const position = geo.getAttribute("position");
    const vertex = new THREE.Vector3();
    for (let i = 0; i < position.count; ++i) {
  		vertex.fromBufferAttribute(position, i);
  		vertex.normalize().multiplyScalar(radius);
      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  	}
    this.computeGeometry(geo);
    this.sphere = new THREE.Mesh(geo, this.materials);
    this.view.add(this.sphere);
  }

  render(props, genSetting) {
    this.seed = genSetting.randRange(0, 1000);

    this.starMap.render({
      seed: this.seed,
      resolution: this.resolution,
      res1: genSetting.randRange(0.5, 2.0),
      res2: genSetting.randRange(0.5, 2.0),
      resMix: genSetting.randRange(0.5, 2.0),
      mixScale: 0.5,
      color1: this.color1,
      color2: this.color2,
      color3: this.color3,
      nebulaeMap: props.nebulaeMap
    });

    this.updateMaterial();
  }

  updateMaterial() {
    for (let i=0; i<6; i++) {
      let material = this.materials[i];
      material.map = this.starMaps[i];
    }
  }

  computeGeometry(geometry) {
  	geometry.computeVertexNormals()
  	geometry.computeBoundingSphere();
  	geometry.computeBoundingBox();

  	geometry.verticesNeedUpdate = true;
  	geometry.elementsNeedUpdate = true;
  	geometry.uvsNeedUpdate = true;
  	geometry.normalsNeedUpdate = true;
  	geometry.colorsNeedUpdate = true;
  	geometry.lineDistancesNeedUpdate = true;
  	geometry.groupsNeedUpdate = true;
  }

}
