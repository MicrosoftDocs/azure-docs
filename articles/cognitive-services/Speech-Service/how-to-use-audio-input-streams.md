---
title: Speech SDK audio input stream concepts
titleSuffix: Azure Cognitive Services
description: An overview of the capabilities of the Speech SDK's audio input stream API.
services: cognitive-services
author: fmegen
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: fmegen
---

# About the Speech SDK audio input stream API

The Speech SDK's **Audio Input Stream** API provides a way to stream audio into the recognizers instead of using either the microphone or the input file APIs.

The following steps are required when using audio input streams:

- Identify the format of the audio stream. The format must be supported by the Speech SDK and the Speech service. Currently, only the following configuration is supported:

  Audio samples in PCM format, one channel, 16 bits per sample, 8000 or 16000 samples per second (16000 or 32000 bytes per second), two block align (16 bit including padding for a sample).

  The corresponding code in the SDK to create the audio format looks like this:

  ```csharp
  byte channels = 1;
  byte bitsPerSample = 16;
  int samplesPerSecond = 16000; // or 8000
  var audioFormat = AudioStreamFormat.GetWaveFormatPCM(samplesPerSecond, bitsPerSample, channels);
  ```

- Make sure your code can provide the RAW audio data according to these specifications. If your audio source data doesn't match the supported formats, the audio must be transcoded into the required format.

- Create your own audio input stream class derived from `PullAudioInputStreamCallback`. Implement the `Read()` and `Close()` members. The exact function signature is language-dependent, but the code will look similar to this code sample:

  ```csharp
   public class ContosoAudioStream : PullAudioInputStreamCallback {
      ContosoConfig config;

      public ContosoAudioStream(const ContosoConfig& config) {
          this.config = config;
      }

      public int Read(byte[] buffer, uint size) {
          // returns audio data to the caller.
          // e.g. return read(config.YYY, buffer, size);
      }

      public void Close() {
          // close and cleanup resources.
      }
   };
  ```

- Create an audio configuration based on your audio format and input stream. Pass in both your regular speech configuration and the audio input configuration when you create your recognizer. For example:

  ```csharp
  var audioConfig = AudioConfig.FromStreamInput(new ContosoAudioStream(config), audioFormat);

  var speechConfig = SpeechConfig.FromSubscription(...);
  var recognizer = new SpeechRecognizer(speechConfig, audioConfig);

  // run stream through recognizer
  var result = await recognizer.RecognizeOnceAsync();

  var text = result.GetText();
  ```

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [See how to recognize speech in C#](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-csharp&tabs=dotnet)
