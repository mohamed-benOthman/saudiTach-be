const User=require('../models/User')
const bcrypt = require('bcrypt');
const crypto = require ('crypto');
const jwt=require('jsonwebtoken');

require('dotenv').config();
const Mailgun = require('mailgun-js');
const mg = new Mailgun({ apiKey: process.env.MAILGUNAPIKEY, domain: process.env.MAILGUNDOMAIN})
const nodemailer =require ('nodemailer');


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const sendConfirmEmail= (email)=>{
    crypto.randomBytes(32, async (err, buffer)=>{
        if (err) {
            console.log(err)
        }
        else{
            const token=buffer.toString('hex');
            try{
               let  user= await User.findOne({email:email})
                if (!user){
                    res.status(404).json({message:'Email Not Found'})
                }
                else {
                    user.confirmToken =token.trim();
                    try{
                        await user.save();
                        const data ={
                            from: process.env.MAILGUNUSERNAME+'@'+process.env.MAILGUNDOMAIN,
                            to: email,
                            subject :'Confirm Account',
                            html: '<div class="col-lg-6 col-md-8"> \n' +
                                '                        <table style="box-sizing: border-box; width: 100%; border-radius: 6px; overflow: hidden; background-color: #fff; box-shadow: 0 0 3px rgba(60, 72, 88, 0.15);">\n' +
                                '                            <thead>\n' +
                                '                                <tr style="background-color: #f8f9fc; padding: 3px 0; line-height: 68px; text-align: center; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">\n' +
                                '                                    <th scope="col"><img src="http://localhost:8080/uploads/Imateco@2x.png" height="24" alt=""></th>\n' +
                                '                                </tr>\n' +
                                '                            </thead>\n' +
                                '\n' +
                                '                            <tbody>\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 48px 24px 0; color: #161c2d; font-size: 18px; font-weight: 600;">\n' +
                                '                                        Hello, '+user.firstName+'\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px 15px; color: #8492a6;">\n' +
                                '                                        Thanks for creating an Imateco account. To continue, please confirm your email address by clicking the button below :\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px;">\n' +
                                '                                        <a  href="'+process.env.HOST+'/verifyEmail/'+token+'"  class="btn-primary" style="background-color: #37A11A,padding: 8px 20px; outline: none; text-decoration: none; font-size: 16px; letter-spacing: 0.5px; transition: all 0.3s; font-weight: 600; border-radius: 6px;">Confirm Email Address</a>\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px 0; color: #8492a6;">\n' +
                                '                                        This link will be active for 30 min from the time this email was sent.\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px 15px; color: #8492a6;">\n' +
                                '                                        Imateco <br> Support Team\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 16px 8px; color: #8492a6; background-color: #f8f9fc; text-align: center;">\n' +
                                '                                        © 2020-21 Imateco.\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '                            </tbody>\n' +
                                '                        </table>\n' +
                                '                    </div><!--end col-->'

                        }
                        mg.messages().send(data, function (err, body) {
                            //If there is an error, render the error page
                            if (err) {

                                console.log("got an error: ", err);
                            }
                            //Else we can greet    and leave
                            else {

                                console.log(body);
                            }
                        });
                        /*await  transporter.sendMail({
                            to : email,
                            from:process.env.EMAIL,
                            subject :'Confirm Account',
                            html: '<div class="col-lg-6 col-md-8"> \n' +
                                '                        <table style="box-sizing: border-box; width: 100%; border-radius: 6px; overflow: hidden; background-color: #fff; box-shadow: 0 0 3px rgba(60, 72, 88, 0.15);">\n' +
                                '                            <thead>\n' +
                                '                                <tr style="background-color: #f8f9fc; padding: 3px 0; line-height: 68px; text-align: center; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">\n' +
                                '                                    <th scope="col"><img src="http://localhost:8080/uploads/Imateco@2x.png" height="24" alt=""></th>\n' +
                                '                                </tr>\n' +
                                '                            </thead>\n' +
                                '\n' +
                                '                            <tbody>\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 48px 24px 0; color: #161c2d; font-size: 18px; font-weight: 600;">\n' +
                                '                                        Hello, '+user.firstName+'\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px 15px; color: #8492a6;">\n' +
                                '                                        Thanks for creating an Imateco account. To continue, please confirm your email address by clicking the button below :\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px;">\n' +
                                '                                        <a  href="'+process.env.HOST+'/verifyEmail/'+token+'"  class="btn-primary" style="background-color: #37A11A,padding: 8px 20px; outline: none; text-decoration: none; font-size: 16px; letter-spacing: 0.5px; transition: all 0.3s; font-weight: 600; border-radius: 6px;">Confirm Email Address</a>\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px 0; color: #8492a6;">\n' +
                                '                                        This link will be active for 30 min from the time this email was sent.\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px 15px; color: #8492a6;">\n' +
                                '                                        Imateco <br> Support Team\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 16px 8px; color: #8492a6; background-color: #f8f9fc; text-align: center;">\n' +
                                '                                        © 2020-21 Imateco.\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '                            </tbody>\n' +
                                '                        </table>\n' +
                                '                    </div><!--end col-->'
                        })*/

                    }
                    catch(err){
                        console.log(err)
                    }
                }}
            catch(err){
                console.log(err)
            }
        }
    })
}
exports.resendConfirmationEmail= async (req,res)=>{
    crypto.randomBytes(32, async (err, buffer)=>{
        if (err) {
            console.log(err)
        }
        else{
            const token=buffer.toString('hex');
            try{
                let  user= await User.findOne({email:req.body.email})
                if (!user){
                    res.status(404).json({message:'Email Not Found'})
                }
                else {
                    user.confirmToken =token.trim();
                    try{
                        await user.save();
                        const data ={
                            from: process.env.MAILGUNUSERNAME+'@'+process.env.MAILGUNDOMAIN,
                            to: req.body.email,
                            subject :'Confirm Account',
                            html: '<div class="col-lg-6 col-md-8"> \n' +
                                '                        <table style="box-sizing: border-box; width: 100%; border-radius: 6px; overflow: hidden; background-color: #fff; box-shadow: 0 0 3px rgba(60, 72, 88, 0.15);">\n' +
                                '                            <thead>\n' +
                                '                                <tr style="background-color: #f8f9fc; padding: 3px 0; line-height: 68px; text-align: center; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">\n' +
                                '                                    <th scope="col"><img src="http://localhost:8080/uploads/Imateco@2x.png" height="24" alt=""></th>\n' +
                                '                                </tr>\n' +
                                '                            </thead>\n' +
                                '\n' +
                                '                            <tbody>\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 48px 24px 0; color: #161c2d; font-size: 18px; font-weight: 600;">\n' +
                                '                                        Hello, '+user.firstName+'\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px 15px; color: #8492a6;">\n' +
                                '                                        Thanks for creating an Imateco account. To continue, please confirm your email address by clicking the button below :\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px;">\n' +
                                '                                        <a  href="'+process.env.HOST+'/verifyEmail/'+token+'"  class="btn-primary" style="background-color: #37A11A,padding: 8px 20px; outline: none; text-decoration: none; font-size: 16px; letter-spacing: 0.5px; transition: all 0.3s; font-weight: 600; border-radius: 6px;">Confirm Email Address</a>\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px 0; color: #8492a6;">\n' +
                                '                                        This link will be active for 30 min from the time this email was sent.\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px 15px; color: #8492a6;">\n' +
                                '                                        Imateco <br> Support Team\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 16px 8px; color: #8492a6; background-color: #f8f9fc; text-align: center;">\n' +
                                '                                        © 2020-21 Imateco.\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '                            </tbody>\n' +
                                '                        </table>\n' +
                                '                    </div><!--end col-->'

                        }

                        mg.messages().send(data, function (err, body) {
                            //If there is an error, render the error page
                            if (err) {
                                res.status(500).json("error");

                                console.log("got an error: ", err);
                            }
                            //Else we can greet    and leave
                            else {
                                res.status(200).json("success");
                                console.log(body);
                            }
                        });
                        /*await  transporter.sendMail({
                            to : email,
                            from:process.env.EMAIL,
                            subject :'Confirm Account',
                            html: '<div class="col-lg-6 col-md-8"> \n' +
                                '                        <table style="box-sizing: border-box; width: 100%; border-radius: 6px; overflow: hidden; background-color: #fff; box-shadow: 0 0 3px rgba(60, 72, 88, 0.15);">\n' +
                                '                            <thead>\n' +
                                '                                <tr style="background-color: #f8f9fc; padding: 3px 0; line-height: 68px; text-align: center; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">\n' +
                                '                                    <th scope="col"><img src="http://localhost:8080/uploads/Imateco@2x.png" height="24" alt=""></th>\n' +
                                '                                </tr>\n' +
                                '                            </thead>\n' +
                                '\n' +
                                '                            <tbody>\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 48px 24px 0; color: #161c2d; font-size: 18px; font-weight: 600;">\n' +
                                '                                        Hello, '+user.firstName+'\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px 15px; color: #8492a6;">\n' +
                                '                                        Thanks for creating an Imateco account. To continue, please confirm your email address by clicking the button below :\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px;">\n' +
                                '                                        <a  href="'+process.env.HOST+'/verifyEmail/'+token+'"  class="btn-primary" style="background-color: #37A11A,padding: 8px 20px; outline: none; text-decoration: none; font-size: 16px; letter-spacing: 0.5px; transition: all 0.3s; font-weight: 600; border-radius: 6px;">Confirm Email Address</a>\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px 0; color: #8492a6;">\n' +
                                '                                        This link will be active for 30 min from the time this email was sent.\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 15px 24px 15px; color: #8492a6;">\n' +
                                '                                        Imateco <br> Support Team\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '\n' +
                                '                                <tr>\n' +
                                '                                    <td style="padding: 16px 8px; color: #8492a6; background-color: #f8f9fc; text-align: center;">\n' +
                                '                                        © 2020-21 Imateco.\n' +
                                '                                    </td>\n' +
                                '                                </tr>\n' +
                                '                            </tbody>\n' +
                                '                        </table>\n' +
                                '                    </div><!--end col-->'
                        })*/

                    }
                    catch(err){
                        console.log(err)
                    }
                }}
            catch(err){
                console.log(err)
            }
        }
    })
}

