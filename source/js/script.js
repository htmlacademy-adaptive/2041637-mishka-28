const menuButton = document.querySelector('.site-header__menu-button');
const menu = document.querySelector('.site-header__navigation');
menu.classList.remove('site-header__navigation--nojs');
menuButton.classList.remove('site-header__menu-button--nojs');

menuButton.addEventListener('click', () => {
  menu.classList.contains('site-header__navigation--visible') ?
  menu.classList.remove('site-header__navigation--visible') :
  menu.classList.add('site-header__navigation--visible');
})