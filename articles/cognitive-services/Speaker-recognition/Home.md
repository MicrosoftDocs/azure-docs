---
title: What is the Speaker Recognition API?
titleSuffix: Azure Cognitive Services
description: Speaker verification and speaker identification with the Speaker Recognition API in Cognitive Services.
services: cognitive-services
author: dwlin
manager: nitinme
ms.service: cognitive-services
ms.subservice: speaker-recognition
ms.topic: overview
ms.date: 10/01/2018
ms.author: nitinme
ROBOTS: NOINDEX
---

# Speaker Recognition API

Speaker Recognition APIs are cloud-based APIs that provide the state-of-the-art AI algorithm for speaker verification and speaker identification. Speaker Recognition is divided into two categories: speaker verification and speaker identification.

## Speaker Verification

Voice has unique characteristics that can be used to identify a person, just like a fingerprint.  Applications can use voice and passphrases as signals to simplify the authentication experience in scenarios like call centers, web services, smart building and more.

Speaker Verification APIs serve an intelligent tool to automatically verify users using both their voice and speech phrases.

### Enrollment

Enrollment for speaker verification is text-dependent, which means that the speaker needs to choose a specific passphrase during both enrollment and verification phases.

In the enrollment phase, the speaker's voice is recorded saying a specific phrase. Many features are extracted to form a unique voice signature while the chosen phrase is recognized. Together, both the voice signature and the chosen phrase would be used to verify the speaker's identity.

The speech audio and features extracted are stored in a highly secure way. Users can create, update, and remove the enrollment audio and the voice signatures through API calls. When the subscription is removed, all the stored data under the subscription ID would be removed automatically.

### Verification

In the verification phase, the speaker verification algorithm compares the features extracted from the input speech recording with the voice signature of the known speaker to determine any match.  Also, the speech recognition algorithm compares the speech phrases with the passphrases chosen by the known speaker.  The response returns "accept" or "reject" with different confidence levels.  Both results would be used to verify whether this person is the known speaker saying the correct passphrase.

The threshold is related to the scenario. It is highly recommended to experiment with the confidence level for the desired accuracy.

The speech recording or the extracted features would not be stored.

For more information about speaker verification, see the API [Speaker - Verification](https://westus.dev.cognitive.microsoft.com/docs/services/563309b6778daf02acc0a508/operations/563309b7778daf06340c9652).

## Speaker Identification

Given a group of prospective speakers, applications can use voice to identify "who is speaking" using Speaker Identification APIs. It is highly desirable in scenarios like meeting productivity, personalization, call center transcription.  The input speech audio is compared against the provided group of speakers, and in the case that there is a match found, the speaker’s identity is returned. All speakers should go through an enrollment process first to get their voice registered to the system and have a voice signature created.

### Enrollment

Enrollment for speaker identification is text-independent, which means that there is no restriction on what the speaker says in the audio.

In the enrollment phase, the speaker's voice is recorded, and many features are extracted to form a unique voice signature. The speech audio and features extracted are stored in a highly secure way. Users can create, update, and remove the enrollment audio and the voice signature through API calls. When the subscription is removed, all the stored data under the subscription ID would be removed automatically.

### Identification

In the identification phase, the input speech recording is compared against the voice signature of the prospective group of speakers one by one. When there is the best match found, the response returns the identity of the speaker with different confidence levels.  Otherwise, the response returns "reject" when no speaker is a match.

The threshold is related to the scenario. It is highly recommended to experiment with the confidence level for the desired accuracy.

The speech recording or the extracted features would not be stored.

For more information about speaker identification, see the API [Speaker - Identification](https://westus.dev.cognitive.microsoft.com/docs/services/563309b6778daf02acc0a508/operations/5645c068e597ed22ec38f42e).
