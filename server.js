var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/testdatabase', {
    useNewUrlParser: true
});
var db = mongoose.connection;

var Product = require('./model/product');
var Wishlist = require('./model/wishlist');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    next();
});

app.post('/product', function (req, res) {
    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.save(function (err, savedProduct) {
        if (err) {
            res.status(500).send({
                error: "Could not save product"
            });
        } else {
            res.status(200).send(savedProduct);
        }
    });
});

app.get('/product', function (req, res) {
    Product.find({}, function (err, products) {
        if (err) {
            res.status(500).send({
                error: "Could not fetch product"
            });
        } else {
            res.send(products);
        }
    });
});

app.post('/wishlist', function (req, res) {

    var wishlisht = new Wishlist();
    wishlisht.title = req.body.title;

    wishlisht.save(function (err, savedWishlist) {
        if (err) {
            res.status(500).send({
                error: "Could not create wishlist"
            });
        } else {
            res.send(savedWishlist);
        }
    });

});


app.get('/wishlist', function (req, res) {
    Wishlist.find({}).populate({
        path: 'products',
        model: 'Product'
    }).exec(function (err, wishlists) {
        if (err) {
            res.status(500).send({
                error: "Could not fetch list"
            });
        } else {
            res.send(wishlists);
        }
    });
});


app.put('/wishlist/product/add', function (req, res) {

    Product.findOne({
        _id: req.body.productId
    }, function (err, product) {
        if (err) {
            res.status(500).send({
                error: "Could not add item to wishlist"
            });
        } else {
            Wishlist.update({
                _id: req.body.wishlistId
            }, {
                $addToSet: {
                    products: product._id
                }
            }, function (err, updateStatus) {
                if (err) {
                    res.status(500).send({
                        error: "Could not add item to wishlist"
                    });
                } else {
                    res.send(updateStatus);
                }

            });
        }


    });


});

app.listen(3000, function () {
    console.log("API is running on port 3000");
});
