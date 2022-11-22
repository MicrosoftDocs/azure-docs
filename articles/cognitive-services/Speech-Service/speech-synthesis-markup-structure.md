---
title: Speech Synthesis Markup Language (SSML) document structure - Speech service
titleSuffix: Azure Cognitive Services
description: Learn about the Speech Synthesis Markup Language (SSML) document structure.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 11/21/2022
ms.author: eur
---

# Speech Synthesis Markup Language (SSML) document structure

Speech Synthesis Markup Language (SSML) is an XML-based markup language that can be used to fine-tune the text-to-speech output attributes such as pitch, pronunciation, speaking rate, volume, and more. You have more control and flexibility compared to plain text input. The Speech service automatically handles punctuation as appropriate, such as pausing after a period, or using the correct intonation when a sentence ends with a question mark.


## Document structure

The Speech service implementation of SSML is based on the World Wide Web Consortium's [Speech Synthesis Markup Language Version 1.0](https://www.w3.org/TR/2004/REC-speech-synthesis-20040907/).

Each SSML document is created with SSML elements or tags. These elements are used to adjust pitch, prosody, volume, and more.

Special characters such as quotation marks, apostrophes, and brackets, must be escaped. For more information, see [Extensible Markup Language (XML) 1.0: Appendix D](https://www.w3.org/TR/xml/#sec-entexpand).

Attribute values must be enclosed by double quotation marks. For example, `<prosody volume="90">` is a well-formed, valid element, but `<prosody volume=90>` will not be recognized. 

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="string">
    <mstts:backgroundaudio src="string" volume="string" fadein="string" fadeout="string"/>
    <voice name="string">
        <audio src="string"/></audio>
        <bookmark mark="string"/>
        <break />
        <break strength="string" />
        <break time="string" />
        <emphasis level="value"></emphasis>
        <lang xml:lang="string"></lang>
        <lexicon uri="string"/>
        <math xmlns="http://www.w3.org/1998/Math/MathML"></math>
        <mstts:express-as style="string" styledegree="value" role="string"></mstts:express-as>
        <mstts:silence type="string" value="string"/>
        <mstts:viseme type="string"/>
        <p></p>
        <phoneme alphabet="string" ph="string"></phoneme>
        <prosody pitch="value" contour="value" range="value" rate="value" volume="value"></prosody>
        <s></s>
        <say-as interpret-as="string" format="string" detail="string"></say-as>
    </voice>
</speak>
```

The `p` element can contain text and the following elements: `audio`, `break`, `phoneme`, `prosody`, `say-as`, `sub`, `mstts:express-as`, and `s`.

The `s` element can contain text and the following elements: `audio`, `break`, `phoneme`, `prosody`, `say-as`, `mstts:express-as`, and `sub`.

The `phoneme` element can contain only text but no other elements.

The `prosody` element can contain text and the following elements: `audio`, `break`, `p`, `phoneme`, `prosody`, `say-as`, `sub`, and `s`.

The `emphasis` element can only contain text and the following elements: `audio`, `break`, `emphasis`, `lang`, `phoneme`, `prosody`, `say-as`, `sub`, and `voice`.

The `say-as` element can only contain text.

The body of the `audio` element can contain plain text or SSML markup that's spoken if the audio file is unavailable or unplayable. The `audio` element can also contain text and the following elements: `audio`, `break`, `p`, `s`, `phoneme`, `prosody`, `say-as`, and `sub`.

The `mstts:backgroundaudio` element should be put in front of all `voice` elements, i.e., the first child of the `speak` element. Only one `mstts:backgroundaudio` element is allowed per SSML document. You can intersperse `audio` tags within the `voice` element to add more audio to your SSML document.

## Create an SSML document

The `speak` element is the root element that's required for all SSML documents. The `speak` element contains information such as version, language, and the markup vocabulary definition.

Here's the syntax for the `speak` element:

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="string"></speak>
```

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `version` | Indicates the version of the SSML specification used to interpret the document markup. The current version is "1.0".| Required|
| `xml:lang` | Specifies the language of the root document. The value can contain a language code such as `en` (English), or a locale such as `en-US` (English - United States). | Required |
| `xmlns` | Specifies the URI to the document that defines the markup vocabulary (the element types and attribute names) of the SSML document. The current URI is "http://www.w3.org/2001/10/synthesis". | Required |

## Add or remove a break or pause

Use the `break` element to insert pauses or breaks between words. You can also use it to prevent pauses that are automatically added by text-to-speech.

> [!NOTE]
> Use this element to override the default behavior of text-to-speech for a word or phrase if the synthesized speech for that word or phrase sounds unnatural. Set `strength` to `none` to prevent a prosodic break, which is automatically inserted by text-to-speech.

Usage of the `break` element's attributes are described in the following table.

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `strength` | Specifies the relative duration of a pause by using one of the following values:<ul><li>none</li><li>x-weak</li><li>weak</li><li>medium (default)</li><li>strong</li><li>x-strong</li></ul> | Optional |
| `time`     | Specifies the absolute duration of a pause in seconds (such as `2s`) or milliseconds (such as `500ms`). Valid values range from 0 to 5000 milliseconds. If you set a value greater than the supported maximum, the service will use `5000ms`. If the `time` attribute is set, the `strength` attribute is ignored.| Optional |

Here are more details about the `strength` attribute.

| Strength                      | Relative duration |
| ----------------------------- | ----------- |
| None, or if no value provided | 0 ms        |
| X-weak                        | 250 ms      |
| Weak                          | 500 ms      |
| Medium                        | 750 ms      |
| Strong                        | 1,000 ms    |
| X-strong                      | 1,250 ms    |

### break examples

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        Welcome <break /> to text-to-speech.
        Welcome <break strength="medium" /> to text-to-speech.
        Welcome <break time="250ms" /> to text-to-speech.
    </voice>
</speak>
```

## Add silence

Use the `mstts:silence` element to insert pauses before or after text, or between two adjacent sentences.

> [!NOTE]
>The difference between `mstts:silence` and `break` is that `break` can be added any place in the text. Silence only works at the beginning or end of input text or at the boundary of two adjacent sentences.

Usage of the `mstts:silence` element's attributes are described in the following table.

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `type` | Specifies where and how to add silence. The following silence types are supported:<br/><ul><li>`Leading` – Additional silence at the beginning of the text. The value that you set is added to the natural silence before the start of text.</li><li>`Leading-exact` – Silence at the beginning of the text. The value is an absolute silence length.</li><li>`Tailing` – Additional silence at the end of text. The value that you set is added to the natural silence after the last word.</li><li>`Tailing-exact` – Silence at the end of the text. The value is an absolute silence length.</li><li>`Sentenceboundary` – Additional silence between adjacent sentences. The actual silence length for this type includes the natural silence after the last word in the previous sentence, the value you set for this type, and the natural silence before the starting word in the next sentence.</li><li>`Sentenceboundary-exact` – Silence between adjacent sentences. The value is an absolute silence length.</li></ul><br/>An absolute silence type (with the `-exact` suffix) replaces any otherwise natural leading or trailing silence. Absolute silence types take precedence over the corresponding non-absolute type. For example, if you set both `Leading` and `Leading-exact` types, the `Leading-exact` type will take effect.| Required |
| `Value`   | Specifies the duration of a pause in seconds (such as `2s`) or milliseconds (such as `500ms`). Valid values range from 0 to 5000 milliseconds. If you set a value greater than the supported maximum, the service will use `5000ms`.| Required |

###  mstts silence examples

In this example, `mtts:silence` is used to add 200 ms of silence between two sentences.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
<voice name="en-US-JennyNeural">
<mstts:silence  type="Sentenceboundary" value="200ms"/>
If we're home schooling, the best we can do is roll with what each day brings and try to have fun along the way.
A good place to start is by trying out the slew of educational apps that are helping children stay happy and smash their schooling at the same time.
</voice>
</speak>
```

## Specify paragraphs and sentences

The `p` and `s` elements are used to denote paragraphs and sentences, respectively. In the absence of these elements, text-to-speech automatically determines the structure of the SSML document.

The `p` element can contain text and the following elements: `audio`, `break`, `phoneme`, `prosody`, `say-as`, `sub`, `mstts:express-as`, and `s`.

The `s` element can contain text and the following elements: `audio`, `break`, `phoneme`, `prosody`, `say-as`, `mstts:express-as`, and `sub`.

### paragraph and sentence examples

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

## Bookmark element

You can use the `bookmark` element in SSML to reference a specific location in the text or tag sequence. Then you will use the Speech SDK and subscribe to the `BookmarkReached` event to get the offset of each marker in the audio stream. The `bookmark` element won't be spoken. For more information, see [Subscribe to synthesizer events](how-to-speech-synthesis.md#subscribe-to-synthesizer-events).

Usage of the `bookmark` element's attributes are described in the following table.

| Attribute | Description                                             | Required or optional |
| --------- | ------------------------------------------------------- | -------------------- |
| `mark`    | Specifies the reference text of the `bookmark` element. | Required             |


### bookmark examples

As an example, you might want to know the time offset of each flower word in the following snippet:

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-AriaNeural">
        We are selling <bookmark mark='flower_1'/>roses and <bookmark mark='flower_2'/>daisies.
    </voice>
</speak>
```

## Viseme element

A viseme is the visual description of a phoneme in spoken language. It defines the position of the face and mouth while a person is speaking. You can use the `mstts:viseme` element in SSML to request viseme output. For more information, see [Get facial position with viseme](how-to-speech-synthesis-viseme.md).

Usage of the `viseme` element's attributes are described in the following table.

| Attribute | Description | Required or optional |
| ---------- | ---------- | -------------------- |
| `type`    | Specifies the type of viseme output.<ul><li>`redlips_front` – lip-sync with viseme ID and audio offset output </li><li>`FacialExpression` – blend shapes output</li></ul> | Required  |

> [!NOTE]
> Currently, `redlips_front` only supports neural voices in `en-US` locale, and `FacialExpression` supports neural voices in `en-US` and `zh-CN` locales.

### viseme examples

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
