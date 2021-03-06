const BASE_URL = 'http://localhost:8080/womb/api/'
let numberItems;
let numberTotalPages;
let container = document.getElementById('containerMyWombs')
const options = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let page = urlParams.get('page')

window.onload = async () => {
    manageSession()
    searchWomb()
    if (localStorage.getItem('username') != undefined) {
        await buildPaginationMyWombs()
        if (page != undefined) {
            loadMyWombs(page)
        } else {
            loadDefaultWombs()
        }

    } else {
        location.href = 'login.html'
    }
}

async function getListNumber() {
    let numberItemsWomb
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'womb/user/number/' + localStorage.getItem('username'), options)
        .then(response => response = response.data)
        .then(response => {
            numberItemsWomb = response
        })
    return numberItemsWomb
}

async function buildPaginationMyWombs() {
    let numberPagesWomb = await getListNumber();
     let numberDefinitive;
     if (numberPagesWomb <= 5) {
         numberDefinitive = 1;
     } else if (numberPagesWomb > 5) {
         numberDefinitive = Math.ceil(numberPagesWomb / 5)

     }
     console.log(numberPagesWomb)
     console.log(numberDefinitive)
     numberTotalPages = numberDefinitive
     let footer = document.querySelector('#footerPaginationUserWomb')
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
         a.href = 'mywombs.html?page=' + i
         a.innerHTML = i + 1
     }

}

async function drawResponse(response) {
    response.forEach(element => {
        let div = document.createElement('div')
        div.style.border = '2px solid black'
        div.style.boxShadow = '4px 4px 0 black'
        div.style.borderRadius = '10px'
        div.setAttribute('class', 'col-12 row p-3 border-black mb-5')
        let divimg = document.createElement('div')
        divimg.setAttribute('class', 'col-12 col-md-6 text-center')
        let img = document.createElement('img')
        img.setAttribute('class','img-fluid img-thumbnail')
        img.setAttribute('widt', '300px')
        img.setAttribute('height', '300px')
        img.src = element.product.image
        divimg.appendChild(img)
        div.appendChild(divimg)
        let divcontent = document.createElement('div')
        divcontent.setAttribute('class', 'col-12 col-md-6 row justifiy-content-center p-2')
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
        btn.setAttribute('class', 'btn btn-outline-primary col-12 col-md-4 text-center p-3 mt-5')
        btn.innerHTML = 'Ver Womb'
        divcontent.appendChild(score)
        div.appendChild(btn)
        container.appendChild(div)
        let confirmationId = 'confirmation-delete-' + element.id
        let btnDelete = document.createElement('button')
        btnDelete.setAttribute('type','button')
        btnDelete.setAttribute('height','8px')
        btnDelete.setAttribute('class','btn btn-outline-primary col-12 col-md-4 text-center p-3 mt-5')
        btnDelete.setAttribute('data-bs-toggle','modal')
        btnDelete.setAttribute('data-bs-target','#exampleModal' + element.id)
        btnDelete.innerHTML = '<i class="fas fa-trash-alt"></i>'
        div.appendChild(btnDelete)
        btn.addEventListener('click', () => {
            localStorage.setItem('see_womb', element.id)
            location.href = 'wombfile.html'
        })
        buildModal(element.id, div, confirmationId)
        
    });

}

function buildModal(id, div, confirmationId) {
    let divMain = document.createElement('div')
    divMain.setAttribute('class','modal fade')
    divMain.setAttribute('id','exampleModal' + id)
    divMain.setAttribute('tabindex','-1')
    divMain.setAttribute('aria-labelledby','exampleModalLabel')
    divMain.setAttribute('aria-hidden','true')
    let divDialog = document.createElement('div')
    divDialog.setAttribute('class','modal-dialog')
    divMain.appendChild(divDialog)
    let divContent = document.createElement('div')
    divContent.setAttribute('class','modal-content')
    divDialog.appendChild(divContent)
    let header = document.createElement('div')
    header.setAttribute('class','modal-header')
    divContent.appendChild(header)
    let textHeader = document.createElement('h5')
    textHeader.setAttribute('class','modal-title')
    textHeader.setAttribute('id','exampleModalLabel')
    textHeader.innerHTML = 'Confirmación'
    header.appendChild(textHeader)
    let btnClose = document.createElement('button')
    btnClose.setAttribute('type','button')
    btnClose.setAttribute('class','btn-close')
    btnClose.setAttribute('data-bs-dismiss','modal')
    btnClose.setAttribute('aria-label','Close')
    header.appendChild(btnClose)
    let divBody = document.createElement('div')
    divBody.setAttribute('class','modal-body')
    divBody.innerHTML = '¿Seguro que quieres borrar este Womb?'
    divContent.appendChild(divBody)
    let divFooter = document.createElement('div')
    divFooter.setAttribute('class','modal-footer')
    let btnNo = document.createElement('button')
    btnNo.setAttribute('type','button')
    btnNo.setAttribute('class','btn btn-primary')
    btnNo.setAttribute('data-bs-dismiss','modal')
    btnNo.innerHTML = 'No'
    divFooter.appendChild(btnNo)
    let btnYes = document.createElement('button')
    btnYes.setAttribute('type','button')
    btnYes.setAttribute('class','btn btn-primary')
    btnYes.setAttribute('id',confirmationId)
    btnYes.innerHTML = 'Si'
    divFooter.appendChild(btnYes)
    divContent.appendChild(divFooter)
    div.appendChild(divMain)
    btnYes.addEventListener('click', () => {
        deleteWomb(id)
    })

}

async function loadDefaultWombs() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'womb/user/paginable/' + localStorage.getItem('username') + '?pageSize=5&sortBy=product.name', options)
        .then(response => response = response.data)
        .then(response => {
            drawResponse(response);
        })
}


async function deleteWomb(id) {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.delete(BASE_URL + 'womb/' + id)
    .then(response => {
        setTimeout(() => { location.reload() }, 1000)
    })
}


async function loadMyWombs(page) {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    await axios.get(BASE_URL + 'womb/user/paginable/' + localStorage.getItem('username') + '?pageNo=' + page + '&pageSize=5', options)
        .then(response => response = response.data)
        .then(response => {
            drawResponse(response);
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