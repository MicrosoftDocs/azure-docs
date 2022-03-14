---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 9/22/2020
ms.author: eur
---

[!INCLUDE [Header](../../common/objectivec.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

### Install the Speech SDK and samples

The [Azure-Samples/cognitive-services-speech-sdk](https://github.com/Azure-Samples/cognitive-services-speech-sdk) repository contains samples written in Objective-C for iOS and Mac. Select a link to see installation instructions for each sample:

* [Synthesize speech in Objective-C on macOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/macos/text-to-speech)
* [Synthesize speech in Objective-C on iOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/ios/text-to-speech)
* [Additional samples for Objective-C on iOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/objective-c/ios)

## Get position information

Your project might need to know when a word is spoken by text-to-speech so that it can take specific action based on that timing. For example, if you want to highlight words as they're spoken, you need to know what to highlight, when to highlight it, and for how long to highlight it.

You can accomplish this by using the `WordBoundary` event within `SpeechSynthesizer`. This event is raised at the beginning of each new spoken word. It provides a time offset within the spoken stream and a text offset within the input prompt:

* `AudioOffset` reports the output audio's elapsed time between the beginning of synthesis and the start of the next word. This is measured in hundred-nanosecond units (HNS), with 10,000 HNS equivalent to 1 millisecond.
* `WordOffset` reports the character position in the input string (original text or [SSML](../../../speech-synthesis-markup.md)) immediately before the word that's about to be spoken.

> [!NOTE]
> `WordBoundary` events are raised as the output audio data becomes available, which will be faster than playback to an output device. The caller must appropriately synchronize streaming and real time.

You can find examples of using `WordBoundary` in the [text-to-speech samples](https://aka.ms/csspeech/samples) on GitHub.