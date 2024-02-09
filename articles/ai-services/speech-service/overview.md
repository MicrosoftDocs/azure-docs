---
title: What is the Speech service?
titleSuffix: Azure AI services
description: The Speech service provides speech to text, text to speech, and speech translation capabilities with an Azure resource. Add speech to your applications, tools, and devices with the Speech SDK, Speech Studio, or REST APIs.
#services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 09/16/2022
ms.author: eur
---

# What is the Speech service?

[!INCLUDE [Azure AI services rebrand](../includes/rebrand-note.md)]

The Speech service provides speech to text and text to speech capabilities with a [Speech resource](~/articles/ai-services/multi-service-resource.md?pivots=azportal). You can transcribe speech to text with high accuracy, produce natural-sounding text to speech voices, translate spoken audio, and use speaker recognition during conversations. 

:::image type="content" border="false" source="media/overview/speech-features-highlight.png" alt-text="Image of tiles that highlight some Speech service features.":::

Create custom voices, add specific words to your base vocabulary, or build your own models. Run Speech anywhere, in the cloud or at the edge in containers. It's easy to speech enable your applications, tools, and devices with the [Speech CLI](spx-overview.md), [Speech SDK](./speech-sdk.md), [Speech Studio](speech-studio-overview.md), or [REST APIs](./rest-speech-to-text.md).

Speech is available for many [languages](language-support.md), [regions](regions.md), and [price points](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/). 

## Speech scenarios

