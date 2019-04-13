const fs = require("fs");
const mime = require("mime/lite");
const AWS = require("aws-sdk");

const uploader = (
  files,
  options,
  {
    onFileUploadStarted = () => {},
    onFileUploaded = () => {},
    onFileFailed = () => {},
    onComplete = () => {}
  }
) => {
  const s3 = new AWS.S3({
    ...options.s3Options
  });
  const totalFiles = files.length;
  let processedFiles = 0;

  const uploadFile = (file, key) =>
    new Promise((resolve, reject) => {
      const params = {
        Body: fs.createReadStream(file),
        Key: options.basePath + key,
        ContentType: mime.getType(file),
        ...options.s3UploadOptions
      };

      onFileUploadStarted(key, options.basePath, ++processedFiles, totalFiles);

      s3.upload(params, (err, data) => {
        if (err) {
          onFileFailed(key);
          reject(err);
        } else {
          onFileUploaded(key, data, processedFiles, totalFiles);
          resolve(data);
        }
      });
    });

  const start = () => {
    return Promise.all(
      files.map(file =>
        uploadFile(file, file.replace(options.baseDirectory, ""))
      )
    ).then(() => {
      onComplete(totalFiles);
      return Promise.resolve();
    });
  };

  return { start };
};

export default uploader;
