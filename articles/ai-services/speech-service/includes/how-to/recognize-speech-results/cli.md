---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 03/31/2022
ms.author: eur
ms.custom: devx-track-csharp
---

[!INCLUDE [Introduction](intro.md)]

## Speech synchronization 

You might want to synchronize transcriptions with an audio track, whether it's done in real-time or with a prerecording. 

The Speech service returns the offset and duration of the recognized speech. 

[!INCLUDE [Define offset and duration](define-offset-duration.md)]

The end of a single utterance is determined by listening for silence at the end. You won't get the final recognition result until an utterance has completed. Recognizing events will provide intermediate results that are subject to change while an audio stream is being processed. Recognized events will provide the final transcribed text once processing of an utterance is completed.

### Recognizing offset and duration

You'll want to synchronize captions with the audio track, whether it's done in real-time or with a prerecording. With the `Recognizing` event, you can get the offset and duration of the speech being recognized. Offset and duration per word are not available while recognition is in progress. Each `Recognizing` event comes with a textual estimate of the speech recognized so far.

For example, run the following command to get the offset and duration of the recognized speech:

```console
spx recognize --file caption.this.mp4 --format any --output each file - @output.each.detailed
```

Since the `@output.each.detailed` argument was set, the output includes the following column headers:

```console
audio.input.id  event   event.sessionid result.reason   result.latency  result.text     result.json
```

In the `result.json` column, you can find details that include offset and duration for the `Recognizing` and `Recognized` events:

```json
{
	"Id": "492574cd8555481a92c22f5ff757ef17",
	"RecognitionStatus": "Success",
	"DisplayText": "Welcome to applied Mathematics course 201.",
	"Offset": 1800000,
	"Duration": 30500000
}
```

For more information, see the Speech CLI [datastore configuration](~/articles/ai-services/speech-service/spx-data-store-configuration.md) and [output options](~/articles/ai-services/speech-service/spx-data-store-configuration.md). 

[!INCLUDE [Example offset and duration](example-offset-duration.md)]
