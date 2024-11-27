---
author: tomaschladek
ms.service: azure-communication-services
ms.topic: include
ms.date: 08/08/2024
ms.author: tchladek
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

> [!WARNING]
> Due to changes in Microsoft Teams, JavaScript calling SDKs with versions 1.21 and lower stops Teams transcription and blocks Teams users to start transcription. If you would like to leverage Teams transcription in the calls and meetings, you need to upgrade your calling SDK to at least version 1.22.

## Call transcription 

`Transcription` is an extended feature of the class `Call`. You first need to obtain the transcription feature API object

```js
const callTranscriptionFeature = call.feature(Features.Transcription);
```

You can check state of the transcription in the property `isTranscriptionActive`. If value is set to `true`, then transcription is active.

```js
const isTranscriptionActive = callTranscriptionFeature.isTranscriptionActive;
```

You can subscribe to event that is triggered when state of transcription changes:

```js
const isTranscriptionActiveChangedHandler = () => {
  console.log(callTranscriptionFeature.isTranscriptionActive);
};
callTranscriptionFeature.on('isTranscriptionActiveChanged', isTranscriptionActiveChangedHandler);
```

You can unsubscribe from the event with the following code: 

```js
callTranscriptionFeature.off('isTranscriptionActiveChanged', isTranscriptionActiveChangedHandler);
```

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

## Explicit Consent
If your Teams meeting or call is configured to require explicit consent for recording or transcription, you are required to gather explicit consent from your users to be transcribed or Recorded.
 
### Support
The following tables show support of explicit consent for specific call type and identity.
 
|Identities                   | Teams meeting | Room | 1:1 call | Group call | 1:1 Teams interop call | Group Teams interop call |
|-----------------------------|---------------|------|----------|------------|------------------------|--------------------------|
|Communication Services user  |✔️|      |          |            |                       |      ✔️|
|Microsoft 365 user           |✔️|      |          |            |                       |      ✔️|
  
You can check if the meeting transcription requires explicit consent by property `isConsentRequired`. If the value is set to `true`, then explicit consent is required for the call.
 
```js
const isTranscriptionConsentRequired = callTranscriptionFeature.isConsentRequired;
```
 
If the transcription is active and explicit consent is required, user will not be able to unmute, turn video on and share screen until they provide the consent. You can provide the consent for the user by using the api `consentToBeingRecordedAndTranscribed`.
 
```js
callTranscriptionFeature.consentToBeingRecordedAndTranscribed();
```
