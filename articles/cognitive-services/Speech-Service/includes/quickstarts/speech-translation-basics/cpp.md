---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 06/08/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment
The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK later in this guide, but first check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-cpp) for any more requirements

## Translate speech from a microphone

Follow these steps to create a new console application and install the Speech SDK.

1. Create a new C++ console project in Visual Studio named `SpeechTranslation`.
1. Install the Speech SDK in your new project with the NuGet package manager.
    ```powershell
    Install-Package Microsoft.CognitiveServices.Speech
    ```
1. Replace the contents of `SpeechTranslation.cpp` with the following code:
    
    ```cpp
    #include <iostream> 
    #include <speechapi_cxx.h>
    
    using namespace Microsoft::CognitiveServices::Speech;
    using namespace Microsoft::CognitiveServices::Speech::Audio;
    using namespace Microsoft::CognitiveServices::Speech::Translation;
    
    auto YourSubscriptionKey = "YourSubscriptionKey";
    auto YourServiceRegion = "YourServiceRegion";
    
    int main()
    {
        auto speechTranslationConfig = SpeechTranslationConfig::FromSubscription(YourSubscriptionKey, YourServiceRegion);
        speechTranslationConfig->SetSpeechRecognitionLanguage("en-US");
        speechTranslationConfig->AddTargetLanguage("it");
    
        auto audioConfig = AudioConfig::FromDefaultMicrophoneInput();
        auto translationRecognizer = TranslationRecognizer::FromConfig(speechTranslationConfig, audioConfig);
    
        std::cout << "Speak into your microphone.\n";
        auto result = translationRecognizer->RecognizeOnceAsync().get();
    
        if (result->Reason == ResultReason::TranslatedSpeech)
        {
            std::cout << "RECOGNIZED: Text=" << result->Text << std::endl;
            for (auto pair : result->Translations)
            {
                auto language = pair.first;
                auto translation = pair.second;
                std::cout << "Translated into '" << language << "': " << translation << std::endl;
            }
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

1. In `SpeechTranslation.cpp`, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region. 
    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../use-key-vault.md). See the Cognitive Services [security](../../../../cognitive-services-security.md) article for more information.
1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md#speech-to-text). Specify the full locale with a dash (`-`) separator. For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/language-identification.md). 
1. To change the translation target language, replace `it` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md#speech-translation). With few exceptions you only specify the language code that precedes the locale dash (`-`) separator. For example, use `es` for Spanish (Spain) instead of `es-ES`. The default language is `en` if you don't specify a language.

[Build and run](/cpp/build/vscpp-step-2-build) your new console application to start speech recognition from a microphone.

Speak into your microphone when prompted. What you speak should be output as translated text in the target language: 

```console
Speak into your microphone.
RECOGNIZED: Text=I'm excited to try speech translation.
Translated into 'it': Sono entusiasta di provare la traduzione vocale.
```

## Remarks
Now that you've completed the quickstart, here are some additional considerations:

- This example uses the `RecognizeOnceAsync` operation to transcribe utterances of up to 30 seconds, or until silence is detected. For information about continuous recognition for longer audio, including multi-lingual conversations, see [How to translate speech](~/articles/cognitive-services/speech-service/how-to-translate-speech.md). 
- To recognize speech from an audio file, use `FromWavFileInput` instead of `FromDefaultMicrophoneInput`:
    ```cpp
    auto audioInput = AudioConfig::FromWavFileInput("YourAudioFile.wav");
    ```
- For compressed audio files such as MP4, install GStreamer and use `PullAudioInputStream` or `PushAudioInputStream`. For more information, see [How to use compressed input audio](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md).

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]