---
title: Get Started with the Bing Speech API using Web socket in JS | Microsoft Docs
description: Use the Bing Speech API in Microsoft Cognitive Services to develop basic Web socket applications that continuously convert spoken audio to text.
services: cognitive-services
author: v-ducvo
manager: rstand

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 04/28/201
ms.author: v-ducvo
---

# Get Started with Bing Speech API using web socket
Bing Speech Recognition API allows you to develop applications using [Web socket](https://en.wikipedia.org/wiki/WebSocket) to convert spoken audio to text. One major advantage of using web socket, compared to HTTP connections, is that web socket connections last a long time. This allows you to keep on talking and receiving transcribed text simultaneously. This article will help you get started in using Bing Speech API with web socket. 

## Prerequisites

#### Subscribe to Speech API and get a free trial subscription key
To work with Bing Speech API, you must have a subscription key. If you don't have a subscription key already, get one here: [Subscriptions](https://www.microsoft.com/cognitive-services/en-us/sign-up). 

## Get started
To get started with Bing Speech Recognition API using web socket, we have created a working HTML/JS sample ready for you to try. The steps below will walk you through how to get the source code and how to run the sample.

To run the sample, do the follow:
1. Download a copy of the HTML file and the JavaScript file from the [SpeechToText-WebSockets-Javascript](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript) repository: 
[Sample.html](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript/blob/master/samples/browser/Sample.html)
and [speech.browser.sdk.js](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript/blob/master/distrib/speech.browser.sdk.js)
2. Open the **Sample.html** file in a text editor and edit the follow two lines:
   Replace 'YOUR_BING_SPEECH_API_KEY' with your subscription key.
   Replace '..\..\distrib\speech.browser.sdk.js' with corrected path to the SDK JavaScript file.
   
   > [!NOTE]
   > To work with Bing Speech Recognition API, all you need is a subscription key. However, the Speech API for JavaScript using web socket also support authentication token. If you have an authentication tokan and preferred to use that then do the following. Replace 'let authentication = new SR.CognitiveSubscriptionKeyAuthentication(subscriptionKey);' statement with this 'let authentication = new SR.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback);'.
3. Open **Sample.html** in a web browser.
4. Click the **Start** button. This will initialize the sample and turns on the microphone. Grant the browser access to your microphone if the browser asks for permission. 
5. Start talking. Your transcribed text appears after the **Current hypothesis:** label. The text area will display the JSON payload of the transcribed audio.

## Remarks
* The Bing Speech Recognition API for web socket supports three [recognition modes](https://speechwiki.azurewebsites.net/partners/cognitiveservices-speech-service-web-socket-api#recognition-modes). You can switch the mode by updating the **Setup()** function found in the **Sample.html** file. The sample set the mode to **Interactive** by default. To change the mode, update the parameter 'SR.RecognitionMode.Interactive' to another mode, for example 'SR.RecognitionMode.Conversation'.
* For a complete list of supported languages, see [Supported Languages](https://speechwiki.azurewebsites.net/partners/cognitiveservices-speech-service-api-configuration#recognition-language)

## See also
* Web sock sample repository: [SpeechToText-WebSockets-Javascript](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript)
* Bing Speech API via REST: [Get started with REST API](GetStartedREST.md)
