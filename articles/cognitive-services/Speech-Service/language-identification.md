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
zone_pivot_groups: programming-languages-cs-cpp-py
---

# Language identification

Language identification is used to determine the language being spoken in audio when compared against a list of [supported languages](language-support.md). 

Language identification can be used in 3 ways:
* LID by itself (standalone LID, no SR or Translation coupled): this is the SourceLanguageRecognizer API
* LID with STT (LID picks the language and automatically calls the correct SR model): This is the SpeechRecognizer API
* LID with Speech Translation (LID picks the language and automatically calls the correct SR model and then MT model): This is the TranslationRecognizer API



The way LID works is that customers select a few ‘candidate’ languages, i.e. languages that might be in their audio, and we select the correct among those. That limit is 4 languages for At-start LID, and 10 languages for Continuous LID. If the language detected is not among the candidates, we return unknown.

LID does not differentiate between different locales of the same language (e.g. en-US vs. en-GB). Only the general language is detected (in the example, ‘English’).

## At-start and Continuous language identification

We have 2 types of LID:

* At-start LID (also known as one-shot, or single-shot): identifies the language within the first few seconds of audio, and makes only one determination per audio
* Continuous LID: identifies the language(s) throughout the whole audio (can detect language switches, whereas at-start LID cannot)

How to choose LID type.
* For multi-language audio, they should select Continuous LID, since At-start LID can only detect one language. However, if the languages are mixed together, Continuous LID will still not work well (needs a few seconds per language).
* For single-language audio, they can use At-Start LID.


## Accuracy and Latency prioritization

Accuracy vs. Latency modes are self-explanatory: if they want low latency (e.g. real-time scenario), they should pick latency mode. If they can accept higher latency, they can pick accuracy mode.

For each type of LID, we have two options for what to prioritize:
* Latency: 
- For at-start, the result is returned in less than 5 seconds
- For continuous, LID returns the language every 2 seconds for the whole audio
- `Latency` is the best option to use if you need a low-latency result (e.g. for live streaming scenarios), but don't know the language in the audio sample. 

* Accuracy:
- For at-start, the result is returned in 30 seconds
- For continuous, the result is returned slower / we do not make any commitment
- `Accuracy` should be used in scenarios where the audio quality may be poor, and more latency is acceptable. For example, a voicemail could have background noise, or some silence at the beginning, and allowing the engine more time will improve recognition results.

In either case, at-start recognition should **not be used** for scenarios where the language may be changing within the same audio sample. 

LID Latency mode picks one of the languages provided, regardless of if the language is spoken (e.g. if French and English are passed as candidates, but German is spoken, LID would pick one of the two languages). LID Accuracy mode returns ‘unknown’ when the language has low confidence (in the example scenario, it would return “Unknown”).




## Sample

At-start LID
- Latency: config.SetProperty(PropertyId.SpeechServiceConnection_SingleLanguageIdPriority, "Latency");
- Accuracy: config.SetProperty(PropertyId.SpeechServiceConnection_SingleLanguageIdPriority, "Accuracy");
Continuous LID
- Latency: config.SetProperty(PropertyId.SpeechServiceConnection_ContinuousLanguageIdPriority, "Latency");
- Accuracy (not in the sample): config.SetProperty(PropertyId.SpeechServiceConnection_ContinuousLanguageIdPriority, "Accuracy");

