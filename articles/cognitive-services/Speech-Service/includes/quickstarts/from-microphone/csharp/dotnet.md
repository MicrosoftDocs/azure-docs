---
title: "Quickstart: Recognize speech from a microphone, C# (.NET) - Speech service"
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/01/2020
ms.author: dapine
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=dotnet)
> * Make sure that you have access to a microphone for audio capture

## Open your project in Visual Studio

The first step is to make sure that you have your project open in Visual Studio.

1. Launch **Visual Studio 2019**.
2. Load your project and open *Program.cs*.

## Update source code

Replace the contents of the *Program.cs* file with the following C# code.

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;

namespace Speech.Recognition
{
    class Program
    {
        static async Task Main()
        {
            await RecognizeSpeechAsync();

            Console.WriteLine("Please press any key to continue...");
            Console.ReadLine();
        }

        static async Task RecognizeSpeechAsync()
        {
            var config =
                SpeechConfig.FromSubscription(
                    "YourSubscriptionKey",
                    "YourServiceRegion");

            using var recognizer = new SpeechRecognizer(config);
            
            var result = await recognizer.RecognizeOnceAsync();
            switch (result.Reason)
            {
                case ResultReason.RecognizedSpeech:
                    Console.WriteLine($"We recognized: {result.Text}");
                    break;
                case ResultReason.NoMatch:
                    Console.WriteLine($"NOMATCH: Speech could not be recognized.");
                    break;
                case ResultReason.Canceled:
                    var cancellation = CancellationDetails.FromResult(result);
                    Console.WriteLine($"CANCELED: Reason={cancellation.Reason}");
    
                    if (cancellation.Reason == CancellationReason.Error)
                    {
                        Console.WriteLine($"CANCELED: ErrorCode={cancellation.ErrorCode}");
                        Console.WriteLine($"CANCELED: ErrorDetails={cancellation.ErrorDetails}");
                        Console.WriteLine($"CANCELED: Did you update the subscription info?");
                    }
                    break;
            }
        }
    }
}
```

Replace the `YourSubscriptionKey` and `YourServiceRegion` values with actual values from your Speech resource.

- Navigate to the <a href="https://portal.azure.com/" target="_blank">Azure portal <span class="docon docon-navigate-external x-hidden-focus"></span></a>, and open the Speech resource
- Under the **Keys** blade, there are two available subscription keys
    - Use either one as the `YourSubscriptionKey` value replacement
- Under the **Overview** blade, note the region and map it to the <a href="https://aka.ms/speech/sdkregion" target="_blank">region identifier <span class="docon docon-navigate-external x-hidden-focus"></span></a>
    - Use the **Region identifier** as the `YourServiceRegion` value replacement, i.e.; `"westus"` for **West US**

## Code explanation

The `Main` entry point of the application, is `Task` returning which enables the `async` and `await` keywords. The `RecognizeSpeechAsync` function starts by instantiating a <a href="https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig?view=azure-dotnet" target="_blank">`SpeechConfig` <span class="docon docon-navigate-external x-hidden-focus"></span></a> object from the Speech resource subscription key and region. Using the `config` instance, a <a href="https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechrecognizer?view=azure-dotnet" target="_blank">`SpeechRecognizer` <span class="docon docon-navigate-external x-hidden-focus"></span></a> object is created.

The `recognizer` instance exposes multiple ways to recognize speech. In this example, the `RecognizeOnceAsync()` method is demonstrated. This function lets the Speech service know that you're sending a single phrase for recognition, and that once the phrase is identified to stop recognizing speech. Once the `result` is yielded, the code will write the recognition reason to the console.

> [!TIP]
> The Speech SDK will default to recognizing using `en-us` for the language, see [Specify source language for speech to text](../../../../how-to-specify-source-language.md) for information on choosing the source language.

## Build and run your app

Now you're ready to rebuild your app and test the speech recognition functionality using the Speech service.

1. **Compile the code** - From the menu bar of Visual Studio, choose **Build** > **Build Solution**.
2. **Start your app** - From the menu bar, choose **Debug** > **Start Debugging** or press <kbd>F5</kbd>.
3. **Start recognition** - It'll prompt you to speak a phrase in English. Your speech is sent to the Speech service, transcribed as text, and rendered in the console.

## Next steps

[!INCLUDE [footer](./footer.md)]
