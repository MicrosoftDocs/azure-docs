---
title: Stream codec compressed audio with the Speech SDK - Speech Services
titleSuffix: Azure Cognitive Services
description: Learn how to stream compressed audio to Azure Speech Services with the Speech SDK. Available for C++, C#, and Java for Linux.
services: cognitive-services
author: amitkumarshukla
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: amishu
---

# Using codec compressed audio input with the Speech SDK

The Speech SDK's **Compressed Audio Input Stream** API provides a way to stream compressed audio to the Speech Service using PullStream or PushStream.

> [!IMPORTANT]
> Streaming compressed audio is only supported for C++, C#, and Java on Linux (Ubuntu 16.04, Ubuntu 18.04, Debian 9).
> Speech SDK version 1.4.0 or higher is required.

For wav/PCM see the mainline speech documentation.  Outside of wav/PCM, the following codec compressed input formats are supported:

- MP3
- OPUS/OGG

## Prerequisites to using codec compressed audio input

Install these additional dependencies to use compressed audio input with the Speech SDK for Linux:

```sh
sudo apt install libgstreamer1.0-0 gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly
```

## Example code using codec compressed audio input

To stream in a compressed audio format to the Speech Services, create `PullAudioInputStream` or `PushAudioInputStream`. Then, create an `AudioConfig` from an instance of your stream class, specifying the compression format of the stream.

Let's assume that you have an input stream class called `myPushStream` and are using OPUS/OGG. Your code may look like this:

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

var speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

// Create an audio config specifying the compressed audio format and the instance of your input stream class.
var audioFormat = AudioStreamFormat.GetCompressedFormat(AudioStreamContainerFormat.OGG_OPUS);
var audioConfig = AudioConfig.FromStreamInput(myPushStream, audioFormat);

var recognizer = new SpeechRecognizer(speechConfig, audioConfig);

var result = await recognizer.RecognizeOnceAsync();

var text = result.GetText();
```

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [See how to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
