---
title: "Quickstart: Recognize Intents from a microphone - Speech Service"
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

Now you're ready to build your app and test our speech recognition using the Speech service.

1. **Compile the code** - From the menu bar of Visual Stuio, choose **Build** > **Build Solution**.
2. **Start your app** - From the menu bar, choose **Debug** > **Start Debugging** or press **F5**.
3. **Start recognition** - It'll prompt you to speak a phrase in English. Your speech is sent to the Speech service, transcribed as text, and rendered in the console.

## Next steps

* How-tos
* Samples
* Reference

