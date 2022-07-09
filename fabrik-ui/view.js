function viewModel(url) {
  // Instantiate a loader
  var renderer = new THREE.WebGLRenderer({ alpha: true, antialiase: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.position.y = 1.5;

  var light = new THREE.DirectionalLight(0xefefff, 3);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);
  var light = new THREE.DirectionalLight(0xffefef, 3);
  light.position.set(-1, -1, -1).normalize();
  scene.add(light);

  window.addEventListener("resize", function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  var loader = new THREE.GLTFLoader();
  var mixer;
  var model;
  loader.load(url, function (gltf) {
    gltf.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.material.side = THREE.DoubleSide;
      }
    });

    model = gltf.scene;
    model.scale.set(10,10,10);
    scene.add(model);

    console.log(gltf.animations); //shows all animations imported into the dopesheet in blender

    mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[1]).play();

    document.body.addEventListener("click", kill);
    function kill() {
      mixer.clipAction(gltf.animations[1]).stop();
      mixer.clipAction(gltf.animations[0]).play();
      setTimeout(function () {
        mixer.clipAction(gltf.animations[0]).stop();
        mixer.clipAction(gltf.animations[1]).play();
      }, 1500);
    }
  });

  //===================================================== animate
  var clock = new THREE.Clock();
  function render() {
    requestAnimationFrame(render);
    var delta = clock.getDelta();
    if (mixer != null) mixer.update(delta);
    if (model) model.rotation.y += 0.025;

    renderer.render(scene, camera);
  }

  render();
}

let paramString = window.location.search;
console.log(paramString)
let queryString = new URLSearchParams(paramString);
const url = queryString.get('url');
viewModel(url);