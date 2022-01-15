const axios = require('axios')
var querystring = require('querystring');

async function generateTransferIdentifier(uid, targetTeamId, client_secret, access_token, clientId){
    const subId = uid;

    var response = await axios.post("https://appleid.apple.com/auth/usermigrationinfo",
        querystring.stringify({
            target: targetTeamId,
            client_id: clientId,
            sub: subId,
            client_secret,
        }), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: 'Bearer '+access_token.access_token
        }
    }).catch(function (error) {
        console.log('error = '+error);
        return {data: error};
    });
    return response.data;
}

module.exports = {generateTransferIdentifier};