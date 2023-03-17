---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

> [!WARNING]
> Up until version 1.1.0 and beta release version 1.1.0-beta.1 of the Azure Communication Services Calling iOS SDK has the `isTranscriptionActive` as part of the `Call` object and `didChangeTranscriptionState` is part of `CallDelegate` delegate. For new beta releases, those APIs have been moved as an extended feature of `Call` just like described below.

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
