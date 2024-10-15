import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadToFTP, simulateVideoConversion } from '../utils/fileHandlers';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (_req, file, cb) => {
    const allowedFormats = ['.mp4', '.mov'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedFormats.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only .mp4 and .mov files are allowed.'));
    }
  }
});

router.post('/', upload.single('video'), async (req: Request, res: Response) => {
  if (req.file) {
    const inputPath = req.file.path;
    const outputPath = path.join('uploads', `${path.parse(req.file.filename).name}.m3u8`);
    const ftpPath = `/videos/${path.parse(req.file.filename).name}.m3u8`;

    try {
      // Simulate video conversion
      await simulateVideoConversion(inputPath, outputPath);

      // Upload to FTP
      const uploadSuccess = await uploadToFTP(outputPath, ftpPath);

      if (uploadSuccess) {
        res.json({
          message: 'File uploaded, converted, and transferred to FTP successfully',
          filename: path.basename(outputPath)
        });
      } else {
        res.status(500).json({ message: 'Failed to upload file to FTP server' });
      }
    } catch (error) {
      console.error('Error in video processing:', error);
      res.status(500).json({ message: 'Error processing video' });
    } finally {
      // Clean up local files
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    }
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

export default router;