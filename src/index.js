import uploader from "./utils/uploader";
import path from "path";
import find from "find";

class UploadToS3WebpackPlugin {
  constructor(options = {}) {
    this.options = {
      include: /.*\.(css|js)/,
      basePath: "",
      s3Options: {},
      s3UploadOptions: {},
      ...options
    };
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise(
      "UploadToS3WebpackPlugin",
      compilation => {
        console.log("🚚 Uploading to S3");
        const { options } = this;

        let files;
        if (options.directory) {
          options.baseDirectory = path.resolve(options.directory);
          files = find.fileSync(options.include, options.baseDirectory);
        } else {
          options.baseDirectory = compiler.options.output.path;
          files = Object.keys(compilation.assets).map(
            f => `${options.baseDirectory}/${f}`
          );
        }

        if (options.exclude) {
          files = files.filter(f => !f.match(options.exclude));
        }

        const onFileUploadStarted = (key, basePath, index, total) => {
          process.stdout.write(
            ` Uploading ${index}/${total}:  ${basePath}${key}` + "\r"
          );
        };

        const onFileFailed = key => {
          console.error(`❌ Failed uploading  ${key}`);
        };

        const onComplete = () => {
          process.stdout.clearLine();
          console.log("✅ Finished uploading");
        };

        return uploader(files, options, {
          onFileUploadStarted,
          onFileFailed,
          onComplete
        }).start();
      }
    );
  }
}

export default UploadToS3WebpackPlugin;
