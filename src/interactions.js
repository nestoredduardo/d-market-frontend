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
