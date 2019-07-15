---
title: "Quickstart: Convert text-to-speech, Node.js - Speech Services"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to convert text-to-speech using Node.js and the Text-to-Speech REST API. The sample text included in this guide is structured as Speech Synthesis Markup Language (SSML). This allows you to choose the voice and language of the speech response.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 07/05/2019
ms.author: erhopf
---

# Quickstart: Convert text-to-speech using Node.js

In this quickstart, you'll learn how to convert text-to-speech using Node.js and the text-to-speech REST API. The request body in this guide is structured as [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md), which allows you to choose the voice and language of the response.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Speech Services resource. If you don't have an account, you can use the [free trial](get-started.md) to get a subscription key.

## Prerequisites

This quickstart requires:

* [Node 8.12.x or later](https://nodejs.org/en/)
* [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/download), or your favorite text editor
* An Azure subscription key for the Speech Services. [Get one for free!](get-started.md).

## Create a project and require dependencies

Create a new Node.js project using your favorite IDE or editor. Then copy this code snippet into your project in a file named `tts.js`.

```javascript
// Requires request and request-promise for HTTP requests
// e.g. npm install request request-promise
const rp = require('request-promise');
// Requires fs to write synthesized speech to a file
const fs = require('fs');
// Requires readline-sync to read command line inputs
const readline = require('readline-sync');
// Requires xmlbuilder to build the SSML body
const xmlbuilder = require('xmlbuilder');
```

> [!NOTE]
> If you haven't used these modules you'll need to install them before running your program. To install these packages, run: `npm install request request-promise xmlbuilder readline-sync`.

## Get an access token

The text-to-speech REST API requires an access token for authentication. To get an access token, an exchange is required. This function exchanges your Speech Services subscription key for an access token using the `issueToken` endpoint.

This sample assumes that your Speech Services subscription is in the West US region. If you're using a different region, update the value for `uri`. For a full list, see [Regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#rest-apis).

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

In the next section, we'll create the function to call the text-to-speech API and save the synthesized speech response.

## Make a request and save the response

Here you're going to build the request to the text-to-speech API and save the speech response. This sample assumes you're using the West US endpoint. If your resource is registered to a different region, make sure you update the `uri`. For more information, see [Speech Services regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#text-to-speech).

Next, you need to add required headers for the request. Make sure that you update `User-Agent` with the name of your resource (located in the Azure portal), and set `X-Microsoft-OutputFormat` to your preferred audio output. For a full list of output formats, see [Audio outputs](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis).

Then construct the request body using Speech Synthesis Markup Language (SSML). This sample defines the structure, and uses the `text` input you created earlier.

>[!NOTE]
> This sample uses the `JessaRUS` voice font. For a complete list of Microsoft provided voices/languages, see [Language support](language-support.md).
> If you're interested in creating a unique, recognizable voice for your brand, see [Creating custom voice fonts](how-to-customize-voice-font.md).

Finally, you'll make a request to the service. If the request is successful, and a 200 status code is returned, the speech response is written as `TTSOutput.wav`.

```javascript
// Make sure to update User-Agent with the name of your resource.
// You can also change the voice and output formats. See:
// https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
function textToSpeech(accessToken, text) {
    // Create the SSML request.
    let xml_body = xmlbuilder.create('speak')
        .att('version', '1.0')
        .att('xml:lang', 'en-us')
        .ele('voice')
        .att('xml:lang', 'en-us')
        .att('name', 'Microsoft Server Speech Text to Speech Voice (en-US, Guy24KRUS)')
        .txt(text)
        .end();
    // Convert the XML into a string to send in the TTS request.
    let body = xml_body.toString();

    let options = {
        method: 'POST',
        baseUrl: 'https://westus.tts.speech.microsoft.com/',
        url: 'cognitiveservices/v1',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'User-Agent': 'YOUR_RESOURCE_NAME',
            'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
            'Content-Type': 'application/ssml+xml'
        },
        body: body
    }

    let request = rp(options)
        .on('response', (response) => {
            if (response.statusCode === 200) {
                request.pipe(fs.createWriteStream('TTSOutput.wav'));
                console.log('\nYour file is ready.\n')
            }
        });
    return request;
}
```

## Put it all together

You're almost done. The last step is to create an asynchronous function. This function will read your subscription key from an environment variable, prompt for text, get a token, wait for the request to complete, then convert the text-to-speech and save the audio as a .wav.

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
    // Prompts the user to input text.
    const text = readline.question('What would you like to convert to speech? ');

    try {
        const accessToken = await getAccessToken(subscriptionKey);
        await textToSpeech(accessToken, text);
    } catch (err) {
        console.log(`Something went wrong: ${err}`);
    }
}

main()
```

## Run the sample app

That's it, you're ready to run your text-to-speech sample app. From the command line (or terminal session), navigate to your project directory and run:

```console
node tts.js
```

When prompted, type in whatever you'd like to convert from text-to-speech. If successful, the speech file is located in your project folder. Play it using your favorite media player.

## Clean up resources

Make sure to remove any confidential information from your sample app's source code, like subscription keys.

## Next steps

> [!div class="nextstepaction"]
> [Explore Node.js samples on GitHub](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/Samples-Http/NodeJS)

## See also

* [Text-to-speech API reference](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis)
* [Creating custom voice fonts](how-to-customize-voice-font.md)
* [Record voice samples to create a custom voice](record-custom-voice-samples.md)
