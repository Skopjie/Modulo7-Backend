const { getData, setData } = require('../utils/fileController');

async function getAll() {
  return await getData();
}

async function getById(id) {
  const productos = await getData();
  return productos.find(p => p.id === id) || null;
}

async function create(productoObj) {
  const productos = await getData();
  productos.push(productoObj);
  await setData(productos);
  return productoObj;
}

async function update(id, datosActualizados) {
  const productos = await getData();
  const indice = productos.findIndex(p => p.id === id);
  if (indice === -1) {
    return null;
  }
  productos[indice] = { ...productos[indice], ...datosActualizados, id };
  await setData(productos);
  return productos[indice];
}

async function remove(id) {
  const productos = await getData();
  const nuevoArray = productos.filter(p => p.id !== id);
  if (nuevoArray.length === productos.length) {
    return false;
  }
  await setData(nuevoArray);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
