---
author: eric-urban
ms.service: azure-ai-speech
ms.date: 02/17/2023
ms.topic: include
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites-clu.md)]

## Set up the environment
The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK later in this guide, but first check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-cpp) for any more requirements.

### Set environment variables

This example requires environment variables named `LANGUAGE_KEY`, `LANGUAGE_ENDPOINT`, `SPEECH_KEY`, and `SPEECH_REGION`.

[!INCLUDE [Environment variables](../../common/environment-variables-clu.md)]

## Create a Conversational Language Understanding project

[!INCLUDE [Deploy CLU model](deploy-clu-model.md)]

You'll use the project name and deployment name in the next section.

## Recognize intents from a microphone

Follow these steps to create a new console application and install the Speech SDK.

1. Create a new C++ console project in Visual Studio Community 2022 named `SpeechRecognition`.
1. Install the Speech SDK in your new project with the NuGet package manager.
    ```powershell
    Install-Package Microsoft.CognitiveServices.Speech
    ```
1. Replace the contents of `SpeechRecognition.cpp` with the following code:
    
    ```cpp
    #include <iostream> 
    #include <stdlib.h>
    #include <speechapi_cxx.h>
    
    using namespace Microsoft::CognitiveServices::Speech;
    using namespace Microsoft::CognitiveServices::Speech::Audio;
    using namespace Microsoft::CognitiveServices::Speech::Intent;
    
    std::string GetEnvironmentVariable(const char* name);
    
    int main()
    {
        // This example requires environment variables named:
        // "LANGUAGE_KEY", "LANGUAGE_ENDPOINT", "SPEECH_KEY", and "SPEECH_REGION"
        auto languageKey = GetEnvironmentVariable("LANGUAGE_KEY");
        auto languageEndpoint = GetEnvironmentVariable("LANGUAGE_ENDPOINT");
        auto speechKey = GetEnvironmentVariable("SPEECH_KEY");
        auto speechRegion = GetEnvironmentVariable("SPEECH_REGION");
    
        auto cluProjectName = "YourProjectNameGoesHere";
        auto cluDeploymentName = "YourDeploymentNameGoesHere";
    
        if ((size(languageKey) == 0) || (size(languageEndpoint) == 0) || (size(speechKey) == 0) || (size(speechRegion) == 0)) {
            std::cout << "Please set LANGUAGE_KEY, LANGUAGE_ENDPOINT, SPEECH_KEY, and SPEECH_REGION environment variables." << std::endl;
            return -1;
        }
    
        auto speechConfig = SpeechConfig::FromSubscription(speechKey, speechRegion);
    
        speechConfig->SetSpeechRecognitionLanguage("en-US");
    
        auto audioConfig = AudioConfig::FromDefaultMicrophoneInput();
        auto intentRecognizer = IntentRecognizer::FromConfig(speechConfig, audioConfig);
    
        std::vector<std::shared_ptr<LanguageUnderstandingModel>> models;
    
        auto cluModel = ConversationalLanguageUnderstandingModel::FromResource(
            languageKey,
            languageEndpoint,
            cluProjectName,
            cluDeploymentName);
    
        models.push_back(cluModel);
        intentRecognizer->ApplyLanguageModels(models);
    
        std::cout << "Speak into your microphone.\n";
        auto result = intentRecognizer->RecognizeOnceAsync().get();
    
        if (result->Reason == ResultReason::RecognizedIntent)
        {
            std::cout << "RECOGNIZED: Text=" << result->Text << std::endl;
            std::cout << "  Intent Id: " << result->IntentId << std::endl;
            std::cout << "  Intent Service JSON: " << result->Properties.GetProperty(PropertyId::LanguageUnderstandingServiceResponse_JsonResult) << std::endl;
        }
        else if (result->Reason == ResultReason::RecognizedSpeech)
        {
            std::cout << "RECOGNIZED: Text=" << result->Text << " (intent could not be recognized)" << std::endl;
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
                std::cout << "CANCELED: Did you update the subscription info?" << std::endl;
            }
        }
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

1. In `SpeechRecognition.cpp` set the `cluProjectName` and `cluDeploymentName` variables to the names of your project and deployment. For information about how to create a CLU project and deployment, see [Create a Conversational Language Understanding project](#create-a-conversational-language-understanding-project).
1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/ai-services/speech-service/language-support.md). For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/ai-services/speech-service/language-identification.md). 

[Build and run](/cpp/build/vscpp-step-2-build) your new console application to start speech recognition from a microphone.

> [!IMPORTANT]
> Make sure that you set the `LANGUAGE_KEY`, `LANGUAGE_ENDPOINT`, `SPEECH_KEY`, and `SPEECH_REGION` environment variables as described [above](#set-environment-variables). If you don't set these variables, the sample will fail with an error message.

Speak into your microphone when prompted. What you speak should be output as text: 

```console
Speak into your microphone.
RECOGNIZED: Text=Turn on the lights.
    Intent Id: HomeAutomation.TurnOn.
    Language Understanding JSON: {"kind":"ConversationResult","result":{"query":"turn on the lights","prediction":{"topIntent":"HomeAutomation.TurnOn","projectKind":"Conversation","intents":[{"category":"HomeAutomation.TurnOn","confidenceScore":0.97712576},{"category":"HomeAutomation.TurnOff","confidenceScore":0.8431633},{"category":"None","confidenceScore":0.782861}],"entities":[{"category":"HomeAutomation.DeviceType","text":"lights","offset":12,"length":6,"confidenceScore":1,"extraInformation":[{"extraInformationKind":"ListKey","key":"light"}]}]}}}.
