---
title: How to specify source language for speech to text
titleSuffix: Azure Cognitive Services
description: The Speech SDK allows you to specify the source language when converting speech to text. This article describes how to use the FromConfig and SourceLanguageConfig methods to let the Speech service know the source language and provide a custom model target.
services: cognitive-services
author: susanhu
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/07/2020
ms.author: qiohu
zone_pivot_groups: programming-languages-set-two
---

# Specify source language for speech to text

In this article, you'll learn how to specify the source language for an audio input passed to the Speech SDK for speech recognition. Additionally, example code is provided to specify a custom speech model for improved recognition.

::: zone pivot="programming-language-csharp"

## How to specify source language in C#

In this example, the source language is provided explicitly as a parameter using `SpeechRecognizer` construct.

```csharp
var recognizer = new SpeechRecognizer(speechConfig, "de-DE", audioConfig);
```

In this example, the source language is provided using `SourceLanguageConfig`. Then, the `sourceLanguageConfig` is passed as a parameter to `SpeechRecognizer` construct.

```csharp
var sourceLanguageConfig = SourceLanguageConfig.FromLanguage("de-DE");
var recognizer = new SpeechRecognizer(speechConfig, sourceLanguageConfig, audioConfig);
```

In this example, the source language and custom endpoint are provided using `SourceLanguageConfig`. Then, the `sourceLanguageConfig` is passed as a parameter to `SpeechRecognizer` construct.

```csharp
var sourceLanguageConfig = SourceLanguageConfig.FromLanguage("de-DE", "The Endpoint ID for your custom model.");
var recognizer = new SpeechRecognizer(speechConfig, sourceLanguageConfig, audioConfig);
```

>[!Note]
> `SpeechRecognitionLanguage` and `EndpointId` set methods are deprecated from the `SpeechConfig` class in C#. The use of these methods are discouraged, and shouldn't be used when constructing a `SpeechRecognizer`.

::: zone-end

::: zone pivot="programming-language-cpp"


## How to specify source language in C++

In this example, the source language is provided explicitly as a parameter using the `FromConfig` method.

```C++
auto recognizer = SpeechRecognizer::FromConfig(speechConfig, "de-DE", audioConfig);
```

In this example, the source language is provided using `SourceLanguageConfig`. Then, the `sourceLanguageConfig` is passed as a parameter to `FromConfig` when creating the `recognizer`.

```C++
auto sourceLanguageConfig = SourceLanguageConfig::FromLanguage("de-DE");
auto recognizer = SpeechRecognizer::FromConfig(speechConfig, sourceLanguageConfig, audioConfig);
```

In this example, the source language and custom endpoint are provided using `SourceLanguageConfig`. The `sourceLanguageConfig` is passed as a parameter to `FromConfig` when creating the `recognizer`.

```C++
auto sourceLanguageConfig = SourceLanguageConfig::FromLanguage("de-DE", "The Endpoint ID for your custom model.");
auto recognizer = SpeechRecognizer::FromConfig(speechConfig, sourceLanguageConfig, audioConfig);
```

>[!Note]
> `SetSpeechRecognitionLanguage` and `SetEndpointId` are deprecated methods from the `SpeechConfig` class in C++ and Java. The use of these methods are discouraged, and shouldn't be used when constructing a `SpeechRecognizer`.

::: zone-end

::: zone pivot="programming-language-java"

## How to specify source language in Java

In this example, the source language is provided explicitly when creating a new `SpeechRecognizer`.

```Java
SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, "de-DE", audioConfig);
```

In this example, the source language is provided using `SourceLanguageConfig`. Then, the `sourceLanguageConfig` is passed as a parameter when creating a new `SpeechRecognizer`.

```Java
SourceLanguageConfig sourceLanguageConfig = SourceLanguageConfig.fromLanguage("de-DE");
SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, sourceLanguageConfig, audioConfig);
```

In this example, the source language and custom endpoint are provided using `SourceLanguageConfig`. Then, the `sourceLanguageConfig` is passed as a parameter when creating a new `SpeechRecognizer`.

```Java
SourceLanguageConfig sourceLanguageConfig = SourceLanguageConfig.fromLanguage("de-DE", "The Endpoint ID for your custom model.");
SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, sourceLanguageConfig, audioConfig);
```

>[!Note]
> `setSpeechRecognitionLanguage` and `setEndpointId` are deprecated methods from the `SpeechConfig` class in C++ and Java. The use of these methods are discouraged, and shouldn't be used when constructing a `SpeechRecognizer`.

::: zone-end

::: zone pivot="programming-language-python"

## How to specify source language in Python

The first step is to create a `speech_config`:

```Python
speech_key, service_region = "YourSubscriptionKey", "YourServiceRegion"
speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
```

Next, specify the source language of your audio with `speech_recognition_language`:

```Python
speech_config.speech_recognition_language="de-DE"
```

If you're using a custom model for recognition, you can specify the endpoint with `endpoint_id`:

```Python
speech_config.endpoint_id = "The Endpoint ID for your custom model."
```

::: zone-end

::: zone pivot="programming-language-more"

## How to specify source language in Javascript

The first step is to create a `SpeechConfig`:

```Javascript
var speechConfig = sdk.SpeechConfig.fromSubscription("YourSubscriptionkey", "YourRegion");
```

Next, specify the source language of your audio with `speechRecognitionLanguage`:

```Javascript
speechConfig.speechRecognitionLanguage = "de-DE";
```

If you're using a custom model for recognition, you can specify the endpoint with `endpointId`:

```Javascript
speechConfig.endpointId = "The Endpoint ID for your custom model.";
```

## How to specify source language in Objective-C

The first step is to create a `speechConfig`:

```Objective-C
SPXSpeechConfiguration *speechConfig = [[SPXSpeechConfiguration alloc] initWithSubscription:@"YourSubscriptionkey" region:@"YourRegion"];
```

Next, specify the source language of your audio with `speechRecognitionLanguage`:

```Objective-C
speechConfig.speechRecognitionLanguage = @"de-DE";
```

If you're using a custom model for recognition, you can specify the endpoint with `endpointId`:

```Objective-C
speechConfig.endpointId = @"The Endpoint ID for your custom model.";
```

::: zone-end

## See also

* For a list of supported languages and locales for speech to text, see [Language support](language-support.md).

## Next steps

* [Speech SDK reference documentation](speech-sdk.md)
