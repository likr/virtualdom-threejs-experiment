import VNode from 'virtual-dom/vnode/vnode'

export const threeGroup = (children = [], properties = {}, key = undefined) => {
  return new VNode('Group', properties, children, key, null)
}

export const threeObject = (type, properties = {}, key = undefined) => {
  return new VNode(type, properties, [], key, null)
}
