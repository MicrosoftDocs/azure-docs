---
title: Language identification - Speech service
titleSuffix: Azure Cognitive Services
description: Language identification is used to determine the language being spoken in audio passed to the Speech SDK when compared against a list of provided languages.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/09/2022
ms.author: eur
---

# Language identification

Language identification is used to recognize natural languages spoken in audio when compared against a list of [supported languages](language-support.md). 

You provide candidate languages, at least one of which is expected be in the audio. You can include up to 4 languages for at-start recognition or up to 10 languages for continuous recognition. 

> [!NOTE]
> You must set the full 4-letter locale, but the Speech service only uses the base language. For example, if you include both "en-US" and "en-GB", the Speech service only uses the Speech-to-text model for English. Do not include multiple locales for the same language. 

Language identification scenarios include:

* [Standalone language identification](language-identification-standalone.md) when you only need to detect the natural language in an audio source.
* [Speech-to-text language identification](language-identification-speech-to-text.md) when you need to detect the natural language in an audio source and then transcribe it to text. 
* [Speech translation language identification](language-identification-speech-translation.md) when you need to detect the natural language in an audio source and then translate it to another language. 

## At-start and Continuous recognition

Speech supports both at-start and continuous recognition for language identification. 

> [!NOTE]
> Continuous recognition is only supported with Speech SDKs in C#, C++, and Python.

At-start recognition identifies the language within the first few seconds of audio, and makes only one determination per audio. Use at-start recognition if the language in the audio won't change.

Continuous recognition can identify multiple languages for the duration of the audio. Use continuous recognition if the language in the audio could change. However, continuous recognition accuracy is limited if multiple languages are used within the same utterance. 


## Accuracy and Latency prioritization

You can choose to prioritize accuracy or latency during speech recognition. 

> [!NOTE]
> The `Accuracy` and `Latency` prioritization modes are only supported with Speech SDKs in C#, C++, and Python.

Set the priority to `Latency` if you need a low-latency result such as during live streaming. Set the priority to `Accuracy` if the audio quality may be poor, and more latency is acceptable. For example, a voicemail could have background noise, or some silence at the beginning. Allowing the engine more time will improve recognition results.

* **At-start:** With at-start recognition in `Latency` mode the result is returned in less than 5 seconds. With at-start recognition in `Accuracy` mode the result is returned in 30 seconds. 

* **Continuous:** With continuous recognition in `Latency` mode the results are returned every 2 seconds for the duration of the audio. With continuous recognition in `Accuracy` mode the results are returned within no set time frame for the duration of the audio.

If none of the candidate languages are present in the audio or if the recognition confidence is low, the returned result can vary by mode. 
* In `Latency` mode the Speech service returns one of the candidate languages provided, even if those languages were not in the audio. For example, if `fr-FR` (French) and `en-US` (English) are provided as candidates, but German is spoken, either "French" or "English" would be returned. 
* In `Accuracy` mode the Speech service returns null or empty if none of the candidate languages are detected or if the recognition confidence is low. 
