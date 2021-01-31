async function loadSelectCountries() {
    let select = document.getElementById('selectCountriesValidation');
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    try {
        
        const response = await axios.get('https://rickandmortyapi.com/api/character', options)
        response.data.results.sort((a,b) => {
            return a.name.localeCompare(b.name)
        })
        response.data.results.forEach(element => {
            let option = document.createElement('option')
            option.innerHTML = element.name
            option.setAttribute('value', element.id)
            select.appendChild(option)
        });
    } catch (error) {
        console.error(error);
    }
}