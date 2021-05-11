const BASE_URL = 'http://localhost:8080/womb/api/'
const options = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
let footer = document.getElementById('footerPaginationFavourites')
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let page = urlParams.get('page')
let numberTotalPages
let container = document.querySelector('#containerFavourites')

window.onload = () => {
    manageSession()
    searchWomb()
    if (localStorage.getItem('username') != undefined) {
        let title = document.querySelector('#headerTitle')
        title.innerHTML = 'Wombs favoritos de ' + localStorage.getItem('username')
        buildPaginationFavourites()
        if (page != undefined) {
            loadPageFavourites(page)
        } else {
            loadDefaultFavourites()
        }

    } else {
        location.href = 'login.js'
    }
}

async function loadDefaultFavourites() {

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'womb/favourites/pageable/' + localStorage.getItem('username') + '?pageSize=5', options)
        .then(response => response = response.data)
        .then(response => {
            drawContainerFavourites(response, container)
        })

}

async function loadPageFavourites(page) {

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'womb/favourites/pageable/' + localStorage.getItem('username') + '?pageNo=' + page + '&pageSize=5', options)
        .then(response => response = response.data)
        .then(response => {
            drawContainerFavourites(response, container)
        })

}
async function getNumberFavouritesWomb() {
    let numberItems;
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'womb/favourites/number/' + localStorage.getItem('username'), options)
        .then(response => response = response.data)
        .then(response => {
            numberItems = response
        })
    return numberItems
}

async function buildPaginationFavourites() {
    let numberPagesFavourites = await getNumberFavouritesWomb();
    let numberDefinitive;
    if (numberPagesFavourites <= 5) {
        numberDefinitive = 1;
    } else if (numberPagesFavourites > 5) {
        numberDefinitive = Math.ceil(numberPagesFavourites / 5)

    }
    numberTotalPages = numberDefinitive
    let nav = document.createElement('nav')
    nav.setAttribute('aria-label', 'Page navigation example')
    footer.appendChild(nav)
    let ul = document.createElement('ul')
    ul.setAttribute('class', 'pagination justify-content-center')
    nav.appendChild(ul)
    for (let i = 0; i < numberDefinitive; i++) {
        let li = document.createElement('li')
        li.setAttribute('class', 'page-item')
        ul.appendChild(li)
        let a = document.createElement('a')
        a.setAttribute('class', 'page-link')
        li.appendChild(a)
        a.href = 'favouritesWombs.html?page=' + i
        a.innerHTML = i + 1
    }

}

function drawContainerFavourites(response, container) {

    response.forEach(element => {
        let div = document.createElement('div')
        div.style.border = '2px solid black'
        div.style.borderRadius = '1em'
        div.style.boxShadow = '4px 4px 0 black'
        div.style.marginBottom = '1em'
        div.addEventListener('mouseover', () => {
            div.style.backgroundColor = '#f1b0b7'
        })
        div.addEventListener('mouseout', () => {
            div.style.backgroundColor = 'white'
        })
        div.setAttribute('class', 'col-12 row justify-content-around align-items-center')
        container.appendChild(div)
        let p = document.createElement('h4')
        p.setAttribute('class', 'col-12 col-md-3')
        p.innerHTML = element.user.username
        div.appendChild(p)
        let img = document.createElement('img')
        img.setAttribute('class', 'col-12 col-md-3 img-fluid img-thumbnail')
        img.setAttribute('widt', '300px')
        img.setAttribute('height', '300px')
        img.style.border = '1px solid black'
        img.src = element.womb.product.image
        div.appendChild(img)
        let username = document.createElement('p')
        username.style.fontFamily = 'Times New Romans'
        username.style.fontSize = '20px'
        username.setAttribute('class', 'col-12 col-md-3 text-center')
        username.innerHTML = element.womb.product.name
        div.appendChild(username)
        let button = document.createElement('button')
        button.setAttribute('class', 'col-12 col-md-3 btn btn-outline-info')
        button.innerHTML = 'Quitar de favoritos'
        div.appendChild(button)
        button.addEventListener('click', () => {
            removeFavourite(element.id)
        })
    });
}

async function removeFavourite(id) {
    const headers = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('token'),
            'mode': 'no-cors'
        }
    }
    await fetch(BASE_URL + 'favourites/' + id, headers)
        .then(response => {
            console.log(response.status)
            setTimeout(() => { location.reload() }, 500)
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