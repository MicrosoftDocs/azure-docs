---
title: How to get facial pose events for lip-sync
titleSuffix: Azure Cognitive Services
description: Speech SDK supports viseme events during speech synthesis, which represent key poses in observed speech, such as the position of the lips, jaw, and tongue when producing a particular phoneme.
services: cognitive-services
author: yulin-li
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 01/23/2022
ms.author: yulili
ms.devlang: cpp, csharp, java, javascript, python
ms.custom: references_regions
zone_pivot_groups: programming-languages-speech-services-nomore-variant
---

# Get facial pose events for lip-sync

> [!NOTE]
> At this time, viseme events are available only for [neural voices](language-support.md#text-to-speech).

A _viseme_ is the visual description of a phoneme in spoken language. It defines the position of the face and mouth when a person speaks a word. Each viseme depicts the key facial poses for a specific set of phonemes. 

You can use visemes to control the movement of 2D and 3D avatar models, so that the mouth movements are perfectly matched to synthetic speech. For example, you can:

 * Create an animated virtual voice assistant for intelligent kiosks, building multi-mode integrated services for your customers.
 * Build immersive news broadcasts and improve audience experiences with natural face and mouth movements.
 * Generate more interactive gaming avatars and cartoon characters that can speak with dynamic content.
 * Make more effective language teaching videos that help language learners understand the mouth behavior of each word and phoneme.
 * People with hearing impairment can also pick up sounds visually and "lip-read" speech content that shows visemes on an animated face.

For more information about visemes, view this [introductory video](https://youtu.be/ui9XT47uwxs).
> [!VIDEO https://www.youtube.com/embed/ui9XT47uwxs]

## Azure Neural TTS can produce visemes with speech

Neural Text-to-Speech (Neural TTS) turns input text or SSML (Speech Synthesis Markup Language) into lifelike synthesized speech. Speech audio output can be accompanied by viseme IDs and their offset timestamps. Each viseme ID specifies a specific pose in observed speech, such as the position of the lips, jaw, and tongue when producing a particular phoneme. Using a 2D or 3D rendering engine, you can use these viseme events to animate your avatar.

The overall workflow of viseme is depicted in the following flowchart:

![Diagram of the overall workflow of viseme.](media/text-to-speech/viseme-structure.png)

*Viseme ID* and *audio offset output* are described in the following table:

| Visme&nbsp;element | Description |
|-----------|-------------|
| Viseme ID | An integer number that specifies a viseme.<br>For English (US), we offer 22 different visemes, each depicting the mouth shape for a specific set of phonemes. There is no one-to-one correspondence between visemes and phonemes. Often, several phonemes correspond to a single viseme, because they look the same on the speaker's face when they're produced, such as `s` and `z`. For more specific information, see the table for [mapping phonemes to viseme IDs](#map-phonemes-to-visemes).  |
| Audio offset | The start time of each viseme, in ticks (100 nanoseconds). |


## Get viseme events with the Speech SDK

To get viseme with your synthesized speech, subscribe to the `VisemeReceived` event in the Speech SDK.

The following snippet shows how to subscribe to the viseme event:

::: zone pivot="programming-language-csharp"

```csharp
using (var synthesizer = new SpeechSynthesizer(speechConfig, audioConfig))
{
    // Subscribes to viseme received event
    synthesizer.VisemeReceived += (s, e) =>
    {
        Console.WriteLine($"Viseme event received. Audio offset: " +
            $"{e.AudioOffset / 10000}ms, viseme id: {e.VisemeId}.");
    };

    var result = await synthesizer.SpeakSsmlAsync(ssml));
}

```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
auto synthesizer = SpeechSynthesizer::FromConfig(speechConfig, audioConfig);

// Subscribes to viseme received event
synthesizer->VisemeReceived += [](const SpeechSynthesisVisemeEventArgs& e)
{
    cout << "viseme event received. "
        // The unit of e.AudioOffset is tick (1 tick = 100 nanoseconds), divide by 10,000 to convert to milliseconds.
        << "Audio offset: " << e.AudioOffset / 10000 << "ms, "
        << "viseme id: " << e.VisemeId << "." << endl;
};

auto result = synthesizer->SpeakSsmlAsync(ssml).get();
```

::: zone-end

::: zone pivot="programming-language-java"

```java
SpeechSynthesizer synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

// Subscribes to viseme received event
synthesizer.VisemeReceived.addEventListener((o, e) -> {
    // The unit of e.AudioOffset is tick (1 tick = 100 nanoseconds), divide by 10,000 to convert to milliseconds.
    System.out.print("Viseme event received. Audio offset: " + e.getAudioOffset() / 10000 + "ms, ");
    System.out.println("viseme id: " + e.getVisemeId() + ".");
});

SpeechSynthesisResult result = synthesizer.SpeakSsmlAsync(ssml).get();
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

# Subscribes to viseme received event
speech_synthesizer.viseme_received.connect(lambda evt: print(
    "Viseme event received: audio offset: {}ms, viseme id: {}.".format(evt.audio_offset / 10000, evt.viseme_id)))

result = speech_synthesizer.speak_ssml_async(ssml).get()
```

::: zone-end

::: zone pivot="programming-language-javascript"

```Javascript
var synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

// Subscribes to viseme received event
synthesizer.visemeReceived = function (s, e) {
    window.console.log("(Viseme), Audio offset: " + e.audioOffset / 10000 + "ms. Viseme ID: " + e.visemeId);
}

synthesizer.speakSsmlAsync(ssml);
```

::: zone-end

::: zone pivot="programming-language-objectivec"

```Objective-C
SPXSpeechSynthesizer *synthesizer =
    [[SPXSpeechSynthesizer alloc] initWithSpeechConfiguration:speechConfig
                                           audioConfiguration:audioConfig];

// Subscribes to viseme received event
[synthesizer addVisemeReceivedEventHandler: ^ (SPXSpeechSynthesizer *synthesizer, SPXSpeechSynthesisVisemeEventArgs *eventArgs) {
    NSLog(@"Viseme event received. Audio offset: %fms, viseme id: %lu.", eventArgs.audioOffset/10000., eventArgs.visemeId);
}];

[synthesizer speakSsml:ssml];
```

::: zone-end

Here is an example of the viseme output.

```text
(Viseme), Viseme ID: 1, Audio offset: 200ms.

(Viseme), Viseme ID: 5, Audio offset: 850ms.

……

(Viseme), Viseme ID: 13, Audio offset: 2350ms.
```

After you obtain the viseme output, you can use these events to drive character animation. You can build your own characters and automatically animate them.

For 2D characters, you can design a character that suits your scenario and use Scalable Vector Graphics (SVG) for each viseme ID to get a time-based face position. With temporal tags that are provided in a viseme event, these well-designed SVGs will be processed with smoothing modifications, and provide robust animation to the users. For example, the following illustration shows a red-lipped character that's designed for language learning.

![Screenshot showing a 2D rendering example of four red-lipped mouths, each representing a different viseme ID that corresponds to a phoneme.](media/text-to-speech/viseme-demo-2D.png)

For 3D characters, think of the characters as string puppets. The puppet master pulls the strings from one state to another and the laws of physics do the rest and drive the puppet to move fluidly. The viseme output acts as a puppet master to provide an action timeline. The animation engine defines the physical laws of action. By interpolating frames with easing algorithms, the engine can further generate high-quality animations.

## Map phonemes to visemes

Visemes vary by language and locale. Each locale has a set of visemes that correspond to its specific phonemes. The [SSML phonetic alphabets](speech-ssml-phonetic-sets.md) documentation maps viseme IDs to the corresponding International Phonetic Alphabet (IPA) phonemes.


## Next steps

> [!div class="nextstepaction"]
> [SSML phonetic alphabets](speech-ssml-phonetic-sets.md)
