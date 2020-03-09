---
title: Choose a speech recognition mode with the Speech SDK
titleSuffix: Azure Cognitive Services
description: Learn how to choose the best recognition mode when using the Speech SDK.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/13/2020
ms.author: dapine
zone_pivot_groups: programming-languages-set-two
---

# Choose a speech recognition mode

When considering speech-to-text recognition operations, the [Speech SDK](speech-sdk.md) provides multiple modes for processing speech. Conceptually, sometimes called the *recognition mode*. This article compares the various recognition modes.

## Recognize once

If you want to process each utterance one "sentence" at a time, use the "recognize once" function. This method will detect a recognized utterance from the input starting at the beginning of detected speech until the next pause. Usually, a pause marks the end of a sentence or line-of-thought.

At the end of one recognized utterance, the service stops processing audio from that request. The maximum limit for recognition is a sentence duration of 20 seconds.

::: zone pivot="programming-language-csharp"

For more information on using the `RecognizeOnceAsync` function, see the [.NET Speech SDK docs](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechrecognizer.recognizeonceasync?view=azure-dotnet#Microsoft_CognitiveServices_Speech_SpeechRecognizer_RecognizeOnceAsync).

```csharp
var result = await recognizer.RecognizeOnceAsync().ConfigureAwait(false);
```

::: zone-end
::: zone pivot="programming-language-cpp"

For more information on using the `RecognizeOnceAsync` function, see the [C++ Speech SDK docs](https://docs.microsoft.com/cpp/cognitive-services/speech/asyncrecognizer#recognizeonceasync).

```cpp
auto result = recognize->RecognizeOnceAsync().get();
```

::: zone-end
::: zone pivot="programming-language-java"

For more information on using the `recognizeOnceAsync` function, see the [Java Speech SDK docs](https://docs.microsoft.com/java/api/com.microsoft.cognitiveservices.speech.SpeechRecognizer.recognizeOnceAsync?view=azure-java-stable).

```java
SpeechRecognitionResult result = recognizer.recognizeOnceAsync().get();
```

::: zone-end
::: zone pivot="programming-language-python"

For more information on using the `recognize_once` function, see the [Python Speech SDK docs](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechrecognizer?view=azure-python#recognize-once------azure-cognitiveservices-speech-speechrecognitionresult).

```python
result = speech_recognizer.recognize_once()
```

::: zone-end
::: zone pivot="programming-language-more"

For additional languages, see the [Speech SDK reference docs](speech-to-text.md#speech-sdk-reference-docs).

::: zone-end

## Continuous

If you need long-running recognition, use the start and corresponding stop functions for continuous recognition. The start function will start and continue processing all utterances until you invoke the stop function, or until too much time in silence has passed. When using the continuous mode, be sure to register to the various events that will fire upon occurrence. For example, the "recognized" event fires when speech recognition occurs. You need to have an event handler in place to handle recognition. A limit of 10 minutes of total speech recognition time, per session is enforced by the Speech service.

::: zone pivot="programming-language-csharp"

```csharp
// Subscribe to event
recognizer.Recognized += (s, e) => 
{
    if (e.Result.Reason == ResultReason.RecognizedSpeech)
    {
        // Do something with the recognized text
        // e.Result.Text
    }
};

// Start continuous speech recognition
await recognizer.StartContinuousRecognitionAsync().ConfigureAwait(false);

// Stop continuous speech recognition
await recognizer.StopContinuousRecognitionAsync().ConfigureAwait(false);
```

::: zone-end
::: zone pivot="programming-language-cpp"

```cpp
// Connect to event
recognizer->Recognized.Connect([] (const SpeechRecognitionEventArgs& e)
{
    if (e.Result->Reason == ResultReason::RecognizedSpeech)
    {
        // Do something with the recognized text
        // e.Result->Text
    }
});

// Start continuous speech recognition
recognizer->StartContinuousRecognitionAsync().get();

// Stop continuous speech recognition
recognizer->StopContinuousRecognitionAsync().get();
```

::: zone-end
::: zone pivot="programming-language-java"

```java
recognizer.recognized.addEventListener((s, e) -> {
    if (e.getResult().getReason() == ResultReason.RecognizedSpeech) {
        // Do something with the recognized text
        // e.getResult().getText()
    }
});

// Start continuous speech recognition
recognizer.startContinuousRecognitionAsync().get();

// Stop continuous speech recognition
recognizer.stopContinuousRecognitionAsync().get();
```

::: zone-end
::: zone pivot="programming-language-python"

```python
def recognized_cb(evt):
    if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
        # Do something with the recognized text
        # evt.result.text

speech_recognizer.recognized.connect(recognized_cb)

# Start continuous speech recognition
speech_recognizer.start_continuous_recognition()

# Stop continuous speech recognition
speech_recognizer.stop_continuous_recognition()
```

::: zone-end
::: zone pivot="programming-language-more"

For additional languages, see the [Speech SDK reference docs](speech-to-text.md#speech-sdk-reference-docs).

::: zone-end

## Dictation

When using continuous recognition, you can enable dictation processing by using the corresponding "enable dictation" function. This mode will cause the speech config instance to interpret word descriptions of sentence structures such as punctuation. For example, the utterance "Do you live in town question mark" would be interpreted as the text "Do you live in town?".

::: zone pivot="programming-language-csharp"

For more information on using the `EnableDictation` function, see the [.NET Speech SDK docs](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig.enabledictation?view=azure-dotnet#Microsoft_CognitiveServices_Speech_SpeechConfig_EnableDictation).

```csharp
// Enable diction
SpeechConfig.EnableDictation();
```

::: zone-end
::: zone pivot="programming-language-cpp"

For more information on using the `EnableDictation` function, see the [C++ Speech SDK docs](https://docs.microsoft.com/cpp/cognitive-services/speech/speechconfig#enabledictation).

```cpp
// Enable diction
SpeechConfig->EnableDictation();
```

::: zone-end
::: zone pivot="programming-language-java"

For more information on using the `enableDictation` function, see the [Java Speech SDK docs](https://docs.microsoft.com/java/api/com.microsoft.cognitiveservices.speech.SpeechConfig.enableDictation?view=azure-java-stable).

```java
// Enable diction
SpeechConfig.enableDictation();
```

::: zone-end
::: zone pivot="programming-language-python"

For more information on using the `enable_dictation` function, see the [Python Speech SDK docs](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python#enable-dictation--).

```python
# Enable diction
SpeechConfig.enable_dictation()
```

::: zone-end
::: zone pivot="programming-language-more"

For additional languages, see the [Speech SDK reference docs](speech-to-text.md#speech-sdk-reference-docs).

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Explore additional Speech SDK samples on GitHub](https://aka.ms/csspeech/samples)
