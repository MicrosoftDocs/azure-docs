---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/15/2025
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

> [!WARNING]
> Up until version 1.1.0 and beta release version 1.1.0-beta.1 of the Azure Communication Services Calling iOS SDK has the `isTranscriptionActive` as part of the `Call` object and `didChangeTranscriptionState` is part of `CallDelegate` delegate. For new beta releases, those features are now as an extended feature of `Call` as described later in this article.

Call transcription is an extended feature of the core `Call` object. You first need to obtain the transcription feature object:

```swift
let callTranscriptionFeature = call.feature(Features.transcription)
```

Then, to check if the call is transcribed, inspect the `isTranscriptionActive` property of `callTranscriptionFeature`. It returns `Bool`.

```swift
let isTranscriptionActive = callTranscriptionFeature.isTranscriptionActive;
```

You can also subscribe to transcription changes by implementing `TranscriptionCallFeatureDelegate` delegate on your class with the event `didChangeTranscriptionState`:

```swift
callTranscriptionFeature.delegate = self

// didChangeTranscriptionState is a member of TranscriptionCallFeatureDelegate
public func transcriptionCallFeature(_ transcriptionCallFeature: TranscriptionCallFeature, didChangeTranscriptionState args: PropertyChangedEventArgs) {
    let isTranscriptionActive = callTranscriptionFeature.isTranscriptionActive
}
```
## Explicit Consent
[!INCLUDE [Public Preview Disclaimer](../../../../includes/Public-Preview-Note-ios.md)]

When your Teams meeting or call is configured to require explicit consent for recording or transcription, you're required to gather explicit consent from your users to permit users to be transcribed or recorded. You can provide consent proactively when joining the meeting or reactively when the recording or transcription starts. Until explicit consent is given, participants' audio, video, and screen sharing is disabled during transcription.

You can check if the meeting transcription requires explicit consent by property `isTeamsConsentRequired`. If the value is set to `true`, then explicit consent is required for the `call`.

```swift
let isTranscriptionConsentRequired = callTranscriptionFeature.isTeamsConsentRequired;
```

If you already obtained the user's consent for transcription, you can call the `grantTeamsConsent()` method to indicate explicit consent to the service. This consent is valid for one `call` session only and users need to provide consent again if they rejoin the meeting.

```swift
callTranscriptionFeature.grantTeamsConsent();
```
Attempts to enable audio, video, or screen sharing fail when transcription is active, explicit consent is required but isn't yet given. You can recognize this situation by checking property `reason` of class `ParticipantCapabilities` for [capabilities](../../capabilities.md) `turnVideoOn`, `unmuteMic`, and `shareScreen`. You can find those [capabilities](../../capabilities.md) in the feature `call.feature(Features.Capabilities)`. Those [capabilities](../../capabilities.md) would return reason `ExplicitConsentRequired` as users need to provide explicit consent.