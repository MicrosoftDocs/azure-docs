---
title: 'Quickstart: Recognize speech in JavaScript in Node.js using the Speech Service SDK'
titleSuffix: Azure Cognitive Services
description: Learn how to recognize speech in JavaScript in Node.js using the Speech Service SDK
services: cognitive-services
author: fmegen
manager: cgronlun

ms.service: cognitive-services
ms.component: speech-service
ms.topic: quickstart
ms.date: 11/06/2018
ms.author: fmegen
---

# Quickstart: Recognize speech in JavaScript in Node.js using the Speech Service SDK

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you'll learn how to create a Node.js project using the JavaScript binding of the Cognitive Services Speech SDK to transcribe speech to text.
The application is based on the Microsoft Cognitive Services Speech SDK ([Download version 1.2.0](https://aka.ms/csspeech/jsbrowserpackage)).

## Prerequisites

* A subscription key for the Speech service. See [Try the Speech Service for free](get-started.md).
* A current version of [Node.js](https://nodejs.org).

## Create a new project folder

Create a new, empty folder and run the following command

```nodejs
npm init
```

This will initialize `package.json` with the information you provide. For this quickstart, simply leave the default values:

```json
{
  "name": "quickstart",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "author",
  "license": "MIT"
}
```

## Install the Speech SDK for JavaScript into that folder

[!INCLUDE [License Notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

Add the Speech SDK via `npm install microsoft-cognitiveservices-speech-sdk`.

This will download and install the latest version of the Speech SDK from npmjs to your folder and install it in the `node_modules\microsoft-cognitiveservices-speech-sdk` directory. In addition, it will download any required prerequisites.

As an alternative, you can download the installation package from TBD and install it from your local directory via `npm install microsoft-cognitiveservices-speech-sdk-1.2.0.tgz`.

## Using the Speech SDK

Create a new file in the folder, named `index.js` and open this file with a text editor.

1. Create the following JavaScript skeleton:

  ```javascript
"use strict";
  ```

2. Add a reference to the Speech SDK

  <!-- [!code-html[](~/samples-cognitive-services-speech-sdk/quickstart/js-browser/index.html#speechsdkref)] -->

  ```javascript
var sdk = require("microsoft-cognitiveservices-speech-sdk");
  ```

3. Load the file content and prepare a PushAudioInputStream.

> [!NOTE]
> Please note that in Node.js the Speech SDK does not support the microphone or the File data type. Both are only supported on browsers. Instead, use the Stream interface to the Speech SDK, either through `AudioInputStream.createPushStream()` or `AudioInputStream.createPullStream()`.

In this example, we will use the `PushAudioInputStream` interface.

  ```javascript
var fs = require("fs"); // provides access to the file system

var filename = "YOUR_WAVE_FILENAME.wav"; // 16000Hz, Mono support only.
var fileContents = fs.readFileSync(filename);
var arrayBuffer = Uint8Array.from(fileContents).buffer;

var audioStream = sdk.AudioInputStream.createPushStream();
audioStream.write(arrayBuffer);
audioStream.close();
  ```

4. Perform the recognition.

  ```javascript
var audioConfig = sdk.AudioConfig.fromStreamInput(audioStream);
var speechConfig = sdk.SpeechConfig.fromSubscription("YOUR_SUBSCRIPTION", "YOUR_REGIOM");

var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

recognizer.recognizeOnceAsync(
    function (result) {
      console.log(result);

      recognizer.close();
      recognizer = undefined;
    },
    function (err) {
      console.trace("err - " + err);

      recognizer.close();
      recognizer = undefined;
    });
  ```

## Running the sample

To launch the app, adapt the subscription, region, and wave filename and then run it by executing

```nodejs
node index.js
```

It will trigger a recognition using the provided filename and present the output on the console.

Here is a sample output of running main.java after updating the subscription key and using the file `whatstheweatherlike.wav`.

```json
SpeechRecognitionResult {
  privResultId: '9E30EEBD41AC4571BB77CF9164441F46',
  privReason: 3,
  privText: 'What\'s the weather like?',
  privDuration: 15900000,
  privOffset: 300000,
  privErrorDetails: undefined,
  privJson: '{"RecognitionStatus":"Success","DisplayText":"What\'s the weather like?","Offset":300000,"Duration":15900000}',
  privProperties: undefined }
```

For the complete quickstart code and more samples, please visit our Samples Repository.

[!INCLUDE [Download the sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/js-node` folder.

## Next steps

> [!div class="nextstepaction"]
> [Get our samples](speech-sdk.md#get-the-samples)
