---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 08/24/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK later in this guide. For other requirements, see [Install the Speech SDK](../../../quickstarts/setup-platform.md?pivots=programming-language-cpp).

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Recognize speech from a microphone

Follow these steps to create a console application and install the Speech SDK.

1. Create a new C++ console project in [Visual Studio Community](https://visualstudio.microsoft.com/downloads/) named `SpeechRecognition`.
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
    
       auto audioConfig = AudioConfig::FromDefaultMicrophoneInput();
       auto speechRecognizer = SpeechRecognizer::FromConfig(speechConfig, audioConfig);
    
       std::cout << "Speak into your microphone.\n";
       auto result = speechRecognizer->RecognizeOnceAsync().get();
    
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

1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/ai-services/speech-service/language-support.md). For example, use `es-ES` for Spanish (Spain). If you don't specify a language, the default is `en-US`. For details about how to identify one of multiple languages that might be spoken, see [Language identification](~/articles/ai-services/speech-service/language-identification.md).

1. [Build and run](/cpp/build/vscpp-step-2-build) your new console application to start speech recognition from a microphone.

   > [!IMPORTANT]
   > Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described in [Set environment variables](#set-environment-variables). If you don't set these variables, the sample fails with an error message.

1. Speak into your microphone when prompted. What you speak should appear as text:

   ```output
   Speak into your microphone.
   RECOGNIZED: Text=I'm excited to try speech to text.
   ```

## Remarks

Here are some other considerations:

- This example uses the `RecognizeOnceAsync` operation to transcribe utterances of up to 30 seconds, or until silence is detected. For information about continuous recognition for longer audio, including multi-lingual conversations, see [How to recognize speech](~/articles/ai-services/speech-service/how-to-recognize-speech.md).
- To recognize speech from an audio file, use `FromWavFileInput` instead of `FromDefaultMicrophoneInput`:

  ```cpp
  auto audioInput = AudioConfig::FromWavFileInput("YourAudioFile.wav");
  ```

- For compressed audio files such as MP4, install GStreamer and use `PullAudioInputStream` or `PushAudioInputStream`. For more information, see [How to use compressed input audio](~/articles/ai-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md).

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
