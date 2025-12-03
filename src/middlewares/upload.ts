import multer from "multer";

// salva arquivos em memória para podermos converter em Base64
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limite 5MB por imagem
  }
});

export default upload;