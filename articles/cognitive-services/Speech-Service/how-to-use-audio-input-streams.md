---
title: AudioInputStream concepts
description: An overview of the capabilities of the AudioInputStream API.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: fmegen

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 06/07/2018
ms.author: fmegen
---
# About the audio input stream API

The **Audio Input Stream** API provides a way to stream audio streams into the recognizers instead of using either the microphone or the input file APIs.

## API overview

The API uses two components, the `AudioInputStream` (the raw audio data) and the `AudioInputStreamFormat`.

The `AudioInputStreamFormat` defines the format of the audio data. It can be compared to the standard `WAVEFORMAT` structure for wave files on Windows.

  - `FormatTag`

    The format of the audio. The Speech SDK currently only supports `format 1` (PCM - little-endian).

  - `Channels`

    The number of channels. The current speech service supports only one channel (mono) audio material.

  - `SamplesPerSec`

    The sample rate. A typical microphone recording has 16000 samples per second.

  - `AvgBytesPerSec`

    Average bytes per second, calculated as `SamplesPerSec * Channels * ceil(BitsPerSample, 8)`. Average bytes per second can be different for audio streams that use variable bitrates.

  - `BlockAlign`

    The size of a single frame, calculated as `Channels * ceil(wBitsPerSample, 8)`. Due to padding, the actual value might be higher than this value.

  - `BitsPerSample`

    The bits per sample. A typical audio stream uses 16 bits per sample (CD quality).

The `AudioInputStream` base class will be overridden by your custom stream adapter. This adapter has to implement these functions:

   - `GetFormat()`

     This function is called to get the format of the audio stream. It gets a pointer to the AudioInputStreamFormat buffer.

   - `Read()`

     This function is called to get data from the audio stream. One parameter is a pointer to the buffer to copy the audio data into. The second parameter is the size of the buffer. The function returns the number of bytes copied to the buffer. A return value of `0` indicates the end of the stream.

   - `Close()`

     This function is called to close the audio stream.

## Usage examples

In general, the following steps are involved when using audio input streams:

  - Identify the format of the audio stream. The format must be supported by the SDK and the speech service. Currently the following configuration is supported:

    One audio format tag (PCM), one channel, 16000 samples per second, 32000 bytes per second, two block align (16 bit including padding for a sample), 16 bits per sample

  - Make sure your code can provide the RAW audio data as to the specs identified above. If your audio source data doesn't match the supported formats, the audio must be transcoded into the required format.

  - Derive your custom audio input stream class from `AudioInputStream`. Implement the `GetFormat()`, `Read()`, and `Close()` operation. The exact function signature is language-dependent, but the code will look similar to this code sample::

    ```
     public class ContosoAudioStream : AudioInputStream {
        ContosoConfig config;

        public ContosoAudioStream(const ContosoConfig& config) {
            this.config = config;
        }

        public void GetFormat(AudioInputStreamFormat& format) {
            // returns format data to the caller.
            // e.g. format.FormatTag = config.XXX;
            // ...
        }

        public size_t Read(byte *buffer, size_t size) {
            // returns audio data to the caller.
            // e.g. return read(config.YYY, buffer, size);
        }

        public void Close() {
            // close and cleanup resources.
        }
     };
    ```

  - Use your audio input stream:

    ```
    var contosoStream = new ContosoAudioStream(contosoConfig);

    var factory = SpeechFactory.FromSubscription(...);
    var recognizer = CreateSpeechRecognizerWithStream(contosoStream);

    // run stream through recognizer
    var result = await recognizer.RecognizeAsync();

    var text = result.GetText();

    // In some languages you need to delete the stream explicitly.
    // delete contosoStream;
    ```

  - In some languages, the `contosoStream` must be deleted explicitly after the recognition is complete. You can't release the AudioStream before the complete input is read. In a scenario using `StopContinuousRecognitionAsync` and `StopContinuousRecognitionAsync` it requires a concept illustrated in this sample:

    ```
    var contosoStream = new ContosoAudioStream(contosoConfig);

    var factory = SpeechFactory.FromSubscription(...);
    var recognizer = CreateSpeechRecognizerWithStream(contosoStream);

    // run stream through recognizer
    await recognizer.StartContinuousRecognitionAsync();

    // ERROR: do not delete the contosoStream before ending recognition!
    // delete contosoStream;

    await recognizer.StopContinuousRecognitionAsync();

    // OK: Safe to delete the contosoStream.
    // delete contosoStream;
    ```

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
