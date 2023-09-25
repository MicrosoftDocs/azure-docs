---
title: Speech SDK audio input stream concepts
titleSuffix: Azure AI services
description: An overview of the capabilities of the Speech SDK audio input stream.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 05/09/2023
ms.author: eur
ms.devlang: csharp
ms.custom: devx-track-csharp
---
# How to use the audio input stream

The Speech SDK provides a way to stream audio into the recognizer as an alternative to microphone or file input.

This guide describes how to use audio input streams. It also describes some of the requirements and limitations of the audio input stream.

See more examples of speech-to-text recognition with audio input stream on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_recognition_samples.cs).

## Identify the format of the audio stream

Identify the format of the audio stream. The format must be supported by the Speech SDK and the Azure AI Speech service.

Supported audio samples are:

  - PCM format (int-16, signed)
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

Make sure that your code provides the RAW audio data according to these specifications. Also, make sure that 16-bit samples arrive in little-endian format. If your audio source data doesn't match the supported formats, the audio must be transcoded into the required format.

## Create your own audio input stream class

You can create your own audio input stream class derived from `PullAudioInputStreamCallback`. Implement the `Read()` and `Close()` members. The exact function signature is language-dependent, but the code looks similar to this code sample:

```csharp
public class ContosoAudioStream : PullAudioInputStreamCallback 
{
    public ContosoAudioStream() {}

    public override int Read(byte[] buffer, uint size) 
    {
        // Returns audio data to the caller.
        // E.g., return read(config.YYY, buffer, size);
        return 0;
    }

    public override void Close() 
    {
        // Close and clean up resources.
    }
}
```

Create an audio configuration based on your audio format and custom audio input stream. For example:

```csharp
var audioConfig = AudioConfig.FromStreamInput(new ContosoAudioStream(), audioFormat);
```

Here's how the custom audio input stream is used in the context of a speech recognizer:

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

public class ContosoAudioStream : PullAudioInputStreamCallback 
{
    public ContosoAudioStream() {}

    public override int Read(byte[] buffer, uint size) 
    {
        // Returns audio data to the caller.
        // E.g., return read(config.YYY, buffer, size);
        return 0;
    }

    public override void Close() 
    {
        // Close and clean up resources.
    }
}

class Program 
{
    static string speechKey = Environment.GetEnvironmentVariable("SPEECH_KEY");
    static string speechRegion = Environment.GetEnvironmentVariable("SPEECH_REGION");

    async static Task Main(string[] args)
    {
        byte channels = 1;
        byte bitsPerSample = 16;
        uint samplesPerSecond = 16000; // or 8000
        var audioFormat = AudioStreamFormat.GetWaveFormatPCM(samplesPerSecond, bitsPerSample, channels);
        var audioConfig = AudioConfig.FromStreamInput(new ContosoAudioStream(), audioFormat);

        var speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion); 
        speechConfig.SpeechRecognitionLanguage = "en-US";
        var speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);

        Console.WriteLine("Speak into your microphone.");
        var speechRecognitionResult = await speechRecognizer.RecognizeOnceAsync();
        Console.WriteLine($"RECOGNIZED: Text={speechRecognitionResult.Text}");
    }
}
```

## Next steps

- [Speech to text quickstart](./get-started-speech-to-text.md?pivots=programming-language-csharp)
- [How to recognize speech](./how-to-recognize-speech.md?pivots=programming-language-csharp)
