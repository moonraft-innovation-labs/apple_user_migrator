var jwt = require('jsonwebtoken')
const axios = require('axios')
var querystring = require('querystring');

var jsonBody = {
    iss: "", // apple developer account's Team ID
    sub: "",
    aud: "https://appleid.apple.com",
    iat: 1625202847,
    exp: 1625302847
}

var options = {
    algorithm: "ES256"
}

// apple developer account's private key
var privateKey = ``;

var appBundleId = "";

function initGenerator(data){
    privateKey = data.privateKey;
    appBundleId = data.bundleID;

    jsonBody = {
        iss: data.teamID, // sender account Team ID
        sub: appBundleId, // app's bundle ID
        aud: "https://appleid.apple.com",
        iat: 1625202847,
        exp: 1625302847
    }
}

async function generateAccessToken(){
    jsonBody.iat = Math.trunc(Date.now()/1000) - 10;
    jsonBody.exp = jsonBody.iat + 7200;
    var client_secret = generateClientSecret();
    var access_token =  await getAccessToken(client_secret);
    return {client_secret, access_token};
};

function generateClientSecret(){
    var token = jwt.sign(jsonBody, privateKey, options);
    return token;
};

async function getAccessToken(token) {
    var access_token = await axios.post("https://appleid.apple.com/auth/token",
        querystring.stringify({
            grant_type: 'client_credentials',
            scope: 'user.migration',
            client_id: appBundleId,
            client_secret: token,
        }), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then( (res) => res
    ) .catch(function (error) {
        console.log('error = '+error);
    });
    return access_token;
};

module.exports = {
    generateAccessToken,
    generateClientSecret,
    initGenerator
}

