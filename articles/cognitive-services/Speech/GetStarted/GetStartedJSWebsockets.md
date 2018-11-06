---
title: Get started with the Bing Speech Recognition API in JavaScript | Microsoft Docs
titlesuffix: Azure Cognitive Services
description: Use the Bing Speech Recognition API in Cognitive Services to develop applications that continuously convert spoken audio to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma
ms.service: cognitive-services
ms.component: bing-speech
ms.topic: article
ms.date: 09/18/2018
ms.author: zhouwang
---
# Get started with the Speech Recognition API in JavaScript

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-bing-speech-api-deprecation-note.md)]

You can develop applications that convert spoken audio to text by using the Speech Recognition API. The JavaScript client library uses the [Speech Service WebSocket protocol](../API-Reference-REST/websocketprotocol.md), which allows you to talk and receive transcribed text simultaneously. This article helps you to get started with the Speech Recognition API in JavaScript.

## Prerequisites

### Subscribe to the Speech Recognition API, and get a free trial subscription key

The Speech API is part of Cognitive Services. You can get free trial subscription keys from the [Cognitive Services subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech API, select **Get API Key** to get the key. It returns a primary and secondary key. Both keys are tied to the same quota, so you can use either key.

> [!IMPORTANT]
> Get a subscription key. Before you can use Speech client libraries, you must have a [subscription key](https://azure.microsoft.com/try/cognitive-services/).

## Get started

In this section we will walk you through the necessary steps to load a sample HTML page. The sample is located in our [github repository](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript). You can **open the sample directly** from the repository, or **open the sample from a local copy** of the repository. 

> [!NOTE]
> Some browsers block microphone access on un-secure origin. So, it is recommended to host the 'sample'/'your app' on https to get it working on all supported browsers. 

### Open the sample directly

Acquire a subscription key as described above. Then open the [link to the sample](https://htmlpreview.github.io/?https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript/blob/preview/samples/browser/Sample.html). This will load the page into your default browser (Rendered using [htmlPreview](https://github.com/htmlpreview/htmlpreview.github.com)).

### Open the sample from a local copy

To try the sample locally, clone this repository:

```
git clone https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript
```

compile the TypeScript sources and bundle them into a single JavaScript file ([npm](https://www.npmjs.com/) needs to be installed on your machine). Change into the root of the cloned repository and run the commands:

```
cd SpeechToText-WebSockets-Javascript && npm run bundle
```

Open `samples\browser\Sample.html` in your favorite browser.

## Next steps

More information on how to include the SDK into your own webpage is available [here](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript).

## Remarks

- The Speech Recognition API supports three [recognition modes](../concepts.md#recognition-modes). You can switch the mode by updating the **Setup()** function found in the Sample.html file. The sample sets the mode to `Interactive` by default. To change the mode, update the parameter `SR.RecognitionMode.Interactive` to another mode. For example, change the parameter to  `SR.RecognitionMode.Conversation`.
- For a complete list of supported languages, see [Supported languages](../API-Reference-REST/supportedlanguages.md).

## Related topics

- [JavaScript Speech Recognition API sample repository](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript)
- [Get started with the REST API](GetStartedREST.md)
