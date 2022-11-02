---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/11/2020
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

To configure the Speech SDK to accept compressed audio input, create a `PullAudioInputStream` or `PushAudioInputStream`. Then, create an `AudioConfig` from an instance of your stream class that specifies the compression format of the stream. Find related sample code in [Speech SDK samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/WavStream.java).

Let's assume that you have an input stream class called `pullStream` and are using OPUS/OGG. Your code might look like this:

```java
import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
import com.microsoft.cognitiveservices.speech.audio.AudioInputStream;
import com.microsoft.cognitiveservices.speech.audio.AudioStreamFormat;
import com.microsoft.cognitiveservices.speech.audio.PullAudioInputStream;
import com.microsoft.cognitiveservices.speech.audio.AudioStreamContainerFormat;

// ... omitted for brevity

SpeechConfig speechConfig =
    SpeechConfig.fromSubscription(
        "YourSubscriptionKey",
        "YourServiceRegion");

// Create an audio config specifying the compressed
// audio format and the instance of your input stream class.
PullAudioInputStream pullStream = AudioInputStream.createPullStream(
    AudioStreamFormat.getCompressedFormat(AudioStreamContainerFormat.OGG_OPUS));
AudioConfig audioConfig = AudioConfig.fromStreamInput(pullStream);

SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioConfig);
SpeechRecognitionResult result = recognizer.recognizeOnceAsync().get();

String text = result.getText();
```
