const signupForm = document.querySelector('.form-signup');
// const logOutBtn = document.querySelector('.nav__el--logout');

const signup = async(name, email, password, confirmPassword) => {
    console.log(email, password);
    try{
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/signup',
            data: {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }
        });

        if (res.data.status === 'success') {
            // alert("Sign up successfull!");
            // res.redirect('/api/v1/users/my-secrets');
            
            showAlerts('success', 'Logged in successfully!');
            window.setTimeout(() => {
              location.assign('/my-secrets');
            }, 1200);
        }
    } catch (err) {
        showAlerts('error', err.response.data.message);
        // console.log(err.response.data);
    }
};

if(signupForm) {
    // document.querySelector('.form').addEventListener('submit', event => {
        signupForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('name-field').value;
        const email = document.getElementById('email-field').value;
        const password = document.getElementById('pass-field').value;
        const confirmPassword = document.getElementById('passConfirm-field').value;
        // const role = document.getElementsByClassName('role-field').value;
        signup(name, email, password, confirmPassword);
    });
}

///////////////////////POP-UP MESSAGE/////////////////////////////
const hideAlerts = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};
  
//   type is 'success' or 'error'
const showAlerts = (type, msg) => {
    hideAlerts();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlerts, 5000);
};

//////////////////////////////// LOG OUT ////////////////////////////////
// if(logOutBtn) {
//     document.querySelector('.nav__el--logout').addEventListener('click', event => {
//         logout();
//     });
// }

// const logout = async() => {
//     try {
//         console.log("Hello from the logout button");
//         const res = await axios({
//             method: 'GET',
//             url: 'http://localhost:3000/api/v1/users/logout'
//         });
//         if(res.data.status === "success") {
//             location.reload(true);
//         }
//     } catch(err) {
//         console.log(err.response);
//         showAlert('error', 'Error logging out! Try again.');
//     }
// };
