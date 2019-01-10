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
ms.date: 12/18/2018
ms.author: fmegen
---

# Quickstart: Recognize speech in JavaScript in Node.js using the Speech Service SDK

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you'll learn how to create a Node.js project using the JavaScript binding of the Cognitive Services Speech SDK to transcribe speech to text.
The application is based on the Microsoft [Cognitive Services Speech SDK](https://aka.ms/csspeech/npmpackage).

## Prerequisites

* An Azure subscription key for the Speech Service. [Get one for free](get-started.md).
* A current version of [Node.js](https://nodejs.org).

## Create a new project folder

Create a new, empty folder and initialize it as a new JavaScript and Node.js project.

```sh
npm init -f
```

This will init the package.json files with default values. You will probably want to edit this file later.

## Install the Speech SDK for JavaScript into that folder

Add the Speech SDK via `npm install microsoft-cognitiveservices-speech-sdk` to your Node.js project.

This will download and install the latest version of the Speech SDK and any required prerequisites from npmjs. The SDK will be installed in the `node_modules` directory inside your project folder.

## Using the Speech SDK

Create a new file in the folder, named `index.js` and open this file with a text editor.

> [!NOTE]
> Please note that in Node.js the Speech SDK does not support the microphone or the File data type. Both are only supported on browsers. Instead, use the Stream interface to the Speech SDK, either through `AudioInputStream.createPushStream()` or `AudioInputStream.createPullStream()`.

In this example, we will use the `PushAudioInputStream` interface.

Add the following JavaScript code:

[!code-javascript[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/js-node/index.js#code)]

## Running the sample from command line

To launch the app, adapt `YourSubscriptionKey`, `YourServiceRegion`, and `YourAudioFile.wav` to your configuration. Then you can execute it by calling the following command:

```sh
node index.js
```

It will trigger a recognition using the provided filename and present the output on the console.

Here is a sample output of running `index.js` after updating the subscription key and using the file `whatstheweatherlike.wav`.

```json
SpeechRecognitionResult {
  "privResultId": "9E30EEBD41AC4571BB77CF9164441F46",
  "privReason": 3,
  "privText": "What's the weather like?",
  "privDuration": 15900000,
  "privOffset": 300000,
  "privErrorDetails": null,
  "privJson": {
    "RecognitionStatus": "Success",
    "DisplayText": "What's the weather like?",
    "Offset": 300000,
    "Duration": 15900000
  },
  "privProperties": null
}
```

## Running the sample from Visual Studio Code

You can run the sample from Visual Studio Code as well. Follow these steps to install, open, and execute the quickstart:

1. Start Visual Studio Code and click on "Open Folder", then navigate to the quickstart folder

   ![Screenshot of Open Folder](media/sdk/qs-js-node-01-open_project.png)

1. Open a terminal in Visual Studio Code

   ![Screenshot of the terminal window](media/sdk/qs-js-node-02_open_terminal.png)

1. Run npm to install the dependencies

   ![Screenshot of npm install](media/sdk/qs-js-node-03-npm_install.png)

1. Now you are ready to open `index.js`and set a breakpoint

   ![Screenshot of index.js with a breakpoint on line 16](media/sdk/qs-js-node-04-setup_breakpoint.png)

1. To start debugging, either hit F5 or select Debug/Start Debugging from the menu

   ![Screenshot of the debug menu](media/sdk/qs-js-node-05-start_debugging.png)

1. When a breakpoint is hit, you can inspect the callstack and variables

   ![Screenshot of debugger](media/sdk/qs-js-node-06-hit_breakpoint.png)

1. Any output will be shown in the debug console window

   ![Screenshot of debug console](media/sdk/qs-js-node-07-debug_output.png)

## Next steps

> [!div class="nextstepaction"]
> [Explore Node.js samples on GitHub](https://aka.ms/csspeech/samples)
