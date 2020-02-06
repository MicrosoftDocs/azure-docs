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

# Speaker Recognition API - Preview

Speaker Recognition APIs are cloud-based APIs that provide the advanced AI algorithms for speaker verification and speaker identification. Speaker Recognition is divided into two categories: speaker verification and speaker identification.

## Speaker Verification

Voice has unique characteristics that can be associated with an individual.  Applications can use voice as an additional factor for verification, in scenarios like call centers and web services.

Speaker Verification APIs serve as an intelligent tool to help verify users using both their voice and speech passphrases.

### Enrollment

Enrollment for speaker verification is text-dependent, which means speakers need to choose a specific passphrase to use during both enrollment and verification phases.

In the speaker enrollment phase, the speaker's voice is recorded saying a specific phrase. Voice features are extracted to form a unique voice signature while the chosen phrase is recognized. Together, this speaker enrollment data would be used to verify the speaker. The speaker enrollment data are stored in a secured system. The Customer controls how long it should be retained. Customers can create, update, and remove enrollment data for individual speakers through API calls.  When the subscription is deleted, all the speaker enrollment data associated with the subscription will also be deleted.

Customers should ensure they have received the appropriate permissions from the users for speaker verification.

### Verification

In the verification phase, the Customer should call the speaker verification API with the ID associated with the individual to be verified.  The service extracts voice features and the passphrase from the input speech recording. Then it compares the features against the corresponding elements of the speaker enrollment data for the speaker the Customer is seeking to verify and determines any match.  The response returns "accept" or "reject" with different confidence levels.  The Customer then determines how to use the results to help decide whether this person is the enrolled  speaker.

The threshold confidence level should be set based on the scenario and other verification factors that are being used. We recommend you experiment with the confidence level and consider the appropriate setting for each application. The APIs are not intended to determine whether the audio is from a live person or an imitation or a recording of an enrolled speaker.

The service does not retain the speech recording or the extracted voice features that are sent to the service during the verification phase.

For more details about speaker verification, please refer to the API [Speaker - Verification](https://westus.dev.cognitive.microsoft.com/docs/services/563309b6778daf02acc0a508/operations/563309b7778daf06340c9652).

## Speaker Identification

Applications can use voice to identify "who is speaking" given a group of enrolled speakers. Speaker Identification APIs could be used in scenarios like meeting productivity, personalization, and call center transcription.

### Enrollment

Enrollment for speaker identification is text-independent, which means that there are no restrictions on what the speaker says in the audio. No passphrase is required.

In the enrollment phase, the speaker's voice is recorded, and voice features are extracted to form a unique voice signature. The speech audio and features extracted are stored in a secured system. The Customer controls how long it is retained. Customers can create, update, and remove this speaker enrollment data for individual speakers through API calls. When the subscription is deleted, all the speaker enrollment data associated with the subscription will also be deleted.

Customers should ensure they have received the appropriate permissions from the users for speaker identification.

### Identification

In the identification phase, the speaker identification service extracts voice features from the input speech recording. Then it compares the features against the enrollment data of the specified list of speakers. When a match is found with an enrolled speaker, the response returns the ID of the speaker with a confidence level.  Otherwise, the response returns "reject" when no speaker is a match to an enrolled speaker.

The threshold confidence level should be set based on the scenario. We recommend you experiment with the confidence level and consider the appropriate setting for each application. The APIs are not intended to determine whether the audio is from a live person or an imitation or a recording of an enrolled speaker.

The service does not retain the speech recording or the extracted voice features that are sent to the service for the identification phase.

For more details about speaker identification, please refer to the API [Speaker - Identification](https://westus.dev.cognitive.microsoft.com/docs/services/563309b6778daf02acc0a508/operations/5645c068e597ed22ec38f42e).
