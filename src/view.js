const render = (state) => {
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const paragraph = document.querySelector('.feedback');

  if (state.validateError.length !== 0) {
    input.classList.add('is-invalid');
    paragraph.textContent = state.validateError;
    paragraph.classList.remove('text-success');
    paragraph.classList.add('text-danger');
  } else {
    paragraph.textContent = 'RSS успешно загружен';
    input.classList.remove('is-invalid');
    paragraph.classList.remove('text-danger');
    paragraph.classList.add('text-success');
    form.reset();
    input.focus();
  }
};

export default render;
