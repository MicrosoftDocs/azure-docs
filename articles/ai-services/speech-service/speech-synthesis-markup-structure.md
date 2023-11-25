---
title: Speech Synthesis Markup Language (SSML) document structure and events - Speech service
titleSuffix: Azure AI services
description: Learn about the Speech Synthesis Markup Language (SSML) document structure.
#services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/30/2022
ms.author: eur
---

# SSML document structure and events

The Speech Synthesis Markup Language (SSML) with input text determines the structure, content, and other characteristics of the text to speech output. For example, you can use SSML to define a paragraph, a sentence, a break or a pause, or silence. You can wrap text with event tags such as bookmark or viseme that can be processed later by your application.

Refer to the sections below for details about how to structure elements in the SSML document. 

## Document structure

The Speech service implementation of SSML is based on the World Wide Web Consortium's [Speech Synthesis Markup Language Version 1.0](https://www.w3.org/TR/2004/REC-speech-synthesis-20040907/). The elements supported by the Speech can differ from the W3C standard. 

Each SSML document is created with SSML elements or tags. These elements are used to adjust the voice, style, pitch, prosody, volume, and more.

Here's a subset of the basic structure and syntax of an SSML document:

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="string">
    <mstts:backgroundaudio src="string" volume="string" fadein="string" fadeout="string"/>
    <voice name="string" effect="string">
        <audio src="string"></audio>
        <bookmark mark="string"/>
        <break strength="string" time="string" />
        <emphasis level="value"></emphasis>
        <lang xml:lang="string"></lang>
        <lexicon uri="string"/>
        <math xmlns="http://www.w3.org/1998/Math/MathML"></math>
        <mstts:audioduration value="string"/>
        <mstts:ttsembedding speakerProfileId="string"></mstts:ttsembedding>
        <mstts:express-as style="string" styledegree="value" role="string"></mstts:express-as>
        <mstts:silence type="string" value="string"/>
        <mstts:viseme type="string"/>
        <p></p>
        <phoneme alphabet="string" ph="string"></phoneme>
        <prosody pitch="value" contour="value" range="value" rate="value" volume="value"></prosody>
        <s></s>
        <say-as interpret-as="string" format="string" detail="string"></say-as>
        <sub alias="string"></sub>
    </voice>
</speak>
```

Some examples of contents that are allowed in each element are described in the following list: 
- `audio`: The body of the `audio` element can contain plain text or SSML markup that's spoken if the audio file is unavailable or unplayable. The `audio` element can also contain text and the following elements: `audio`, `break`, `p`, `s`, `phoneme`, `prosody`, `say-as`, and `sub`.
- `bookmark`: This element can't contain text or any other elements.
- `break`: This element can't contain text or any other elements.
- `emphasis`: This element can contain text and the following elements: `audio`, `break`, `emphasis`, `lang`, `phoneme`, `prosody`, `say-as`, and `sub`.
- `lang`: This element can contain all other elements except `mstts:backgroundaudio`, `voice`, and `speak`.
- `lexicon`: This element can't contain text or any other elements.
- `math`: This element can only contain text and MathML elements.
- `mstts:audioduration`: This element can't contain text or any other elements.
- `mstts:backgroundaudio`: This element can't contain text or any other elements.
- `mstts:embedding`: This element can contain text and the following elements: `audio`, `break`, `emphasis`, `lang`, `phoneme`, `prosody`, `say-as`, and `sub`.
- `mstts:express-as`: This element can contain text and the following elements: `audio`, `break`, `emphasis`, `lang`, `phoneme`, `prosody`, `say-as`, and `sub`.
- `mstts:silence`: This element can't contain text or any other elements.
- `mstts:viseme`: This element can't contain text or any other elements.
- `p`: This element can contain text and the following elements: `audio`, `break`, `phoneme`, `prosody`, `say-as`, `sub`, `mstts:express-as`, and `s`.
- `phoneme`: This element can only contain text and no other elements.
- `prosody`: This element can contain text and the following elements: `audio`, `break`, `p`, `phoneme`, `prosody`, `say-as`, `sub`, and `s`.
- `s`: This element can contain text and the following elements: `audio`, `break`, `phoneme`, `prosody`, `say-as`, `mstts:express-as`, and `sub`.
- `say-as`: This element can only contain text and no other elements.
- `sub`: This element can only contain text and no other elements.
- `speak`: The root element of an SSML document. This element can contain the following elements: `mstts:backgroundaudio` and `voice`.
- `voice`: This element can contain all other elements except `mstts:backgroundaudio` and `speak`.

The Speech service automatically handles punctuation as appropriate, such as pausing after a period, or using the correct intonation when a sentence ends with a question mark.

## Special characters

To use the characters `&`, `<`, and `>` within the SSML element's value or text, you must use the entity format. Specifically you must use `&amp;` in place of `&`, use `&lt;` in place of `<`, and use `&gt;` in place of `>`. Otherwise the SSML will not be parsed correctly. 

For example, specify `green &amp; yellow` instead of `green & yellow`. The following SSML will be parsed as expected:

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        My favorite colors are green &amp; yellow.
    </voice>
</speak>
```

