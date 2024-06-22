const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const url =
  "http://www.parliament.go.ke/the-national-assembly/hon-abdi-khamis-chome";

async function scrapeData() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Extract data from the page
    const data = await page.evaluate(() => {
      const imgElement = document.querySelector(".profile-pic img");
      const nameElement = document.querySelector(".object-titles h1");
      const constituencyElement = document.querySelector(
        ".constituency-party h3"
      );
      const partiesElement = document.querySelector(
        ".constituency-party h3 + ul li"
      );

      let mpName = "";
      let constituency = "";
      let parties = "";

      if (nameElement) {
        mpName = nameElement.textContent
          .trim()
          .replace("HON. ", "")
          .toLowerCase()
          .replace(/\s+/g, "_");
      }

      if (constituencyElement) {
        constituency = constituencyElement.textContent.trim();
      }

      if (partiesElement) {
        parties = partiesElement.textContent.trim();
      }

      // Education background extraction
      const educationBackground = [];
      const educationRows = document.querySelectorAll(
        ".field--name-field-education-background table.Table tbody tr"
      );

      educationRows.forEach((row) => {
        const columns = row.querySelectorAll("td");
        if (columns.length === 4) {
          const from = columns[0].textContent.trim();
          const to = columns[1].textContent.trim();
          const institution = columns[2].textContent.trim();
          const qualification = columns[3].textContent.trim();
          educationBackground.push({ from, to, institution, qualification });
        }
      });

      return {
        imgUrl: imgElement ? imgElement.src : null,
        mpName: mpName,
        constituency: constituency,
        parties: parties,
        education: educationBackground,
      };
    });

    if (data.imgUrl && data.mpName) {
      const savePath = path.join(
        __dirname,
        "../../../.ignore/images",
        `${data.mpName}.jpg`
      );
      if (!fs.existsSync(savePath)) {
        const absoluteImgUrl = new URL(data.imgUrl, url).href;
        const viewSource = await page.goto(absoluteImgUrl);
        const buffer = await viewSource.buffer();
        fs.mkdirSync(path.dirname(savePath), { recursive: true });
        fs.writeFile(savePath, buffer, (err) => {
          if (err) throw err;
          console.log(`Image saved at ${savePath}`);
        });
      } else {
        console.log(`Image already exists at ${savePath}`);
      }
    } else {
      console.log("Image or MP name not found on the page.");
    }

    const jsonDataPath = path.join(
      __dirname,
      "../../../.ignore/data",
      "mps.json"
    );
    fs.mkdirSync(path.dirname(jsonDataPath), { recursive: true });
    let existingData = [];
    if (fs.existsSync(jsonDataPath)) {
      existingData = JSON.parse(fs.readFileSync(jsonDataPath));
    }
    existingData.push(data);
    fs.writeFileSync(jsonDataPath, JSON.stringify(existingData, null, 2));
    console.log(`Data saved at ${jsonDataPath}`);

    await browser.close();
  } catch (err) {
    console.error(err);
  }
}

scrapeData();