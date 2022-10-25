---
title: Speech Synthesis Markup Language (SSML) - Speech service
titleSuffix: Azure Cognitive Services
description: Use the Speech Synthesis Markup Language to control pronunciation and prosody in text-to-speech.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 09/24/2022
ms.author: eur
---

# Improve synthesis with Speech Synthesis Markup Language (SSML)

Speech Synthesis Markup Language (SSML) is an XML-based markup language that lets developers specify how input text is converted into synthesized speech by using text-to-speech. Compared to plain text, SSML allows developers to fine-tune the pitch, pronunciation, speaking rate, volume, and more of the text-to-speech output. Normal punctuation, such as pausing after a period, or using the correct intonation when a sentence ends with a question mark are automatically handled.

> [!TIP]
> Author plain text and SSML using the [Audio Content Creation](https://aka.ms/audiocontentcreation) tool in Speech Studio. You can listen to the output audio and adjust the SSML to improve speech synthesis. For more information, see [Speech synthesis with the Audio Content Creation tool](how-to-audio-content-creation.md).

The Speech service implementation of SSML is based on the World Wide Web Consortium's [Speech Synthesis Markup Language Version 1.0](https://www.w3.org/TR/2004/REC-speech-synthesis-20040907/).

> [!IMPORTANT]
> You're billed for each character that's converted to speech, including punctuation. Although the SSML document itself is not billable, optional elements that are used to adjust how the text is converted to speech, like phonemes and pitch, are counted as billable characters. For more information, see [text-to-speech pricing notes](text-to-speech.md#pricing-note).

## Prebuilt neural voices and custom neural voices

Use a humanlike neural voice or create your own custom neural voice unique to your product or brand. For a complete list of supported languages, locales, and voices, see [Language support](language-support.md?tabs=stt-tts?tabs=stt-tts). To learn more about using a prebuilt neural voice and a custom neural voice, see [Text-to-speech overview](text-to-speech.md).

> [!NOTE]
> You can hear voices in different styles and pitches reading example text by using this [text-to-speech website](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#features).

## Special characters

When you use SSML, keep in mind that special characters, such as quotation marks, apostrophes, and brackets, must be escaped. For more information, see [Extensible Markup Language (XML) 1.0: Appendix D](https://www.w3.org/TR/xml/#sec-entexpand).

## Supported SSML elements

Each SSML document is created with SSML elements (or tags). These elements are used to adjust pitch, prosody, volume, and more. The following sections detail how each element is used and when an element is required or optional.

> [!IMPORTANT]
> Don't forget to use double quotation marks around attribute values. Standards for well-formed, valid XML requires attribute values to be enclosed in double quotation marks. For example, `<prosody volume="90">` is a well-formed, valid element, but `<prosody volume=90>` is not. SSML might not recognize attribute values that aren't in double quotation marks.

## Create an SSML document

The `speak` element is the root element. It's *required* for all SSML documents. The `speak` element contains important information, such as version, language, and the markup vocabulary definition.

**Syntax**

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="string"></speak>
```

**Attributes**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `version` | Indicates the version of the SSML specification used to interpret the document markup. The current version is 1.0.| Required|
| `xml:lang` | Specifies the language of the root document. The value can contain a lowercase, two-letter language code, for example, `en`. Or the value can contain the language code and uppercase country/region, for example, `en-US`. | Required |
| `xmlns` | Specifies the URI to the document that defines the markup vocabulary (the element types and attribute names) of the SSML document. The current URI is http://www.w3.org/2001/10/synthesis. | Required |

## Choose a voice for text-to-speech

The `voice` element is required. It's used to specify the voice that's used for text-to-speech.

**Syntax**

```xml
<voice name="string">
    This text will get converted into synthesized speech.
</voice>
```

**Attribute**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `name`    | Identifies the voice used for text-to-speech output. For a complete list of supported voices, see [Language support](language-support.md?tabs=stt-tts). | Required             |

**Example**

This example uses the `en-US-JennyNeural` voice. For a complete list of supported voices, see [Language support](language-support.md?tabs=stt-tts).

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        This is the text that is spoken.
    </voice>
</speak>
```

## Use multiple voices

Within the `speak` element, you can specify multiple voices for text-to-speech output. These voices can be in different languages. For each voice, the text must be wrapped in a `voice` element.

**Attribute**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `name`    | Identifies the voice used for text-to-speech output. For a complete list of supported voices, see [Language support](language-support.md?tabs=stt-tts). | Required             |

**Example**

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        Good morning!
    </voice>
    <voice name="en-US-ChristopherNeural">
        Good morning to you too Jenny!
    </voice>
</speak>
```

## Adjust speaking styles

By default, text-to-speech synthesizes text by using a neutral speaking style for neural voices. You can adjust the speaking style, style degree, and role at the sentence level.

Styles, style degree, and roles are supported for a subset of neural voices. If a style or role isn't supported, the service uses the default neutral speech. To determine what styles and roles are supported for each voice, use:

- The [Voice styles and roles](language-support.md?tabs=stt-tts#voice-styles-and-roles) table.
- The [Voice List API](rest-text-to-speech.md#get-a-list-of-voices).
- The code-free [Audio Content Creation](https://aka.ms/audiocontentcreation) portal.

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `style` | Specifies the speaking style. Speaking styles are voice specific. | Required if adjusting the speaking style for a neural voice. If you're using `mstts:express-as`, the style must be provided. If an invalid value is provided, this element is ignored.       |
| `styledegree` | Specifies the intensity of the speaking style. **Accepted values**: 0.01 to 2 inclusive. The default value is 1, which means the predefined style intensity. The minimum unit is 0.01, which results in a slight tendency for the target style. A value of 2 results in a doubling of the default style intensity. | Optional. If you don't set the `style` attribute, the `styledegree` attribute is ignored. Speaking style degree adjustments are supported for Chinese (Mandarin, Simplified) neural voices.|
| `role`| Specifies the speaking role-play. The voice acts as a different age and gender, but the voice name isn't changed. | Optional. Role adjustments are supported for these Chinese (Mandarin, Simplified) neural voices: `zh-CN-XiaomoNeural`, `zh-CN-XiaoxuanNeural`, `zh-CN-YunxiNeural`, and `zh-CN-YunyeNeural`. |

### Style

You use the `mstts:express-as` element to express emotions like cheerfulness, empathy, and calm. You can also optimize the voice for different scenarios like customer service, newscast, and voice assistant.

For a list of supported styles per neural voice, see [supported voice styles and roles](language-support.md?tabs=stt-tts#voice-styles-and-roles).

**Syntax**

```xml
<mstts:express-as style="string"></mstts:express-as>
```

**Example**

This SSML snippet illustrates how the `<mstts:express-as>` element is used to change the speaking style to `cheerful`.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        <mstts:express-as style="cheerful">
            That'd be just amazing!
        </mstts:express-as>
    </voice>
</speak>
```

The following table has descriptions of each supported style.

|Style|Description|
|-----------|-------------|
|`style="advertisement_upbeat"`|Expresses an excited and high-energy tone for promoting a product or service.|
|`style="affectionate"`|Expresses a warm and affectionate tone, with higher pitch and vocal energy. The speaker is in a state of attracting the attention of the listener. The personality of the speaker is often endearing in nature.|
|`style="angry"`|Expresses an angry and annoyed tone.|
|`style="assistant"`|Expresses a warm and relaxed tone for digital assistants.|
|`style="calm"`|Expresses a cool, collected, and composed attitude when speaking. Tone, pitch, and prosody are more uniform compared to other types of speech.|
|`style="chat"`|Expresses a casual and relaxed tone.|
|`style="cheerful"`|Expresses a positive and happy tone.|
|`style="customerservice"`|Expresses a friendly and helpful tone for customer support.|
|`style="depressed"`|Expresses a melancholic and despondent tone with lower pitch and energy.|
|`style="disgruntled"`|Expresses a disdainful and complaining tone. Speech of this emotion displays displeasure and contempt.|
|`style="documentary-narration"`|Narrates documentaries in a relaxed, interested, and informative style suitable for dubbing documentaries, expert commentary, and similar content.|
|`style="embarrassed"`|Expresses an uncertain and hesitant tone when the speaker is feeling uncomfortable.|
|`style="empathetic"`|Expresses a sense of caring and understanding.|
|`style="envious"`|Expresses a tone of admiration when you desire something that someone else has.|
|`style="excited"`|Expresses an upbeat and hopeful tone. It sounds like something great is happening and the speaker is really happy about that.|
|`style="fearful"`|Expresses a scared and nervous tone, with higher pitch, higher vocal energy, and faster rate. The speaker is in a state of tension and unease.|
|`style="friendly"`|Expresses a pleasant, inviting, and warm tone. It sounds sincere and caring.|
|`style="gentle"`|Expresses a mild, polite, and pleasant tone, with lower pitch and vocal energy.|
|`style="hopeful"`|Expresses a warm and yearning tone. It sounds like something good will happen to the speaker.|
|`style="lyrical"`|Expresses emotions in a melodic and sentimental way.|
|`style="narration-professional"`|Expresses a professional, objective tone for content reading.|
|`style="narration-relaxed"`|Express a soothing and melodious tone for content reading.|
|`style="newscast"`|Expresses a formal and professional tone for narrating news.|
|`style="newscast-casual"`|Expresses a versatile and casual tone for general news delivery.|
|`style="newscast-formal"`|Expresses a formal, confident, and authoritative tone for news delivery.|
|`style="poetry-reading"`|Expresses an emotional and rhythmic tone while reading a poem.|
|`style="sad"`|Expresses a sorrowful tone.|
|`style="serious"`|Expresses a strict and commanding tone. Speaker often sounds stiffer and much less relaxed with firm cadence.|
|`style="shouting"`|Speaks like from a far distant or outside and to make self be clearly heard|
|`style="sports_commentary"`|Expresses a relaxed and interesting tone for broadcasting a sports event.|
|`style="sports_commentary_excited"`|Expresses an intensive and energetic tone for broadcasting exciting moments in a sports event.|
|`style="whispering"`|Speaks very softly and make a quiet and gentle sound|
|`style="terrified"`|Expresses a very scared tone, with faster pace and a shakier voice. It sounds like the speaker is in an unsteady and frantic status.|
|`style="unfriendly"`|Expresses a cold and indifferent tone.|

### Style degree

The intensity of speaking style can be adjusted to better fit your use case. You specify a stronger or softer style with the `styledegree` attribute to make the speech more expressive or subdued.

For a list of neural voices that support speaking style degree, see [supported voice styles and roles](language-support.md?tabs=stt-tts#voice-styles-and-roles).

**Syntax**

```xml
<mstts:express-as style="string" styledegree="value"></mstts:express-as>
```

**Example**

This SSML snippet illustrates how the `styledegree` attribute is used to change the intensity of speaking style for `zh-CN-XiaomoNeural`.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-CN">
    <voice name="zh-CN-XiaoxiaoNeural">
        <mstts:express-as style="sad" styledegree="2">
            快走吧，路上一定要注意安全，早去早回。
        </mstts:express-as>
    </voice>
</speak>
```

### Role

Apart from adjusting the speaking styles and style degree, you can also adjust the `role` parameter so that the voice imitates a different age and gender. For example, a male voice can raise the pitch and change the intonation to imitate a female voice, but the voice name won't be changed.

For a list of supported roles per neural voice, see [supported voice styles and roles](language-support.md?tabs=stt-tts#voice-styles-and-roles).

**Syntax**

```xml
<mstts:express-as role="string" style="string"></mstts:express-as>
```

**Example**

This SSML snippet illustrates how the `role` attribute is used to change the role-play for `zh-CN-XiaomoNeural`.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-CN">
    <voice name="zh-CN-XiaomoNeural">
        女儿看见父亲走了进来，问道：
        <mstts:express-as role="YoungAdultFemale" style="calm">
            “您来的挺快的，怎么过来的？”
        </mstts:express-as>
        父亲放下手提包，说：
        <mstts:express-as role="OlderAdultMale" style="calm">
            “刚打车过来的，路上还挺顺畅。”
        </mstts:express-as>
    </voice>
</speak>
```

The following table has descriptions of each supported role.

| Role                      | Description                                  |
| ------------------------- | -------------------------------------------- |
| `role="Girl"`             | The voice imitates to a girl.                |
| `role="Boy"`              | The voice imitates to a boy.                 |
| `role="YoungAdultFemale"` | The voice imitates to a young adult female.  |
| `role="YoungAdultMale"`   | The voice imitates to a young adult male.    |
| `role="OlderAdultFemale"` | The voice imitates to an older adult female. |
| `role="OlderAdultMale"`   | The voice imitates to an older adult male.   |
| `role="SeniorFemale"`     | The voice imitates to a senior female.       |
| `role="SeniorMale"`       | The voice imitates to a senior male.         |

## Adjust speaking languages

By default, all neural voices are fluent in their own language and English without using the `<lang xml:lang>` element. For example, if the input text in English is "I'm excited to try text to speech" and you use the `es-ES-ElviraNeural` voice, the text is spoken in English with a Spanish accent. With most neural voices, setting a specific speaking language with `<lang xml:lang>` element at the sentence or word level is currently not supported.

You can adjust the speaking language for the `en-US-JennyMultilingualNeural` neural voice at the sentence level and word level by using the `<lang xml:lang>` element. The `en-US-JennyMultilingualNeural` neural voice is multilingual in 14 languages (For example: English, Spanish, and Chinese). The supported languages are provided in a table following the `<lang>` syntax and attribute definitions.

**Syntax**

```xml
<lang xml:lang="string"></lang>
```

**Attribute**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `lang`    | Specifies the language that you want the neural voice to speak. | Required to adjust the speaking language for the neural voice. If you're using `lang xml:lang`, the locale must be provided. |

> [!NOTE]
> The `<lang xml:lang>` element is incompatible with the `prosody` and `break` elements. You can't adjust pause and prosody like pitch, contour, rate, or volume in this element.

Use this table to determine which speaking languages are supported for each neural voice. If the voice doesn't speak the language of the input text, the Speech service won't output synthesized audio.

| Voice | Primary and default locale | Secondary locales |
| -------------- | --------------- | ------- |
| `en-US-JennyMultilingualNeural` | `en-US` | `de-DE`, `en-AU`, `en-CA`, `en-GB`, `es-ES`, `es-MX`, `fr-CA`, `fr-FR`, `it-IT`, `ja-JP`, `ko-KR`, `pt-BR`, `zh-CN` |

**Example**

The primary language for `en-US-JennyMultilingualNeural` is `en-US`. You must specify `en-US` as the default language within the `speak` element, whether or not the language is adjusted elsewhere. This SSML snippet shows how to speak `de-DE` with the `en-US-JennyMultilingualNeural` neural voice.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
    <voice name="en-US-JennyMultilingualNeural">
        <lang xml:lang="de-DE">
            Wir freuen uns auf die Zusammenarbeit mit Ihnen!
        </lang>
    </voice>
</speak>
```

Within the `speak` element, you can specify multiple languages including `en-US` for text-to-speech output. For each adjusted language, the text must match the language and be wrapped in a `voice` element. This SSML snippet shows how to use `<lang xml:lang>` to change the speaking languages to `es-MX`, `en-US`, and `fr-FR`.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
    <voice name="en-US-JennyMultilingualNeural">
        <lang xml:lang="es-MX">
            ¡Esperamos trabajar con usted!
        </lang>
        <lang xml:lang="en-US">
           We look forward to working with you!
        </lang>
        <lang xml:lang="fr-FR">
            Nous avons hâte de travailler avec vous!
        </lang>
    </voice>
</speak>
```

## Add or remove a break or pause

Use the `break` element to insert pauses or breaks between words. You can also use it to prevent pauses that are automatically added by text-to-speech.

> [!NOTE]
> Use this element to override the default behavior of text-to-speech for a word or phrase if the synthesized speech for that word or phrase sounds unnatural. Set `strength` to `none` to prevent a prosodic break, which is automatically inserted by text-to-speech.

**Syntax**

```xml
<break strength="string" />
<break time="string" />
```

**Attributes**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `strength` | Specifies the relative duration of a pause by using one of the following values:<ul><li>none</li><li>x-weak</li><li>weak</li><li>medium (default)</li><li>strong</li><li>x-strong</li></ul> | Optional             |
| `time`     | Specifies the absolute duration of a pause in seconds or milliseconds (ms). This value should be set less than 5,000 ms. Examples of valid values are `2s` and `500ms`. | Optional |

Here are more details about the `strength` attribute.

| Strength                      | Relative duration |
| ----------------------------- | ----------- |
| None, or if no value provided | 0 ms        |
| X-weak                        | 250 ms      |
| Weak                          | 500 ms      |
| Medium                        | 750 ms      |
| Strong                        | 1,000 ms    |
| X-strong                      | 1,250 ms    |

**Example**

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        Welcome to Microsoft Cognitive Services <break time="100ms" /> Text-to-Speech API.
    </voice>
</speak>
```

## Add silence

Use the `mstts:silence` element to insert pauses before or after text, or between two adjacent sentences.

> [!NOTE]
>The difference between `mstts:silence` and `break` is that `break` can be added any place in the text. Silence only works at the beginning or end of input text or at the boundary of two adjacent sentences.


**Syntax**

```xml
<mstts:silence  type="string"  value="string"/>
```

**Attributes**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `type` | Specifies the location of silence to be added: <ul><li>`Leading` – At the beginning of text </li><li>`Tailing` – At the end of text </li><li>`Sentenceboundary` – Between adjacent sentences </li></ul> | Required  |
| `Value`   | Specifies the absolute duration of a pause in seconds or milliseconds. This value should be set less than 5,000 ms. Examples of valid values are `2s` and `500ms`.| Required |

**Example**

In this example, `mtts:silence` is used to add 200 ms of silence between two sentences.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
<voice name="en-US-JennyNeural">
<mstts:silence  type="Sentenceboundary" value="200ms"/>
If we’re home schooling, the best we can do is roll with what each day brings and try to have fun along the way.
A good place to start is by trying out the slew of educational apps that are helping children stay happy and smash their schooling at the same time.
</voice>
</speak>
```

## Specify paragraphs and sentences

The `p` and `s` elements are used to denote paragraphs and sentences, respectively. In the absence of these elements, text-to-speech automatically determines the structure of the SSML document.

The `p` element can contain text and the following elements: `audio`, `break`, `phoneme`, `prosody`, `say-as`, `sub`, `mstts:express-as`, and `s`.

The `s` element can contain text and the following elements: `audio`, `break`, `phoneme`, `prosody`, `say-as`, `mstts:express-as`, and `sub`.

**Syntax**

```xml
<p></p>
<s></s>
```

**Example**

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        <p>
            <s>Introducing the sentence element.</s>
            <s>Used to mark individual sentences.</s>
        </p>
        <p>
            Another simple paragraph.
            Sentence structure in this paragraph is not explicitly marked.
        </p>
    </voice>
</speak>
```

## Use phonemes to improve pronunciation

The `ph` element is used for phonetic pronunciation in SSML documents. The `ph` element can contain only text but no other elements. Always provide human-readable speech as a fallback.

Phonetic alphabets are composed of phones, which are made up of letters, numbers, or characters, sometimes in combination. Each phone describes a unique sound of speech. This is in contrast to the Latin alphabet, where any letter might represent multiple spoken sounds. Consider the different pronunciations of the letter "c" in the words "candy" and "cease" or the different pronunciations of the letter combination "th" in the words "thing" and "those."

> [!NOTE]
> For a list of locales that support phonemes, see footnotes in the [language support](language-support.md?tabs=stt-tts) table.

**Syntax**

```xml
<phoneme alphabet="string" ph="string"></phoneme>
```

**Attributes**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `alphabet` | Specifies the phonetic alphabet to use when you synthesize the pronunciation of the string in the `ph` attribute. The string that specifies the alphabet must be specified in lowercase letters. The following options are the possible alphabets that you can specify:<ul><li>`ipa` &ndash; See [SSML phonetic alphabets](speech-ssml-phonetic-sets.md)</li><li>`sapi` &ndash; See [SSML phonetic alphabets](speech-ssml-phonetic-sets.md)</li><li>`ups` &ndash; See [Universal Phone Set](https://documentation.help/Microsoft-Speech-Platform-SDK-11/17509a49-cae7-41f5-b61d-07beaae872ea.htm)</li></ul><br>The alphabet applies only to the `phoneme` in the element. | Optional |
| `ph` | A string containing phones that specify the pronunciation of the word in the `phoneme` element. If the specified string contains unrecognized phones, text-to-speech rejects the entire SSML document and produces none of the speech output specified in the document. | Required if using phonemes |

**Examples**

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        <phoneme alphabet="ipa" ph="təˈmeɪtoʊ"> tomato </phoneme>
    </voice>
</speak>
```

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        <phoneme alphabet="sapi" ph="iy eh n y uw eh s"> en-US </phoneme>
    </voice>
</speak>
```

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        <s>His name is Mike <phoneme alphabet="ups" ph="JH AU"> Zhou </phoneme></s>
    </voice>
</speak>
```

## Use custom lexicon to improve pronunciation

Sometimes text-to-speech can't accurately pronounce a word. Examples might be the name of a company, a medical term, or an emoji. You can define how single entities are read in SSML by using the `phoneme` and `sub` tags. If you need to define how multiple entities are read, you can create a custom lexicon by using the `lexicon` tag.

> [!NOTE]
> For a list of locales that support custom lexicon, see footnotes in the [language support](language-support.md?tabs=stt-tts) table.


**Syntax**

```xml
<lexicon uri="string"/>
```

> [!NOTE]
> The `lexicon` element is not supported by the [Long Audio API](long-audio-api.md).

**Attribute**

| Attribute | Description                              | Required or optional |
| --------- | ---------------------------------------- | -------------------- |
| `uri`     | The address of the external PLS document | Required             |

**Usage**

To define how multiple entities are read, you can create a custom lexicon, which is stored as a `.xml` or `.pls` file. The following code is a sample `.xml` file.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<lexicon version="1.0"
      xmlns="http://www.w3.org/2005/01/pronunciation-lexicon"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.w3.org/2005/01/pronunciation-lexicon
        http://www.w3.org/TR/2007/CR-pronunciation-lexicon-20071212/pls.xsd"
      alphabet="ipa" xml:lang="en-US">
  <lexeme>
    <grapheme>BTW</grapheme>
    <alias>By the way</alias>
  </lexeme>
  <lexeme>
    <grapheme> Benigni </grapheme>
    <phoneme> bɛˈniːnji</phoneme>
  </lexeme>
  <lexeme>
    <grapheme>😀</grapheme>
    <alias>test emoji</alias>
  </lexeme>
</lexicon>
```

The `lexicon` element contains at least one `lexeme` element. Each `lexeme` element contains at least one `grapheme` element and one or more `grapheme`, `alias`, and `phoneme` elements. The `grapheme` element contains text that describes the [orthography](https://www.w3.org/TR/pronunciation-lexicon/#term-Orthography). The `alias` elements are used to indicate the pronunciation of an acronym or an abbreviated term. The `phoneme` element provides text that describes how the `lexeme` is pronounced. When the `alias` and `phoneme` elements are provided with the same `grapheme` element, `alias` has higher priority.

> [!IMPORTANT]
> The `lexeme` element is case sensitive in the custom lexicon. For example, if you only provide a phoneme for the `lexeme` "Hello," it won't work for the `lexeme` "hello."

Lexicon contains the necessary `xml:lang` attribute to indicate which locale it should be applied for. One custom lexicon is limited to one locale by design, so if you apply it for a different locale, it won't work.

You can't directly set the pronunciation of a phrase by using the custom lexicon. If you need to set the pronunciation for an acronym or an abbreviated term, first provide an `alias`, and then associate the `phoneme` with that `alias`. For example:

```xml
  <lexeme>
    <grapheme>Scotland MV</grapheme>
    <alias>ScotlandMV</alias>
  </lexeme>
  <lexeme>
    <grapheme>ScotlandMV</grapheme>
    <phoneme>ˈskɒtlənd.ˈmiːdiəm.weɪv</phoneme>
  </lexeme>
```

> [!NOTE]
> The syllable boundary is '.' in the IPA.

You could also directly provide your expected `alias` for the acronym or abbreviated term. For example:

```xml
  <lexeme>
    <grapheme>Scotland MV</grapheme>
    <alias>Scotland Media Wave</alias>
  </lexeme>
```

> [!IMPORTANT]
> The `phoneme` element can't contain white spaces when you use the IPA.

For more information about the custom lexicon file, see [Pronunciation Lexicon Specification (PLS) Version 1.0](https://www.w3.org/TR/pronunciation-lexicon/).

Next, publish your custom lexicon file. We don't have restrictions on where this file can be stored, but we recommend that you use [Azure Blob Storage](../../storage/blobs/storage-quickstart-blobs-portal.md).

After you've published your custom lexicon, you can reference it from your SSML.

> [!NOTE]
> The `lexicon` element must be inside the `voice` element.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
          xmlns:mstts="http://www.w3.org/2001/mstts"
          xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        <lexicon uri="http://www.example.com/customlexicon.xml"/>
        BTW, we will be there probably at 8:00 tomorrow morning.
        Could you help leave a message to Robert Benigni for me?
    </voice>
</speak>
```

When you use this custom lexicon, "BTW" is read as "By the way." "Benigni" is read with the provided IPA "bɛˈniːnji."

It's easy to make mistakes in the custom lexicon, so Microsoft provides a [validation tool for the custom lexicon](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/CustomLexiconValidation). It provides detailed error messages that help you find errors. Before you send SSML with the custom lexicon to the Speech service, check your custom lexicon with this tool.

**Limitations**

- **File size**: The custom lexicon file size maximum limit is 100 KB. If a file is beyond this size, the synthesis request fails.
- **Lexicon cache refresh**: The custom lexicon is cached with the URI as the key on text-to-speech when it's first loaded. The lexicon with the same URI won't be reloaded within 15 minutes, so the custom lexicon change needs to wait 15 minutes at the most to take effect.

**Speech service phonetic sets**

In the preceding sample, we're using the IPA, which is also known as the IPA phone set. We suggest that you use the IPA because it's the international standard. For some IPA characters, they're the "precomposed" and "decomposed" version when they're being represented with Unicode. The custom lexicon only supports the decomposed Unicode.

The Speech service defines a phonetic set for these locales: `en-US`, `fr-FR`, `de-DE`, `es-ES`, `ja-JP`, `zh-CN`, `zh-HK`, and `zh-TW`. For more information on the detailed Speech service phonetic alphabet, see the [Speech service phonetic sets](speech-ssml-phonetic-sets.md).

You can use the `x-microsoft-sapi` as the value for the `alphabet` attribute with custom lexicons as demonstrated here:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<lexicon version="1.0"
      xmlns="http://www.w3.org/2005/01/pronunciation-lexicon"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.w3.org/2005/01/pronunciation-lexicon
        http://www.w3.org/TR/2007/CR-pronunciation-lexicon-20071212/pls.xsd"
      alphabet="x-microsoft-sapi" xml:lang="en-US">
  <lexeme>
    <grapheme>BTW</grapheme>
    <alias> By the way </alias>
  </lexeme>
  <lexeme>
    <grapheme> Benigni </grapheme>
    <phoneme> b eh 1 - n iy - n y iy </phoneme>
  </lexeme>
</lexicon>
```

## Adjust prosody

The `prosody` element is used to specify changes to pitch, contour, range, rate, and volume for the text-to-speech output. The `prosody` element can contain text and the following elements: `audio`, `break`, `p`, `phoneme`, `prosody`, `say-as`, `sub`, and `s`.

Because prosodic attribute values can vary over a wide range, the speech recognizer interprets the assigned values as a suggestion of what the actual prosodic values of the selected voice should be. Text-to-speech limits or substitutes values that aren't supported. Examples of unsupported values are a pitch of 1 MHz or a volume of 120.

**Syntax**

```xml
<prosody pitch="value" contour="value" range="value" rate="value" volume="value"></prosody>
```

**Attributes**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `pitch`   | Indicates the baseline pitch for the text. You can express the pitch as:<ul><li>An absolute value: Expressed as a number followed by "Hz" (Hertz). For example, `<prosody pitch="600Hz">some text</prosody>`.</li><li>A relative value:<ul><li>As a relative number: Expressed as a number preceded by "+" or "-" and followed by "Hz" or "st" that specifies an amount to change the pitch. For example: `<prosody pitch="+80Hz">some text</prosody>` or `<prosody pitch="-2st">some text</prosody>`. The "st" indicates the change unit is semitone, which is half of a tone (a half step) on the standard diatonic scale.<li>As a percentage: Expressed as a number preceded by "+" (optionally) or "-" and followed by "%", indicating the relative change. For example: `<prosody pitch="50%">some text</prosody>` or `<prosody pitch="-50%">some text</prosody>`.</li></ul></li><li>A constant value:<ul><li>x-low</li><li>low</li><li>medium</li><li>high</li><li>x-high</li><li>default</li></ul></li></ul> | Optional |
| `contour` | Contour now supports neural voice. Contour represents changes in pitch. These changes are represented as an array of targets at specified time positions in the speech output. Each target is defined by sets of parameter pairs. For example: <br/><br/>`<prosody contour="(0%,+20Hz) (10%,-2st) (40%,+10Hz)">`<br/><br/>The first value in each set of parameters specifies the location of the pitch change as a percentage of the duration of the text. The second value specifies the amount to raise or lower the pitch by using a relative value or an enumeration value for pitch (see `pitch`). | Optional |
| `range`| A value that represents the range of pitch for the text. You can express `range` by using the same absolute values, relative values, or enumeration values used to describe `pitch`.| Optional |
| `rate` | Indicates the speaking rate of the text. You can express `rate` as:<ul><li>A relative value: <ul><li>As a relative number: Expressed as a number that acts as a multiplier of the default. For example, a value of *1* results in no change in the original rate. A value of *0.5* results in a halving of the original rate. A value of *2* results in twice the original rate.</li><li>As a percentage: Expressed as a number preceded by "+" (optionally) or "-" and followed by "%", indicating the relative change. For example: `<prosody rate="50%">some text</prosody>` or `<prosody rate="-50%">some text</prosody>`.</li></ul><li>A constant value:<ul><li>x-slow</li><li>slow</li><li>medium</li><li>fast</li><li>x-fast</li><li>default</li></ul></li></ul> | Optional |
| `volume`  | Indicates the volume level of the speaking voice. You can express the volume as:<ul><li>An absolute value: Expressed as a number in the range of 0.0 to 100.0, from *quietest* to *loudest*. An example is 75. The default is 100.0.</li><li>A relative value: <ul><li>As a relative number: Expressed as a number preceded by "+" or "-" that specifies an amount to change the volume. Examples are +10 or -5.5.</li><li>As a percentage: Expressed as a number preceded by "+" (optionally) or "-" and followed by "%", indicating the relative change. For example: `<prosody volume="50%">some text</prosody>` or `<prosody volume="+3%">some text</prosody>`.</li></ul><li>A constant value:<ul><li>silent</li><li>x-soft</li><li>soft</li><li>medium</li><li>loud</li><li>x-loud</li><li>default</li></ul></li></ul> | Optional |

### Change speaking rate

Speaking rate can be applied at the word or sentence level. The rate changes should be within 0.5 to 2 times the original audio.

**Example**

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        <prosody rate="+30.00%">
            Welcome to Microsoft Cognitive Services Text-to-Speech API.
        </prosody>
    </voice>
</speak>
```

### Change volume

Volume changes can be applied at the sentence level. The volume changes should be within 0 (silence) to 1.5 times the original audio.

**Example**

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        <prosody volume="+20.00%">
            Welcome to Microsoft Cognitive Services Text-to-Speech API.
        </prosody>
    </voice>
</speak>
```

### Change pitch

Pitch changes can be applied at the sentence level. The pitch changes should be within 0.5 to 1.5 times the original audio.

**Example**

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        Welcome to <prosody pitch="high">Microsoft Cognitive Services Text-to-Speech API.</prosody>
    </voice>
</speak>
```

### Change pitch contour

> [!IMPORTANT]
> Pitch contour changes are now supported with neural voices.

**Example**

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        <prosody contour="(60%,-60%) (100%,+80%)" >
            Were you the only person in the room?
        </prosody>
    </voice>
</speak>
```

## Adjust emphasis

The optional `emphasis` element is used to add or remove word-level stress for the text. This element can only contain text and the following elements: `audio`, `break`, `emphasis`, `lang`, `phoneme`, `prosody`, `say-as`, `sub`, and `voice`.

> [!NOTE]
> The word-level emphasis tuning is only available for these neural voices: `en-US-GuyNeural`, `en-US-DavisNeural`, and `en-US-JaneNeural`.

**Syntax**

```xml
<emphasis level="value"></emphasis>
```

**Attribute**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `level`   | Indicates the strength of emphasis to be applied:<ul><li>`reduced`</li><li>`none`</li><li>`moderate`</li><li>`strong`</li></ul><br>When the `level` attribute isn't specified, the default level is `moderate`. For details on each attribute, see [emphasis element](https://www.w3.org/TR/speech-synthesis11/#S3.2.2) | Optional             |

**Example**

This SSML snippet demonstrates how the `emphasis` element is used to add moderate level emphasis for the word "meetings".

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
    <voice name="en-US-GuyNeural">
    I can help you join your <emphasis level="moderate">meetings</emphasis> fast.
    </voice>
</speak>
```

## Add say-as element

The `say-as` element is optional. It indicates the content type, such as number or date, of the element's text. This element provides guidance to the speech synthesis engine about how to pronounce the text.

**Syntax**

```xml
<say-as interpret-as="string" format="digit string" detail="string"> </say-as>
```

**Attributes**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `interpret-as` | Indicates the content type of an element's text. For a list of types, see the following table.| Required |
| `format`| Provides additional information about the precise formatting of the element's text for content types that might have ambiguous formats. SSML defines formats for content types that use them. See the following table. | Optional             |
| `detail` | Indicates the level of detail to be spoken. For example, this attribute might request that the speech synthesis engine pronounce punctuation marks. There are no standard values defined for `detail`. | Optional |

The following content types are supported for the `interpret-as` and `format` attributes. Include the `format` attribute only if `format` column isn't empty in the table below.

| interpret-as   | format   | Interpretation |
| ----------- | --------- | -------- |
| `characters`, `spell-out` |  | The text is spoken as individual letters (spelled out). The speech synthesis engine pronounces:<br /><br />`<say-as interpret-as="characters">test</say-as>`<br /><br />As "T E S T." |
| `cardinal`, `number` | None| The text is spoken as a cardinal number. The speech synthesis engine pronounces:<br /><br />`There are <say-as interpret-as="cardinal">10</say-as> options`<br /><br />As "There are ten options."|
| `ordinal`  | None | The text is spoken as an ordinal number. The speech synthesis engine pronounces:<br /><br />`Select the <say-as interpret-as="ordinal">3rd</say-as> option`<br /><br />As "Select the third option."|
| `digits`, `number_digit`  | None | The text is spoken as a sequence of individual digits. The speech synthesis engine pronounces:<br /><br />`<say-as interpret-as="number_digit">123456789</say-as>`<br /><br />As "1 2 3 4 5 6 7 8 9." |
| `fraction`   | None | The text is spoken as a fractional number. The speech synthesis engine pronounces:<br /><br /> `<say-as interpret-as="fraction">3/8</say-as> of an inch`<br /><br />As "three eighths of an inch."  |
| `date` | dmy, mdy, ymd, ydm, ym, my, md, dm, d, m, y | The text is spoken as a date. The `format` attribute specifies the date's format (*d=day, m=month, and y=year*). The speech synthesis engine pronounces:<br /><br />`Today is <say-as interpret-as="date" format="mdy">10-19-2016</say-as>`<br /><br />As "Today is October nineteenth two thousand sixteen." |
| `time`  | hms12, hms24  | The text is spoken as a time. The `format` attribute specifies whether the time is specified by using a 12-hour clock (hms12) or a 24-hour clock (hms24). Use a colon to separate numbers representing hours, minutes, and seconds. Here are some valid time examples: 12:35, 1:14:32, 08:15, and 02:50:45. The speech synthesis engine pronounces:<br /><br />`The train departs at <say-as interpret-as="time" format="hms12">4:00am</say-as>`<br /><br />As "The train departs at four A M." |
| `duration` | hms, hm, ms   | The text is spoken as a duration. The `format` attribute specifies the duration's format (*h=hour, m=minute, and s=second*). The speech synthesis engine pronounces:<br /><br />`<say-as interpret-as="duration">01:18:30</say-as>`<br /><br /> As "one hour eighteen minutes and thirty seconds".<br />Pronounces:<br /><br />`<say-as interpret-as="duration" format="ms">01:18</say-as>`<br /><br /> As "one minute and eighteen seconds".<br />This tag is only supported on English and Spanish. |
| `telephone` |  None | The text is spoken as a telephone number. The `format` attribute can contain digits that represent a country code. Examples are "1" for the United States or "39" for Italy. The speech synthesis engine can use this information to guide its pronunciation of a phone number. The phone number might also include the country code, and if so, takes precedence over the country code in the `format` attribute. The speech synthesis engine pronounces:<br /><br />`The number is <say-as interpret-as="telephone" format="1">(888) 555-1212</say-as>`<br /><br />As "My number is area code eight eight eight five five five one two one two." |
| `currency`  | None | The text is spoken as a currency. The speech synthesis engine pronounces:<br /><br />`<say-as interpret-as="currency">99.9 USD</say-as>`<br /><br />As "ninety-nine US dollars and ninety cents."|
| `address`| None | The text is spoken as an address. The speech synthesis engine pronounces:<br /><br />`I'm at <say-as interpret-as="address">150th CT NE, Redmond, WA</say-as>`<br /><br />As "I'm at 150th Court Northeast Redmond Washington."|
| `name`   | None | The text is spoken as a person's name. The speech synthesis engine pronounces:<br /><br />`<say-as interpret-as="name">ED</say-as>`<br /><br />As [æd]. <br />In Chinese names, some characters pronounce differently when they appear in a family name. For example, the speech synthesis engine says 仇 in <br /><br />`<say-as interpret-as="name">仇先生</say-as>`<br /><br /> As [qiú] instead of [chóu]. |

**Usage**

The `say-as` element can only contain text.

**Example**

The speech synthesis engine speaks the following example as "Your first request was for one room on October nineteenth twenty ten with early arrival at twelve thirty five PM."

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        <p>
        Your <say-as interpret-as="ordinal"> 1st </say-as> request was for <say-as interpret-as="cardinal"> 1 </say-as> room
        on <say-as interpret-as="date" format="mdy"> 10/19/2010 </say-as>, with early arrival at <say-as interpret-as="time" format="hms12"> 12:35pm </say-as>.
        </p>
    </voice>
</speak>
```

## Add recorded audio

The `audio` element is optional. You can use it to insert prerecorded audio into an SSML document. The body of the audio element can contain plain text or SSML markup that's spoken if the audio file is unavailable or unplayable. The `audio` element can also contain text and the following elements: `audio`, `break`, `p`, `s`, `phoneme`, `prosody`, `say-as`, and `sub`.

Any audio included in the SSML document must meet these requirements:

* The audio must be hosted on an internet-accessible HTTPS endpoint. HTTPS is required, and the domain hosting the file must present a valid, trusted TLS/SSL certificate. We recommend that you put the audio file into Blob Storage in the same Azure region as the text-to-speech endpoint to minimize the latency.
* The audio file must be valid *.mp3, *.wav, *.opus, *.ogg, *.flac, or *.wma files.
* The combined total time for all text and audio files in a single response can't exceed 600 seconds.
* The audio must not contain any customer-specific or other sensitive information.

> [!NOTE]
> The 'audio' element is not supported by the [Long Audio API](long-audio-api.md).

**Syntax**

```xml
<audio src="string"/></audio>
```

**Attribute**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `src`     | Specifies the location/URL of the audio file. | Required if using the audio element in your SSML document. |

**Example**

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        <p>
            <audio src="https://contoso.com/opinionprompt.wav"/>
            Thanks for offering your opinion. Please begin speaking after the beep.
            <audio src="https://contoso.com/beep.wav">
                Could not play the beep, please voice your opinion now.
            </audio>
        </p>
    </voice>
</speak>
```

## Add background audio

You can use the `mstts:backgroundaudio` element to add background audio to your SSML documents or mix an audio file with text-to-speech. With `mstts:backgroundaudio`, you can loop an audio file in the background, fade in at the beginning of text-to-speech, and fade out at the end of text-to-speech.

If the background audio provided is shorter than the text-to-speech or the fade out, it loops. If it's longer than the text-to-speech, it stops when the fade out has finished.

Only one background audio file is allowed per SSML document. You can intersperse `audio` tags within the `voice` element to add more audio to your SSML document.

> [!NOTE]
> The `mstts:backgroundaudio` element should be put in front of all `voice` elements, i.e., the first child of the `speak` element.
>
> The `mstts:backgroundaudio` element is not supported by the [Long Audio API](long-audio-api.md).

**Syntax**

```xml
<mstts:backgroundaudio src="string" volume="string" fadein="string" fadeout="string"/>
```

**Attributes**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `src`     | Specifies the location/URL of the background audio file. | Required if using background audio in your SSML document |
| `volume`  | Specifies the volume of the background audio file. **Accepted values**: `0` to `100` inclusive. The default value is `1`.  | Optional  |
| `fadein`  | Specifies the duration of the background audio fade-in as milliseconds. The default value is `0`, which is the equivalent to no fade in. **Accepted values**: `0` to `10000` inclusive.   | Optional    |
| `fadeout` | Specifies the duration of the background audio fade-out in milliseconds. The default value is `0`, which is the equivalent to no fade out. **Accepted values**: `0` to `10000` inclusive. | Optional|

**Example**

```xml
<speak version="1.0" xml:lang="en-US" xmlns:mstts="http://www.w3.org/2001/mstts">
    <mstts:backgroundaudio src="https://contoso.com/sample.wav" volume="0.7" fadein="3000" fadeout="4000"/>
    <voice name="Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)">
        The text provided in this document will be spoken over the background audio.
    </voice>
</speak>
```

## Bookmark element

You can use the `bookmark` element in SSML to reference a specific location in the text or tag sequence. Then you will use the Speech SDK and subscribe to the `BookmarkReached` event to get the offset of each marker in the audio stream. The `bookmark` element won't be spoken. For more information, see [Subscribe to synthesizer events](how-to-speech-synthesis.md#subscribe-to-synthesizer-events).

**Syntax**

```xml
<bookmark mark="string"/>
```

**Attribute**

| Attribute | Description                                             | Required or optional |
| --------- | ------------------------------------------------------- | -------------------- |
| `mark`    | Specifies the reference text of the `bookmark` element. | Required             |

**Example**

As an example, you might want to know the time offset of each flower word in the following snippet:

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-AriaNeural">
        We are selling <bookmark mark='flower_1'/>roses and <bookmark mark='flower_2'/>daisies.
    </voice>
</speak>
```

## Supported MathML elements

The Mathematical Markup Language (MathML) is an XML-compliant markup language that lets developers specify how input text is converted into synthesized speech by using text-to-speech.

> [!NOTE]
> The MathML elements (tags) are currently supported by all neural voices in the `en-US` and `en-AU` locales.

**Example**

This SSML snippet demonstrates how the MathML elements are used to output synthesized speech. The text-to-speech output for this example is "a squared plus b squared equals c squared".

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US"><voice name="en-US-JennyNeural"><math xmlns="http://www.w3.org/1998/Math/MathML"><msup><mi>a</mi><mn>2</mn></msup><mo>+</mo><msup><mi>b</mi><mn>2</mn></msup><mo>=</mo><msup><mi>c</mi><mn>2</mn></msup></math></voice></speak>
```

The `xmlns` attribute in `<math xmlns="http://www.w3.org/1998/Math/MathML">` is optional.

All elements from the [MathML 2.0](https://www.w3.org/TR/MathML2/) and [MathML 3.0](https://www.w3.org/TR/MathML3/) specifications are supported, except the MathML 3.0 [Elementary Math](https://www.w3.org/TR/MathML3/chapter3.html#presm.elementary) elements. The `semantics`, `annotation`, and `annotation-xml` elements don't output speech, so they are ignored.

> [!NOTE]
> If an element is not recognized, it will be ignored, and the child elements within it will still be processed.

The MathML entities are not supported by XML syntax, so you must use the their corresponding [unicode characters](https://www.w3.org/2003/entities/2007/htmlmathml.json) to represent the entities, for example, the entity `&copy;` should be represented by its unicode characters `&#x00A9;`, otherwise an error will occur.

## Viseme element

A viseme is the visual description of a phoneme in spoken language. It defines the position of the face and mouth while a person is speaking. You can use the `mstts:viseme` element in SSML to request viseme output. For more information, see [Get facial position with viseme](how-to-speech-synthesis-viseme.md).

**Syntax**

```xml
<mstts:viseme type="string"/>
```

**Attributes**

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `type`    | Specifies the type of viseme output.<ul><li>`redlips_front` – lip-sync with viseme ID and audio offset output </li><li>`FacialExpression` – blend shapes output</li></ul> | Required  |

> [!NOTE]
> Currently, `redlips_front` only supports neural voices in `en-US` locale, and `FacialExpression` supports neural voices in `en-US` and `zh-CN` locales.

**Example**

This SSML snippet illustrates how to request blend shapes with your synthesized speech.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
  <voice name="en-US-JennyNeural">
    <mstts:viseme type="FacialExpression"/>
    Rainbow has seven colors: Red, orange, yellow, green, blue, indigo, and violet.
  </voice>
</speak>
```

## Next steps

- [How to synthesize speech](how-to-speech-synthesis.md)
- [Language support: Voices, locales, languages](language-support.md?tabs=stt-tts)
