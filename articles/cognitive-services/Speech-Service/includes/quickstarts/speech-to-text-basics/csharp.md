---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/10/2022
ms.author: eur
ms.custom: devx-track-csharp
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. 

The .NET Speech SDK can be installed from the **.NET Core CLI** with the following `dotnet add` command:

```console
dotnet add package Microsoft.CognitiveServices.Speech
```

The .NET Speech SDK can be installed from the **Package Manager** with the following `Install-Package` command:

```powershell
Install-Package Microsoft.CognitiveServices.Speech
```

For platform-specific installation instructions, see the [Speech SDK setup guide](/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-csharp).

## Create a new project

1. Go to the directory where you want to create the new project.
1. Create a new console application
    ```console
    dotnet new console
    ```
1. Install the Speech SDK
    ```console
    dotnet new console
    ```
1. Replace the contents of Program.cs with the following:
    
    ```csharp
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.CognitiveServices.Speech;
    using Microsoft.CognitiveServices.Speech.Audio;
    
    class Program 
    {
        async static Task FromMicrophone(SpeechConfig speechConfig)
        {
            using var audioConfig = AudioConfig.FromDefaultMicrophoneInput();
            using var speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
    
            Console.WriteLine("Speak into your microphone.");
            var speechRecognitionResult = await speechRecognizer.RecognizeOnceAsync();
            Console.WriteLine($"RECOGNIZED: Text={speechRecognitionResult.Text}");
    
            switch (speechRecognitionResult.Reason)
            {
                case ResultReason.RecognizedSpeech:
                    Console.WriteLine($"RECOGNIZED: Text={speechRecognitionResult.Text}");
                    break;
                case ResultReason.NoMatch:
                    Console.WriteLine($"NOMATCH: Speech could not be recognized.");
                    break;
                case ResultReason.Canceled:
                    var cancellation = CancellationDetails.FromResult(speechRecognitionResult);
                    Console.WriteLine($"CANCELED: Reason={cancellation.Reason}");
            
                    if (cancellation.Reason == CancellationReason.Error)
                    {
                        Console.WriteLine($"CANCELED: ErrorCode={cancellation.ErrorCode}");
                        Console.WriteLine($"CANCELED: ErrorDetails={cancellation.ErrorDetails}");
                        Console.WriteLine($"CANCELED: Did you update the speech key and location/region info?");
                    }
                    break;
            }
        }
    
        async static Task Main(string[] args)
        {
            var speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");        
            speechConfig.SpeechRecognitionLanguage = "en-US";
            await FromMicrophone(speechConfig);
        }
    }
    ```

## Recognize speech from a microphone

Run the following command to run the application:

```console
dotnet run
```

Output should be:

```console
Speak into your microphone.
RECOGNIZED: Text=This is a test for the code sample.
RECOGNIZED: Text=This is a test for the code sample.
```

## Clean up resources

You can use the [Azure Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources) or [Azure Command Line Interface (CLI)](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources) to remove the Speech resource you created.

## Next steps

* [Language detection overview](overview.md)

