---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 05/08/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment
The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK later in this guide, but first check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-csharp) for any more requirements.

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Diarization from file with conversation transcription

Follow these steps to create a new console application and install the Speech SDK.

1. Open a command prompt where you want the new project, and create a console application with the .NET CLI. The `Program.cs` file should be created in the project directory.
    ```dotnetcli
    dotnet new console
    ```
1. Install the Speech SDK in your new project with the .NET CLI.
    ```dotnetcli
    dotnet add package Microsoft.CognitiveServices.Speech
    ```
1. Replace the contents of `Program.cs` with the following code. 

    ```csharp
    using Microsoft.CognitiveServices.Speech;
    using Microsoft.CognitiveServices.Speech.Audio;
    
    class Program 
    {
        // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
        static string speechKey = Environment.GetEnvironmentVariable("SPEECH_KEY");
        static string speechRegion = Environment.GetEnvironmentVariable("SPEECH_REGION");
    
        async static Task Main(string[] args)
        {
            var filepath = "katiesteve.wav";
            var speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion);        
            speechConfig.SpeechRecognitionLanguage = "en-US";
    
            var stopRecognition = new TaskCompletionSource<int>(TaskCreationOptions.RunContinuationsAsynchronously);
    
            // Create an audio stream from a wav file or from the default microphone
            using (var audioConfig = AudioConfig.FromWavFileInput(filepath))
            {
                // Create a conversation transcriber using audio stream input
                using (var conversationTranscriber = new ConversationTranscriber(speechConfig, audioConfig))
                {
                    conversationTranscriber.Transcribing += (s, e) =>
                    {
                        Console.WriteLine($"TRANSCRIBING: Text={e.Result.Text}");
                    };
    
                    conversationTranscriber.Transcribed += (s, e) =>
                    {
                        if (e.Result.Reason == ResultReason.RecognizedSpeech)
                        {
                            Console.WriteLine($"TRANSCRIBED: Text={e.Result.Text} Speaker ID={e.Result.SpeakerId}");
                        }
                        else if (e.Result.Reason == ResultReason.NoMatch)
                        {
                            Console.WriteLine($"NOMATCH: Speech could not be transcribed.");
                        }
                    };
    
                    conversationTranscriber.Canceled += (s, e) =>
                    {
                        Console.WriteLine($"CANCELED: Reason={e.Reason}");
    
                        if (e.Reason == CancellationReason.Error)
                        {
                            Console.WriteLine($"CANCELED: ErrorCode={e.ErrorCode}");
                            Console.WriteLine($"CANCELED: ErrorDetails={e.ErrorDetails}");
                            Console.WriteLine($"CANCELED: Did you set the speech resource key and region values?");
                            stopRecognition.TrySetResult(0);
                        }
    
                        stopRecognition.TrySetResult(0);
                    };
    
                    conversationTranscriber.SessionStopped += (s, e) =>
                    {
                        Console.WriteLine("\n    Session stopped event.");
                        stopRecognition.TrySetResult(0);
                    };
    
                    await conversationTranscriber.StartTranscribingAsync();
    
                    // Waits for completion. Use Task.WaitAny to keep the task rooted.
                    Task.WaitAny(new[] { stopRecognition.Task });
    
                    await conversationTranscriber.StopTranscribingAsync();
                }
            }
        }
    }
    ```

1. Replace `katiesteve.wav` with the filepath and filename of your `.wav` file. The intent of this quickstart is to recognize speech from multiple participants in the conversation. Your audio file should contain multiple speakers. For example, you can use the [sample audio file](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/csharp/dotnet/conversation-transcription/helloworld/katiesteve.wav) provided in the Speech SDK samples repository on GitHub.
1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/language-identification.md). 

Run your new console application to start speech recognition:

```console
dotnet run
```

> [!IMPORTANT]
> Make sure that you set the `SPEECH__KEY` and `SPEECH__REGION` environment variables as described [above](#set-environment-variables). If you don't set these variables, the sample will fail with an error message.

The transcribed conversation should be output as text: 

```console
RECOGNIZING: Text=good morning
RECOGNIZING: Text=good morning steve
RECOGNIZED: Text=Good morning, Steve.
RECOGNIZING: Text=good morning
RECOGNIZING: Text=good morning katie
RECOGNIZING: Text=good morning katie have you heard
RECOGNIZING: Text=good morning katie have you heard about
RECOGNIZING: Text=good morning katie have you heard about the new
RECOGNIZING: Text=good morning katie have you heard about the new conversation
RECOGNIZING: Text=good morning katie have you heard about the new conversation transcription
RECOGNIZING: Text=good morning katie have you heard about the new conversation transcription capability
RECOGNIZED: Text=Good morning. Katie, have you heard about the new conversation transcription capability?
RECOGNIZING: Text=no
RECOGNIZING: Text=no tell me more
RECOGNIZING: Text=no tell me more it's the new
RECOGNIZING: Text=no tell me more it's the new feature
RECOGNIZING: Text=no tell me more it's the new feature that
RECOGNIZING: Text=no tell me more it's the new feature that transcribes our
RECOGNIZING: Text=no tell me more it's the new feature that transcribes our discussion
RECOGNIZING: Text=no tell me more it's the new feature that transcribes our discussion and lets
RECOGNIZING: Text=no tell me more it's the new feature that transcribes our discussion and lets us
RECOGNIZING: Text=no tell me more it's the new feature that transcribes our discussion and lets us know
RECOGNIZING: Text=no tell me more it's the new feature that transcribes our discussion and lets us know who
RECOGNIZING: Text=no tell me more it's the new feature that transcribes our discussion and lets us know who said what
RECOGNIZED: Text=No, tell me more. It's the new feature that transcribes our discussion and lets us know who said what.
RECOGNIZING: Text=that
RECOGNIZING: Text=that sounds interesting
RECOGNIZING: Text=that sounds interesting i'm
RECOGNIZING: Text=that sounds interesting i'm going to give this a try
RECOGNIZED: Text=That sounds interesting. I'm going to give this a try.
CANCELED: Reason=EndOfStream
```

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

