---
title: Use the Microsoft Audio Stack (MAS) - Speech service
titleSuffix: Azure AI services
description: An overview of the features, capabilities, and restrictions for audio processing using the Speech Software Development Kit (SDK).
author: hasyashah
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 09/16/2022
ms.author: hasshah
ms.devlang: cpp, csharp, java
ms.custom: devx-track-csharp, ignite-fall-2021
---

# Use the Microsoft Audio Stack (MAS)

The Speech SDK integrates Microsoft Audio Stack (MAS), allowing any application or product to use its audio processing capabilities on input audio. See the [Audio processing](audio-processing-overview.md) documentation for an overview.

In this article, you learn how to use the Microsoft Audio Stack (MAS) with the Speech SDK.

> [!IMPORTANT]
> On Speech SDK for C++ and C# v1.33.0 and newer, the `Microsoft.CognitiveServices.Speech.Extension.MAS` package must be installed to use the Microsoft Audio Stack on Windows, and on Linux if you install the Speech SDK using NuGet.

## Default options

This sample shows how to use MAS with all default enhancement options on input from the device's default microphone.

### [C#](#tab/csharp)

```csharp
var speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

var audioProcessingOptions = AudioProcessingOptions.Create(AudioProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT);
var audioInput = AudioConfig.FromDefaultMicrophoneInput(audioProcessingOptions);

var recognizer = new SpeechRecognizer(speechConfig, audioInput);
```

### [C++](#tab/cpp)

```cpp
auto speechConfig = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");

auto audioProcessingOptions = AudioProcessingOptions::Create(AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT);
auto audioInput = AudioConfig::FromDefaultMicrophoneInput(audioProcessingOptions);

auto recognizer = SpeechRecognizer::FromConfig(speechConfig, audioInput);
```

### [Java](#tab/java)

```java
SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "YourServiceRegion");

AudioProcessingOptions audioProcessingOptions = AudioProcessingOptions.create(AudioProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT);
AudioConfig audioInput = AudioConfig.fromDefaultMicrophoneInput(audioProcessingOptions);

SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioInput);
```
---

## Preset microphone geometry

This sample shows how to use MAS with a predefined microphone geometry on a specified audio input device. In this example:
* **Enhancement options** - The default enhancements are applied on the input audio stream.
* **Preset geometry** - The preset geometry represents a linear 2-microphone array.
* **Audio input device** - The audio input device ID is `hw:0,1`. For more information on how to select an audio input device, see [How to: Select an audio input device with the Speech SDK](how-to-select-audio-input-devices.md).

### [C#](#tab/csharp)

```csharp
var speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

var audioProcessingOptions = AudioProcessingOptions.Create(AudioProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, PresetMicrophoneArrayGeometry.Linear2);
var audioInput = AudioConfig.FromMicrophoneInput("hw:0,1", audioProcessingOptions);

var recognizer = new SpeechRecognizer(speechConfig, audioInput);
```

### [C++](#tab/cpp)

```cpp
auto speechConfig = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");

auto audioProcessingOptions = AudioProcessingOptions::Create(AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, PresetMicrophoneArrayGeometry::Linear2);
auto audioInput = AudioConfig::FromMicrophoneInput("hw:0,1", audioProcessingOptions);

auto recognizer = SpeechRecognizer::FromConfig(speechConfig, audioInput);
```

### [Java](#tab/java)

```java
SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "YourServiceRegion");

AudioProcessingOptions audioProcessingOptions = AudioProcessingOptions.create(AudioProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, PresetMicrophoneArrayGeometry.Linear2);
AudioConfig audioInput = AudioConfig.fromMicrophoneInput("hw:0,1", audioProcessingOptions);

SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioInput);
```
---

## Custom microphone geometry

This sample shows how to use MAS with a custom microphone geometry on a specified audio input device. In this example:
* **Enhancement options** - The default enhancements will be applied on the input audio stream.
* **Custom geometry** - A custom microphone geometry for a 7-microphone array is provided via the microphone coordinates. The units for coordinates are millimeters.
* **Audio input** - The audio input is from a file, where the audio within the file is expected from an audio input device corresponding to the custom geometry specified. 

### [C#](#tab/csharp)

