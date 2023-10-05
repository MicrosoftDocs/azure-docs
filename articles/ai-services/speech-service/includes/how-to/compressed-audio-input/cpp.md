---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/06/2020
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## GStreamer configuration

The Speech SDK can use [GStreamer](https://gstreamer.freedesktop.org) to handle compressed audio. For licensing reasons, GStreamer binaries aren't compiled and linked with the Speech SDK. You need to install some dependencies and plug-ins.  

GStreamer binaries must be in the system path so that they can be loaded by the Speech SDK at runtime. For example, on Windows, if the Speech SDK finds `libgstreamer-1.0-0.dll` or `gstreamer-1.0-0.dll` (for the latest GStreamer) during runtime, it means the GStreamer binaries are in the system path.

Choose a platform for installation instructions.

### [Linux](#tab/linux)

[!INCLUDE [Linux](gstreamer-linux.md)]

### [Windows](#tab/windows)

[!INCLUDE [Windows](gstreamer-windows.md)]

***

## Example

To configure the Speech SDK to accept compressed audio input, create `PullAudioInputStream` or `PushAudioInputStream`. Then, create an `AudioConfig` from an instance of your stream class that specifies the compression format of the stream. Find related sample code in [Speech SDK samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/speaker_recognition_samples.cpp).

Let's assume that you have an input stream class called `pushStream` and are using OPUS/OGG. Your code might look like this:

```cpp
using namespace Microsoft::CognitiveServices::Speech;
using namespace Microsoft::CognitiveServices::Speech::Audio;

// ... omitted for brevity

 auto config =
    SpeechConfig::FromSubscription(
        "YourSubscriptionKey",
        "YourServiceRegion"
    );

// Create an audio config specifying the compressed
// audio format and the instance of your input stream class.
auto pullStream = AudioInputStream::CreatePullStream(
    AudioStreamFormat::GetCompressedFormat(AudioStreamContainerFormat::OGG_OPUS));
auto audioConfig = AudioConfig::FromStreamInput(pullStream);

auto recognizer = SpeechRecognizer::FromConfig(config, audioConfig);
auto result = recognizer->RecognizeOnceAsync().get();

auto text = result->Text;
```
