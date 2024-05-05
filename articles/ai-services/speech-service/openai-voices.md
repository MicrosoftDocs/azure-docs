---
title: What are OpenAI text to speech voices?
titleSuffix: Azure AI services
description: Learn about OpenAI text to speech voices that you can use with speech synthesis.
author: eric-urban
ms.author: eur
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 4/23/2024
ms.reviewer: v-baolianzou
ms.custom: references_regions
#customer intent: As a user who implements text to speech, I want to understand the options and differences between available OpenAI text to speech voices in Azure AI services.
---

# What are OpenAI text to speech voices? 

Like Azure AI Speech voices, OpenAI text to speech voices deliver high-quality speech synthesis to convert written text into natural sounding spoken audio. This unlocks a wide range of possibilities for immersive and interactive user experiences. 

OpenAI text to speech voices are available via two model variants: `Neural` and `NeuralHD`.

- `Neural`: Optimized for real-time use cases with the lowest latency, but lower quality than `NeuralHD`.
- `NeuralHD`: Optimized for quality.

For a demonstration of OpenAI voices in Azure OpenAI Studio and Speech Studio, view this [introductory video](https://youtu.be/Ic505XeV3gs).
> [!VIDEO https://www.youtube.com/embed/Ic505XeV3gs]

## Available text to speech voices in Azure AI services

You might ask: If I want to use an OpenAI text to speech voice, should I use it via the Azure OpenAI Service or via Azure AI Speech? What are the scenarios that guide me to use one or the other?

Each voice model offers distinct features and capabilities, allowing you to choose the one that best suits your specific needs. You want to understand the options and differences between available text to speech voices in Azure AI services.

You can choose from the following text to speech voices in Azure AI services:

- OpenAI text to speech voices in [Azure OpenAI Service](../openai/reference.md#text-to-speech). Available in the following regions: North Central US and Sweden Central.
- OpenAI text to speech voices in [Azure AI Speech](./language-support.md?tabs=tts#multilingual-voices). Available in the following regions: North Central US and Sweden Central.
- Azure AI Speech service [text to speech voices](./language-support.md?tabs=tts#prebuilt-neural-voices). Available in dozens of regions. See the [region list](regions.md#speech-service).

## OpenAI text to speech voices via Azure OpenAI Service or via Azure AI Speech?

If you want to use OpenAI text to speech voices, you can choose whether to use them via [Azure OpenAI](../openai/text-to-speech-quickstart.md) or via [Azure AI Speech](./get-started-text-to-speech.md#openai-text-to-speech-voices-in-azure-ai-speech). In either case, the speech synthesis result is the same. 

Here's a comparison of features between OpenAI text to speech voices in Azure OpenAI Service and OpenAI text to speech voices in Azure AI Speech. 

| Feature | Azure OpenAI Service (OpenAI voices) | Azure AI Speech (OpenAI voices) | Azure AI Speech voices |
|---------|---------------|------------------------|
| **Region** | North Central US, Sweden Central | North Central US, Sweden Central | Available in dozens of regions. See the [region list](regions.md#speech-service).|
| **Voice variety** | 6 | 6 | More than 400 |
| **Multilingual voice number** | 6 | 6 | 14 |
| **Max multilingual language coverage** | 57 | 57 | 77 |
| **Speech Synthesis Markup Language (SSML) support** | Not supported | Support for [a subset of SSML elements](#ssml-elements-supported-by-openai-text-to-speech-voices-in-azure-ai-speech). | Support for the [full set of SSML](speech-synthesis-markup-structure.md) in Azure AI Speech. |
| **Development options** | REST API | Speech SDK, Speech CLI, REST API | Speech SDK, Speech CLI, REST API |
| **Deployment option** | Cloud only | Cloud only | Cloud, embedded, hybrid, and containers. |
| **Real-time or batch synthesis** |  Real-time | Real-time and batch synthesis | Real-time and batch synthesis |
| **Latency** | greater than 500 ms | greater than 500 ms | less than 300 ms |
| **Sample rate of synthesized audio** | 24 kHz | 8, 16, 24, and 48 kHz | 8, 16, 24, and 48 kHz |
| **Speech output audio format** | opus, mp3, aac, flac | opus, mp3, pcm, truesilk | opus, mp3, pcm, truesilk |

There are additional features and capabilities available in Azure AI Speech that aren't available with OpenAI voices. For example:
- OpenAI text to speech voices in Azure AI Speech [only support a subset of SSML elements](#ssml-elements-supported-by-openai-text-to-speech-voices-in-azure-ai-speech). Azure AI Speech voices support the full set of SSML elements.
- Azure AI Speech supports [word boundary events](./how-to-speech-synthesis.md#subscribe-to-synthesizer-events). OpenAI voices don't support word boundary events. 


## SSML elements supported by OpenAI text to speech voices in Azure AI Speech

The [Speech Synthesis Markup Language (SSML)](./speech-synthesis-markup.md) with input text determines the structure, content, and other characteristics of the text to speech output. For example, you can use SSML to define a paragraph, a sentence, a break or a pause, or silence. You can wrap text with event tags such as bookmark or viseme that can be processed later by your application.

The following table outlines the Speech Synthesis Markup Language (SSML) elements supported by OpenAI text to speech voices in Azure AI speech. Only the following subset of SSML tags are supported for OpenAI voices. See [SSML document structure and events](speech-synthesis-markup-structure.md) for more information.

| SSML element name | Description |
| --- | --- |
| `<speak>` | Encloses the entire content to be spoken. It’s the root element of an SSML document. |
| `<voice>` | Specifies a voice used for text to speech output. |
| `<sub>` | Indicates that the alias attribute's text value should be pronounced instead of the element's enclosed text. |
| `<say-as>` | Indicates the content type, such as number or date, of the element's text.<br/><br/>All of the `interpret-as` property values are supported for this element except `interpret-as="name"`. For example, `<say-as interpret-as="date" format="dmy">10-12-2016</say-as>` is supported, but `<say-as interpret-as="name">ED</say-as>` isn't supported. For more information, see [pronunciation with SSML](./speech-synthesis-markup-pronunciation.md#say-as-element). |
| `<s>` | Denotes sentences. |
| `<lang>` | Indicates the default locale for the language that you want the neural voice to speak.  |
| `<break>` | Use to override the default behavior of breaks or pauses between words. |

## Next steps

- [Try the text to speech quickstart in Azure AI Speech](get-started-text-to-speech.md#openai-text-to-speech-voices-in-azure-ai-speech)
- [Try the text to speech via Azure OpenAI Service](../openai/text-to-speech-quickstart.md)
