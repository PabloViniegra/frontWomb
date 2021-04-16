const BASE_URL = 'http://localhost:8080/womb/api/'
let id;
let responseWomb;
let actualUser;
let favourites;

window.onload = () => {
    manageSession()
    searchWomb()
    if (localStorage.getItem('see_womb') != undefined) {
        id = localStorage.getItem('see_womb')
        getWomb(id)
        getUser(localStorage.getItem('username'));
        checkFavourites(localStorage.getItem('username'), id)
        loadCommentariesOfThisWomb()
    } else {
        console.log('id is undefined')
    }
}

async function checkFavourites(username, idWomb) {
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'favourites/check/' + username + '/' + idWomb, options)
        .then(response => {
            if (response.status == 200) {
                document.querySelector('#iconFavourite').src = '../resources/img/star_shining.png'
                document.querySelector('#iconFavourite').setAttribute('favStatus', 'true')
            } else if (response.status == 204) {
                document.querySelector('#iconFavourite').src = '../resources/img/star.png'
                document.querySelector('#iconFavourite').setAttribute('favStatus', 'false')
            } else {
                console.log('server error')
            }
        })
}

async function getFavouritesByUser(username) {
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'favourites/user/' + username, options)
        .then(response => response = response.data)
        .then(response => favourites = response)
        .then(favourites => {
            console.log(favourites)
        })
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
                    date.innerHTML = element.date.substring(0, 11)
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
            let favouriteDiv = document.createElement('div')
            favouriteDiv.setAttribute('class', 'row col-3 justify-content-flex-end')
            footerDiv.appendChild(favouriteDiv)
            let favIcon = document.createElement('img')
            favIcon.setAttribute('id', 'iconFavourite')
            favIcon.addEventListener('click', () => {
                if (favIcon.getAttribute('favStatus') == 'true') {
                    removeFavourite(favIcon);
                } else {
                    addFavourite(favIcon);
                }
            })
            favouriteDiv.appendChild(favIcon)
            mainContainer.appendChild(cardWomb)
        })
}

async function getIdFav() {
    let idFav;
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('token')
    }
    await axios.get(BASE_URL + 'favourites/' + localStorage.getItem('username') + '/' + id, options)
        .then(response => response = response.data)
        .then(response => {
            idFav = response.id
        })
    return idFav
}

async function removeFavourite(favIcon) {
    let idFav = await getIdFav()
    const headers = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('token'),
            'mode': 'no-cors'
        }
    }
    await fetch(BASE_URL + 'favourites/' + idFav, headers)
        .then(response => {
            console.log(response.status)
        })
    favIcon.src = '../resources/img/star.png'
    favIcon.setAttribute('favStatus', 'false')
}

async function addFavourite(favIcon) {
    let today = new Date().toISOString().slice(0, 10)
    let body = {
        user: actualUser,
        womb: responseWomb,
        date: today
    }
    console.log(body)
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    axios.post(BASE_URL + 'favourites', body)
        .then(response => {
            if (response.status == 200) {
                favIcon.src = '../resources/img/star_shining.png'
                favIcon.setAttribute('favStatus', 'true')
            }
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
            country: {
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
            }
        }
    }
    console.log(body)
    return body;
}

document.querySelector('#btnPushCommentary').addEventListener('click', async () => {
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
            setTimeout(() => { location.href = 'wombs_result_search.html'}, 500)
        } else {
            setTimeout(() => { location.reload() }, 500)
        }
    })
}