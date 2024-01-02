---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 7/27/2023
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
    using Microsoft.CognitiveServices.Speech.Transcription;
    
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

1. Replace `katiesteve.wav` with the filepath and filename of your `.wav` file. The intent of this quickstart is to recognize speech from multiple participants in the conversation. Your audio file should contain multiple speakers. For example, you can use the [sample audio file](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/sampledata/audiofiles/katiesteve.wav) provided in the Speech SDK samples repository on GitHub.
    > [!NOTE]
    > The service performs best with at least 7 seconds of continuous audio from a single speaker. This allows the system to differentiate the speakers properly. Otherwise the Speaker ID is returned as `Unknown`.
1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/language-identification.md). 

Run your new console application to start conversation transcription:

```console
dotnet run
```

> [!IMPORTANT]
> Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described [above](#set-environment-variables). If you don't set these variables, the sample will fail with an error message.

The transcribed conversation should be output as text: 

```console
TRANSCRIBED: Text=Good morning, Steve. Speaker ID=Unknown
TRANSCRIBED: Text=Good morning. Katie. Speaker ID=Unknown
TRANSCRIBED: Text=Have you tried the latest real time diarization in Microsoft Speech Service which can tell you who said what in real time? Speaker ID=Guest-1
TRANSCRIBED: Text=Not yet. I've been using the batch transcription with diarization functionality, but it produces diarization result until whole audio get processed. Speaker ID=Guest-2
TRANSRIBED: Text=Is the new feature can diarize in real time? Speaker ID=Guest-2
TRANSCRIBED: Text=Absolutely. Speaker ID=GUEST-1
TRANSCRIBED: Text=That's exciting. Let me try it right now. Speaker ID=GUEST-2
CANCELED: Reason=EndOfStream
```

Speakers are identified as Guest-1, Guest-2, and so on, depending on the number of speakers in the conversation.

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

