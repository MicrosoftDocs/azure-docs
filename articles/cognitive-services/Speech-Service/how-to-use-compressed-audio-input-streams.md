---
title: Speech SDK compressed audio input stream concepts
titleSuffix: Azure Cognitive Services
description: An overview of the capabilities of the Speech SDK's compressed audio input stream API.
services: cognitive-services
author: amitkumarshukla
manager: nitinme

ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/03/2019
ms.author: amishu
---
# About the Speech SDK compressed audio input stream

The Speech SDK's **Compressed Audio Input Stream** API provides a way to stream compressed audio to the Speech Service using PullStream or PushStream.

> [!NOTE]
> Compressed audio input format is currently only supported for C++, C#, and Java on Linux (Ubuntu 16.04 or Ubuntu 18.04).
> MP3 and OPUS/OGG are the only supported input audio formats at this stage.

On Linux, you need to install these additional SDK dependencies to enable the compressed audio input format feature:

```sh
sudo apt install libgstreamer1.0-0 gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly
```

To stream in a compressed audio format to the Speech Service, you create your own `PullAudioInputStream` or `PushAudioInputStream`. Then create an `AudioConfig` from an instance of your stream class, specifying the compression format of the stream.

If you have an instance of your input stream class `myPushStream` and the OPUS/OGG format, the code will look similar to this:

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

var speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

// Create an audio config specifying the compressed audio format and the instance of you input stream class.
var audioFormat = AudioStreamFormat.GetCompressedFormat(AudioStreamContainerFormat.OGG_OPUS);
var audioConfig = AudioConfig.FromStreamInput(myPushStream, audioFormat);

var recognizer = new SpeechRecognizer(speechConfig, audioConfig);

var result = await recognizer.RecognizeOnceAsync();

var text = result.GetText();
```

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
