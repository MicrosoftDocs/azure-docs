---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/go.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

> [!div class="nextstepaction"]
> [I have the prerequisites](~/articles/ai-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-go)
> [I ran into an issue](~/articles/ai-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-go)

## Set up the environment

Install the [Speech SDK for Go](../../../quickstarts/setup-platform.md?pivots=programming-language-go&tabs=dotnet%252cwindows%252cjre%252cbrowser).

> [!div class="nextstepaction"]
> [I have the tools I need](~/articles/ai-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-go)
> [I ran into an issue](~/articles/ai-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-go)

## Recognize speech from a microphone

Follow these steps to create a new GO module.

1. Open a command prompt where you want the new module, and create a new file named `speech-recognition.go`.
1. Replace the contents of `speech-recognition.go` with the following code.

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
    }

    func main() {
        subscription :=  "YourSubscriptionKey"
        region := "YourServiceRegion"

        audioConfig, err := audio.NewAudioConfigFromDefaultMicrophoneInput()
        if err != nil {
            fmt.Println("Got an error: ", err)
            return
        }
        defer audioConfig.Close()
        speechConfig, err := speech.NewSpeechConfigFromSubscription(subscription, region)
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

1. In `speech-recognition.go`, replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region.

Run the following commands to create a `go.mod` file that links to components hosted on GitHub:

```cmd
go mod init speech-recognition
go get github.com/Microsoft/cognitive-services-speech-sdk-go
```

Now build and run the code:

```cmd
go build
go run speech-recognition
```

> [!div class="nextstepaction"]
> [My speech was recognized](~/articles/ai-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-go)
> [I ran into an issue](~/articles/ai-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-go)


## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
