---
author: jsaurezlee-msft
ms.service: azure-communication-services
ms.topic: include
ms.date: 05/30/2023
ms.author: jsaurezlee
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

Call transcription is an extended feature of the core `Call` object. You first need to obtain the transcription feature object:

```csharp
TranscriptionCallFeature transcriptionFeature = call.Features.Transcription;
```

Then, to check if the call is being transcribed, inspect the `IsTranscriptionActive` property of `transcriptionFeature`. It returns `boolean`.

```csharp
boolean isTranscriptionActive = transcriptionFeature.isTranscriptionActive;
```

You can also subscribe to changes in transcription:

```csharp
private async void Call__OnIsTranscriptionActiveChanged(object sender, PropertyChangedEventArgs args)
    boolean isTranscriptionActive = transcriptionFeature.IsTranscriptionActive();
}

transcriptionFeature.IsTranscriptionActiveChanged += Call__OnIsTranscriptionActiveChanged;
```
## Explicit Consent
[!INCLUDE [Public Preview Disclaimer](../../../../includes/Public-Preview-Note-windows.md)]

When your Teams meeting or call is configured to require explicit consent for recording or transcription, you're required to gather explicit consent from your users to allow users to be transcribed or recorded. You can provide consent proactively when joining the meeting or reactively when the recording or transcription starts. Until explicit consent is given, participants' audio, video, and screen sharing will be disabled during transcription.

You can check if the meeting transcription requires explicit consent by property `isTeamsConsentRequired`. If the value is set to `true`, then explicit consent is required for the `call`.

```csharp
boolean isTranscriptionConsentRequired = transcriptionFeature.isTeamsConsentRequired;
```

If you have already obtained the user's consent for transcription, you can call the `grantTeamsConsent()` method to indicate explicit consent to the service. This consent is valid for one `call` session only and users need to provide consent again if they rejoin the meeting.

```csharp
transcriptionFeature.grantTeamsConsent();
```
Attempts to enable audio, video, or screen sharing fail when transcription is active, explicit consent is required but isn't yet given. You can recognize this situation by checking property `reason` of class `ParticipantCapabilities` for [capabilities](../../capabilities.md) `turnVideoOn`, `unmuteMic` and `shareScreen`. You can find those [capabilities](../../capabilities.md) in the feature `call.feature(Features.Capabilities)`. Those [capabilities](../../capabilities.md) would return reason `ExplicitConsentRequired` as users need to provide explicit consent.