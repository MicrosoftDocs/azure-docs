---
title: "Quickstart: Recognize speech, intents, and entities, C++ - Speech service"
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 01/02/2020
ms.author: erhopf
zone_pivot_groups: programming-languages-set-two
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
>
> * If this is your first C++ project, use this guide to [create an empty sample project](../../../../quickstarts/create-project.md?tabs=windows)
> * [Install the Speech SDK for your development environment](../../../../quickstarts/setup-platform.md?tabs=windows)

## Create a LUIS app for intent recognition

[!INCLUDE [Header](../luis-sign-up.md)]

## Open your project in Visual Studio

The first step is to make sure that you have your project open in Visual Studio.

1. Launch Visual Studio 2019.
2. Load your project and open `helloworld.cpp`.

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project. Make note that you've created an async method called `recognizeIntent()`.
[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/intent-recognition/helloworld/helloworld.cpp?range=6-16,73-81)]

## Create a Speech configuration

Before you can initialize an `IntentRecognizer` object, you need to create a configuration that uses your LUIS Endpoint key and region. Insert this code in the `recognizeIntent()` method.

This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](https://docs.microsoft.com/cpp/cognitive-services/speech/speechconfig).
The Speech SDK will default to recognizing using en-us for the language, see [Specify source language for speech to text](../../../../how-to-specify-source-language.md) for information on choosing the source language.

> [!NOTE]
> It is important to use the LUIS Endpoint key and not the Starter or Authoring keys as only the Endpoint key is valid for speech to intent recognition. See [Create a LUIS application and get an endpoint key](~/articles/cognitive-services/Speech-Service/quickstarts/create-luis.md) for instructions on how to get the correct key.

[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/intent-recognition/helloworld/helloworld.cpp?range=25)]

## Initialize an IntentRecognizer

Now, let's create an `IntentRecognizer`. Insert this code in the `recognizeIntent()` method, right below your Speech configuration.
[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/intent-recognition/helloworld/helloworld.cpp?range=28)]

## Add a LanguageUnderstandingModel and Intents

You now need to associate a `LanguageUnderstandingModel` with the intent recognizer and add the intents you want recognized.
[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/intent-recognition/helloworld/helloworld.cpp?range=31-34)]

## Recognize an intent

From the `IntentRecognizer` object, you're going to call the `RecognizeOnceAsync()` method. This method lets the Speech service know that you're sending a single phrase for recognition, and that once the phrase is identified to stop recognizing speech.
For simplicity we'll wait on the future returned to complete.

Inside the using statement, add this code:
[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/intent-recognition/helloworld/helloworld.cpp?range=44)]

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, you'll want to do something with it. We're going to keep it simple and print the result to console.

Inside the using statement, below `RecognizeOnceAsync()`, add this code:
[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/intent-recognition/helloworld/helloworld.cpp?range=47-72)]

## Check your code

At this point, your code should look like this:  
(We've added some comments to this version)
[!code-cpp[](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/intent-recognition/helloworld/helloworld.cpp?range=6-81)]

## Build and run your app

Now you're ready to build your app and test our speech recognition using the Speech service.

1. **Compile the code** - From the menu bar of Visual Studio, choose **Build** > **Build Solution**.
2. **Start your app** - From the menu bar, choose **Debug** > **Start Debugging** or press **F5**.
3. **Start recognition** - It'll prompt you to speak a phrase in English. Your speech is sent to the Speech service, transcribed as text, and rendered in the console.

## Next steps

[!INCLUDE [footer](./footer.md)]