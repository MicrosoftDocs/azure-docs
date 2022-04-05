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

The Pre-Call API enables developers to programmatically validate a client’s readiness to join an Azure Communication Services Call. The Pre-Call APIs can be accessed through the Calling SDK. They provide multiple diagnostics including device, connection, and call quality. 

## Accessing Pre-Call APIs

To Access the Pre-Call API, you will need to initialize a `callClient` and provision an Azure Communication Services access token. Then you can access the `NetworkTest` feature and run it.

```javascript
import { CallClient, Features} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

const tokenCredential = new AzureCommunicationTokenCredential(); 
const networkTest = await callClient.feature(Features.NetworkTest).beginTest(tokenCredential);

```

Once it finishes running, developers can access the result object.

## Diagnostic results

The Pre-Call API returns a full diagnostic of the device including details like device permissions, availability and compatibility, call quality stats and in-call diagnostics. The results are returned as a `CallDiagnosticsResult` object. 

```javascript

export declare type CallDiagnosticsResult = {
    deviceAccess: Promise<DeviceAccess>;
    deviceEnumeration: Promise<DeviceEnumeration>;
    inCallDiagnostics: Promise<InCallDiagnostics>;
    browserSupport?: Promise<DeviceCompatibility>;
    callMediaStatistics?: Promise<MediaStatsCallFeature>;
};

```

Individual result objects can be accessed as such using the `networkTest` constant above.

### Browser support
Browser compatibility check. Checks for `Browser` and `OS` compatibility and provides a `Supported` or `NotSupported` value back.

```javascript

const browserSupport =  await networkTest.browserSupport;
  if(browserSupport) {
    console.log(browserSupport.browser)
    console.log(browserSupport.os)
  }

```
### Device access
Permission check. Checks whether video and audio devices are available from a permissions perspective. Provides `boolean` value for `audio` and `video` devices.

```javascript

  const deviceAccess =  await networkTest.deviceAccess;
  if(deviceAccess) {
    console.log(deviceAccess.audio)
    console.log(deviceAccess.video)
  }

```

### Device Enumeration
Device availability. Checks whether microphone, camera and speaker devices are detected in the system and ready to use. Provides an `Available` or `NotAvailable` value back.

```javascript

  const deviceEnumeration = await networkTest.deviceEnumeration;
  if(deviceEnumeration) {
    console.log(deviceEnumeration.microphone)
    console.log(deviceEnumeration.camera)
    console.log(deviceEnumeration.speaker)
  }

```

### InCall diagnostics
Performs a quick call to check in-call metrics for audio and video and provides results back. Includes connectivity (`connected`, boolean), bandwidth quality (`bandWidth`, `'Bad' | 'Average' | 'Good'`) and call diagnostics for audio and video (`diagnostics`). Diagnostic are provided `jitter`, `packetLoss` and `rtt` and results are generated using a simple quality grade (`'Bad' | 'Average' | 'Good'`).

```javascript

  const inCallDiagnostics =  await networkTest.inCallDiagnostics;
  if(inCallDiagnostics) {    
    console.log(inCallDiagnostics.connected)
    console.log(inCallDiagnostics.bandWidth)
    console.log(inCallDiagnostics.diagnostics.audio)
    console.log(inCallDiagnostics.diagnostics.video)
  }

```

### Media stats
For granular stats on quality metrics like jitter, packet loss, rtt, etc. `callMediaStatistics` are provided as part of the `NetworkTest` feature. You can subscribe to the call media stats to get full collection of them.

## Pricing

When the Pre-Call diagnostic test runs, behind the scenes it uses calling minutes to run the diagnostic. The test lasts for roughly 1 minute, using up 1 minute of calling which is charged at the standard rate of $0.004 per participant per minute. For the case of Pre-Call diagnostic, the charge will be for 1 participant x 1 minutes = $0.004. 

## Feedback

This feature is currently in private preview. Please provide feedback on the API design, capabilities and pricing. Feedback is key for the team to move forward and push the feature into public preview and general availability. 
