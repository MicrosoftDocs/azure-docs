---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/30/2021
ms.author: mikben
---








## Record calls
> [!WARNING]
> Up until version 1.1.0 and beta release version 1.1.0-beta.1 of the ACS Calling iOS SDK has the `isRecordingActive` as part of the `Call` object and `didChangeRecordingState` is part of `CallDelegate` delegate. For new beta releases, those APIs have been moved as an extended feature of `Call` just like described below.
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling iOS SDK

Call recording is an extended feature of the core `Call` API. You first need to obtain the recording feature API object:

```swift
let callRecordingFeature = call.api(RecordingFeature.self)
```

Then, to check if the call is being recorded, inspect the `isRecordingActive` property of `callRecordingFeature`. It returns `Bool`.

```swift
let isRecordingActive = callRecordingFeature.isRecordingActive;
```

You can also subscribe to recording changes by implementing `RecordingFeatureDelegate` delegate on your class with the event `didChangeRecordingState`:

```swift
callRecordingFeature.delegate = self

// didChangeRecordingState is a member of RecordingFeatureDelegate
public func recordingFeature(_ recordingFeature: RecordingFeature, didChangeRecordingState args: PropertyChangedEventArgs) {
	let isRecordingActive = recordingFeature.isRecordingActive
}
```

If you want to start recording from your application, please first follow [Calling Recording overview](../../../../concepts/voice-video-calling/call-recording.md) for the steps to set up call recording.

Once you have the call recording setup on your server, from your iOS application you need to obtain the `ServerCallId` value from the call and then send it to your server to start the recording process. The `ServerCallId` value can be found using `getServerCallId()` from the `CallInfo` class, which can be found in the class object using `getInfo()`.

```swift
let serverCallId = call.info.getServerCallId(){ (serverId, error) in }
// Send serverCallId to your recording server to start the call recording.
```

When recording is started from the server, the event `didChangeRecordingState` will trigger and the value of `recordingFeature.isRecordingActive` will be `true`.

Just like starting the call recording, if you want to stop the call recording you need to get the `ServerCallId` and send it to your recording server so that it can stop the call recording.

```swift
let serverCallId = call.info.getServerCallId(){ (serverId, error) in }
// Send serverCallId to your recording server to stop the call recording.
```

When recording is stopped from the server, the event `didChangeRecordingState` will trigger and the value of `recordingFeature.isRecordingActive` will be `false`.

## Call transcription
> [!WARNING]
> Up until version 1.1.0 and beta release version 1.1.0-beta.1 of the ACS Calling iOS SDK has the `isTranscriptionActive` as part of the `Call` object and `didChangeTranscriptionState` is part of `CallDelegate` delegate. For new beta releases, those APIs have been moved as an extended feature of `Call` just like described below.
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling iOS SDK

Call transcription is an extended feature of the core `Call` API. You first need to obtain the transcription feature API object:

```swift
let callTranscriptionFeature = call.api(TranscriptionFeature.self)
```

Then, to check if the call is transcribed, inspect the `isTranscriptionActive` property of `callTranscriptionFeature`. It returns `Bool`.

```swift
let isTranscriptionActive = callTranscriptionFeature.isTranscriptionActive;
```

You can also subscribe to transcription changes by implementing `TranscriptionFeatureDelegate` delegate on your class with the event `didChangeTranscriptionState`:

```swift
callTranscriptionFeature.delegate = self

// didChangeTranscriptionState is a member of TranscriptionFeatureDelegate
public func transcriptionFeature(_ transcriptionFeature: TranscriptionFeature, didChangeTranscriptionState args: PropertyChangedEventArgs) {
	let isTranscriptionActive = transcriptionFeature.isTranscriptionActive
}
```

## Subscribe to notifications

You can subscribe to most of the properties and collections to be notified when values change.

### Properties
To subscribe to `property changed` events, use the following code.

```swift
call.delegate = self
// Get the property of the call state by getting on the call's state member
public func call(_ call: Call, didChangeState args: PropertyChangedEventArgs) {
{
    print("Callback from SDK when the call state changes, current state: " + call.state.rawValue)
}

 // to unsubscribe
 self.call.delegate = nil

```

### Collections
To subscribe to `collection updated` events, use the following code.

```swift
call.delegate = self
// Collection contains the streams that were added or removed only
public func call(_ call: Call, didUpdateLocalVideoStreams args: LocalVideoStreamsUpdatedEventArgs) {
{
    print(args.addedStreams.count)
    print(args.removedStreams.count)
}
// to unsubscribe
self.call.delegate = nil
```
