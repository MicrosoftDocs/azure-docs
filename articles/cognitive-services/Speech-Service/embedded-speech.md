---
title: Embedded Speech - Speech service
titleSuffix: Azure Cognitive Services
description: Embedded Speech is used for adding speech recognition to your embedded devices. It is designed to be used in scenarios where you want to recognize a limited set of commands. 
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 10/25/2022
ms.author: eur
zone_pivot_groups: programming-languages-set-thirteen
---

# Embedded Speech (preview)

Embedded Speech is a speech recognition feature that provides a simple, easy-to-use API for adding speech recognition to your embedded devices. It is designed to be used in scenarios where you want to recognize a limited set of commands, such as "turn on the lights" or "play music". It is not designed for scenarios where you want to recognize arbitrary sentences.

> [!NOTE]
> Embedded Speech is currently in public preview for C#, C++, and Java on the platforms listed below.

### Supported languages

The following SR models (25) are included:
`de-DE`,
`en-AU`,
`en-CA`,
`en-GB`,
`en-IE`,
`en-IN`,
`en-NZ`,
`en-US` (2),
`es-ES`,
`es-MX`,
`fr-CA`,
`fr-FR`,
`hi-IN`,
`it-IT`,
`ja-JP`,
`ko-KR`,
`nl-NL`,
`pt-BR`,
`ru-RU`,
`sv-SE`,
`tr-TR`,
`zh-CN`,
`zh-HK`,
`zh-TW`.

There are two variants of the en-US model, *full power* (FP) and *limited power* (LP). All the other SR models are full power. FP models provide recognition results with capitalization and punctuation added, and numbers, abbreviations, and other transformations applied. Because the (en-US) LP model requires less processing power, speech recognition runs faster with it.

At the moment complete word level detail (word timestamps and confidence) in SR results is only supported by FP models on Windows, Linux, and macOS.

The following TTS voices (2) are included: `en-US` (*JennyNeural*, female), `zh-CN` (*XiaoxiaoNeural*, female).

## Platform requirements

Refer to the general [Speech SDK installation requirements](https://learn.microsoft.com/azure/cognitive-services/speech-service/quickstarts/setup-platform) and samples in this package for programming language and target platform specific details.

**Choose your target environment**

# [Android](#tab/android)

Requires Android 7.0 (API level 24) or higher on ARM64 (`arm64-v8a`) or ARM32 (`armeabi-v7a`) hardware.

Embedded TTS with neural voices is not supported on ARM32.

# [Linux](#tab/linux)

Requires Linux on x64, ARM64, or ARM32 hardware with [supported Linux distributions](../quickstarts/setup-platform?tabs=linux).

Embedded speech is not supported on RHEL/CentOS 7.

Embedded TTS with neural voices is not supported on ARM32.

# [macOS](#tab/macos)

Requires 10.14 or newer on x64 or ARM64 hardware.

# [Windows](#tab/windows)

Requires Windows 10 or newer on x64 or ARM64 hardware.

The latest [Microsoft Visual C++ Redistributable for Visual Studio 2015-2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170) must be installed regardless of the programming language used with the Speech SDK.

The Speech SDK for Java does not support Windows on ARM64.

---

## Known issues - October 2022

* Embedded SR results may sometimes have punctuation seemingly missing or misplaced.
* Embedded SR (and IR) may run slower than real-time if the hardware is not powerful enough.
* The online part of hybrid TTS may stop working after installation of recent automated Windows updates. See https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1692 for the latest status.

## Configuration options

Create embedded (offline) configurations for speech recognition and speech synthesis.

::: zone pivot="programming-language-csharp"

```csharp
// Cloud speech configuration.
var speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion); 

// Optional language configuration for cloud speech services.       
speechConfig.SpeechRecognitionLanguage = "en-US";
speechConfig.SpeechSynthesisLanguage = "en-US";

// Embedded speech configuration for speech recognition and speech synthesis.
// Requires one or more paths to SR models or TTS voices.
List<string> paths = new List<string>();
paths.Add("C:\\dev\\embedded-speech\\sr-models");
paths.Add("C:\\dev\\embedded-speech\\tts-voices");
var embeddedSpeechConfig = EmbeddedSpeechConfig.FromPaths(paths.ToArray());

// You can combine cloud and embedded configurations via HybridSpeechConfig.
var hybridSpeechConfig = HybridSpeechConfig.FromConfigs(speechConfig, embeddedSpeechConfig);
```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
// Examples are coming soon
```

::: zone-end

::: zone pivot="programming-language-java"

```java
// Examples are coming soon
```

::: zone-end


## Next steps

- [Quickstart: Recognize and convert speech to text](get-started-speech-to-text.md)
- [Quickstart: Convert text to speech](get-started-text-to-speech.md)
