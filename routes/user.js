const express =require('express');
const userController = require ('../controller/user')
const router=express.Router();
const verifyToken = require("../middleware/auth");
const passport = require('passport');
router.post('', userController.addUser)
router.post('/login',  userController.getUser)
router.post('/loginOath',  userController.getUserOath)
router.post('/sendResetEmail', userController.userReset)
router.post('/checkResetToken', userController.checkToken)
router.post('/resetPassword', userController.resetPassword)
router.post('/changePassword',verifyToken ,userController.changePassword)
router.post('/resendConfirmationEmail', userController.resendConfirmationEmail)
router.post('/checkResetPasswordToken', userController.checkResetToken);

router.post('/checkToken', userController.checkToken)
router.get('/:userId', userController.getCordonne)
router.post('/changeActivation', verifyToken, userController.changeActivation )
router.post('/updateWishList/:userId', userController.updateWishList)
router.post('/deleteWishList/:userId', userController.removeFromWishList);
router.post('/addToSearchList/:userId', userController.addSearchList);
router.post('/confirmToken', userController.confirmToken);
router.post('/checkConfimationToken', userController.checkConfirmToken);
router.post('/confirmUser', userController.confirmUser);
router.post('/getUsers' ,userController.getAllUsers);
router.post('/filterUsers', userController.filterUser);
router.post('/modify',verifyToken,userController.modifyUser);
router.post('/getProfile', userController.getProfile);
router.post('/getProfileById', userController.getProfileById);
router.post('/checkEmail', userController.checkEmail);
router.post('/sendContactEmail', userController.sendContactEmail);
router.post('/oathSignup', userController.addUserOath);
router.post('/nbVisited', userController.addNbvisits);

module.exports=router
