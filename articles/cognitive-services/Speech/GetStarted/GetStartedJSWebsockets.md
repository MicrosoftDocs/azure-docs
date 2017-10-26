---
title: Get Started with the Microsoft Speech Recognition API in JavaScript | Microsoft Docs
description: Use the Microsoft speech recognition API in Microsoft Cognitive Services to develop applications that continuously convert spoken audio to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 09/29/2017
ms.author: zhouwang
---
# Get started with Microsoft speech recognition API in JavaScript

Microsoft speech recognition API allows you to develop applications that convert spoken audio to text. The JavaScript client library uses the Microsoft [Speech WebSocket Protocol](../API-Reference-REST/websocketprotocol.md), which allows you to keep on talking and receiving transcribed text simultaneously. This article helps you get started in using Microsoft speech recognition API in JavaScript.

## Prerequisites

### Subscribe to speech recognition API and get a free trial subscription key

Microsoft Speech API is part of Microsoft Cognitive Services on Azure(previously Project Oxford). You can get free trial subscription keys from the [Cognitive Services Subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech API, click Get API Key to get the key. It returns a primary and secondary key. Both keys are tied to the same quota, so you may use either key.

> [!IMPORTANT]
> **Get a subscription key**
>
> You must have a [subscription key](https://azure.microsoft.com/try/cognitive-services/) before using speech client libraries.
>
> **Use your subscription key**
>
> With the provided JavaScript sample application, you need to update the file samples/browser/Sample.html with your subscription key. See more information below: [Get started](#get-started).

## Get started

To get started with Microsoft speech recognition API in JavaScript, we have created a working HTML/JS sample ready for you to try. The following steps walk you through how to get the source code and how to run the sample.

1. Download a copy of the HTML file and the JavaScript file from the [Javascript Speech Recognition API Samples](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript) repository:
  - [Sample.html](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript/blob/master/samples/browser/Sample.html) and
  - [speech.browser.sdk.js](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript/blob/master/distrib/speech.browser.sdk.js)

2. Open the **Sample.html** file in a text editor and edit the follow two lines:
  Replace 'YOUR_BING_SPEECH_API_KEY' with your subscription key.
  Replace '..\..\distrib\speech.browser.sdk.js' with corrected path to the SDK JavaScript file.

  > [!NOTE]
  > To work with Microsoft speech recognition API, all you need is a subscription key. However, the speech recognition API also supports authorization token. If you prefer to use an authorization token, see the [Authentication](../How-to/how-to-authentication.md) page for how to get an authorization token, and then replace

  ```javaScript
  let authentication = new SR.CognitiveSubscriptionKeyAuthentication(subscriptionKey);
  ```

  with

  ```javascript
  let authentication = new SR.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback);
  ```

3. Open **Sample.html** in a web browser.

4. Click the **Start** button. It initializes the sample and turns on the microphone. Grant the browser access to your microphone if the browser asks for permission.

5. Start talking. Your transcribed text appears after the **Current hypothesis:** label. The text area displays the JSON payload of the transcribed audio.

## Remarks

- The Microsoft speech recognition API supports 3 [recognition modes](../concepts.md#recognition-modes). You can switch the mode by updating the **Setup()** function found in the **Sample.html** file. The sample set the mode to `Interactive` by default. To change the mode, update the parameter `SR.RecognitionMode.Interactive` to another mode, for example `SR.RecognitionMode.Conversation`.
- For a complete list of supported languages, see [Supported Languages](../API-Reference-REST/supportedlanguages.md).

## Related Topics

- [Javascript Speech Recognition API sample repository](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript)
- [Get started with REST API](GetStartedREST.md)
