---
title: "Quickstart: Recognize speech from a microphone, C# (.NET) - Speech service"
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 12/17/2019
ms.author: erhopf
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=dotnet)
> * [Create an empty sample project](../../../../quickstarts/create-project.md?tabs=dotnet)
> * Make sure that you have access to a microphone for audio capture

## Open your project in Visual Studio

The first step is to make sure that you have your project open in Visual Studio.

1. Launch Visual Studio 2019.
2. Load your project and open `Program.cs`.

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project. Make note that you've created an async method called `RecognizeSpeechAsync()`.
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-microphone/helloworld/Program.cs?range=5-15,43-52)]

## Create a Speech configuration

Before you can initialize a `SpeechRecognizer` object, you need to create a configuration that uses your subscription key and subscription region. Insert this code in the `RecognizeSpeechAsync()` method.

> [!NOTE]
> This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig?view=azure-dotnet).
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-microphone/helloworld/Program.cs?range=16)]
> The Speech SDK will default to recognizing using en-us for the language, see [Specify source language for speech to text](../../../../how-to-specify-source-language.md) for information on choosing the source language.

## Initialize a SpeechRecognizer

Now, let's create a `SpeechRecognizer`. This object is created inside of a using statement to ensure the proper release of unmanaged resources. Insert this code in the `RecognizeSpeechAsync()` method, right below your Speech configuration.
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-microphone/helloworld/Program.cs?range=17-19,42)]

## Recognize a phrase

From the `SpeechRecognizer` object, you're going to call the `RecognizeOnceAsync()` method. This method lets the Speech service know that you're sending a single phrase for recognition, and that once the phrase is identified to stop recognizing speech.

Inside the using statement, add this code:
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-microphone/helloworld/Program.cs?range=20)]

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, you'll want to do something with it. We're going to keep it simple and print the result to console.

Inside the using statement, below `RecognizeOnceAsync()`, add this code:
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-microphone/helloworld/Program.cs?range=22-41)]

## Check your code

At this point, your code should look like this:
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/from-microphone/helloworld/Program.cs)]

## Build and run your app

Now you're ready to build your app and test our speech recognition using the Speech service.

1. **Compile the code** - From the menu bar of Visual Studio, choose **Build** > **Build Solution**.
2. **Start your app** - From the menu bar, choose **Debug** > **Start Debugging** or press **F5**.
3. **Start recognition** - It'll prompt you to speak a phrase in English. Your speech is sent to the Speech service, transcribed as text, and rendered in the console.

## Next steps

[!INCLUDE [footer](./footer.md)]
