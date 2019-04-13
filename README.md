# Upload to S3 Webpack plugin

## Example Usage

```
const S3Uploader = require('upload-to-s3-webpack-plugin').default;


module.exports = {
  plugins: [
    new UploadToS3WebpackPlugin({
      include: /.*\.(css|js|jpg|gif|svg|png|ico|pdf)/,
      exclude: /.*\.map/,
      s3Options: {
        accessKeyId: '',
        secretAccessKey: '',
        region: 'eu-west-1',
      },
      s3UploadOptions: {
        Bucket: 'bucketname',
        CacheControl: "max-age=31536000"
      },
      basePath: ""
    })
  ]
}
```
