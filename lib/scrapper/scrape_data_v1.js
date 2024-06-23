const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const jsonFilePath = path.join(__dirname, "../../public/data/mps.json");

(async () => {
  try {
    // Read the JSON data
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath));

    // Launch the browser
    const browser = await puppeteer.launch({ headless: false });

    for (const mp of jsonData) {
      const url = mp.profileURL;

      const mpName = mp.memberOfParliament
        .trim()
        .replace(/^(hon\.)\s*/gi, "")
        .replace(/^(hon\.|dr\.|eng\.|\(.*?\))\s*/gi, "")
        .toLowerCase()
        .replace(/,/g, "") // Remove commas
        .replace(/\s+/g, "_");

      const savePath = path.join(
        __dirname,
        "../../.ignore/images",
        `${mpName}.jpg`
      );

      // // Check if the image already exists
      // if (fs.existsSync(savePath)) {
      //   console.log(
      //     `Image already exists at ${savePath}, skipping scraping for ${mp.memberOfParliament}`
      //   );
      //   continue; // Skip scraping and move to the next MP
      // }

      console.log(`Scraping data for ${mp.memberOfParliament} from ${url}`);

      const page = await browser.newPage();

      // Increase the default navigation timeout to 60 seconds
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

      console.log("MP logs ------------------//");
      console.log(mp);

      // Listen for console events
      page.on("console", (msg) => {
        for (let i = 0; i < msg.args().length; ++i)
          console.log(`${i}: ${msg.args()[i]}`);
      });

      const count = 1;
      // Extract data from the page
      const data = await page.evaluate(() => {
        // Function to sanitize text content
        const sanitizeText = (text) => {
          return text.replace(/\s+/g, " ").trim();
        };

        const imgElement = document.querySelector(".profile-pic img");
        const nameElement = document.querySelector(".object-titles h1");
        const constituencyElement = document.querySelector(
          ".constituency-party h3"
        );
        const partiesElement = document.querySelector(
          ".constituency-party h3 + ul li"
        );

        const mpName = nameElement.textContent
          .trim()
          .replace(/^(hon\.)\s*/gi, "")
          .replace(/^(hon\.|dr\.|eng\.|\(.*?\))\s*/gi, "")
          .toLowerCase()
          .replace(/,/g, "") // Remove commas
          .replace(/\s+/g, "_");

        const constituency = sanitizeText(constituencyElement.textContent);

        const parties = sanitizeText(partiesElement.textContent);

        // Education background extraction
        const educationBackground = [];
        const educationRows = document.querySelectorAll(
          ".field--name-field-education-background table.Table tbody tr"
        );

        educationRows.forEach((row, index) => {
          if (index === 0) return; // Skip the first row
          const columns = row.querySelectorAll("td");
          const from = columns[0] ? columns[0].textContent.trim() : "";
          const to = columns[1] ? columns[1].textContent.trim() : "";
          const institution = columns[2]
            ? sanitizeText(columns[2].textContent.trim())
            : "";
          const qualification = columns[3]
            ? sanitizeText(columns[3].textContent.trim())
            : "";

          educationBackground.push({ from, to, institution, qualification });
        });

        // Work history extraction
        const workHistory = [];
        const workRows = document.querySelectorAll(
          "#collapse2 .field--name-field-employment-history table.Table tbody tr"
        );

        workRows.forEach((row, index) => {
          if (index === 0) return; // Skip the first row
          const columns = row.querySelectorAll("td");
          const from = columns[0] ? columns[0].textContent.trim() : "";
          const to = columns[1] ? columns[1].textContent.trim() : "";
          const organization = columns[2]
            ? sanitizeText(columns[2].textContent.trim())
            : "";
          const position = columns[3]
            ? sanitizeText(columns[3].textContent.trim())
            : "";
          workHistory.push({ from, to, position, organization });
        });

        return {
          imgUrl: imgElement ? imgElement.src : null,
          mpName: mpName,
          constituency: constituency,
          parties: parties,
          education: educationBackground,
          workHistory: workHistory,
        };
      });

      if (data.imgUrl && data.mpName) {
        // Define the path to save the image
        const savePath = path.join(
          __dirname,
          "../../.ignore/images",
          `${data.mpName}.jpg`
        );

        // Check if the image already exists
        if (!fs.existsSync(savePath)) {
          // Convert relative URL to absolute URL
          const absoluteImgUrl = new URL(data.imgUrl, url).href;

          // Download the image
          const viewSource = await page.goto(absoluteImgUrl);
          const buffer = await viewSource.buffer();

          // Ensure the directory exists, create it if not
          fs.mkdirSync(path.dirname(savePath), { recursive: true });

          // Save the image to the specified path
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

      // Define the path to save the JSON data
      const jsonDataPath = path.join(
        __dirname,
        "../../.ignore/data",
        "mps.json"
      );

      // Ensure the directory exists, create it if not
      fs.mkdirSync(path.dirname(jsonDataPath), { recursive: true });

      // Read the existing JSON data if it exists
      let existingData = [];
      if (fs.existsSync(jsonDataPath)) {
        existingData = JSON.parse(fs.readFileSync(jsonDataPath));
      }

      // Add new data to existing data
      existingData.push(data);

      // Save the combined data to the JSON file
      fs.writeFileSync(jsonDataPath, JSON.stringify(existingData, null, 2));
      console.log(`Data saved at ${jsonDataPath}`);

      await page.close();
    }
    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
