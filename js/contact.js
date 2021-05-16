

window.onload = () => {
    if (localStorage.getItem('username') != undefined) {
        manageSession()
        searchWomb()
    } else {
        location.href = 'login.html'
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