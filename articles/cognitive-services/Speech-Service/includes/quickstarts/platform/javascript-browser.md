---
title: "Quickstart: Speech SDK for JavaScript (Browser) platform setup - Speech service"
titleSuffix: Azure Cognitive Services
description: Use this guide to set up your platform for using JavaScript (Browser) with the Speech service SDK.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 10/11/2019
ms.author: erhopf
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for JavaScript for use with a  web page.

[!INCLUDE [License Notice](~/includes/cognitive-services-speech-service-license-notice.md)]

## Create a new Website folder

Create a new, empty folder. In case you want to host the sample on a web server, make sure that the web server can access the folder.

## Unpack the Speech SDK for JavaScript into that folder

Download the Speech SDK as a [.zip package](https://aka.ms/csspeech/jsbrowserpackage) and unpack it into the newly created folder. 
This results in four files being unpacked:
* `microsoft.cognitiveservices.speech.sdk.bundle.js` A human readable version of the Speech SDK.
* `microsoft.cognitiveservices.speech.sdk.bundle.js.map` A map file used for debugging SDK code.
* `microsoft.cognitiveservices.speech.sdk.bundle.d.ts` Object definitions for use with TypeScript
* `microsoft.cognitiveservices.speech.sdk.bundle-min.js` A minified version of the Speech SDK.

## Create an index.html page

Create a new file in the folder, named `index.html` and open this file with a text editor.

## Next steps

[!INCLUDE [windows](../quickstart-list.md)]