import Product from '../models/ProductModel.js';
import { Op } from 'sequelize'; 

const getAllProducts = async (req, res) => {
    try {
        const id = req.id;
        const products = await Product.findAll({
            where: {
                userId: id
            }
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductByName = async (req, res) => {
    try {
        const userId = req.id;
        const name = req.params.name;  
        const product = await Product.findOne({
            where: {
                userId: userId,
                name: {
                    [Op.like]: `%${name}%`
                }
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
    const { name, image, protein, sugar, sodium, saturatedFat, calories, fiber, estVegetableContain, grade } = req.body;
    if (  !name || !grade ||
        isNaN(protein) || isNaN(sugar) || isNaN(sodium) || 
        isNaN(saturatedFat) || isNaN(calories) || isNaN(fiber) || 
        isNaN(estVegetableContain)) {
        return res.status(400).json({ message: 'Invalid input: ensure all fields are correctly filled' });
    }

    const userId = req.id;  // Mendapatkan userId dari token
    try {
        const newProduct = await Product.create({
            name: name,
            image: image,
            protein: protein,
            sugar: sugar,
            sodium: sodium,
            saturatedFat: saturatedFat,
            calories: calories,
            fiber: fiber,
            estVegetableContain: estVegetableContain,
            grade: grade,

            userId: userId, // UserId otomatis dari token
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

export{ getAllProducts, getProductByName, createProduct }