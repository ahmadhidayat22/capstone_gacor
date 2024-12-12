import Product from '../models/ProductModel.js';
import { Op } from 'sequelize'; 
import { upload, deleteFile } from './Upload.js';
import { nanoid } from 'nanoid';
import { Predict } from './Predict.js';
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllProductsbyUserId = async(req, res) => {
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



const createProduct = async (req, res) => {
    let { name, image, protein, sugar, sodium, saturatedFat, calories, fiber, estVegetableContain } = req.body;

    // console.log(req.file);
    // if (  !name || !grade ||
    //     isNaN(protein) || isNaN(sugar) || isNaN(sodium) || 
    //     isNaN(saturatedFat) || isNaN(calories) || isNaN(fiber) || 
    //     isNaN(estVegetableContain)) {
    //     return res.status(400).json({ message: 'Invalid input: ensure all fields are correctly filled' });
    // }
    if (  !name ||  !protein || !sugar || !sodium || !saturatedFat || !calories || !fiber || !estVegetableContain || !req.file) {
        return res.status(400).json({ message: 'Invalid input: ensure all fields are correctly filled' });
    }
    sodium = sodium/1000;
//    return console.log(sodium)
    const userId = req.id;  // Mendapatkan userId dari token
    // console.log(userId);
    
    try {
        const existingProduct = await Product.findOne({ where: { name: name } });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with this name already exists' });
        }

        console.log(req.file);
        
        const uploadImage = await upload(req.file)
        if (!uploadImage.success || !uploadImage.url || !uploadImage) {
            console.error('Failed to upload image: ', uploadImage.message);
            return res.status(400).json({ message: 'Failed to upload image' });
          }
      
        const imageUrl = uploadImage.url;
        const predictGrade = await Predict(saturatedFat, sugar, fiber, protein, sodium , estVegetableContain,calories);
        // console.log(predictGrade);

        if(!predictGrade?.success)
        {
            return res.status(400).json(`error: ${predictGrade?.message}`);
        }
        const grade = predictGrade?.data[0];
        
        const id = nanoid(16);
        const newProduct = await Product.create({
            id: id,
            name: name,
            image: imageUrl,
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
       return res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        });

        // res.status(201).json({
        //     message: 'ok',
        // });
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            return res.status(500).json({ message: error.message });
          }
    }
};

const _deleteProduct = async(req,res) => {
    const { id } = req.body;
    try {

        const filenameProduct = await Product.findOne({
            where:{
                id: id
            },
            attributes:['image']
        })
        if(!filenameProduct) return res.status(404).json({message: 'Product not found'});
        // console.log(filenameProduct);
        if(filenameProduct.image !== null){ 
            await deleteFile(filenameProduct.image)
        }
        else{
            console.log('kolom image berisi null, tetap menghapus product...')

        }
        // await deleteFile(filenameProduct.image);
        await Product.destroy({
            where: {
                id: id
            }
        });

        res.status(200).json({message: 'Product deleted successfully'});


    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
}


export{ 

    getAllProducts,
    // getProductByName,
    createProduct,
    getAllProductsbyUserId,
    _deleteProduct

}
