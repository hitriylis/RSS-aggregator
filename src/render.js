const elements = {
  form: document.querySelector('form'),
  lngButton: document.querySelector('#lng'),
  modal: document.getElementById('modal'),
  feedList: document.querySelector('#feedList'),
  contentList: document.querySelector('#contentList'),
  errorMessage: document.querySelector('.feedback'),
  sumbitButton: document.querySelector('#submitButton'),
  input: document.querySelector('input'),
  getInterfaceLanguages: () => document.querySelectorAll('[data-i18n]'),
  formReset: document.querySelector('form'),
};

export default elements;
