---
title: Speech Synthesis Markup Language (SSML) - Speech Services
titleSuffix: Azure Cognitive Services
description: Using the Speech Synthesis Markup Language to control pronunciation and prosody in text-to-speech.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: erhopf
---

# Speech Synthesis Markup Language (SSML)

Speech Synthesis Markup Language (SSML) is an XML-based markup language that lets developers specify how input text is converted into synthesized speech using the text-to-speech service. Compared to plain text, SSML allows developers to fine-tune the pitch, pronunciation, speaking rate, volume, and more of the text-to-speech output. Normal punctuation, such as pausing after a period, or using the correct intonation when a sentence ends with a question mark are automatically handled.

The Speech Services implementation of SSML is based on World Wide Web Consortium's [Speech Synthesis Markup Language Version 1.0](https://www.w3.org/TR/speech-synthesis).

> [!IMPORTANT]
> Chinese, Japanese, and Korean characters count as two characters for billing. For more information, see [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

## Standard, neural, and custom voices

Choose from standard and neural voices, or create your own custom voice unique to your product or brand. 75+ standard voices are available in more than 45 languages and locales, and 5 neural voices are available in 4 languages and locales. For a complete list of supported languages, locales, and voices (neural and standard), see [language support](language-support.md).

To learn more about standard, neural, and custom voices, see [Text-to-speech overview](text-to-speech.md).

## Supported SSML elements

Each SSML document is created with SSML elements (or tags). These elements are used to adjust pitch, prosody, volume, and more. The following sections detail how each element is used, and when an element is required or optional.  

> [!IMPORTANT]
> Don't forget to use double quotes around attribute values. Standards for well-formed, valid XML requires attribute values to be enclosed in double quotation marks. For example, `<prosody volume="90">` is a well-formed, valid element, but `<prosody volume=90>` is not. SSML may not recognize attribute values that are not in quotes.

## Create an SSML document

`speak` is the root element, and is **required** for all SSML documents. The `speak` element contains important information, such as version, language, and the markup vocabulary definition.

**Syntax**

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="string"></speak>
```

**Attributes**

| Attribute | Description | Required / Optional |
|-----------|-------------|---------------------|
| version | Indicates the version of the SSML specification used to interpret the document markup. The current version is 1.0. | Required |
| xml:lang | Specifies the language of the root document. The value may contain a lowercase, two-letter language code (for example, **en**), or the language code and uppercase country/region (for example, **en-US**). | Required |
| xmlns | Specifies the URI to the document that defines the markup vocabulary (the element types and attribute names) of the SSML document. The current URI is https://www.w3.org/2001/10/synthesis. | Required |

## Choose a voice for text-to-speech

The `voice` element is required. It is used to specify the voice that is used for text-to-speech.

**Syntax**

```xml
<voice name="string">
    This text will get converted into synthesized speech.
</voice>
```

**Attributes**

| Attribute | Description | Required / Optional |
|-----------|-------------|---------------------|
| name | Identifies the voice used for text-to-speech output. For a complete list of supported voices, see [Language support](language-support.md#text-to-speech). | Required |

**Example**

> [!NOTE]
> This example uses the `en-US-Jessa24kRUS` voice. For a complete list of supported voices, see [Language support](language-support.md#text-to-speech).

```XML
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice  name="en-US-Jessa24kRUS">
        This is the text that is spoken.
    </voice>
</speak>
```

## Use multiple voices

Within the `speak` element, you can specify multiple voices for text-to-speech output. These voices can be in different languages. For each voice, the text must be wrapped in a `voice` element.

**Attributes**

| Attribute | Description | Required / Optional |
|-----------|-------------|---------------------|
| name | Identifies the voice used for text-to-speech output. For a complete list of supported voices, see [Language support](language-support.md#text-to-speech). | Required |

**Example**

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice  name="en-US-Jessa24kRUS">
        Good morning!
    </voice>
    <voice  name="en-US-Guy24kRUS">
        Good morning to you too Jessa!
    </voice>
</speak>
```

## Adjust speaking styles

> [!IMPORTANT]
> This feature will only work with neural voices.

By default, the text-to-speech service synthesizes text using a neutral speaking style for both standard and neural voices. With neural voices, you can adjust the speaking style to express cheerfulness, empathy, or sentiment with the `<mstts:express-as>` element. This is an optional element unique to Azure Speech Services.

Currently, speaking style adjustments are supported for these neural voices:
* `en-US-JessaNeural`
* `zh-CN-XiaoxiaoNeural`

Changes are applied at the sentence level, and style vary by voice. If a style isn't supported, the service will return speech in the default neutral speaking style.

**Syntax**

```xml
<mstts:express-as type="string"></mstts:express-as>
```

**Attributes**

| Attribute | Description | Required / Optional |
|-----------|-------------|---------------------|
| type | Specifies the speaking style. Currently, speaking styles are voice specific. | Required if adjusting the speaking style for a neural voice. If using `mstts:express-as`, then type must be provided. If an invalid value is provided, this element will be ignored. |

Use this table to determine which speaking styles are supported for each neural voice.

| Voice | Type | Description |
|-------|------|-------------|
| `en-US-JessaNeural` | type=`cheerful` | Expresses an emotion that is positive and happy |
| | type=`empathy` | Expresses a sense of caring and understanding |
| `zh-CN-XiaoxiaoNeural` | type=`newscast` | Expresses a formal tone, similar to news broadcasts |
| | type=`sentiment` | Conveys a touching message or a story |

**Example**

This SSML snippet illustrates how the `<mstts:express-as>` element is used to change the speaking style to `cheerful`.

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
    <voice name="en-US-JessaNeural">
        <mstts:express-as type="cheerful">
            That'd be just amazing!
        </mstts:express-as>
    </voice>
</speak>
```

## Add or remove a break/pause

Use the `break` element to insert pauses (or breaks) between words, or prevent pauses automatically added by the text-to-speech service.

> [!NOTE]
> Use this element to override the default behavior of text-to-speech (TTS) for a word or phrase if the synthesized speech for that word or phrase sounds unnatural. Set `strength` to `none` to prevent a prosodic break, which is automatically inserted by the tex-to-speech service.

**Syntax**

```xml
<break strength="string" />
<break time="string" />
```

**Attributes**

| Attribute | Description | Required / Optional |
|-----------|-------------|---------------------|
| strength | Specifies the relative duration of a pause using one of the following values:<ul><li>none</li><li>x-weak</li><li>weak</li><li>medium (default)</li><li>strong</li><li>x-strong</li></ul> | Optional |
| time | Specifies the absolute duration of a pause in seconds or milliseconds. Examples of valid values are 2s and 500 | Optional |

| Strength | Description |
|----------|-------------|
| None, or if no value provided | 0 ms |
| x-weak | 250 ms |
| weak | 500 ms |
| medium | 750 ms |
| strong | 1000 ms |
| x-strong | 1250 ms |


**Example**

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice  name="en-US-Jessa24kRUS">
        Welcome to Microsoft Cognitive Services <break time="100ms" /> Text-to-Speech API.
    </voice>
</speak>
```

## Specify paragraphs and sentences

`p` and `s` elements are used to denote paragraphs and sentences, respectively. In the absence of these elements, the text-to-speech service automatically determines the structure of the SSML document.

The `p` element may contain text and the following elements: `audio`, `break`, `phoneme`, `prosody`, `say-as`, `sub`, `mstts:express-as`, and `s`.

The `s` element may contain text and the following elements: `audio`, `break`, `phoneme`, `prosody`, `say-as`, `mstts:express-as`, and `sub`.

**Syntax**

```XML
<p></p>
<s></s>
```

**Example**

```XML
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice  name="en-US-Jessa24kRUS">
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

The `ph` element is used to for phonetic pronunciation in SSML documents. The `ph` element can only contain text, no other elements. Always provide human-readable speech as a fallback.

Phonetic alphabets are composed of phones, which are made up of letters, numbers, or characters, sometimes in combination. Each phone describes a unique sound of speech. This is in contrast to the Latin alphabet, where any letter may represent multiple spoken sounds. Consider the different pronunciations of the letter "c" in the words "candy" and "cease", or the different pronunciations of the letter combination "th" in the words "thing" and "those".

**Syntax**

```XML
<phoneme alphabet="string" ph="string"></phoneme>
```

**Attributes**

| Attribute | Description | Required / Optional |
|-----------|-------------|---------------------|
| alphabet | Specifies the phonetic alphabet to use when synthesizing the pronunciation of the string in the `ph` attribute. The string specifying the alphabet must be specified in lowercase letters. The following are the possible alphabets that you may specify.<ul><li>ipa &ndash; International Phonetic Alphabet</li><li>sapi &ndash; Speech API Phone Set</li><li>ups &ndash; Universal Phone Set</li></ul>The alphabet applies only to the phoneme in the element. For more information, see [Phonetic Alphabet Reference](https://msdn.microsoft.com/library/hh362879(v=office.14).aspx). | Optional |
| ph | A string containing phones that specify the pronunciation of the word in the `phoneme` element. If the specified string contains unrecognized phones, the text-to-speech (TTS) service rejects the entire SSML document and produces none of the speech output specified in the document. | Required if using phonemes. |

**Examples**

```XML
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice  name="en-US-Jessa24kRUS">
        <s>His name is Mike <phoneme alphabet="ups" ph="JH AU"> Zhou </phoneme></s>
    </voice>
</speak>
```

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice  name="en-US-Jessa24kRUS">
        <phoneme alphabet="ipa" ph="t&#x259;mei&#x325;&#x27E;ou&#x325;"> tomato </phoneme>
    </voice>
</speak>
```

## Adjust prosody

The `prosody` element is used to specify changes to pitch, countour, range, rate, duration, and volume for the text-to-speech output. The `prosody` element may contain text and the following elements: `audio`, `break`, `p`, `phoneme`, `prosody`, `say-as`, `sub`, and `s`.

Because prosodic attribute values can vary over a wide range, the speech recognizer interprets the assigned values as a suggestion of what the actual prosodic values of the selected voice should be. The text-to-speech service limits or substitutes values that are not supported. Examples of unsupported values are a pitch of 1 MHz or a volume of 120.

**Syntax**

```XML
<prosody pitch="value" contour="value" range="value" rate="value" duration="value" volume="value"></prosody>
```

**Attributes**

| Attribute | Description | Required / Optional |
|-----------|-------------|---------------------|
| pitch | Indicates the baseline pitch for the text. You may express the pitch as:<ul><li>An absolute value, expressed as a number followed by "Hz" (Hertz). For example, 600Hz.</li><li>A relative value, expressed as a number preceded by "+" or "-" and followed by "Hz" or "st", that specifies an amount to change the pitch. For example: +80Hz or -2st. The "st" indicates the change unit is semitone, which is half of a tone (a half step) on the standard diatonic scale.</li><li>A constant value:<ul><li>x-low</li><li>low</li><li>medium</li><li>high</li><li>x-high</li><li>default</li></ul></li></ul>. | Optional |
| contour | Contour isn't supported for neural voices. Contour represents changes in pitch for speech content as an array of targets at specified time positions in the speech output. Each target is defined by sets of parameter pairs. For example: <br/><br/>`<prosody contour="(0%,+20Hz) (10%,-2st) (40%,+10Hz)">`<br/><br/>The first value in each set of parameters specifies the location of the pitch change as a percentage of the duration of the text. The second value specifies the amount to raise or lower the pitch, using a relative value or an enumeration value for pitch (see `pitch`). | Optional |
| range  | A value that represents the range of pitch for the text. You may express `range` using the same absolute values, relative values, or enumeration values used to describe `pitch`. | Optional |
| rate  | Indicates the speaking rate of the text. You may express `rate` as:<ul><li>A relative value, expressed as a number that acts as a multiplier of the default. For example, a value of *1* results in no change in the rate. A value of *.5* results in a halving of the rate. A value of *3* results in a tripling of the rate.</li><li>A constant value:<ul><li>x-slow</li><li>slow</li><li>medium</li><li>fast</li><li>x-fast</li><li>default</li></ul></li></ul> | Optional |
| duration  | The period of time that should elapse while the speech synthesis (TTS) service reads the text, in seconds or milliseconds. For example, *2s* or *1800ms*. | Optional |
| volume  | Indicates the volume level of the speaking voice. You may express the volume as:<ul><li>An absolute value, expressed as a number in the range of 0.0 to 100.0, from *quietest* to *loudest*. For example, 75. The default is 100.0.</li><li>A relative value, expressed as a number preceded by "+" or "-" that specifies an amount to change the volume. For example +10 or -5.5.</li><li>A constant value:<ul><li>silent</li><li>x-soft</li><li>soft</li><li>medium</li><li>loud</li><li>x-loud</li><li>default</li></ul></li></ul> | Optional |

### Change speaking rate

Speaking rate can be applied to standard voices at the word or sentence-level. Whereas speaking rate can only be applied to neural voices at the sentence level.

**Example**

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice  name="en-US-Guy24kRUS">
        <prosody rate="+30.00%">
            Welcome to Microsoft Cognitive Services Text-to-Speech API.
        </prosody>
    </voice>
</speak>
```

### Change volume

Volume changes can be applied to standard voices at the word or sentence-level. Whereas volume changes can only be applied to neural voices at the sentence level.

**Example**

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice  name="en-US-Jessa24kRUS">
        <prosody volume="+20.00%">
            Welcome to Microsoft Cognitive Services Text-to-Speech API.
        </prosody>
    </voice>
</speak>
```

### Change pitch

Pitch changes can be applied to standard voices at the word or sentence-level. Whereas pitch changes can only be applied to neural voices at the sentence level.

**Example**

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice  name="en-US-Guy24kRUS">
        Welcome to <prosody pitch="high">Microsoft Cognitive Services Text-to-Speech API.</prosody>
    </voice>
</speak>
```

### Change pitch contour

> [!IMPORTANT]
> Pitch contour changes aren't supported with neural voices.

**Example**

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice  name="en-US-Jessa24kRUS">
        <prosody contour="(80%,+20%) (90%,+30%)" >
            Good morning.
        </prosody>
    </voice>
</speak>
```

## Next steps

* [Language support: voices, locales, languages](language-support.md)
