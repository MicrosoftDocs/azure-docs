---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 03/31/2022
ms.author: eur
ms.custom: devx-track-csharp
---

[!INCLUDE [Header](../../common/javascript.md)]

[!INCLUDE [Introduction](intro.md)]

## Speech synchronization 

You might want to synchronize transcriptions with an audio track, whether it's done in real-time or with a prerecording. 

The Speech service returns the offset and duration of the recognized speech. 

[!INCLUDE [Define offset and duration](define-offset-duration.md)]

The end of a single utterance is determined by listening for silence at the end. You won't get the final recognition result until an utterance has completed. Recognizing events will provide intermediate results that are subject to change while an audio stream is being processed. Recognized events will provide the final transcribed text once processing of an utterance is completed.

### Recognizing offset and duration

With the `Recognizing` event, you can get the offset and duration of the speech being recognized. Offset and duration per word are not available while recognition is in progress. Each `Recognizing` event comes with a textual estimate of the speech recognized so far.

This code snippet shows how to get the offset and duration from a `Recognizing` event. 

```javascript
speechRecognizer.recognizing = function (s, e) {
    console.log("RECOGNIZING: " + e.result.text);
    console.log("Offset in Ticks: " + e.result.offset);
    console.log("Duration in Ticks: " + e.result.duration);
};
```

### Recognized offset and duration
Once an utterance has been recognized, you can get the offset and duration of the recognized speech. With the `Recognized` event, you can also get the offset and duration per word. To request the offset and duration per word, first you must set the corresponding `SpeechConfig` property as shown here:

```javascript
speechConfig.requestWordLevelTimestamps();
```

[!INCLUDE [Example offset and duration](example-offset-duration.md)]
