---
title: AudioInputStream concepts | Microsoft Docs
description: An overview of the capabilities of the AudioInputStream API.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: fmegen
manager: wolfma61

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 06/04/2018
ms.author: fmegen
---                                                                   
# About the audio input stream API

The **Audio Input Stream** API provides a way to stream audio streams into the recognizers instead of using either the microphone or the wave file APIs.

## API capabilities

The API uses two components, the `AudioInputStream` (the raw audio data) as well as the `AudioInputStreamFormat` (the description of the audio format).

The `AudioInputStreamFormat` defines the format of the audio data. It can be compared to the standard `WAVEFORMAT` stucture for wave files on Windows and contains these fields:

  - `FormatTag`
  
    The format of the audio. The Speech SDK currently only supports `format 1` (PCM).

  - `Channels`
  
    The number of channels. The current speech service supports only 1 channel (mono) audio material.

  - `SamplesPerSec` 
  
    The sample rate. A typical microphone recording has 16000 samples per second.

  - `AvgBytesPerSec`
  
    Average bytes per second, usually calculated as `SamplesPerSec * Channels * ceil(BitsPerSample, 8)`. This can be different for audio streams that use variable bitrates.

  - `BlockAlign`
  
    The size of a single frame, usually calculated as `Channels * ceil(wBitsPerSample, 8)`. The actual value might be higher, due to padding.

  - `BitsPerSample`
  
    The bits per sample. A typcial audio stream uses 16 bits per sample (CD quality).

The `AudioInputStream` base class is expected to be overriden by a custom stream adapters. It has to implement these functions:

   - `GetFormat()`
   
     This function is called to get the format of the audio stream. It gets a pointer to the AudioInputStreamFormat buffer.

   - `Read()`
   
     This function is called to get data from the audio stream. It gets the a pointer to the buffer to which to copy the audio data and the size of the buffer. The function returns the number of bytes being copied to the buffer or 0, indicating the end of the stream. 

   - `Close()`
   
     This function is called to close the audio stream.

## Usage Examples

In general, the following steps are involved when using Audio input streams:

  - Identify the format of the audio stream and verify that it is supported by The SDK and the speech service. Currently the following configuration is supported:

    1 TAG (PCM), 1 channel, 16000 samples per second, 32000 bytes per second, 2 block align (16 bit including padding for a sample), 16 bits per sample

  - Make sure your code can provide the RAW audio data as to the specs identified above. This can be done by configuring your audio source to match the configuration or by transcoding data into the required format.

  - Implement your `AudioInputStream` implementation and derive it from AudioInputStream. You have to override the `GetFormat()`, `Read()`, and `Close()` operation. The exact function signature is language dependent, but the code will look similar to this:

    ```
     public class ContosoAudioStream : AudioInputStream {
        ContosoConfig config;

        public ContosoAudioStream(const ContosoConfig& config) {
            this.config = config;
        }

        public void GetFormat(AudioInputStreamFormat& format) {
            format.FormatTag = config.*;
            // ...
        }

        public size_t Read(byte *buffer, size_t size) {
            return read(config.*, buffer, size);
        }

        public void Close() {
          // close and cleanup resources.
        }
     };
    ```

  - Call the Carbon APIs with an instance of your class:

    ```
    var contosoStream = new ContosoAudioStream(contosoConfig);

    var factory = SpeechFactory.FromSubscription(...);
    var recognizer = CreateSpeechRecognizerWithStream(contosoStream);

    // run stream through recognizer
    var result = await recognizer.RecognizeAsync();

    var text = result.GetText();

    delete contosoStream;
    ```

  - Note, the contosoStream must be deleted explicitly after the result has been obtained. While this is easy to see in the previous example, you are not allowed to release the AudioStream before the input is consumed. In a scenario using `Start- / StopContinuousRecognitionAsync` it requires a concept like this:

    ```
    var contosoStream = new ContosoAudioStream(contosoConfig);

    var factory = SpeechFactory.FromSubscription(...);
    var recognizer = CreateSpeechRecognizerWithStream(contosoStream);

    // run stream through recognizer
    await recognizer.StartContinuousRecognitionAsync();

    // ERROR: don not delete the contosoStream before ending recognition!
    // delete contosoStream;

    await recognizer.StopContinuousRecognitionAsync();

    // OK: Safe to delete the contosoStream.
    delete contosoStream;
    ```
## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-windows.md)
