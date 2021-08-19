---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/30/2021
ms.author: mikben
---










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
