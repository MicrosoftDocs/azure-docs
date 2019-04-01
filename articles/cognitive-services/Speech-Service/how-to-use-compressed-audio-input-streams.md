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
ms.date: 03/28/2019
ms.author: amishu
---
# About the Speech SDK compressed audio input stream API

The Speech SDK's **Compressed audio Input Stream** API provides a way to stream compressed audio streams into the recognizers using PullStream or PushStream.

The following steps are required when using compressed audio input streams:

- Identify the format of the input audio stream. The format must be supported by the speech SDK. Currently, only MP3 and  OPUS/OGG are the supported input audio format. 
- Compressed audio input format is currently supported only on the Ubuntu 16.04 and Ubuntu 18.04 platforms for C/C++/C# and Java. The following needs to be installed on the machine to get the compressed audio input format feature.

  ```
  sudo apt-get install libgstreamer1.0-0 gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly
  ```


  The corresponding code in the application that creates the audio format with the compressed audio input stream looks like the following. This is the C# sample. Please look at the API documentation for C/C++ and Java.

  ```
  var audioFormat = AudioStreamFormat.GetCompressedFormat(Microsoft.CognitiveServices.Speech.Audio.AudioStreamContainerFormat.OGG_OPUS);
  ```

- Create your own audio input stream class derived from `PullAudioInputStreamCallback`. Implement the `Read()` and `Close()` members. The exact function signature is language-dependent (following is for C#), but the code will look similar to this code sample:

  ```
   public class YourPullAudioStream : PullAudioInputStreamCallback {
      YourPrivateInfo info;

      public YourPullAudioStream(const YourPrivateInfo& info) {
          this.info = info;
      }

      public int Read(byte[] buffer, uint size) {
          // returns audio data to the caller.
          // e.g. return read(info.StreamHandle, buffer, size);
      }

      public void Close() {
          // close and cleanup resources.
          // close(info.StreamHandle);
      }
   };
  ```

- Create an audio configuration based on your audio format and input stream. Pass in both your regular speech configuration and the audio input configuration when you create your recognizer. For example:

  ```
  var audioFormat = AudioStreamFormat.GetCompressedFormat(Microsoft.CognitiveServices.Speech.Audio.AudioStreamContainerFormat.OGG_OPUS);
  var audioConfig = AudioConfig.FromStreamInput(new YourPullAudioStream(yourPrivateInfo), audioFormat);

  var speechConfig = SpeechConfig.FromSubscription(...);
  var recognizer = new SpeechRecognizer(speechConfig, audioConfig);

  // run stream through recognizer
  var result = await recognizer.RecognizeOnceAsync();

  var text = result.GetText();
  ```

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
