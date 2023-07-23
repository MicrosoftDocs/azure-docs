---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment
The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK later in this guide, but first check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-cpp) for any more requirements.

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Diarization from file with conversation transcription

Follow these steps to create a new console application and install the Speech SDK.

1. Create a new C++ console project in Visual Studio Community 2022 named `ConversationTranscription`.
1. Install the Speech SDK in your new project with the NuGet package manager.
    ```powershell
    Install-Package Microsoft.CognitiveServices.Speech
    ```
1. Replace the contents of `ConversationTranscription.cpp` with the following code:
    
    ```cpp
    #include <iostream> 
    #include <stdlib.h>
    #include <speechapi_cxx.h>
    #include <future>

    using namespace Microsoft::CognitiveServices::Speech;
    using namespace Microsoft::CognitiveServices::Speech::Audio;

    std::string GetEnvironmentVariable(const char* name);

    int main()
    {
        // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
        auto speechKey = GetEnvironmentVariable("SPEECH_KEY");
        auto speechRegion = GetEnvironmentVariable("SPEECH_REGION");

        if ((size(speechKey) == 0) || (size(speechRegion) == 0)) {
            std::cout << "Please set both SPEECH_KEY and SPEECH_REGION environment variables." << std::endl;
            return -1;
        }

        auto speechConfig = SpeechConfig::FromSubscription(speechKey, speechRegion);

        speechConfig->SetSpeechRecognitionLanguage("en-US");

        auto audioConfig = AudioConfig::FromWavFileInput("katiesteve.wav");
        auto conversationTranscriber = ConversationTranscriber::FromConfig(speechConfig, audioConfig);

        // promise for synchronization of recognition end.
        std::promise<void> recognitionEnd;

        // Subscribes to events.
        conversationTranscriber->Transcribing.Connect([](const SpeechRecognitionEventArgs& e)
            {
                std::cout << "TRANSCRIBING:" << e.Result->Text << std::endl;
            });

        conversationTranscriber->Transcribed.Connect([](const SpeechRecognitionEventArgs& e)
            {
                if (e.Result->Reason == ResultReason::RecognizedSpeech)
                {
                    std::cout << "TRANSCRIBED: Text=" << e.Result->Text << std::endl;
                    std::cout << "Speaker ID=" << e.Result->SpeakerId << std::endl;
                }
                else if (e.Result->Reason == ResultReason::NoMatch)
                {
                    std::cout << "NOMATCH: Speech could not be transcribed." << std::endl;
                }
            });

        conversationTranscriber->Canceled.Connect([&recognitionEnd](const SpeechRecognitionCanceledEventArgs& e)
            {
                auto cancellation = CancellationDetails::FromResult(e.Result);
                std::cout << "CANCELED: Reason=" << (int)cancellation->Reason << std::endl;

                if (cancellation->Reason == CancellationReason::Error)
                {
                    std::cout << "CANCELED: ErrorCode=" << (int)cancellation->ErrorCode << std::endl;
                    std::cout << "CANCELED: ErrorDetails=" << cancellation->ErrorDetails << std::endl;
                    std::cout << "CANCELED: Did you set the speech resource key and region values?" << std::endl;
                }
                else if (cancellation->Reason == CancellationReason::EndOfStream)
                {
                    std::cout << "CANCELED: Reach the end of the file." << std::endl;
                }
            });

        conversationTranscriber->SessionStopped.Connect([&recognitionEnd](const SessionEventArgs& e)
            {
                std::cout << "Session stopped.";
                recognitionEnd.set_value(); // Notify to stop recognition.
            });

        conversationTranscriber->StartTranscribingAsync().wait();

        // Waits for recognition end.
        recognitionEnd.get_future().wait();

        conversationTranscriber->StopTranscribingAsync().wait();
    }

    std::string GetEnvironmentVariable(const char* name)
    {
    #if defined(_MSC_VER)
        size_t requiredSize = 0;
        (void)getenv_s(&requiredSize, nullptr, 0, name);
        if (requiredSize == 0)
        {
            return "";
        }
        auto buffer = std::make_unique<char[]>(requiredSize);
        (void)getenv_s(&requiredSize, buffer.get(), requiredSize, name);
        return buffer.get();
    #else
        auto value = getenv(name);
        return value ? value : "";
    #endif
    }
    ```

1. Replace `katiesteve.wav` with the filepath and filename of your `.wav` file. The intent of this quickstart is to recognize speech from multiple participants in the conversation. Your audio file should contain multiple speakers. For example, you can use the [sample audio file](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/csharp/dotnet/conversation-transcription/helloworld/katiesteve.wav) provided in the Speech SDK samples repository on GitHub.
1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/language-identification.md). 


[Build and run](/cpp/build/vscpp-step-2-build) your application to start speech recognition:

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

