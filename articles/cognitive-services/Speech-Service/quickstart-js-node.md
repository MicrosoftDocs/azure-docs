---
title: 'Quickstart: Recognize speech in JavaScript in NodeJS using the Speech Service SDK'
titleSuffix: Azure Cognitive Services
description: Learn how to recognize speech in JavaScript in NodeJS using the Speech Service SDK
services: cognitive-services
author: fmegen
manager: cgronlun

ms.service: cognitive-services
ms.component: speech-service
ms.topic: quickstart
ms.date: 11/06/2018
ms.author: fmegen
---

# Quickstart: Recognize speech in JavaScript in NodeJS using the Speech Service SDK

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you'll learn how to create a NodeJS project using the JavaScript binding of the Cognitive Services Speech SDK to transcribe speech to text.
The application is based on the Microsoft Cognitive Services Speech SDK ([Download version 1.1.0](https://aka.ms/csspeech/jsbrowserpackage)).

## Prerequisites

* A subscription key for the Speech service. See [Try the Speech Service for free](get-started.md).
* A PC or Mac, with a working microphone.
* A text editor.
* A current version of NodeJS.

## Create a new project folder

Create a new, empty folder. In case you want to host the sample on a web server, make sure that the web server can access the folder.

Init the folder by issuing

```nodejs
npm init
```

and follow the steps to create a npm project.

## Install the Speech SDK for JavaScript into that folder

[!INCLUDE [License Notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

Add the Speech SDK via `npm install microsoft-cognitiveservices-speech-sdk`.

This will download and install the latest version of the Speech SDK from npmjs to your folder and install in in the `node_modules\microsoft-cognitiveservices-speech-sdk`
directory.

As an alternative, you can download the installation package from TBD and add it from your local drive via `npm install microsoft-cognitiveservices-speech-sdk-1.2.0.tgz`.

## Using the Speech SDK.

Create a new file in the folder, named `main.js` and open this file with a text editor.

1. Create the following JavaScript skeleton:

  ```javascript
"use strict";
  ```

2. Add a reference to the Speech SDK

  <!-- [!code-html[](~/samples-cognitive-services-speech-sdk/quickstart/js-browser/index.html#speechsdkref)] -->

  ```javascript
var sdk = require("microsoft-cognitiveservices-speech-sdk");
  ```

3. Load the file content and prepare a PushStream.

Please note that the Speech SDK does not support a microphone in NodeJS nor does it (currently) support the File data type.
Both is only directly supported on browsers. Instead, please use the Stream interface to the Speech SDK, either through
PullStream() or PushStream() support.

In this example, we will use the PushStream() interface.

  ```javascript
var fs = require("fs");

var filename = "YOUR_WAVE_FILENAME.wav"; // Please note, 16000Hz, Mono support only.
var fileContents = fs.readFileSync(filename);
var arrayBuffer = Uint8Array.from(fileContents).buffer;

var p = sdk.AudioInputStream.createPushStream();
p.write(arrayBuffer);
p.close();
  ```

4. Perform the recognition.

  ```javascript
var audioConfig = sdk.AudioConfig.fromStreamInput(p);
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

To launch the app, adapt the subscription, region, and wave filename and then run it by executing `node main.js`.
It will trigger a recognition using the provided filename and present the output on the console.

[!INCLUDE [Download the sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/js-node` folder.

## Next steps

> [!div class="nextstepaction"]
> [Get our samples](speech-sdk.md#get-the-samples)
