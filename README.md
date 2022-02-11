# Funciones principales utilizadas

## Listar productos - getProducts

La función <code>getProducts()</code> recibe como parámetros page y category, por defecto cada una toma el valor de 1.

La función se encarga de hacer fetch a la API, cargar los productos en la página y llamar a la función <code>createPagination</code> para actualizar la paginación según los nuevos datos.

Esta función se ejecuta siempre al cargar la página.

```js
const getProducts = async (page = 1, category = 1) => {
  loading.classList.add('display');
  productsNode.innerHTML = '';

  const url = `https://bmarket-api.herokuapp.com/products?page=${page}&category=${category}`;

  const response = await fetch(url);
  data = await response.json();

  if (data.error) {
    const h1 = document.createElement('h1');
    h1.textContent = 'Hubo un error, Intente más tarde';
    h1.classList.add('Error_message', 'text_center');

    const image = document.createElement('img');
    image.classList.add('Error_img');
    image.src = './src/assets/error_image.jpg';

    productsNode.append(h1, image);
  } else {
    const productList = data.body.data;
    const npages = data.body.meta.npages;
    const page = data.body.meta.page;

    let allItems = [];
    productList.forEach((item) => {
      let image;
      if (item.url_image) {
        image = document.createElement('img');
        image.classList.add('Product__img');
        image.src = item.url_image;
      } else {
        image = document.createElement('h1');
        image.textContent = 'Imagen no disponible';
        image.classList.add('Error_message');
      }

      const title = document.createElement('h2');
      title.classList.add('Product__title');
      title.textContent = item.name;

      const price = document.createElement('div');
      price.classList.add('Product__price');
      price.textContent = item.price;

      const container = document.createElement('div');
      container.classList.add('Product');
      container.append(image, title, price);

      allItems.push(container);
    });

    productsNode.append(...allItems);

    createPagination(npages, category, page);
  }

  loading.classList.remove('display');

  console.log(data);
};
```

## Crear paginación - createPagination

La función <code>createPagination()</code> recibe como parámetros npages(número de páginas de esa categoría).

La función se encarga de crear la paginación y darle a cada número el evento click que carge nuevos datos. También le dar a las flechas el evento para avanzar o retroceder de página.

```js
const createPagination = (npages, category, npage) => {
  paginationNode.forEach((item) => {
    item.innerHTML = '';
    let allPages = [];
    for (i = 0; i < npages; i++) {
      const page = document.createElement('span');
      const number = i + 1;
      page.textContent = number;
      if (number == npage) {
        page.classList.add('bold');
      }
      page.addEventListener('click', () => {
        getProducts(number, category);
      });

      allPages.push(page);
    }

    item.append(...allPages);
  });

  if (parseInt(npage) - 1 > 0) {
    console.log('Allow left');
    arrowLeftNode.forEach((item) => {
      item.addEventListener('click', () => {
        getProducts(npage - 1, category);
      });
      item.classList.add('pointer');
    });
  }

  if (parseInt(npage) + 1 <= npages) {
    console.log('Allow right');
    arrowRightNode.forEach((item) => {
      item.addEventListener('click', () => {
        getProducts(parseInt(npage) + 1, category);
      });
      item.classList.add('pointer');
    });
  }
};
```

## Obtener categorías - getCategories

La función se encarga de hacer un llamado a la API para obtener las categorías y mostrarlas en el desplegable si el usuario está en desktop o en la barra lateral si el usuario está en mobile.

```js
const getCategories = async () => {
  const response = await fetch(`https://bmarket-api.herokuapp.com/categories`);
  data = await response.json();
  const { categories } = data.body;

  let allCategories = [];
  categories.forEach((item) => {
    const name = document.createElement('h1');
    name.textContent = item.name.toUpperCase();
    name.classList.add('hover');
    name.addEventListener('click', () => {
      getProducts(1, item.id);
    });

    allCategories.push(name);
  });

  categoriesNode.append(...allCategories);
};
```

## Búsqueda de productos - eventListener de la barra de búsqueda

Este evento se ejecuta cuando el usuario ingresa un valor a la barra de búsqueda, hace un llamado a la API de <code>search</code> e imprime los resultados en pantalla.

```js
searchInput.addEventListener('input', async (e) => {
  const valor = e.target.value;

  productsNode.innerHTML = '';

  const response = await fetch(
    `https://bmarket-api.herokuapp.com/search?input=${valor}`
  );
  const data = await response.json();

  console.log(data);

  const productList = data.body.products;

  let allItems = [];
  productList.forEach((item) => {
    let image;
    if (item.url_image) {
      image = document.createElement('img');
      image.classList.add('Product__img');
      image.src = item.url_image;
    } else {
      image = document.createElement('h1');
      image.textContent = 'Imagen no disponible';
      image.classList.add('Error_message');
    }

    const title = document.createElement('h2');
    title.classList.add('Product__title');
    title.textContent = item.name;

    const price = document.createElement('div');
    price.classList.add('Product__price');
    price.textContent = item.price;

    const container = document.createElement('div');
    container.classList.add('Product');
    container.append(image, title, price);

    allItems.push(container);
  });

  productsNode.append(...allItems);

  if (!valor) {
    getProducts();
  }
});
```
