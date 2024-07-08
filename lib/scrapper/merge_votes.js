const fs = require("fs");
const path = require("path");

// Paths to the JSON files
const mpsData1Path = path.join(__dirname, "../../public/data/mps.json");
const mpsData2Path = path.join(
  __dirname,
  //   "../../public/data/votes-second-reading.json"
  "../../public/data/votes-second-reading-2024-06-20.json"
);

// Read both JSON files
const mpsData1 = JSON.parse(fs.readFileSync(mpsData1Path, "utf8"));
const mpsData2 = JSON.parse(fs.readFileSync(mpsData2Path, "utf8"));

// Create a map to store merged data
const mergedData = {};
const dataToUpdate = [];

// Add mpsData1 to mergedData
mpsData1.forEach((mp) => {
  mergedData[mp.id] = {
    ...mp,
  };

  //   dataToUpdate.push({
  //     id: mp.id,
  //     name: mp.name,
  //     //   imageURL: mp.imageURL,
  //     //   profileURL: mp.profileURL,
  //     //   county: mp.county,
  //     //   constituency: mp.constituency,
  //     //   party: mp.party,
  //     //   status: mp.status,
  //     //   vote: null, // Initialize vote field
  //     //   phonenumber: null,
  //   });
});

// console.log("mergedData -----------------//");
// console.log(mergedData);

// Function to check if a string contains another string (case insensitive)
function containsText(fullText, searchText) {
  return fullText.toLowerCase().includes(searchText.toLowerCase());
}

// Merge mpsData2 into mergedData based on id or name
mpsData2.forEach((mp) => {
  const key = mp.id; // Assuming 'id' is the identifier in mpsData2
  if (mergedData[key]) {
    console.log("found -----------------//" + key);
    mergedData[key].vote = mp.vote;
  } else {
    // Split the name into parts
    const parts = mp.name.split(" ");

    // Reverse the parts and search for matches
    for (let i = parts.length - 1; i >= 0; i--) {
      const searchedMp = mpsData1.find((mp1) =>
        containsText(mp1.name, mp.name)
      );
      if (searchedMp && mergedData[searchedMp.id]) {
        // console.log(searchedMp.name, "-------", mp.name);
        console.log(searchedMp.id, "-------", mp.id);

        mergedData[searchedMp.id].vote = mp.vote;
        console.log("found in else-----------------//" + searchedMp.id);

        break;
      }
    }
  }
});

// Convert mergedData object to an array of values
const mergedArray = Object.values(mergedData);

console.log(mergedArray.length);
// console.log(dataToUpdate);

// Write merged data to a new JSON file
const mergedFilePath = path.join(
  __dirname,
  "../../public/data/merged-with-votes-2024-06-20.json"
  //   "../../public/data/merged-with-votes.json"
  //   "../../public/data/name_id.json"
  //   "../../public/data/mps.json"
);
fs.writeFileSync(mergedFilePath, JSON.stringify(mergedArray, null, 2));
// fs.writeFileSync(mergedFilePath, JSON.stringify(dataToUpdate, null, 2));

// console.log(`Merged data successfully written to ${mergedFilePath}`);
