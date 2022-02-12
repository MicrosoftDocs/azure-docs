---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/11/2022
ms.author: eur
ms.custom: devx-track-csharp
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

> [!div class="nextstepaction"]
> [I have the prerequisites](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-csharp)
> [I ran into an issue](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-csharp)

## Set up the environment
The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK in the next section of this article, but first check the [platform-specific installation instructions](/azure/cognitive-services/speech-service/quickstarts/speech-sdk.md?pivots=programming-language-csharp#get-the-speech-sdk) for any more requirements.

> [!div class="nextstepaction"]
> [I have the tools I need](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-csharp)
> [I ran into an issue](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-csharp)

## Create a new project

Follow these steps to create a new console application and install the Speech SDK.

1. Open a command prompt and go to the directory where you want to create the new project.
1. Create a new console application with the .NET CLI.
    ```console
    dotnet new console
    ```
1. Install the Speech SDK in your new project with the .NET CLI.
    ```console
    dotnet add package Microsoft.CognitiveServices.Speech
    ```
1. Replace the contents of Program.cs with the following code:
    
    ```csharp
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.CognitiveServices.Speech;
    using Microsoft.CognitiveServices.Speech.Audio;
    
    class Program 
    {
        static var YourSubscriptionKey = "YourSubscriptionKey";
        static var YourServiceRegion = "YourServiceRegion";

        static void OutputSpeechRecognitionResult(SpeechRecognitionResult result)
        {
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

        async static Task FromMicrophone(SpeechConfig speechConfig)
        {
            using var audioConfig = AudioConfig.FromDefaultMicrophoneInput();
            using var speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
    
            Console.WriteLine("Speak into your microphone.");
            var speechRecognitionResult = await speechRecognizer.RecognizeOnceAsync();
            OutputSpeechRecognitionResult(speechRecognitionResult);
        }
    
        async static Task Main(string[] args)
        {
            var speechConfig = SpeechConfig.FromSubscription(YourSubscriptionKey, YourServiceRegion);        
            speechConfig.SpeechRecognitionLanguage = "en-US";
            await FromMicrophone(speechConfig);
        }
    }
    ```

1. In Program.cs, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.

> [!div class="nextstepaction"]
> [My project is ready to run](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-csharp)
> [I ran into an issue](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-csharp)

## Recognize speech from a microphone

Run the following command to start speech recognition from your microphone:

```console
dotnet run
```

Speak into your microphone when prompted. What you speak should be output as text: 

```console
Speak into your microphone.
RECOGNIZED: Text=I'm excited to use speech to text.
RECOGNIZED: Text=I'm excited to use speech to text.
```

This example uses the `RecognizeOnceAsync` operation to transcribe utterances of up to 30 seconds, or until silence is detected. For information about continuous recognition for longer audio, including multi-lingual conversations, see [How to recognize speech](~/articles/cognitive-services/speech-service/how-to-recognize-speech.md).

> [!div class="nextstepaction"]
> [My speech was recognized](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-csharp)
> [I ran into an issue](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-csharp)

Now that you have a speech to text application, here are some suggested modifications to try out:
- To recognize speech from a file, use `FromWavFileInput` instead of `FromDefaultMicrophoneInput`:
    ```csharp
    using var audioConfig = AudioConfig.FromWavFileInput("PathToFile.wav");
    ```
- To improve recognition accuracy of specific words or utterances, use a [phrase list](~/articles/cognitive-services/speech-service/improve-accuracy-phrase-list.md). You can add these lines right after the new `SpeechRecognizer` object is created:
    ```csharp
    var phraseList = PhraseListGrammar.FromRecognizer(recognizer);
    phraseList.AddPhrase("Contoso");
    phraseList.AddPhrase("Jessie");
    phraseList.AddPhrase("Rehaan");
    ```
- To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md).
    ```csharp
    speechConfig.SpeechRecognitionLanguage = "de-DE";
    ```
- For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/supported-languages.md). 


## Clean up resources

You can use the [Azure portal](~/articles/cognitive-services/cognitive-services-apis-create-account.md#clean-up-resources) or [Azure Command Line Interface (CLI)](~/articles/cognitive-services/cognitive-services-apis-create-account-cli.md#clean-up-resources) to remove the Speech resource you created.
