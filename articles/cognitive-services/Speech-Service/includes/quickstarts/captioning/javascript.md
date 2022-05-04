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

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Set up the environment

Before you can do anything, you need to install the Speech SDK for JavaScript. If you just want the package name to install, run `npm install microsoft-cognitiveservices-speech-sdk`. For guided installation instructions, see [Set up the development environment](../../../quickstarts/setup-platform.md?pivots=programming-language-javascript).

Use the following `require` statement to import the SDK:

```javascript
const sdk = require("microsoft-cognitiveservices-speech-sdk");
```

For more information on `require`, see the [require documentation](https://nodejs.org/en/knowledge/getting-started/what-is-require/).

You must also install [GStreamer](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

## Create captions from speech

Follow these steps to create a new console application and install the Speech SDK.

1. Copy the [scenarios/java/jre/console/captioning/](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/java/jre/console/captioning/) sample files from GitHub into your project directory.
1. Open a command prompt in the same directory as `Captioning.js`.
1. Run the application with your preferred command line arguments. See [usage and arguments](#usage-and-arguments) for the available options. Here is an example:
    ```console
    node captioning.js --key YourSubscriptionKey --region YourServiceRegion --input c:\caption\caption.this.mp4 --format any --output c:\caption\caption.output.txt - --srt --recognizing --threshold 5 --profanity mask --phrases "Contoso;Jesse;Rehaan"
    ```
    Replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region. Make sure that the specified arguments for `--input` file and `--output` path exist. Otherwise you must change the path.

    The output file with complete captions is written to `c:\caption\caption.output.txt`. Intermediate results are shown in the console:
    ```console
    00:00:00,180 --> 00:00:01,600
    Welcome to
    
    00:00:00,180 --> 00:00:01,820
    Welcome to applied
    
    00:00:00,180 --> 00:00:02,420
    Welcome to applied mathematics
    
    00:00:00,180 --> 00:00:02,930
    Welcome to applied mathematics course
    
    00:00:00,180 --> 00:00:03,100
    Welcome to applied Mathematics course 2
    
    00:00:00,180 --> 00:00:03,230
    Welcome to applied Mathematics course 201.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Create-captions-from-speech" target="_target">I ran into an issue</a>

## Usage and arguments

Usage: `node captioning.js  --key <key> --region <region> --input <input file>`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

