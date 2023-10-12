---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 09/15/2020
ms.author: eur
---

[!INCLUDE [Header](../../common/go.md)]

[!INCLUDE [Introduction](intro.md)]

## GStreamer configuration

The Speech SDK can use [GStreamer](https://gstreamer.freedesktop.org) to handle compressed audio. For licensing reasons, GStreamer binaries aren't compiled and linked with the Speech SDK. You need to install some dependencies and plug-ins. 

[!INCLUDE [Linux](gstreamer-linux.md)]

## Example

To configure the Speech SDK to accept compressed audio input, create a `PullAudioInputStream` or `PushAudioInputStream`. Then, create an `AudioConfig` from an instance of your stream class that specifies the compression format of the stream.

In the following example, let's assume that your use case is to use `PushStream` for a compressed file.

```go

package recognizer

import (
  "fmt"
  "time"
    "strings"

  "github.com/Microsoft/cognitive-services-speech-sdk-go/audio"
  "github.com/Microsoft/cognitive-services-speech-sdk-go/speech"
  "github.com/Microsoft/cognitive-services-speech-sdk-go/samples/helpers"
)

func RecognizeOnceFromCompressedFile(subscription string, region string, file string) {
  var containerFormat audio.AudioStreamContainerFormat
  if strings.Contains(file, ".mulaw") {
    containerFormat = audio.MULAW
  } else if strings.Contains(file, ".alaw") {
    containerFormat = audio.ALAW
  } else if strings.Contains(file, ".mp3") {
    containerFormat = audio.MP3
  } else if strings.Contains(file, ".flac") {
    containerFormat = audio.FLAC
  } else if strings.Contains(file, ".opus") {
    containerFormat = audio.OGGOPUS
  } else {
    containerFormat = audio.ANY
  }
  format, err := audio.GetCompressedFormat(containerFormat)
  if err != nil {
    fmt.Println("Got an error: ", err)
    return
  }
  defer format.Close()
  stream, err := audio.CreatePushAudioInputStreamFromFormat(format)
  if err != nil {
    fmt.Println("Got an error: ", err)
    return
  }
  defer stream.Close()
  audioConfig, err := audio.NewAudioConfigFromStreamInput(stream)
  if err != nil {
    fmt.Println("Got an error: ", err)
    return
  }
  defer audioConfig.Close()
  config, err := speech.NewSpeechConfigFromSubscription(subscription, region)
  if err != nil {
    fmt.Println("Got an error: ", err)
    return
  }
  defer config.Close()
  speechRecognizer, err := speech.NewSpeechRecognizerFromConfig(config, audioConfig)
  if err != nil {
    fmt.Println("Got an error: ", err)
    return
  }
  defer speechRecognizer.Close()
  speechRecognizer.SessionStarted(func(event speech.SessionEventArgs) {
    defer event.Close()
    fmt.Println("Session Started (ID=", event.SessionID, ")")
  })
  speechRecognizer.SessionStopped(func(event speech.SessionEventArgs) {
    defer event.Close()
    fmt.Println("Session Stopped (ID=", event.SessionID, ")")
  })
  helpers.PumpFileIntoStream(file, stream)
  task := speechRecognizer.RecognizeOnceAsync()
  var outcome speech.SpeechRecognitionOutcome
  select {
  case outcome = <-task:
  case <-time.After(40 * time.Second):
    fmt.Println("Timed out")
    return
  }
  defer outcome.Close()
  if outcome.Error != nil {
    fmt.Println("Got an error: ", outcome.Error)
  }
  fmt.Println("Got a recognition!")
  fmt.Println(outcome.Result.Text)
}

```
