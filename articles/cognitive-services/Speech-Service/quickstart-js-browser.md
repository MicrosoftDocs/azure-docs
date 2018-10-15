---
title: 'Quickstart: Recognize speech in JavaScript in a browser using the Cognitive Services Speech SDK'
titleSuffix: "Microsoft Cognitive Services"
description: Learn how to recognize speech in JavaScript in a browser using the Cognitive Services Speech SDK
services: cognitive-services
author: fmegen

ms.service: cognitive-services
ms.component: Speech
ms.topic: article
ms.date: 10/12/2018
ms.author: fmegen
---

# Quickstart: Recognize speech in JavaScript in a browser using the Cognitive Services Speech SDK

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you'll learn how to create a website using the JavaScript binding of the Cognitive Services Speech SDK to transcribe speech to text.
The application is based on the Microsoft Cognitive Services Speech SDK ([Download version 1.0.1](https://aka.ms/csspeech/jsbrowserpackage)).

## Prerequisites

* A subscription key for the Speech service. See [Try the speech service for free](get-started.md).
* A PC or Mac, with a working microphone.
* A text editor.
* A current version of Chrome or Microsoft Edge.
* Optionally, a web server that supports hosting PHP scripts.

## Create a new Website folder

Create a new, empty folder. In case you want to host the sample on a web server, make sure that the web server can access the folder.

## Unpack the Speech SDK for JavaScript into that folder

[!INCLUDE [License Notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

Download the Speech SDK as a [.zip package](https://aka.ms/csspeech/jsbrowserpackage) and unpack it into the newly created folder. This should result in two files being unpacked, i.e., `microsoft.cognitiveservices.speech.sdk.bundle.js` and `microsoft.cognitiveservices.speech.sdk.bundle.js.map`.
The latter file is optional and used to help debugging into SDK code, if necessary.

## Create an index.html page

Create a new file in the folder, named `index.html` and open this file with a text editor.

1. Create the following HTML skeleton:

  ```html
  <html>
  <head>
      <title>Microsoft Cognitive Service Speech SDK JavaScript Quickstart</title>
  </head>
  <body>
    <!-- UI code goes here -->

    <!-- SDK reference goes here -->

    <!-- Optional authorization token request goes here -->

    <!-- Sample code goes here -->
  </body>
  </html>
  ```

1. Add the following UI code to your file, below the first comment:

  [!code-html[](~/samples-cognitive-services-speech-sdk/quickstart/js-browser/index.html#uidiv)]

1. Add a reference to the Speech SDK

  [!code-html[](~/samples-cognitive-services-speech-sdk/quickstart/js-browser/index.html#speechsdkref)]

1. Wire up handlers for the recognition button, recognition result, and subscription related fields defined by the UI code:

  [!code-html[](~/samples-cognitive-services-speech-sdk/quickstart/js-browser/index.html#quickstartcode)]

## Create the token source (optional)

In case you want to host the web page on a web server, you can optionally provide a token source for your demo application.
That way, your subscription key will never leave your server while allowing users to use speech capabilities without entering any authorization code themselves.

1. Create a new file named `token.php`. In this example we assume your web server supports the PHP scripting language. Enter the following code:

  [!code-php[](~/samples-cognitive-services-speech-sdk/quickstart/js-browser/token.php)]

1. Edit the `index.html` file and add the following code to your file:

  [!code-html[](~/samples-cognitive-services-speech-sdk/quickstart/js-browser/index.html#authorizationfunction)]

> [!NOTE]
> Authorization tokens only have a limited lifetime.
> This simplified example does not show how to refresh authorization tokens automatically. As a user, you can manually reload the page or hit F5 to refresh.

## Build and run the sample locally

To launch the app, double-click on the index.html file or open index.html with your favorite web browser. It will present a simple GUI allowing you to enter your subscription key and [region](regions.md) and trigger a recognition using the microphone.

## Build and run the sample via a web server

To launch your app, open your favorite web browser and point it to the public URL that you host the folder on, enter your [region](regions.md), and trigger a recognition using the microphone. If configured, it will acquire a token from your token source.

[!INCLUDE [Download the sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/js-browser` folder.

## Next steps

> [!div class="nextstepaction"]
> [Get our samples](speech-sdk.md#get-the-samples)
