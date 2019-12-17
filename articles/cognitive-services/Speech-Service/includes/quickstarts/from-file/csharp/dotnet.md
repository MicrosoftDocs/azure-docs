---
title: "Quickstart: Recognize speech from an audio file, C# (.NET) - Speech service"
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

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=dotnet)
> * [Create an empty sample project](../../../../quickstarts/create-project.md?tabs=dotnet)

[!INCLUDE [Audio input format](~/articles/cognitive-services/speech-service/includes/audio-input-format-chart.md)]

## Open your project in Visual Studio

The first step is to make sure that you have your project open in Visual Studio.

1. Launch Visual Studio 2019.
2. Load your project and open `Program.cs`.

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project. Make note that you've created an async method called `RecognizeSpeechAsync()`.

````C#

using System;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;

namespace helloworld
{
    class Program
    {
        public static async Task RecognizeSpeechAsync()
        {
        }

        static void Main()
        {
            RecognizeSpeechAsync().Wait();
        }
    }
}

````

## Create a Speech configuration

Before you can initialize a `SpeechRecognizer` object, you need to create a configuration that uses your subscription key and subscription region. Insert this code in the `RecognizeSpeechAsync()` method.

> [!NOTE]
> This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig?view=azure-dotnet).
> The Speech SDK will default to recognizing using en-us for the language, see [Specify source language for speech to text](../../../../how-to-specify-source-language.md) for information on choosing the source language.

````C#
var config = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
````

## Create an Audio configuration

Now, you need to create an ````AudioConfig```` object that points to your audio file. This object is created inside of a using statement to ensure the proper release of unmanaged resources. Insert this code in the `RecognizeSpeechAsync()` method, right below your Speech configuration.

````C#
using (var audioInput = AudioConfig.FromWavFileInput(@"whatstheweatherlike.wav"))
{
}
````

## Initialize a SpeechRecognizer

Now, let's create the `SpeechRecognizer` object using the `SpeechConfig` and `AudioConfig` objects created earlier. This object is also created inside of a using statement to ensure the proper release of unmanaged resources. Insert this code in the `RecognizeSpeechAsync()` method, inside the using statement that wraps your ````AudioConfig```` object.

````C#
using (var recognizer = new SpeechRecognizer(config, audioInput))
{
}
````

## Recognize a phrase

From the `SpeechRecognizer` object, you're going to call the `RecognizeOnceAsync()` method. This method lets the Speech service know that you're sending a single phrase for recognition, and that once the phrase is identified to stop recognizing speech.

Inside the using statement, add this code:
````C#
Console.WriteLine("Recognizing first result...");
var result = await recognizer.RecognizeOnceAsync();
````

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, you'll want to do something with it. We're going to keep it simple and print the result to console.

Inside the using statement, below `RecognizeOnceAsync()`, add this code:
````C#
if (result.Reason == ResultReason.RecognizedSpeech)
{
    Console.WriteLine($"We recognized: {result.Text}");
}
else if (result.Reason == ResultReason.NoMatch)
{
    Console.WriteLine($"NOMATCH: Speech could not be recognized.");
}
else if (result.Reason == ResultReason.Canceled)
{
    var cancellation = CancellationDetails.FromResult(result);
    Console.WriteLine($"CANCELED: Reason={cancellation.Reason}");

    if (cancellation.Reason == CancellationReason.Error)
    {
        Console.WriteLine($"CANCELED: ErrorCode={cancellation.ErrorCode}");
        Console.WriteLine($"CANCELED: ErrorDetails={cancellation.ErrorDetails}");
        Console.WriteLine($"CANCELED: Did you update the subscription info?");
    }
}
````

## Check your code

At this point, your code should look like this:

````C#
//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.md file in the project root for full license information.
//

using System;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;

namespace helloworld
{
    class Program
    {
        public static async Task RecognizeSpeechAsync()
        {
            var config = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

            using (var audioInput = AudioConfig.FromWavFileInput(@"whatstheweatherlike.wav"))
            {
                using (var recognizer = new SpeechRecognizer(config, audioInput))
                {
                    Console.WriteLine("Recognizing first result...");
                    var result = await recognizer.RecognizeOnceAsync();

                    if (result.Reason == ResultReason.RecognizedSpeech)
                    {
                        Console.WriteLine($"We recognized: {result.Text}");
                    }
                    else if (result.Reason == ResultReason.NoMatch)
                    {
                        Console.WriteLine($"NOMATCH: Speech could not be recognized.");
                    }
                    else if (result.Reason == ResultReason.Canceled)
                    {
                        var cancellation = CancellationDetails.FromResult(result);
                        Console.WriteLine($"CANCELED: Reason={cancellation.Reason}");

                        if (cancellation.Reason == CancellationReason.Error)
                        {
                            Console.WriteLine($"CANCELED: ErrorCode={cancellation.ErrorCode}");
                            Console.WriteLine($"CANCELED: ErrorDetails={cancellation.ErrorDetails}");
                            Console.WriteLine($"CANCELED: Did you update the subscription info?");
                        }
                    }
                }
            }
        }

        static void Main()
        {
            RecognizeSpeechAsync().Wait();
        }
    }
}
````

## Build and run your app

Now you're ready to build your app and test our speech recognition using the Speech service.

1. **Compile the code** - From the menu bar of Visual Studio, choose **Build** > **Build Solution**.
2. **Start your app** - From the menu bar, choose **Debug** > **Start Debugging** or press **F5**.
3. **Start recognition** - Your audio file is sent to the Speech service, transcribed as text, and rendered in the console.

   ```text
   Recognizing first result...
   We recognized: What's the weather like?
   ```

## Next steps

[!INCLUDE [footer](./footer.md)]
