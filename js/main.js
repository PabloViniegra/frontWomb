window.onload = () => {
    if (localStorage.getItem('username') != undefined) {
        let username = localStorage.getItem('username');
        let txtuser = document.querySelector('#linkNavigationMainSession')
        txtuser.innerHTML = username;
        let txtRegister = document.querySelector('#linkNavigationMainRegister')
        txtRegister.innerHTML = ''
        
    } else {
        
    }
}