---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/06/2020
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

> [!div class="nextstepaction"]
> [I have the prerequisites](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-cpp)
> [I ran into an issue](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-cpp)

## Set up the environment
The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK in the next section of this article, but first check the [platform-specific installation instructions](/azure/cognitive-services/speech-service/quickstarts/speech-sdk.md?pivots=programming-language-cpp#get-the-speech-sdk) for any more requirements.

> [!div class="nextstepaction"]
> [I have the tools I need](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-cpp)
> [I ran into an issue](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-cpp)

## Create a new project

Follow these steps to create a new console application and install the Speech SDK.

1. Open a command prompt where you want the new project, and create a console application with the .NET CLI.
    ```console
    dotnet new console
    ```
1. Install the Speech SDK in your new project with the .NET CLI.
    ```console
    dotnet add package Microsoft.CognitiveServices.Speech
    ```
1. Replace the contents of Program.cs with the following code:
    
    ```cpp
    using namespace std;
    using namespace Microsoft::CognitiveServices::Speech;
    using namespace Microsoft::CognitiveServices::Speech::Audio;
    
    auto YourSubscriptionKey = "YourSubscriptionKey";
    auto YourServiceRegion = "YourServiceRegion";
    
    auto config = SpeechConfig::FromSubscription(YourSubscriptionKey, YourServiceRegion);
    auto audioConfig = AudioConfig::FromDefaultMicrophoneInput();
    auto recognizer = SpeechRecognizer::FromConfig(config);
    cout << "Speak into your microphone.\n";

    auto result = recognizer->RecognizeOnceAsync().get();

    // Checks result.
    if (result->Reason == ResultReason::RecognizedSpeech)
    {
        cout << "RECOGNIZED: Text=" << result->Text << std::endl;
    }
    else if (result->Reason == ResultReason::NoMatch)
    {
        cout << "NOMATCH: Speech could not be recognized." << std::endl;
    }
    else if (result->Reason == ResultReason::Canceled)
    {
        auto cancellation = CancellationDetails::FromResult(result);
        cout << "CANCELED: Reason=" << (int)cancellation->Reason << std::endl;

        if (cancellation->Reason == CancellationReason::Error)
        {
            cout << "CANCELED: ErrorCode=" << (int)cancellation->ErrorCode << std::endl;
            cout << "CANCELED: ErrorDetails=" << cancellation->ErrorDetails << std::endl;
            cout << "CANCELED: Did you update the subscription info?" << std::endl;
        }
    }
    ```

1. In Program.cpp, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.

> [!div class="nextstepaction"]
> [My project is ready to run](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-cpp)
> [I ran into an issue](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-cpp)

## Recognize speech from a microphone

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
> [My speech was recognized](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-cpp)
> [I ran into an issue](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-cpp)

Now that you have a speech to text application, here are some suggested modifications to try out:
- To recognize speech from an audio file, use `FromWavFileInput` instead of `FromDefaultMicrophoneInput`:
    ```cpp
    auto audioInput = AudioConfig::FromWavFileInput("YourAudioFile.wav");
    ```
- To improve recognition accuracy of specific words or utterances, use a [phrase list](~/articles/cognitive-services/speech-service/improve-accuracy-phrase-list.md). You can add these lines right after the new `SpeechRecognizer` object is created:
    ```cpp
    auto phraseListGrammar = PhraseListGrammar::FromRecognizer(recognizer);
    phraseListGrammar->AddPhrase("Contoso");
    phraseListGrammar->AddPhrase("Jessie");
    phraseListGrammar->AddPhrase("Rehaan");
    ```
- To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-us` if you don't specify a language.
    ```cpp
    speechConfig->SetSpeechRecognitionLanguage = "es-ES";
    ```
- For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/supported-languages.md). 


## Clean up resources

You can use the [Azure portal](~/articles/cognitive-services/cognitive-services-apis-create-account.md#clean-up-resources) or [Azure Command Line Interface (CLI)](~/articles/cognitive-services/cognitive-services-apis-create-account-cli.md#clean-up-resources) to remove the Speech resource you created.
