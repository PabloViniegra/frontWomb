let password, idUser;
let name = document.getElementById('validationName')
let lastname = document.getElementById('validationLastName')
let username = document.getElementById('validationUsername')
let email = document.getElementById('validationEmail')
let select = document.querySelector('#selectCountriesValidation')
const options = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}
let URL_SYSTEM_LOGIN = 'http://localhost:8080/womb/system/users/'
window.onload = async () => {
    manageSession()
    searchWomb()
    await loadSelectCountries()
    getAccountAndFillInputs()
    updateUser()
    checkIfPasswordIsCorrect()

}

async function checkIfPasswordIsCorrect() {
    let actualPass = document.querySelector('#actualPassword')
    let hiddenForm = document.querySelector('#trueFormChangePass')
    hiddenForm.setAttribute('class', 'invisible')
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    document.querySelector('#formChangePass').addEventListener('submit', async (e) => {
        e.preventDefault()
        if (actualPass.value != '') {
            let body = {
                username: localStorage.getItem('username'),
                password: actualPass.value
            }
            await axios.post(BASE_URL + 'checkPassword', body)
                .then(response => {
                    if (response.status == 200) {
                        hiddenForm.setAttribute('class', 'visible')
                        unlockPasswordChange()
                    } else if (response.status == 204) {
                        document.querySelector('#debug').innerHTML = 'La contraseña es incorrecta'
                    } else {
                        document.querySelector('#debug').innerHTML = 'Ha ocurrido algun error inesperado'
                    }
                })
        } else {
            document.querySelector('#debug').innerHTML = 'No puede estar el campo vacío'
        }

    })

}

async function unlockPasswordChange() {
    let formChangePass = document.querySelector('#trueFormChangePass')
    let inputPass = document.querySelector('#newPassword')
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    formChangePass.addEventListener('submit', async (e) => {
        e.preventDefault()
        if (inputPass.value != '') {
            if (complexPassword(inputPass.value)) {
                let body = {
                    password: inputPass.value
                }
                await axios.patch(BASE_URL + 'users/' + idUser, body)
                    .then(response => {
                        console.log(response)
                    })
                await axios.patch(URL_SYSTEM_LOGIN + 'systemuser/' + localStorage.getItem('username'), body)
                    .then(response => {
                        console.log(response)
                        setTimeout(() => { location.reload() }, 500)
                    })
            } else {
                document.querySelector('#debugChangePass').innerHTML = 'La contraseña debe contener entre 6 y 20 caracteres que contengan al menos una minúscula, una mayúscula y un número'
            }
        } else {
            document.querySelector('#debugChangePass').innerHTML = 'El campo no puede estar vacío'
        }
    })

}

async function updateUser() {
    document.querySelector('#updateUser').addEventListener('submit', async (e) => {
        e.preventDefault()
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        let body = await fillBodyUser()
        let bodySystemUser = {
            username: body.username
        }
        await axios.put(BASE_URL + 'users/' + idUser, body)
            .then(response => {
                console.log(response.status)
            })
        await axios.patch(URL_SYSTEM_LOGIN + 'systemuser/' + localStorage.getItem('username'), bodySystemUser)
            .then(response => {
                console.log(response.status)
                setTimeout(() => { location.reload() }, 500)
            })

    })
}

async function fillBodyUser() {
    let body = {
        id: idUser,
        name: name.value,
        lastname: lastname.value,
        username: username.value,
        email: email.value,
        password: password,
        country: await fillCountry(idCountry)
    }
    return body
}

async function fillCountry(idCountry) {
    let country;
    await axios.get(BASE_URL + 'countries/' + select.value, options)
        .then(response => response = response.data)
        .then(response => {
            country = {
                id: select.value,
                iso: response.iso,
                nicename: response.nicename,
                name: response.name,
                iso3: response.iso3,
                numcode: response.numcode,
                phonecode: response.phonecode
            }
        })
    return country
}

async function getAccountAndFillInputs() {

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'username/' + localStorage.getItem('username'), options)

        .then(response => response = response.data)
        .then(response => {
            idUser = response.id
            idCountry = response.country.id
            select.value = response.country.id
            name.value = response.name
            lastname.value = response.lastname
            username.value = response.username
            password = response.password
            email.value = response.email
        })
}

async function manageSession() {
    if (localStorage.getItem('username') != undefined) {
        let username = localStorage.getItem('username');
        let txtuser = document.querySelector('#linkNavigationMainSession')
        txtuser.innerHTML = ''
        let txtRegister = document.querySelector('#linkNavigationMainRegister')
        txtRegister.innerHTML = ''
        let div = document.createElement('div')
        div.setAttribute('class', 'dropdown')
        txtuser.appendChild(div)
        let button = document.createElement('button')
        button.setAttribute('class', 'btn btn-secondary dropdown-toggle')
        button.setAttribute('type', 'button')
        button.setAttribute('id', 'dropdownMenuButton1')
        button.setAttribute('data-bs-toggle', 'dropdown')
        button.innerHTML = username
        div.appendChild(button)
        let ul = document.createElement('ul')
        ul.setAttribute('class', 'dropdown-menu')
        ul.setAttribute('aria-labelledby', 'dropdownMenuButton1')
        div.appendChild(ul)
        let li1 = document.createElement('li')
        ul.appendChild(li1)
        let a1 = document.createElement('a')
        a1.setAttribute('class', 'dropdown-item')
        a1.setAttribute('href', 'addWomb.html')
        a1.innerHTML = 'Añadir Womb'
        li1.appendChild(a1)

        let li2 = document.createElement('li')
        ul.appendChild(li2)
        let a2 = document.createElement('a')
        a2.setAttribute('class', 'dropdown-item')
        a2.setAttribute('href', 'configurationAccount.html')
        a2.innerHTML = 'Cuenta'
        li2.appendChild(a2)

        let li4 = document.createElement('li')
        ul.appendChild(li4)
        let a4 = document.createElement('a')
        a4.setAttribute('class', 'dropdown-item')
        a4.setAttribute('href', 'favouritesWombs.html')
        a4.innerHTML = 'Wombs Favoritos'
        li4.appendChild(a4)

        let li3 = document.createElement('li')
        ul.appendChild(li3)
        let a3 = document.createElement('a')
        a3.setAttribute('class', 'dropdown-item')
        a3.setAttribute('href', '#')
        a3.innerHTML = 'Cerrar Sesión'
        li3.appendChild(a3)

        a3.addEventListener('click', () => {
            localStorage.clear()
            setTimeout('location.reload(true);', 500)
        })
    }
}

async function searchWomb() {
    let form = document.querySelector('#formSearch')
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        if (document.querySelector('#inputSearch').value != '') {
            localStorage.setItem('keyword_search', document.querySelector('#inputSearch').value)
            setTimeout(() => { location.href = 'wombs_result_search.html' }, 500)
        } else {
            setTimeout(() => { location.reload() }, 500)
        }
    })
}