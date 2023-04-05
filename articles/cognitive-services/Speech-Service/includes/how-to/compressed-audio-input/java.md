---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/28/2023
ms.custom: devx-track-java
ms.author: eur
---

[!INCLUDE [Header](../../common/java.md)]

[!INCLUDE [Introduction](intro.md)]

## GStreamer configuration

The Speech SDK can use [GStreamer](https://gstreamer.freedesktop.org) to handle compressed audio. For licensing reasons, GStreamer binaries aren't compiled and linked with the Speech SDK. You need to install some dependencies and plug-ins.  

GStreamer binaries must be in the system path so that they can be loaded by the Speech SDK at runtime. For example, on Windows, if the Speech SDK finds `libgstreamer-1.0-0.dll` or `gstreamer-1.0-0.dll` (for the latest GStreamer) during runtime, it means the GStreamer binaries are in the system path.

Choose a platform for installation instructions.

### [Android](#tab/java-android)

[!INCLUDE [Android](gstreamer-android.md)]

### [Linux](#tab/java-linux)

[!INCLUDE [Linux](gstreamer-linux.md)]

### [Windows](#tab/java-windows)

[!INCLUDE [Windows](gstreamer-windows.md)]

***

## Example

To configure the Speech SDK to accept compressed audio input, create a `PullAudioInputStream` or `PushAudioInputStream`. Then, create an `AudioConfig` from an instance of your stream class that specifies the compression format of the stream. Find related sample code in [Speech SDK samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/java/android/compressed-input/app/src/main/java/com/microsoft/cognitiveservices/speech/samples/compressedinput/MainActivity.java).

Let's assume that you have an input stream class called `pullAudio` and are using MP3. Your code might look like this:

```java
String filePath = "whatstheweatherlike.mp3";
PullAudioInputStream pullAudio = AudioInputStream.createPullStream(new BinaryAudioStreamReader(filePath),
    AudioStreamFormat.getCompressedFormat(AudioStreamContainerFormat.MP3));
AudioConfig audioConfig = AudioConfig.fromStreamInput(pullAudio);
```
