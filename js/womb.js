const URL_CLOUDINARY = 'https://api.cloudinary.com/v1_1/cloudpablo/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'ulctvciu';
const BASE_URL = 'http://localhost:8080/womb/api/'
let review, score, date, user_id, user_name, user_lastname, user_email, user_username, user_password, country_id, country_iso, country_nicename, country_name, country_iso3, country_numcode, country_phonecode, product_image;
let favourites;
window.onload = () => {
    manageSession()
    searchWomb()
    if (localStorage.getItem('username') != undefined) {
        getUser(localStorage.getItem('username'))
        checkInputsEmptyExist();
        addWomb();
    } else {
        location.href = '../views/login.html'
    }
}



async function addWomb() {
    let form = document.querySelector('#formAddWomb')
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        let today = new Date().toISOString().slice(0, 10)
        let productName = document.querySelector('#productName')
        let categoryName = document.querySelector('#categoryName')
        let description = document.querySelector('#description')
        let brandName = document.querySelector('#brandName')
        let reviewWomb = document.querySelector('#reviewWomb')
        let scoreWomb = document.querySelector('#scoreWomb')
        let checkImageWomb = document.getElementById('imgOkSuccesful')
        const body = {
            review: reviewWomb.value,
            score: scoreWomb.value,
            date: today,
            user: {
                id: user_id,
                name: user_name,
                lastname: user_lastname,
                email: user_email,
                username: user_username,
                password: user_password,
                country: {
                    id: country_id,
                    iso: country_iso,
                    nicename: country_nicename,
                    name: country_name,
                    iso3: country_iso3,
                    numcode: country_numcode,
                    phonecode: country_phonecode
                }
            },
            product: {
                name: productName.value,
                image: product_image,
                category: {
                    name: categoryName.value,
                    description: description.value
                },
                brand: {
                    name: brandName.value
                }
            } 
        }
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        await axios.post(BASE_URL + 'womb', body)
        .then (response => {
            if (response.status == 200) {
                checkImageWomb.style.transition = '0.5s'
                checkImageWomb.style.display = 'block'
            }
        })

    })
}

document.querySelector('#imgProduct').addEventListener('change', async (e) => {
    let file = e.target.files[0]
    let formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    delete axios.defaults.headers.common["Authorization"];
    let response = await axios.post(URL_CLOUDINARY, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    product_image = response.data.secure_url
})

async function getUser(username) {
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'username/' + username, options)
        .then(response => {
            user_id = response.data.id
            user_name = response.data.name
            user_lastname = response.data.lastname
            user_email = response.data.email
            user_username = response.data.username
            user_password = response.data.password
            country_id = response.data.country.id
            country_iso = response.data.country.iso
            country_iso3 = response.data.country.iso3
            country_name = response.data.country.name
            country_nicename = response.data.country.nicename
            country_numcode = response.data.country.numcode
            country_phonecode = response.data.country.phonecode
        })
}

function checkInputsEmptyExist() {
    let inputs = document.getElementsByTagName('input')
    let textareas = document.getElementsByTagName('textarea')
    let check = false
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value = '') {
            console.log(inputs[i].id)
        }
    }
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
        button.innerHTML = '<i class="fas fa-user"></i>' + username
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
    } else {
        location.href = 'login.html'
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