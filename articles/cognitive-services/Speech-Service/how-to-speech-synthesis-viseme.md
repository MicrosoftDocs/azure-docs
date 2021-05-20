---
title: How to get facial pose events for lip-sync
titleSuffix: Azure Cognitive Services
description: Speech SDK supports viseme events during speech synthesis, which represent key poses in observed speech, such as the position of the lips, jaw, and tongue when producing a particular phoneme.
services: cognitive-services
author: yulin-li
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/03/2021
ms.author: yulili
ms.custom: references_regions
zone_pivot_groups: programming-languages-speech-services-nomore-variant
---

# Get facial pose events

> [!NOTE]
> Viseme events are only available for `en-US` English (United States) [neural voices](language-support.md#text-to-speech) for now.

A _viseme_ is the visual description of a phoneme in spoken language.
It defines the position of the face and mouth when speaking a word.
Each viseme depicts the key facial poses for a specific set of phonemes.
Viseme can be used to control the movement of 2D and 3D avatar models, perfectly matching mouth movements to synthetic speech.

Viseme greatly expands the number of scenarios by making the avatar easier to use and control. Using visemes, you can create an **animated virtual voice assistant** for intelligent kiosks, building the multi-mode integrative services for your customers; build **immersive news broadcasts** and make content consumption much easier with natural face and mouth movements; generate more **interactive gaming avatars and cartoon characters** that can speak with dynamic content; make more **intuitive language teaching videos** that help language learners to understand the mouth behavior of each word and phoneme. People with hearing impairment can also pick up sounds visually and **"lip-read"** speech content that shows visemes on an animated face.

See the introduction [video](https://www.youtube.com/watch?v=ui9XT47uwxs) of the viseme.

## How viseme works with Azure neural TTS

The viseme turns the input text or SSML (Speech Synthesis Markup Language) into Viseme ID and Audio offset which are used to represent the key poses in observed speech, such as the position of the lips, jaw and tongue when producing a particular phoneme. With the help of a 2D or 3D rendering engine, you can use the viseme output to control the animation of your avatar.

| Parameter | Description |
|-----------|-------------|
| Viseme ID | Integer number that specifies a viseme. In English (United States), we offer 22 different visemes to depict the mouth shapes for a specific set of phonemes. There is no one-to-one correspondence between visemes and phonemes. Often several phonemes correspond to a single viseme, as several phonemes look the same on the face when produced, such as `s` and `z`. See the [mapping table between Viseme ID and phonemes](#map-phonemes-to-visemes).  |
| Audio offset | The start time of each viseme, in ticks (100 nanoseconds). |

Here is an example of the viseme output.

(Viseme), Viseme ID: 1, Audio offset: 200ms.

(Viseme), Viseme ID: 5, Audio offset: 850ms.          

……

(Viseme), Viseme ID: 13, Audio offset: 2350ms.

 
## Get viseme events with the Speech SDK

This feature is built into the Speech SDK. With just a few lines of code, you can easily enable facial and mouth animation using the viseme events together with your TTS output. 

To get viseme events, please subscribe to the `VisemeReceived` event in Speech SDK.
The following snippets show how to subscribe the viseme event.

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

## Map phonemes to visemes

Visemes vary by language. Each language has a set of visemes that correspond to its specific phonemes. The following table shows the correspondence between International Phonetic Alphabet (IPA) phonemes and viseme IDs for English (United States).

| IPA | Example | Viseme ID |
|-----|---------|-----------|
| i	  |	**ea**t   | 6 |
| ɪ	  | **i**f | 6 |
| eɪ  | **a**te | 4 |
| ɛ | **e**very | 4 |
|æ	|	**a**ctive	      |1|
|ɑ	|	**o**bstinate	  |2|
|ɔ	|	c**au**se	      |3|
|ʊ	|	b**oo**k	      |4|
|oʊ	|	**o**ld	          |8|
|u	|	**U**ber	      |7|
|ʌ	|	**u**ncle	      |1|
|aɪ	|	**i**ce	          |11|
|aʊ	|	**ou**t	          |9|
|ɔɪ	|	**oi**l	          |10|
|ju	|	**Yu**ma	      |[6, 7]|
|ə	|	**a**go	          |1|
|ɪɹ	|	**ear**s	      |[6, 13]|
|ɛɹ	|	**air**plane	  |[4, 13]|
|ʊɹ	|	c**ur**e	      |[4, 13]|
|aɪ(ə)ɹ	|	**Ire**land	  |[11, 13]|
|aʊ(ə)ɹ	|	**hour**s	  |[9, 13]|
|ɔɹ	|	**or**ange	      |[3, 13]|
|ɑɹ	|	**ar**tist	      |[2, 13]|
|ɝ	|	**ear**th	      |[5, 13]|
|ɚ	|	all**er**gy	      |[1, 13]|
|w	|	**w**ith, s**ue**de	  |7|
|j	|	**y**ard, f**e**w	  |6|
|p	|	**p**ut	          |21|
|b	|	**b**ig	          |21|
|t	|	**t**alk	      |19|
|d	|	**d**ig	          |19|
|k	|	**c**ut	          |20|
|g	|	**g**o	          |20|
|m	|	**m**at, s**m**ash	  |21|
|n	|	**n**o, s**n**ow	  |19|
|ŋ	|	li**n**k	      |20|
|f	|	**f**ork	      |18|
|v	|	**v**alue	      |18|
|θ	|	**th**in	      |17|
|ð	|	**th**en	      |17|
|s	|	**s**it	          |15|
|z	|	**z**ap	          |15|
|ʃ	|	**sh**e	          |16|
|ʒ	|	**J**acques	      |16|
|h	|	**h**elp	      |12|
|tʃ	|	**ch**in	      |16|
|dʒ	|	**j**oy	          |16|
|l	|	**l**id, g**l**ad	  |14|
|ɹ	|	**r**ed, b**r**ing	  |13|


## Next steps

* [Speech SDK reference documentation](speech-sdk.md)
