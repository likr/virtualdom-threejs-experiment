import THREE from 'three'

const bootstrap = (scene, element, callback) => {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  element.appendChild(renderer.domElement)
  camera.position.z = 5
  const render = () => {
    window.requestAnimationFrame(render)
    callback()
    renderer.render(scene, camera)
  }
  render()
  return scene
}

export default bootstrap
