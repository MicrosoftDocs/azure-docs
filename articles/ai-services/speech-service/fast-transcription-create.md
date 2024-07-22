---
title: Use the fast transcription API - Speech service
titleSuffix: Azure AI services
description: Learn how to use Azure AI Speech for fast transcriptions, where you submit audio get the transcription results much faster than real-time audio.
manager: nitinme
author: eric-urban
ms.author: eur
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 7/12/2024
# Customer intent: As a user who implements audio transcription, I want create transcriptions as quickly as possible.
---

# Use the fast transcription API (preview) with Azure AI Speech 

> [!NOTE]
> This feature is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> Fast transcription API is only available via the speech to text REST API version 2024-05-15-preview. This preview version is subject to change and is not recommended for production use. It will be retired without notice 90 days after a successor preview version or the general availability (GA) of the API.

Fast transcription API is used to transcribe audio files with returning results synchronously and much faster than real-time audio. Use fast transcription in the scenarios that you need the transcript of an audio recording as quickly as possible with predictable latency, such as: 

- Quick audio or video transcription, subtitles, and edit. 
- Video translation

> [!TIP]
> Try out fast transcription in [Azure AI Studio](https://aka.ms/fasttranscription/studio).

## Prerequisites

- An Azure AI Speech resource in one of the regions where the fast transcription API is available. The supported regions are: Central India, East US, Southeast Asia, and West Europe. For more information about regions supported for other Speech service features, see [Speech service regions](./regions.md).
- An audio file (less than 2 hours long and less than 200 MB in size) in one of the formats and codecs supported by the batch transcription API. For more information about supported audio formats, see [supported audio formats](./batch-transcription-audio-data.md#supported-audio-formats-and-codecs).

## Use the fast transcription API

The fast transcription API is a REST API that uses multipart/form-data to submit audio files for transcription. The API returns the transcription results synchronously.

Construct the request body according to the following instructions:

- Set the required `locales` property. This value should match the expected locale of the audio data to transcribe. The supported locales are: en-US, es-ES, es-MX, fr-FR, hi-IN, it-IT, ja-JP, ko-KR, pt-BR, and zh-CN. You can only specify one locale per transcription request.
- Optionally, set the `profanityFilterMode` property to specify how to handle profanity in recognition results. Accepted values are `None` to disable profanity filtering, `Masked` to replace profanity with asterisks, `Removed` to remove all profanity from the result, or `Tags` to add profanity tags. The default value is `Masked`. The `profanityFilterMode` property works the same way as via the [batch transcription API](./batch-transcription.md).
- Optionally, set the `channels` property to specify the zero-based indices of the channels to be transcribed separately. If not specified, multiple channels are merged and transcribed jointly. Only up to two channels are supported. If you want to transcribe the channels from a stereo audio file separately, you need to specify `[0,1]` here. Otherwise, stereo audio will be merged to mono, mono audio will be left as is, and only a single channel will be transcribed. In either of the latter cases, the output has no channel indices for the transcribed text, since only a single audio stream is transcribed.

Make a multipart/form-data POST request to the `transcriptions` endpoint with the audio file and the request body properties. The following example shows how to create a transcription using the fast transcription API.

- Replace `YourSubscriptionKey` with your Speech resource key.
- Replace `YourServiceRegion` with your Speech resource region.
- Replace `YourAudioFile` with the path to your audio file.
- Set the form definition properties as previously described.

```azurecli-interactive
curl --location 'https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/transcriptions:transcribe?api-version=2024-05-15-preview' \
--header 'Content-Type: multipart/form-data' \
--header 'Accept: application/json' \
--header 'Ocp-Apim-Subscription-Key: YourSubscriptionKey' \
--form 'audio=@"YourAudioFile"' \
--form 'definition="{
    \"locales\":[\"en-US\"], 
    \"profanityFilterMode\": \"Masked\", 
    \"channels\": [0,1]}"'
```

The response will include `duration`, `channel`, and more. The `combinedPhrases` property contains the full transcriptions for each channel separately. For example, everything the first speaker said is in the first element of the `combinedPhrases` array, and everything the second speaker said is in the second element of the array. 

```json
{
	"duration": 185079,
	"combinedPhrases": [
		{
			"channel": 0,
			"text": "Hello. Thank you for calling Contoso. Who am I speaking with today? Hi, Mary. Are you calling because you need health insurance? Great. If you can answer a few questions, we can get you signed up in the Jiffy. So what's your full name? Got it. And what's the best callback number in case we get disconnected? Yep, that'll be fine. Got it. So to confirm, it's 234-554-9312. Excellent. Let's get some additional information for your application. Do you have a job? OK, so then you have a Social Security number as well. OK, and what is your Social Security number please? Sorry, what was that, a 25 or a 225? You cut out for a bit. Alright, thank you so much. And could I have your e-mail address please? Great. Uh That is the last question. So let me take your information and I'll be able to get you signed up right away. Thank you for calling Contoso and I'll be able to get you signed up immediately. One of our agents will call you back in about 24 hours or so to confirm your application. Absolutely. If you need anything else, please give us a call at 1-800-555-5564, extension 123. Thank you very much for calling Contoso. Uh Yes, of course. So the default is a digital membership card, but we can send you a physical card if you prefer. Uh, yeah. Absolutely. I've made a note on your file. You're very welcome. Thank you for calling Contoso and have a great day."
		},
		{
			"channel": 1,
			"text": "Hi, my name is Mary Rondo. I'm trying to enroll myself with Contuso. Yes, yeah, I'm calling to sign up for insurance. Okay. So Mary Beth Rondo, last name is R like Romeo, O like Ocean, N like Nancy D, D like Dog, and O like Ocean again. Rondo. I only have a cell phone so I can give you that. Sure, so it's 234-554 and then 9312. Yep, that's right. Uh Yes, I am self-employed. Yes, I do. Uh Sure, so it's 412256789. It's double two, so 412, then another two, then five. Yeah, it's maryrondo@gmail.com. So my first and last name at gmail.com. No periods, no dashes. That was quick. Thank you. Actually, so I have one more question. I'm curious, will I be getting a physical card as proof of coverage? uh Yes. Could you please mail it to me when it's ready? I'd like to have it shipped to, are you ready for my address? So it's 2660 Unit A on Maple Avenue SE, Lansing, and then zip code is 48823. Awesome. Thanks so much."
		}
	],
	"phrases": [
		{
			"channel": 0,
			"offset": 720,
			"duration": 480,
			"text": "Hello.",
			"words": [
				{
					"text": "Hello.",
					"offset": 720,
					"duration": 480
				}
			],
			"locale": "en-US",
			"confidence": 0.9177142
		},
		{
			"channel": 0,
			"offset": 1200,
			"duration": 1120,
			"text": "Thank you for calling Contoso.",
			"words": [
				{
					"text": "Thank",
					"offset": 1200,
					"duration": 200
				},
				{
					"text": "you",
					"offset": 1400,
					"duration": 80
				},
				{
					"text": "for",
					"offset": 1480,
					"duration": 120
				},
				{
					"text": "calling",
					"offset": 1600,
					"duration": 240
				},
				{
					"text": "Contoso.",
					"offset": 1840,
					"duration": 480
				}
			],
			"locale": "en-US",
			"confidence": 0.9177142
		},
		{
			"channel": 0,
			"offset": 2320,
			"duration": 1120,
			"text": "Who am I speaking with today?",
			"words": [
				{
					"text": "Who",
					"offset": 2320,
					"duration": 160
				},
				{
					"text": "am",
					"offset": 2480,
					"duration": 80
				},
				{
					"text": "I",
					"offset": 2560,
					"duration": 80
				},
				{
					"text": "speaking",
					"offset": 2640,
					"duration": 320
				},
				{
					"text": "with",
					"offset": 2960,
					"duration": 160
				},
				{
					"text": "today?",
					"offset": 3120,
					"duration": 320
				}
			],
			"locale": "en-US",
			"confidence": 0.9177142
		},
        // More transcription results removed for brevity
        // {...},
		{
			"channel": 1,
			"offset": 4480,
			"duration": 1600,
			"text": "Hi, my name is Mary Rondo.",
			"words": [
				{
					"text": "Hi,",
					"offset": 4480,
					"duration": 400
				},
				{
					"text": "my",
					"offset": 4880,
					"duration": 120
				},
				{
					"text": "name",
					"offset": 5000,
					"duration": 120
				},
				{
					"text": "is",
					"offset": 5120,
					"duration": 160
				},
				{
					"text": "Mary",
					"offset": 5280,
					"duration": 240
				},
				{
					"text": "Rondo.",
					"offset": 5520,
					"duration": 560
				}
			],
			"locale": "en-US",
			"confidence": 0.8989456
		},
		{
			"channel": 1,
			"offset": 6080,
			"duration": 1920,
			"text": "I'm trying to enroll myself with Contuso.",
			"words": [
				{
					"text": "I'm",
					"offset": 6080,
					"duration": 160
				},
				{
					"text": "trying",
					"offset": 6240,
					"duration": 200
				},
				{
					"text": "to",
					"offset": 6440,
					"duration": 80
				},
				{
					"text": "enroll",
					"offset": 6520,
					"duration": 200
				},
				{
					"text": "myself",
					"offset": 6720,
					"duration": 360
				},
				{
					"text": "with",
					"offset": 7080,
					"duration": 120
				},
				{
					"text": "Contuso.",
					"offset": 7200,
					"duration": 800
				}
			],
			"locale": "en-US",
			"confidence": 0.8989456
		},
        // More transcription results removed for brevity
        // {...},
	]
}
```

## Related content

- [Fast transcription REST API reference](/rest/api/speechtotext/transcriptions/transcribe)
- [Speech to text supported languages](./language-support.md?tabs=stt)
- [Batch transcription](./batch-transcription.md)