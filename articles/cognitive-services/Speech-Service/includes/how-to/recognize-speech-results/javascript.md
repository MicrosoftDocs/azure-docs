---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/31/2022
ms.author: eur
ms.custom: devx-track-csharp
---

[!INCLUDE [Header](../../common/javascript.md)]

[!INCLUDE [Introduction](intro.md)]

## Speech synchronization 

You might want to synchronize transcriptions with an audio track, whether it's done in real time or with a prerecording. 

The Speech service returns the offset and duration of the recognized speech. 

- **Offset**: Used to measure the relative position of the speech that is currently being recognized, from the time that you started speech recognition. Speech recognition does not necessarily start at the beginning of the audio track. Offset is measured in ticks, where a single tick represents one hundred nanoseconds or one ten-millionth of a second.
- **Duration**: Duration of the utterance that is being recognized. The duration time span does not include trailing or leading silence. 

As soon as you start continuous recognition, the offset starts incrementing in ticks from `0` (zero). 

```javascript
speechRecognizer.startContinuousRecognitionAsync();
```

The end of a single utterance is determined by listening for silence at the end. You won't get the final recognition result until an utterance has completed. Recognizing events will provide intermediate results that are subject to change while an audio stream is being processed. Recognized events will provide the final transcribed text once processing of an utterance is completed.

### Recognizing offset and duration

With the `Recognizing` event, you can get the offset and duration of the speech being recognized. Offset and duration per word are not available while recognition is in progress. Each `Recognizing` event comes with a textual estimate of the speech recognized so far.

### Recognized offset and duration
Once an utterance has been recognized, you can get the offset and duration of the recognized speech. With the `Recognized` event, you can also get the offset and duration per word. To request the offset and duration per word, first you must set the corresponding `SpeechConfig` property as shown here:

```javascript
speechConfig.requestWordLevelTimestamps();
```

[!INCLUDE [Example offset and duration](example-offset-duration.md)]