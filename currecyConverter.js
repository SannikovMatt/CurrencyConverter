document.addEventListener('DOMContentLoaded', () => {
    'use strict';


    const form = document.getElementById('converter__form'),
        output = document.querySelector('.output'),
        amount = document.getElementById('amount'),
        putUp = document.querySelector('.put__up');




    const currencyRequest = (curName) => {

        let url = `https://api.exchangeratesapi.io/latest?base=${curName}`;

        return fetch(url, { mode: 'cors' });

    };

    let convert = (neededCurency, { rates }, amount) => {
        output.value = rates[neededCurency] * amount;
        putUp.classList.add('active');
    };

    const getFormData = () => {
        output.value = 0;
        putUp.classList.remove('active');

        let formData = new FormData(form),
            actualCurrency,
            neededCurrency,
            amount;

        for (let data of formData.entries()) {

            if (data[0] === 'to__convert__currency' && parseInt(data[1]) !== 0) {

                actualCurrency = data;
            } else if (data[0] === 'currency__to__get' && parseInt(data[1]) !== 0) {
                neededCurrency = data[1].toUpperCase();

            } else if (data[0] === 'to__convert__amount' && data[1] !== '' && data[1] > 0) {

                amount = data[1];
            }



        }

        if (!(actualCurrency && neededCurrency && amount)) { return; }
        if (actualCurrency[1] === neededCurrency) {
            output.value = amount;
            putUp.classList.add('active');
            return;
        }



        currencyRequest(actualCurrency[1])
            .then(response => {
                if (!response.ok) {
                    Promise.reject('Server error...');
                    return;                }
                return response.json();
            })
            .then(rates => convert(neededCurrency, rates, amount))
            .catch(error => console.error('Возникла ошибка > ',error));
    };

    const putUpResult = (e) => {

        let inputAmount = document.querySelector('#amount'),
            inputCurrencies = document.querySelector('#currencies__input'),
            resultCurrencies = document.querySelector('#currencies__result'),
            outputResult = document.querySelector('.output'),
            temp = inputCurrencies.value;


        inputAmount.value = outputResult.value;

        inputCurrencies.value = resultCurrencies.value;
        resultCurrencies.value = temp;

        getFormData();

    };

    const init = () => {
        form.addEventListener('change', getFormData);
        amount.addEventListener('input', () => amount.value = amount.value.replace(/[^0-9 .{1}]/g, ''));
        putUp.addEventListener('click', putUpResult);
    };

    init();








})
