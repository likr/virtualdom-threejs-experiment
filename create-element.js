import THREE from 'three'
import applyProperties from 'virtual-dom/vdom/apply-properties'
import isObject from 'is-object'

class ThreeNode {
  constructor (object, scene) {
    this.childNodes = []
    this.object = object
    this.ownerDocument = scene
  }

  appendChild (child) {
    this.childNodes.push(child)
    this.object.add(child.object)
    return child
  }
}

class ThreeGroup extends ThreeNode {
  constructor (scene) {
    super(new THREE.Object3D(), scene)
  }
}

class ThreeObject extends ThreeNode {
  constructor (type, material, scene) {
    const geometry = new THREE.Geometry()
    super(new THREE[type](geometry, material), scene)
  }
}

const assignRecursive = (object, value) => {
  for (const key in value) {
    if (isObject(value[key])) {
      assignRecursive(object[key], value[key])
    } else {
      object[key] = value[key]
    }
  }
}

const handler = {
  get: (target, property) => {
    switch (property) {
      case 'geometry':
        return target.object.geometry
      case 'material':
        return target.object.material
      case 'rotation':
        return target.object.rotation
      case 'position':
        return target.object.position
      default:
        return target[property]
    }
  },
  set: (target, property, value) => {
    if (value.uuid) {
      delete value.uuid
    }
    assignRecursive(target.object[property], value)
    for (const name of ['colors', 'vertices']) {
      if (value[name]) {
        target.object.geometry[`${name}NeedUpdate`] = true
      }
    }
  }
}

const createNode = (vnode, scene) => {
  switch (vnode.tagName) {
    case 'Group':
      return new ThreeGroup(scene)
    case 'Mesh':
      return new Proxy(new ThreeObject('Mesh', new THREE.MeshBasicMaterial(), scene), handler)
    case 'Points':
      return new Proxy(new ThreeObject('Points', new THREE.PointsMaterial(), scene), handler)
  }
}

const createElement = (vnode, opts) => {
  const node = createNode(vnode, opts.document)

  const props = vnode.properties
  applyProperties(node, props)

  const children = vnode.children
  for (let i = 0; i < children.length; i++) {
    const childNode = createElement(children[i], opts)
    if (childNode) {
      node.appendChild(childNode)
    }
  }

  return node
}

export default createElement
