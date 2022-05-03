---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/javascript.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

Before you can do anything, you need to install the Speech SDK for JavaScript. If you just want the package name to install, run `npm install microsoft-cognitiveservices-speech-sdk`. For guided installation instructions, see [Set up the development environment](../../../quickstarts/setup-platform.md?pivots=programming-language-javascript).

Use the following `require` statement to import the SDK:

```javascript
const sdk = require("microsoft-cognitiveservices-speech-sdk");
```

For more information on `require`, see the [require documentation](https://nodejs.org/en/knowledge/getting-started/what-is-require/).

You must also install [GStreamer](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

## Create captions from speech

Follow these steps to create a new console application for speech recognition.

1. Open a command prompt where you want the new project, and create a new file named `Captioning.js`.
1. Replace the contents of `Captioning.js` with the code that you copy from the [captioning sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/captioning_sample/scenarios/csharp/dotnet/captioning/Program.cs) at GitHub.

Build and run your new console application. Replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region. 


// To install Typescript and Speech SDK
npm install typescript
npm install microsoft-cognitiveservices-speech-sdk
npm install @types/node

// To compile/run sample
npx
tsc captioning.ts


1. Make sure that you have an input file named `caption.this.mp4` in the path.
1. Run the following command to output captions from the video file:
    ```console
    node captioning.js --input caption.this.mp4 --format any --output caption.output.txt - --srt --recognizing --threshold 5 --profanity mask --phrases Contoso;Jesse;Rehaan
    ```

Usage: `node captioning.js --input <input file> --key <key> --region <region>`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
