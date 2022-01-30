
const forms = (formsSelector) => {

    const form = document.querySelectorAll(formsSelector);

    form.forEach(item => {
        bindForms(item);
    });

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });

        let error = new Error();
        if (!res.ok) {
            throw error;
        }

        return await(res);
    }

    function bindForms(form) {

       form.addEventListener('submit', (e) => {
           e.preventDefault();

           const formData = new FormData(form);
        
           postData('php/send.php', formData)
           .then(data => console.log(data.ok))
           .catch(() => console.log('error'));
       });
    }

}

export default forms;