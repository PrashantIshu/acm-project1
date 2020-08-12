const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.logout-btn');

const login = async(email, password) => {
    console.log(email, password);
    try{
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email: email,
                password: password
            }
        });

        if (res.data.status === 'success') {
            // alert("Logged in successfully!");
            // res.redirect('/api/v1/users/my-secrets');
            
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
              location.assign('/my-secrets');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
        // console.log(err.response.data);
    }
};

if(loginForm) {
    // document.querySelector('.form').addEventListener('submit', event => {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.getElementById('email-field').value;
        const password = document.getElementById('pass-field').value;
        login(email, password);
    });
}

/////////////////////////POP-UP MESSAGE/////////////////////////////
const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};
  
//   type is 'success' or 'error'
const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
};

//////////////////////////////// LOG OUT ////////////////////////////////
if(logOutBtn) {
    document.querySelector('.logout-btn').addEventListener('click', event => {
        logout();
    });
}

const logout = async() => {
    try {
        console.log("Hello from the logout button");
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout'
        });
        if(res.data.status === "success") {
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch(err) {
        console.log(err.response);
        showAlert('error', 'Error logging out! Try again.');
    }
};
