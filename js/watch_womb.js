const BASE_URL = 'http://localhost:8080/womb/api/'
let id;

window.onload = () => {
    if (localStorage.getItem('see_womb') != undefined) {
        id = localStorage.getItem('see_womb')
        console.log(localStorage.getItem('token'))
        getWomb(id)
    } else {
        console.log('id is undefined')
    }
}

async function getWomb(id) {
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'womb/' + id, options)
        .then(response => {
            console.log(response.data)
            response = response.data
            let mainContainer = document.querySelector('#watchWomb')
            let div_img = document.createElement('div')
            div_img.setAttribute('class', 'col-6')
            let img = document.createElement('img')
            img.setAttribute('width','500px')
            img.setAttribute('height','500px')
            img.src = response.product.image
            div_img.appendChild(img)
            mainContainer.appendChild(div_img)

        })
}