import axios from "axios";
import dotenv from "dotenv";
dotenv.config;

const flaskUrl = `${process.env.FLASK_URL}/predict` || "http://localhost:4000/predict" ;

// "saturated-fat_100g":0,
//     "sugar_100g":0,
//     "fiber_100g":0,
//     "proteins_100g":6.5,
//     "sodium_100g":0.12,
//     "fruits-vegetables-nuts-estimate-from-ingredients_100g":45.0,
//     "energy_kj":1050
export const Predict = async (
  saturatedFat,
  sugar,
  fiber,
  proteins,
  sodium,
  fruitsVegetable,
  calories) => {

  try {
  

    if(!saturatedFat || !sugar || !fiber || !proteins || !sodium || !fruitsVegetable || !calories) {
      return {
        success: false,
        message: "Invalid input: all fields must be filled in and numbers",
      };s
    }
    let bodyFormData = new FormData();
    bodyFormData.append("saturated-fat_100g", saturatedFat);
    bodyFormData.append("sugar_100g", sugar);
    bodyFormData.append("fiber_100g", fiber);
    bodyFormData.append("proteins_100g", proteins);
    bodyFormData.append("sodium_100g", sodium);
    bodyFormData.append(
      "fruits-vegetables-nuts-estimate-from-ingredients_100g",
      fruitsVegetable
    );
    bodyFormData.append("energy_kj", calories);

    console.log("Sending request to Flask API, Url: ", flaskUrl);

    const results = await axios({
      method: "post",
      url: flaskUrl,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Results from model: ", results.data);
    return {
      success: true,
      data: results.data, // Data dari Flask API
      message: "Prediction successful",
    };

  } catch (error) {
    console.error("error: ", error)
    return {
      success: false,
      message: "An error occurred while processing the prediction",
      error: error.message, // Menambahkan pesan error spesifik untuk debugging
    };
}

  // res.send('ok')
};
