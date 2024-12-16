import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'; // use to move around the scene with our mouse
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); // to make a full screen canvas
camera.position.setZ(30); //move the camera along the z axis to get a better Perspective

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({color: 0xFF6347, wireframe: true});
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// adding a light source
// const pointLight = new THREE.PointLight(0xffffff)
// pointLight.position.set(5,5,5) // moving the light away from the center

// pointLight.position.set(10,10,10); //further pushing the light source away from the center

const ambientLight = new THREE.AmbientLight(0xffffff); // to lightup everything in the scene equally(acts like a flood light)


// scene.add(pointLight, ambientLight)
scene.add(ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight); // gives a wireframe to show the direction on the light source
const gridHelper = new THREE.GridHelper(200, 50); // Adds a 2D-grid around the scene
//
// scene.add(lightHelper, gridHelper);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement); // listen to dom events from the mouse and update the camera postion accordingly

// using mapHelpers to generate a large number of objects in the scene. Populate outer space with randomly generated stars
const addStar = () =>{
 const geometry = new THREE.SphereGeometry(0.25, 24, 24);
 const material = new THREE.MeshStandardMaterial({color: 0xffffff})

 const star = new THREE.Mesh(geometry, material);
  
// to display the stars randomly on the screen
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

// To display 200 stars on the screen
Array(200).fill().forEach(addStar);
// renderer.render(scene, camera);

// Adding a background to the scene
const spaceTexture = new THREE.TextureLoader();
scene.background = spaceTexture.load('./src/space1.jpg');


// Using texture mapping to my avatar

const roTexture = new THREE.TextureLoader().load('./src/passport photo.jpg')

const ro = new THREE.Mesh(
  new THREE.BoxGeometry(6,6,6),
  new THREE.MeshBasicMaterial({map: roTexture})
);

scene.add(ro);

// Combining mutiple maps to create the moon
const moonTexture = new THREE.TextureLoader().load('./src/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('./src/normal.jpg') // to make the moon more realistic by giving its surface crests and bumps off which light can bounce off
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    map: normalTexture,
  })
);
scene.add(moon);

// setting the position of the moon
moon.position.z = 30;
moon.position.setX(-10);

const moveCamera = () => {

  const t = document.body.getBoundingClientRect().top; // get the dimensions of the viewport and get the actual position from the top of the webpage
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  ro.rotation.y += 0.01;
  ro.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;

}

document.body.onscroll = moveCamera; // the function will be fired whenever the user scrolls
// a game loop to render the scene automatically after a change
const animate = () =>{
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate()