exports.sendContactEmail = async (req,res)=>{
    const data ={
        from: process.env.MAILGUNUSERNAME+'@'+process.env.MAILGUNDOMAIN,
        to: req.body.technicalEmail,
        subject :'A message from an interested party via IMATECO',
        html: '<div class="col-lg-6 col-md-8"> \n' +
            '                        <table style="box-sizing: border-box; width: 100%; border-radius: 6px; overflow: hidden; background-color: #fff; box-shadow: 0 0 3px rgba(60, 72, 88, 0.15);">\n' +
            '                            <thead>\n' +
            '                                <tr style="background-color: #f8f9fc; padding: 3px 0; line-height: 68px; text-align: center; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">\n' +
            '                                    <th scope="col"><img src="http://localhost:8080/uploads/Imateco@2x.png" height="24" alt=""></th>\n' +
            '                                </tr>\n' +
            '                            </thead>\n' +
            '\n' +
            '                            <tbody>\n' +
            '                                <tr>\n' +
            '                                    <td style="padding: 48px 24px 0; color: #161c2d; font-size: 18px; font-weight: 600;">\n' +
            '                                        Dear, '+req.body.technicalName+'\n' +
            '                                    </td>\n' +
            '                                </tr>\n' +
            '                                <tr>\n' +
            '                                    <td style="padding: 15px 24px 15px; color: #8492a6;">\n' +
            '                                        The following message from '+req.body.cofounderName+'  with email '+req.body.email+' was sent to you via IMATECO :\n' +
            '                                    </td>\n' +
            '                                </tr>\n' +
            '\n' +
            '                                <tr>\n' +
            '                                    <td style="padding: 15px 24px;">\n' + req.body.message+ '\n' +
            '                                    </td>\n' +
            '                                </tr>\n' +
            '\n' +
            '                                <tr>\n' +
            '                                    <td style="padding: 15px 24px 0; color: #FF0000;">\n' +
            '                                        PLEASE DO NOT REPLY TO THIS MESSAGE AND REPLY TO '+req.body.email+'  DIRECTLY.\n' +
            '                                    </td>\n' +
            '                                </tr>\n' +
            '\n' +
            '                                <tr>\n' +
            '                                    <td style="padding: 15px 24px 15px; color: #8492a6;">\n' +
            '                                        Imateco <br> Support Team\n' +
            '                                    </td>\n' +
            '                                </tr>\n' +
            '\n' +
            '                                <tr>\n' +
            '                                    <td style="padding: 16px 8px; color: #8492a6; background-color: #f8f9fc; text-align: center;">\n' +
            '                                        © 2020-21 Imateco.\n' +
            '                                    </td>\n' +
            '                                </tr>\n' +
            '                            </tbody>\n' +
            '                        </table>\n' +
            '                    </div><!--end col-->'

    }
    mg.messages().send(data, function (error, body) {
        //If there is an error, render the error page
        if (error) {

            res.status(500).json("failed");

    }
        //Else we can greet    and leave
        else {

            res.status(200).json("success");
        }
    });
}


