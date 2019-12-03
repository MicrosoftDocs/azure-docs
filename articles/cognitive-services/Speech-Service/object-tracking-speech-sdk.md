---
title: Object tracking for the Speech SDK - Speech service
titleSuffix: Azure Cognitive Services
description: The Speech Service SDK supports numerous programming languages for speech-to-text and text-to-speech conversion, along with speech translation. This article discusses memory management tooling built into the SDK.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/03/2019
ms.author: rhurey
---

# Object tracking for the Speech SDK

The Speech SDK is based on a native code that is projected into multiple programming languages through a series of interoperability layers. While each projection contains idiomatically correct object lifetime management features, additional support for tracking resource usage has been built into the Speech SDK. This article describes these features.

## Object Logging

If [Speech SDK logging is enabled](how-to-use-logging.md), tracking tags are emitted to enable historical object observation. These tags contain either "TrackHandle" or "StopTracking", the type of the object, and the current number being tracked. Here's an example:

```
(284): 8604ms SPX_DBG_TRACE_VERBOSE:  handle_table.h:90 TrackHandle type=Microsoft::CognitiveServices::Speech::Impl::ISpxRecognitionResult handle=0x0x7f688401e1a0, ptr=0x0x7f688401e1a0, total=19
```

A threshold can also be established if the current number of internal objects exceeds the threshold, and logging is enabled, a warning message will be logged. The warning message will contain a dump of all objects in existence and their count.

This threshold message is specified on a SpeechConfig object and is checked when new recognizers are created.
Taking the `SpeechConfig` as an example and assuming that you have created an instance called `config`:

```csharp
config.SetProperty("SPEECH-ObjectCountWarnThreshold", "10000");
```

```java
config.setProperty("SPEECH-ObjectCountWarnThreshold", "10000");
```

```C++
config->SetProperty("SPEECH-ObjectCountWarnThreshold", "10000");
```

```Python
speech_config.set_property_by_name(“SPEECH-ObjectCountWarnThreshold", "10000")?
```

```ObjectiveC
[config setPropertyTo:@"10000" byName:"SPEECH-ObjectCountWarnThreshold"];
```

The default value for this property is 10,000.

## Object Limits

In addition to logging, the Speech SDK can set a maximum number of internal objects that can be in existence. If this setting is used, once the maximum, future attempts to create Speech Recognition objects will fail, but existing  objects will continue to work.

This threshold message is specified on a SpeechConfig object and is checked when new recognizers are created.
Taking the `SpeechConfig` as an example and assuming that you have created an instance called `config`:

```csharp
config.SetProperty("SPEECH-ObjectCountErrorThreshold", "10000");
```

```java
config.setProperty("SPEECH-ObjectCountErrorThreshold", "10000");
```

```C++
config->SetProperty("SPEECH-ObjectCountErrorThreshold", "10000");
```

```Python
speech_config.set_property_by_name(“SPEECH-ObjectCountErrorThreshold", "10000")?
```

```objc
[config setPropertyTo:@"10000" byName:"SPEECH-ObjectCountErrorThreshold"];
```

The default value for this property is the platform-specific maximum value for a size_t data type.

A typical recognition will consume between 7 and 10 internal objects.

* [Get your Speech Services trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-dotnet-windows.md)