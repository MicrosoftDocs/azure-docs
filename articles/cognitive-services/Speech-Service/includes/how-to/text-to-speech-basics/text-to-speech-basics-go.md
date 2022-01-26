---
author: yulin-li
ms.service: cognitive-services
ms.topic: include
ms.date: 07/02/2021
ms.author: yulili
---

In this quickstart, you learn common design patterns for doing text-to-speech synthesis by using the Speech SDK.

## Skip to samples on GitHub

If you want to skip straight to sample code, see the [Go quickstart samples](https://github.com/microsoft/cognitive-services-speech-sdk-go/tree/master/samples/synthesizer) on GitHub.

## Prerequisites

This article assumes that you have an Azure account and a Speech service subscription. If you don't have an account and a subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

### Install the Speech SDK

Before you can do anything, you need to install the [Speech SDK for Go](../../../quickstarts/setup-platform.md?pivots=programming-language-go&tabs=dotnet%252cwindows%252cjre%252cbrowser).

## Text-to-speech to speaker

Use the following code sample to run speech synthesis to your default audio output device. Replace the variables `subscription` and `region` with your speech key and location/region. Running the script will speak your input text to the default speaker.

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/Microsoft/cognitive-services-speech-sdk-go/audio"
	"github.com/Microsoft/cognitive-services-speech-sdk-go/common"
	"github.com/Microsoft/cognitive-services-speech-sdk-go/speech"
)

func synthesizeStartedHandler(event speech.SpeechSynthesisEventArgs) {
	defer event.Close()
	fmt.Println("Synthesis started.")
}

func synthesizingHandler(event speech.SpeechSynthesisEventArgs) {
	defer event.Close()
	fmt.Printf("Synthesizing, audio chunk size %d.\n", len(event.Result.AudioData))
}

func synthesizedHandler(event speech.SpeechSynthesisEventArgs) {
	defer event.Close()
	fmt.Printf("Synthesized, audio length %d.\n", len(event.Result.AudioData))
}

func cancelledHandler(event speech.SpeechSynthesisEventArgs) {
	defer event.Close()
	fmt.Println("Received a cancellation.")
}

func main() {
    subscription := "<paste-your-speech-key-here>"
    region := "<paste-your-speech-location/region-here>"

	audioConfig, err := audio.NewAudioConfigFromDefaultSpeakerOutput()
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
	speechSynthesizer, err := speech.NewSpeechSynthesizerFromConfig(config, audioConfig)
	if err != nil {
		fmt.Println("Got an error: ", err)
		return
	}
	defer speechSynthesizer.Close()

	speechSynthesizer.SynthesisStarted(synthesizeStartedHandler)
	speechSynthesizer.Synthesizing(synthesizingHandler)
	speechSynthesizer.SynthesisCompleted(synthesizedHandler)
	speechSynthesizer.SynthesisCanceled(cancelledHandler)

	for {
		fmt.Printf("Enter some text that you want to speak, or enter empty text to exit.\n> ")
		text, _ := bufio.NewReader(os.Stdin).ReadString('\n')
		text = strings.TrimSuffix(text, "\n")
		if len(text) == 0 {
			break
		}

		task := speechSynthesizer.SpeakTextAsync(text)
		var outcome speech.SpeechSynthesisOutcome
		select {
		case outcome = <-task:
		case <-time.After(60 * time.Second):
			fmt.Println("Timed out")
			return
		}
		defer outcome.Close()
		if outcome.Error != nil {
			fmt.Println("Got an error: ", outcome.Error)
			return
		}

		if outcome.Result.Reason == common.SynthesizingAudioCompleted {
			fmt.Printf("Speech synthesized to speaker for text [%s].\n", text)
		} else {
			cancellation, _ := speech.NewCancellationDetailsFromSpeechSynthesisResult(outcome.Result)
			fmt.Printf("CANCELED: Reason=%d.\n", cancellation.Reason)

			if cancellation.Reason == common.Error {
				fmt.Printf("CANCELED: ErrorCode=%d\nCANCELED: ErrorDetails=[%s]\nCANCELED: Did you update the subscription info?\n",
					cancellation.ErrorCode,
					cancellation.ErrorDetails)
			}
		}
	}
}
```

Run the following commands to create a *go.mod* file that links to components hosted on GitHub:

```shell
go mod init quickstart
go get github.com/Microsoft/cognitive-services-speech-sdk-go
```

Now build and run the code:

```shell
go build
go run quickstart
```

For detailed information about the classes, see the [`SpeechConfig`](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#SpeechConfig) and [`SpeechSynthesizer`](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#SpeechSynthesizer) reference docs.

## Text-to-speech to in-memory stream

For many scenarios in speech application development, you likely need the resulting audio data as an in-memory stream rather than directly writing to a file. This will allow you to build custom behavior, including:

* Abstract the resulting byte array as a seekable stream for custom downstream services.
* Integrate the result with other APIs or services.
* Modify the audio data, write custom .wav headers, and do related tasks.

It's simple to make this change from the previous example. First, remove the `AudioConfig` block, because you'll manage the output behavior manually from this point onward for increased control. Then pass `nil` for `AudioConfig` in the `SpeechSynthesizer` constructor.

> [!NOTE]
> Passing `NULL` for `AudioConfig`, rather than omitting it as you did in the previous speaker output example, will not play the audio by default on the current active output device.

This time, save the result to a [`SpeechSynthesisResult`](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#SpeechSynthesisResult) variable. The `AudioData` property returns a `[]byte` instance for the output data. You can work with this `[]byte` instance manually, or you can use the [`AudioDataStream`](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#AudioDataStream) class to manage the in-memory stream.
In this example, you use the `NewAudioDataStreamFromSpeechSynthesisResult()` static function to get a stream from the result.

Replace the variables `subscription` and `region` with your speech key and location/region:

```go
package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strings"
	"time"

	"github.com/Microsoft/cognitive-services-speech-sdk-go/speech"
)