exports.addUser = async  (req, res) => {
    console.log(req.body);
   const user=new User(
      req.body
   );
   console.log(user);
    user2= await User.findOne({email:req.body.email} )

   if (user2){
   res.status(404).json({message: "Email already exists"})}

   else {
       try{
   let salt=await bcrypt.genSalt(10);
   user.password=await bcrypt.hash(user.password,salt);
           user.socialLogin=false;

       }

   catch(e){
           console.log(e);
       }

   user.confirmed=false;

   try{

   const savedUser= await user.save();

   sendConfirmEmail(req.body.email);
   res.status(201).json("success")
   }
   catch(err){
      res.status(400).json({message:err})
   }
}
  };

exports.addUserOath= async  (req, res) => {
    console.log(req.body);
    const user=new User(
        req.body
    );
    console.log(user);
    user2= await User.findOne({email:req.body.email} )

    if (user2){
        res.status(404).json({message: "Email already exists"})}

    else {
        try{
            let salt=await bcrypt.genSalt(10);
            user.password=await bcrypt.hash('0000',salt);
            if (user.lastName==='')
                user.lastName=" ";

        }
        catch(e){
            console.log(e);
        }

        user.confirmed=true;

        try{

            const savedUser= await user.save();

            res.status(201).json("success")
        }
        catch(err){
            res.status(400).json({message:err})
        }
    }
};


