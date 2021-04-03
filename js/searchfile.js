window.onload = () => {
    if (localStorage.getItem('results_found') != undefined) {
        let response = JSON.parse(localStorage.getItem('results_found'))
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
    } else {
        console.log('no session started')
    }
}