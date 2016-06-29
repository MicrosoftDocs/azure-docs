<properties
   pageTitle="Overview: Cognitive Services Speaker Recognition API | Microsoft Azure"
   description="Learn how speaker recognition can enhance applications. Speaker Recognition APIs have advanced algorithms for speaker verification and identification."
   services="cognitive-services"
   documentationCenter="na"
   authors="cjgronlund"
   manager="paulettem"
   editor="cjgronlund"/>

<tags
   ms.service="cognitive-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/02/2016"
   ms.author="cgronlun"/>

# Overview: Speaker Recognition API from Azure Cognitive Services

Learn how speaker recognition capabilities can enhance applications. Speaker Recognition APIs are cloud-based APIs that provide the most advanced algorithms for speaker verification and speaker identification. Speaker Recognition can be divided into two categories:

  * Speaker verification
  * Speaker identification

## Speaker verification

Voice has unique characteristics that can be used to identify a person, just like a fingerprint. Using voice as a signal for access control and authentication scenarios has emerged as a new innovative tool – essentially offering a level up in security that simplifies the authentication experience for customers.

Speaker Verification APIs can automatically verify and authenticate users using their voice or speech.

### Speaker verification enrollment

Enrollment for speaker verification is text-dependent, which means speakers need to choose a specific pass phrase to use during both enrollment and verification phases.

In enrollment, the speaker's voice is recorded saying a specific phrase, then a number of features are extracted and the chosen phrase is recognized. Together, both extracted features and the chosen phrase form a unique voice signature.

### Verifying the input voice and phrase

In verification, an input voice and phrase are compared against the enrollment's voice signature and phrase - in order to verify whether or not they are from the same person, and if they are saying the correct phrase.

For more details about speaker verification, refer to the [Verification part of the Speaker Recognition API documentation](https://dev.projectoxford.ai/docs/services/563309b6778daf02acc0a508/operations/563309b7778daf06340c9652).

## Speaker identification

Speaker Identification APIs can automatically identify the person speaking in an audio file, given a group of prospective speakers. The input audio is paired against the provided group of speakers, and in the case that there is a match found, the speaker’s identity is returned.

All speakers should go through an enrollment process first to get their voice registered to the system, and have a voice print created.

### Speaker identification enrollment

Enrollment for speaker identification is text-independent, which means that there are no restrictions on what the speaker says in the audio. The speaker's voice is recorded, and a number of features are extracted to form a unique voice signature.

### Speaker recognition: Matching the input voice

The audio of the unknown speaker, together with the prospective group of speakers, is provided during recognition. The input voice is compared against all speakers in order to determine whose voice it is, and if there is a match found, the identity of the speaker is returned.

For more details about speaker identification, refer to the [Identification part of the Speaker Recognition API documentation](https://dev.projectoxford.ai/docs/services/563309b6778daf02acc0a508/operations/5645c068e597ed22ec38f42e).
