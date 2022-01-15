const axios = require("axios");
var querystring = require("querystring");

async function generateNewAppleUserId(
  transferSub,
  client_secret,
  access_token,
  currentEmail,
  clientId
) {
  const subId = transferSub;
  
  var response = await axios
    .post(
      "https://appleid.apple.com/auth/usermigrationinfo",
      querystring.stringify({
        client_id: clientId,
        transfer_sub: subId,
        client_secret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + access_token.access_token,
        },
      }
    )
    .catch(function (error) {
      console.log("error = " + error);
    });

  var sub = response.data.sub;
  var newEmail = currentEmail;
  if (response.data.email == undefined) return { sub: sub, newEmail: newEmail };
  return { sub: sub, newEmail: response.data.email };
}

module.exports = { generateNewAppleUserId };
