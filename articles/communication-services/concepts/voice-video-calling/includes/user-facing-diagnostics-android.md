---
title: Azure Communication Services User Facing Diagnostics (Android)
titleSuffix: An Azure Communication Services concept document
description: Provides usage samples of the User Facing Diagnostics feature Android Native.
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

```java
DiagnosticsCallFeature diagnosticsCallFeature = call.feature(Features.LOCAL_USER_DIAGNOSTICS);
```

## User Facing Diagnostic events

- Get feature object and add listeners to the diagnostics events.

```java
DiagnosticsCallFeature diagnosticsCallFeature = call.feature(Features.LOCAL_USER_DIAGNOSTICS);

/* NetworkDiagnostic */
FlagDiagnosticChangedListener listener = (FlagDiagnosticChangedEvent args) -> {
  Boolean mediaValue = args.getValue();
  // Handle new value for no network diagnostic.
};

NetworkDiagnostics networkDiagnostics = diagnosticsCallFeature.getNetworkDiagnostics();
networkDiagnostics.addOnNetworkUnreachableChangedListener(listener);

// To remove listener for network quality event
networkDiagnostics.removeOnNetworkUnreachableChangedListener(listener);

// Quality Diagnostics
DiagnosticsCallFeature diagnosticsCallFeature = call.feature(Features.LOCAL_USER_DIAGNOSTICS);
QualityDiagnosticChangedListener listener = (QualityDiagnosticChangedEvent args) -> {
  DiagnosticQuality diagnosticQuality = args.getValue();
  // Handle new value for network reconnect diagnostic.
};

NetworkDiagnostics networkDiagnostics = diagnosticsCallFeature.getNetworkDiagnostics();
networkDiagnostics.addOnNetworkReconnectionQualityChangedListener(listener);

// To remove listener for media flag event
networkDiagnostics.removeOnNetworkReconnectionQualityChangedListener(listener);

/* MediaDiagnostic */
DiagnosticsCallFeature diagnosticsCallFeature = call.feature(Features.LOCAL_USER_DIAGNOSTICS);
FlagDiagnosticChangedListener listener = (FlagDiagnosticChangedEvent args) -> {
  Boolean mediaValue = args.getValue();
  // Handle new value for speaker not functioning diagnostic.
};

MediaDiagnostics mediaDiagnostics = diagnosticsCallFeature.getMedia();
mediaDiagnostics.addOnIsSpeakerNotFunctioningChangedListener(listener);

// To remove listener for media flag event
mediaDiagnostics.removeOnIsSpeakerNotFunctioningChangedListener(listener);

```

## Get the latest User Facing Diagnostics

- Get the latest diagnostic values that were raised in current call. If we still didn't receive a value for the diagnostic, an exception is thrown.

```java
DiagnosticsCallFeature diagnosticsCallFeature = call.feature(Features.LOCAL_USER_DIAGNOSTICS);
NetworkDiagnostics networkDiagnostics = diagnosticsCallFeature.getNetwork();
MediaDiagnostics mediaDiagnostics = diagnosticsCallFeature.getMedia();

NetworkDiagnosticValues latestNetwork = networkDiagnostics.getLatestDiagnostics();
Boolean lastNetworkValue = latestNetwork.isNetworkUnavailable(); // null if there isn't a value for this diagnostic.
DiagnosticQuality lastReceiveQualityValue = latestNetwork.getNetworkReceiveQuality(); //  UNKNOWN if there isn't a value for this diagnostic.

MediaDiagnosticValues latestMedia = networkDiagnostics.getLatestDiagnostics();
Boolean lastSpeakerNotFunctionValue = latestMedia.isSpeakerNotFunctioning(); // null if there isn't a value for this diagnostic.

// Use the last values ...

```
