---
author: tomaschladek
ms.service: azure-communication-services
ms.topic: include
ms.date: 08/08/2024
ms.author: tchladek
---

> [!WARNING]
> Due to changes in Microsoft Teams, JavaScript calling SDKs with versions 1.27 and lower stops Teams transcription and blocks Teams users to start transcription. If you would like to leverage Teams transcription in the calls and meetings, you need to upgrade your calling SDK to at least version 1.28.

## Call transcription 

`Transcription` is an extended feature of the class `Call`. You first need to obtain the transcription feature API object

```js
const callTranscriptionApi = call.api(Features.Transcription);
```

You can check state of the transcription in the property `isTranscriptionActive`. If value is set to `true`, then transcription is active.

```js
const isTranscriptionActive = callTranscriptionApi.isTranscriptionActive;
```

You can subscribe to event, that is triggered when state of transcription changes:

```js
const isTranscriptionActiveChangedHandler = () => {
  console.log(callTranscriptionApi.isTranscriptionActive);
};
callRecordingApi.on('isTranscriptionActiveChanged', isTranscriptionActiveChangedHandler);
```

You can unsubscribe from the event with the following code: 

```js
callRecordingApi.off('isTranscriptionActiveChanged', isTranscriptionActiveChangedHandler);
```