```csharp
var speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

MicrophoneCoordinates[] microphoneCoordinates = new MicrophoneCoordinates[7]
{
    new MicrophoneCoordinates(0, 0, 0),
    new MicrophoneCoordinates(40, 0, 0),
    new MicrophoneCoordinates(20, -35, 0),
    new MicrophoneCoordinates(-20, -35, 0),
    new MicrophoneCoordinates(-40, 0, 0),
    new MicrophoneCoordinates(-20, 35, 0),
    new MicrophoneCoordinates(20, 35, 0)
};
var microphoneArrayGeometry = new MicrophoneArrayGeometry(MicrophoneArrayType.Planar, microphoneCoordinates);
var audioProcessingOptions = AudioProcessingOptions.Create(AudioProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, microphoneArrayGeometry, SpeakerReferenceChannel.LastChannel);
var audioInput = AudioConfig.FromWavFileInput("katiesteve.wav", audioProcessingOptions);

var recognizer = new SpeechRecognizer(speechConfig, audioInput);
```

### [C++](#tab/cpp)

```cpp
auto speechConfig = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");

MicrophoneArrayGeometry microphoneArrayGeometry
{
    MicrophoneArrayType::Planar,
    { { 0, 0, 0 }, { 40, 0, 0 }, { 20, -35, 0 }, { -20, -35, 0 }, { -40, 0, 0 }, { -20, 35, 0 }, { 20, 35, 0 } }
};
auto audioProcessingOptions = AudioProcessingOptions::Create(AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, microphoneArrayGeometry, SpeakerReferenceChannel::LastChannel);
auto audioInput = AudioConfig::FromWavFileInput("katiesteve.wav", audioProcessingOptions);

auto recognizer = SpeechRecognizer::FromConfig(speechConfig, audioInput);
```

### [Java](#tab/java)

```java
SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "YourServiceRegion");

MicrophoneCoordinates[] microphoneCoordinates = new MicrophoneCoordinates[7];
microphoneCoordinates[0] = new MicrophoneCoordinates(0, 0, 0);
microphoneCoordinates[1] = new MicrophoneCoordinates(40, 0, 0);
microphoneCoordinates[2] = new MicrophoneCoordinates(20, -35, 0);
microphoneCoordinates[3] = new MicrophoneCoordinates(-20, -35, 0);
microphoneCoordinates[4] = new MicrophoneCoordinates(-40, 0, 0);
microphoneCoordinates[5] = new MicrophoneCoordinates(-20, 35, 0);
microphoneCoordinates[6] = new MicrophoneCoordinates(20, 35, 0);
MicrophoneArrayGeometry microphoneArrayGeometry = new MicrophoneArrayGeometry(MicrophoneArrayType.Planar, microphoneCoordinates);
AudioProcessingOptions audioProcessingOptions = AudioProcessingOptions.create(AudioProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, microphoneArrayGeometry, SpeakerReferenceChannel.LastChannel);
AudioConfig audioInput = AudioConfig.fromWavFileInput("katiesteve.wav", audioProcessingOptions);

SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioInput);
```
---

## Select enhancements

This sample shows how to use MAS with a custom set of enhancements on the input audio. By default, all enhancements are enabled but there are options to disable dereverberation, noise suppression, automatic gain control, and echo cancellation individually by using `AudioProcessingOptions`.

In this example:
* **Enhancement options** - Echo cancellation and noise suppression will be disabled, while all other enhancements remain enabled.
* **Audio input device** - The audio input device is the default microphone of the device.

### [C#](#tab/csharp)

```csharp
var speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

var audioProcessingOptions = AudioProcessingOptions.Create(AudioProcessingConstants.AUDIO_INPUT_PROCESSING_DISABLE_ECHO_CANCELLATION | AudioProcessingConstants.AUDIO_INPUT_PROCESSING_DISABLE_NOISE_SUPPRESSION | AudioProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT);
var audioInput = AudioConfig.FromDefaultMicrophoneInput(audioProcessingOptions);

var recognizer = new SpeechRecognizer(speechConfig, audioInput);
```

### [C++](#tab/cpp)

```cpp
auto speechConfig = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");

auto audioProcessingOptions = AudioProcessingOptions::Create(AUDIO_INPUT_PROCESSING_DISABLE_ECHO_CANCELLATION | AUDIO_INPUT_PROCESSING_DISABLE_NOISE_SUPPRESSION | AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT);
auto audioInput = AudioConfig::FromDefaultMicrophoneInput(audioProcessingOptions);

auto recognizer = SpeechRecognizer::FromConfig(speechConfig, audioInput);
```

### [Java](#tab/java)

```java
SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "YourServiceRegion");

AudioProcessingOptions audioProcessingOptions = AudioProcessingOptions.create(AudioProcessingConstants.AUDIO_INPUT_PROCESSING_DISABLE_ECHO_CANCELLATION | AudioProcessingConstants.AUDIO_INPUT_PROCESSING_DISABLE_NOISE_SUPPRESSION | AudioProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT);
AudioConfig audioInput = AudioConfig.fromDefaultMicrophoneInput(audioProcessingOptions);

SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioInput);
```
---

