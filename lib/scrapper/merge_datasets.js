const fs = require("fs");
const path = require("path");

const mpsData1Path = path.join(__dirname, "../../public/data/mps.json");
const mpsData2Path = path.join(__dirname, "../../.ignore/data/mps.json");
const outputPath = path.join(__dirname, "../../public/data/full_mps.json");

(async () => {
  try {
    // Read and parse both JSON datasets
    const mpsData1 = JSON.parse(fs.readFileSync(mpsData1Path, "utf8"));
    const mpsData2 = JSON.parse(fs.readFileSync(mpsData2Path, "utf8"));

    const mergedData = mpsData1.map((mp1, index) => {
      const cleanName = mp1.memberOfParliament
        .trim()
        .replace(/^(hon\.)\s*/gi, "")
        .replace(/,/g, ""); // Remove commas

      // console.log("Clean Name MP ---------------//");
      const mp2 = mpsData2[index];
      const data = {
        id: mp2.mpName,
        name: cleanName,
        parliamentUrl: mp1.profileURL,
        status: mp1.status,
        party: mp1.party,
        constituency: mp1.constituency,
        imgUrl: mp2.imgUrl,
        education: mp2.education,
        workHistory: mp2.workHistory,
      };

      return data;
    });

    // Write the merged data to a new JSON file
    fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));
    console.log(`Merged data saved at ${outputPath}`);
  } catch (err) {
    console.error(err);
  }
})();