exports.modifyUser = async (req,res,next)=>{
        const email= req.body.email;
        try{
            const userFound= await User.findOne({email:email});
            if (!userFound){
            res.status(404).json({message:'Email not Found'})
            }
            else {
                await userFound.overwrite(req.body);
                await userFound.save()
                res.status(200).json(userFound);
            }
            }
        catch(err){
            res.json(err)
        }
    }

exports.getUserOath = async (req, res, next) => {
    const email=req.body.email;

    try{
        const userFound= await User.findOne({email:email})

        if (!userFound || userFound.socialLogin==false ){
            res.status(404).json({message:'Email not Found'})
        }
        else {
            const token=jwt.sign({
                    email: userFound.email},'e21c07a7cade11b0977de2a384bc414c74a439ee2f3235019141de9acb68f01d514abbbb756ca4d46d8acf6efdb2a635e80d5dc9195b5ebd350799281ea22610',{ expiresIn: '24h'})

                res.status(200).json(
                    userFound)

        }

    }
    catch(err){
        res.json(err)
    }
};

  exports.getUser = async (req, res, next) => {
      const email=req.body.email;
      const password = req.body.password;
      const myDate = new Date();
      try{
      const userFound= await User.findOne({email:email})
          console.log('sdadsadadadddddddddddddd')
          if (!userFound){
            res.status(404).json({message:'Email not Found'})
          }


          if (userFound.socialLogin==true){
              res.status(400).message({message:"Gmail Login Please"});
          }

          else if (userFound.confirmed==false){
              res.status(409).message({message:"user not verified"})
          }
         else {

        const  match = await bcrypt.compare(password, userFound.password);

              console.log(match);
        if (match){

            try{
                userFound.lastLoginDate= myDate;
                await userFound.overwrite(userFound);
                userFound.save();
            }
            catch(e){
                res.json(e)
            }


            const token=jwt.sign({
              email: userFound.email},'e21c07a7cade11b0977de2a384bc414c74a439ee2f3235019141de9acb68f01d514abbbb756ca4d46d8acf6efdb2a635e80d5dc9195b5ebd350799281ea22610',{ expiresIn: '24h'})

            const data={
                firstName: userFound.firstName,
                commitFulltime:userFound.commitFulltime,
                lastName: userFound.lastName,
                startupExperience: userFound.startupExperience,
                password:userFound.password,
                yearsExperience: userFound.yearsExperience ,
                email: userFound.email,
                city:userFound.city,
                devops:userFound.devops,
                backend:userFound.backend,
                database:userFound.database,
                frontend:userFound.frontend,
                cofirmed:userFound.confirmed,
                country: userFound.country ,
                tellMore: userFound.tellMore,
                twitter:userFound.twitter ,
                password:userFound.password,
                relocate:userFound.relocate,
                equity: userFound.equity,
                commitFulltime:userFound.commitFulltime,
                whenStart:userFound.whenStart,
                confirmed:true,
                remote:userFound.remote,
                bestAt:userFound.bestAt,
                design:userFound.design,
                avatarLink:userFound.avatarLink,
                linkedInProfile: userFound.linkedInProfile,
                token:token,
                activated:userFound.activated,
                socialLogin:userFound.socialLogin
            }
                console.log(data)
            console.log(userFound);

            res.status(200).json(
              data)
        }
        else 
        res.status(404).json({message:'Password Incorrect'})
         }
      
      }
      catch(err){
         res.json(err)
      }
    };

    exports.userReset=  (req,res,next)=>{
       crypto.randomBytes(32, async (err, buffer)=>{
          if (err) {
             console.log(err)
          }
          else{ 
           token=buffer.toString('hex');
           try{
              user= await User.findOne({email:req.body.email})
          if (!user){
             res.status(404).json({message:'Email Not Found'})
          }
          else {
             user.resetToken =token;
             user.resetTokenExpiration = Date.now() +51840480;
             user.overwrite(user);

              try{
                  await user.save();

                 const data ={
                     from: 'DoNotReply@'+process.env.MAILGUNDOMAIN,
                     to: user.email,
                     subject :'Password Reset',
                     html: '<div class="col-lg-6 col-md-8"> \n' +
                         '                        <table style="box-sizing: border-box; width: 100%; border-radius: 6px; overflow: hidden; background-color: #fff; box-shadow: 0 0 3px rgba(60, 72, 88, 0.15);">\n' +
                         '                            <thead>\n' +
                         '                                <tr style="background-color: #f8f9fc; padding: 3px 0; line-height: 68px; text-align: center; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">\n' +
                         '                                    <th scope="col"><img src="http://localhost:8080/uploads/Imateco@2x.png" height="24" alt=""></th>\n' +
                         '                                </tr>\n' +
                         '                            </thead>\n' +
                         '\n' +
                         '                            <tbody>\n' +
                         '                                <tr>\n' +
                         '                                    <td style="padding: 48px 24px 0; color: #161c2d; font-size: 18px; font-weight: 600;">\n' +
                         '                                        Hello, '+user.firstName+'\n' +
                         '                                    </td>\n' +
                         '                                </tr>\n' +
                         '                                <tr>\n' +
                         '                                    <td style="padding: 15px 24px 15px; color: #8492a6;">\n' +
                         '                                        please change your password by clicking the button below :\n' +
                         '                                    </td>\n' +
                         '                                </tr>\n' +
                         '\n' +
                         '                                <tr>\n' +
                         '                                    <td style="padding: 15px 24px;">\n' +
                         '                                        <a  href="'+process.env.HOST+'/reset/'+token+'"  class="btn-primary" style="background-color: #37A11A,padding: 8px 20px; outline: none; text-decoration: none; font-size: 16px; letter-spacing: 0.5px; transition: all 0.3s; font-weight: 600; border-radius: 6px;">Change Password</a>\n' +
                         '                                    </td>\n' +
                         '                                </tr>\n' +
                         '\n' +
                         '                                <tr>\n' +
                         '                                    <td style="padding: 15px 24px 0; color: #8492a6;">\n' +
                         '                                        This link will be active for 24 hours from the time this email was sent.\n' +
                         '                                    </td>\n' +
                         '                                </tr>\n' +
                         '\n' +
                         '                                <tr>\n' +
                         '                                    <td style="padding: 15px 24px 15px; color: #8492a6;">\n' +
                         '                                        Imateco <br> Support Team\n' +
                         '                                    </td>\n' +
                         '                                </tr>\n' +
                         '\n' +
                         '                                <tr>\n' +
                         '                                    <td style="padding: 16px 8px; color: #8492a6; background-color: #f8f9fc; text-align: center;">\n' +
                         '                                        © 2020-21 Imateco.\n' +
                         '                                    </td>\n' +
                         '                                </tr>\n' +
                         '                            </tbody>\n' +
                         '                        </table>\n' +
                         '                    </div><!--end col-->'

                 }
                 res.status(200).json("success");
                 mg.messages().send(data, function (err, body) {
                     //If there is an error, render the error page
                     if (err) {

                         console.log("got an error: ", err);
                     }
                     //Else we can greet    and leave
                     else {

                         console.log(body);
                     }
                 });
             }
             catch(err){
                 console.log(err);
               res.status(400).json(err)
             }
          }}
          catch(err){
             console.log(err)
          }
         }
       })
    }
    exports.confirmToken=  (req,res,next)=>{
      crypto.randomBytes(32, async (err, buffer)=>{
         if (err) {
            console.log(err)
         }
         else{ 
          token=buffer.toString('hex');
          try{
             user= await User.findOne({email:req.body.email})
         if (!user){
            res.status(404).json({message:'Email Not Found'})
         }
         else {
            user.confirmToken =token;
            try{
                 await user.save();
                 await  transporter.sendMail({
                    to : req.body.email,
                    from:process.env.EMAIL,
                    subject :'Confirm Account',
                    html: '<p>Click on this link to confirm your account <a href="http://'+req.headers.host+'/profile/'+token+'"> link </a> which is valid for 1 hour</p>'
                 })
                 res.status(200).json('success')
            }
            catch(err){
              res.status(400).json(err)
            }
         }}
         catch(err){
            console.log(err)
         }
        }
      })
   }
    exports.checkToken=async (req,res)=>{
       try{
         const userFound= await User.findOne({resetToken:req.body.token})
            if(!userFound){
               res.status(404).json({message:"User not Found"})
            }
            else {
              
                res.status(200).json({message:"success"})
                const token=jwt.sign({
                    email: userFound.email},'e21c07a7cade11b0977de2a384bc414c74a439ee2f3235019141de9acb68f01d514abbbb756ca4d46d8acf6efdb2a635e80d5dc9195b5ebd350799281ea22610',{ expiresIn: '24h'})
                res.status(200).json({token:token, user: userFound})

            }
              
            
       }
       catch(err){
          res.status(400).json(err)
       }
    
       
   },
        exports.getAllUsers = async (req,res)=>{
        try{
            const users= await User.find();
            users.map((item)=>{
                item.password="0000"
            })
            const users2=users.sort((a,b)=>{
                let dateA;
                let dateB;
                if (a.signupDate){
                    dateA = new Date(a.signupDate);
                }
                else{
                    dateA = new Date("2021-04-19T23:02:06.284Z");
                }

                    if (b.signupDate){
                         dateB = new Date(b.signupDate);

                    }
                    else {
                         dateB = new Date("2021-04-19T23:02:06.284Z");
                    }


                console.log(dateA-dateB)

                return dateB - dateA;


            })
            res.status(200).json({users:users2});
        }
        catch(e){
            console.log(e)
        }
    }

   exports.checkConfirmToken=async (req,res)=>{
      try{

        const userFound= await User.findOne({confirmToken:req.body.token})
           if(!userFound){
              res.status(404).json({message:"User not Found"})
           }
           else {
             
                 res.status(200).json({message:"success"})
              }
             
           
      }
      catch(err){
         res.status(400).json(err)
      }
   
      
  },
       exports.checkResetToken=async (req,res)=>{
           try{
               const userFound= await User.findOne({resetToken:req.body.resetToken})
               if(!userFound){
                   res.status(404).json({message:"User not Found"})
               }
               else {
                    if (userFound.resetToken ==req.body.resetToken )
                   res.status(200).json({message:"success"})
                   else
                        res.status(404).json({message:"token not found"})

               }


           }
           catch(err){
               res.status(400).json(err)
           }


       },
   exports.resetPassword=async (req,res)=>{
      try{
        const userFound= await User.findOne({resetToken:req.body.resetToken})
           if(!userFound){
              res.status(404).json({message:"User not found"})
           }
           else {
              
                 let salt=await bcrypt.genSalt(10);
                 const newPassword=await bcrypt.hash(req.body.password,salt);
                 userFound.password=newPassword;
                 //userFound.overwrite({email:userFound.email,password:newPassword,userName:userFound.userName,wishList:userFound.wishList, lastReasearch:userFound.lastReasearch});
                 userFound.overwrite(userFound);
                 userFound.save();

                 res.status(200).json({message:"success"})
              
           }
      }
      catch(err){
         res.status(400).json(err)
      }
   
      
  },
       exports.changePassword=async (req,res)=>{
           try{
               const userFound= await User.findOne({email:req.body.email})
               if(!userFound){
                   res.status(404).json({message:"User not found"})
               }
               else {
                   const  match = await bcrypt.compare(req.body.oldPassword, userFound.password);
                   console.log(match);
                    if (match==true) {
                        let salt = await bcrypt.genSalt(10);
                        const newPassword = await bcrypt.hash(req.body.password, salt);
                        userFound.password = newPassword;
                        //userFound.overwrite({email:userFound.email,password:newPassword,userName:userFound.userName,wishList:userFound.wishList, lastReasearch:userFound.lastReasearch});
                        userFound.overwrite(userFound);
                        userFound.save();

                        res.status(200).json({message: "success"})
                    }
                    else {
                        res.status(400).json("not match")

                    }
               }
           }
           catch(err){
               res.status(400).json(err)
           }


       },
       exports.changeActivation=async (req,res)=>{
           try{
               console.log(req.body.token);
               const userFound= await User.findOne({email:req.body.email})
               console.log(userFound);
               if(!userFound){
                   res.status(404).json({message:"User not found"})
               }
               else {

                       userFound.activated=req.body.activated;
                       await userFound.overwrite(userFound);
                       userFound.save();

                       res.status(200).json({message:"success"})


               }
           }
           catch(err){
               res.status(400).json(err)
           }


       },

       exports.confirmUser=async (req,res)=>{
   try{
       console.log(req.body.token);
     const userFound= await User.findOne({confirmToken:req.body.token})
       console.log(userFound);
        if(!userFound){
           res.status(404).json({message:"User not found"})
        }
        else {

            if (userFound.confirmed==true){
                res.status(400).json({message:"user is confirmed"})
            }
            else {

                userFound.confirmed=true;
                await userFound.overwrite(userFound);
                await userFound.save();

              res.status(200).json({message:"success"})
                }
           
        }
   }
   catch(err){
      res.status(400).json(err)
   }

   
},


