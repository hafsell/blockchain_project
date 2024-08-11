const axios = require('axios');

async function testCreateContract() {
    try {
        const response = await axios.post('http://34.70.10.73:3000/create-contract', {
            id: "1",
            test: "Hello World"
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Transaction ID:', response.data.transactionId);
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            console.log('Error:', error.response.data);
            console.log('Status:', error.response.status);
            console.log('Headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.log('Error:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error:', error.message);
        }
        console.log(error.config);
    }
}

testCreateContract();