## Specify beamforming angles

This sample shows how to use MAS with a custom microphone geometry and beamforming angles on a specified audio input device. In this example:
* **Enhancement options** - The default enhancements will be applied on the input audio stream.
* **Custom geometry** - A custom microphone geometry for a 4-microphone array is provided by specifying the microphone coordinates. The units for coordinates are millimeters.
* **Beamforming angles** - Beamforming angles are specified to optimize for audio originating in that range. The units for angles are degrees. In the sample code below, the start angle is set to 70 degrees and the end angle is set to 110 degrees.
* **Audio input** - The audio input is from a push stream, where the audio within the stream is expected from an audio input device corresponding to the custom geometry specified. 

### [C#](#tab/csharp)

```csharp
var speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

MicrophoneCoordinates[] microphoneCoordinates = new MicrophoneCoordinates[4]
{
    new MicrophoneCoordinates(-60, 0, 0),
    new MicrophoneCoordinates(-20, 0, 0),
    new MicrophoneCoordinates(20, 0, 0),
    new MicrophoneCoordinates(60, 0, 0)
};
var microphoneArrayGeometry = new MicrophoneArrayGeometry(MicrophoneArrayType.Linear, 70, 110, microphoneCoordinates);
var audioProcessingOptions = AudioProcessingOptions.Create(AudioProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, microphoneArrayGeometry, SpeakerReferenceChannel.LastChannel);
var pushStream = AudioInputStream.CreatePushStream();
var audioInput = AudioConfig.FromStreamInput(pushStream, audioProcessingOptions);

var recognizer = new SpeechRecognizer(speechConfig, audioInput);
```

### [C++](#tab/cpp)

```cpp
auto speechConfig = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");

MicrophoneArrayGeometry microphoneArrayGeometry
{
    MicrophoneArrayType::Linear,
    70,
    110,
    { { -60, 0, 0 }, { -20, 0, 0 }, { 20, 0, 0 }, { 60, 0, 0 } }
};
auto audioProcessingOptions = AudioProcessingOptions::Create(AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, microphoneArrayGeometry, SpeakerReferenceChannel::LastChannel);
auto pushStream = AudioInputStream::CreatePushStream();
auto audioInput = AudioConfig::FromStreamInput(pushStream, audioProcessingOptions);

auto recognizer = SpeechRecognizer::FromConfig(speechConfig, audioInput);
```

### [Java](#tab/java)

```java
SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "YourServiceRegion");

MicrophoneCoordinates[] microphoneCoordinates = new MicrophoneCoordinates[4];
microphoneCoordinates[0] = new MicrophoneCoordinates(-60, 0, 0);
microphoneCoordinates[1] = new MicrophoneCoordinates(-20, 0, 0);
microphoneCoordinates[2] = new MicrophoneCoordinates(20, 0, 0);
microphoneCoordinates[3] = new MicrophoneCoordinates(60, 0, 0);
MicrophoneArrayGeometry microphoneArrayGeometry = new MicrophoneArrayGeometry(MicrophoneArrayType.Planar, 70, 110, microphoneCoordinates);
AudioProcessingOptions audioProcessingOptions = AudioProcessingOptions.create(AudioProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, microphoneArrayGeometry, SpeakerReferenceChannel.LastChannel);
PushAudioInputStream pushStream = AudioInputStream.createPushStream();
AudioConfig audioInput = AudioConfig.fromStreamInput(pushStream, audioProcessingOptions);

SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioInput);
```
---

## Reference channel for echo cancellation

Microsoft Audio Stack requires the reference channel (also known as loopback channel) to perform echo cancellation. The source of the reference channel varies by platform:
* **Windows** - The reference channel is automatically gathered by the Speech SDK if the `SpeakerReferenceChannel::LastChannel` option is provided when creating `AudioProcessingOptions`.
* **Linux** - ALSA (Advanced Linux Sound Architecture) must be configured to provide the reference audio stream as the last channel for the audio input device used. ALSA is configured in addition to providing the `SpeakerReferenceChannel::LastChannel` option when creating `AudioProcessingOptions`.

## Language and platform support

| Language   | Platform    | Reference docs |
|------------|----------------|----------------|
| C++        | Windows, Linux | [C++ docs](/cpp/cognitive-services/speech/) |
| C#         | Windows, Linux | [C# docs](/dotnet/api/microsoft.cognitiveservices.speech) |
| Java       | Windows, Linux | [Java docs](/java/api/com.microsoft.cognitiveservices.speech) |

## Next steps
[Setup development environment](quickstarts/setup-platform.md)
