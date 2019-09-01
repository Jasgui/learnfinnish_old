const button = document.getElementById('button');
import HttpService from '/services/http-service.js';

const http = new HttpService();



button.onclick = function () {

    http.getproducs();
};
