# Apple User Migrator
If you are transferring your apple apps from one apple developer account to another and you use ***apple sign in*** in those apps then check this package out.

If you are using ***Sign in with Apple*** then you need to migrate the users from the old apple developer account to the new one. It can be serious pain in the neck but not if you use this package.

## Install the package
* ```npm install apple-user-migrator```

## Import the package
* ```JavaScript 
  const migrator = require('apple-user-migrator');
  ```
## Steps to do migration
There are **3** steps to successfully transfer your app and migrate it: -

### **Generete transfer Ids for all your existing ***apple sign in***  users**
* Before transferring the app this step is crucial. This package will store generated transfer IDs in a file (provided by you).
* **Note**: - You won't be able to generate transfer IDs for existing users once the transfer is done.
```Javascript
const privateKey = ``;
var data = {
    privateKey: privateKey,
    bundleID: "com.example.myapp", // your app's bundle ID
    teamID: "XXXXXXXXXX", // find it in your developer account
  };
  
  // paths where result data will be stored
  const path_userTransferObjects = "./src/resultFiles/userTransferObjects.json";
  const path_successfulUsers = "./src/resultFiles/successfulUsers.json";
  const path_failedUsers = "./src/resultFiles/failedUsers.json";

  allAppleUsers = [
      {
        databaseUID: "xxxxxx",
        appleUserId: "011111.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.3200"
      },
      {
          databaseUID: "yyyyyy",
          appleUserId: "022222.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.7000"
      },
      {
        databaseUID: "zzzzzz",
        appleUserId: "033333.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.2000"
      },
      ...
    ];
  await migrator.generateAndStoreTransferId(data, allAppleUsers, path_userTransferObjects, path_failedUsers);
```
    
* open  the file  ***"./src/resultFiles/userTransferObjects.json"*** to see the transfer IDs of all users generated.
* <span style="color:red"> ***Note: - using these transfer IDs we will generate new apple user Ids after the app transfer from developer consoles.***
  </span>

## **Transfer the app**
* Transfer the app from developer console
  + Transfer the app from sender apple developer account (you need account holder privileges) 
  + Accept the app on receiver apple developer account.
  
Google it, not a big deal ofcourse 🤓.

## **Generate new apple user IDs from previously generated trasnferIDs**
* Get the required credentials from the new apple developer account where the app is and do this: -
```Javascript
const privateKey = ``;
var data = {
    privateKey: privateKey,
    bundleID: "com.example.myapp", // your app's bundle ID
    teamID: "XXXXXXXXXX", // find it in your developer account
  };
  
  // paths where result data will be stored
  const path_userTransferObjects = "./src/resultFiles/userTransferObjects.json";
  const path_successfulUsers = "./src/resultFiles/successfulUsers.json";
  const path_failedUsers = "./src/resultFiles/failedUsers.json";

  await migrator.transferUsers(data, path_userTransferObjects, path_successfulUsers, path_failedUsers);

  // do this on your own (depending on your DB)
  storeTheNewAppleUIDsBackInTheDatabase();
```
* <span style="color:red"> ***Note: - Do replace the older apple user Ids of all users with new ones in your database. Thats up to you🤪***
  </span>
