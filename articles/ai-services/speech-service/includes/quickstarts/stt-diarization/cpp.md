---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 01/30/2024
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

## Implement diarization from file with conversation transcription

Follow these steps to create a console application and install the Speech SDK.

1. Create a new C++ console project in [Visual Studio Community 2022](https://visualstudio.microsoft.com/downloads/) named `ConversationTranscription`.

1. Select **Tools** > **Nuget Package Manager** > **Package Manager Console**. In the **Package Manager Console**, run this command:

    ```console
    Install-Package Microsoft.CognitiveServices.Speech
    ```

1. Replace the contents of `ConversationTranscription.cpp` with the following code.

    ```cpp
    #include <iostream> 
    #include <stdlib.h>
    #include <speechapi_cxx.h>
    #include <future>

    using namespace Microsoft::CognitiveServices::Speech;
    using namespace Microsoft::CognitiveServices::Speech::Audio;
    using namespace Microsoft::CognitiveServices::Speech::Transcription;

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
        conversationTranscriber->Transcribing.Connect([](const ConversationTranscriptionEventArgs& e)
            {
                std::cout << "TRANSCRIBING:" << e.Result->Text << std::endl;
            });

        conversationTranscriber->Transcribed.Connect([](const ConversationTranscriptionEventArgs& e)
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

        conversationTranscriber->Canceled.Connect([&recognitionEnd](const ConversationTranscriptionCanceledEventArgs& e)
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

1. Get the [sample audio file](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/sampledata/audiofiles/katiesteve.wav) or use your own `.wav` file. Replace `katiesteve.wav` with the path and name of your `.wav` file.

   The application recognizes speech from multiple participants in the conversation. Your audio file should contain multiple speakers.

1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/language-identification.md).

1. [Build and run](/cpp/build/vscpp-step-2-build) your application to start conversation transcription:

   > [!IMPORTANT]
   > Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` [environment variables](#set-environment-variables). If you don't set these variables, the sample fails with an error message.

The transcribed conversation should be output as text:

```output
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

