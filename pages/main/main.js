const forms = Array.from(document.querySelectorAll('form'));
const req_btn = document.querySelector('.request');
const res_p = document.querySelector('.response');
const inp_n = document.querySelector('#N');

forms.forEach((form, i) => {
  const select_btn = forms[i].querySelector('.btn-label');
  const input = forms[i].querySelector('input');
  const submit_btn = forms[i].querySelector('.submit');
  select_btn.addEventListener('click', e => {
    e.preventDefault();
    input.dispatchEvent(new MouseEvent('click'));
  });
  
  submit_btn.addEventListener('click',  async e => {
    e.preventDefault();
    const response = await fetch(form.action, {
      method: 'POST',
      body: input.files[0]
    });
    console.log(typeof response);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(await response.blob());
    a.download = (i === 0) ? "my.zip" : input.files[0].name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
});

req_btn.addEventListener('click', async e => {
  const N = parseInt(inp_n.value);
  if (N > 332 && N < 33334) {
    req_btn.disabled = true;
    const response = await fetch(`/api/request/${N}`);
    const { result } = await response.json();
    res_p.textContent = `Перед '${result.string}' было передано ${result.V2} буферов.`;
    req_btn.disabled = false;
  }
  inp_n.value = '';
})
