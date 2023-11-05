function getId(id) {
  return document.getElementById(id);
}

function addClick(id, fn) {
  getId(id).addEventListener("click", fn);
}

function addToId(id, el) {
  getId(id).innerHTML = el;
}

function toText(data) {
  return JSON.stringify(data);
}

function toObject(data){
  return JSON.parse(data)
}

function innerText(id){
  return getId(id).innerHTML
}

export {
  getId,
  addToId,
  addClick,
  toText,
  toObject,
  innerText
}