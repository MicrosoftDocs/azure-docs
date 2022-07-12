---
title: "Quickstart: Speech SDK for JavaScript (Browser) platform setup - Speech service"
titleSuffix: Azure Cognitive Services
description: Use this guide to set up your platform for using JavaScript (Browser) with the Speech SDK.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 10/15/2020
ms.author: eur
ms.custom: devx-track-js
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for JavaScript for use with a webpage.

## Create a folder

Create a new, empty folder. If you want to host the sample on a web server, make sure that the web server can access the folder.

## Unpack the Speech SDK for JavaScript into the new folder

Download the Speech SDK as a [.zip package](https://aka.ms/csspeech/jsbrowserpackage) and unpack it into the newly created folder. Five files are unpacked:
- *microsoft.cognitiveservices.speech.sdk.bundle.js*: A human-readable version of the Speech SDK.
- *microsoft.cognitiveservices.speech.sdk.bundle.js.map*: A map file that's used for debugging SDK code.
- *microsoft.cognitiveservices.speech.sdk.bundle.d.ts*: Object definitions for use with TypeScript.
- *microsoft.cognitiveservices.speech.sdk.bundle-min.js*: A minified version of the Speech SDK.
- *speech-processor.js*: Code to improve performance on some browsers.

## Create an index.html page

Create a new file named *index.html* in the folder, and open this file with a text editor.


## HTML script tag

Alternatively, you could directly include a `<script>` tag in the HTMLs `<head>` element, relying on the [JSDelivr NPM syndicate](https://www.jsdelivr.com/package/npm/microsoft-cognitiveservices-speech-sdk).

```html
<script src="https://cdn.jsdelivr.net/npm/microsoft-cognitiveservices-speech-sdk@latest/distrib/browser/microsoft.cognitiveservices.speech.sdk.bundle-min.js">
</script>
```