Common scenarios for speech include:
- [Captioning](./captioning-concepts.md): Learn how to synchronize captions with your input audio, apply profanity filters, get partial results, apply customizations, and identify spoken languages for multilingual scenarios.
- [Audio Content Creation](text-to-speech.md#more-about-neural-text-to-speech-features): You can use neural voices to make interactions with chatbots and voice assistants more natural and engaging, convert digital texts such as e-books into audiobooks and enhance in-car navigation systems.
- [Call Center](call-center-overview.md): Transcribe calls in real-time or process a batch of calls, redact personally identifying information, and extract insights such as sentiment to help with your call center use case.
- [Language learning](language-learning-overview.md): Provide pronunciation assessment feedback to language learners, support real-time transcription for remote learning conversations, and read aloud teaching materials with neural voices.
- [Voice assistants](voice-assistants.md): Create natural, humanlike conversational interfaces for their applications and experiences. The voice assistant feature provides fast, reliable interaction between a device and an assistant implementation.

Microsoft uses Speech for many scenarios, such as captioning in Teams, dictation in Office 365, and Read Aloud in the Edge browser. 

:::image type="content" border="false" source="media/overview/microsoft-uses-speech.png" alt-text="Image showing logos of Microsoft products where Speech service is used.":::

## Speech capabilities

Speech feature summaries are provided below with links for more information.

### Speech to text

Use [speech to text](speech-to-text.md) to transcribe audio into text, either in [real-time](#real-time-speech-to-text) or asynchronously with [batch transcription](#batch-transcription). 

> [!TIP]
> You can try real-time speech to text in [Speech Studio](https://aka.ms/speechstudio/speechtotexttool) without signing up or writing any code.

Convert audio to text from a range of sources, including microphones, audio files, and blob storage. Use speaker diarization to determine who said what and when. Get readable transcripts with automatic formatting and punctuation. 

The base model may not be sufficient if the audio contains ambient noise or includes a lot of industry and domain-specific jargon. In these cases, you can create and train [custom speech models](custom-speech-overview.md) with acoustic, language, and pronunciation data. Custom speech models are private and can offer a competitive advantage. 

### Real-time speech to text

With [real-time speech to text](get-started-speech-to-text.md), the audio is transcribed as speech is recognized from a microphone or file. Use real-time speech to text for applications that need to transcribe audio in real-time such as:
- Transcriptions, captions, or subtitles for live meetings
- [Diarization](get-started-stt-diarization.md)
- [Pronunciation assessment](how-to-pronunciation-assessment.md)
- Contact center agent assist
- Dictation
- Voice agents

### Batch transcription

[Batch transcription](batch-transcription.md) is used to transcribe a large amount of audio in storage. You can point to audio files with a shared access signature (SAS) URI and asynchronously receive transcription results. Use batch transcription for applications that need to transcribe audio in bulk such as:
- Transcriptions, captions, or subtitles for pre-recorded audio
- Contact center post-call analytics
- Diarization

### Text to speech

With [text to speech](text-to-speech.md), you can convert input text into humanlike synthesized speech. Use neural voices, which are humanlike voices powered by deep neural networks. Use the [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md) to fine-tune the pitch, pronunciation, speaking rate, volume, and more.

- Prebuilt neural voice: Highly natural out-of-the-box voices. Check the prebuilt neural voice samples the [Voice Gallery](https://speech.microsoft.com/portal/voicegallery) and determine the right voice for your business needs.
- Custom neural voice: Besides the pre-built neural voices that come out of the box, you can also create a [custom neural voice](custom-neural-voice.md) that is recognizable and unique to your brand or product. Custom neural voices are private and can offer a competitive advantage. Check the custom neural voice samples [here](https://aka.ms/customvoice).

### Speech translation

[Speech translation](speech-translation.md) enables real-time, multilingual translation of speech to your applications, tools, and devices. Use this feature for speech-to-speech and speech to text translation.

### Language identification

[Language identification](language-identification.md) is used to identify languages spoken in audio when compared against a list of [supported languages](language-support.md). Use language identification by itself, with speech to text recognition, or with speech translation.

### Speaker recognition
[Speaker recognition](speaker-recognition-overview.md) provides algorithms that verify and identify speakers by their unique voice characteristics. Speaker recognition is used to answer the question, "Who is speaking?". 

### Pronunciation assessment

[Pronunciation assessment](./how-to-pronunciation-assessment.md) evaluates speech pronunciation and gives speakers feedback on the accuracy and fluency of spoken audio. With pronunciation assessment, language learners can practice, get instant feedback, and improve their pronunciation so that they can speak and present with confidence.

### Intent recognition

[Intent recognition](./intent-recognition.md): Use speech to text with conversational language understanding to derive user intents from transcribed speech and act on voice commands. 

## Delivery and presence

You can deploy Azure AI Speech features in the cloud or on-premises.

With [containers](speech-container-howto.md), you can bring the service closer to your data for compliance, security, or other operational reasons. 

Speech service deployment in sovereign clouds is available for some government entities and their partners. For example, the Azure Government cloud is available to US government entities and their partners. Microsoft Azure operated by 21Vianet cloud is available to organizations with a business presence in China. For more information, see [sovereign clouds](sovereign-clouds.md). 

:::image type="content" border="false" source="media/overview/speech-delivery-presence.png" alt-text="Diagram showing where Speech service can be deployed and accessed.":::

## Use Speech in your application

The [Speech Studio](speech-studio-overview.md) is a set of UI-based tools for building and integrating features from Azure AI Speech service in your applications. You create projects in Speech Studio by using a no-code approach, and then reference those assets in your applications by using the [Speech SDK](speech-sdk.md), the [Speech CLI](spx-overview.md), or the REST APIs.

The [Speech CLI](spx-overview.md) is a command-line tool for using Speech service without having to write any code. Most features in the Speech SDK are available in the Speech CLI, and some advanced features and customizations are simplified in the Speech CLI. 

The [Speech SDK](./speech-sdk.md) exposes many of the Speech service capabilities you can use to develop speech-enabled applications. The Speech SDK is available in many programming languages and across all platforms.

In some cases, you can't or shouldn't use the [Speech SDK](speech-sdk.md). In those cases, you can use REST APIs to access the Speech service. For example, use REST APIs for [batch transcription](batch-transcription.md) and [speaker recognition](/rest/api/speakerrecognition/) REST APIs.

## Get started

We offer quickstarts in many popular programming languages. Each quickstart is designed to teach you basic design patterns and have you running code in less than 10 minutes. See the following list for the quickstart for each feature:

* [Speech to text quickstart](get-started-speech-to-text.md)
* [Text to speech quickstart](get-started-text-to-speech.md)
* [Speech translation quickstart](./get-started-speech-translation.md)

## Code samples

Sample code for the Speech service is available on GitHub. These samples cover common scenarios like reading audio from a file or stream, continuous and single-shot recognition, and working with custom models. Use these links to view SDK and REST samples:

- [Speech to text, text to speech, and speech translation samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch)
- [Text to speech samples (REST)](https://github.com/Azure-Samples/Cognitive-Speech-TTS)
- [Voice assistant samples (SDK)](https://aka.ms/csspeech/samples)

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the transparency notes to learn about responsible AI use and deployment in your systems. 

### Speech to text

* [Transparency note and use cases](/legal/cognitive-services/speech-service/speech-to-text/transparency-note?context=/azure/ai-services/speech-service/context/context)
* [Characteristics and limitations](/legal/cognitive-services/speech-service/speech-to-text/characteristics-and-limitations?context=/azure/ai-services/speech-service/context/context)
* [Integration and responsible use](/legal/cognitive-services/speech-service/speech-to-text/guidance-integration-responsible-use?context=/azure/ai-services/speech-service/context/context)
* [Data, privacy, and security](/legal/cognitive-services/speech-service/speech-to-text/data-privacy-security?context=/azure/ai-services/speech-service/context/context)

### Pronunciation Assessment

* [Transparency note and use cases](/legal/cognitive-services/speech-service/pronunciation-assessment/transparency-note-pronunciation-assessment?context=/azure/ai-services/speech-service/context/context)
* [Characteristics and limitations](/legal/cognitive-services/speech-service/pronunciation-assessment/characteristics-and-limitations-pronunciation-assessment?context=/azure/ai-services/speech-service/context/context)

### Custom neural voice

* [Transparency note and use cases](/legal/cognitive-services/speech-service/custom-neural-voice/transparency-note-custom-neural-voice?context=/azure/ai-services/speech-service/context/context)
* [Characteristics and limitations](/legal/cognitive-services/speech-service/custom-neural-voice/characteristics-and-limitations-custom-neural-voice?context=/azure/ai-services/speech-service/context/context)
* [Limited access](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=/azure/ai-services/speech-service/context/context)
* [Responsible deployment of synthetic speech](/legal/cognitive-services/speech-service/custom-neural-voice/concepts-guidelines-responsible-deployment-synthetic?context=/azure/ai-services/speech-service/context/context)
* [Disclosure of voice talent](/legal/cognitive-services/speech-service/disclosure-voice-talent?context=/azure/ai-services/speech-service/context/context)
* [Disclosure of design guidelines](/legal/cognitive-services/speech-service/custom-neural-voice/concepts-disclosure-guidelines?context=/azure/ai-services/speech-service/context/context)
* [Disclosure of design patterns](/legal/cognitive-services/speech-service/custom-neural-voice/concepts-disclosure-patterns?context=/azure/ai-services/speech-service/context/context)
* [Code of conduct](/legal/cognitive-services/speech-service/tts-code-of-conduct?context=/azure/ai-services/speech-service/context/context)
* [Data, privacy, and security](/legal/cognitive-services/speech-service/custom-neural-voice/data-privacy-security-custom-neural-voice?context=/azure/ai-services/speech-service/context/context)

### Speaker Recognition

* [Transparency note and use cases](/legal/cognitive-services/speech-service/speaker-recognition/transparency-note-speaker-recognition?context=/azure/ai-services/speech-service/context/context)
* [Characteristics and limitations](/legal/cognitive-services/speech-service/speaker-recognition/characteristics-and-limitations-speaker-recognition?context=/azure/ai-services/speech-service/context/context)
* [Limited access](/legal/cognitive-services/speech-service/speaker-recognition/limited-access-speaker-recognition?context=/azure/ai-services/speech-service/context/context)
* [General guidelines](/legal/cognitive-services/speech-service/speaker-recognition/guidance-integration-responsible-use-speaker-recognition?context=/azure/ai-services/speech-service/context/context)
* [Data, privacy, and security](/legal/cognitive-services/speech-service/speaker-recognition/data-privacy-speaker-recognition?context=/azure/ai-services/speech-service/context/context)

## Next steps

* [Get started with speech to text](get-started-speech-to-text.md)
* [Get started with text to speech](get-started-text-to-speech.md)
