const BASE_URL = 'http://localhost:8080/womb/api/'
let numberTotalPages;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let page = urlParams.get('page')
window.onload = async() => {
    manageSession()
    searchWomb()
    if (localStorage.getItem('keyword_search') != undefined) {
        await buildPagination()
        if (page != undefined) {
            loadResults(page)
        } else {
            loadDefaultResults()
        }
        
        
    } else {
        console.log('no session started')
    }
}

function drawContainerByServerResponse(response) {
    let container = document.querySelector('#resultsFound')
        response.forEach(element => {
            let div = document.createElement('div')
            div.style.border = '2px solid black'
            div.style.borderRadius = '10px'
            div.setAttribute('class', 'row p-3 border-black mb-5')
            let divimg = document.createElement('div')
            divimg.setAttribute('class', 'col-6')
            let img = document.createElement('img')
            img.setAttribute('widt', '300px')
            img.setAttribute('height', '300px')
            img.src = element.product.image
            divimg.appendChild(img)
            div.appendChild(divimg)
            let divcontent = document.createElement('div')
            divcontent.setAttribute('class', 'col-6 row justifiy-content-center p-2')
            div.appendChild(divcontent)
            let product = document.createElement('h3')
            product.setAttribute('class', 'col-8')
            product.innerHTML = element.product.name
            divcontent.appendChild(product)
            let user = document.createElement('h3')
            user.setAttribute('class', 'col-4')
            user.innerHTML = element.user.username
            divcontent.appendChild(user)
            let score = document.createElement('h6')
            score.setAttribute('class', 'col-12 text-center')
            score.innerHTML = 'Puntuación: ' + element.score
            let btn = document.createElement('button')
            btn.setAttribute('type', 'button')
            btn.setAttribute('height', '8px')
            btn.setAttribute('class', 'btn btn-outline-primary col-12 col-md-4')
            btn.innerHTML = 'Ver Womb'
            divcontent.appendChild(score)
            divcontent.appendChild(btn)
            container.appendChild(div)

            btn.addEventListener('click', () => {
                localStorage.setItem('see_womb', element.id)
                location.href = 'wombfile.html'
            })
        });
}

async function loadDefaultResults() {
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'womb/search/paginable/' + localStorage.getItem('keyword_search') + '?pageSize=' + numberTotalPages, options)
    .then (response => response = response.data)
    .then(response => {
        drawContainerByServerResponse(response)
    })
}

async function getNumberPages() {
    let numberPages;
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'womb/number/' + localStorage.getItem('keyword_search'), options)
    .then(response => numberPages = response.data)

    return numberPages
    
}

async function loadResults(i) {
    const options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    await axios.get(BASE_URL + 'womb/search/paginable/' + localStorage.getItem('keyword_search') + '?pageNo=' + i + '&pageSize=' + numberTotalPages, options)
    .then(response => response = response.data)
    .then(response => {console.log(response)})

}

async function buildPagination() {
    let numberPages = await getNumberPages();
    let calculatedNumber;
    if (numberPages <=5){
        calculatedNumber = 1;
    } else if (numberPages > 5) {
        calculatedNumber = Math.ceil(numberPages/5)
         
    } 
    numberTotalPages = calculatedNumber
    let footer = document.querySelector('#footerPagination')
    let nav = document.createElement('nav')
    nav.setAttribute('aria-label','Page navigation example')
    footer.appendChild(nav)
    let ul = document.createElement('ul')
    ul.setAttribute('class','pagination justify-content-center')
    nav.appendChild(ul)
    for (let i = 0; i <= calculatedNumber; i++) {
        let li = document.createElement('li')
        li.setAttribute('class','page-item')
        ul.appendChild(li)
        let a = document.createElement('a')
        a.setAttribute('class','page-link')
        li.appendChild(a)
        a.href = 'wombs_result_search.html?page=' + i
        a.innerHTML = i
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
        a1.setAttribute('href', 'views/addWomb.html')
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