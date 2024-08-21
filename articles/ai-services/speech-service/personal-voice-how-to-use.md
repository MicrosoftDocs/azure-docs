---
title: Use personal voice in your application
titleSuffix: Azure AI services
description: Learn how to integrate personal voice in your application.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 2/7/2024
ms.author: eur
ms.custom: references_regions, build-2024
---

# Use personal voice in your application

You can use the [speaker profile ID](./personal-voice-create-voice.md) for your personal voice to synthesize speech in any of the 91 languages supported across 100+ locales. A locale tag isn't required. Personal voice uses automatic language detection at the sentence level. 

## Integrate personal voice in your application

You need to use [speech synthesis markup language (SSML)](./speech-synthesis-markup-voice.md#speaker-profile-id) to use personal voice in your application. SSML is an XML-based markup language that provides a standard way to mark up text for the generation of synthetic speech. SSML tags are used to control the pronunciation, volume, pitch, rate, and other attributes of the speech synthesis output.

- The `speakerProfileId` property in SSML is used to specify the [speaker profile ID](./personal-voice-create-voice.md) for the personal voice.

- The voice name is specified in the `name` property in SSML. For personal voice, the voice name must be one of the supported base model voice names. To get a list of supported base model voice names, use the [BaseModels_List](/rest/api/aiservices/speechapi/base-models/list) operation of the custom voice API.
  
  > [!NOTE]
  > The voice names labeled with the `Latest`, such as `DragonLatestNeural` or `PhoenixLatestNeural`, will be updated from time to time; its performance may vary with updates for ongoing improvements. If you would like to use a fixed version, select one labeled with a version number, such as `PhoenixV2Neural`.

- `DragonLatestNeural` is a base model with superior voice cloning similarity compared to `PhoenixLatestNeural`. `PhoenixLatestNeural` is a base model with more accurate pronunciation and lower latency than `DragonLatestNeural`.

- For personal voice, you can use the `<lang xml:lang>` element to adjust the speaking language. It's the same as with multilingual voices. See [how to use the lang element to speak different languages](speech-synthesis-markup-voice.md#lang-examples).
  
Here's example SSML in a request for text to speech with the voice name and the speaker profile ID. The sample also demonstrates how to switch languages from `en-US` to `zh-HK` using the `<lang xml:lang>` element.

```xml
<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'>
    <voice name='DragonLatestNeural'> 
        <mstts:ttsembedding speakerProfileId='your speaker profile ID here'> 
            I'm happy to hear that you find me amazing and that I have made your trip planning easier and more fun. 
            <lang xml:lang='zh-HK'>我很高興聽到你覺得我很了不起，我讓你的旅行計劃更輕鬆、更有趣。</lang>
        </mstts:ttsembedding> 
    </voice> 
</speak>
```

You can use the SSML via the [Speech SDK](./get-started-text-to-speech.md) or [REST API](rest-text-to-speech.md).

* **Real-time speech synthesis**: Use the [Speech SDK](./get-started-text-to-speech.md) or [REST API](rest-text-to-speech.md) to convert text to speech.
    * When you use Speech SDK, don't set Endpoint ID, just like prebuild voice.
    * When you use REST API, please use prebuilt neural voices endpoint.

## Supported and unsupported SSML elements for personal voice

For detailed information on the supported and unsupported SSML elements for Phoenix and Dragon models, refer to the following table. For instructions on how to use SSML elements, refer to the [SSML document structure and events](speech-synthesis-markup-structure.md).

| Element                 | Description                                                                 | Supported in Phoenix | Supported in Dragon |
|-------------------------|-----------------------------------------------------------------------------|----------------------|---------------------|
| `<voice>`               | Specifies the voice and optional effects (`eq_car` and `eq_telecomhp8k`).       | Yes                  | Yes                 |
| `<mstts:express-as>`    | Specifies speaking styles and roles.                                        | No                 | No                  |
| `<mstts:ttsembedding>`  | Specifies the `speakerProfileId` property for a personal voice.               | Yes                  | No                  |
| `<lang xml:lang>`       | Specifies the speaking language.                                            | Yes                  | Yes                 |
| `<prosody>`             | Adjusts pitch, contour, range, rate, and volume.                            |                      |                     |
|&nbsp;&nbsp;&nbsp;`pitch` | Indicates the baseline pitch for the text.                                          | No                   | No                  |
| &nbsp;&nbsp;&nbsp;`contour`| Represents changes in pitch.                                    | No                   | No                  |
| &nbsp;&nbsp;&nbsp;`range` | Represents the range of pitch for the text.                                       | No                   | No                  |
| &nbsp;&nbsp;&nbsp;`rate`  | Indicates the speaking rate of the text.                                            | Yes                  | Yes                 |
| &nbsp;&nbsp;&nbsp;`volume`| Indicates the volume level of the speaking voice.                                           | No                   | No                  |
| `<emphasis>`            | Adds or removes word-level stress for the text.                             | No                   | No                  |
| `<audio>`               | Embeds prerecorded audio into an SSML document.                             | Yes                  | No                  |
| `<mstts:audioduration>` | Specifies the duration of the output audio.                                 | No                   | No                  |
| `<mstts:backgroundaudio>`| Adds background audio to your SSML documents or mixes an audio file with text to speech. | Yes       | No        |
| `<phoneme>`             | Specifies phonetic pronunciation in SSML documents.                         |                      |                     |
| &nbsp;&nbsp;&nbsp;`ipa`   | One of the phonetic alphabets.                                        | Yes                  | No                  |
| &nbsp;&nbsp;&nbsp;`sapi`  | One of the phonetic alphabets.                 | No                   | No                  |
| &nbsp;&nbsp;&nbsp;`ups`   | One of the phonetic alphabets.                                      | Yes                  | No                  |
| &nbsp;&nbsp;&nbsp;`x-sampa`| One of the phonetic alphabets.                      | Yes                  | No                  |
| `<lexicon>`             | Defines how multiple entities are read in SSML.                             | Yes                  | Yes (only support alias) |
| `<say-as>`              | Indicates the content type, such as number or date, of the element's text.  | Yes                  | Yes                 |
| `<sub>`                 | Indicates that the alias attribute's text value should be pronounced instead of the element's enclosed text. | Yes  | Yes |
| `<math>`                | Uses the MathML as input text to properly pronounce mathematical notations in the output audio. | Yes | No |
| `<bookmark>`            | Gets the offset of each marker in the audio stream.                         | Yes                  | No                  |
| `<break>`               | Overrides the default behavior of breaks or pauses between words.           | Yes                  | Yes                 |
| `<mstts:silence>`       | Inserts pauses before or after text, or between two adjacent sentences.     | Yes                  | No                  |
| `<mstts:viseme>`        | Defines the position of the face and mouth while a person is speaking.      | Yes                  | No                  |
| `<p>`                   | Denotes paragraphs in SSML documents.                                       | Yes                  | Yes                 |
| `<s>`                   | Denotes sentences in SSML documents.                                        | Yes                  | Yes                 |

## Reference documentation

> [!div class="nextstepaction"]
> [Custom voice REST API reference documentation](/rest/api/speech/)

## Next steps

- Learn more about custom neural voice in the [overview](custom-neural-voice.md).
- Learn more about Speech Studio in the [overview](speech-studio-overview.md).
