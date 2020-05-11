---
title: "Quickstart: List text-to-speech voices, Node.js - Speech service"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to get the full list of standard and neural voices for a region/endpoint using Node.js. The list is returned as JSON, and voice availability varies by region.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 04/13/2020
ms.author: erhopf
---

# Quickstart: Get the list of text-to-speech voices using Node.js

In this quickstart, you'll learn how to get the full list of standard and neural voices for a region/endpoint using Node.js. The list is returned as JSON, and voice availability varies by region. For a list of supported regions, see [regions](regions.md).

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Speech service resource. If you don't have an account, you can use the [free trial](get-started.md) to get a subscription key.

## Prerequisites

This quickstart requires:

* <a href="https://nodejs.org/en/" target="_blank">Node 8.12.x or later <span class="docon docon-navigate-external x-hidden-focus"></span></a>
* <a href="https://visualstudio.microsoft.com/downloads/" target="_blank">Visual Studio  <span class="docon docon-navigate-external x-hidden-focus"></span></a>, <a href="https://code.visualstudio.com/download" target="_blank"> Visual Studio Code <span class="docon docon-navigate-external x-hidden-focus"></span></a>, or your favorite text editor
* An Azure subscription key for the Speech service. [Get one for free!](get-started.md).

## Create a project and require dependencies

Create a new Node.js project using your favorite IDE or editor. Then copy this code snippet into your project in a file named `get-voices.js`.

```javascript
// Requires request and request-promise for HTTP requests
// e.g. npm install request request-promise
const rp = require('request-promise');
// Requires fs to write the list of languages to a file
const fs = require('fs');
```

> [!NOTE]
> If you haven't used these modules you'll need to install them before running your program. To install these packages, run: `npm install request request-promise`.

## Get an access token

The text-to-speech REST API requires an access token for authentication. To get an access token, an exchange is required. This function exchanges your Speech service subscription key for an access token using the `issueToken` endpoint.

This sample assumes that your Speech service subscription is in the West US region. If you're using a different region, update the value for `uri`. For a full list, see [Regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#rest-apis).

Copy this code into your project:

```javascript
// Gets an access token.
function getAccessToken(subscriptionKey) {
    let options = {
        method: 'POST',
        uri: 'https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    }
    return rp(options);
}
```

> [!NOTE]
> For more information on authentication, see [Authenticate with an access token](https://docs.microsoft.com/azure/cognitive-services/authentication#authenticate-with-an-authentication-token).

In the next section, we'll create the function to get the list of voices and save the JSON output to file.

## Make a request and save the response

Here you're going to build the request and save the list of returned voices. This sample assumes you're using the West US endpoint. If your resource is registered to a different region, make sure you update the `uri`. For more information, see [Speech service regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#text-to-speech).

Next, add required headers for the request. Finally, you'll make a request to the service. If the request is successful, and a 200 status code is returned, the response is written to file.

```javascript
function textToSpeech(accessToken) {
    let options = {
        method: 'GET',
        baseUrl: 'https://westus.tts.speech.microsoft.com/',
        url: 'cognitiveservices/voices/list',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    }

    let request = rp(options)
        .on('response', (response) => {
            if (response.statusCode === 200) {
                request.pipe(fs.createWriteStream('voices.json'));
                console.log('\nYour file is ready.\n')
            }
        });
    return request;
}
```

## Put it all together

You're almost done. The last step is to create an asynchronous function. This function will read your subscription key from an environment variable, get a token, wait for the request to complete, then write the JSON response to file.

If you're unfamiliar with environment variables or prefer to test with your subscription key hardcoded as a string, replace `process.env.SPEECH_SERVICE_KEY` with your subscription key as a string.

```javascript
// Use async and await to get the token before attempting
// to convert text to speech.
async function main() {
    // Reads subscription key from env variable.
    // You can replace this with a string containing your subscription key. If
    // you prefer not to read from an env variable.
    // e.g. const subscriptionKey = "your_key_here";
    const subscriptionKey = process.env.SPEECH_SERVICE_KEY;
    if (!subscriptionKey) {
        throw new Error('Environment variable for your subscription key is not set.')
    };
    try {
        const accessToken = await getAccessToken(subscriptionKey);
        await textToSpeech(accessToken);
    } catch (err) {
        console.log(`Something went wrong: ${err}`);
    }
}

main()
```

## Run the sample app

That's it, you're ready to run your sample app. From the command line (or terminal session), navigate to your project directory and run:

```console
node get-voices.js
```

## Clean up resources

Make sure to remove any confidential information from your sample app's source code, like subscription keys.

## Next steps

> [!div class="nextstepaction"]
> [Explore Node.js samples on GitHub](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/Samples-Http/NodeJS)

## See also

* [Text-to-speech API reference](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis)
* [Creating custom voice fonts](how-to-customize-voice-font.md)
* [Record voice samples to create a custom voice](record-custom-voice-samples.md)
