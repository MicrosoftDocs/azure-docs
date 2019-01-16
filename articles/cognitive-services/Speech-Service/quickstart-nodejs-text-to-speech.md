---
title: "Quickstart: Convert text-to-speech, Node.js - Speech Services"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to convert text-to-speech using Node.js and the Text-to-Speech REST API. The sample text included in this guide is structured as Speech Synthesis Markup Language (SSML). This allows you to choose the voice and language of the speech response.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: speech-service
ms.topic: conceptual
ms.date: 01/11/2019
ms.author: erhopf
ms.custom: seodec18
---

# Quickstart: Convert text-to-speech using Node.js

In this quickstart, you'll learn how to convert text-to-speech using Node.js and the text-to-speech REST API. The request body in this guide is structured as [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md), which allows you to choose the voice and language of the response.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Speech Service resource. If you don't have an account, you can use the [free trial](get-started.md) to get a subscription key.

## Prerequisites

This quickstart requires:

* [Node 8.12.x or later](https://nodejs.org/en/)
* [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/download), or your favorite text editor
* An Azure subscription key for the Speech Service. [Get one for free!](get-started.md).

## Create a project and require dependencies

Create a new Node.js project using your favorite IDE or editor. Then copy this code snippet into your project in a file named `tts.js`.

```javascript
// Requires request for HTTP requests
const request = require('request');
// Requires fs to write synthesized speech to a file
const fs = require('fs');
// Requires readline-sync to read command line inputs
const readline = require('readline-sync');
// Requires xmlbuilder to build the SSML body
const xmlbuilder = require('xmlbuilder');
```

> [!NOTE]
> If you haven't used these modules you'll need to install them before running your program. To install these packages, run: `npm install request readline-sync`.

## Set the subscription key and create a prompt for TTS

In the next few sections you'll create functions to handle authorization, call the text-to-speech API, and validate the response. Let's start by adding a subscription key and creating a prompt for text input.

```javascript
/*
 * These lines will attempt to read your subscription key from an environment
 * variable. If you prefer to hardcode the subscription key for ease of use,
 * replace process.env.SUBSCRIPTION_KEY with your subscription key as a string.  
 */
const subscriptionKey = process.env.SUBSCRIPTION_KEY;
if (!subscriptionKey) {
  throw new Error('Environment variable for your subscription key is not set.')
};

// Prompts the user to input text.
let text = readline.question('What would you like to convert to speech? ');
```

## Get an access token

The text-to-speech REST API requires an access token for authentication. To get an access token, an exchange is required. This sample exchanges your Speech Service subscription key for an access token using the `issueToken` endpoint.

This function takes two arguments, your Speech Services subscription key, and a callback function. After the function has obtained an access token, it passes the value to the callback function. In the next section, we'll create the function to call the text-to-speech API and save the synthesized speech response.

This sample assumes that your Speech Service subscription is in the West US region. If you're using a different region, update the value for `uri`. For a full list, see [Regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#rest-apis).

Copy this code into your project:

```javascript
function textToSpeech(subscriptionKey, saveAudio) {
    let options = {
        method: 'POST',
        uri: 'https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };
    // This function retrieve the access token and is passed as callback
    // to request below.
    function getToken(error, response, body) {
        console.log("Getting your token...\n")
        if (!error && response.statusCode == 200) {
            //This is the callback to our saveAudio function.
            // It takes a single argument, which is the returned accessToken.
            saveAudio(body)
        }
        else {
          throw new Error(error);
        }
    }
    request(options, getToken)
}
```

> [!NOTE]
> For more information on authentication, see [Authenticate with an access token](https://docs.microsoft.com/azure/cognitive-services/authentication#authenticate-with-an-authentication-token).

## Make a request and save the response

Here you're going to build the request to the text-to-speech API and save the speech response. This sample assumes you're using the West US endpoint. If your resource is registered to a different region, make sure you update the `uri`. For more information, see [Speech Service regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#text-to-speech).

Next, you need to add required headers for the request. Make sure that you update `User-Agent` with the name of your resource (located in the Azure portal), and set `X-Microsoft-OutputFormat` to your preferred audio output. For a full list of output formats, see [Audio outputs](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#audio-outputs).

Then construct the request body using Speech Synthesis Markup Language (SSML). This sample defines the structure, and uses the `text` input you created earlier.

>[!NOTE]
> This sample uses the `JessaRUS` voice font. For a complete list of Microsoft provided voices/languages, see [Language support](language-support.md).
> If you're interested in creating a unique, recognizable voice for your brand, see [Creating custom voice fonts](how-to-customize-voice-font.md).

Finally, you'll make a request to the service. If the request is successful, and a 200 status code is returned, the speech response is written as `sample.wav`.

```javascript
// Make sure to update User-Agent with the name of your resource.
// You can also change the voice and output formats. See:
// https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
function saveAudio(accessToken) {
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
    };
    // This function makes the request to convert speech to text.
    // The speech is returned as the response.
    function convertText(error, response, body){
      if (!error && response.statusCode == 200) {
        console.log("Converting text-to-speech. Please hold...\n")
      }
      else {
        throw new Error(error);
      }
      console.log("Your file is ready.\n")
    }
    // Pipe the response to file.
    request(options, convertText).pipe(fs.createWriteStream('sample.wav'));
}
```

## Put it all together

You're almost done. The last step is to call the `textToSpeech` function.

```javascript
// Start the sample app.
textToSpeech(subscriptionKey, saveAudio);
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
> [Text-to-speech API reference](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#text-to-speech-api)

## See also

* [Creating custom voice fonts](how-to-customize-voice-font.md)
* [Record voice samples to create a custom voice](record-custom-voice-samples.md)
