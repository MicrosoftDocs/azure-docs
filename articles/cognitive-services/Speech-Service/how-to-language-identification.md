---
title: 'How-to: Language ID for speech recognition - Speech Service'
titleSuffix: Azure Cognitive Services
description: The Language ID feature in the Speech SDK enables automatic detection of the language of an audio file, which is then used to perform speech recognition.
services: cognitive-services
author: susanhu
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: susanhu
---

# Automatic language identification for speech recognition

Automatic language identification is used to detect the language of audio/speech passed to the Speech service using the Speech SDK. This value returned by automatic language identification is then used to select the correct language model for speech recognition, providing you with an accurate transcription. To see which languages are available, see [Language support](language-support.md).

In this article, you'll learn how to use `AutoDetectSourcLanguageConfig` to construct a `SpeechRecognizer` object and retrieve the detected language.

## Automatic language identification with the Speech SDK

Automatic language identification currently has a limit of two source languages that can be provided when constructing `AutoDetectSourcLanguageConfig`. In the samples below, you'll create an `AutoDetectSourcLanguageConfig`, then use it to construct a `SpeechRecognizer`.

>[!TIP]
> You can also specify a custom model to use when performing speech recognition. For more information, see [Use a custom model for automatic language identification](#use-a-custom-model-for-automatic-language-identification).

The following snippets illustrate how to use automatic language identification in your apps:

```C++
auto autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig::FromLanguages({ "en-US", "de-DE" });
auto recognizer = SpeechRecognizer::FromConfig(speechConfig, autoDetectSourceLanguageConfig, audioConfig);
speechRecognitionResult = recognizer->RecognizeOnceAsync().get();
auto autoDetectSourceLanguageResult = AutoDetectSourceLanguageResult::FromResult(speechRecognitionResult);
auto detectedLanguage = autoDetectSourceLanguageResult->Language;
```

```Java
AutoDetectSourceLanguageConfig autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig.fromLanguages(Arrays.asList("en-US", "de-DE"));
SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, autoDetectSourceLanguageConfig, audioConfig);
Future<SpeechRecognitionResult> future = recognizer.recognizeOnceAsync();
SpeechRecognitionResult result = future.get(30, TimeUnit.SECONDS);
AutoDetectSourceLanguageResult autoDetectSourceLanguageResult = AutoDetectSourceLanguageResult.fromResult(result);
String detectedLanguage = autoDetectSourceLanguageResult.getLanguage();

recognizer.close();
speechConfig.close();
autoDetectSourceLanguageConfig.close();
audioConfig.close();
result.close();
```

## Use a custom model for automatic language identification

In addition to language identification using Speech service models, you can specify a custom model for enhanced recognition. If a custom model isn't provided, the service will use the default language model.

The snippets below illustrate how to specify a custom model in your call to the Speech service. If the detected language is `en-US`, then the default model is used. If the detected language is `fr-FR`, then the endpoint for the custom model is used:

```C++
std::vector<std::shared_ptr<SourceLanguageConfig>> sourceLanguageConfigs;
sourceLanguageConfigs.push_back(SourceLanguageConfig::FromLanguage("en-US"));
sourceLanguageConfigs.push_back(SourceLanguageConfig::FromLanguage("fr-FR", "The Endpoint Id for custom model of fr-FR"));
auto autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig::FromSourceLanguageConfigs(sourceLanguageConfigs);
```

```Java
List sourceLanguageConfigs = new ArrayList<SourceLanguageConfig>();
sourceLanguageConfigs.add(SourceLanguageConfig.fromLanguage("en-US"));
sourceLanguageConfigs.add(SourceLanguageConfig.fromLanguage("fr-FR", "The Endpoint Id for custom model of fr-FR"));
AutoDetectSourceLanguageConfig autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig.fromSourceLanguageConfigs(sourceLanguageConfigs);
```

## Next steps

* [Speech SDK reference documentation](speech-sdk.md)