exports.checkEmail = async (req, res, next) => {
    const email=req.body.email;
    try {
        const userFound = await User.findOne({email: email})
        if (!userFound){
            res.status(200).json({message:'Email not Found'})
        }
        else {
            res.status(400).json({message:'Email Already Exist'})
        }
    }
    catch(e){
        res.json(e);
    }
};

exports.getProfileById = async (req, res, next) => {
    const id=req.body.id;
    try{
        const userFound= await User.findOne({_id:id})

        if (!userFound){
            res.status(404).json({message:'not Found'})
        }
        else {
            const data={
                firstName: userFound.firstName,
                commitFulltime:userFound.commitFulltime,
                lastName: userFound.lastName,
                startupExperience: userFound.startupExperience,
                yearsExperience: userFound.yearsExperience ,
                email: userFound.email,
                city:userFound.city,
                devops:userFound.devops,
                backend:userFound.backend,
                database:userFound.database,
                frontend:userFound.frontend,
                cofirmed:userFound.confirmed,
                country: userFound.country ,
                tellMore: userFound.tellMore,
                twitter:userFound.twitter ,
                relocate:userFound.relocate,
                equity: userFound.equity,
                commitFulltime:userFound.commitFulltime,
                whenStart:userFound.whenStart,
                design:userFound.design,
                confirmed:true,
                linkedInProfile: userFound.linkedInProfile,
                avatarLink: userFound.avatarLink
            }
            res.status(200).json(data)


        }

    }
    catch(err){
        res.json(err)
    }
};
exports.getProfile = async (req, res, next) => {
           const email=req.body.email;
           try{
               const userFound= await User.findOne({email:email})

               if (!userFound){
                   res.status(404).json({message:'Email not Found'})
               }
               else {
                   const data={
                           firstName: userFound.firstName,
                           commitFulltime:userFound.commitFulltime,
                           lastName: userFound.lastName,
                           startupExperience: userFound.startupExperience,
                           yearsExperience: userFound.yearsExperience ,
                           email: userFound.email,
                           city:userFound.city,
                           devops:userFound.devops,
                           backend:userFound.backend,
                           database:userFound.database,
                           frontend:userFound.frontend,
                           cofirmed:userFound.confirmed,
                           country: userFound.country ,
                           tellMore: userFound.tellMore,
                           twitter:userFound.twitter ,
                           relocate:userFound.relocate,
                           equity: userFound.equity,
                           commitFulltime:userFound.commitFulltime,
                           whenStart:userFound.whenStart,
                            design:userFound.design,
                           confirmed:true,
                           linkedInProfile: userFound.linkedInProfile,
                       }
                       res.status(200).json(data)


               }

           }
           catch(err){
               res.json(err)
           }
       };

