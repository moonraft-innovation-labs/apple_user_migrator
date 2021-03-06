const Credentials = require("./access-token-generator");
const TransferIdentifierGenerator = require("./transfer-identifier-generator");
const AppleUserIdGenerator = require("./apple-userid-generator");

const fs = require("fs");

var privateKey = ``;

async function transferUsers(data, path_userTransferObjects, path_successfulUsers, path_failedUsers) {
  Credentials.initGenerator(data);
  var receiverCred = await Credentials.generateAccessToken();

  // get transferUserObjects from file
  var buffer = fs.readFileSync(path_userTransferObjects);
  var stringJsonFromFile = buffer.toString();
  var userTransferObjects = JSON.parse(stringJsonFromFile);

  // start migrating users and store them in appropiate lists
  var successfulUsers = [];
  var failedUsers = [];
  for await (const user of userTransferObjects) {
    var transferId = user.transferId;
    var currentEmail = user.email;
    try {
      var response = await AppleUserIdGenerator.generateNewAppleUserId(
        transferId,
        receiverCred.client_secret,
        receiverCred.access_token.data,
        currentEmail,
        data.bundleID
      );

      var successfulUserObject = {
        ...user,
        newAppleId: response.sub,
        newEmail: response.newEmail,
      };
      successfulUsers.push(successfulUserObject);
    } catch (error) {
      var failedUserObject = {
        ...user,
        error: error,
      };
      failedUsers.push(failedUserObject);
    }
  }

  fs.writeFile(path_successfulUsers, JSON.stringify(successfulUsers), (err) => {
    if (err) throw err;
    console.log("successful Users are written to file " + path_successfulUsers);
  });

  fs.writeFile(path_failedUsers, JSON.stringify(failedUsers), (err) => {
    if (err) throw err;
    console.log("failed Users are written to file " + path_failedUsers);
  });
}

async function generateAndStoreTransferId(data, allUsers, path_userTransferObjects, path_failedUsers) {
  Credentials.initGenerator(data);
  var senderCred = await Credentials.generateAccessToken();

  var userTransferObjects = [];
  var userTransferErrorObjects = [];

  for await (const user of allUsers) {
    var appleUserId = user.appleUserId;

    var tI;
    try {
      tI = await TransferIdentifierGenerator.generateTransferIdentifier(
        appleUserId,
        data.teamID,
        senderCred.client_secret,
        senderCred.access_token.data,
        data.bundleID
      );
      var userTransferObject = {
        ...user,
        transferId: tI.transfer_sub,
      };
      userTransferObjects.push(userTransferObject);
    } catch (error) {
      console.error(error);
      var userTransferObject = {
        ...user,
        error: error,
      };
      userTransferErrorObjects.push(userTransferObject);
    }
  }

  fs.writeFile(
    path_userTransferObjects,
    JSON.stringify(userTransferObjects),
    (err) => {
      if (err) throw err;
      console.log(
        userTransferObjects.length +
          " users have successfull transferIds in file " +
          path_userTransferObjects
      );
    }
  );

  fs.writeFile(
    path_failedUsers,
    JSON.stringify(userTransferErrorObjects),
    (err) => {
      if (err) throw err;
      console.log(
        userTransferErrorObjects.length +
          " users have failed transferIds in file " +
          path_failedUsers
      );
    }
  );
}

module.exports = { generateAndStoreTransferId, transferUsers };
