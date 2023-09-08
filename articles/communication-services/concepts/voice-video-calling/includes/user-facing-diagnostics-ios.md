---
title: Azure Communication Services User Facing Diagnostics (iOS)
titleSuffix: An Azure Communication Services concept document
description: Provides usage samples of the User Facing Diagnostics feature iOS Native.
author: lucianopa-msft
ms.author: lucianopa

services: azure-communication-services
ms.date: 04/06/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

## Accessing diagnostics

User-facing diagnostics is an extended feature of the core `Call` API and allows you to diagnose an active call.

```swift
let userFacingDiagnostics = self.call?.feature(Features.localUserDiagnostics)
```

## User Facing Diagnostic events

- Implement the delegates for `media` and `network` diagnostic sources. `MediaDiagnosticsDelegate` and `NetworkDiagnosticsDelegate` respectively.

```swift
extension CallObserver: MediaDiagnosticsDelegate {
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsCameraFrozen args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsSpeakerMuted args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsCameraStartFailed args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsSpeakerVolumeZero args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsSpeakerNotFunctioning args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsCameraPermissionDenied args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsMicrophoneNotFunctioning args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsCameraStartTimedOut args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsMicrophoneMutedUnexpectedly args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsZeroSpeakerDevicesAvailable args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...                            
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsZeroMicrophoneDevicesAvailable args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsSpeakingWhileMicrophoneIsMuted args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsSpeakerBusy args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeIsMicrophoneBusy args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
}

extension CallObserver: NetworkDiagnosticsDelegate {
  func networkDiagnostics(_ networkDiagnostics: NetworkDiagnostics,
                          didChangeIsNetworkRelaysUnreachable args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func networkDiagnostics(_ networkDiagnostics: NetworkDiagnostics,
                          didChangeNetworkReconnectionQuality args: DiagnosticQualityChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func networkDiagnostics(_ networkDiagnostics: NetworkDiagnostics,
                          didChangeNetworkSendQuality args: DiagnosticQualityChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func networkDiagnostics(_ networkDiagnostics: NetworkDiagnostics,
                          didChangeIsNetworkUnavailable args: DiagnosticFlagChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func networkDiagnostics(_ networkDiagnostics: NetworkDiagnostics,
                          didChangeNetworkReceiveQuality args: DiagnosticQualityChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
}
```

- Hold a reference to `media` and `network` diagnostics and set delegate object for listening to events.

```swift
self.mediaDiagnostics = userFacingDiagnostics?.media
self.networkDiagnostics = userFacingDiagnostics?.network
self.mediaDiagnostics?.delegate = self.callObserver
self.networkDiagnostics?.delegate = self.callObserver
```

>[!NOTE]
> If you have [`CallKit`](../../../how-tos/calling-sdk/callkit-integration.md) enabled via SDK or implement CallKit integration in your application, reporting mute state to CallKit can result in the OS making the application loose the hold to microphone due to privacy reasons which would cause the `didIsSpeakingWhileMicrophoneIsMuted` event not to work as expected because we cannot capture input from microphone device to detect that the user is speaking.

## Get the latest User Facing Diagnostics

- Get the latest diagnostic values that were raised. If we still didn't receive a value for the diagnostic, `nil` or `.unknown` is returned.

```swift
let lastSpeakerNotFunctionValue = self.mediaDiagnostics.latest.isSpeakerNotFunctioning // Boolean?
let lastNetworkRelayNotReachableValue = self.networkDiagnostics.latest.networkRelaysUnreachable // Boolean?
let lastReceiveQualityValue = self.networkDiagnostics.latest.networkReceiveQuality // DiagnosticQuality (.good, .poor, .bad)
// or .unknown if there isn't a diagnostic for this.
```
