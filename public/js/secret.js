const secretForm = document.querySelector('.submit-secret');


const getsecret = async(secret, id) => {
    try{
        const res = await axios({
            method: 'POST',
            url: `/api/v1/users/${id}/secrets`,
            data: {
                secrets: secret
            }
        });

        if (res.data.status === 'success') {
            location.reload();
        }
    } catch (err) {
        // showAlert('error', err.response.data.message);
        console.log(err.response.data);
    }
};

if(secretForm) {
    // document.querySelector('.form').addEventListener('submit', event => {
        secretForm.addEventListener('submit', event => {
        event.preventDefault();
        const secret = document.getElementById('secret-field').value;
        const id = document.getElementById('secret-id').value;
        getsecret(secret, id);
    });
}