func main(subscription string, region string) {
    subscription := "<paste-your-speech-key-here>"
    region := "<paste-your-speech-location/region-here>"

	config, err := speech.NewSpeechConfigFromSubscription(subscription, region)
	if err != nil {
		fmt.Println("Got an error: ", err)
		return
	}
	defer config.Close()
	speechSynthesizer, err := speech.NewSpeechSynthesizerFromConfig(config, nil)
	if err != nil {
		fmt.Println("Got an error: ", err)
		return
	}
	defer speechSynthesizer.Close()

	speechSynthesizer.SynthesisStarted(synthesizeStartedHandler)
	speechSynthesizer.Synthesizing(synthesizingHandler)
	speechSynthesizer.SynthesisCompleted(synthesizedHandler)
	speechSynthesizer.SynthesisCanceled(cancelledHandler)

	for {
		fmt.Printf("Enter some text that you want to speak, or enter empty text to exit.\n> ")
		text, _ := bufio.NewReader(os.Stdin).ReadString('\n')
		text = strings.TrimSuffix(text, "\n")
		if len(text) == 0 {
			break
		}

		// StartSpeakingTextAsync sends the result to channel when the synthesis starts.
		task := speechSynthesizer.StartSpeakingTextAsync(text)
		var outcome speech.SpeechSynthesisOutcome
		select {
		case outcome = <-task:
		case <-time.After(60 * time.Second):
			fmt.Println("Timed out")
			return
		}
		defer outcome.Close()
		if outcome.Error != nil {
			fmt.Println("Got an error: ", outcome.Error)
			return
		}

		// In most cases, we want to streaming receive the audio to lower the latency.
		// We can use AudioDataStream to do so.
		stream, err := speech.NewAudioDataStreamFromSpeechSynthesisResult(outcome.Result)
		defer stream.Close()
		if err != nil {
			fmt.Println("Got an error: ", err)
			return
		}

		var all_audio []byte
		audio_chunk := make([]byte, 2048)
		for {
			n, err := stream.Read(audio_chunk)

			if err == io.EOF {
				break
			}

			all_audio = append(all_audio, audio_chunk[:n]...)
		}

		fmt.Printf("Read [%d] bytes from audio data stream.\n", len(all_audio))
	}
}
```

Run the following commands to create a *go.mod* file that links to components hosted on GitHub:

```shell
go mod init quickstart
go get github.com/Microsoft/cognitive-services-speech-sdk-go
```

Now build and run the code:

```shell
go build
go run quickstart
```

For detailed information about the classes, see the [`SpeechConfig`](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#SpeechConfig) and [`SpeechSynthesizer`](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#SpeechSynthesizer) reference docs.

## Use SSML to customize speech characteristics

You can use Speech Synthesis Markup Language (SSML) to fine-tune the pitch, pronunciation, speaking rate, volume, and more in the text-to-speech output by submitting your requests from an XML schema. This section shows an example of changing the voice. For a more detailed guide, see the [SSML how-to article](../../../speech-synthesis-markup.md).

To start using SSML for customization, you make a simple change that switches the voice.

First, create a new XML file for the SSML configuration in your root project directory. In this example, it's `ssml.xml`. The root element is always `<speak>`. Wrapping the text in a `<voice>` element allows you to change the voice by using the `name` parameter. See the [full list](../../../language-support.md#prebuilt-neural-voices) of supported *neural* voices.

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-JennyNeural">
    When you're on the freeway, it's a good idea to use a GPS.
  </voice>
</speak>
```

Next, you need to change the speech synthesis request to reference your XML file. The request is mostly the same, but instead of using the `SpeakTextAsync()` function, you use `SpeakSsmlAsync()`. This function expects an XML string, so you first load your SSML configuration as a string. From here, the result object is exactly the same as previous examples.

> [!NOTE]
> To change the voice without using SSML, you can set the property on  `SpeechConfig` by using `speechConfig.SetSpeechSynthesisVoiceName("en-US-JennyNeural")`.

## Get facial pose events

Speech can be a good way to drive the animation of facial expressions.
[Visemes](../../../how-to-speech-synthesis-viseme.md) are often used to represent the key poses in observed speech. Key poses include the position of the lips, jaw, and tongue in producing a particular phoneme.

You can subscribe to viseme events in the Speech SDK. Then, you can apply viseme events to animate the face of a character as speech audio plays.
Learn [how to get viseme events](../../../how-to-speech-synthesis-viseme.md#get-viseme-events-with-the-speech-sdk).
