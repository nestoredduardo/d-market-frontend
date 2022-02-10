const productsNode = document.getElementById('List');
const loading = document.getElementById('Loading');

let paginationNode = document.querySelectorAll('#Pagination_number');
paginationNode = [...paginationNode];
const categoriesNode = document.getElementById('Category_list');

const menuBtn = document.getElementById('Menu__button');
const cerrarBtn = document.getElementById('Close_category');
const categoryBtn = document.getElementById('Category_button');

const searchInput = document.getElementById('buscar_input');

let arrowLeftNode = document.querySelectorAll('#arrow-left');
arrowLeftNode = [...arrowLeftNode];
let arrowRightNode = document.querySelectorAll('#arrow-right');
arrowRightNode = [...arrowRightNode];

let data = {};

const URL = 'https://d-market-backend.herokuapp.com/';

const getProducts = async (page = 1, category = 1) => {
  loading.classList.add('display');
  productsNode.innerHTML = '';

  const url = `${URL}products?page=${page}&category=${category}`;

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

const getCategories = async () => {
  const response = await fetch(`${URL}categories`);
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

//Menú lateral
menuBtn.addEventListener('click', () => {
  categoriesNode.classList.add('active');
});

cerrarBtn.addEventListener('click', () => {
  categoriesNode.classList.remove('active');
});

getProducts();
getCategories();

//Eventos de categoría
categoryBtn.addEventListener('mouseover', () => {
  categoriesNode.classList.add('display');
  categoryBtn.removeEventListener('mouseleave', () => {});
});

categoriesNode.addEventListener('mouseover', () => {
  categoriesNode.classList.add('display');
});

categoriesNode.addEventListener('mouseleave', () => {
  categoriesNode.classList.remove('display');
  categoryBtn.addEventListener('mouseleave', () => {
    categoriesNode.classList.remove('display');
  });
});

//Search event
searchInput.addEventListener('input', async (e) => {
  const valor = e.target.value;

  productsNode.innerHTML = '';

  const response = await fetch(`${URL}search?input=${valor}`);
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
