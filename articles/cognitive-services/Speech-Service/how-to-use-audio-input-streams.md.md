---
title: AudioInputStream concepts | Microsoft Docs
description: An overview of the capabilities of the AudioInputStream API.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 06/04/2018
ms.author: fmegen
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
# About Audio input streams API

The **Audio Input Stream** API provides a way to stream custom audio streams into the various Recognizers instead of using either the microphone or the wave file APIs. The APIs can be used with an SDK client library (for supported platforms and languages).

The **Audio Input Stream** API offers the following features:

- Separating Format from Content. The Api provides several fields for the actual Audio format and the raw data.

- Automatic Throttleing, i.e., carbon takes are of limiting the amount of data sent to the speech service.

- Integration with the native Stream API of the target language. For example, exposes a Stream API on C# or a Reader API in java.


## API capabilities

The API uses two components, the AudioInpuStream as well as the AudioInputStreamFormat.

The AudioStreamFormat defines the format of the audio data. It can be compared to the standard WAVEFORMAT stucture for wave files and is comprised of these fields:
  - FormatTag - The format of the audio. Carbon currently only supports format 1 (PCM) and will add additional formats in the future.

  - Channels - The number of channels. The current speech service supports only 1 channel (Mono) audio material.

  - SamplesPerSec - The sample rate, valid values. A typical microphone recording has 16000 samples per second, resulting in a max 8000 Hz frequency.

  - AvgBytesPerSec - Average bytes per second, usually calculated as nSamplesPerSec * nChannels * ceil(wBitsPerSample, 8). This can be different for audio streams that use variable bitrates.

  - BlockAlign - The size of a single frame, valid values: nChannels * ceil(wBitsPerSample, 8). This might be higher than this number due to padding.

  - BitsPerSample - The bits per sample. A typcial audio stream uses 16 bits per sample (CD quality).


  The AudioInputStream base class is expected to be overriden by custom stream adapters. It provides these functions:
   - GetFormat() - This function is called to get the format of the audio stream. It gets a pointer to the AudioInputStreamFormat buffer.

   - Read() - This function is called to get data from the audio stream. It gets the a pointer to the buffer to which to copy the audio data and the size of the buffer. The function returns the number of bytes being copied to the buffer or 0, indicating the end of the stream. It is up to Carbon to then call Close().

   - Close() - This function is called to close the audio stream, triggered by carbon.


## Usage Examples

In general, the following steps are involved when using Audio input streams:

  1. Identify the Format of the Audio stream and verify that it is supported by carbon. At the time of writing, the following configuration is supported:
        1 TAG (PCM)
        1 channel
        16000 samples per second
        32000 bytes per second
        2 block align (16 bit including padding for a sample)
        16 bits per sample

  2. Make sure your code can provide the RAW audio data as to the specs identified in step 1. This can be done by configuring your audio source to match the configuration or by transcoding data in case the data source cannot provide the required type natively.

  3. Implement your own class, and derive it from AudioInputStream, overriding the GetFormat(), Read(), and Close() operation. The exact function signature is language mapping dependent, but in pseudo code, the code will look like this:

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

  4. Call the Carbon APIs with an instance of your class:

    ```
    var contosoStream = new ContosoAudioStream(contosoConfig);

    var factory = SpeechFactory.FromSubscription(...);
    var recognizer = CreateSpeechRecognizerWithStream(contosoStream);

    // run stream through recognizer
    var result = await recognizer.RecognizeAsync();

    var text = result.GetText();

    delete contosoStream;
    ```

  5. Note, the contosoStream must be deleted explicitly after the result has been obtained. While this is easy to see in the previous example, it must be taken care not to release the ContosoAudioStream in scenarios like ContinuousRecognition.

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
