---
title: Azure Communication Services Pre-Call Diagnostics
titleSuffix: An Azure Communication Services concept document
description: Overview of Pre-Call Diagnostic APIs
author: ddematheu2
manager: chpalm
services: azure-communication-services

ms.author: dademath
ms.date: 04/01/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Pre-Call Diagnostic

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

The Pre-Call API enables developers to programmatically validate a client’s readiness to join an Azure Communication Services Call. The Pre-Call API can be accessed through the Calling SDK. It runs multiple diagnostics including device, connection, and call quality. 

## Accessing Pre-Call APIs

To Access the Pre-Call API, you will need to initialize a `callClient` and provision an Azure Communication Services access token. Then you can access the `CallDiagnostics` feature and run it.

```javascript

const tokenCredential = new AzureCommunicationTokenCredential(); 
const results = callClient.feature(SDK.Features.CallDiagnostics).run(tokenCredential); 

```

Once it finishes running, developers can access the result object.

## Events for Pre-Call APIs

TBD

## Diagnostic results

The Pre-Call API returns a full diagnostic of the device including details like device permissions, availability and compatibility, call quality stats and in-call diagnostics. 

```javascript

export interface CallDiagnostics { 
    devicePermissions: Promise<DeviceAccess>; 
    deviceEnumeration: Promise<DeviceEnumeration>; 
    deviceCompatibility?: Promise<DeviceCompatibility>; 
    callMediaStatistics: Promise<MediaStatsCallFeature>; 
    call: Promise<InCallDiagnostics>; 
} 

```
