const URL_CLOUDINARY = 'https://api.cloudinary.com/v1_1/cloudpablo/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'ulctvciu';
const BASE_URL = 'http://localhost:8080/womb/api/'
let review, score, date, user_id, user_name, user_lastname, user_email, user_username, user_password, country_id, country_iso, country_nicename, country_name, country_iso3, country_numcode, country_phonecode, product_image;
let favourites;
window.onload = () => {
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
            console.log(response.status)
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