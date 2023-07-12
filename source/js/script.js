const menuButton = document.querySelector('.site-header__menu-button');
const menu = document.querySelector('.site-header__navigation');
menu.classList.remove('site-header__navigation--nojs');
menuButton.classList.remove('site-header__menu-button--nojs');
const cartButtons = document.querySelectorAll('.product-card__cart');
const weeklyButton = document.querySelector('.weekly__button');
const cartButtonsList = [...cartButtons, weeklyButton];
const modal = document.querySelector('.modal');
const modalButton = modal?.querySelector('.modal__button');

menuButton.addEventListener('click', () => {
  menu.classList.contains('site-header__navigation--visible') ? (
  menu.classList.remove('site-header__navigation--visible'),
  menuButton.classList.remove('site-header__menu-button--cross')) : (
  menu.classList.add('site-header__navigation--visible'),
  menuButton.classList.add('site-header__menu-button--cross'));
});

cartButtonsList.forEach((button) => {
  if (button) {
    button.addEventListener('click', (evt) => {
      evt.preventDefault();
      modal.classList.add('modal--opened');
    })
  }
})

if (modalButton) {
  modalButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    modal.classList.remove('modal--opened');
  })
}

