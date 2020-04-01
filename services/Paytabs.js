const paytabs = require('paytabs_api');
const config = require('../config/config');
const fs = require('fs');
class Paytabs {
    async createPage(req, res) {
        try {
            paytabs.createPayPage({
                'merchant_email': config.paytab_merchant_email,
                'secret_key': config.paytab_secret_key,
                'currency': 'USD', //change this to the required currency
                'amount': '10', //change this to the required amount
                'site_url': config.base_url, //change this to reflect your site
                'title': 'Order for Shoes', //Change this to reflect your order title
                'quantity': 1, //Quantity of the product
                'unit_price': 10, //Quantity * price must be equal to amount
                'products_per_title': 'Shoes | Jeans', //Change this to your products
                'return_url': config.base_url + 'paytabs/returnUrl', //This should be your callback url
                'cc_first_name': 'Samy', //Customer First Name
                'cc_last_name': 'Saad', //Customer Last Name
                'cc_phone_number': '00973', //Country code
                'phone_number': '12332323', //Customer Phone
                'billing_address': 'Address', //Billing Address
                'city': 'Manama', //Billing City
                'state': 'Manama', //Billing State
                'postal_code': '1234', //Postal Code
                'country': 'BHR', //Iso 3 country code
                'email': 'pradeep@grr.la', //Customer Email
                'ip_customer': '127.0.0.1', //Pass customer IP here
                'ip_merchant': '127.0.0.1', //Change this to your server IP
                'address_shipping': 'Shipping', //Shipping Address
                'city_shipping': 'Manama', //Shipping City
                'state_shipping': 'Manama', //Shipping State
                'postal_code_shipping': '973',
                'country_shipping': 'BHR',
                'other_charges': 0, //Other chargs can be here
                'reference_no': 1234, //Pass the order id on your system for your reference
                'msg_lang': 'en', //The language for the response
                'cms_with_version': 'Nodejs Lib v1', //Feel free to change this
            }, function (result) {
                if (result.response_code === "4012") {
                    res.redirect(result.payment_url);
                }
                res.send(result.result);
            });
        } catch (e) {
            console.log(e);
            res.send(e.message);
        }
    }
    async returnUrl(req, res) {
        new Paytabs().verifyPayment(req.body.payment_reference).then((value) => {
            new Paytabs().ipnUrl(value).then((value1) => {
                console.log("ipn created : " + value1);
                res.send(JSON.stringify(value));
            }).catch((error) => {
                res.send({"ip_failed_error ": error})
            });
        }).catch((error) => {
            res.send({"payment varify error": error});
        });
    }

    async verifyPayment(payment_ref) {
        return await new Promise((resolve, reject) => {
            paytabs.verifyPayment({
                merchant_email: config.paytab_merchant_email,
                secret_key: config.paytab_secret_key,
                payment_reference: payment_ref
            }, function (result) {
                if (result) {
                    resolve(result);
                }
                reject("payment failed");
            });
        })
    }
    async ipnUrl(response) {
        return await new Promise((resolve, reject) => {
            fs.writeFile('./ipn/' + response.transaction_id + '.txt', JSON.stringify(response), function (error) {
                if (error) {
                    reject(error);
                }
                resolve(true);
            });
        })
    }
}
module.exports = new Paytabs;