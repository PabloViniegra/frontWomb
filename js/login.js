const BASE_URL = 'http://localhost:8080/womb/api/'
let TOKEN = '';
const URL_LOGIN = 'http://localhost:8080/womb/system/users'
let idCountry;
let debug_register = document.querySelector('#debug_register')
let debug_login = document.querySelector('#debug_login')

//requests authentication from the API and saves it to the local Javascript storage
async function getAuthentication(username, password) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    }
    axios.post('http://localhost:8080/syslogin', {
        username: username,
        password: password
    }
    ).then(function (response) {
        TOKEN = response.headers.authorization
        localStorage.setItem('token', TOKEN)
    })
        .catch(function (error) {
            console.log(error);
        });

}

async function loadSelectCountries() {
    let select = document.getElementById('selectCountriesValidation');
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    try {

        const response = await axios.get(BASE_URL + 'countries', options)
        response.data.sort((a, b) => {
            return a.nicename.localeCompare(b.nicename)
        })
        response.data.forEach(element => {
            let option = document.createElement('option')
            option.innerHTML = element.nicename
            option.setAttribute('value', element.id)
            select.appendChild(option)
        });
    } catch (error) {
        console.error(error);
    }
}



async function addNewUser() {
    let form = document.getElementById('formUser')
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let select = document.getElementById('selectCountriesValidation')

        //Taking the value of the country selected
        idCountry = select.options[select.selectedIndex].value;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        let country;
        try {
            const response = await axios.get(BASE_URL + 'countries/' + idCountry, options)
            country = {
                id: idCountry,
                iso: response.data.iso,
                nicename: response.data.nicename,
                name: response.data.name,
                iso3: response.data.iso3,
                numcode: response.data.numcode,
                phonecode: response.data.phonecode
            }

        } catch (error) {
            console.error(error);
        }


        let name = document.getElementById('validationName')
        let lastname = document.getElementById('validationLastName')
        let username = document.getElementById('validationUsername')
        let password = document.getElementById('validationPassword')
        let repeatpass = document.getElementById('validationRepeatPass')
        let email = document.getElementById('validationEmail')
        let checkImg = document.getElementById('checkRegister');
        if (samePass(password.value, repeatpass.value) && checkInputs()
            && await checkDuplicatedNames()
            && complexPassword(password.value)
            && await checkUniqueEmail()
            && validateEmail(email.value)) {

            axios.post(BASE_URL + 'users', {
                name: name.value,
                lastname: lastname.value,
                email: email.value,
                username: username.value,
                password: password.value,
                country: {
                    id: country.id,
                    iso: country.iso,
                    nicename: country.nicename,
                    name: country.name,
                    iso3: country.iso3,
                    numcode: country.numcode,
                    phonecode: country.phonecode
                }
            })
                .then(function (response) {
                    checkImg.style.transition = '0.5s'
                    checkImg.style.display = 'block'
                })
                .catch(function (error) {
                    console.log(error);
                });

            axios.post(URL_LOGIN + "/signup", {
                username: username.value,
                password: password.value
            })
                .catch(function (error) {
                    console.log(error);
                });

        }
    })

}
//list of validations performed by the registry
function validateEmail(email) {
    const validation = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(validation)) {
        return true;
    } else {
        debug_register.innerHTML = 'Debes introducir una dirección de email válida';
        return false;
    }
}

function samePass(pass, repeatPass) {
    if (pass == repeatPass) {
        return true;
    } else {
        debug_register.innerHTML = 'La contraseña deben ser la misma'
        return false;
    }
}

function checkInputs() {
    let inputs = document.getElementsByTagName('input')
    let checking = true;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value == '') {
            checking = false;
            debug_register.innerHTML = 'Algun campo esta vacío. Rellénelo, por favor.'
            continue;
        }
    }
    return checking;
}

async function checkUniqueEmail() {
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    let checking = false;
    let email = document.getElementById('validationEmail')
    await axios.get(BASE_URL + 'find/email/' + email.value, options)
        .then(function (response) {
            if (response.status == 200) {
                checking = false;
                debug_register.innerHTML = 'Este email ya existe'
            } else if (response.status == 204) {
                checking = true;
            } else {
                console.log('Error in server. Not found user')
            }
        })

    return checking
}

async function checkDuplicatedNames() {
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    let username = document.getElementById('validationUsername')
    let checking = false;
    await axios.get(BASE_URL + 'find/user/' + username.value, options)
        .then(function (response) {
            if (response.status == 200) {
                checking = false
                debug_register.innerHTML = 'Este nombre de usuario ya ha sido escogido por otra persona'
            } else if (response.status == 204) {
                checking = true;
            } else {
                console.log('Error in server. Not found user')
            }
        })

    return checking;
}

function complexPassword(password) {
    let complexity = /^[A-Za-z]\w{7,14}$/;
    if (password.match(complexity)) {
        return true
    } else {
        debug_register.innerHTML = 'La contraseña debe contener entre 6 y 20 caracteres que contengan al menos una minúscula, una mayúscula y un número'
        return false;
    }
}

//login function
async function loginIntoWomb() {
    document.querySelector('#formLogin').addEventListener('submit', (e) => {
        e.preventDefault();
        let username = document.getElementById('inputEmailLogin')
        let password = document.getElementById('inputPasswordLogin')

        axios.post(BASE_URL + 'login', {
            username: username.value,
            password: password.value
        })
            .then(async function (response) {
                console.log('Código de respuesta: ' + response.status);
                if (response.status == 200) {
                    await getAuthentication(username.value, password.value)
                    localStorage.setItem('username', username.value)
                    //console.log(localStorage.getItem('token'))
                    setTimeout(() => {location.href = '../index.html'}, 1000);
                    
                }
            })
            .catch(function (error) {
                console.log(error)
                debug_login.innerHTML = 'Los datos son erróneos'
            });
    })

}