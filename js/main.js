window.onload = () => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('username' !== null)) {
        let username = localStorage.getItem('username');
        let txtuser = document.querySelector('#linkNavigationMainSession')
        console.log(username)
        txtuser.innerHTML = username;
        let txtRegister = document.querySelector('#linkNavigationMainRegister')
        txtRegister.innerHTML = ''
        
    }
}