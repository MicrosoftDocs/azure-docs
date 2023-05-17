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
let userFacingDiagnostics = self.call?.feature(Features.diagnostics)
```

## User Facing Diagnostic events

- Implement the delegates for `media` and `network` diagnostic sources. `MediaDiagnosticsDelegate` and `NetworkDiagnosticsDelegate` respectively.

```swift
extension CallObserver: MediaDiagnosticsDelegate {
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeCameraFreezeValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
    
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeSpeakerMutedValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }

  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeCameraStartFailedValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
  
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeSpeakerNotFunctioningValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
  
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeCameraPermissionDeniedValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
  
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeMicrophoneNotFunctioningValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }

  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeMicrophoneMuteUnexpectedlyValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }

  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeCameraStartTimedOutValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
  
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeSpeakerVolumeIsZeroValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
  
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeNoSpeakerDevicesEnumeratedValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
  
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeNoMicrophoneDevicesEnumeratedValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
  
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeSpeakingWhileMicrophoneIsMutedValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
  
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeSpeakerNotFunctioningDeviceInUseValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
  
  func mediaDiagnostics(_ mediaDiagnostics: MediaDiagnostics,
                        didChangeMicrophoneNotFunctioningDeviceInUseValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }
}

extension CallObserver: NetworkDiagnosticsDelegate {
  func networkDiagnostics(_ networkDiagnostics: NetworkDiagnostics,
                          didChangeNoNetworkValue args: FlagDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }

  func networkDiagnostics(_ networkDiagnostics: NetworkDiagnostics,
                          didChangeNetworkReconnectValue args: QualityDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }

  func networkDiagnostics(_ networkDiagnostics: NetworkDiagnostics,
                          didChangeNetworkSendQualityValue args: QualityDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }

  func networkDiagnostics(_ networkDiagnostics: NetworkDiagnostics,
                          didChangeNetworkReceiveQualityValue args: QualityDiagnosticChangedEventArgs) {
    let newValue = args.value
    // Handle the diagnostic event value changed...
  }

  func networkDiagnostics(_ networkDiagnostics: NetworkDiagnostics,
                          didChangeNetworkRelaysNotReachableValue args: FlagDiagnosticChangedEventArgs) {
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

## Get the latest User Facing Diagnostics

- Get the latest diagnostic values that were raised. If we still didn't receive a value for the diagnostic, `nil` or `.unknown` is returned.

```swift
let lastSpeakerNotFunctionValue = self.mediaDiagnostics.latest.speakerNotFunctioning // Boolean?
let lastNetworkRelayNotReachableValue = self.networkDiagnostics.latest.networkRelaysNotReachable // Boolean?
let lastReceiveQualityValue = self.networkDiagnostics.latest.networkReceiveQuality // DiagnosticQuality (.good, .poor, .bad)
// or .unknown if there isn't a diagnostic for this.
```
