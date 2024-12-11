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
export const Predict = async (req, res) => {
  const {
    saturatedFat,
    sugar,
    fiber,
    proteins,
    sodium,
    fruitsVegetable,
    energy,
  } = req.body;
  const isValidNumber = (value) => typeof value === "number" && !isNaN(value);

  // console.log(req.body);
  try {
    if (
      !isValidNumber(saturatedFat) ||
      !isValidNumber(sugar) ||
      !isValidNumber(fiber) ||
      !isValidNumber(proteins) ||
      !isValidNumber(sodium) ||
      !isValidNumber(fruitsVegetable) ||
      !isValidNumber(energy)
    ) {
      return res.status(400).json({
        success: "false",
        message: "Invalid input: all fields must be valid numbers",
      });
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
    bodyFormData.append("energy_kj", energy);

    console.log("Sending request to Flask API, Url: ", flaskUrl);

    await axios({
      method: "post",
      url: flaskUrl,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(async (results) => {
        res.json({
          success: true,
          data: results.data, // Mengembalikan data dari Flask API
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          success: false,
          message: "An error occurred while processing the prediction",
        //   error: err.message, // Menambahkan pesan error spesifik untuk debugging
        });
      });
  } catch (error) {
    console.error("error: ", error)
    await res.status(500).json({message: "gagal predict data"})
}

  // res.send('ok')
};
