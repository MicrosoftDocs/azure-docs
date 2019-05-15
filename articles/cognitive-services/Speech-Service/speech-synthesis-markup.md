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
ms.date: 05/15/2019
ms.author: erhopf
ms.custom: seodec18
---

# Speech Synthesis Markup Language (SSML)

Speech Synthesis Markup Language (SSML) is an XML-based markup language that lets developers specify how input text is converted into synthesized speech using the text-to-speech service. Compared to plain text, SSML allows developers to fine-tune the pitch, pronunciation, speaking rate, volume, and more of the text-to-speech output. Normal punctuation, such as pausing after a period, or using the correct intonation when a sentence ends with a question mark are automatically handled.

The Speech Services implementation of SSML is based on World Wide Web Consortium's [Speech Synthesis Markup Language Version 1.0](https://www.w3.org/TR/speech-synthesis).

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
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US"></speak>
```

**Attributes**

| Attribute | Description |
|-----------|-------------|
| version | **Required.** Indicates the version of the SSML specification used to interpret the document markup. The current version is 1.0. |
| xml:lang | **Required.** Specifies the language of the root document. The value may contain a lowercase, two-letter language code (for example, **en**), or the language code and uppercase country/region (for example, **en-US**).  |
| xmlns | **Required.** Specifies the URI to the document that defines the markup vocabulary (the element types and attribute names) of the SSML document. The current URI is https://www.w3.org/2001/10/synthesis. |

## Choose a voice for text-to-speech

The `voice` element is used to specify the voice that is used for text-to-speech.

**Syntax**

```xml
<voice name='en-US-Jessa24kRUS'>
    This text will get converted into synthesized speech.
</voice>
```

**Attributes**

| Attribute | Description |
|-----------|-------------|
| name | **Required.** Identifies the voice used for text-to-speech output. For a complete list of supported voices, see [Language support](language-support.md#text-to-speech). |

**Example**

> [!NOTE]
> This example uses the `en-US-Jessa24kRUS` voice. For a complete list of supported voices, see [Language support](language-support.md#text-to-speech).

```XML
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice  name='en-US-Jessa24kRUS'>
        This is the text that is spoken.
    </voice>
</speak>
```

## Use multiple voices

Within the `speak` element, you can specify multiple voices for text-to-speech output. For each voice, the text must be wrapped in a `voice` element.

**Attributes**

| Attribute | Description |
|-----------|-------------|
| name | **Required.** Identifies the voice used for text-to-speech output. For a complete list of supported voices, see [Language support](language-support.md#text-to-speech). |

**Example**

```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
    <voice  name='en-US-Jessa24kRUS'>
        Good morning!
    </voice>
    <voice  name='en-US-Guy24kRUS'>
        Good morning to you too Jessa!
    </voice>
</speak>
```

## Speaking styles

> [!WARNING]
> This feature will only work with neural voices.

By default, the text-to-speech service synthesizes text using a neutral speaking style for both standard and neural voices. With neural voices, you can adjust the speaking style to express cheerfulness, empathy, or sentiment with the `<mstts:express-as>` element.

Currently, speaking style adjustments are supported for these neural voices:
* `en-US-JessaNeural`
* `zh-CN-XiaoxiaoNeural`

Changes are applied at the sentence level, and style vary by voice. If a style isn't supported, the service will return speech in the default neutral speaking style.

**Syntax**

```xml
<mstts:express-as type="cheerful"></mstts:express-as>
```

**Attributes**

| Attribute | Description |
|-----------|-------------|
| type | Specifies the speaking style. Currently, speaking styles are voice specific. |

Use this table to determine which speaking styles are supported for each neural voice.

| Voice | Type | Description |
|-------|------|-------------|
| `en-US-JessaNeural` | type=`cheerful` | Expresses an emotion that is positive and happy |
| | type=`empathy` | Expresses a sense of caring and understanding |
| `zh-CN-XiaoxiaoNeural` | type=`newscast` | Expresses a formal tone, similar to news broadcasts |
| | type=`sentiment ` | Conveys a touching message or a story |

**Example**

This SSML snippet illustrates how the `<mstts:express-as>` element is used to change the speaking style to `cheerful`.

```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
    <voice name='en-US-JessaNeural'>
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
<break strength="weak" />
<break time="500" />
```

**Attributes**

| Attribute | Description |
|-----------|-------------|
| strength | **Optional.** Specifies the relative duration of a pause using one of the following values:<ul><li>none</li><li>x-weak</li><li>weak</li><li>medium (default)</li><li>strong</li><li>x-strong</li></ul> |
| time | **Optional.** Specifies the absolute duration of a pause in seconds or milliseconds. Examples of valid values are 2s and 500|

**Example**

```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
    <voice  name='en-US-Jessa24kRUS'>
        Welcome to Microsoft Cognitive Services <break time="100ms" /> Text-to-Speech API.
    </voice>
</speak>
```

## Denote paragraphs and sentences

`p` and `s` elements are used to denote paragraphs and sentences, respectively. In the absence of these elements, the text-to-speech service automatically determines the structure of the SSML document.

The `p` element may contain text and the following elements: `audio`, `break`, `phoneme`, `prosody`, `say-as`, `sub`, and `s`.

The `s` element may contain text and the following elements: `audio`, `break`, `phoneme`, `prosody`, `say-as`, and `sub`.

**Syntax**

```XML
<p></p>
<s></s>
```

**Example**

```XML
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice  name='en-US-Jessa24kRUS'>
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

## Change speaking rate

Speaking rate can be applied to standard voices at the word or sentence-level. Whereas speaking rate can only be applied to neural voices at the sentence level.

```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
    <voice  name='en-US-Guy24kRUS'>
        <prosody rate="+30.00%">
            Welcome to Microsoft Cognitive Services Text-to-Speech API.
        </prosody>
    </voice>
</speak>
```

## Pronunciation
```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
<voice  name='en-US-Jessa24kRUS'>
    <phoneme alphabet="ipa" ph="t&#x259;mei&#x325;&#x27E;ou&#x325;"> tomato </phoneme>
</voice> </speak>
```

## Change volume

Volume changes can be applied to standard voices at the word or sentence-level. Whereas volume changes can only be applied to neural voices at the sentence level.

```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
<voice  name='en-US-Jessa24kRUS'>
<prosody volume="+20.00%">
    Welcome to Microsoft Cognitive Services Text-to-Speech API.
</prosody></voice> </speak>
```

## Change pitch

Pitch changes can be applied to standard voices at the word or sentence-level. Whereas pitch changes can only be applied to neural voices at the sentence level.

```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
    <voice  name='en-US-Guy24kRUS'>
    Welcome to <prosody pitch="high">Microsoft Cognitive Services Text-to-Speech API.</prosody>
</voice> </speak>
```

## Change pitch contour

> [!IMPORTANT]
> Pitch contour changes aren't supported with neural voices.

```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
<voice  name='en-US-Jessa24kRUS'>
<prosody contour="(80%,+20%) (90%,+30%)" >
    Good morning.
</prosody></voice> </speak>
```

## Use multiple voices
```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
<voice  name='en-US-Jessa24kRUS'>
    Good morning!
</voice>
<voice  name='en-US-Guy24kRUS'>
    Good morning to you too Jessa!
</voice> </speak>
```

## Next steps

* [Language support: voices, locales, languages](language-support.md)
