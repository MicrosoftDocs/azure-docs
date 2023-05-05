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
DiagnosticsCallFeature diagnosticsCallFeature = call.feature(Features.DIAGNOSTICS_CALL);
```

## User Facing Diagnostic events

- Get feature object and add listeners to the diagnostics events.

```java
DiagnosticsCallFeature diagnosticsCallFeature = call.feature(Features.DIAGNOSTICS_CALL);

/* NetworkDiagnostic */
FlagDiagnosticChangedListener listener = (FlagDiagnosticChangedEvent args) -> {
  Boolean mediaValue = args.getValue();
  // Handle new value for no network diagnostic.
};

NetworkDiagnostics networkDiagnostics = diagnosticsCallFeature.getNetworkDiagnostics();
networkDiagnostics.addOnNoNetworkChangedListener(listener);

// To remove listener for network quality event
networkDiagnostics.removeOnNoNetworkChangedListener(listener);

// Quality Diagnostics
DiagnosticsCallFeature diagnosticsCallFeature = call.feature(Features.DIAGNOSTICS_CALL);
QualityDiagnosticChangedListener listener = (QualityDiagnosticChangedEvent args) -> {
  DiagnosticQuality diagnosticQuality = args.getValue();
  // Handle new value for network reconnect diagnostic.
};

NetworkDiagnostics networkDiagnostics = diagnosticsCallFeature.getNetworkDiagnostics();
networkDiagnostics.addOnNetworkReconnectChangedListener(listener);

// To remove listener for media flag event
networkDiagnostics.removeOnNetworkReconnectChangedListener(listener);

/* MediaDiagnostic */
DiagnosticsCallFeature diagnosticsCallFeature = call.feature(Features.DIAGNOSTICS_CALL);
FlagDiagnosticChangedListener listener = (FlagDiagnosticChangedEvent args) -> {
  Boolean mediaValue = args.getValue();
  // Handle new value for speaker not functioning diagnostic.
};

MediaDiagnostics mediaDiagnostics = diagnosticsCallFeature.getMedia();
mediaDiagnostics.addOnSpeakerNotFunctioningChangedListener(listener);

// To remove listener for media flag event
mediaDiagnostics.removeOnSpeakerNotFunctioningChangedListener(listener);

```

## Get the latest User Facing Diagnostics

- Get the latest diagnostic values that were raised in current call. If we still didn't receive a value for the diagnostic, an exception is thrown.

```java
DiagnosticsCallFeature diagnosticsCallFeature = call.feature(Features.DIAGNOSTICS_CALL);
NetworkDiagnostics networkDiagnostics = diagnosticsCallFeature.getNetwork();
MediaDiagnostics mediaDiagnostics = diagnosticsCallFeature.getMedia();

NetworkDiagnosticValues latestNetwork = networkDiagnostics.getLatest();
Boolean lastNetworkValue = latestNetwork.isNoNetwork(); // null if there isn't a value for this diagnostic.
DiagnosticQuality lastReceiveQualityValue = latestNetwork.getNetworkReceiveQuality(); //  UNKNOWN if there isn't a value for this diagnostic.

MediaDiagnosticValues latestMedia = networkDiagnostics.getLatest();
Boolean lastSpeakerNotFunctionValue = latestMedia.isSpeakerNotFunctioning(); // null if there isn't a value for this diagnostic.

// Use the last values ...

```
