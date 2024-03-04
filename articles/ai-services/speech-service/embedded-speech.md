---
title: Embedded Speech - Speech service
titleSuffix: Azure AI services
description: Embedded Speech is designed for on-device scenarios where cloud connectivity is intermittent or unavailable.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.custom: devx-track-extended-java
ms.topic: how-to
ms.date: 10/31/2022
ms.author: eur
zone_pivot_groups: programming-languages-set-thirteen
---

# Embedded Speech (preview)

Embedded Speech is designed for on-device [speech to text](speech-to-text.md) and [text to speech](text-to-speech.md) scenarios where cloud connectivity is intermittent or unavailable. For example, you can use embedded speech in industrial equipment, a voice enabled air conditioning unit, or a car that might travel out of range. You can also develop hybrid cloud and offline solutions. For scenarios where your devices must be in a secure environment like a bank or government entity, you should first consider [disconnected containers](../containers/disconnected-containers.md). 

> [!IMPORTANT]
> Microsoft limits access to embedded speech. You can apply for access through the Azure AI Speech [embedded speech limited access review](https://aka.ms/csgate-embedded-speech). For more information, see [Limited access for embedded speech](/legal/cognitive-services/speech-service/embedded-speech/limited-access-embedded-speech?context=/azure/ai-services/speech-service/context/context).

## Platform requirements

Embedded speech is included with the Speech SDK (version 1.24.1 and higher) for C#, C++, and Java. Refer to the general [Speech SDK installation requirements](#embedded-speech-sdk-packages) for programming language and target platform specific details.

**Choose your target environment**

# [Android](#tab/android-target)

Requires Android 7.0 (API level 24) or higher on ARM64 (`arm64-v8a`) or ARM32 (`armeabi-v7a`) hardware.

Embedded TTS with neural voices is only supported on ARM64.

# [Linux](#tab/linux-target)

Requires Linux on x64, ARM64, or ARM32 hardware with [supported Linux distributions](quickstarts/setup-platform.md?tabs=linux).

Embedded speech isn't supported on RHEL/CentOS 7.

Embedded TTS with neural voices isn't supported on ARM32.

# [macOS](#tab/macos-target)

Requires 10.14 or newer on x64 or ARM64 hardware.

# [Windows](#tab/windows-target)

Requires Windows 10 or newer on x64 or ARM64 hardware.

The latest [Microsoft Visual C++ Redistributable for Visual Studio 2015-2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) must be installed regardless of the programming language used with the Speech SDK.

The Speech SDK for Java doesn't support Windows on ARM64.

---

## Limitations

Embedded speech is only available with C#, C++, and Java SDKs. The other Speech SDKs, Speech CLI, and REST APIs don't support embedded speech.

Embedded speech recognition only supports mono 16 bit, 8-kHz or 16-kHz PCM-encoded WAV audio.

Embedded neural voices only support 24-kHz sample rate.

## Embedded speech SDK packages

::: zone pivot="programming-language-csharp"

For C# embedded applications, install following Speech SDK for C# packages:

|Package  |Description  |
| --------- | --------- |
|[Microsoft.CognitiveServices.Speech](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech)|Required to use the Speech SDK|
| [Microsoft.CognitiveServices.Speech.Extension.Embedded.SR](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech.Extension.Embedded.SR) | Required for embedded speech recognition |
| [Microsoft.CognitiveServices.Speech.Extension.Embedded.TTS](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech.Extension.Embedded.TTS) | Required for embedded speech synthesis |
| [Microsoft.CognitiveServices.Speech.Extension.ONNX.Runtime](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech.Extension.ONNX.Runtime) | Required for embedded speech recognition and synthesis |
| [Microsoft.CognitiveServices.Speech.Extension.Telemetry](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech.Extension.Telemetry) | Required for embedded speech recognition and synthesis |

::: zone-end

::: zone pivot="programming-language-cpp"

For C++ embedded applications, install following Speech SDK for C++ packages:

|Package  |Description  |
| --------- | --------- |
|[Microsoft.CognitiveServices.Speech](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech)|Required to use the Speech SDK|
| [Microsoft.CognitiveServices.Speech.Extension.Embedded.SR](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech.Extension.Embedded.SR) | Required for embedded speech recognition |
| [Microsoft.CognitiveServices.Speech.Extension.Embedded.TTS](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech.Extension.Embedded.TTS) | Required for embedded speech synthesis |
| [Microsoft.CognitiveServices.Speech.Extension.ONNX.Runtime](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech.Extension.ONNX.Runtime) | Required for embedded speech recognition and synthesis |
| [Microsoft.CognitiveServices.Speech.Extension.Telemetry](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech.Extension.Telemetry) | Required for embedded speech recognition and synthesis |


::: zone-end

::: zone pivot="programming-language-java"

**Choose your target environment**

# [Java Runtime](#tab/jre)

For Java embedded applications, add [client-sdk-embedded](https://mvnrepository.com/artifact/com.microsoft.cognitiveservices.speech/client-sdk-embedded) (`.jar`) as a dependency. This package supports cloud, embedded, and hybrid speech.

> [!IMPORTANT]
> Don't add [client-sdk](https://mvnrepository.com/artifact/com.microsoft.cognitiveservices.speech/client-sdk) in the same project, since it supports only cloud speech services.

Follow these steps to install the Speech SDK for Java using Apache Maven:

1. Install [Apache Maven](https://maven.apache.org/install.html).
1. Open a command prompt where you want the new project, and create a new `pom.xml` file. 
1. Copy the following XML content into `pom.xml`:
    ```xml
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <groupId>com.microsoft.cognitiveservices.speech.samples</groupId>
        <artifactId>quickstart-eclipse</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <build>
            <sourceDirectory>src</sourceDirectory>
            <plugins>
            <plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.7.0</version>
                <configuration>
                <source>1.8</source>
                <target>1.8</target>
                </configuration>
            </plugin>
            </plugins>
        </build>
        <dependencies>
            <dependency>
            <groupId>com.microsoft.cognitiveservices.speech</groupId>
            <artifactId>client-sdk-embedded</artifactId>
            <version>1.31.0</version>
            </dependency>
        </dependencies>
    </project>
    ```
1. Run the following Maven command to install the Speech SDK and dependencies.
    ```console
    mvn clean dependency:copy-dependencies
    ```

# [Android](#tab/android)

For Java embedded applications, add [client-sdk-embedded](https://mvnrepository.com/artifact/com.microsoft.cognitiveservices.speech/client-sdk-embedded) (`.aar`) as a dependency. This package supports cloud, embedded, and hybrid speech.

> [!IMPORTANT]
> Don't add [client-sdk](https://mvnrepository.com/artifact/com.microsoft.cognitiveservices.speech/client-sdk) in the same project, since it supports only cloud speech services.

Be sure to use the `@aar` suffix when the dependency is specified in `build.gradle`. Here's an example:

```
dependencies {
    implementation 'com.microsoft.cognitiveservices.speech:client-sdk-embedded:1.31.0@aar'
}
```
::: zone-end


## Models and voices

For embedded speech, you'll need to download the speech recognition models for [speech to text](speech-to-text.md) and voices for [text to speech](text-to-speech.md). Instructions will be provided upon successful completion of the [limited access review](https://aka.ms/csgate-embedded-speech) process.

The following [speech to text](speech-to-text.md) models are available: de-DE, en-AU, en-CA, en-GB, en-IE, en-IN, en-NZ, en-US, es-ES, es-MX, fr-CA, fr-FR, hi-IN, it-IT, ja-JP, ko-KR, nl-NL, pt-BR, ru-RU, sv-SE, tr-TR, zh-CN, zh-HK, and zh-TW.

The following [text to speech](text-to-speech.md) locales and voices are available:

| Locale (BCP-47) | Language | Text to speech voices |
| ----- | ----- | ----- |
| `de-DE` | German (Germany) | `de-DE-KatjaNeural` (Female)<br/>`de-DE-ConradNeural` (Male)|
| `en-AU` | English (Australia) | `en-AU-AnnetteNeural` (Female)<br/>`en-AU-WilliamNeural` (Male)|
| `en-CA` | English (Canada) | `en-CA-ClaraNeural` (Female)<br/>`en-CA-LiamNeural` (Male)|
| `en-GB` | English (United Kingdom) | `en-GB-LibbyNeural` (Female)<br/>`en-GB-RyanNeural` (Male)|
| `en-US` | English (United States) | `en-US-AriaNeural` (Female)<br/>`en-US-GuyNeural` (Male)<br/>`en-US-JennyNeural` (Female)|
| `es-ES` | Spanish (Spain) | `es-ES-ElviraNeural` (Female)<br/>`es-ES-AlvaroNeural` (Male)|
| `es-MX` | Spanish (Mexico) | `es-MX-DaliaNeural` (Female)<br/>`es-MX-JorgeNeural` (Male)|
| `fr-CA` | French (Canada) | `fr-CA-SylvieNeural` (Female)<br/>`fr-CA-JeanNeural` (Male)|
| `fr-FR` | French (France) | `fr-FR-DeniseNeural` (Female)<br/>`fr-FR-HenriNeural` (Male)|
| `it-IT` | Italian (Italy) | `it-IT-IsabellaNeural` (Female)<br/>`it-IT-DiegoNeural` (Male)|
| `ja-JP` | Japanese (Japan) | `ja-JP-NanamiNeural` (Female)<br/>`ja-JP-KeitaNeural` (Male)|
| `ko-KR` | Korean (Korea) | `ko-KR-SunHiNeural` (Female)<br/>`ko-KR-InJoonNeural` (Male)|
| `pt-BR` | Portuguese (Brazil) | `pt-BR-FranciscaNeural` (Female)<br/>`pt-BR-AntonioNeural` (Male)|
| `zh-CN` | Chinese (Mandarin, Simplified) | `zh-CN-XiaoxiaoNeural` (Female)<br/>`zh-CN-YunxiNeural` (Male)|

## Embedded speech configuration

For cloud connected applications, as shown in most Speech SDK samples, you use the `SpeechConfig` object with a Speech resource key and region. For embedded speech, you don't use a Speech resource. Instead of a cloud resource, you use the [models and voices](#models-and-voices) that you downloaded to your local device. 

Use the `EmbeddedSpeechConfig` object to set the location of the models or voices. If your application is used for both speech to text and text to speech, you can use the same `EmbeddedSpeechConfig` object to set the location of the models and voices. 

::: zone pivot="programming-language-csharp"

```csharp
// Provide the location of the models and voices.
List<string> paths = new List<string>();
paths.Add("C:\\dev\\embedded-speech\\stt-models");
paths.Add("C:\\dev\\embedded-speech\\tts-voices");
var embeddedSpeechConfig = EmbeddedSpeechConfig.FromPaths(paths.ToArray());

// For speech to text
embeddedSpeechConfig.SetSpeechRecognitionModel(
    "Microsoft Speech Recognizer en-US FP Model V8", 
    Environment.GetEnvironmentVariable("MODEL_KEY"));

// For text to speech
embeddedSpeechConfig.SetSpeechSynthesisVoice(
    "Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)",
    Environment.GetEnvironmentVariable("VOICE_KEY"));
embeddedSpeechConfig.SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm);
```
::: zone-end

::: zone pivot="programming-language-cpp"

> [!TIP]
> The `GetEnvironmentVariable` function is defined in the [speech to text quickstart](get-started-speech-to-text.md) and [text to speech quickstart](get-started-text-to-speech.md).

```cpp
// Provide the location of the models and voices.
vector<string> paths;
paths.push_back("C:\\dev\\embedded-speech\\stt-models");
paths.push_back("C:\\dev\\embedded-speech\\tts-voices");
auto embeddedSpeechConfig = EmbeddedSpeechConfig::FromPaths(paths);

// For speech to text
embeddedSpeechConfig->SetSpeechRecognitionModel((
    "Microsoft Speech Recognizer en-US FP Model V8", 
    GetEnvironmentVariable("MODEL_KEY"));

// For text to speech
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

// For speech to text
embeddedSpeechConfig.setSpeechRecognitionModel(
    "Microsoft Speech Recognizer en-US FP Model V8", 
    System.getenv("MODEL_KEY"));

// For text to speech
embeddedSpeechConfig.setSpeechSynthesisVoice(
    "Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)",
    System.getenv("VOICE_KEY"));
embeddedSpeechConfig.setSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm);
```

::: zone-end


## Embedded speech code samples

::: zone pivot="programming-language-csharp"

You can find ready to use embedded speech samples at [GitHub](https://aka.ms/embedded-speech-samples). For remarks on projects from scratch, see samples specific documentation:

- [C# (.NET 6.0)](https://aka.ms/embedded-speech-samples-csharp)
- [C# (.NET MAUI)](https://aka.ms/embedded-speech-samples-csharp-maui)
- [C# for Unity](https://aka.ms/embedded-speech-samples-csharp-unity)
::: zone-end

::: zone pivot="programming-language-cpp"

You can find ready to use embedded speech samples at [GitHub](https://aka.ms/embedded-speech-samples). For remarks on projects from scratch, see samples specific documentation:
- [C++](https://aka.ms/embedded-speech-samples-cpp)
::: zone-end

::: zone pivot="programming-language-java"

You can find ready to use embedded speech samples at [GitHub](https://aka.ms/embedded-speech-samples). For remarks on projects from scratch, see samples specific documentation:
- [Java (JRE)](https://aka.ms/embedded-speech-samples-java)
- [Java for Android](https://aka.ms/embedded-speech-samples-java-android)
::: zone-end

## Hybrid speech

Hybrid speech with the `HybridSpeechConfig` object uses the cloud speech service by default and embedded speech as a fallback in case cloud connectivity is limited or slow.

With hybrid speech configuration for [speech to text](speech-to-text.md) (recognition models), embedded speech is used when connection to the cloud service fails after repeated attempts. Recognition may continue using the cloud service again if the connection is later resumed.

With hybrid speech configuration for [text to speech](text-to-speech.md) (voices), embedded and cloud synthesis are run in parallel and the result is selected based on which one gives a faster response. The best result is evaluated on each synthesis request.

## Cloud speech

For cloud speech, you use the `SpeechConfig` object, as shown in the [speech to text quickstart](get-started-speech-to-text.md) and [text to speech quickstart](get-started-text-to-speech.md). To run the quickstarts for embedded speech, you can replace `SpeechConfig` with `EmbeddedSpeechConfig` or `HybridSpeechConfig`. Most of the other speech recognition and synthesis code are the same, whether using cloud, embedded, or hybrid configuration.


## Next steps

- [Read about text to speech on devices for disconnected and hybrid scenarios](https://techcommunity.microsoft.com/t5/ai-cognitive-services-blog/azure-neural-tts-now-available-on-devices-for-disconnected-and/ba-p/3716797)
- [Limited Access to embedded Speech](/legal/cognitive-services/speech-service/embedded-speech/limited-access-embedded-speech?context=/azure/ai-services/speech-service/context/context)
