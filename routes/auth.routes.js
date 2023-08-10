const express = require("express");
const router = express.Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
//GET /user/signup=> redneriza formulario
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});
//POST /user/signup => Valida y crea usuario en DB
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  //   console.log("info",req.body);
  try {
    //Validacion si existe el usuario
    const oneUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    // console.log("un usuario",oneUser);
    if (oneUser !== null) {
      res.status(400).render("auth/signup.hbs", {
        errorMessage: "Ya hay un usuario con este correo",
      });
      return;
    }
    //Cifrado de contraseña
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    // console.log("pass encriptada",passwordHash);
    //Aqui creo un usuario
    await User.create({
      username: username,
      email: email,
      password: passwordHash,
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});
//GET /user/login => renderiza formulario de login
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});
//POST /user/login => Buscar y validar que los datos son correctos y logear.
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    //Primero busco el usuario por su nombre
    const oneUserName = await User.findOne({ username: username });
    // console.log("usuario intentado logear",oneUserName);
    //Verifica que el user existe en mi DB
    if (oneUserName === null) {
      res.status(400).render("auth/login.hbs", {
        errorMessage: "Este usuario no existe",
      });
      return;
    }
    //Verifico que la contraseña sea correcta
    const passCorrect = await bcrypt.compare(password, oneUserName.password)
    console.log("contraseña correcta tras comparar",passCorrect);
    //verifico que la contraseña es correcta
    if(passCorrect === false){
        res.status(400).render("auth/login.hbs", {
            errorMessage:
              "Contraseña no valida",
          });
          return
    }
    res.redirect("/user")
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    //Primero busco el usuario por su nombre
    const oneUserName = await User.findOne({ username: username });
    // console.log("usuario intentado logear",oneUserName);
    //Verifica que el user existe en mi DB
    if (oneUserName === null) {
      res.status(400).render("auth/login.hbs", {
        errorMessage: "Este usuario no existe",
      });
      return;
    }
    //Verifico que la contraseña sea correcta
    const passCorrect = await bcrypt.compare(password, oneUserName.password)
    console.log("contraseña correcta tras comparar",passCorrect);
    //verifico que la contraseña es correcta
    if(passCorrect === false){
        res.status(400).render("auth/login.hbs", {
            errorMessage:
              "Contraseña no valida",
          });
          return
    }
    res.redirect("/user")
  } catch (error) {
    next(error);
  }
});
module.exports = router;
