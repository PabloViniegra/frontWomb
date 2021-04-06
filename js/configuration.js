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

window.onload = async () => {
    manageSession()
    searchWomb()
    await loadSelectCountries()
    getAccountAndFillInputs()
    updateUser()


}

async function updateUser() {
    document.querySelector('#updateUser').addEventListener('submit', async (e) => {
        e.preventDefault()
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        let body = await fillBodyUser()
        await axios.put(BASE_URL + 'users/' + idUser, body)
            .then(response => {
                setTimeout(() => {location.reload()},500)
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
            await axios.get(BASE_URL + 'womb/search/' + document.querySelector('#inputSearch').value, options)
                .then(response => response = response.data)
                .then(response => {
                    localStorage.setItem('results_found', JSON.stringify(response))
                    setTimeout(() => { location.href = 'views/wombs_result_search.html' }, 500)
                })
        } else {
            setTimeout(() => { location.reload() }, 500)
        }
    })
}