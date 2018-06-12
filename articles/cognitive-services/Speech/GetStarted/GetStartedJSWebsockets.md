---
title: Get started with the Microsoft Speech Recognition API in JavaScript | Microsoft Docs
description: Use the Microsoft Speech Recognition API in Cognitive Services to develop applications that continuously convert spoken audio to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 09/29/2017
ms.author: zhouwang
---
# Get started with the Speech Recognition API in JavaScript

You can develop applications that convert spoken audio to text by using the Speech Recognition API. The JavaScript client library uses the [Speech Service WebSocket protocol](../API-Reference-REST/websocketprotocol.md), which allows you to talk and receive transcribed text simultaneously. This article helps you to get started with the Speech Recognition API in JavaScript.

## Prerequisites

### Subscribe to the Speech Recognition API, and get a free trial subscription key

The Speech API is part of Cognitive Services (previously Project Oxford). You can get free trial subscription keys from the [Cognitive Services subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech API, select **Get API Key** to get the key. It returns a primary and secondary key. Both keys are tied to the same quota, so you can use either key.

> [!IMPORTANT]
>* Get a subscription key. Before you can use Speech client libraries, you must have a [subscription key](https://azure.microsoft.com/try/cognitive-services/).
>
>* Use your subscription key. With the provided JavaScript sample application, update the file samples/browser/Sample.html with your subscription key. For more information, see [Get started](#get-started).

## Get started

To get started with the Speech Recognition API in JavaScript, we created a working HTML/JS sample for you to try. The following steps show you how to get the source code and how to run the sample.

1. Download a copy of the HTML file and the JavaScript file from the [JavaScript Speech Recognition API samples](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript) repository:

   - [Sample.html](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript/blob/master/samples/browser/Sample.html)
   - [speech.browser.sdk.js](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript/blob/master/distrib/speech.browser.sdk.js)

2. Open the Sample.html file in a text editor, and edit the following two lines:

   * Replace "YOUR_BING_SPEECH_API_KEY" with your subscription key.
   * Replace "..\..\distrib\speech.browser.sdk.js" with the corrected path to the SDK JavaScript file.

    > [!NOTE]
    > To work with the Speech Recognition API, all you need is a subscription key. The Speech Recognition API also supports authorization tokens. If you want to use an authorization token, see [Authentication](../How-to/how-to-authentication.md) for how to get an authorization token.

   If you want to use an authorization token, replace:

     ```javaScript
     let authentication = new SR.CognitiveSubscriptionKeyAuthentication(subscriptionKey);
     ```

     with:

     ```javascript
     let authentication = new SR.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback);
     ```

3. Open **Sample.html** in a web browser.

4. Select **Start**. The browser initializes the sample and turns on the microphone. Grant the browser access to your microphone if it asks for permission.

5. Start talking. Your transcribed text appears after **Current hypothesis**. The text area displays the JSON payload of the transcribed audio.

## Remarks

- The Speech Recognition API supports three [recognition modes](../concepts.md#recognition-modes). You can switch the mode by updating the **Setup()** function found in the Sample.html file. The sample sets the mode to `Interactive` by default. To change the mode, update the parameter `SR.RecognitionMode.Interactive` to another mode. For example, change the parameter to  `SR.RecognitionMode.Conversation`.
- For a complete list of supported languages, see [Supported languages](../API-Reference-REST/supportedlanguages.md).

## Related topics

- [JavaScript Speech Recognition API sample repository](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript)
- [Get started with the REST API](GetStartedREST.md)
