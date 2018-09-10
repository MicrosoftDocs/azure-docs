---
title: 'Quickstart: Recognize speech in JavaScript in a browser using the Cognitive Services Speech SDK | Microsoft Docs'
titleSuffix: "Microsoft Cognitive Services"
description: Learn how to recognize speech in JavaScript in a browser using the Cognitive Services Speech SDK
services: cognitive-services
author: fmegen
manager: wolfma

ms.service: cognitive-services
ms.technology: Speech
ms.topic: article
ms.date: 07/16/2018
ms.author: fmegen
---

# Quickstart: Recognize speech in JavaScript in a browser using the Cognitive Services Speech SDK

In this article, you'll learn how to create a website using the JavaScript binding of the Cognitive Services Speech SDK to transcribe speech to text.
The application is based on the Microsoft Cognitive Services Speech SDK zip download, version 0.7.0.

## Prerequisites

* A subscription key for the Speech service. See [Try the speech service for free](get-started.md).
* A PC or Mac, with a working microphone.
* A text editor.
* Optionally, a Web Server that supports hosting PHP scripts.

## Create a new Website folder

Create a new, empty Folder. In case you want to host the sample on a WebServer, make sure that the webserver can access the folder.

The current version of the Cognitive Services Speech SDK is `0.7.0`.

## Unpack the Speech SDK for JavaScript into that folder

Download the Speech SDK from [TBD] and unpack the Zip file into the newly created folder. This should result in two files being unpacked, i.e., the speech.sdk.bundle.js as well as the speech.sdk.bundle.js.map.
The later file is optional and used to help debugging into SDK code, if necessary.

## Create an index.html page

Now create a new file in the folder, named `index.html` and open this file with a text editor.

1. Add the following UI code to your file.

1. Add a reference to the Speech SDK

1. Wire up handlers for the recognizeAsync button.

## Create the token source (optional)

In case you want to host the web page on a web server, you can optionally provide a token source for your demo application.
That way, your subscription key will never leave your server while alloing users to use speech capabilities without entering any autorization code themselves.

1. Create a new file named `token.php`. In this example we assume your web server supports the PHP scripting language. Enter the following code:

1. Edit the `index.html` file and add the following code near the end of your file:

## Build and run the sample locally

To launch the app, double-click on the index.html file or open index.html with your favourite web browser. It will present a simple GUI allowing you to enter your subscription key and trigger a recognition using the microphone.

## Build and run the sample via a web server

To launch your app, open your favorite web browser and point it to the public URL that you host the folder on. If configured, it will aquire a token from your token source.

[!include[Download the sample](includes/speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/java-android` folder.

## Next steps

* Visit the [samples page](samples.md) for additional samples.
