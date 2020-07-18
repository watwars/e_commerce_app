var express = require("express");
var router = express.Router();
var Product = require("../models/product");

//Display product page
router.get("/products", function(req, res){
    Product.find({}, function(err, products){
        if(err){
            console.log(err);
        }else{
            res.render("products/index", {product: products})
        }
    })
})

//Display add new product form page
router.get("/products/new", function(req, res){
    res.render("products/new")
});

//post route for adding product
router.post("/products", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var newProduct = {
        name: name,
        image : image,
        description: description,
        price :price
    }
    Product.create(newProduct, function(err, product){
        if(err){
            console.log(err);
        }else{
            res.redirect("/products");
        }
    })
}); 

//show route
router.get("/products/:id", function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
        }else{
            res.render("products/show", {product: foundProduct});
        }
    });
});

router.get("/products/:id/edit", function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
        }else{
            res.render("products/edit", {product: foundProduct});
        }
    });
});

//update route
router.put("/products/:id", function(req, res){
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, done){
        if(err){
            res.redirect("back");
            console.log(err);
        }else{
            res.redirect("/products/" + req.params.id);
        }
    });
});

//destroy route
router.delete("/products/:id", function(req, res){
    Product.findByIdAndRemove(req.params.id, function(err){
        res.redirect("/products")
    });
});


module.exports = router;