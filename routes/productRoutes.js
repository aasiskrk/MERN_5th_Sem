//importing only router as u dont need the whole express

const router = require("express").Router();
const productContoller = require("../controllers/productController");
const { authGuard, adminGuard } = require("../middleware/authGuard");

//Make a create user API

router.post("/create", productContoller.createProduct);

//fetch all products
//http://localhost:5000/api/product/get_all_products
router.get("/get_all_products",   productContoller.getAllProducts);

//fetch single product
router.get("/get_single_product/:id", authGuard, productContoller.getProduct);

//delete product
router.delete(
  "/delete_product/:id",
  adminGuard,
  productContoller.deleteProduct
);

//update product
router.put("/update_product/:id", adminGuard, productContoller.updateProduct);

//exporting
module.exports = router;
