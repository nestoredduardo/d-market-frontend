const menuBtn = document.getElementById('Menu__button');
const cerrarBtn = document.getElementById('Close_category');
const categoryBtn = document.getElementById('Category_button');

//Menú lateral
menuBtn.addEventListener('click', () => {
  categoriesNode.classList.add('active');
});

cerrarBtn.addEventListener('click', () => {
  categoriesNode.classList.remove('active');
});

let showCategoryList = false;

//Eventos de categoría
categoryBtn.addEventListener('click', () => {
  if (!showCategoryList) {
    showCategoryList = true;
    categoriesNode.classList.add('display');
  } else {
    showCategoryList = false;
    categoriesNode.classList.remove('display');
  }
});
