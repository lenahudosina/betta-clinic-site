(() => {
  const form = document.getElementById('tax-form');
  if (!form) return;

  const samePerson = document.getElementById('tax-same-person');
  const patientFields = document.getElementById('tax-patient-fields');
  const email = document.getElementById('tax-email');
  const status = document.getElementById('tax-form-status');
  const yearsError = document.getElementById('tax-years-error');
  const years = Array.from(form.querySelectorAll('input[name="years"]'));

  function updatePatientFields() {
    const separate = !samePerson.checked;
    patientFields.hidden = !separate;
    patientFields.querySelectorAll('input').forEach(input => {
      input.disabled = !separate;
      input.required = separate && ['patient-last-name', 'patient-first-name', 'patient-birth-date'].includes(input.name);
    });
  }

  function updateEmailRequirement() {
    email.required = form.querySelector('input[name="delivery"]:checked')?.value === 'email';
  }

  samePerson.addEventListener('change', updatePatientFields);
  form.querySelectorAll('input[name="delivery"]').forEach(input =>
    input.addEventListener('change', updateEmailRequirement)
  );
  years.forEach(input => input.addEventListener('change', () => {
    yearsError.hidden = years.some(year => year.checked);
  }));
  form.addEventListener('input', () => { status.textContent = ''; });
  form.addEventListener('submit', event => event.preventDefault());

  document.getElementById('tax-check-button').addEventListener('click', () => {
    status.textContent = '';
    if (!form.reportValidity()) return;
    if (!years.some(year => year.checked)) {
      yearsError.hidden = false;
      years[0].focus();
      return;
    }
    yearsError.hidden = true;
    status.textContent = 'Поля заполнены. Отправка заявления в клинику пока не подключена; ваши данные не сохраняются.';
  });

  updatePatientFields();
  updateEmailRequirement();
})();
