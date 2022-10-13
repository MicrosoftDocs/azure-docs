---
title: Speech SDK audio input stream concepts
titleSuffix: Azure Cognitive Services
description: An overview of the capabilities of the Speech SDK audio input stream API.
services: cognitive-services
author: fmegen
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 06/13/2022
ms.author: fmegen
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# How to use the audio input stream

The Speech SDK provides a way to stream audio into the recognizer as an alternative to microphone or file input.

The following steps are required when you use audio input streams:

- Identify the format of the audio stream. The format must be supported by the Speech SDK and the Azure Cognitive Services Speech service. Currently, only the following configuration is supported:

  Audio samples are:

   - PCM format
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

- Make sure that your code provides the RAW audio data according to these specifications. Also, make sure that 16-bit samples arrive in little-endian format. Signed samples are also supported. If your audio source data doesn't match the supported formats, the audio must be transcoded into the required format.

- Create your own audio input stream class derived from `PullAudioInputStreamCallback`. Implement the `Read()` and `Close()` members. The exact function signature is language-dependent, but the code looks similar to this code sample:

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

- Create an audio configuration based on your audio format and input stream. Pass in both your regular speech configuration and the audio input configuration when you create your recognizer. For example:

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