```

> [!NOTE]
> Support for the JSON response for CLU via the LanguageUnderstandingServiceResponse_JsonResult property was added in the Speech SDK version 1.26.

The intents are returned in the probability order of most likely to least likely. Here's a formatted version of the JSON output where the `topIntent` is `HomeAutomation.TurnOn` with a confidence score of 0.97712576 (97.71%). The second most likely intent might be `HomeAutomation.TurnOff` with a confidence score of 0.8985081 (84.31%).

```json
{
  "kind": "ConversationResult",
  "result": {
    "query": "turn on the lights",
    "prediction": {
      "topIntent": "HomeAutomation.TurnOn",
      "projectKind": "Conversation",
      "intents": [
        {
          "category": "HomeAutomation.TurnOn",
          "confidenceScore": 0.97712576
        },
        {
          "category": "HomeAutomation.TurnOff",
          "confidenceScore": 0.8431633
        },
        {
          "category": "None",
          "confidenceScore": 0.782861
        }
      ],
      "entities": [
        {
          "category": "HomeAutomation.DeviceType",
          "text": "lights",
          "offset": 12,
          "length": 6,
          "confidenceScore": 1,
          "extraInformation": [
            {
              "extraInformationKind": "ListKey",
              "key": "light"
            }
          ]
        }
      ]
    }
  }
}
```

## Remarks
Now that you've completed the quickstart, here are some additional considerations:

- This example uses the `RecognizeOnceAsync` operation to transcribe utterances of up to 30 seconds, or until silence is detected. For information about continuous recognition for longer audio, including multi-lingual conversations, see [How to recognize speech](~/articles/ai-services/speech-service/how-to-recognize-speech.md).
- To recognize speech from an audio file, use `FromWavFileInput` instead of `FromDefaultMicrophoneInput`:
    ```cpp
    auto audioInput = AudioConfig::FromWavFileInput("YourAudioFile.wav");
    ```
- For compressed audio files such as MP4, install GStreamer and use `PullAudioInputStream` or `PushAudioInputStream`. For more information, see [How to use compressed input audio](~/articles/ai-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md).

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource-clu.md)]

