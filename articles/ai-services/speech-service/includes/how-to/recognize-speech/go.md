---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 09/01/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/go.md)]

[!INCLUDE [Introduction](intro.md)]

## Recognize speech to text from a microphone

Use the following code sample to run speech recognition from your default device microphone. Replace the variables `subscription` and `region` with your speech key and location/region, respectively. Create a Speech resource on the [Azure portal](https://portal.azure.com). For more information, see [Create a multi-service resource](~/articles/ai-services/multi-service-resource.md?pivots=azportal). Running the script starts a recognition session on your default microphone and output text:

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
    subscription :=  "YourSpeechKey"
    region := "YourSpeechRegion"

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

Run the following commands to create a *go.mod* file that links to components hosted on GitHub:

```cmd
go mod init quickstart
go get github.com/Microsoft/cognitive-services-speech-sdk-go
```

Now build and run the code:

```cmd
go build
go run quickstart
```

For detailed information, see the [reference content for the `SpeechConfig` class](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go@v1.15.0/speech#SpeechConfig) and the [reference content for the `SpeechRecognizer` class](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go@v1.15.0/speech#SpeechRecognizer).

## Recognize speech to text from an audio file

Use the following sample to run speech recognition from an audio file. Replace the variables `subscription` and `region` with your speech key and location/region, respectively. Create a Speech resource on the [Azure portal](https://portal.azure.com). For more information, see [Create a multi-service resource](~/articles/ai-services/multi-service-resource.md?pivots=azportal). Additionally, replace the variable `file` with a path to a *.wav* file. When you run the script, it recognizes speech from the file and output the text result:

```go
package main

import (
	"fmt"
	"time"

	"github.com/Microsoft/cognitive-services-speech-sdk-go/audio"
	"github.com/Microsoft/cognitive-services-speech-sdk-go/speech"
)

func main() {
    subscription :=  "YourSpeechKey"
    region := "YourSpeechRegion"
    file := "path/to/file.wav"

	audioConfig, err := audio.NewAudioConfigFromWavFileInput(file)
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

	task := speechRecognizer.RecognizeOnceAsync()
	var outcome speech.SpeechRecognitionOutcome
	select {
	case outcome = <-task:
	case <-time.After(5 * time.Second):
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

Run the following commands to create a *go.mod* file that links to components hosted on GitHub:

```cmd
go mod init quickstart
go get github.com/Microsoft/cognitive-services-speech-sdk-go
```

Now build and run the code:

```cmd
go build
go run quickstart
```

For detailed information, see the [reference content for the `SpeechConfig` class](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go@v1.15.0/speech#SpeechConfig) and the [reference content for the `SpeechRecognizer` class](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go@v1.15.0/speech#SpeechRecognizer).

## Run and use a container

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK and Speech CLI. By default, the Speech SDK and Speech CLI use the public Speech service. To use the container, you need to change the initialization method. Use a container host URL instead of key and region.

For more information about containers, see [Host URLs](../../../speech-container-howto.md#host-urls) in Install and run Speech containers with Docker.

