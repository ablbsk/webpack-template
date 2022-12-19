import path from "path";
import { fileURLToPath } from "url";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";

(async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const folderPathStr = "src/assets/images/";

  await imagemin([path.resolve(__dirname, `${folderPathStr}*.{jpg,png}`).replace(/\\/g, "/")],
    {
      destination: path.resolve(__dirname, `${folderPathStr}webp`).replace(/\\/g, "/"),
      plugins: [imageminWebp({quality: 70})]
    });

  console.log(`Convert: Images converted to .webp (${path.resolve(__dirname, `${folderPathStr}webp`)})`);
})();
