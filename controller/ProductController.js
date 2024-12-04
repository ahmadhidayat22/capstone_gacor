import Product from '../models/ProductModel.js';

const getAllProducts = async (req, res) => {
    try {
        const userId = req.userId;
        const products = await Product.findAll({
            where: {
                userId: userId
            }
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const userId = req.userId;
        const product = await Product.findOne({
            where: {
                id: req.params.id,
                userId: userId
            }
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    const { name, image, gradien, category } = req.body;
    if (!name || !gradien || !category) {
        return res.status(400).json({ message: 'Name, gradien, and category are required' });
    }

    const userId = req.userId;  // Mendapatkan userId dari token
    try {
        const newProduct = await Product.create({
            name: name,
            image: image,
            gradien: gradien,
            category: category,
            userId: userId,  // UserId otomatis dari token
        });
        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export{ getAllProducts, getProductById, createProduct }