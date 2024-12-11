import { Storage } from "@google-cloud/storage";

const isProduction = process.env.NODE_ENV === "production";

const storage = isProduction
  ? new Storage() // Production
  : new Storage({
      projectId: "nutrisee-441918",
      keyFilename: "bucket-secret.json", // Lokal
    });
    
const bucketName = "product-buckets";


const getOrCreateBucket = async (bucketName) => {
  const bucket = storage.bucket(bucketName);
  try {
    const [metadata] = await bucket.getMetadata();
    console.log(`Bucket ${metadata.name} sudah tersedia!`);
    return bucket;
  } catch (error) {
    const optionsCreateBucket = {
      location: "ASIA-SOUTHEAST2",
    };

    await storage.createBucket(bucketName, optionsCreateBucket);
    console.log(`${bucketName} bucket created successfully`);
    return bucket;
  }
};

export const upload = async (file) => {
  const { originalname, buffer, mimetype } = file;
  const renameFile = `${Date.now()}-${originalname.toLowerCase()}`;
  return new Promise((resolve, reject) => {
    try {
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(renameFile);

      const stream = blob.createWriteStream({
        resumable: false,
        contentType: mimetype,
        metadata: {
          metadata: {
            originalName: originalname,
          },
        },
      });

      stream.on("error", (err) => {
        console.error(`Error uploading file: ${err.message}`);
        reject({
          success: false,
          message: err.message,
          url: null,
        });
      });

      stream.on("finish", async () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${renameFile}`;
        console.log(`File uploaded and publicly accessible at: ${publicUrl}`);
        resolve({
          success: true,
          message: `File uploaded and publicly accessible at: ${publicUrl}`,
          url: publicUrl,
        });
      });

      stream.end(buffer);
    } catch (uploadError) {
      console.error(`Gagal mengupload file:`, uploadError.message);
      reject({
        success: false,
        message: uploadError.message,
        url: null,
      });
    }
  });
};

export const deleteFile = async(filename) => {
    const filePath = filename.replace('https://storage.googleapis.com/product-buckets/', '');
    try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);
    await file.delete();
    console.log(`File ${filePath} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
  }
}

// getOrCreateBucket(bucketName).then((bucket) => upload(bucket)).catch(console.error)