Special characters such as quotation marks, apostrophes, and brackets, must be escaped. For more information, see [Extensible Markup Language (XML) 1.0: Appendix D](https://www.w3.org/TR/xml/#sec-entexpand).

Attribute values must be enclosed by double or single quotation marks. For example, `<prosody volume="90">` and `<prosody volume='90'>` are well-formed, valid elements, but `<prosody volume=90>` won't be recognized. 

## Speak root element

The `speak` element contains information such as version, language, and the markup vocabulary definition. The `speak` element is the root element that's required for all SSML documents. You must specify the default language within the `speak` element, whether or not the language is adjusted elsewhere such as within the [`lang`](speech-synthesis-markup-voice.md#adjust-speaking-languages) element. 

Here's the syntax for the `speak` element:

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="string"></speak>
```

| Attribute | Description | Required or optional |
| ---------- | ---------- | ---------- |
| `version` | Indicates the version of the SSML specification used to interpret the document markup. The current version is "1.0".| Required|
| `xml:lang` | The language of the root document. The value can contain a language code such as `en` (English), or a locale such as `en-US` (English - United States). | Required |
| `xmlns` | The URI to the document that defines the markup vocabulary (the element types and attribute names) of the SSML document. The current URI is "http://www.w3.org/2001/10/synthesis". | Required |

The `speak` element must contain at least one [voice element](speech-synthesis-markup-voice.md#use-voice-elements).

### speak examples

The supported values for attributes of the `speak` element were [described previously](#speak-root-element). 

#### Single voice example

This example uses the `en-US-JennyNeural` voice. For more examples, see [voice examples](speech-synthesis-markup-voice.md#voice-examples).

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        This is the text that is spoken.
    </voice>
</speak>
```

## Add a break

Use the `break` element to override the default behavior of breaks or pauses between words. You can use it to add pauses that are otherwise automatically inserted by the Speech service.

Usage of the `break` element's attributes are described in the following table.

| Attribute | Description | Required or optional |
| ---------- | ---------- | ---------- |
| `strength` | The relative duration of a pause by using one of the following values:<br/><ul><li>x-weak</li><li>weak</li><li>medium (default)</li><li>strong</li><li>x-strong</li></ul>| Optional |
| `time`     | The absolute duration of a pause in seconds (such as `2s`) or milliseconds (such as `500ms`). Valid values range from 0 to 5000 milliseconds. If you set a value greater than the supported maximum, the service will use `5000ms`. If the `time` attribute is set, the `strength` attribute is ignored.| Optional |

Here are more details about the `strength` attribute.

| Strength                      | Relative duration |
| ---------- | ---------- |
| X-weak                        | 250 ms      |
| Weak                          | 500 ms      |
| Medium                        | 750 ms      |
| Strong                        | 1,000 ms    |
| X-strong                      | 1,250 ms    |

### Break examples

The supported values for attributes of the `break` element were [described previously](#add-a-break). The following three ways all add 750 ms breaks.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural">
        Welcome <break /> to text to speech.
        Welcome <break strength="medium" /> to text to speech.
        Welcome <break time="750ms" /> to text to speech.
    </voice>
</speak>
```

## Add silence

Use the `mstts:silence` element to insert pauses before or after text, or between two adjacent sentences.

One of the differences between `mstts:silence` and `break` is that a `break` element can be inserted anywhere in the text. Silence only works at the beginning or end of input text or at the boundary of two adjacent sentences.

The silence setting is applied to all input text within it's enclosing `voice` element. To reset or change the silence setting again, you must use a new `voice` element with either the same voice or a different voice.

Usage of the `mstts:silence` element's attributes are described in the following table.

| Attribute | Description | Required or optional |
| ---------- | ---------- | ---------- |
| `type` | Specifies where and how to add silence. The following silence types are supported:<br/><ul><li>`Leading` – Additional silence at the beginning of the text. The value that you set is added to the natural silence before the start of text.</li><li>`Leading-exact` – Silence at the beginning of the text. The value is an absolute silence length.</li><li>`Tailing` – Additional silence at the end of text. The value that you set is added to the natural silence after the last word.</li><li>`Tailing-exact` – Silence at the end of the text. The value is an absolute silence length.</li><li>`Sentenceboundary` – Additional silence between adjacent sentences. The actual silence length for this type includes the natural silence after the last word in the previous sentence, the value you set for this type, and the natural silence before the starting word in the next sentence.</li><li>`Sentenceboundary-exact` – Silence between adjacent sentences. The value is an absolute silence length.</li><li>`Comma-exact` – Silence at the comma in half-width or full-width format. The value is an absolute silence length.</li><li>`Semicolon-exact` – Silence at the semicolon in half-width or full-width format. The value is an absolute silence length.</li><li>`Enumerationcomma-exact` – Silence at the enumeration comma in full-width format. The value is an absolute silence length.</li></ul><br/>An absolute silence type (with the `-exact` suffix) replaces any otherwise natural leading or trailing silence. Absolute silence types take precedence over the corresponding non-absolute type. For example, if you set both `Leading` and `Leading-exact` types, the `Leading-exact` type will take effect. The [WordBoundary event](how-to-speech-synthesis.md#subscribe-to-synthesizer-events) takes precedence over punctuation-related silence settings including `Comma-exact`, `Semicolon-exact`, or `Enumerationcomma-exact`. When using both the `WordBoundary` event and punctuation-related silence settings, the punctuation-related silence settings won't take effect.| Required |
| `Value`   | The duration of a pause in seconds (such as `2s`) or milliseconds (such as `500ms`). Valid values range from 0 to 5000 milliseconds. If you set a value greater than the supported maximum, the service will use `5000ms`.| Required |

###  mstts silence examples

The supported values for attributes of the `mstts:silence` element were [described previously](#add-silence).

In this example, `mstts:silence` is used to add 200 ms of silence between two sentences.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
<voice name="en-US-JennyNeural">
<mstts:silence  type="Sentenceboundary" value="200ms"/>
If we're home schooling, the best we can do is roll with what each day brings and try to have fun along the way.
A good place to start is by trying out the slew of educational apps that are helping children stay happy and smash their schooling at the same time.
</voice>
</speak>
```

In this example, `mstts:silence` is used to add 50 ms of silence at the comma, 100 ms of silence at the semicolon, and 150 ms of silence at the enumeration comma.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="zh-CN">
<voice name="zh-CN-YunxiNeural">
<mstts:silence type="comma-exact" value="50ms"/><mstts:silence type="semicolon-exact" value="100ms"/><mstts:silence type="enumerationcomma-exact" value="150ms"/>你好呀，云希、晓晓；你好呀。
</voice>
</speak>
```

## Specify paragraphs and sentences

The `p` and `s` elements are used to denote paragraphs and sentences, respectively. In the absence of these elements, the Speech service automatically determines the structure of the SSML document.

### Paragraph and sentence examples

The following example defines two paragraphs that each contain sentences. In the second paragraph, the Speech service automatically determines the sentence structure, since they aren't defined in the SSML document.

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

You can use the `bookmark` element in SSML to reference a specific location in the text or tag sequence. Then you'll use the Speech SDK and subscribe to the `BookmarkReached` event to get the offset of each marker in the audio stream. The `bookmark` element won't be spoken. For more information, see [Subscribe to synthesizer events](how-to-speech-synthesis.md#subscribe-to-synthesizer-events).

Usage of the `bookmark` element's attributes are described in the following table.

| Attribute | Description | Required or optional |
| ---------- | ---------- | ---------- |
| `mark` | The reference text of the `bookmark` element. | Required |

### Bookmark examples

The supported values for attributes of the `bookmark` element were [described previously](#bookmark-element).

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

The viseme setting is applied to all input text within it's enclosing `voice` element. To reset or change the viseme setting again, you must use a new `voice` element with either the same voice or a different voice.

Usage of the `viseme` element's attributes are described in the following table.

| Attribute | Description | Required or optional |
| ---------- | ---------- | ---------- |
| `type`    | The type of viseme output.<ul><li>`redlips_front` – lip-sync with viseme ID and audio offset output </li><li>`FacialExpression` – blend shapes output</li></ul> | Required  |

> [!NOTE]
> Currently, `redlips_front` only supports neural voices in `en-US` locale, and `FacialExpression` supports neural voices in `en-US` and `zh-CN` locales.

### Viseme examples

The supported values for attributes of the `viseme` element were [described previously](#viseme-element).

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

- [SSML overview](speech-synthesis-markup.md)
- [Voice and sound with SSML](speech-synthesis-markup-voice.md)
- [Language support: Voices, locales, languages](language-support.md?tabs=tts)
