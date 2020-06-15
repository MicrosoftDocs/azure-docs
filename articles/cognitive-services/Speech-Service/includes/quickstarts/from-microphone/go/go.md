---
author: trrwilson
ms.service: cognitive-services
ms.topic: include
ms.date: 05/25/2020
ms.author: trrwilson
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * [Create an Azure Speech resource](../../../../get-started.md)
> * [Set up your development environment and create an empty project](../../../../quickstarts/setup-platform.md)
> * Make sure that you have access to a microphone for audio capture

## Setup your environment

Update the go.mod file with the latest SDK version by adding this line
```sh
require (
    github.com/Microsoft/cognitive-services-speech-sdk-go v1.12.1
)
```

## Start with some boilerplate code
1. Replace the contents of your source file (e.g. `sr-quickstart.go`) with the below, which includes:

- "main" package definition
- importing the necessary modules from the Speech SDK
- variables for storing the subscription information that will be replaced later in this quickstart
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

Replace the `YOUR_SUBSCRIPTION_KEY` and `YOUR_SUBSCRIPTIONKEY_REGION` values with actual values from the Speech resource.

- Navigate to the Azure portal, and open the Speech resource
- Under the **Keys** on the left, there are two available subscription keys
    - Use either one as the `YOUR_SUBSCRIPTION_KEY` value replacement
- Under the **Overview** on the left, note the region and map it to the region identifier
- Use the Region identifier as the `YOUR_SUBSCRIPTIONKEY_REGION` value replacement, for example: `"westus"` for **West US**

## Code explanation
The Speech subscription key and region are required to create a speech configuration object. The configuration object is needed to instantiate a speech recognizer object.

The recognizer instance exposes multiple ways to recognize speech. In this example, speech is continuously recognized. This functionality lets the Speech service know that you're sending many phrases for recognition, and when the program terminates to stop recognizing speech. As results are yielded, the code will write them to the console.

## Build and run
You're now set up to build your project and test speech recognition using the Speech service.
1. Build your project, e.g. **"go build"**
2. Run the module and speak a phrase or sentence into your device's microphone. Your speech is transmitted to the Speech service and transcribed to text, which appears in the output.


> [!NOTE]
> The Speech SDK will default to recognizing using en-us for the language, see [Specify source language for speech to text](../../../../how-to-specify-source-language.md) for information on choosing the source language.


## Next steps

[!INCLUDE [footer](./footer.md)]
