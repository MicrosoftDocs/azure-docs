---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

## Record calls
[!INCLUDE [Public Preview Disclaimer](../../../../includes/Public-Preview-Note-ios.md)]


Call recording is an extended feature of the core `Call` object.

> [!WARNING]
> Up until version 1.1.0 and beta release version 1.1.0-beta.1 of the Azure Communication Services Calling iOS SDK, `isRecordingActive` was part of the `Call` object and `didChangeRecordingState` was part of the `CallDelegate` delegate. For new beta releases, those APIs were moved as an extended feature of `Call`.

You first need to obtain the recording feature object:

```swift
let callRecordingFeature = call.feature(Features.recording)
```

Then, to check if the call is being recorded, inspect the `isRecordingActive` property of `callRecordingFeature`. It returns `Bool`.

```swift
let isRecordingActive = callRecordingFeature.isRecordingActive;
```

You can also subscribe to recording changes by implementing the `RecordingCallFeatureDelegate` delegate on your class with the event `didChangeRecordingState`:

```swift
callRecordingFeature.delegate = self

// didChangeRecordingState is a member of RecordingCallFeatureDelegate
public func recordingCallFeature(_ recordingCallFeature: RecordingCallFeature, didChangeRecordingState args: PropertyChangedEventArgs) {
    let isRecordingActive = recordingFeature.isRecordingActive
}
```

If you want to start recording from your application, first follow [Call recording overview](../../../../concepts/voice-video-calling/call-recording.md) for the steps to set up call recording.

After you set up call recording on your server, from your iOS application, you need to obtain the `ServerCallId` value from the call and then send it to your server to start the recording process. You can find the `ServerCallId` value by using `getServerCallId()` from the `CallInfo` class. You can find the `CallInfo` class in the class object by using `getInfo()`.

```swift
// Send serverCallId to your recording server to start the call recording.
let serverCallId = call.info.getServerCallId(){ (serverId, error) in }
```

When you start recording from the server, the event `didChangeRecordingState` is triggered and the value of `recordingFeature.isRecordingActive` is `true`.

Just like starting the call recording, if you want to stop the call recording, you need to get `ServerCallId` and send it to your recording server so that it can stop the recording:

```swift
// Send serverCallId to your recording server to stop the call recording.
let serverCallId = call.info.getServerCallId(){ (serverId, error) in }
```

When you stop recording from the server, the event `didChangeRecordingState` is triggered and the value of `recordingFeature.isRecordingActive` is `false`.

## Explicit Consent
[!INCLUDE [Public Preview Disclaimer](../../../../includes/Public-Preview-Note-ios.md)]

When your Teams meeting or call is configured to require explicit consent for recording and transcription, you're required to collect consent from all participants in the call before you can record them. You can provide consent proactively when joining the meeting or reactively when the recording starts. Until explicit consent is given, participants' audio, video, and screen sharing will be disabled during recording.

You can check if the meeting recording requires explicit consent by property `isTeamsConsentRequired`. If the value is set to `true`, then explicit consent is required for the `call`.

```swift
let isConsentRequired = recordingFeature.isTeamsConsentRequired;
```

If you have already obtained the user's consent for recording, you can call `grantTeamsConsent()` method to indicate explicit consent to the service. This consent is valid for one `call` session only and users need to provide consent again if they rejoin the meeting.

```swift
recordingFeature.grantTeamsConsent();
```

Attempts to enable audio, video, or screen sharing fail when recording is active, explicit consent is required but isn't yet given. You can recognize this situation by checking property `reason` of class `ParticipantCapabilities` for [capabilities](../../capabilities.md) `turnVideoOn`, `unmuteMic` and `shareScreen`. You can find those [capabilities](../../capabilities.md) in the feature `call.feature(Features.Capabilities)`. Those [capabilities](../../capabilities.md) would return reason `ExplicitConsentRequired` as users need to provide explicit consent.