const DOMInferface = (() => {
  const insertToById = (parent, child) => {
    const parentNode = document.querySelector('#' + `${parent}`)
    parentNode.appendChild(child)
  }
  const insertToByClass = (parent, child) => {
    const parentNode = document.querySelector('.' + `${parent}`)
    parentNode.appendChild(child)
  }
  const createElement = (name, classname, idname) => {
    const element = document.createElement(`${name}`)
    if (classname !== '') { element.setAttribute('class', classname) }
    if (idname !== '') { element.setAttribute('id', idname) }
    return element
  }
  const createImgById = (name, src) => {
    const element = document.createElement('img')
    element.setAttribute('id', name)
    element.src = src
    return element
  }
  const createImgByClass = (name, src) => {
    const element = document.createElement('img')
    element.setAttribute('class', name)
    element.src = src
    return element
  }
  const insertHtmlByClass = (name, text) => {
    const element = document.querySelector('.' + `${name}`)
    element.innerHTML = text
  }
  const insertTextContentById = (name, text) => {
    const element = document.querySelector('#' + `${name}`)
    element.innerHTML = text
  }
  const removeByClass = (name) => {
    const element = document.querySelector('.' + `${name}`)
    element.remove()
  }
  return { createElement, insertToById, insertToByClass, insertHtmlByClass, removeByClass, createImgById, createImgByClass, insertTextContentById }
})()

export { DOMInferface as default }
