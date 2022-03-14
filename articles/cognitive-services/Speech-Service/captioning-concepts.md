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

We will discuss captioning in general as a scenario:
* Types of scenarios: Real-time/Offline. For offline: Take a look at AVA
* Applications: Meeting/Broadcast/Call/Talkshow, etc. We will offer them a general architecture diagram with some explanations (accepting stream, encoding, peeling off audio, compressing, send to SDK, turn into accepted protocol, package onto video according to standards) with potentially links for more information .
Some "tips & tricks" we have learned :
* Link to QuickStart where we talk about StablePartials, etc. The below is additional items to consider:
* Consider having captions be prominent on the screen, in a large font and centered horizontally . [1]
* Captions should be synchronized to the speed of the person talking.  [1] 
* Consider adding capitalization on the real-time result.
* Latency may have a tradeoff with stability of the result (lower latency = potentially more 'flickering’ of the result).
* Learn about the different captioning protocols that exist (e.g. SMPTE). 
* If offline captioning, consider adding the full caption at once, instead of word-by-word. [1]
* Consider the number of lines to add for the captions (2 vs. 3), there may be tradeoffs one way or the other depending on how long the caption is. 
* Consider adding a statement that captions are auto-generated. Inform your end users. 

[Azure Video Analyzer for Media](/azure/azure-video-analyzer/video-analyzer-for-media-docs/video-indexer-overview) if you want to demo a full captioning solution. 

## Start and end time

```csharp
//Offset of the recognized speech in ticks. A single tick represents one hundred nanoseconds or one ten-millionth of a second.
var start_time = new DateTime (e.Result.OffsetInTicks);

//Duration of the recognized speech. This does not include trailing or leading silence.
var end_time = start_time.Add (e.Result.Duration);
```

```csharp
// If you want detailed recognition results with word-level offset and duration, set the following.
// Get Words with Offset and Duration.
speechConfig.RequestWordLevelTimestamps();
```

for the `SpeechRecognizer` has a As soon as continuous recognition is started, the duration offset begins incrementing in ticks from `0` (zero). 

```csharp
// Starts continuous recognition. Use StopContinuousRecognitionAsync() to stop recognition.
await speech_recognizer.StartContinuousRecognitionAsync().ConfigureAwait(false);
```

While recognizing, you can get the offset and projected duration of the recognized speech. Details such as the confidence score and word level timestamps are not available while recognition is in progress.

```csharp
speech_recognizer.Recognizing += (object sender, SpeechRecognitionEventArgs e) =>
    {
        if (e.Result.Reason == ResultReason.RecognizingSpeech)
        {        
            Console.WriteLine($"RECOGNIZING: Text={e.Result.Text}");
            Console.WriteLine(String.Format ("Offset in Ticks: {0}", e.Result.OffsetInTicks));
            Console.WriteLine(String.Format ("Duration in Ticks: {0}", e.Result.Duration.Ticks));
        }
    };
```

Once an utterance has been recognized, you can get the offset and final duration of the recognized speech. Details such as the confidence score and word level timestamps are also available. 

```csharp
speech_recognizer.Recognized += (object sender, SpeechRecognitionEventArgs e) =>
    {
        if (ResultReason.RecognizedSpeech == e.Result.Reason && e.Result.Text.Length > 0)
        {            
            Console.WriteLine($"RECOGNIZED: Text={e.Result.Text}");
            Console.WriteLine(String.Format ("Offset in Ticks: {0}", e.Result.OffsetInTicks));
            Console.WriteLine(String.Format ("Duration in Ticks: {0}", e.Result.Duration.Ticks));
                        
            var detailedResults = speechRecognitionResult.Best();
            if(detailedResults != null && detailedResults.Any())
            {
                // The first item in detailedResults corresponds to the recognized text.
                // This is not necessarily the item with the highest confidence number.
                var bestResults = detailedResults?.ToList()[0];
                Console.WriteLine($"\tConfidence: {bestResults.Confidence}\n\tText: {bestResults.Text}\n\tLexicalForm: {bestResults.LexicalForm}\n\tNormalizedForm: {bestResults.NormalizedForm}\n\tMaskedNormalizedForm: {bestResults.MaskedNormalizedForm}");
                
                // You must set speechConfig.RequestWordLevelTimestamps() to get word-level timestamps.
                Console.WriteLine($"\tWord-level timing:");
                Console.WriteLine($"\t\tWord | Offset | Duration");
                Console.WriteLine($"\t\t----- | ----- | ----- ");

                foreach (var word in bestResults.Words)
                {
                    Console.WriteLine($"\t\t{word.Word} | {word.Offset} | {word.Duration}");
                }
            }
        }
    };
```

## Profanity filter 

Removes profanity (swearing), or replaces letters of profane words with stars
Masked: Replaces letters in profane words with star characters.
Removed: Removes profane words.

This enables profanity filter:
```csharp
speech_config.SetProfanity (ProfanityOption.Removed);
```

## Output format
If file: how to download SRT format and use media player (e.g. VLC)
If stream: additional information (link to different page) – more details in below section

Subtitle-friendly formats include SRT and WebVTT.


## Capitalize intermediates
For more readable result, capitalization can help. 

Capitalizes intermediates? But does not add punctuation? 
Semi-display processing?
Lexical form is just the letters in a transcript (e.g., six - not '6'), no caps, etc

```csharp
// A string value specifying which post processing option should be used by service. Allowed value: TrueText
speech_config.SetProperty ("SpeechServiceResponse_PostProcessingOption", "TrueText");
```

## Stable intermediate results

Stable partials will lead to less "flickering" but perhaps have more delay in showing the correct result. Supporting punctuation on intermediate results is not supported. 

```csharp
// The number of times a word has to be in partial results to be returned. 
speech_config.SetProperty (PropertyId.SpeechServiceResponse_StablePartialResultThreshold, 5);
```

Setting the stable partial result threshold to 0 will return all partial results.

```console
RECOGNIZING: Text=welcome to
RECOGNIZING: Text=welcome to applied math
RECOGNIZING: Text=welcome to applied mathematics
RECOGNIZING: Text=welcome to applied mathematics course 2
RECOGNIZING: Text=welcome to applied mathematics course 201
RECOGNIZED: Text=Welcome to applied Mathematics course 201.
```

Setting stable partial result threshold to 2:

```console
RECOGNIZING: Text=welcome
RECOGNIZING: Text=welcome to
RECOGNIZING: Text=welcome to applied
RECOGNIZING: Text=welcome to applied mathematics
RECOGNIZING: Text=welcome to applied mathematics course
RECOGNIZING: Text=welcome to applied mathematics course 2
RECOGNIZING: Text=welcome to applied mathematics course 20
RECOGNIZED: Text=Welcome to applied Mathematics course 201.
```

Setting stable partial result threshold to 5:

```console
RECOGNIZING: Text=welcome to
RECOGNIZING: Text=welcome to applied
RECOGNIZING: Text=welcome to applied mathematics
RECOGNIZED: Text=Welcome to applied Mathematics course 201.
```

## Improve recognition accuracy

For specific terms/names (e.g. captioning a sports game), Phrase list would help.

For general topics (e.g. captioning of orthodontist lectures), customization would help. Here’s how you can create a custom model



## Language identification
Multi-lingual
Short switches not supported well (in the LID doc already)



## Next steps
* [Get started with speech to text](get-started-speech-to-text.md)
