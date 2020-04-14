---
title: 'Quickstart: Create a custom voice assistant, Go - Speech service'
titleSuffix: Azure Cognitive Services
description: Learn how to create a custom voice assistant in Go using the Speech SDK.
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
> * Create a bot connected to the [Direct Line Speech channel](https://docs.microsoft.com/azure/bot-service/bot-service-channel-connect-directlinespeech)
> * Make sure that you have access to a microphone for audio capture
>
  > [!NOTE]
  > Please refer to [the list of supported regions for voice assistants](~/articles/cognitive-services/speech-service/regions.md#voice-assistants) and ensure your resources are deployed in one of those regions.

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
1. Replace the contents of your source file (e.g. `quickstart.go`) with the below, which includes:

- "main" package definition
- importing the necessary modules from the Speech SDK
- variables for storing the bot information that will be replaced later in this quickstart
- a simple implementation using the microphone for audio input
- event handlers for various events that take place during a speech interaction

```sh
package main

import (
    "fmt"
    "time"

    "github.com/Microsoft/cognitive-services-speech-sdk-go/audio"
    "github.com/Microsoft/cognitive-services-speech-sdk-go/dialog"
    "github.com/Microsoft/cognitive-services-speech-sdk-go/speech"
)

func main() {
    subscription :=  "YOUR_SUBSCRIPTION_KEY"
    region := "YOUR_BOT_REGION"

    audioConfig, err := audio.NewAudioConfigFromDefaultMicrophoneInput()
    if err != nil {
        fmt.Println("Got an error: ", err)
        return
    }
    defer audioConfig.Close()
    config, err := dialog.NewBotFrameworkConfigFromSubscription(subscription, region)
    if err != nil {
        fmt.Println("Got an error: ", err)
        return
    }
    defer config.Close()
    connector, err := dialog.NewDialogServiceConnectorFromConfig(config, audioConfig)
    if err != nil {
        fmt.Println("Got an error: ", err)
        return
    }
    defer connector.Close()
    activityReceivedHandler := func(event dialog.ActivityReceivedEventArgs) {
        defer event.Close()
        fmt.Println("Received an activity.")
    }
    connector.ActivityReceived(activityReceivedHandler)
    recognizedHandle := func(event speech.SpeechRecognitionEventArgs) {
        defer event.Close()
        fmt.Println("Recognized ", event.Result.Text)
    }
    connector.Recognized(recognizedHandle)
    recognizingHandler := func(event speech.SpeechRecognitionEventArgs) {
        defer event.Close()
        fmt.Println("Recognizing ", event.Result.Text)
    }
    connector.Recognizing(recognizingHandler)
    connector.ListenOnceAsync()
    <-time.After(10 * time.Second)
}
```

2. Update these fields at the top of the function with your bot subscription information
```sh
    subscription :=  "YOUR_SUBSCRIPTION_KEY"
    region := "YOUR_BOT_REGION"
```

   > [!NOTE]
   > Please refer to [the list of supported regions for voice assistants](~/articles/cognitive-services/speech-service/regions.md#voice-assistants) and ensure your resources are deployed in one of those regions.

   > [!NOTE]
   > For information on configuring your bot, see the Bot Framework documentation for [the Direct Line Speech channel](https://docs.microsoft.com/azure/bot-service/bot-service-channel-connect-directlinespeech).

## Build and run
You're now set up to build your project and test your custom voice assistant using the Speech service.
1. Build your project, e.g. **"go build"**
2. Run the module and speak a phrase or sentence into your device's microphone. Your speech is transmitted to the Direct Line Speech channel and transcribed to text, which appears as output.


> [!NOTE]
> The Speech SDK will default to recognizing using en-us for the language, see [Specify source language for speech to text](../../../../how-to-specify-source-language.md) for information on choosing the source language.

## Next steps

[!INCLUDE [footer](./footer.md)]
