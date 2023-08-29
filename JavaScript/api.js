function getApi() {
    const apiUrl = 'http://api.exchangeratesapi.io/v1/latest?access_key=e413324d662c02251a509537e4ba1585';

    fetch(apiUrl, { mode: 'no-cors' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hiba történt a kérés során.');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Hiba történt:', error);
        });
}