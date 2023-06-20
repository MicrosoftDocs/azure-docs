---
author: yulin-li
ms.service: cognitive-services
ms.topic: include
ms.date: 03/13/2022
ms.author: yulili
---

[!INCLUDE [Header](../../common/go.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

### Install the Speech SDK

Before you can do anything, you need to install the [Speech SDK for Go](../../../quickstarts/setup-platform.md?pivots=programming-language-go&tabs=dotnet%252cwindows%252cjre%252cbrowser).

## Text to speech to speaker

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
    subscription := "YourSpeechKey"
    region := "YourSpeechRegion"

	audioConfig, err := audio.NewAudioConfigFromDefaultSpeakerOutput()
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
	speechSynthesizer, err := speech.NewSpeechSynthesizerFromConfig(speechConfig, audioConfig)
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
				fmt.Printf("CANCELED: ErrorCode=%d\nCANCELED: ErrorDetails=[%s]\nCANCELED: Did you set the speech resource key and region values?\n",
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

## Text to speech to in-memory stream

You can use the resulting audio data as an in-memory stream rather than directly writing to a file. With in-memory stream, you can build custom behavior, including:

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
	subscription := "YourSpeechKey"
	region := "YourSpeechRegion"

	speechConfig, err := speech.NewSpeechConfigFromSubscription(subscription, region)
	if err != nil {
		fmt.Println("Got an error: ", err)
		return
	}
	defer speechConfig.Close()
	speechSynthesizer, err := speech.NewSpeechSynthesizerFromConfig(speechConfig, nil)
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

## Select synthesis language and voice

The text to speech feature in the Speech service supports more than 270 voices and more than 110 languages and variants. You can get the [full list](../../../language-support.md?tabs=tts) or try them in the [Voice Gallery](https://speech.microsoft.com/portal/voicegallery).

Specify the language or voice of `SpeechConfig` to match your input text and use the wanted voice:

```go
speechConfig, err := speech.NewSpeechConfigFromSubscription(key, region)
if err != nil {
	fmt.Println("Got an error: ", err)
	return
}
defer speechConfig.Close()

speechConfig.SetSpeechSynthesisLanguage("en-US")
speechConfig.SetSpeechSynthesisVoiceName("en-US-JennyNeural")
```

All neural voices are multilingual and fluent in their own language and English. For example, if the input text in English is "I'm excited to try text to speech" and you set `es-ES-ElviraNeural`, the text is spoken in English with a Spanish accent. If the voice does not speak the language of the input text, the Speech service won't output synthesized audio. See the [full list](../../../language-support.md?tabs=tts) of supported neural voices.

> [!NOTE]
> The default voice is the first voice returned per locale via the [Voice List API](../../../rest-text-to-speech.md#get-a-list-of-voices).

The voice that speaks is determined in order of priority as follows:
- If you don't set `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`, the default voice for `en-US` will speak. 
- If you only set `SpeechSynthesisLanguage`, the default voice for the specified locale will speak. 
- If both `SpeechSynthesisVoiceName` and `SpeechSynthesisLanguage` are set, the `SpeechSynthesisLanguage` setting is ignored. The voice that you specified via `SpeechSynthesisVoiceName` will speak.
- If the voice element is set via [Speech Synthesis Markup Language (SSML)](../../../speech-synthesis-markup.md), the `SpeechSynthesisVoiceName` and `SpeechSynthesisLanguage` settings are ignored.

## Use SSML to customize speech characteristics

You can use Speech Synthesis Markup Language (SSML) to fine-tune the pitch, pronunciation, speaking rate, volume, and more in the text to speech output by submitting your requests from an XML schema. This section shows an example of changing the voice. For a more detailed guide, see the [SSML how-to article](../../../speech-synthesis-markup.md).

To start using SSML for customization, you make a simple change that switches the voice.

First, create a new XML file for the SSML configuration in your root project directory. In this example, it's `ssml.xml`. The root element is always `<speak>`. Wrapping the text in a `<voice>` element allows you to change the voice by using the `name` parameter. See the [full list](../../../language-support.md?tabs=tts) of supported *neural* voices.

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-JennyNeural">
    When you're on the freeway, it's a good idea to use a GPS.
  </voice>
</speak>
```

Next, you need to change the speech synthesis request to reference your XML file. The request is mostly the same, but instead of using the `SpeakTextAsync()` function, you use `SpeakSsmlAsync()`. This function expects an XML string, so you first load your SSML configuration as a string. From here, the result object is exactly the same as previous examples.

> [!NOTE]
> To set the voice without using SSML, you can set the property on  `SpeechConfig` by using `speechConfig.SetSpeechSynthesisVoiceName("en-US-JennyNeural")`.

## Subscribe to synthesizer events

You might want more insights about the text to speech processing and results. For example, you might want to know when the synthesizer starts and stops, or you might want to know about other events encountered during synthesis. 

While using the [SpeechSynthesizer](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go/speech#SpeechSynthesizer) for text to speech, you can subscribe to the events in this table:

[!INCLUDE [Event types](events.md)]

Here's an example that shows how to subscribe to events for speech synthesis. You can follow the instructions in the [quickstart](../../../get-started-text-to-speech.md?pivots=go), but replace the contents of that `speech-synthesis.go` file with the following Go code.

```go
package main

import (
	"fmt"
	"os"
	"time"

	"github.com/Microsoft/cognitive-services-speech-sdk-go/audio"
	"github.com/Microsoft/cognitive-services-speech-sdk-go/common"
	"github.com/Microsoft/cognitive-services-speech-sdk-go/speech"
)

func bookmarkReachedHandler(event speech.SpeechSynthesisBookmarkEventArgs) {
	defer event.Close()
	fmt.Println("BookmarkReached event")
}

func synthesisCanceledHandler(event speech.SpeechSynthesisEventArgs) {
	defer event.Close()
	fmt.Println("SynthesisCanceled event")
}

func synthesisCompletedHandler(event speech.SpeechSynthesisEventArgs) {
	defer event.Close()
	fmt.Println("SynthesisCompleted event")
	fmt.Printf("\tAudioData: %d bytes\n", len(event.Result.AudioData))
	fmt.Printf("\tAudioDuration: %d\n", event.Result.AudioDuration)
}

func synthesisStartedHandler(event speech.SpeechSynthesisEventArgs) {
	defer event.Close()
	fmt.Println("SynthesisStarted event")
}

func synthesizingHandler(event speech.SpeechSynthesisEventArgs) {
	defer event.Close()
	fmt.Println("Synthesizing event")
	fmt.Printf("\tAudioData %d bytes\n", len(event.Result.AudioData))
}

func visemeReceivedHandler(event speech.SpeechSynthesisVisemeEventArgs) {
	defer event.Close()
	fmt.Println("VisemeReceived event")
	fmt.Printf("\tAudioOffset: %dms\n", (event.AudioOffset+5000)/10000)
	fmt.Printf("\tVisemeID %d\n", event.VisemeID)
}

func wordBoundaryHandler(event speech.SpeechSynthesisWordBoundaryEventArgs) {
	defer event.Close()
	boundaryType := ""
	switch event.BoundaryType {
	case 0:
		boundaryType = "Word"
	case 1:
		boundaryType = "Punctuation"
	case 2:
		boundaryType = "Sentence"
	}
	fmt.Println("WordBoundary event")
	fmt.Printf("\tBoundaryType %v\n", boundaryType)
	fmt.Printf("\tAudioOffset: %dms\n", (event.AudioOffset+5000)/10000)
	fmt.Printf("\tDuration %d\n", event.Duration)
	fmt.Printf("\tText %s\n", event.Text)
	fmt.Printf("\tTextOffset %d\n", event.TextOffset)
	fmt.Printf("\tWordLength %d\n", event.WordLength)
}

func main() {
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
	speechKey := os.Getenv("SPEECH_KEY")
	speechRegion := os.Getenv("SPEECH_REGION")

	audioConfig, err := audio.NewAudioConfigFromDefaultSpeakerOutput()
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

	// Required for WordBoundary event sentences.
	speechConfig.SetProperty(common.SpeechServiceResponseRequestSentenceBoundary, "true")

	speechSynthesizer, err := speech.NewSpeechSynthesizerFromConfig(speechConfig, audioConfig)
	if err != nil {
		fmt.Println("Got an error: ", err)
		return
	}
	defer speechSynthesizer.Close()

	speechSynthesizer.BookmarkReached(bookmarkReachedHandler)
	speechSynthesizer.SynthesisCanceled(synthesisCanceledHandler)
	speechSynthesizer.SynthesisCompleted(synthesisCompletedHandler)
	speechSynthesizer.SynthesisStarted(synthesisStartedHandler)
	speechSynthesizer.Synthesizing(synthesizingHandler)
	speechSynthesizer.VisemeReceived(visemeReceivedHandler)
	speechSynthesizer.WordBoundary(wordBoundaryHandler)

	speechSynthesisVoiceName := "en-US-JennyNeural"

	ssml := fmt.Sprintf(`<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'>
            <voice name='%s'>
                <mstts:viseme type='redlips_front'/>
                The rainbow has seven colors: <bookmark mark='colors_list_begin'/>Red, orange, yellow, green, blue, indigo, and violet.<bookmark mark='colors_list_end'/>.
            </voice>
        </speak>`, speechSynthesisVoiceName)

	// Synthesize the SSML
	fmt.Printf("SSML to synthesize: \n\t%s\n", ssml)
	task := speechSynthesizer.SpeakSsmlAsync(ssml)

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
		fmt.Println("SynthesizingAudioCompleted result")
	} else {
		cancellation, _ := speech.NewCancellationDetailsFromSpeechSynthesisResult(outcome.Result)
		fmt.Printf("CANCELED: Reason=%d.\n", cancellation.Reason)

		if cancellation.Reason == common.Error {
			fmt.Printf("CANCELED: ErrorCode=%d\nCANCELED: ErrorDetails=[%s]\nCANCELED: Did you set the speech resource key and region values?\n",
				cancellation.ErrorCode,
				cancellation.ErrorDetails)
		}
	}
}
```

You can find more text to speech samples at [GitHub](https://github.com/microsoft/cognitive-services-speech-sdk-go/tree/master/samples/).

## Run and use a container

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK and Speech CLI. By default, the Speech SDK and Speech CLI use the public Speech service. To use the container, you need to change the initialization method. Use a container host URL instead of key and region.

For more information about containers, see the [speech containers](../../../speech-container-howto.md#host-urls) how-to guide.

