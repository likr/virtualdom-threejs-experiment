import THREE from 'three'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import createElement from './create-element'
import bootstrap from './bootstrap'
import {threeGroup, threeObject} from './three-node'

const render = (t, points) => {
  const geometry = new THREE.Geometry()
  geometry.vertices = points.map(({x, y, z}) => new THREE.Vector3(x, y, z))
  geometry.colors = points.map(({color}) => new THREE.Color(color))

  return threeGroup([
    threeObject('Points', {
      geometry,
      material: new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        size: 0.1
      })
    }),
    threeObject('Mesh', {
      geometry: new THREE.BoxGeometry(1, 1, 1),
      material: new THREE.MeshBasicMaterial({
        color: `hsl(${Math.max(0.1, t * 10 % 360)}, 100%, 50%)`
      }),
      rotation: {
        x: t,
        y: t
      },
      position: {
        x: -3
      }
    })
  ])
}

const size = 5
let t = 0
const points = []
for (let i = 0; i < 100; ++i) {
  points.push({
    x: Math.random() * size - size / 2,
    y: Math.random() * size - size / 2,
    z: 0,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`
  })
}
let tree = render(t, points)
const scene = new THREE.Scene()
let rootNode = createElement(tree, {
  document: scene
})
scene.add(rootNode.object)

const tick = () => {
  t += 0.1
  for (const point of points) {
    point.x = point.x + 0.01
    point.y = point.y + 0.01
    if (point.x > size / 2) {
      point.x = -size / 2
    }
    if (point.y > size / 2) {
      point.y = -size / 2
    }
  }
  const newTree = render(t, points)
  const patches = diff(tree, newTree)
  rootNode = patch(rootNode, patches, {
    render: createElement
  })
  tree = newTree
}

bootstrap(scene, document.body, tick)

