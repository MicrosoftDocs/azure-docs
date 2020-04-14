---
title: 'Quickstart: Recognize speech from a microphone, go - Speech service'
titleSuffix: Azure Cognitive Services
description: Learn how to recognize speech in Go using the Speech SDK.
services: cognitive-services
author: trrwilson
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 05/25/2020
ms.author: trrwilson
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md)
> * Make sure that you have access to a microphone for audio capture

## Support and updates

Updates to the Speech SDK Go package are distributed via

## Setup your environment

Update the go.mod file with the latest SDK version by adding this line
```sh
require (
    github.com/Microsoft/cognitive-services-speech-sdk-go v1.11.0-alpha1
)
```

## Start with some boilerplate code
1. Replace the contents of your source file (e.g. `sr-quickstart.go`) with the below, which includes:

- "main" package definition
- importing the necessary modules from the Speech SDK
- variables for storing the ########TODO######## information that will be replaced later in this quickstart
- a simple implementation using the microphone for audio input
- event handlers for various events that take place during a speech recognition

```sh
package recognizer

import (
    "bufio"
    "fmt"
    "os"

    "github.com/Microsoft/cognitive-services-speech-sdk-go/audio"
    "github.com/Microsoft/cognitive-services-speech-sdk-go/speech"
)

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
}

func main() {
    subscription :=  "YOUR_SUBSCRIPTION_KEY"
    region := "YOUR_SUBSCRIPTIONKEY_REGION"

    audioConfig, err := audio.NewAudioConfigFromDefaultMicrophoneInput()
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
    speechRecognizer.Recognizing(recognizingHandler)
    speechRecognizer.Recognized(recognizedHandler)
    speechRecognizer.Canceled(cancelledHandler)
    speechRecognizer.StartContinuousRecognitionAsync()
    defer speechRecognizer.StopContinuousRecognitionAsync()
    bufio.NewReader(os.Stdin).ReadBytes('\n')
}
```

## Build and run
You're now set up to build your project and test your custom voice assistant using the Speech service.
1. Build your project, e.g. **"go build"**
2. Run the module and speak a phrase or sentence into your device's microphone. Your speech is transmitted to the Speech service and transcribed to text, which appears in the output.


> [!NOTE]
> The Speech SDK will default to recognizing using en-us for the language, see [Specify source language for speech to text](../../../../how-to-specify-source-language.md) for information on choosing the source language.


## Next steps

[!INCLUDE [footer](./footer.md)]
