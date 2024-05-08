---
title: Use the fast transcription API - Speech service
titleSuffix: Azure AI services
description: Learn how to use Azure AI Speech for fast transcriptions, where you submit audio get the transcription results much faster than real-time audio.
manager: nitinme
author: eric-urban
ms.author: eur
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 5/21/2024
# Customer intent: As a user who implements audio transcription, I want create transcriptions as quickly as possible.
---

# Use the fast transcription API (preview) with Azure AI Speech 

[!INCLUDE [Feature preview](./includes/previews/preview-feature.md)]

Fast transcription API is used to transcribe audio files with returning results synchronously and much faster than real-time audio. Use fast transcription in the scenarios that you need the transcript of an audio recording as quickly as possible with predictable latency, such as: 

- Quick audio or video transcription, subtitles, and edit. 
- Video dubbing  

> [!NOTE]
> Fast transcription API is only available via the speech to text REST API version 2024-05-15-preview. 

## Prerequisites

- An Azure AI Speech resource in one of the regions where the fast transcription API is available. The supported regions are: Central India, East US, Southeast Asia, and West Europe. For more information about regions supported for other Speech service features, see [Speech service regions](./regions.md).
- An audio file (less than 2 hours long and less than 200 MB in size) in one of the formats and codecs supported by the batch transcription API. For more information about supported audio formats, see [supported audio formats](./batch-transcription-audio-data.md#supported-audio-formats-and-codecs).

## Use the fast transcription API

The fast transcription API is a REST API that uses multipart/form-data to submit audio files for transcription. The API returns the transcription results synchronously.

Construct the request body according to the following instructions:

- Set the required `inputLocales` property. This value should match the expected locale of the audio data to transcribe. The supported locales are: en-US, es-ES, es-MX, fr-FR, hi-IN, it-IT, ja-JP, ko-KR, pt-BR, and zh-CN.
- Optionally, set the `wordLevelTimestampsEnabled` property to `true` to enable word-level timestamps in the transcription results. The default value is `false`.
- Optionally, set the `profanityFilterMode` property to specify how to handle profanity in recognition results. Accepted values are `None` to disable profanity filtering, `Masked` to replace profanity with asterisks, `Removed` to remove all profanity from the result, or `Tags` to add profanity tags. The default value is `Masked`.
- Optionally, set the `channels` property to specify the number of channels in the audio file. The possible values in the `channels` list are 0 and 1. The default value is `[0,1]`. If the audio file contains multiple channels, set this property to the number of channels in the audio file.

> [!NOTE]
> The `wordLevelTimestampsEnabled`, `profanityFilterMode`, and `channels` properties work the same way as via the [batch transcription API](./batch-transcription.md).

Make a multipart/form-data POST request to the `syncTranscriptions` endpoint with the audio file and the request body properties. The following example shows how to create a transcription using the fast transcription API.

- Replace `YourSubscriptionKey` with your Speech resource key.
- Replace `YourServiceRegion` with your Speech resource region.
- Replace `YourAudioFile` with the path to your audio file.
- Set the form definition properties as previously described.

```azurecli-interactive
curl --location 'https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.3/syncTranscriptions' \
--header 'Content-Type: multipart/form-data' \
--header 'Accept: application/json' \
--header 'Ocp-Apim-Subscription-Key: YourSubscriptionKey' \
--form 'audio=@"YourAudioFile"' \
--form 'definition="{
    \"inputLocales\":[\"en-US\"], 
    \"wordLevelTimestampsEnabled\":true, 
    \"profanityFilterMode\": \"Masked\", 
    \"channels\": [0,1]}"'
```

The response will include `timestamp`, `durationInTicks`, `duration`, and more. 
- The `combinedRecognizedPhrases` property contains the full transcriptions for each channel separately. For example, everything the first speaker said is in the first element of the `combinedRecognizedPhrases` array, and everything the second speaker said is in the second element of the array. 
- Since we specified `wordLevelTimestampsEnabled` as `true`, the response will include word-level timestamps. 

```json
{
	"timestamp": "2024-04-26T06:14:26.3605217Z",
	"durationInTicks": 1850790625,
	"duration": "PT3M5.0790625S",
	"combinedRecognizedPhrases": [
		{
			"channel": 0,
			"display": "Hello. Thank you for calling Contoso. Who am I speaking with today? Hi, Mary. Are you calling because you need health insurance? Great. If you can answer a few questions, we can get you signed up in the Jiffy. So what's your full name? Got it. And what's the best callback number in case we get disconnected? Yep, that'll be fine. Got it. So to confirm, it's 234-554-9312. Excellent. Let's get some additional information for your application. Do you have a job? OK, so then you have a Social Security number as well. OK, and what is your Social Security number please? Sorry, what was that, a 25 or a 225? You cut out for a bit. Alright, thank you so much. And could I have your e-mail address please? Great. Uh That is the last question. So let me take your information and I'll be able to get you signed up right away. Thank you for calling Contoso and I'll be able to get you signed up immediately. One of our agents will call you back in about 24 hours or so to confirm your application. Absolutely. If you need anything else, please give us a call at 1-800-555-5564, extension 123. Thank you very much for calling Contoso. Uh Yes, of course. So the default is a digital membership card, but we can send you a physical card if you prefer. Uh, yeah. Absolutely. I've made a note on your file. You're very welcome. Thank you for calling Contoso and have a great day."
		},
		{
			"channel": 1,
			"display": "Hi, my name is Mary Rondo. I'm trying to enroll myself with Contuso. Yes, yeah, I'm calling to sign up for insurance. Okay. So Mary Beth Rondo, last name is R like Romeo, O like Ocean, N like Nancy D, D like Dog, and O like Ocean again. Rondo. I only have a cell phone so I can give you that. Sure, so it's 234-554 and then 9312. Yep, that's right. Uh Yes, I am self-employed. Yes, I do. Uh Sure, so it's 412256789. It's double two, so 412, then another two, then five. Yeah, it's maryrondo@contoso.com. So my first and last name at contoso.com. No periods, no dashes. That was quick. Thank you. Actually, so I have one more question. I'm curious, will I be getting a physical card as proof of coverage? uh Yes. Could you please mail it to me when it's ready? I'd like to have it shipped to, are you ready for my address? So it's 2660 Unit A on Maple Avenue SE, Lansing, and then zip code is 48823. Awesome. Thanks so much."
		}
	],
	"recognizedPhrases": [
		{
			"recognitionStatus": "Success",
			"channel": 0,
			"offset": "PT0.72S",
			"duration": "PT0.48S",
			"offsetInTicks": 7200000,
			"durationInTicks": 4800000,
			"nBest": [
				{
					"confidence": 0.9177142,
					"display": "Hello.",
					"displayWords": [
						{
							"displayText": "Hello.",
							"offset": "PT0.72S",
							"duration": "PT0.48S",
							"offsetInTicks": 7200000,
							"durationInTicks": 4800000
						}
					]
				}
			]
		},
		{
			"recognitionStatus": "Success",
			"channel": 0,
			"offset": "PT1.2S",
			"duration": "PT1.12S",
			"offsetInTicks": 12000000,
			"durationInTicks": 11200000,
			"nBest": [
				{
					"confidence": 0.9177142,
					"display": "Thank you for calling Contoso.",
					"displayWords": [
						{
							"displayText": "Thank",
							"offset": "PT1.2S",
							"duration": "PT0.2S",
							"offsetInTicks": 12000000,
							"durationInTicks": 2000000
						},
						{
							"displayText": "you",
							"offset": "PT1.4S",
							"duration": "PT0.08S",
							"offsetInTicks": 14000000,
							"durationInTicks": 800000
						},
						{
							"displayText": "for",
							"offset": "PT1.48S",
							"duration": "PT0.12S",
							"offsetInTicks": 14800000,
							"durationInTicks": 1200000
						},
						{
							"displayText": "calling",
							"offset": "PT1.6S",
							"duration": "PT0.24S",
							"offsetInTicks": 16000000,
							"durationInTicks": 2400000
						},
						{
							"displayText": "Contoso.",
							"offset": "PT1.84S",
							"duration": "PT0.48S",
							"offsetInTicks": 18400000,
							"durationInTicks": 4800000
						}
					]
				}
			]
		},
        // More transcription results removed for brevity
        // {...},
        {
			"recognitionStatus": "Success",
			"channel": 1,
			"offset": "PT2M59.88S",
			"duration": "PT0.6S",
			"offsetInTicks": 1798800000,
			"durationInTicks": 6000000,
			"nBest": [
				{
					"confidence": 0.90407056,
					"display": "Thanks so much.",
					"displayWords": [
						{
							"displayText": "Thanks",
							"offset": "PT2M59.88S",
							"duration": "PT0.2S",
							"offsetInTicks": 1798800000,
							"durationInTicks": 2000000
						},
						{
							"displayText": "so",
							"offset": "PT3M0.08S",
							"duration": "PT0.08S",
							"offsetInTicks": 1800800000,
							"durationInTicks": 800000
						},
						{
							"displayText": "much.",
							"offset": "PT3M0.16S",
							"duration": "PT0.32S",
							"offsetInTicks": 1801600000,
							"durationInTicks": 3200000
						}
					]
				}
			]
		}
	]
}
```

## Compare with the real-time API

You can compare transcription results with the [speech to text real-time API](./rest-speech-to-text-short.md). 
- The real-time API is limited to 60 seconds of audio. The fast transcription API is designed for longer audio files and returns results much faster than real-time audio.
- The real-time API doesn't support channel separation. The fast transcription API supports channel separation and returns results for each channel separately.

Here's an example transcription request using the [speech to text real-time API](./rest-speech-to-text-short.md). 

- Replace `YourSubscriptionKey` with your Speech resource key.
- Replace `YourServiceRegion` with your Speech resource region.
- Replace `YourAudioFile` with the path to your audio file.

```azurecli-interactive
curl --location --request POST \
"https://YourServiceRegion.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed" \
--header "Ocp-Apim-Subscription-Key: YourSubscriptionKey" \
--header "Content-Type: audio/wav" \
--data-binary YourAudioFile
```

Here's an example response. Only the first 60 seconds of the provided audio file is transcribed to text.

```json
{
	"RecognitionStatus": "Success",
	"Offset": 7500000,
	"Duration": 538000000,
	"NBest": [
		{
			"Confidence": 0.8452396,
			"Lexical": "hello thank you for calling contoso who am i speaking with today hi my name is mary rondo i'm trying to enroll myself with contoso hi mary uh are you calling because you need health insurance yes yeah i'm calling to sign up for insurance great uh if you can answer a few questions we can get you signed up in the jiffy OK so what's your full name so mary beth rondo last name is R like romeo O like ocean N like nancy DD like dog and O like ocean again rondo got it and what's the best callback number in case we get disconnected i only have a cell phone so i can give you that yeah that'll be fine sure so it's two three four five five four and then nine three one two got it so to confirm it's two three four five five four nine three one two",
			"ITN": "hello thank you for calling contoso who am i speaking with today hi my name is mary rondo i'm trying to enroll myself with contoso hi mary uh are you calling because you need health insurance yes yeah i'm calling to sign up for insurance great uh if you can answer a few questions we can get you signed up in the jiffy OK so what's your full name so mary beth rondo last name is R like romeo O like ocean N like nancy DD like dog and O like ocean again rondo got it and what's the best callback number in case we get disconnected i only have a cell phone so i can give you that yeah that'll be fine sure so it's 234554 and then 9312 got it so to confirm it's 234-554-9312",
			"MaskedITN": "hello thank you for calling contoso who am i speaking with today hi my name is mary rondo i'm trying to enroll myself with contoso hi mary uh are you calling because you need health insurance yes yeah i'm calling to sign up for insurance great uh if you can answer a few questions we can get you signed up in the jiffy ok so what's your full name so mary beth rondo last name is r like romeo o like ocean n like nancy dd like dog and o like ocean again rondo got it and what's the best callback number in case we get disconnected i only have a cell phone so i can give you that yeah that'll be fine sure so it's 234554 and then 9312 got it so to confirm it's 234-554-9312",
			"Display": "Hello. Thank you for calling Contoso. Who am I speaking with today? Hi, my name is Mary Rondo. I'm trying to enroll myself with Contoso. Hi, Mary. Uh, are you calling because you need health insurance? Yes. Yeah, I'm calling to sign up for insurance. Great. Uh, if you can answer a few questions, we can get you signed up in the jiffy. OK. So what's your full name? So Mary Beth Rondo last name is R like Romeo, O like Ocean, N like Nancy, DD like Dog, and O like Ocean. Again, Rondo got it. And what's the best callback number in case we get disconnected? I only have a cell phone, so I can give you that. Yeah, that'll be fine. Sure. So it's 234554 and then 9312. Got it. So to confirm, it's 234-554-9312."
		}
	],
	"DisplayText": "Hello. Thank you for calling Contoso. Who am I speaking with today? Hi, my name is Mary Rondo. I'm trying to enroll myself with Contoso. Hi, Mary. Uh, are you calling because you need health insurance? Yes. Yeah, I'm calling to sign up for insurance. Great. Uh, if you can answer a few questions, we can get you signed up in the jiffy. OK.So what's your full name?So Mary Beth Rondo last name is R like Romeo, O like Ocean, N like Nancy, DD like Dog, and O like Ocean. Again, Rondo got it. And what's the best callback number in case we get disconnected?I only have a cell phone, so I can give you that. Yeah, that'll be fine. Sure. So it's 234554 and then 9312. Got it. So to confirm, it's 234-554-9312."
}
```

## Related content

- [Speech to text quickstart](./get-started-speech-to-text.md)
- [Batch transcription API](./batch-transcription.md)
