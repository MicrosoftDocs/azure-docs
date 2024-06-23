---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 2/1/2024
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) that implements .NET Standard 2.0. Install the Speech SDK later in this guide. For any requirements, see [Install the Speech SDK](../../../quickstarts/setup-platform.md?pivots=programming-language-cpp).

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Synthesize to speaker output

Follow these steps to create a console application and install the Speech SDK.

1. Create a C++ console project in [Visual Studio Community](https://visualstudio.microsoft.com/downloads/) named `SpeechSynthesis`.

1. Replace the contents of *SpeechSynthesis.cpp* with the following code:

    ```cpp
    #include <iostream> 
    #include <stdlib.h>
    #include <speechapi_cxx.h>

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

        // The neural multilingual voice can speak different languages based on the input text.
        speechConfig->SetSpeechSynthesisVoiceName("en-US-AvaMultilingualNeural");

        auto speechSynthesizer = SpeechSynthesizer::FromConfig(speechConfig);

        // Get text from the console and synthesize to the default speaker.
        std::cout << "Enter some text that you want to speak >" << std::endl;
        std::string text;
        getline(std::cin, text);

        auto result = speechSynthesizer->SpeakTextAsync(text).get();

        // Checks result.
        if (result->Reason == ResultReason::SynthesizingAudioCompleted)
        {
            std::cout << "Speech synthesized to speaker for text [" << text << "]" << std::endl;
        }
        else if (result->Reason == ResultReason::Canceled)
        {
            auto cancellation = SpeechSynthesisCancellationDetails::FromResult(result);
            std::cout << "CANCELED: Reason=" << (int)cancellation->Reason << std::endl;

            if (cancellation->Reason == CancellationReason::Error)
            {
                std::cout << "CANCELED: ErrorCode=" << (int)cancellation->ErrorCode << std::endl;
                std::cout << "CANCELED: ErrorDetails=[" << cancellation->ErrorDetails << "]" << std::endl;
                std::cout << "CANCELED: Did you set the speech resource key and region values?" << std::endl;
            }
        }

        std::cout << "Press enter to exit..." << std::endl;
        std::cin.get();
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

1. Select **Tools** > **Nuget Package Manager** > **Package Manager Console**. In the **Package Manager Console**, run this command:

    ```console
    Install-Package Microsoft.CognitiveServices.Speech
    ```

1. To change the speech synthesis language, replace `en-US-AvaMultilingualNeural` with another [supported voice](~/articles/ai-services/speech-service/language-support.md#prebuilt-neural-voices).

   All neural voices are multilingual and fluent in their own language and English. For example, if the input text in English is "I'm excited to try text to speech" and you set `es-ES-ElviraNeural`, the text is spoken in English with a Spanish accent. If the voice doesn't speak the language of the input text, the Speech service doesn't output synthesized audio.

1. [Build and run your new console application](/cpp/build/vscpp-step-2-build) to start speech synthesis to the default speaker.

   > [!IMPORTANT]
   > Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` [environment variables](#set-environment-variables). If you don't set these variables, the sample fails with an error message.

1. Enter some text that you want to speak. For example, type *I'm excited to try text to speech*. Select the **Enter** key to hear the synthesized speech.

   ```console
   Enter some text that you want to speak >
   I'm excited to try text to speech
   ```

## Remarks

### More speech synthesis options

This quickstart uses the `SpeakTextAsync` operation to synthesize a short block of text that you enter. You can also use long-form text from a file and get finer control over voice styles, prosody, and other settings.

- See [how to synthesize speech](~/articles/ai-services/speech-service/how-to-speech-synthesis.md) and [Speech Synthesis Markup Language (SSML) overview](~/articles/ai-services/speech-service/speech-synthesis-markup.md) for information about speech synthesis from a file and finer control over voice styles, prosody, and other settings.
- See [batch synthesis API for text to speech](~/articles/ai-services/speech-service/batch-synthesis.md) for information about synthesizing long-form text to speech.

### OpenAI text to speech voices in Azure AI Speech

OpenAI text to speech voices are also supported. See [OpenAI text to speech voices in Azure AI Speech](../../../openai-voices.md) and [multilingual voices](../../../language-support.md?tabs=tts#multilingual-voices). You can replace `en-US-AvaMultilingualNeural` with a supported OpenAI voice name such as `en-US-FableMultilingualNeural`.

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
