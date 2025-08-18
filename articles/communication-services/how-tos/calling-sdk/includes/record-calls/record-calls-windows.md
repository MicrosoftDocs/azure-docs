---
author: jsaurezlee-msft
ms.service: azure-communication-services
ms.topic: include
ms.date: 30/05/2023
ms.author: jsaurezlee
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

## Record calls

Call recording is an extended feature of the core `Call` object. You first need to obtain the recording feature object:

```csharp
RecordingCallFeature recordingFeature = call.Features.Recording;
```

Then, to check if the call is being recorded, inspect the `IsRecordingActive` property of `recordingFeature`. It returns `boolean`.

```csharp
boolean isRecordingActive = recordingFeature.IsRecordingActive;
```

You can also subscribe to recording changes:

```csharp
private async void Call__OnIsRecordingActiveChanged(object sender, PropertyChangedEventArgs args)
  boolean isRecordingActive = recordingFeature.IsRecordingActive;
}

recordingFeature.IsRecordingActiveChanged += Call__OnIsRecordingActiveChanged;
```

## Explicit Consent
[!INCLUDE [Public Preview Disclaimer](../../../../includes/Public-Preview-Note-windows.md)]

When your Teams meeting or call is configured to require explicit consent for recording and transcription, you're required to collect consent from all participants in the call before you can record them. You can provide consent proactively when joining the meeting or reactively when the recording starts. Until explicit consent is given, participants' audio, video, and screen sharing will be disabled during recording.

You can check if the meeting recording requires explicit consent by property `isTeamsConsentRequired`. If the value is set to `true`, then explicit consent is required for the `call`.

```csharp
boolean isConsentRequired = recordingFeature.isTeamsConsentRequired;
```

If you have already obtained the user's consent for recording, you can call `grantTeamsConsent()` method to indicate explicit consent to the service. This consent is valid for one `call` session only and users need to provide consent again if they rejoin the meeting.

```csharp
recordingFeature.grantTeamsConsent();
```

Attempts to enable audio, video, or screen sharing fail when recording is active, explicit consent is required but isn't yet given. You can recognize this situation by checking property `reason` of class `ParticipantCapabilities` for [capabilities](../../capabilities.md) `turnVideoOn`, `unmuteMic` and `shareScreen`. You can find those [capabilities](../../capabilities.md) in the feature `call.feature(Features.Capabilities)`. Those [capabilities](../../capabilities.md) would return reason `ExplicitConsentRequired` as users need to provide explicit consent.