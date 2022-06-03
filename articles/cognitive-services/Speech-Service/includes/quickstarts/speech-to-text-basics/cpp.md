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

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CPP&Pillar=Speech&Product=speech-to-text&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Set up the environment
The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK in the next section of this article, but first check the [platform-specific installation instructions](../../../quickstarts/setup-platform.md?pivots=programming-language-cpp) for any more requirements.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CPP&Pillar=Speech&Product=speech-to-text&Page=quickstart&SectionSet-up-the-environment" target="_target">I ran into an issue</a>

## Recognize speech from a microphone

Follow these steps to create a new console application and install the Speech SDK.

1. Create a new C++ console project in Visual Studio.
1. Install the Speech SDK in your new project with the NuGet package manager.
    ```powershell
    Install-Package Microsoft.CognitiveServices.Speech
    ```
1. Replace the contents of `main.cpp` with the following code:
    
    ```cpp
    #include <iostream> 
    #include <speechapi_cxx.h>

    using namespace Microsoft::CognitiveServices::Speech;
    using namespace Microsoft::CognitiveServices::Speech::Audio;

    auto YourSubscriptionKey = "YourSubscriptionKey";
    auto YourServiceRegion = "YourServiceRegion";

    int main()
    {
        auto speechConfig = SpeechConfig::FromSubscription(YourSubscriptionKey, YourServiceRegion);
        speechConfig->SetSpeechRecognitionLanguage("en-US");

        // To recognize speech from an audio file, use `FromWavFileInput` instead of `FromDefaultMicrophoneInput`:
        // auto audioInput = AudioConfig::FromWavFileInput("YourAudioFile.wav");
        auto audioConfig = AudioConfig::FromDefaultMicrophoneInput();
        auto recognizer = SpeechRecognizer::FromConfig(speechConfig, audioConfig);

        std::cout << "Speak into your microphone.\n";
        auto result = recognizer->RecognizeOnceAsync().get();

        if (result->Reason == ResultReason::RecognizedSpeech)
        {
            std::cout << "RECOGNIZED: Text=" << result->Text << std::endl;
        }
        else if (result->Reason == ResultReason::NoMatch)
        {
            std::cout << "NOMATCH: Speech could not be recognized." << std::endl;
        }
        else if (result->Reason == ResultReason::Canceled)
        {
            auto cancellation = CancellationDetails::FromResult(result);
            std::cout << "CANCELED: Reason=" << (int)cancellation->Reason << std::endl;

            if (cancellation->Reason == CancellationReason::Error)
            {
                std::cout << "CANCELED: ErrorCode=" << (int)cancellation->ErrorCode << std::endl;
                std::cout << "CANCELED: ErrorDetails=" << cancellation->ErrorDetails << std::endl;
                std::cout << "CANCELED: Did you set the speech resource key and region values?" << std::endl;
            }
        }
    }
    ```

1. In `main.cpp`, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region. 
1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-us` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/supported-languages.md). 

Build and run your new console application to start speech recognition from a microphone.

Speak into your microphone when prompted. What you speak should be output as text: 

```console
Speak into your microphone.
RECOGNIZED: Text=I'm excited to try speech to text.
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CPP&Pillar=Speech&Product=speech-to-text&Page=quickstart&Section=Recognize-speech-from-a-microphone" target="_target">I ran into an issue</a>

Here are some additional considerations:

- This example uses the `RecognizeOnceAsync` operation to transcribe utterances of up to 30 seconds, or until silence is detected. For information about continuous recognition for longer audio, including multi-lingual conversations, see [How to recognize speech](~/articles/cognitive-services/speech-service/how-to-recognize-speech.md).
- To recognize speech from an audio file, use `FromWavFileInput` instead of `FromDefaultMicrophoneInput`:
    ```cpp
    auto audioInput = AudioConfig::FromWavFileInput("YourAudioFile.wav");
    ```
- For compressed audio files such as MP4, install GStreamer and use `PullAudioInputStream` or `PushAudioInputStream`. For more information, see [How to use compressed input audio](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md).

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

