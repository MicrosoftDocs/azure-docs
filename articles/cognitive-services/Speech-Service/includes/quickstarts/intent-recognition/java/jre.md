---
title: "Quickstart: Recognize speech, intents, and entities, Java - Speech service"
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.date: 01/02/2020
ms.topic: include
ms.author: erhopf
zone_pivot_groups: programming-languages-set-two
---

## Prerequisites

Before you get started:

* If this is your first C++ project, use this guide to [create an empty sample project](../../../../quickstarts/create-project.md?tabs=jre)
* [Install the Speech SDK for your development environment](../../../../quickstarts/setup-platform.md?tabs=jre)

## Create a LUIS app for intent recognition

[!INCLUDE [Create a LUIS app for intent recognition](../luis-sign-up.md)]

## Open your project

Load your project and open `Main.java`.

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project.
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java?range=6-20,69-76)]

## Create a Speech configuration

Before you can initialize an `IntentRecognizer` object, you need to create a configuration that uses your LUIS Endpoint key and region. Insert this code in the try / catch block in main

This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig?view=azure-dotnet).
The Speech SDK will default to recognizing using en-us for the language, see [Specify source language for speech to text](../../../../how-to-specify-source-language.md) for information on choosing the source language.

> [!NOTE]
> It is important to use the LUIS Endpoint key and not the Starter or Authoring keys as only the Endpoint key is valid for speech to intent recognition. See [Create a LUIS application and get an endpoint key](~/articles/cognitive-services/Speech-Service/quickstarts/create-luis.md) for instructions on how to get the correct key.

[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java?range=27)]

## Initialize an IntentRecognizer

Now, let's create an `IntentRecognizer`. Insert this code right below your Speech configuration.
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java?range=30)]

## Add a LanguageUnderstandingModel and Intents

You now need to associate a `LanguageUnderstandingModel` with the intent recognizer and add the intents you want recognized.
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java?range=33-36)]

## Recognize an intent

From the `IntentRecognizer` object, you're going to call the `recognizeOnceAsync()` method. This method lets the Speech service know that you're sending a single phrase for recognition, and that once the phrase is identified to stop recognizing speech.

[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java?range=41)]

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, you'll want to do something with it. We're going to keep it simple and print the result to console.

Below your call to `recognizeOnceAsync()`, add this code:
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java?range=44-65)]

## Release Resources

It's important to release the speech resources when you're done using them. Insert this code at the end of the try / catch block:
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java?range=67-68)]

## Check your code

At this point, your code should look like this:  
(We've added some comments to this version)
[!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java?range=6-76)]

## Build and run your app

Press F11, or select **Run** > **Debug**.
The next 15 seconds of speech input from your microphone will be recognized and logged in the console window.

## Next steps

[!INCLUDE [footer](./footer.md)]