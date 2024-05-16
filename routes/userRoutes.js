//importing only router as u dont need the whole express

const router = require('express').Router();
const userContollers = require('../controllers/userController');

//Make a create user API

router.post('/create', userContollers.creatUser);

//login User API
router.post('/login',userContollers.loginUser)

//exporting
module.exports = router;