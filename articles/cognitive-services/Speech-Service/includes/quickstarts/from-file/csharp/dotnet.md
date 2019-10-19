---
title: "Quickstart: Recognize speech from an audio file - Speech Service"
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
---

## Prerequisites

Before you get started, make sure to:

1. [Create a Speech resource and get a subscription key]().
2. [Setup your development environment](~/articles/cognitive-services/Speech-Service/quickstart-platform-csharp-dotnet-windows.md). Use this quickstart to install and configure Visual Studio 2019.

If you've already done this, great. Let's keep going.

## Open your project in Visual Studio

The first step is to make sure that you have your project open in Visual Studio.

1. Launch Visual Studio 2019.
2. Load your project and open `Program.cs`.

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project. Make note that you've created an async method called `RecognizeSpeechAsync()`.

````C#

// TODO INSERT C# CODE HERE... Copy from "from-microphone", and paste directly here, adding AudioConfig/file name portion

````

## Create a Speech configuration

Before you can initialize a `SpeechRecognizer` object, you need to create a configuration that uses your subscription key and subscription region. Insert this code in the `RecognizeSpeechAsync()` method.

> [!NOTE]
> This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig?view=azure-dotnet).
````C#

// TODO INSERT C# CODE HERE... Copy from "from-microphone", and paste directly here, adding AudioConfig/file name portion

````

## Initialize a SpeechRecognizer

Now, let's create a `SpeechRecognizer`. This object is created inside of a using statement to ensure the proper release of unmanaged resources. Insert this code in the `RecognizeSpeechAsync()` method, right below your Speech configuration.
````C#

// TODO INSERT C# CODE HERE... Copy from "from-microphone", and paste directly here, adding AudioConfig/file name portion

````

## Recognize a phrase

From the `SpeechRecognizer` object, you're going to call the `RecognizeOnceAsync()` method. This method lets the Speech service know that you're sending a single phrase for recognition, and that once the phrase is identified to stop reconizing speech.

Inside the using statement, add this code:
````C#

// TODO INSERT C# CODE HERE... Copy from "from-microphone", and paste directly here, adding AudioConfig/file name portion

````

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, you'll want to do something with it. We're going to keep it simple and print the result to console.

Inside the using statement, below `RecognizeOnceAsync()`, add this code:
````C#

// TODO INSERT C# CODE HERE... Copy from "from-microphone", and paste directly here, adding AudioConfig/file name portion

````

## Check your code

At this point, your code should look like this:
````C#

// TODO INSERT C# CODE HERE... Copy from "from-microphone", and paste directly here, adding AudioConfig/file name portion

````

## Build and run your app

Now you're ready to build your app and test our speech recognition using the Speech service.

1. **Compile the code** - From the menu bar of Visual Stuio, choose **Build** > **Build Solution**.
2. **Start your app** - From the menu bar, choose **Debug** > **Start Debugging** or press **F5**.
3. **Start recognition** - It'll prompt you to speak a phrase in English. Your speech is sent to the Speech service, transcribed as text, and rendered in the console.

## Next steps

* How-tos
* Samples
* Reference
