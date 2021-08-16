---
author: yulin-li
ms.service: cognitive-services
ms.topic: include
ms.date: 07/02/2021
ms.author: yulili
---

In this quickstart, you learn common design patterns for doing text-to-speech synthesis using the Speech SDK.

## Skip to samples on GitHub

If you want to skip straight to sample code, see the [Go quickstart samples](https://github.com/microsoft/cognitive-services-speech-sdk-go/tree/master/samples/synthesizer) on GitHub.

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

## Install the Speech SDK


Before you can do anything, you'll need to install the [Speech SDK for Go](../../../quickstarts/setup-platform.md?pivots=programming-language-go&tabs=dotnet%252cwindows%252cjre%252cbrowser).

## Text-to-speech to speaker

Use the following code sample to run speech synthesis to your default audio output device.
Replace the variables `subscription` and `region` with your speech key and location/region.
Running the script will speak your input text to default speaker.

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

Run the following commands to create a `go.mod` file that links to components hosted on GitHub.

```shell
go mod init quickstart
go get github.com/Microsoft/cognitive-services-speech-sdk-go
```

Now build and run the code.

```shell
go build
go run quickstart
```

See the reference docs for detailed information on the [`SpeechConfig`](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#SpeechConfig) and [`SpeechSynthesizer`](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#SpeechSynthesizer) classes.

## Text-to-speech to in-memory stream

For many scenarios in speech application development, you likely need the resulting audio data as an in-memory stream rather than directly writing to a file.
This will allow you to build custom behavior including:

* Abstract the resulting byte array as a seek-able stream for custom downstream services.
* Integrate the result with other API's or services.
* Modify the audio data, write custom `.wav` headers, etc.

It's simple to make this change from the previous example. First, remove the `AudioConfig`, as you will manage the output behavior manually from this point onward for increased control. Then pass `nil` for the `AudioConfig` in the `SpeechSynthesizer` constructor.

> [!NOTE]
> Passing `nil` for the `AudioConfig`, rather than omitting it like in the speaker output example above, will not play the audio by default on the current active output device.

This time, you save the result to a [`SpeechSynthesisResult`](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#SpeechSynthesisResult) variable.
The `AudioData` property returns a `[]byte` of the output data. You can work with this `[]byte` manually, or you can use the [`AudioDataStream`](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#AudioDataStream) class to manage the in-memory stream.
In this example, you use the `NewAudioDataStreamFromSpeechSynthesisResult()` static function to get a stream from the result.

Replace the variables `subscription` and `region` with your speech key and location/region.

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

		// in most case we want to streaming receive the audio to lower the latency,
		// we can use AudioDataStream to do so.
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

Run the following commands to create a `go.mod` file that links to components hosted on GitHub.

```shell
go mod init quickstart
go get github.com/Microsoft/cognitive-services-speech-sdk-go
```

Now build and run the code.

```shell
go build
go run quickstart
```

See the reference docs for detailed information on the [`SpeechConfig`](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#SpeechConfig) and [`SpeechSynthesizer`](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#SpeechSynthesizer) classes.

## Use SSML to customize speech characteristics

Speech Synthesis Markup Language (SSML) allows you to fine-tune the pitch, pronunciation, speaking rate, volume, and more of the text-to-speech output by submitting your requests from an XML schema. This section shows an example of changing the voice, but for a more detailed guide, see the [SSML how-to article](../../../speech-synthesis-markup.md).

To start using SSML for customization, you make a simple change that switches the voice.
First, create a new XML file for the SSML config in your root project directory, in this example `ssml.xml`. The root element is always `<speak>`, and wrapping the text in a `<voice>` element allows you to change the voice using the `name` param. See the [full list](../../../language-support.md#neural-voices) of supported **neural** voices.

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AriaNeural">
    When you're on the freeway, it's a good idea to use a GPS.
  </voice>
</speak>
```

Next, you need to change the speech synthesis request to reference your XML file.
The request is mostly the same, but instead of using the `SpeakTextAsync()` function, you use `SpeakSsmlAsync()`. This function expects an XML string, so you first load your SSML config as a string. From here, the result object is exactly the same as previous examples.

> [!NOTE]
> To change the voice without using SSML, you can set the property on the `SpeechConfig` by using `speechConfig.SetSpeechSynthesisVoiceName("en-US-AriaNeural")`

## Get facial pose events

Speech can be a good way to drive the animation of facial expressions.
Often [visemes](../../../how-to-speech-synthesis-viseme.md) are used to represent the key poses in observed speech, such as the position of the lips, jaw and tongue when producing a particular phoneme.
You can subscribe the viseme event in Speech SDK.
Then, you can apply viseme events to animate the face of a character as speech audio plays.
Learn [how to get viseme events](../../../how-to-speech-synthesis-viseme.md#get-viseme-events-with-the-speech-sdk).
