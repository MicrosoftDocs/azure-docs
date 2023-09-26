---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 08/24/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/go.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

Install the Speech SDK for Go. For requirements and instructions, see [Install the Speech SDK](../../../quickstarts/setup-platform.md?pivots=programming-language-go).

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Recognize speech from a microphone

Follow these steps to create a GO module.

1. Open a command prompt where you want the new module, and create a new file named *speech-recognition.go*.
1. Copy the following code into *speech-recognition.go*:

   ```go
   package main

   import (
       "bufio"
       "fmt"
       "os"

       "github.com/Microsoft/cognitive-services-speech-sdk-go/audio"
       "github.com/Microsoft/cognitive-services-speech-sdk-go/speech"
   )

   func sessionStartedHandler(event speech.SessionEventArgs) {
       defer event.Close()
       fmt.Println("Session Started (ID=", event.SessionID, ")")
   }

   func sessionStoppedHandler(event speech.SessionEventArgs) {
       defer event.Close()
       fmt.Println("Session Stopped (ID=", event.SessionID, ")")
   }

   func recognizingHandler(event speech.SpeechRecognitionEventArgs) {
       defer event.Close()
       fmt.Println("Recognizing:", event.Result.Text)
   }

   func recognizedHandler(event speech.SpeechRecognitionEventArgs) {
       defer event.Close()
       fmt.Println("Recognized:", event.Result.Text)
   }

   func cancelledHandler(event speech.SpeechRecognitionCanceledEventArgs) {
       defer event.Close()
       fmt.Println("Received a cancellation: ", event.ErrorDetails)
       fmt.Println("Did you set the speech resource key and region values?")
   }

   func main() {
       // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
       speechKey :=  os.Getenv("SPEECH_KEY")
       speechRegion := os.Getenv("SPEECH_REGION")

       audioConfig, err := audio.NewAudioConfigFromDefaultMicrophoneInput()
       if err != nil {
           fmt.Println("Got an error: ", err)
           return
       }
       defer audioConfig.Close()
       speechConfig, err := speech.NewSpeechConfigFromSubscription(speechKey, speechRegion)
       if err != nil {
           fmt.Println("Got an error: ", err)
           return
       }
       defer speechConfig.Close()
       speechRecognizer, err := speech.NewSpeechRecognizerFromConfig(speechConfig, audioConfig)
       if err != nil {
           fmt.Println("Got an error: ", err)
           return
       }
       defer speechRecognizer.Close()
       speechRecognizer.SessionStarted(sessionStartedHandler)
       speechRecognizer.SessionStopped(sessionStoppedHandler)
       speechRecognizer.Recognizing(recognizingHandler)
       speechRecognizer.Recognized(recognizedHandler)
       speechRecognizer.Canceled(cancelledHandler)
       speechRecognizer.StartContinuousRecognitionAsync()
       defer speechRecognizer.StopContinuousRecognitionAsync()
       bufio.NewReader(os.Stdin).ReadBytes('\n')
   }
   ```

1. Run the following commands to create a *go.mod* file that links to components hosted on GitHub:

   ```cmd
   go mod init speech-recognition
   go get github.com/Microsoft/cognitive-services-speech-sdk-go
   ```

   > [!IMPORTANT]
   > Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described in [Set environment variables](#set-environment-variables). If you don't set these variables, the sample fails with an error message.

1. Build and run the code:

   ```cmd
   go build
   go run speech-recognition
   ```

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
