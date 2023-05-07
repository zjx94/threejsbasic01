import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import imgSrc from '../assets/imgs/test3.jpg';
console.log(THREE)
console.log(imgSrc)
var scene,camera,renderer;
let isUserInteracting = false,
    lon = 90, lat = 0,
    phi = 0, theta = 0,
    onPointerDownPointerX = 0,
    onPointerDownPointerY = 0,
    onPointerDownLon = 0,
    onPointerDownLat = 0;
    const distance = 500;
function init() {
    scene = new THREE.Scene();
    init_camera();
    init_renderer();
    init_light();
}
init();

//test2_addcude();

//test3_addvideo();
test4_addimg();
//init_controls();
var group =new THREE.Group();
group.add( new THREE.GridHelper( 4, 12, 0x888888, 0x444444 ) );
scene.add(group);

init_events();
render();
 

function test4_addimg () {
    //camera = new THREE.PerspectiveCamera(170, window.innerWidth / window.innerHeight, 0.1, 10000);
    //camera.position.set(0, 200, 0);
    /*var geometry = new THREE.SphereGeometry(500, 60, 30);
    geometry.scale(-1, 1, 1);
    // 创建材质并设置全景图
    var textureLoader = new THREE.TextureLoader();
    var texture=textureLoader.load("./test2.jpg");
    texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	// uv两个方向纹理重复数量
	texture.repeat.set(10, 10);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
    });
    // 全景图贴在球体上
    var mesh = new THREE.Mesh(geometry, material);
    // 添加到场景
    scene.add(mesh);*/
    const geometry = new THREE.SphereGeometry( 1000, 700, 700 );
    geometry.scale(-1, 1, 1);
    var textureLoader = new THREE.TextureLoader();
    var texture=textureLoader.load(imgSrc);
    //var texture=textureLoader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg?");//
    const material = new THREE.MeshBasicMaterial( { 
        map: texture
     } );
    const sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
}
function test3_addvideo() {
    var geometry = new THREE.SphereGeometry(500, 60, 30 );
    geometry.scale( - 1, 1, 1 );
    /*创建一个video*/
    //var video = document.createElement( 'video' );
    var video = document.getElementById( "video" );
    /*video.width = 640;
    video.height = 360;
    video.loop = true;
    video.muted = false;
    video.preload = 'auto';
    video.autoplay=true;*/
    video.crossOrigin= 'anonymous';
    //video.src = './test1.mp4';
    //video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
    video.play();
    //getNormalVideo(video.src,video);
    var texture = new THREE.VideoTexture( video );
    //texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    //texture.format = THREE.RGBFormat;
    var material = new THREE.MeshBasicMaterial({
        map : texture
    });
    var mesh  = new THREE.Mesh(geometry, material);
    scene.add(mesh);
};

function test1_addcude() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
};
function test2_addcude() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({
        color: 0x00ffff
    });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
};



function init_camera() {
    camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 15000);
    camera.position.x = 0;
    camera.position.y = -1000;
    camera.position.z = 0;
    camera.fov=100;
    camera.lookAt(scene.position);
    /*camera.position.set(0, 100, 0)
    camera.fov = 140
    camera.lookAt(new THREE.Vector3(0, -100, 0))*/
};
function init_renderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
};
function init_light() {
    var ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(10, 10, 15);
    spotLight.castShadow = true;
    //spotLight.shadowCameraNear = 8;
    //spotLight.shadowCameraFar = 30;
    spotLight.shadowDarkness = 0.5;
    spotLight.shadowCameraVisible = false;
    //shadow map size will determine the resolution of shadow
    //spotLight.shadowMapWidth = 1024;
    //spotLight.shadowMapHeight = 1024;
    spotLight.name = 'Spot Light';
    scene.add(spotLight);
};
function init_controls() {
    var controls = new OrbitControls(camera,renderer.domElement);
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
};
function update()
{
    //lon+=0.1;
    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.MathUtils.degToRad( 90 - lat );
    theta = THREE.MathUtils.degToRad( lon );

    camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
    camera.position.y = distance * Math.cos( phi );
    camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( 0, 0, 0 );

    renderer.render( scene, camera );
};
function init_events ()
{
    document.addEventListener('pointerdown',onPointerDown);
    document.addEventListener('pointermove',onPointerMove);
    document.addEventListener('pointerup',onPointerUp);
    document.addEventListener('resize',onWindowResize);
};
function onPointerDown (event)
{
    isUserInteracting =true;
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
};
function onPointerMove( event ) {
    if ( isUserInteracting === true ) {
        lon = ( onPointerDownPointerX - event.clientX ) * 0.2 + onPointerDownLon;
        lat = ( onPointerDownPointerY - event.clientY ) * 0.1 + onPointerDownLat;
    }
}

function onPointerUp() {
    isUserInteracting = false;
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}