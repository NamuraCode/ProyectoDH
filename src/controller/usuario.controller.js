const {
    usuariosLogica
} = require('../models')
const bcrypt = require('bcryptjs');
const {
    validationResult
} = require('express-validator');
const path = require('path')
const usuariosController = {
    enviarVistaPerfil: (req, res) => {
        try {
            let session = req.session.user
            res.render('profile', {
                usuario: session
            })
        } catch (e) {
            res.render('error')
        }

    },
    actualizarDatosPerfil: async (req, res) => {
        try {
            let session = req.session.user
            console.log(session)
            console.log(session.id, req.body.name, req.body.correo, session.email, session.password, session.perfiles_id)
            if (session != undefined) {
                if (req.body.password != undefined) {
                    usuariosLogica.editOne({
                        username: req.body.name,
                        email: req.body.correo,
                        password: bcrypt.hashSync(req.body.password, 10),
                        perfiles_id: session.perfiles_id
                    }, {
                        where: {
                            email: session.email
                        }
                    })
                } else {
                    usuariosLogica.editOne({
                        username: req.body.name,
                        email: req.body.correo,
                        password: session.password,
                        perfiles_id: session.perfiles_id
                    }, {
                        where: {
                            email: session.email
                        }
                    })
                }
                let usuarioEncontrado = await usuariosLogica.getOne({
                    where: {
                        email: session.email
                    }
                })
                req.session.user = ""
                req.session.user = usuarioEncontrado
                res.redirect('./index')
            }
        } catch (e) {
            res.render('error')
        }
    },
    deleteUser: (req, res) => {
        try {
            usuariosLogica.deleteUser(req)
            res.clearCookie('user')
            req.session.destroy();
            res.redirect('login')
        } catch (e) {
            res.render('error')
        }

    },
    getIndex: (req, res) => {
        try {
            res.render('index')
        } catch (error) {
            console.log(error)
        }
    },
    login: (req, res) => {
        res.render('login')
    },

    log: async (req, res) => {
        try {
            const resultValidations = validationResult(req)
            if (resultValidations.errors.length > 0) {
                return res.render('login', {
                    errors: resultValidations.mapped(),
                    oldData: req.body
                })
            } else {
                let nombreDeUsuarioBody = req.body.username
                let contrasenaUsuarioBody = req.body.password
                let respuestaFuncion = await usuariosLogica.getOne({
                    where: {
                        username: nombreDeUsuarioBody
                    }
                })
                console.log(contrasenaUsuarioBody)
                if (respuestaFuncion) {
                    let contrasenaCorrecta = bcrypt.compareSync(contrasenaUsuarioBody, respuestaFuncion.password)
                    console.log(respuestaFuncion.password)
                    if (contrasenaCorrecta) {
                        req.session.user = respuestaFuncion
                        let session = req.session.user
                        console.log(session)
                        if (req.body.checkbox != undefined) {
                            res.cookie('user', respuestaFuncion.email, {
                                maxAge: 300000
                            })
                            res.redirect('index')
                        } else {
                            res.redirect('index')
                        }
                    } else {
                        res.render('login', {
                            errores: {
                                problemUser: 'Usuario no econtrado',
                                problemPass: 'Contraseña incorrecta'
                            }
                        })
                    }
                } else {
                    res.render('login', {
                        errores: {
                            problemUser: 'Usuario no econtrado',
                            problemPass: 'Contraseña incorrecta'
                        }
                    })
                }
            }
        } catch (error) {
            console.log('f')
            res.status(401).render('error')
        }
    },
}

module.exports = usuariosController