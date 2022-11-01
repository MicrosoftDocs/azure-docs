---
title: Embedded Speech - Speech service
titleSuffix: Azure Cognitive Services
description: Embedded Speech is designed for on-device scenarios where cloud connectivity is intermittent or unavailable.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 10/31/2022
ms.author: eur
zone_pivot_groups: programming-languages-set-thirteen
---

# Embedded Speech (preview)

Embedded Speech is designed for on-device [speech-to-text](speech-to-text.md) and [text-to-speech](text-to-speech.md) scenarios where cloud connectivity is intermittent or unavailable. For example, you can use embedded speech in medical equipment, a voice enabled air conditioning unit, or a car that might travel out of range. You can also develop hybrid cloud and offline solutions. For scenarios where your devices must be in a secure environment like a bank or government entity, you should first consider [disconnected containers](/azure/cognitive-services/containers/disconnected-containers). 

> [!IMPORTANT]
> Microsoft limits access to embedded speech. You can apply for access through the Azure Cognitive Services [embedded speech limited access review](https://aka.ms/csgate-embedded-speech). For more information, see [Limited access for embedded speech](/legal/cognitive-services/speech-service/embedded-speech/limited-access-embedded-speech?context=/azure/cognitive-services/speech-service/context/context).

## Platform requirements

Embedded speech is included with the Speech SDK (version 1.24.1 and higher) for C#, C++, and Java. Refer to the general [Speech SDK installation requirements](quickstarts/setup-platform.md) for programming language and target platform specific details.

**Choose your target environment**

# [Android](#tab/android)

Requires Android 7.0 (API level 24) or higher on ARM64 (`arm64-v8a`) or ARM32 (`armeabi-v7a`) hardware.

Embedded TTS with neural voices is only supported on ARM64.

# [Linux](#tab/linux)

Requires Linux on x64, ARM64, or ARM32 hardware with [supported Linux distributions](quickstarts/setup-platform.md?tabs=linux).

Embedded speech isn't supported on RHEL/CentOS 7.

Embedded TTS with neural voices isn't supported on ARM32.

# [macOS](#tab/macos)

Requires 10.14 or newer on x64 or ARM64 hardware.

# [Windows](#tab/windows)

Requires Windows 10 or newer on x64 or ARM64 hardware.

The latest [Microsoft Visual C++ Redistributable for Visual Studio 2015-2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) must be installed regardless of the programming language used with the Speech SDK.

The Speech SDK for Java doesn't support Windows on ARM64.

---

## Limitations

Embedded speech is only available with C#, C++, and Java SDKs. The other Speech SDKs, Speech CLI, and REST APIs don't support embedded speech.

Embedded speech recognition only supports mono 16 bit, 16-kHz PCM-encoded WAV audio. 

Embedded neural voices only support 24-kHz sample rate.

## Models and voices

For embedded speech, you'll need to download the speech recognition models for [speech-to-text](speech-to-text.md) and voices for [text-to-speech](text-to-speech.md). Instructions will be provided upon successful completion of the [limited access review](https://aka.ms/csgate-embedded-speech) process.

## Embedded speech configuration

For cloud connected applications, as shown in most Speech SDK samples, you use the `SpeechConfig` object with a Speech resource key and region. For embedded speech, you don't use a Speech resource. Instead of a cloud resource, you use the [models and voices](#models-and-voices) that you downloaded to your local device. 

Use the `EmbeddedSpeechConfig` object to set the location of the models or voices. If your application is used for both speech-to-text and text-to-speech, you can use the same `EmbeddedSpeechConfig` object to set the location of the models and voices. 

::: zone pivot="programming-language-csharp"

```csharp
// Provide the location of the models and voices.
List<string> paths = new List<string>();
paths.Add("C:\\dev\\embedded-speech\\stt-models");
paths.Add("C:\\dev\\embedded-speech\\tts-voices");
var embeddedSpeechConfig = EmbeddedSpeechConfig.FromPaths(paths.ToArray());

// For speech-to-text
embeddedSpeechConfig.SetSpeechRecognitionModel(
"Microsoft Speech Recognizer en-US FP Model V8", 
Environment.GetEnvironmentVariable("MODEL_KEY"));

// For text-to-speech
embeddedSpeechConfig.SetSpeechSynthesisVoice(
"Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)",
Environment.GetEnvironmentVariable("VOICE_KEY"));
embeddedSpeechConfig.SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm);
```

::: zone-end

::: zone pivot="programming-language-cpp"

> [!TIP]
> The `GetEnvironmentVariable` function is defined in the [speech-to-text quickstart](get-started-speech-to-text.md) and [text-to-speech quickstart](get-started-text-to-speech.md).

```cpp
// Provide the location of the models and voices.
vector<string> paths;
paths.push_back("C:\\dev\\embedded-speech\\stt-models");
paths.push_back("C:\\dev\\embedded-speech\\tts-voices");
var embeddedSpeechConfig = EmbeddedSpeechConfig::FromPaths(paths);

// For speech-to-text
embeddedSpeechConfig->SetSpeechRecognitionModel((
"Microsoft Speech Recognizer en-US FP Model V8", 
GetEnvironmentVariable("MODEL_KEY"));

// For text-to-speech
embeddedSpeechConfig->SetSpeechSynthesisVoice(
"Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)",
GetEnvironmentVariable("VOICE_KEY"));
embeddedSpeechConfig->SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat::Riff24Khz16BitMonoPcm);
```

::: zone-end

::: zone pivot="programming-language-java"

```java
// Provide the location of the models and voices.
List<String> paths = new ArrayList<>();
paths.add("C:\\dev\\embedded-speech\\stt-models");
paths.add("C:\\dev\\embedded-speech\\tts-voices");
var embeddedSpeechConfig = EmbeddedSpeechConfig.fromPaths(paths);

// For speech-to-text
embeddedSpeechConfig.setSpeechRecognitionModel(
"Microsoft Speech Recognizer en-US FP Model V8", 
System.getenv("MODEL_KEY"));

// For text-to-speech
embeddedSpeechConfig.setSpeechSynthesisVoice(
"Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)",
System.getenv("VOICE_KEY"));
embeddedSpeechConfig.setSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm);
```

::: zone-end

You can find ready to use embedded speech samples at [GitHub](https://aka.ms/csspeech/samples).

- [C# (.NET 6.0)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/csharp/dotnetcore/embedded-speech)
- [C# for Unity](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/csharp/unity/embedded-speech)
- [C++](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/cpp/embedded-speech)
- [Java (JRE)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/java/jre/embedded-speech)
- [Java for Android](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/java/android/embedded-speech)

## Hybrid speech

Hybrid speech with the `HybridSpeechConfig` object uses the cloud speech service by default and embedded speech as a fallback in case cloud connectivity is limited or slow.

With hybrid speech configuration for [speech-to-text](speech-to-text.md) (recognition models), embedded speech is used when connection to the cloud service fails after repeated attempts. Recognition may continue using the cloud service again if the connection is later resumed.

With hybrid speech configuration for [text-to-speech](text-to-speech.md) (voices), embedded and cloud synthesis are run in parallel and the result is selected based on which one gives a faster response. The best result is evaluated on each synthesis request.

## Cloud speech

For cloud speech, you use the `SpeechConfig` object, as shown in the [speech-to-text quickstart](get-started-speech-to-text.md) and [text-to-speech quickstart](get-started-text-to-speech.md). To run the quickstarts, you can replace `SpeechConfig` with `EmbeddedSpeechConfig` or `HybridSpeechConfig`. Most of the other speech recognition and synthesis code are the same, whether using cloud, embedded, or hybrid configuration.

## Next steps

- [Quickstart: Recognize and convert speech to text](get-started-speech-to-text.md)
- [Quickstart: Convert text to speech](get-started-text-to-speech.md)
