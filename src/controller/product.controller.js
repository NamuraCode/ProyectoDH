const favorites = require('../data/shoppingCart.json')
const { productosLogica, generosLogica } = require('../models')

const productController = {
    dashboard: (req, res) => {
        res.render('dashboard');
    },
    agregarProducto: (req, res) => {
        res.render('agregarProducto');
    },
    eliminarProducto: (req, res) => {
        res.render('eliminarProducto');
    },
    editarProducto: (req, res) => {
        res.render('editarProducto');
    },
    productsList: (req, res) => {
        productosLogica.getAll({
                include: ["imagenes"]
            })
            .then(ingresan => {
                console.log(ingresan[1].imagenes.image)
                res.render('products', {
                    ingresan
                })
            })
    },
    productCart: (req, res) => {
        res.render('productCart', {
            favorite: favorites
        })
    },
    agregarCart: (req, res) => {
        let id = req.body.id
        let favorite = productos.find(element => element.id == id);
        console.log(favorite)
        favorites.push(favorite)
        let favor = JSON.stringify(favorites, null, 6)
        fs.writeFileSync(path.join(__dirname, '../data/shoppingCart.json'), favor)
        res.redirect('/productCart')
    },
    create: (req, res) => {
        try{
            let newProduct = productosLogica.newProductos({
                image: '/images/productos/'+req.file.filename,
                nombre: req.body.nombre,
                categoria: req.body.categorias_id,
                precio: req.body.precio,
                descripcion: req.body.descripcion
            })
            res.render('agregarProducto')
        } catch(e){
            next(e)
        }
    },
    deleteProduct: (req, res) => {
        console.log('Desarrolla la logica para eliminar productos plis')
    },
    editProduct: (req, res) => {
        try{
            let editProduct = productosLogica.editarProducto({
                id: req.body.id,
                image:  '/images/productos/'+req.file.filename,
                nombre: req.body.nombre,
                categoria: req.body.categorias_id,
                precio: req.body.precio,
                descripcion: req.body.descripcion
            })
            res.render('editarProducto')
        } catch(e){
            next(e)
        }
    },
    productDetail: async (req, res) => {
        try{
            
            let productos = await productosLogica.getDetail(req.params.id)
            let categoria = await generosLogica.getAll({
                where:{
                    id: productos.categorias_id
                }
            })
            res.render('productDetail', {
                ingresan: productos, categoria: categoria
            })
            console.log(productos, categoria.categoria)
        }catch(e){
            next(e)
        }
        
    },
}

module.exports = productController;