import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const arTestBtn = document.querySelector(".ar-test-btn");
const closeArTest = document.querySelector(".close-ar-test");
const containerEL = document.querySelector(".container");
const arTestModel = document.querySelector(".ar-test-model");

let camera, scene, renderer;
let controller;
let parent,
  objects = [];
let light1, light2, light3, light4, object, stats;
let circle;
let container;
const arButton = ARButton.createButton(renderer);

function showArTest(arg) {
  if (arg) {
    init();
    animate();

    function init() {
      container = document.createElement("div");
      document.body.appendChild(container);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
      light.position.set(0.5, 1, 0.25);
      scene.add(light);

      // models

      const radius = 3;
      const circleGeometry = new THREE.CircleGeometry(radius, 32);
      const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      circleMaterial.visible = false;
      circle = new THREE.Mesh(circleGeometry, circleMaterial);

      circle.position.set(0, 0, 0);
      circle.rotation.y += 0;
      circle.rotation.x += 1.57; // 1.57

      scene.add(circle);

      const pointsCount = 8;

      for (let i = 0; i < pointsCount; i++) {
        const pointGeometry = new THREE.SphereGeometry(0.01, 8, 8);
        const pointMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
        });

        pointMaterial.visible = false; // !

        const point = new THREE.Mesh(pointGeometry, pointMaterial);

        const angle = (i / pointsCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        point.position.set(x, y, 0);
        circle.add(point);
      }

      new RGBELoader()
        .setPath("textures/equirectangular/")
        .load("royal_esplanade_1k.hdr", function (texture) {
          texture.mapping = THREE.EquirectangularReflectionMapping;

          //scene.background = texture;
          scene.environment = texture;

          render();

          // model

          /* const loader = new GLTFLoader().setPath( 'models/gltf/DamagedHelmet/glTF/' );
                                              loader.load( 'DamagedHelmet.gltf', function ( gltf ) {
              
                                                  scene.add( gltf.scene );
              
                                                  render();
              
                                              } ); */
        });

      const loader = new GLTFLoader().setPath("products/");

      const objectsUrls = [
        "Nexus.glb",
        "Nexus_remote.glb",
        "Svakom_lowres.glb",
        "Womanizer.glb",
      ];

      let objectsUrls_used = [0, 0, 0, 0];
      let object_instances = [0, 0, 0, 0];
      let objectUrlIndex_ = 0;

      for (let i = 0; i < pointsCount; i++) {
        const point = circle.children[i];
        //const objectUrlIndex = Math.floor(Math.random() * objectsUrls.length);
        objectUrlIndex_++;
        if (objectUrlIndex_ >= objectsUrls.length) {
          objectUrlIndex_ = 0;
        }

        const objectUrlIndex = objectUrlIndex_;

        loader.load(objectsUrls[objectUrlIndex], function (gltf) {
          if (objectsUrls_used[objectUrlIndex] == 0) {
            let obj = gltf.scene;
            obj.scale.set(10, 10, 10);

            objects.push(obj);
            objectsUrls_used[objectUrlIndex] = 1;
            object_instances[objectUrlIndex] = obj;

            console.log("not clone");

            point.add(obj);

            render();
          } else {
            let obj = object_instances[objectUrlIndex].clone();
            objects.push(obj);
            point.add(obj);
            console.log("clone");
          }
        });
      }

      console.log(objects.length);

      //const sphere = new THREE.SphereGeometry( 0.5, 16, 8 );

      //lights

      //light1 = new THREE.PointLight( 0xfffff, 50 );
      //light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
      //scene.add( light1 );

      /* light2 = new THREE.PointLight( 0x0040ff, 50 );
                                      light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
                                      scene.add( light2 );
              
                                      light3 = new THREE.PointLight( 0x80ff80, 50 );
                                      light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
                                      scene.add( light3 );
              
                                      light4 = new THREE.PointLight( 0xffaa00, 50 );
                                      light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
                                      scene.add( light4 ); */

      //

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      //renderer.setClearColor( 0xff0000, 1 ); //!
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);

      //

      //   ! * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
      //   document.body.appendChild(ARButton.createButton(renderer));
      document.body.appendChild(arButton);

      //

      const geometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 32).rotateX(
        Math.PI / 2
      );

      function onSelect() {
        const objectUrlIndex = Math.floor(Math.random() * objectsUrls.length);

        let obj = object_instances[objectUrlIndex].clone();
        console.log("clone");
        obj.scale.set(1, 1, 1);
        obj.position.set(0, 0, -0.3).applyMatrix4(controller.matrixWorld);
        obj.quaternion.setFromRotationMatrix(controller.matrixWorld);
        scene.add(obj);

        /* const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
                                          const mesh = new THREE.Mesh( geometry, material );
                                          mesh.position.set( 0, 0, - 0.3 ).applyMatrix4( controller.matrixWorld );
                                          mesh.quaternion.setFromRotationMatrix( controller.matrixWorld );
                                          scene.add( mesh ); */
      }

      controller = renderer.xr.getController(0);
      controller.addEventListener("select", onSelect);
      scene.add(controller);

      //

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    //

    function animate() {
      renderer.setAnimationLoop(render);
    }

    function render() {
      for (let i = 0; i < objects.length; i++) {
        objects[i].rotation.x += 0.01;
        objects[i].rotation.y += 0.01;
      }
      circle.rotation.z += 0.01;

      renderer.render(scene, camera);
    }
  }
}

// Open Ar Viewer
arTestBtn.addEventListener("click", () => {
  showArTest(true);
  containerEL.classList.add("hide");
  closeArTest.classList.add("active");
  document.body.classList.add("dark");
  arTestModel.classList.add("open");
});

// Close Ar Viewer
closeArTest.addEventListener("click", () => {
  showArTest(false);
  containerEL.classList.remove("hide");
  closeArTest.classList.remove("active");
  document.body.classList.remove("dark");
  arTestModel.classList.remove("open");

  container.classList.add("none");
  document.body.removeChild(arButton);
});
