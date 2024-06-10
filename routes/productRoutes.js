//importing only router as u dont need the whole express

const router = require("express").Router();
const productContoller = require("../controllers/productController");

//Make a create user API

router.post("/create", productContoller.createProduct);

//fetch all products
router.get("/get_all_products", productContoller.getAllProducts);

//fetch single product
router.get("/get_single_product/:id", productContoller.getProduct);

//delete product
router.delete("/delete_product/:id", productContoller.deleteProduct);

//update product
router.put("/update_product/:id", productContoller.updateProduct);

//exporting
module.exports = router;
