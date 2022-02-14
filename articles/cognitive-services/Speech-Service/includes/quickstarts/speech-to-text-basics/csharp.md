---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
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

## Recognize speech from a microphone

Follow these steps to create a new console application and install the Speech SDK.

1. Open a command prompt where you want the new project, and create a console application with the .NET CLI.
    ```console
    dotnet new console
    ```
1. Install the Speech SDK in your new project with the .NET CLI.
    ```console
    dotnet add package Microsoft.CognitiveServices.Speech
    ```
1. Replace the contents of `Program.cs` with the following code. 
    
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
                        Console.WriteLine($"CANCELED: Double check the speech resource key and region.");
                    }
                    break;
            }
        }

        async static Task RecognizeFromMicrophone(SpeechConfig speechConfig)
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
            await RecognizeFromMicrophone(speechConfig);
        }
    }
    ```

1. In `Program.cs`, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.

Run your new console application to start speech recognition from a microphone:

```console
dotnet run
```

Speak into your microphone when prompted. What you speak should be output as text: 

```console
Speak into your microphone.
RECOGNIZED: Text=I'm excited to try speech to text.
RECOGNIZED: Text=I'm excited to try speech to text.
```

This example uses the `RecognizeOnceAsync` operation to transcribe utterances of up to 30 seconds, or until silence is detected. For information about continuous recognition for longer audio, including multi-lingual conversations, see [How to recognize speech](~/articles/cognitive-services/speech-service/how-to-recognize-speech.md).

> [!div class="nextstepaction"]
> [My speech was recognized](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-csharp)
> [I ran into an issue](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-csharp)

## Try out more

Now that you've transcribed speech to text, here are some suggested modifications to try out:
- To recognize speech from an audio file, use `FromWavFileInput` instead of `FromDefaultMicrophoneInput`:
    ```csharp
    using var audioConfig = AudioConfig.FromWavFileInput("YourAudioFile.wav");
    ```
- To improve recognition accuracy of specific words or utterances, use a [phrase list](~/articles/cognitive-services/speech-service/improve-accuracy-phrase-list.md). You can add these lines right after the new `SpeechRecognizer` object is created:
    ```csharp
    var phraseList = PhraseListGrammar.FromRecognizer(speechRecognizer);
    phraseList.AddPhrase("Contoso");
    phraseList.AddPhrase("Jessie");
    phraseList.AddPhrase("Rehaan");
    ```
- To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-us` if you don't specify a language.
    ```csharp
    speechConfig.SpeechRecognitionLanguage = "es-ES";
    ```
- For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/supported-languages.md). 


## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

