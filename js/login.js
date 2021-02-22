const BASE_URL = 'http://localhost:8080/womb/api/'
let idCountry;

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

    //Doing the POST

    let name = document.getElementById('validationName')
    let lastname = document.getElementById('validationLastName')
    let username = document.getElementById('validationUsername')
    let password = document.getElementById('validationPassword')
    let repeatpass = document.getElementById('validationRepeatPass')
    let email = document.getElementById('validationEmail')
    let checkImg = document.getElementById('checkRegister');
    if (password.value == repeatpass.value && checkInputs()
        && await checkDuplicatedNames()
        && complexPassword()) {
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
                console.log(response.status);
                checkImg.style.transition = '0.5s'
                checkImg.style.display = 'block'
            })
            .catch(function (error) {
                console.log(error);
            });

    } else {
        alert('La contraseña tiene que ser la misma. Por favor, revíselo.')
    }


}

function checkInputs() {
    let inputs = document.getElementsByTagName('input')
    let checking = true;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value == '') {
            checking = false;
            alert('Algun campo esta vacío. Rellénelo, por favor.')
            continue;
        }
    }
    return checking;
}

async function checkDuplicatedNames() {
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    let aux;
    let checking = true;
    await axios.get(BASE_URL + 'users', options)
        .then(function (response) {
            aux = response.data;
            let i = 0;
            while (i < aux.length && checking) {
                if (aux[i].username == document.getElementById('validationUsername').value) {
                    checking = false;
                    alert('Ese nombre de usuario ya ha sido escogido por otra persona.')
                }
                i++;
            }
        })
        .catch(function (error) {
            console.log(error);
        })



    return checking;

}

function complexPassword() {
    let checking = true;
    if (document.getElementById('validationPassword').value.length < 6) {
        checking = false;
        alert('La contraseña debe tener al menos 6 caracteres')
    }
    return checking;
}



async function loginIntoWomb() {
    document.querySelector('#formLogin').addEventListener('submit', (e) => {
        e.preventDefault();
        let username = document.getElementById('inputEmailLogin')
        let password = document.getElementById('inputPasswordLogin')

        axios.post(BASE_URL + 'login', {
            username: username.value,
            password: password.value
        })
            .then(function (response) {
                console.log('Código de respuesta: ' + response.status);
                if (response.status == 200) {
                    location.href = '../index.html'
                } 
            })
            .catch(function (error) {
                alert('Ese usuario no existe')
            });
    })

}