---
title: Include file
description: include file
services: azure-communication-services
author: dbasantes

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 12/06/2024
ms.topic: Include
ms.custom: Include file
ms.author: dbasantes
---

Get started with Azure Communication Services SMS Opt-out API by using the following JavaScript sample code.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Browser or Node.js Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 are recommended).
- An active Communication Services resource and connection string. See [Create a Communication Services resource](../../create-communication-resource.md).
- An SMS-enabled telephone number. See [Get a phone number](../../telephony/get-phone-number.md).
- [CryptoJS](https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/crypto-js/CryptoJS%20v3.1.2.zip) is JavaScript implementations of standard and secure cryptographic algorithms.

## Sample code to use Opt-Out API

This sample demonstrates how to use the Opt-Out Management API in JavaScript to programmatically add, remove, or check opt-out entries.

```html
<script src="Scripts/CryptoJS/sha256-min.js" type="text/javascript"></script>
<script src="Scripts/CryptoJS/hmac-sha256.js" type="text/javascript"></script>
<script src="Scripts/CryptoJS/enc-base64-min.js" type="text/javascript"></script>

```

```js
const ConnectionString = "endpoint=https://[CONTOSO].communication.azure.com/;accesskey=******";

// Sample for Add action. Replace with Check or Remove as necessary.
function sendOptOutAdd(acsResourceConnectionString, payload, apiVersion = "2024-12-10-preview")
{
    try
    {
        var acsRCS = acsResourceConnectionString
            .split(";")
            .map(i =>
            {
                var p = i.indexOf("=");
                return [i.substr(0, p), i.substr(p + 1)];
            })
            .reduce((a, i) => ({ ...a, [i[0]]: i[1] }), {});
        var uri = `${trimEnd(acsRCS.endpoint, "/")}/sms/optouts:add?api-version=${apiVersion}`;
        var url = new URL(uri);
        var method = "POST";
        var utcNow = new Date().toUTCString();
        var bodyJson = JSON.stringify(payload);
        var hashedBody = CryptoJS.SHA256(bodyJson).toString(CryptoJS.enc.Base64);
        var stringToSign = `${method}\n${url.pathname}${url.search}\n${utcNow};${url.host};${hashedBody}`;
        var signature = CryptoJS.HmacSHA256(stringToSign, CryptoJS.enc.Base64.parse(acsRCS.accesskey)).toString(CryptoJS.enc.Base64);

        fetch(uri, {
            method: method,
            headers: {
                "content-type": "application/json",
                "x-ms-date": utcNow,
                "x-ms-content-sha256": hashedBody,
                Authorization: `HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=${signature}`
            },
            body: bodyJson
        })
        .then(response => response.json())
        .then(console.warn)
        .catch(console.error);
    }
    catch (ex)
    {
        console.error(ex);
    }
}

function trimEnd(s, c)
{
    while (s.slice(-1) == c)
        s = s.slice(0, -1);
    return s;
}

// Usage

var payload = {
    from: "+15551234567",
    recipients: [
        { to: "+15550112233" }
    ],
};

sendOptOutAdd(ConnectionString, payload);

```

