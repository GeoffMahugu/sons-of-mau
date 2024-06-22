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

    // Extract data from the page
    const data = await page.evaluate(() => {
      const imgElement = document.querySelector(".profile-pic img");
      const nameElement = document.querySelector(".object-titles h1");
      const emailElement = document.querySelector(
        ".contact-details a[href^='mailto:']"
      );
      const phoneElement = document.querySelector(
        ".contact-details p:nth-child(2)"
      );
      const socialLinks = Array.from(
        document.querySelectorAll(".social-links a")
      ).map((link) => link.href);
      const biographyElement = document.querySelector(".biography");
      const committees = Array.from(
        document.querySelectorAll(".committees ul li")
      ).map((li) => li.textContent.trim());
      const constituencyElement = document.querySelector(
        ".constituency-info p:nth-child(1)"
      );
      const countyElement = document.querySelector(
        ".constituency-info p:nth-child(2)"
      );
      const legislativeActivities = Array.from(
        document.querySelectorAll(".legislative-activities ul li a")
      ).map((a) => ({
        title: a.textContent.trim(),
        link: a.href,
      }));

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
        email: emailElement ? emailElement.textContent.trim() : null,
        phone: phoneElement
          ? phoneElement.textContent.trim().replace("Phone: ", "")
          : null,
        socialLinks: socialLinks,
        biography: biographyElement
          ? biographyElement.textContent.trim()
          : null,
        committees: committees,
        constituency: constituencyElement
          ? constituencyElement.textContent.trim().replace("Constituency: ", "")
          : null,
        county: countyElement
          ? countyElement.textContent.trim().replace("County: ", "")
          : null,
        legislativeActivities: legislativeActivities,
      };
    });

    if (data.imgUrl && data.mpName) {
      // Convert relative URL to absolute URL
      const absoluteImgUrl = new URL(data.imgUrl, url).href;

      // Download the image
      const viewSource = await page.goto(absoluteImgUrl);
      const buffer = await viewSource.buffer();

      // Define the path to save the image
      const savePath = path.join(
        __dirname,
        "../../../.ignore/images",
        `${data.mpName}.jpg`
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

    // Define the path to save the JSON data
    const jsonDataPath = path.join(
      __dirname,
      "../../../.ignore/data",
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

    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
