---
title: How to use automatic language detection for speech to text
titleSuffix: Azure Cognitive Services
description: The Speech SDK supports automatic language detection for speech to text. When using this feature, the audio provided is compared against a provided list of languages, and the most likely match is determined. The returned value can then be used to select the language model used for speech to text.
services: cognitive-services
author: susanhu
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/15/2020
ms.author: qiohu
zone_pivot_groups: programming-languages-set-seven
---

# Automatic language detection for speech to text

Automatic language detection is used to determine the most likely match for audio passed to the Speech SDK when compared against a list of provided languages. The value returned by automatic language detection is then used to select the language model for speech to text, providing you with a more accurate transcription. To see which languages are available, see [Language support](language-support.md).

In this article, you'll learn how to use `AutoDetectSourceLanguageConfig` to construct a `SpeechRecognizer` object and retrieve the detected language.

> [!IMPORTANT]
> This feature is only available for the Speech SDK for C#, C++ and Java.

## Automatic language detection with the Speech SDK

Automatic language detection currently has a services-side limit of two languages per detection. Keep this limitation in mind when construction your `AudoDetectSourceLanguageConfig` object. In the samples below, you'll create an `AutoDetectSourceLanguageConfig`, then use it to construct a `SpeechRecognizer`.

> [!TIP]
> You can also specify a custom model to use when performing speech to text. For more information, see [Use a custom model for automatic language detection](#use-a-custom-model-for-automatic-language-detection).

The following snippets illustrate how to use automatic language detection in your apps:

::: zone pivot="programming-language-csharp"

```csharp
var autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig.FromLanguages(new string[] { "en-US", "de-DE" });
using (var recognizer = new SpeechRecognizer(speechConfig, autoDetectSourceLanguageConfig, audioConfig))
{
    var speechRecognitionResult = await recognizer.RecognizeOnceAsync();
    var autoDetectSourceLanguageResult = AutoDetectSourceLanguageResult.FromResult(speechRecognitionResult);
    var detectedLanguage = autoDetectSourceLanguageResult.Language;
}
```

::: zone-end

::: zone pivot="programming-language-cpp"

```C++
auto autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig::FromLanguages({ "en-US", "de-DE" });
auto recognizer = SpeechRecognizer::FromConfig(speechConfig, autoDetectSourceLanguageConfig, audioConfig);
speechRecognitionResult = recognizer->RecognizeOnceAsync().get();
auto autoDetectSourceLanguageResult = AutoDetectSourceLanguageResult::FromResult(speechRecognitionResult);
auto detectedLanguage = autoDetectSourceLanguageResult->Language;
```

::: zone-end

::: zone pivot="programming-language-java"

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

::: zone-end

## Use a custom model for automatic language detection

In addition to language detection using Speech service models, you can specify a custom model for enhanced recognition. If a custom model isn't provided, the service will use the default language model.

The snippets below illustrate how to specify a custom model in your call to the Speech service. If the detected language is `en-US`, then the default model is used. If the detected language is `fr-FR`, then the endpoint for the custom model is used:

::: zone pivot="programming-language-csharp"

```csharp
var sourceLanguageConfigs = new SourceLanguageConfig[]
{
    SourceLanguageConfig.FromLanguage("en-US"),
    SourceLanguageConfig.FromLanguage("fr-FR", "The Endpoint Id for custom model of fr-FR")
};
var autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig.FromSourceLanguageConfigs(sourceLanguageConfigs);
```

::: zone-end

::: zone pivot="programming-language-cpp"

```C++
std::vector<std::shared_ptr<SourceLanguageConfig>> sourceLanguageConfigs;
sourceLanguageConfigs.push_back(SourceLanguageConfig::FromLanguage("en-US"));
sourceLanguageConfigs.push_back(SourceLanguageConfig::FromLanguage("fr-FR", "The Endpoint Id for custom model of fr-FR"));
auto autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig::FromSourceLanguageConfigs(sourceLanguageConfigs);
```

::: zone-end

::: zone pivot="programming-language-java"

```Java
List sourceLanguageConfigs = new ArrayList<SourceLanguageConfig>();
sourceLanguageConfigs.add(SourceLanguageConfig.fromLanguage("en-US"));
sourceLanguageConfigs.add(SourceLanguageConfig.fromLanguage("fr-FR", "The Endpoint Id for custom model of fr-FR"));
AutoDetectSourceLanguageConfig autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig.fromSourceLanguageConfigs(sourceLanguageConfigs);
```

::: zone-end

## Next steps

- [Speech SDK reference documentation](speech-sdk.md)
