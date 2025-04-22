---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-android.md)]

> [!WARNING]
> Up until version 1.1.0 and beta release version 1.1.0-beta.1 of the Azure Communication Services Calling Android SDK has the `isTranscriptionActive` and `addOnIsTranscriptionActiveChangedListener` are part of the `Call` object. For new beta releases, those APIs have been moved as an extended feature of `Call` just like described below.

Call transcription is an extended feature of the core `Call` object. You first need to obtain the transcription feature object:

```java
TranscriptionCallFeature callTranscriptionFeature = call.feature(Features.TRANSCRIPTION);
```

Then, to check if the call is being transcribed, inspect the `isTranscriptionActive` property of `callTranscriptionFeature`. It returns `boolean`.

```java
boolean isTranscriptionActive = callTranscriptionFeature.isTranscriptionActive();
```

You can also subscribe to changes in transcription:

```java
private void handleCallOnIsTranscriptionChanged(PropertyChangedEvent args) {
    boolean isTranscriptionActive = callTranscriptionFeature.isTranscriptionActive();
}

callTranscriptionFeature.addOnIsTranscriptionActiveChangedListener(handleCallOnIsTranscriptionChanged);
```

## Explicit Consent
[!INCLUDE [Public Preview Disclaimer](../../../../includes/Public-Preview-Note-android.md)]

When your Teams meeting or call is configured to require explicit consent for recording or transcription, you're required to gather explicit consent from your users to allow users to be transcribed or recorded. You can provide consent proactively when joining the meeting or reactively when the recording or transcription starts. Until explicit consent is given, participants' audio, video, and screen sharing will be disabled during transcription.

You can check if the meeting transcription requires explicit consent by property `isTeamsConsentRequired()`. If the value is set to `true`, then explicit consent is required for the `call`.

```java
boolean isTranscriptionConsentRequired = callTranscriptionFeature.isTeamsConsentRequired();
```

If you have already obtained the user's consent for transcription, you can call the `grantTeamsConsent()` method to indicate explicit consent to the service. This consent is valid for one `call` session only and users need to provide consent again if they rejoin the meeting.

```java
callTranscriptionFeature.grantTeamsConsent();
```
Attempts to enable audio, video, or screen sharing fail when transcription is active, explicit consent is required but isn't yet given. You can recognize this situation by checking property `reason` of class `ParticipantCapabilities` for [capabilities](../../capabilities.md) `turnVideoOn`, `unmuteMic` and `shareScreen`. You can find those [capabilities](../../capabilities.md) in the feature `call.feature(Features.Capabilities)`. Those [capabilities](../../capabilities.md) would return reason `ExplicitConsentRequired` as users need to provide explicit consent.