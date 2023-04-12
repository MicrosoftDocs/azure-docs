---
title: Speech SDK audio input stream concepts
titleSuffix: Azure Cognitive Services
description: An overview of the capabilities of the Speech SDK audio input stream API.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 04/12/2023
ms.author: eur
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# How to use the audio input stream

The Speech SDK provides a way to stream audio into the recognizer as an alternative to microphone or file input.

This guide describes how to use audio input streams. It also describes some of the requirements and limitations of the audio input stream.

See more examples of speech-to-text recognition with audio input stream on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_recognition_samples.cs).

## Identify the format of the audio stream

Identify the format of the audio stream. The format must be supported by the Speech SDK and the Azure Cognitive Services Speech service. 

Supported audio samples are:

  - PCM format (int-16)
  - One channel
  - 16 bits per sample, 8,000 or 16,000 samples per second (16,000 bytes or 32,000 bytes per second)
  - Two-block aligned (16 bit including padding for a sample)

The corresponding code in the SDK to create the audio format looks like this example:

```csharp
byte channels = 1;
byte bitsPerSample = 16;
int samplesPerSecond = 16000; // or 8000
var audioFormat = AudioStreamFormat.GetWaveFormatPCM(samplesPerSecond, bitsPerSample, channels);
```

Make sure that your code provides the RAW audio data according to these specifications. Also, make sure that 16-bit samples arrive in little-endian format. Signed samples are also supported. If your audio source data doesn't match the supported formats, the audio must be transcoded into the required format.

## Create your own audio input stream class

You can create your own audio input stream class derived from `PullAudioInputStreamCallback`. Implement the `Read()` and `Close()` members. The exact function signature is language-dependent, but the code looks similar to this code sample:

```csharp
public class ContosoAudioStream : PullAudioInputStreamCallback {
  ContosoConfig config;

  public ContosoAudioStream(const ContosoConfig& config) {
      this.config = config;
  }

  public int Read(byte[] buffer, uint size) {
      // Returns audio data to the caller.
      // E.g., return read(config.YYY, buffer, size);
  }

  public void Close() {
      // Close and clean up resources.
  }
};
```

Create an audio configuration based on your audio format and input stream. Pass in both your regular speech configuration and the audio input configuration when you create your recognizer. For example:

```csharp
var audioConfig = AudioConfig.FromStreamInput(new ContosoAudioStream(config), audioFormat);

var speechConfig = SpeechConfig.FromSubscription(...);
var recognizer = new SpeechRecognizer(speechConfig, audioConfig);

// Run stream through recognizer.
var result = await recognizer.RecognizeOnceAsync();

var text = result.GetText();
```


## Next steps

- [Create a free Azure account](https://azure.microsoft.com/free/cognitive-services/)
- [See how to recognize speech in C#](./get-started-speech-to-text.md?pivots=programming-language-csharp&tabs=dotnet)