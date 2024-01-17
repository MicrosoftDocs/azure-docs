---
title: How to track Speech SDK memory usage - Speech service
titleSuffix: Azure AI services
description: The Speech SDK supports numerous programming languages for speech to text and text to speech conversion, along with speech translation. This article discusses memory management tooling built into the SDK.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 12/10/2019
ms.author: rhurey
ms.devlang: cpp
# ms.devlang: cpp, csharp, java, objective-c, python
ms.custom: devx-track-csharp, ignite-fall-2021, devx-track-extended-java, devx-track-python
zone_pivot_groups: programming-languages-set-two
---

# How to track Speech SDK memory usage

The Speech SDK is based on a native code base that's projected into multiple programming languages through a series of interoperability layers. Each language-specific projection has idiomatically correct features to manage the object lifecycle. Additionally, the Speech SDK includes memory management tooling to track resource usage with object logging and object limits. 

## How to read object logs

If [Speech SDK logging is enabled](how-to-use-logging.md), tracking tags are emitted to enable historical object observation. These tags include: 

* `TrackHandle` or `StopTracking` 
* The object type
* The current number of objects that are tracked the type of the object, and the current number being tracked.

Here's a sample log: 

```terminal
(284): 8604ms SPX_DBG_TRACE_VERBOSE:  handle_table.h:90 TrackHandle type=Microsoft::CognitiveServices::Speech::Impl::ISpxRecognitionResult handle=0x0x7f688401e1a0, ptr=0x0x7f688401e1a0, total=19
```

## Set a warning threshold

You have the option to create a warning threshold, and if that threshold is exceeded (assuming logging is enabled), a warning message is logged. The warning message contains a dump of all objects in existence along with their count. This information can be used to better understand issues. 

To enable a warning threshold, it must be specified on a `SpeechConfig` object. This object is checked when a new recognizer is created. In the following examples, let's assume that you've created an instance of `SpeechConfig` called `config`:

::: zone pivot="programming-language-csharp"

```csharp
config.SetProperty("SPEECH-ObjectCountWarnThreshold", "10000");
```

::: zone-end

::: zone pivot="programming-language-cpp"

```C++
config->SetProperty("SPEECH-ObjectCountWarnThreshold", "10000");
```

::: zone-end

::: zone pivot="programming-language-java"

```java
config.setProperty("SPEECH-ObjectCountWarnThreshold", "10000");
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
speech_config.set_property_by_name("SPEECH-ObjectCountWarnThreshold", "10000")?
```

::: zone-end

::: zone pivot="programming-language-more"

```ObjectiveC
[config setPropertyTo:@"10000" byName:"SPEECH-ObjectCountWarnThreshold"];
```

::: zone-end

> [!TIP]
> The default value for this property is 10,000.

## Set an error threshold 

Using the Speech SDK, you can set the maximum number of objects allowed at a given time. If this setting is enabled, when the maximum number is hit, attempts to create new recognizer objects will fail. Existing objects will continue to work.

Here's a sample error:

```terminal
Runtime error: The maximum object count of 500 has been exceeded.
The threshold can be adjusted by setting the SPEECH-ObjectCountErrorThreshold property on the SpeechConfig object.
Handle table dump by object type:
class Microsoft::CognitiveServices::Speech::Impl::ISpxRecognitionResult 0
class Microsoft::CognitiveServices::Speech::Impl::ISpxRecognizer 0
class Microsoft::CognitiveServices::Speech::Impl::ISpxAudioConfig 0
class Microsoft::CognitiveServices::Speech::Impl::ISpxSpeechConfig 0
```

To enable an error threshold, it must be specified on a `SpeechConfig` object. This object is checked when a new recognizer is created. In the following examples, let's assume that you've created an instance of `SpeechConfig` called `config`:

::: zone pivot="programming-language-csharp"

```csharp
config.SetProperty("SPEECH-ObjectCountErrorThreshold", "10000");
```

::: zone-end

::: zone pivot="programming-language-cpp"

```C++
config->SetProperty("SPEECH-ObjectCountErrorThreshold", "10000");
```

::: zone-end

::: zone pivot="programming-language-java"

```java
config.setProperty("SPEECH-ObjectCountErrorThreshold", "10000");
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
speech_config.set_property_by_name("SPEECH-ObjectCountErrorThreshold", "10000")?
```

::: zone-end

::: zone pivot="programming-language-more"

```objc
[config setPropertyTo:@"10000" byName:"SPEECH-ObjectCountErrorThreshold"];
```

::: zone-end

> [!TIP]
> The default value for this property is the platform-specific maximum value for a `size_t` data type. A typical recognition will consume between 7 and 10 internal objects.

## Next steps

* [Learn more about the Speech SDK](speech-sdk.md)
