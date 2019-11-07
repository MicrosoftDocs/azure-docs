---
title: "Quickstart: Recognize speech, intents, and entities, Python - Speech Service"
titleSuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 10/28/2019
ms.author: erhopf
zone_pivot_groups: programming-languages-set-two
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Create a LUIS application and get an endpoint key](../../../../quickstarts/create-luis.md)
> * [Setup your development environment](../../../../quickstarts/setup-platform.md)
> * [Create an empty sample project](../../../../quickstarts/create-project.md)

## Open your project

Open Quickstart.py in your python editor.

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project.
[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=5-7)]

## Create a Speech configuration

Before you can initialize a `IntentRecognizer` object, you need to create a configuration that uses your LUIS Endpoing key and region. Insert this code next.

This sample constructs the `SpeechConfig` object using LUIS key and region. For a full list of available methods, see [SpeechConfig Class](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig).

> [!NOTE]
> It is important to use the LUIS Endpoint key and not the Starter or Authroing keys as only the Endpoint key is valid for speech to intent recognition. See [Create a LUIS application and get an endpoint key](~/articles/cognitive-services/Speech-Service/quickstarts/create-luis.md) for instructions on how to get the correct key.

[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=12)]

## Initialize a IntentRecognizer

Now, let's create a `IntentRecognizer`. Insert this code right below your Speech configuration.
[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=15)]

## Add a LanguageUnderstandingModel and Intents

You now need to associate a `LanguageUnderstandingModel` with the intent recognizer and add the intents you want recognized.
[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=19-27)]

## Recognize an intent

From the `IntentRecognizer` object, you're going to call the `recognize_once()` method. This method lets the Speech service know that you're sending a single phrase for recognition, and that once the phrase is identified to stop reconizing speech.
[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=35)]

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, you'll want to do something with it. We're going to keep it simple and print the result to console.

Inside the using statement, below your call to `recognize_once()`, add this code:
[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=38-47)]

## Check your code

At this point, your code should look like this:
(We've added some comments to this version)
[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/intent-recognition/quickstart.py?range=5-47)]

## Build and run your app

Run the sample from the console or in your IDE:

    ````
    python quickstart.py
    ````

The next 15 seconds of speech input from your microphone will be recognized and logged in the console window.

## Next steps

[!INCLUDE [footer](./footer.md)]
