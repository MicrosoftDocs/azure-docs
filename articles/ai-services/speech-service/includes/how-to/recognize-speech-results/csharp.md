---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 03/31/2022
ms.author: eur
ms.custom: devx-track-csharp
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## Speech synchronization 

You might want to synchronize transcriptions with an audio track, whether it's done in real-time or with a prerecording. 

The Speech service returns the offset and duration of the recognized speech. 

[!INCLUDE [Define offset and duration](define-offset-duration.md)]

The end of a single utterance is determined by listening for silence at the end. You won't get the final recognition result until an utterance has completed. Recognizing events will provide intermediate results that are subject to change while an audio stream is being processed. Recognized events will provide the final transcribed text once processing of an utterance is completed.

### Recognizing offset and duration

With the `Recognizing` event, you can get the offset and duration of the speech being recognized. Offset and duration per word are not available while recognition is in progress. Each `Recognizing` event comes with a textual estimate of the speech recognized so far.

This code snippet shows how to get the offset and duration from a `Recognizing` event. 

```csharp
speechRecognizer.Recognizing += (object sender, SpeechRecognitionEventArgs e) =>
    {
        if (e.Result.Reason == ResultReason.RecognizingSpeech)
        {        
            Console.WriteLine(String.Format ("RECOGNIZING: {0}", e.Result.Text));
            Console.WriteLine(String.Format ("Offset in Ticks: {0}", e.Result.OffsetInTicks));
            Console.WriteLine(String.Format ("Duration in Ticks: {0}", e.Result.Duration.Ticks));
        }
    };
```

### Recognized offset and duration
Once an utterance has been recognized, you can get the offset and duration of the recognized speech. With the `Recognized` event, you can also get the offset and duration per word. To request the offset and duration per word, first you must set the corresponding `SpeechConfig` property as shown here:

```csharp
speechConfig.RequestWordLevelTimestamps();
```

This code snippet shows how to get the offset and duration from a `Recognized` event. 

```csharp
speechRecognizer.Recognized += (object sender, SpeechRecognitionEventArgs e) =>
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
                Console.WriteLine(String.Format("\tConfidence: {0}\n\tText: {1}\n\tLexicalForm: {2}\n\tNormalizedForm: {3}\n\tMaskedNormalizedForm: {4}",
                    bestResults.Confidence, bestResults.Text, bestResults.LexicalForm, bestResults.NormalizedForm, bestResults.MaskedNormalizedForm));
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

[!INCLUDE [Example offset and duration](example-offset-duration.md)]
