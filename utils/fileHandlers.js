const ftp = require('basic-ftp');
const fs = require('fs');

async function uploadToFTP(filePath, ftpPath) {
  const client = new ftp.Client();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: process.env.FTP_PORT
    });
    await client.uploadFrom(filePath, ftpPath);
    return true;
  } catch (err) {
    console.error('FTP upload error:', err);
    return false;
  } finally {
    client.close();
  }
}

function simulateVideoConversion(inputPath, outputPath) {
  return new Promise((resolve) => {
    // Simulate conversion process
    setTimeout(() => {
      fs.writeFileSync(outputPath, 'Simulated .m3u8 content');
      resolve();
    }, 2000); // Simulate 2 seconds of processing time
  });
}

module.exports = {
  uploadToFTP,
  simulateVideoConversion
};