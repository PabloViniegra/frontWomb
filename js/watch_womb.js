const BASE_URL = 'http://localhost:8080/womb/api/'
let id;
let responseWomb;
let actualUser;

window.onload = () => {
    if (localStorage.getItem('see_womb') != undefined) {
        id = localStorage.getItem('see_womb')
        getWomb(id)
        getUser(localStorage.getItem('username'));
        loadCommentariesOfThisWomb()
    } else {
        console.log('id is undefined')
    }
}

async function loadCommentariesOfThisWomb() {
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    let blockComment = document.querySelector('#commentaries')
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'commentaries/womb/' + id)
        .then(response => {
            console.log(response.data)
            response.data.forEach(element => {
                if (response != '') {
                    let div = document.createElement('div')
                    div.setAttribute('class', 'row col-12 justify-content-center mb-3')
                    div.style.padding = '1em'
                    div.style.border = '2px solid #e73c7e'
                    div.style.borderRadius = '1em'
                    blockComment.appendChild(div)
                    let user = document.createElement('p')
                    user.setAttribute('class', 'col-4')
                    user.innerHTML = element.user.username
                    div.appendChild(user)
                    let date = document.createElement('p')
                    date.setAttribute('class', 'col-4')
                    date.innerHTML = element.date.substring(0,11)
                    div.appendChild(date)
                    let country = document.createElement('p')
                    country.setAttribute('class', 'col-4')
                    country.innerHTML = element.user.country.nicename
                    div.appendChild(country)
                    let commentary = document.createElement('p')
                    commentary.setAttribute('class', 'col-12 text-center mt-1')
                    commentary.innerHTML = element.commentary
                    div.appendChild(commentary)
                }
            });
        })
}

async function getWomb(id) {
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'womb/' + id, options)
        .then(response => {
            response = response.data
            responseWomb = response
            let mainContainer = document.querySelector('#watchWomb')
            let cardWomb = document.createElement('div')
            cardWomb.setAttribute('class', 'womb-card')
            let colImg = document.createElement('div')
            cardWomb.appendChild(colImg)
            colImg.setAttribute('class', 'col-6 row justify-content-center')
            let img = document.createElement('img')
            img.src = response.product.image
            colImg.appendChild(img)
            let colContent = document.createElement('div')
            cardWomb.appendChild(colContent)
            colContent.setAttribute('class', 'col-6 row justify-content-center align-items-center')
            let productTitle = document.createElement('h1')
            productTitle.innerHTML = response.product.name
            colContent.appendChild(productTitle)
            let bar = document.createElement('hr')
            colContent.appendChild(bar)
            let dataDiv = document.createElement('div')
            colContent.appendChild(dataDiv)
            dataDiv.setAttribute('class', 'col-12 row justify-content-around')
            let date = document.createElement('p')
            date.setAttribute('class', 'col-4')
            date.innerHTML = response.date.substring(0, 11)
            dataDiv.appendChild(date)
            let categoryProduct = document.createElement('p')
            categoryProduct.setAttribute('class', 'col-4')
            categoryProduct.innerHTML = response.product.category.name
            dataDiv.appendChild(categoryProduct)
            let brand = document.createElement('p')
            brand.setAttribute('class', 'col-4')
            brand.innerHTML = response.product.brand.name
            dataDiv.appendChild(brand)
            let contentDiv = document.createElement('div')
            contentDiv.setAttribute('class', 'col-12 text-center')
            colContent.appendChild(contentDiv)
            let review = document.createElement('p')
            review.innerHTML = response.review
            contentDiv.appendChild(review)
            let footerDiv = document.createElement('div')
            footerDiv.setAttribute('class', 'col-12 row')
            colContent.appendChild(footerDiv)
            let score = document.createElement('div')
            score.setAttribute('class', 'col-6')
            score.innerHTML = 'Puntuación: ' + response.score
            footerDiv.appendChild(score)
            let user = document.createElement('div')
            user.setAttribute('class', 'col-6')
            user.innerHTML = response.user.username
            footerDiv.appendChild(user)
            mainContainer.appendChild(cardWomb)
        })
}

function fillBodyWomb(response, commentary, date, actualUser) {
    let body = {
        commentary: commentary,
        date: date,
        user: {
            id: actualUser.id,
            name: actualUser.name,
            lastname: actualUser.lastname,
            email: actualUser.email,
            username: actualUser.username,
            password: actualUser.password,
            country : {
                id: actualUser.country.id,
                iso: actualUser.country.iso,
                nicename: actualUser.country.nicename,
                name: actualUser.country.name,
                iso3: actualUser.country.iso3,
                numcode: actualUser.country.numcode,
                phonecode: actualUser.country.phonecode
            } 
        },
        womb: {
            id: response.id,
            review: response.review,
            score: response.score,
            date: response.date,
            user: {
                id: response.user.id,
                name: response.user.name,
                lastname: response.user.lastname,
                email: response.user.email,
                username: response.user.username,
                password: response.user.password,
                country: {
                    id: response.user.country.id,
                    iso: response.user.country.iso,
                    nicename: response.user.country.nicename,
                    name: response.user.country.name,
                    iso3: response.user.country.iso3,
                    numcode: response.user.country.numcode,
                    phonecode: response.user.country.phonecode
                }
            },
            product: {
                name: response.product.name,
                image: response.product.image,
                category: {
                    name: response.product.category.name,
                    description: response.product.category.description
                },
                brand: {
                    name: response.product.brand.name
                }
            },
            favouritesWomb: []
        }
    }
    console.log(body)
    return body;
}

document.querySelector('#btnPushCommentary').addEventListener('click', async() => {
    let input = document.querySelector('#inputUserCommentary')
    let today = new Date().toISOString().slice(0, 10)
    if (input.value != '') {
        let body = await fillBodyWomb(responseWomb, input.value, today, actualUser)
        await axios.post(BASE_URL + 'commentaries', body)
            .then(response => {
                console.log(body)
                console.log(response.status)
                setTimeout(() => { location.reload() }, 1000)
            })
    } else {
        document.querySelector('#debug').innerHTML = 'No se puede publicar un comentario vacío.'
    }
})

async function getUser(username) {
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'username/' + username, options)
        .then(response => {
            actualUser = response.data
        })
}