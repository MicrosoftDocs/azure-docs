---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/11/2020
ms.author: eur
ms.custom: devx-track-csharp
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## GStreamer configuration

Handling compressed audio is implemented by using [GStreamer](https://gstreamer.freedesktop.org). For licensing reasons, GStreamer binaries aren't compiled and linked with the Speech SDK. You need to install several dependencies and plug-ins. 

GStreamer binaries need to be in the system path so that the Speech SDK can load the binaries during runtime. For example, on Windows, if the Speech SDK finds `libgstreamer-1.0-0.dll` or `gstreamer-1.0-0.dll` (for the latest GStreamer) during runtime, it means the GStreamer binaries are in the system path.

Choose a platform for installation instructions.

### [Linux](#tab/linux)

[!INCLUDE [Linux](linux.md)]

### [Windows](#tab/windows)

[!INCLUDE [Windows](windows.md)]

***

## Example

To configure the Speech SDK to accept compressed audio input, create `PullAudioInputStream` or `PushAudioInputStream`. Then, create an `AudioConfig` from an instance of your stream class that specifies the compression format of the stream. Find related sample code snippets in [About the Speech SDK audio input stream API](../../../../how-to-use-audio-input-streams.md).

Let's assume that you have an input stream class called `pullStream` and are using OPUS/OGG. Your code might look like this:

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

// ... omitted for brevity

var speechConfig =
    SpeechConfig.FromSubscription(
        "YourSubscriptionKey",
        "YourServiceRegion");

// Create an audio config specifying the compressed
// audio format and the instance of your input stream class.
var audioFormat =
    AudioStreamFormat.GetCompressedFormat(
        AudioStreamContainerFormat.OGG_OPUS);
var audioConfig =
    AudioConfig.FromStreamInput(
        pullStream,
        audioFormat);

using var recognizer = new SpeechRecognizer(speechConfig, audioConfig);
var result = await recognizer.RecognizeOnceAsync();

var text = result.Text;
```
