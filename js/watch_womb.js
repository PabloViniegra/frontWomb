const BASE_URL = 'http://localhost:8080/womb/api/'
let id;

window.onload = () => {
    if (localStorage.getItem('see_womb') != undefined) {
        id = localStorage.getItem('see_womb')
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
            let cardWomb = document.createElement('div')
            cardWomb.setAttribute('class','womb-card')
            let colImg = document.createElement('div')
            cardWomb.appendChild(colImg)
            colImg.setAttribute('class','col-6 row justify-content-center')
            let img = document.createElement('img')
            img.src = response.product.image
            colImg.appendChild(img)
            let colContent = document.createElement('div')
            cardWomb.appendChild(colContent)
            colContent.setAttribute('class','col-6 row justify-content-center align-items-center')
            let productTitle = document.createElement('h1')
            productTitle.innerHTML = response.product.name
            colContent.appendChild(productTitle)
            let bar = document.createElement('hr')
            colContent.appendChild(bar)
            let dataDiv = document.createElement('div')
            colContent.appendChild(dataDiv)
            dataDiv.setAttribute('class','col-12 row justify-content-around')
            let date = document.createElement('p')
            date.setAttribute('class','col-4')
            date.innerHTML = response.date.substring(0,11)
            dataDiv.appendChild(date)
            let categoryProduct = document.createElement('p')
            categoryProduct.setAttribute('class','col-4')
            categoryProduct.innerHTML = response.product.category.name
            dataDiv.appendChild(categoryProduct)
            let brand = document.createElement('p')
            brand.setAttribute('class','col-4')
            brand.innerHTML = response.product.brand.name
            dataDiv.appendChild(brand)
            let contentDiv = document.createElement('div')
            contentDiv.setAttribute('class','col-12 text-center')
            colContent.appendChild(contentDiv)
            let review = document.createElement('p')
            review.innerHTML = response.review
            contentDiv.appendChild(review)
            let footerDiv = document.createElement('div')
            footerDiv.setAttribute('class','col-12 row')
            colContent.appendChild(footerDiv)
            let score = document.createElement('div')
            score.setAttribute('class','col-6')
            score.innerHTML = 'Puntuación: ' + response.score
            footerDiv.appendChild(score)
            let user = document.createElement('div')
            user.setAttribute('class','col-6')
            user.innerHTML = response.user.username
            footerDiv.appendChild(user)
            mainContainer.appendChild(cardWomb)

        })

}