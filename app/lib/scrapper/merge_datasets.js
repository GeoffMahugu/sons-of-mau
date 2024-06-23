const fs = require("fs");
const path = require("path");

const mpsData1Path = path.join(__dirname, "../../../public/data/mps.json");
const mpsData2Path = path.join(__dirname, "../../../.ignore/data/mps.json");
const outputPath = path.join(
  __dirname,
  "../../../.ignore/data/merged_mps.json"
);

(async () => {
  try {
    // Read and parse both JSON datasets
    const mpsData1 = JSON.parse(fs.readFileSync(mpsData1Path, "utf8"));
    const mpsData2 = JSON.parse(fs.readFileSync(mpsData2Path, "utf8"));

    console.log("Checking lengths....");
    console.log(mpsData1.length); //310
    console.log(mpsData2.length); //474

    // const mergedData = mpsData1.map((mp1) => {
    //   // Find the matching MP in mpsData2 based on ProfileURL
    //   const mp2 = mpsData2.find(
    //     (mp) =>
    //       mp.mpName.replace(/_/g, " ") ===
    //       mp1.MemberOfParliament.toLowerCase()
    //         .replace(/hon\./gi, "")
    //         .trim()
    //         .replace(/,/g, "")
    //   );

    //   if (mp2) {
    //     // Merge the data
    //     return {
    //       ...mp1,
    //       imgUrl: mp2.imgUrl,
    //       mpName: mp2.mpName,
    //       education: mp2.education,
    //       workHistory: mp2.workHistory,
    //     };
    //   } else {
    //     // If no matching MP is found, return the original data
    //     return mp1;
    //   }
    // });

    // Write the merged data to a new JSON file
    // fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));
    console.log(`Merged data saved at ${outputPath}`);
  } catch (err) {
    console.error(err);
  }
})();
