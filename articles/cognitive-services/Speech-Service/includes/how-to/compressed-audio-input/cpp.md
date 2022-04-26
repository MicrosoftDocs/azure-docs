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

Choose a platform for installation instructions.

### [Linux](#tab/linux)

[!INCLUDE [Linux](gstreamer-linux.md)]

### [Windows](#tab/windows)

[!INCLUDE [Linux](gstreamer-windows.md)]

***

Handling compressed audio is implemented by using [GStreamer](https://gstreamer.freedesktop.org). For licensing reasons, GStreamer binaries aren't compiled and linked with the Speech SDK. You need to install several dependencies and plug-ins.

# [Ubuntu/Debian](#tab/debian)

```sh
sudo apt install libgstreamer1.0-0 \
gstreamer1.0-plugins-base \
gstreamer1.0-plugins-good \
gstreamer1.0-plugins-bad \
gstreamer1.0-plugins-ugly
```

# [RHEL/CentOS](#tab/centos)

```sh
sudo yum install gstreamer1 \
gstreamer1-plugins-base \
gstreamer1-plugins-good \
gstreamer1-plugins-bad-free \
gstreamer1-plugins-ugly-free
```

> [!NOTE]
> On RHEL/CentOS 7 and RHEL/CentOS 8, in case of using "ANY" compressed format, more GStreamer plug-ins need to be installed if the stream media format plug-in isn't in the preceding installed plug-ins. 


---


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

auto audioFormat =
    AudioStreamFormat::GetCompressedFormat(
        AudioStreamContainerFormat::OGG_OPUS
    );
auto audioConfig =
    AudioConfig::FromStreamInput(
        pushStream,
        audioFormat
    );

auto recognizer = SpeechRecognizer::FromConfig(config, audioConfig);
auto result = recognizer->RecognizeOnceAsync().get();

auto text = result->Text;
```
