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
> Viseme ID supports [all neural voices](language-support.md#text-to-speech) in [all supported locales](language-support.md#viseme), including custom neural voice. Scalable Vector Graphics (SVG) only supports prebuilt neural voices in `en-US` locale, and blendshapes supports prebuilt neural voices in `en-US` and `zh-CN` locales. SVG and blendshapes don't support custom neural voice.

A _viseme_ is the visual description of a phoneme in spoken language. It defines the position of the face and mouth when a person speaks a word. Each viseme depicts the key facial poses for a specific set of phonemes.

You can use visemes to control the movement of 2D and 3D avatar models, so that the mouth movements are perfectly matched to synthetic speech. For example, you can:

 * Create an animated virtual voice assistant for intelligent kiosks, building multi-mode integrated services for your customers.
 * Build immersive news broadcasts and improve audience experiences with natural face and mouth movements.
 * Generate more interactive gaming avatars and cartoon characters that can speak with dynamic content.
 * Make more effective language teaching videos that help language learners understand the mouth behavior of each word and phoneme.
 * People with hearing impairment can also pick up sounds visually and "lip-read" speech content that shows visemes on an animated face.

For more information about visemes, view this [introductory video](https://youtu.be/ui9XT47uwxs).
> [!VIDEO https://www.youtube.com/embed/ui9XT47uwxs]

## Overall workflow of producing viseme with speech

Neural Text-to-Speech (Neural TTS) turns input text or SSML (Speech Synthesis Markup Language) into lifelike synthesized speech. Speech audio output can be accompanied by viseme ID, Scalable Vector Graphics (SVG), and blendshapes. Using a 2D or 3D rendering engine, you can use these viseme events to animate your avatar.

The overall workflow of viseme is depicted in the following flowchart:

![Diagram of the overall workflow of viseme.](media/text-to-speech/viseme-structure.png)

You can request viseme output in SSML. For details, see [how to use viseme element in SSML](speech-synthesis-markup.md#viseme-element).

## Viseme ID

Viseme ID refers to an integer number that specifies a viseme. We offer 22 different visemes, each depicting the mouth shape for a specific set of phonemes. There's no one-to-one correspondence between visemes and phonemes. Often, several phonemes correspond to a single viseme, because they look the same on the speaker's face when they're produced, such as `s` and `z`. For more specific information, see the table for [mapping phonemes to viseme IDs](#map-phonemes-to-visemes).

Speech audio output can be accompanied by viseme IDs and `Audio offset`. The `Audio offset` indicates the offset timestamp that represents the start time of each viseme, in ticks (100 nanoseconds).

### Map phonemes to visemes

Visemes vary by language and locale. Each locale has a set of visemes that correspond to its specific phonemes. The [SSML phonetic alphabets](speech-ssml-phonetic-sets.md) documentation maps viseme IDs to the corresponding International Phonetic Alphabet (IPA) phonemes.

## 2D SVG animation

For 2D characters, you can design a character that suits your scenario and use Scalable Vector Graphics (SVG) for each viseme ID to get a time-based face position.

With temporal tags that are provided in a viseme event, these well-designed SVGs will be processed with smoothing modifications, and provide robust animation to the users. For example, the following illustration shows a red-lipped character that's designed for language learning.

![Screenshot showing a 2D rendering example of four red-lipped mouths, each representing a different viseme ID that corresponds to a phoneme.](media/text-to-speech/viseme-demo-2D.png)

## 3D blendshapes animation

For 3D characters, you can design a character that suits your scenario and use blendshapes to drive the facial movement of your character.

The blendshapes is two dimension D matrix, and each row represents a blendshapes facial status of a frame (in 60 Hz).

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

        // `Animation` is an xml string for SVG or a json string for blendshapes
        var animation = e.Animation;
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

    // `Animation` is an xml string for SVG or a json string for blendshapes
    auto animation = e.Animation;
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

    // `Animation` is an xml string for SVG or a json string for blendshapes
    String animation = e.getAnimation();
});

SpeechSynthesisResult result = synthesizer.SpeakSsmlAsync(ssml).get();
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

def viseme_cb(evt):
    print("Viseme event received: audio offset: {}ms, viseme id: {}.".format(
        evt.audio_offset / 10000, evt.viseme_id))

    # `Animation` is an xml string for SVG or a json string for blendshapes
    animation = evt.animation

# Subscribes to viseme received event
speech_synthesizer.viseme_received.connect(viseme_cb)

result = speech_synthesizer.speak_ssml_async(ssml).get()
```

::: zone-end

::: zone pivot="programming-language-javascript"

```Javascript
var synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

// Subscribes to viseme received event
synthesizer.visemeReceived = function (s, e) {
    window.console.log("(Viseme), Audio offset: " + e.audioOffset / 10000 + "ms. Viseme ID: " + e.visemeId);

    // `Animation` is an xml string for SVG or a json string for blendshapes
    var animation = e.Animation;
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

    // `Animation` is an xml string for SVG or a json string for blendshapes
    NSString *animation = eventArgs.Animation;
}];

[synthesizer speakSsml:ssml];
```

::: zone-end

Here's an example of the viseme output.

# [Viseme ID](#tab/visemeid)

```text
(Viseme), Viseme ID: 1, Audio offset: 200ms.

(Viseme), Viseme ID: 5, Audio offset: 850ms.

……

(Viseme), Viseme ID: 13, Audio offset: 2350ms.
```

# [2D SVG](#tab/2dsvg)

The SVG output is a xml string that contains the animation.
Render the SVG animation along with the synthesized speech to see the mouth movement.

```xml
<svg width= "1200px" height= "1200px" ..>
  <g id= "front_start" stroke= "none" stroke-width= "1" fill= "none" fill-rule= "evenodd">
    <animate attributeName= "d" begin= "d_dh_front_background_1_0.end" dur= "0.27500
    ...
```

# [3D blendshapes](#tab/3dblendshapes)

The output json looks like the following sample, where each row of the `BlendShapes` is an array with 55 numbers. Each number in the array can vary between 0 to 1. The order of numbers is in line with the order of 'BlendShapes'.

```json
{
    "FrameIndex":0,
    "BlendShapes":[
        [0.021,0.321,...,0.258],
        [0.045,0.234,...,0.288],
        ...
    ]
}
```

The order of `BlendShapes` is as follows.

eyeBlinkLeft<br>
eyeLookDownLeft<br>
eyeLookInLeft<br>
eyeLookOutLeft<br>
eyeLookUpLeft<br>
eyeSquintLeft<br>
eyeWideLeft<br>
eyeBlinkRight<br>
eyeLookDownRight<br>
eyeLookInRight<br>
eyeLookOutRight<br>
eyeLookUpRight<br>
eyeSquintRight<br>
eyeWideRight<br>
jawForward<br>
jawLeft<br>
jawRight<br>
jawOpen<br>
mouthClose<br>
mouthFunnel<br>
mouthPucker<br>
mouthLeft<br>
mouthRight<br>
mouthSmileLeft<br>
mouthSmileRight<br>
mouthFrownLeft<br>
mouthFrownRight<br>
mouthDimpleLeft<br>
mouthDimpleRight<br>
mouthStretchLeft<br>
mouthStretchRight<br>
mouthRollLower<br>
mouthRollUpper<br>
mouthShrugLower<br>
mouthShrugUpper<br>
mouthPressLeft<br>
mouthPressRight<br>
mouthLowerDownLeft<br>
mouthLowerDownRight<br>
mouthUpperUpLeft<br>
mouthUpperUpRight<br>
browDownLeft<br>
browDownRight<br>
browInnerUp<br>
browOuterUpLeft<br>
browOuterUpRight<br>
cheekPuff<br>
cheekSquintLeft<br>
cheekSquintRight<br>
noseSneerLeft<br>
noseSneerRight<br>
tongueOut<br>
headRoll<br>
leftEyeRoll<br>
rightEyeRoll

---

After you obtain the viseme output, you can use these events to drive character animation. You can build your own characters and automatically animate them.

## Next steps

- [SSML phonetic alphabets](speech-ssml-phonetic-sets.md)
- [How to improve synthesis with SSML](speech-synthesis-markup.md)
