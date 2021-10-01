---
title: Audio processing with Speech SDK - Speech service
titleSuffix: Azure Cognitive Services
description: An overview of the features, capabilities, and restrictions for audio processing using the Speech Software Development Kit (SDK).
services: cognitive-services
author: hasyashah
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/17/2021
ms.author: hasshah
ms.custom: devx-track-csharp
---

# Audio processing with Speech SDK

The Speech SDK integrates Microsoft Audio Stack (MAS), allowing any application or product to use its audio processing capabilities on input audio. The minimum requirements from [Minimum requirements to use Microsoft Audio Stack](audio-processing-overview.md#minimum-requirements-to-use-microsoft-audio-stack) apply.

Key features made available via Speech SDK APIs include:
* **Realtime microphone input & file input** - Microsoft Audio Stack processing can be applied to real-time microphone input, streams, and file-based input. 
* **Selection of enhancements** - To allow for full control of your scenario, the SDK allows you to disable individual enhancements like dereverberation, noise suppression, automatic gain control, and acoustic echo cancellation. For example, if your scenario does not include rendering output audio that needs to be suppressed from the input audio, you have the option to disable acoustic echo cancellation.
* **Custom microphone geometries** - The SDK allows you to provide your own custom microphone geometry information, in addition to supporting preset geometries like linear two-mic, linear four-mic, and circular 7-mic arrays.
* **Beamforming angles** - Specific beamforming angles can be provided to optimize audio input originating from a predetermined location, relative to the microphones.

Processing is performed fully locally where the Speech SDK is being used. No audio data is streamed to Microsoft’s cloud services for processing by the Microsoft Audio Stack. The only exception to this is for the Conversation Transcription Service, where raw audio is sent to Microsoft’s cloud services for processing. 

> [!NOTE]
> The Speech Devices SDK is now deprecated. Archived versions of the Speech Devices SDK are available here, with corresponding docs available here. All users of the Speech Devices SDK are advised to migrate to using Speech SDK v1.19 or newer. For migration information, see [Migrating from Speech Devices SDK](#migrating-from-speech-devices-sdk).

## Language and platform support

| Language   | Platform(s)    | Reference docs |
|------------|----------------|----------------|
| C++        | Windows, Linux |                |
| C#         | Windows, Linux |                |
| Java       | Windows, Linux |                |

## Sample code

### Using Microsoft Audio Stack with all default options

This sample shows how to use MAS with all default enhancement options on input from the device's default microphone.

#### [C#](#tab/csharp)

```csharp
SpeechConfig speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

AudioProcessingOptions processingOptions = AudioProcessingOptions.Create(AudioInputProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT);
AudioConfig audioConfig = AudioConfig.FromDefaultMicrophoneInput(processingOptions);

SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioConfig);
```

#### [C++](#tab/cpp)

```cpp
std::shared_ptr<SpeechConfig> speechConfig = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");

std::shared_ptr<AudioProcessingOptions> processingOptions = AudioProcessingOptions::Create(AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT);
std::shared_ptr<AudioConfig> audioConfig = AudioConfig::FromDefaultMicrophoneInput(processingOptions);

std::shared_ptr<SpeechRecognizer> recognizer = SpeechRecognizer::FromConfig(speechConfig, audioConfig);
```
---

### Using Microsoft Audio Stack with a preset microphone geometry

This sample shows how to use MAS with a predefined microphone geometry on a specified audio input device. In this example:
* **Enhancement options** - The default enhancements will be applied on the input audio stream.
* **Preset geometry** - The preset geometry represents a linear 2-microphone array.
* **Audio input device** - The audio input device id is `hw:0,1`. For more information on how to select an audio input device, see [How to: Select an audio input device with the Speech SDK](#how-to-select-audio-input-devices.md).

#### [C#](#tab/csharp)

```csharp
SpeechConfig speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

AudioProcessingOptions processingOptions = AudioProcessingOptions.Create(AudioInputProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, PresetMicrophoneArrayGeometry.Linear2);
AudioConfig audioConfig = AudioConfig.FromMicrophoneInput("hw:0,1", processingOptions);

SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioConfig);
```

#### [C++](#tab/cpp)

```cpp
std::shared_ptr<SpeechConfig> speechConfig = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");

std::shared_ptr<AudioProcessingOptions> processingOptions = AudioProcessingOptions::Create(AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, PresetMicrophoneArrayGeometry::Linear2);
std::shared_ptr<AudioConfig> audioConfig = AudioConfig::FromMicrophoneInput("hw:0,1", processingOptions);

std::shared_ptr<SpeechRecognizer> recognizer = SpeechRecognizer::FromConfig(speechConfig, audioConfig);
```
---

### Using Microsoft Audio Stack with custom microphone geometry

This sample shows how to use MAS with a custom microphone geometry on a specified audio input device. In this example:
* **Enhancement options** - The default enhancements will be applied on the input audio stream.
* **Custom geometry** - A custom microphone geometry for a 4-microphone array is provided by specifying the microphone coordinates.
* **Audio input device** - The audio input device id is `hw:0,1`. For more information on how to select an audio input device, see [How to: Select an audio input device with the Speech SDK](#how-to-select-audio-input-devices.md).

#### [C#](#tab/csharp)

```csharp
SpeechConfig speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

MicrophoneCoordinates[] microphoneCoordinates = new MicrophoneCoordinates[4]
{
    new MicrophoneCoordinates(0, 42, 0),
    new MicrophoneCoordinates(42, 0, 0),
    new MicrophoneCoordinates(0, -42, 0),
    new MicrophoneCoordinates(-42, 0, 0)
};
MicrophoneArrayGeometry microphoneArrayGeometry = new MicrophoneArrayGeometry(MicrophoneArrayType.Planar, microphoneCoordinates);
AudioProcessingOptions processingOptions = AudioProcessingOptions.Create(AudioInputProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, microphoneArrayGeometry, SpeakerReferenceChannel.LastChannel);
AudioConfig audioConfig = AudioConfig.FromMicrophoneInput("hw:0,1", processingOptions);

SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioConfig);
```

#### [C++](#tab/cpp)

```cpp
std::shared_ptr<SpeechConfig> speechConfig = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");

MicrophoneArrayGeometry microphoneArrayGeometry
{
    MicrophoneArrayType::Planar,
    { { 0, 42, 0 }, { 42, 0, 0 }, { 0, -42, 0 }, { -42, 0, 0 } }
};
std::shared_ptr<AudioProcessingOptions> processingOptions = AudioProcessingOptions::Create(AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, microphoneArrayGeometry, SpeakerReferenceChannel::LastChannel);
std::shared_ptr<AudioConfig> audioConfig = AudioConfig::FromMicrophoneInput("hw:0,1", processingOptions);

std::shared_ptr<SpeechRecognizer> recognizer = SpeechRecognizer::FromConfig(speechConfig, audioConfig);
```
---

### Using Microsoft Audio Stack with select enhancements

This sample shows how to use MAS with a custom set of enhancements on the input audio. In this example:
* **Enhancement options** - All default enhancements will be applied on the input audio stream except echo cancellation.
* **Audio input device** - The audio input device is the default microphone of the device.

#### [C#](#tab/csharp)

```csharp
SpeechConfig speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

AudioProcessingOptions processingOptions = AudioProcessingOptions.Create(AudioInputProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT | AudioProcessingOptions.AUDIO_INPUT_PROCESSING_DISABLE_ECHO_CANCELLATION);
AudioConfig audioConfig = AudioConfig.FromDefaultMicrophoneInput(processingOptions);

SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioConfig);
```

#### [C++](#tab/cpp)

```cpp
std::shared_ptr<SpeechConfig> speechConfig = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");

std::shared_ptr<AudioProcessingOptions> processingOptions = AudioProcessingOptions::Create(AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT | AUDIO_INPUT_PROCESSING_DISABLE_ECHO_CANCELLATION);
std::shared_ptr<AudioConfig> audioConfig = AudioConfig::FromDefaultMicrophoneInput(processingOptions);

std::shared_ptr<SpeechRecognizer> recognizer = SpeechRecognizer::FromConfig(speechConfig, audioConfig);
```
---

### Using Microsoft Audio Stack to specify beamforming angles

#### [C#](#tab/csharp)

```csharp
SpeechConfig speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

MicrophoneCoordinates[] microphoneCoordinates = new MicrophoneCoordinates[4]
{
    new MicrophoneCoordinates(-60, 0, 0),
    new MicrophoneCoordinates(-20, 0, 0),
    new MicrophoneCoordinates(20, 0, 0),
    new MicrophoneCoordinates(60, 0, 0)
};
MicrophoneArrayGeometry microphoneArrayGeometry = new MicrophoneArrayGeometry(MicrophoneArrayType.Linear, 70, 110, microphoneCoordinates);
AudioProcessingOptions processingOptions = AudioProcessingOptions.Create(AudioInputProcessingConstants.AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, microphoneArrayGeometry, SpeakerReferenceChannel.LastChannel);
PushAudioInputStream pushStream = AudioInputStream.CreatePushStream();
AudioConfig audioInput = AudioConfig.FromStreamInput(pushStream, processingOptions);

SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioInput);
```

#### [C++](#tab/cpp)

```cpp
std::shared_ptr<SpeechConfig> speechConfig = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");

MicrophoneArrayGeometry microphoneArrayGeometry
{
    MicrophoneArrayType::Linear,
    70,
    110,
    { { -60, 0, 0 }, { -20, 0, 0 }, { 20, 0, 0 }, { 60, 0, 0 } }
};
std::shared_ptr<AudioProcessingOptions> processingOptions = AudioProcessingOptions::Create(AUDIO_INPUT_PROCESSING_ENABLE_DEFAULT, microphoneArrayGeometry, SpeakerReferenceChannel::LastChannel);
std::shared_ptr<PushAudioInputStream> pushStream = AudioInputStream::CreatePushStream();
std::shared_ptr<AudioConfig> audioInput = AudioConfig::FromStreamInput(pushStream, processingOptions);

std::shared_ptr<SpeechRecognizer> recognizer = SpeechRecognizer::FromConfig(speechConfig, audioInput);
```
---

## Migrating from Speech Devices SDK

