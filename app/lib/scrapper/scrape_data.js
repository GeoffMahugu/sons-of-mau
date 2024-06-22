const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const url =
  "http://www.parliament.go.ke/the-national-assembly/hon-eric-wamumbi";

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Increase the default navigation timeout to 60 seconds
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Extract the MP's name and the image URL
    const { imgUrl, mpName } = await page.evaluate(() => {
      const imgElement = document.querySelector(".profile-pic img");
      const nameElement = document.querySelector(".object-titles h1");

      let mpName = "";
      if (nameElement) {
        mpName = nameElement.textContent
          .trim()
          .replace("HON. ", "")
          .toLowerCase()
          .replace(/\s+/g, "_");
      }

      return {
        imgUrl: imgElement ? imgElement.src : null,
        mpName: mpName,
      };
    });

    if (imgUrl && mpName) {
      // Convert relative URL to absolute URL
      const absoluteImgUrl = new URL(imgUrl, url).href;

      // Download the image
      const viewSource = await page.goto(absoluteImgUrl);
      const buffer = await viewSource.buffer();

      // Define the path to save the image
      const savePath = path.join(
        __dirname,
        "../../../.ignore/images",
        `${mpName}.jpg`
      );

      // Ensure the directory exists, create it if not
      fs.mkdirSync(path.dirname(savePath), { recursive: true });

      // Save the image to the specified path
      fs.writeFile(savePath, buffer, (err) => {
        if (err) throw err;
        console.log(`Image saved at ${savePath}`);
      });
    } else {
      console.log("Image or MP name not found on the page.");
    }

    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