exports.getCordonne=async(req,res)=>{
      try{
         const userFound= await User.findById(req.params.userId).populate("wishList")
         if (!userFound)
            res.status(404).json({message:'not Found'});
         const result={
            userName:userFound.userName,
            email:userFound.email,
            wishList:userFound.wishList,
            lastReasearch:userFound.lastReasearch

         }
         res.status(200).json(result);
      }
      catch(err){
         res.status(400).json({'message':err})
      }
   }
   exports.updateWishList=async (req,res)=>{
      try{
         const userFound= await User.findById(req.params.userId).populate("wishList")
         if (!userFound)
            res.status(404).json({message:'not Found'});
            let wishList=userFound.wishList;
            wishList.push(req.body.recipe);
            
             userFound.overwrite({email:userFound.email,password:userFound.password,userName:userFound.userName,wishList:wishList});
            await userFound.save()
         
        res.status(200).json({message:"updated"});
      }
      catch(err){
         res.status(400).json({'message':err})
      }
   }
   exports.removeFromWishList=async (req,res)=>{
      try{
         const userFound= await User.findById(req.params.userId).populate("wishList")
         if (!userFound)
            res.status(404).json({message:'not Found'});
            let wishList=userFound.wishList;
            for (let i in wishList){
               
               if (wishList[i]._id==req.body.recipe){
                  
                  wishList.splice(i,1);
                  userFound.overwrite({email:userFound.email,password:userFound.password,userName:userFound.userName,wishList:wishList});
                   await userFound.save()
                   res.status(200).json({message:"deleted"});
               } 
            }
            
            
            
         
        res.status(404).json({message:"not Found"});
      }
      catch(err){
         res.status(400).json({'message':err})
      }
   }
   exports.addSearchList= async (req,res)=>{
      try{
         const userFound= await User.findById(req.params.userId)
         if (!userFound)
            res.status(404).json({message:'not Found'});
            let lastReasearch=userFound.lastReasearch;
            lastReasearch.push(req.body.ingredients);
            
             userFound.overwrite({email:userFound.email,password:userFound.password,userName:userFound.userName,wishList:userFound.wishList, lastReasearch:lastReasearch});
            await userFound.save()
         
        res.status(200).json({message:"updated"});
      }
      catch(err){
         res.status(400).json({'message':err})
      }
   }

   exports.filterUser = async(req,res)=>{
        try{
            const usersFound = await User.find(req.body);
            usersFound.map((item)=>{
                item.password="0000"
            })
            usersFound.sort((a,b)=>{
                let dateA;
                let dateB;
                if (a.signupDate){
                    dateA = new Date(a.signupDate);
                }
                else{
                    dateA = new Date("2021-04-19T23:02:06.284Z");
                }

                if (b.signupDate){
                    dateB = new Date(b.signupDate);

                }
                else {
                    dateB = new Date("2021-04-19T23:02:06.284Z");
                }


                console.log(dateA-dateB)

                return dateB - dateA;


            })
            res.status(200).json({
               usersFound
            })
        }
        catch(err){
            console.log(err);
        }

    }

 exports.addNbvisits = async(req,res)=>{
    try{

        let usersFound = await User.findOne({email:req.body.email});

        if (usersFound.nbVisits)
        {  usersFound.nbVisits++;
            await usersFound.overwrite(usersFound);
            await usersFound.save();
        }

        else{
            usersFound.nbVisits=1;
            await usersFound.overwrite(usersFound);
            await usersFound.save();
        }

        res.status(200).json({
            nbVisited:usersFound.nbVisits
        })
    }
    catch(err){
        console.log(err);
    }

}

