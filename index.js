// JWT
const {encrypt,decrypt} =require("./criptografia")

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
var { expressjwt: expressJWT } = require("express-jwt");
const cors = require('cors');

var cookieParser = require('cookie-parser')

const express = require('express');
const { usuario } = require('./models');

const app = express();

app.set('view engine', 'ejs');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cookieParser());
app.use(
  expressJWT({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    getToken: req => req.cookies.token
  }).unless({ path: ["/cadastrar", "/cadastra", "/sobre", "/autenticar", "/logar", "/deslogar"] })
);

app.get('/autenticar', async function (req, res) {
  res.render('autenticar');
})

app.get('/', async function (req, res) {
  res.render("home")
})

app.get('/listar', async function (req, res) {
  const usuarios = await usuario.findAll()
  res.render("listar", { usuarios });
})

app.get('/cadastrar', async function (req, res) {
  res.render("cadastrar");
})

app.post('/cadastra', async function (req, res) {
  const {nome, senha} = req.body
  const senhaEncrypt = encrypt(senha);
  const usuario_ = await usuario.create({
    nome,
    usuario,
    usuario: req.body.usuario,
    senha: senhaEncrypt
  })
  res.json(usuario_)
})

app.post('/logar', async (req, res) => {
  const {senha} = req.body
  const usuarios = await usuario.findOne({ where: { usuario: req.body.usuario } })
  console.log(usuarios)
  const senhaDecrypt = decrypt(usuarios.senha);
  if (req.body.usuario === usuarios.usuario && senha === senhaDecrypt) {
    const id = 1;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 3600 // expires in 5min
    });

    res.cookie('token', token, { httpOnly: true });
    return res.json({ auth: true, token: token });
  }

  res.status(500).json({ message: 'Login inválido!' });
})

app.post('/deslogar', function (req, res) {
  res.cookie('token', null, { httpOnly: true });
  res.json({ deslogado: true })
})

app.get('/sobre', function (req, res) {
  res.cookie('token', null, { httpOnly: true });
  res.json({ sobre: true })
})

app.listen(5001, function () {
  console.log('App de Exemplo escutando na porta 3000!')
});