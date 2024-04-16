---
author: trrwilson
ms.service: azure-ai-speech
ms.topic: include
ms.date: 05/25/2020
ms.author: trrwilson
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * [Create a Speech resource](~/articles/ai-services/multi-service-resource.md?pivots=azportal#get-the-keys-for-your-resource)
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md)
> * Create a bot connected to the [Direct Line Speech channel](/azure/bot-service/bot-service-channel-connect-directlinespeech)
> * Make sure that you have access to a microphone for audio capture
>
  > [!NOTE]
  > Please refer to [the list of supported regions for voice assistants](~/articles/ai-services/speech-service/regions.md#voice-assistants) and ensure your resources are deployed in one of those regions.

## Setup your environment

Update the go.mod file with the latest SDK version by adding this line
```sh
require (
    github.com/Microsoft/cognitive-services-speech-sdk-go v1.15.0
)
```

## Start with some boilerplate code
Replace the contents of your source file (e.g. `quickstart.go`) with the below, which includes:

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

Replace the `YOUR_SUBSCRIPTION_KEY` and `YOUR_BOT_REGION` values with actual values from the Speech resource.

- Navigate to the Azure portal, and open your Speech resource
- Under **Keys and Endpoint** on the left, there are two available subscription keys
    - Use either one as the `YOUR_SUBSCRIPTION_KEY` value replacement
- Under the **Overview** on the left, note the region and map it to the region identifier
    - Use the Region identifier as the `YOUR_BOT_REGION` value replacement, for example: `"westus"` for **West US**

   > [!NOTE]
   > Please refer to [the list of supported regions for voice assistants](~/articles/ai-services/speech-service/regions.md#voice-assistants) and ensure your resources are deployed in one of those regions.

   > [!NOTE]
   > For information on configuring your bot, see the Bot Framework documentation for [the Direct Line Speech channel](/azure/bot-service/bot-service-channel-connect-directlinespeech).

## Code explanation
The Speech subscription key and region are required to create a speech configuration object. The configuration object is needed to instantiate a speech recognizer object.

The recognizer instance exposes multiple ways to recognize speech. In this example, speech is continuously recognized. This functionality lets the Speech service know that you're sending many phrases for recognition, and when the program terminates to stop recognizing speech. As results are yielded, the code will write them to the console.

## Build and run
You're now set up to build your project and test your custom voice assistant using the Speech service.
1. Build your project, e.g. **"go build"**
2. Run the module and speak a phrase or sentence into your device's microphone. Your speech is transmitted to the Direct Line Speech channel and transcribed to text, which appears as output.


> [!NOTE]
> The Speech SDK will default to recognizing using en-us for the language, see [How to recognize speech](../../../../how-to-recognize-speech.md) for information on choosing the source language.

## Next steps

[!INCLUDE [footer](./footer.md)]
