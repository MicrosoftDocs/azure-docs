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

## Explicit Consent
When your Teams meeting or call is configured to require explicit consent for recording or transcription, you're required to gather explicit consent from your users to allow users to be transcribed or recorded. You can provide consent proactively when joining the meeting or reactively when the recording or transcription starts. Until explicit consent is given, participants' audio, video, and screen sharing will be disabled during transcription.

You can check if the meeting transcription requires explicit consent by property `isTeamsConsentRequired`. If the value is set to `true`, then explicit consent is required for the `call`.

```js
const isTranscriptionConsentRequired = callTranscriptionFeature.isTeamsConsentRequired;
```

If you have already obtained the user's consent for transcription, you can call the `grantTeamsConsent()` method to indicate explicit consent to the service. This consent is valid for one `call` session only and users need to provide consent again if they rejoin the meeting.

```js
callTranscriptionFeature.grantTeamsConsent();
```
Attempts to enable audio, video, or screen sharing fail when transcription is active, explicit consent is required but isn't yet given. You can recognize this situation by checking property `reason` of class `ParticipantCapabilities` for [capabilities](../../capabilities.md) `turnVideoOn`, `unmuteMic` and `shareScreen`. You can find those [capabilities](../../capabilities.md) in the feature `call.feature(Features.Capabilities)`. Those [capabilities](../../capabilities.md) would return reason `ExplicitConsentRequired` as users need to provide explicit consent.
