var scene = new THREE.Scene()

var camera = new THREE.Camera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 1000

var renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )
    
var sprite = THREE.ImageUtils.loadTexture('particle.png')

var material = new THREE.ParticleBasicMaterial({
  size: 300,
  map: sprite,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true,
  vertexColors: true
})

var geometry = new THREE.Geometry()
var colors = []
var positions = []
var velocities = []
for (var i = 0; i < 300; ++i) {
  colors[i] = new THREE.Color()
  colors[i].setHSV(Math.random(), 1.0, 1.0)
  geometry.vertices[i] = new THREE.Vertex(new THREE.Vector3())
}
geometry.colors = colors

var particles = new THREE.ParticleSystem(geometry, material)
particles.sortParticles = false
scene.addObject(particles)
renderer.render(scene, camera)
//     //init Particles
//     geometry = new THREE.Geometry();
//     //create one shared material
    
//     material = new THREE.ParticleBasicMaterial({
//         size: 380,
//         map: sprite,
//         blending: THREE.AdditiveBlending,
//         depthTest: false,
//         transparent: true,
//         vertexColors: true //allows 1 color per particle
//     });
//     //create particles
//     for (i = 0; i < PARTICLE_COUNT; i++) {
//         geometry.vertices.push(new THREE.Vertex());
//         colors[i] = new THREE.Color();
//         colors[i].setHSV(Math.random(), 1.0, 1.0);
//         stars.push(new Star());
//         geometry.vertices[i] = new THREE.Vertex(stars[i].posn);
//     }
    
//     geometry.colors = colors;
    
//     //init particle system
//     particles = new THREE.ParticleSystem(geometry, material);
//     particles.sortParticles = false;
//     scene.addObject(particles);
    
//     //init Sun Beams
//     var i;
//     var beamGeometry = new THREE.PlaneGeometry(5000, 50, 1, 1);
//     beamGroup = new THREE.Object3D();
    
//     for (i = 0; i < BEAM_COUNT; ++i) {
    
//         //create one material per beam
//         var beamMaterial = new THREE.MeshBasicMaterial({
//             opacity: 0.15,
//             blending: THREE.AdditiveBlending,
//             depthTest: false,
//         });
//         beamMaterial.color = new THREE.Color();
//         beamMaterial.color.setHSV(Math.random(), 1.0, 1.0);
//         //create a beam
//         beam = new THREE.Mesh(beamGeometry, beamMaterial);
//         beam.doubleSided = true;
//         beam.rotation.x = Math.random() * Math.PI;
//         beam.rotation.y = Math.random() * Math.PI;
//         beam.rotation.z = Math.random() * Math.PI;
//         beamGroup.addChild(beam);
//     }
    
//     scene.addObject(beamGroup);
    
//     //init renderer
//     renderer = new THREE.WebGLRenderer({
//         antialias: false,
//         clearAlpha: 1
//     });
//     renderer.setSize(WEBGL_WIDTH, WEBGL_HEIGHT);
//     renderer.sortElements = false;
//     renderer.sortObjects = false;
//     container.appendChild(renderer.domElement);
    
//     //init stats
//     stats = new Stats();
//     stats.domElement.style.position = 'absolute';
//     stats.domElement.style.top = '0px';
//     document.getElementById("stage").appendChild(stats.domElement);
    
//     //init mouse listeners
//     document.addEventListener('mousemove', onDocumentMouseMove, false);
//     container.addEventListener('click', onDocumentClick, false);
//     $(window).mousewheel(function(event, delta){
//         setSize(delta);
//     });
    
//     animate();
// }

// function onDocumentClick(event){
//     for (i = 0; i < PARTICLE_COUNT; i++) {
//         stars[i].init();
//     }
// }

// function onDocumentMouseMove(event){
//     mouseX = event.clientX - windowHalfX;
//     mouseY = event.clientY - windowHalfY;
// }

// function animate(){
//     requestAnimationFrame(animate); //requestAnimationFrame is more polite way to ask for system resources
//     render();
//     stats.update();
// }

// function render(){

//     particles.rotation.x += STAR_ROT_SPEED;
//     particles.rotation.y += STAR_ROT_SPEED;
    
//     beamGroup.rotation.x += BEAM_ROT_SPEED;
//     beamGroup.rotation.y += BEAM_ROT_SPEED;
    
//     camera.position.x += (mouseX - camera.position.x) * 0.3;
//     camera.position.y += (-mouseY - camera.position.y) * 0.3;
    
//     for (i = 0; i < PARTICLE_COUNT; i++) {
//         stars[i].update();
//     }
    
//     geometry.__dirtyVertices = true;
//     renderer.render(scene, camera);
    
// }

// function setSize(delta){

//     var bigger = delta > 0;
    
//     if (bigger) {
//         webGLSizeIndex++;
//     }
//     else {
//         webGLSizeIndex--;
//     }
    
//     if (webGLSizeIndex >= webGLSizes.length) 
//         webGLSizeIndex = webGLSizes.length - 1;
//     if (webGLSizeIndex <= 0) 
//         webGLSizeIndex = 0;
    
//     WEBGL_WIDTH = webGLSizes[webGLSizeIndex].width;
//     WEBGL_HEIGHT = webGLSizes[webGLSizeIndex].height;
    
//     if (WEBGL_WIDTH === "100%") {
//         WEBGL_WIDTH = window.innerWidth;
//         WEBGL_HEIGHT = window.innerHeight;
//     }
    
//     renderer.setSize(WEBGL_WIDTH, WEBGL_HEIGHT);
    
//     var contDiv = document.getElementById("container");
//     contDiv.style.width = WEBGL_WIDTH + "px";
//     contDiv.style.height = WEBGL_HEIGHT + "px";
    
//     //reposition div
//     $(window).resize();
    
// }

// /**
//  * Center container div inside window
//  */
// $(window).resize(function(){

//     $('#container').css({
//         position: 'absolute',
//         left: ($(window).width() -
//         $('#container').outerWidth()) /
//         2,
//         top: ($(window).height() -
//         $('#container').outerHeight()) /
//         2
//     });
    
// });

// $(document).ready(function(){
//     init();
//     $(window).resize();
// });
