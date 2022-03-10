---
title: Captioning with speech to text - Speech service
titleSuffix: Azure Cognitive Services
description: An overview of key concepts for captioning with speech to text.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/10/2022
ms.author: eur
---

# Captioning with speech to text

Use captioning with speech to text to transcribe the spoken words into text.


•	We will discuss captioning in general as a scenario:
o	Types of scenarios: Real-time/Offline
	For offline: Take a look at AVA
o	Applications: Meeting/Broadcast/Call/Talkshow, etc.
•	We will offer them a general architecture diagram with some explanations (accepting stream, encoding, peeling off audio, compressing, send to SDK, turn into accepted protocol, package onto video according to standards) with potentially links for more information .
•	Some ‘tips & tricks’ we have learned :
o	Link to QuickStart where we talk about StablePartials, etc. The below is additional items to consider:
o	Consider having captions be prominent on the screen, in a large font and centered horizontally . [1]
o	Captions should be synchronized to the speed of the person talking.  [1] 
o	Consider adding capitalization on the real-time result.
o	Latency may have a tradeoff with stability of the result (lower latency = potentially more 'flickering’ of the result).
o	Learn about the different captioning protocols that exist (e.g. SMTE).
o	If offline captioning, consider adding the full caption at once, instead of word-by-word. [1]
o	Consider the number of lines to add for the captions (2 vs. 3), there may be tradeoffs one way or the other depending on how long the caption is. [1]
o	Consider adding a statement that captions are auto-generated. [1]





## Language identification


## Customize the result format (capitalization of intermediates, stable partials)


For more readable result, capitalization would help.
Stable partials will lead to less ‘flickering’ but perhaps have more delay in showing the correct result 


## Tune the quality (phrase list, custom model)
For specific terms/names (e.g. captioning a sports game), Phrase list would help.
For general topics (e.g. captioning of orthodontist lectures), customization would help. Here’s how you can create a custom model <link>.

## Output format
If file: how to download SRT format and use media player (e.g. VLC)
If stream: additional information (link to different page) – more details in below section



## True text

```csharp
// A string value specifying which post processing option should be used by service. Allowed value: TrueText
speech_config.SetProperty ("SpeechServiceResponse_PostProcessingOption", "TrueText");
```

## Stable partials

```csharp
// The number of times a word has to be in partial results to be returned. 
speech_config.SetProperty ("StablePartialResultThreshold", user_config.stable_partial_result_threshold);
```

## Start and end time

```csharp
//Offset of the recognized speech in ticks. A single tick represents one hundred nanoseconds or one ten-millionth of a second.
var start_time = new DateTime (e.Result.OffsetInTicks);

//Duration of the recognized speech. This does not include trailing or leading silence.
var end_time = start_time.Add (e.Result.Duration);
```

## Phrase list


## Custom speech models


## Dictation


## Profanity filter 
This enables profanity filter:
speech_config.SetProfanity (ProfanityOption.Removed);

## Next steps
[Get started with speech to text](get-started-speech-to-text.md)
