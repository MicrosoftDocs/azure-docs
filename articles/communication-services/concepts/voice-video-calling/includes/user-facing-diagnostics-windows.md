---
title: Azure Communication Services User Facing Diagnostics (Windows)
titleSuffix: An Azure Communication Services concept document
description: Provides usage samples of the User Facing Diagnostics feature for Windows Native.
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

```csharp
this.diagnosticsCallFeature = call.Features.LocalUserDiagnostics;
```

## User Facing Diagnostic events

- Implement listeners for diagnostic events.

```csharp
private async void Call__OnNetworkUnavailableChanged(object sender, FlagDiagnosticChangedEventArgs args)
{
  var value = args.Value;
  // Handle the diagnostic event value changed...
}

// Listen to other network diagnostics

private async void Call__OnMediaSpeakerNotFunctioningChanged(object sender, FlagDiagnosticChangedEventArgs args)
{
  var value = args.Value;
  // Handle the diagnostic event value changed...
}

// Listen to other media diagnostics
```

- Set event methods for listening to events.

```csharp
this.diagnosticsCallFeature = call.Features.LocalUserDiagnostics;
this.networkDiagnostics = diagnosticsCallFeature.Network;
this.mediaDiagnostics = diagnosticsCallFeature.Media;

this.networkDiagnostics.NetworkUnavailableChanged += Call__OnNetworkUnavailableChanged;
// Listen to other network events as well ... 

this.mediaDiagnostics.SpeakerNotFunctioningChanged += Call__OnMediaSpeakerNotFunctioningChanged;
// Listen to other media events as well ... 

// Removing listeners

this.networkDiagnostics.NetworkUnavailable -= Call__NetworkUnavailableChanged;
// Remove the other listeners as well ... 

this.mediaDiagnostics.SpeakerNotFunctioningChanged -= Call__OnMediaSpeakerNotFunctioningChanged;
// Remove the other listeners as well ... 

```

## Get the latest User Facing Diagnostics

- Get the latest diagnostic values that were raised in current call. If we still didn't receive a value for the diagnostic, `null` or `.unknown` for is returned.

```csharp
this.diagnosticsCallFeature = call.Features.LocalUserDiagnostics;
this.networkDiagnostics = diagnosticsCallFeature.Network;
this.mediaDiagnostics = diagnosticsCallFeature.Media;

bool? lastSpeakerNotFunctionValue = this.mediaDiagnostics.GetLatestDiagnostics().IsSpeakerNotFunctioning; // Boolean?
bool? lastNetworkRelayNotReachableValue = this.networkDiagnostics.GetLatestDiagnostics().IsNetworkRelaysUnreachable; // Boolean?
DiagnosticQuality lastReceiveQualityValue = this.networkDiagnostics.GetLatestDiagnostics().NetworkReceiveQuality; // DiagnosticQuality (.good, .poor, .bad)
// or .unknown if there isn't a diagnostic for this.

```
