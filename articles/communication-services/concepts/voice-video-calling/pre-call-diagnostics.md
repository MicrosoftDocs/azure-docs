---
title: Azure Communication Services pre-call diagnostics
titleSuffix: An Azure Communication Services concept document
description: Overview of the pre-call diagnostic API feature.
author: tophpalmer
manager: chpalm
services: azure-communication-services
ms.author: chpalm
ms.date: 04/01/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Pre-call diagnostic overview

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include.md)]

The pre-call API feature enables developers to programmatically validate a client’s readiness to join an Azure Communication Services call. You can only access pre-call features using the Calling SDK. The pre-call diagnostic feature provides multiple diagnostics including device, connection, and call quality. The pre-call diagnostic feature is available only for Web (JavaScript). We plan to enable these capabilities across platforms in the future. Provide us with [feedback](../../support.md) about which platforms you want to see pre-call diagnostics enabled.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) active Long Term Support(LTS) versions are recommended.
- An active Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A User Access Token to instantiate the call client. Learn how to [create and manage user access tokens](../../quickstarts/identity/access-tokens.md). You can also use the Azure CLI and run the next command with your connection string to create a user and an access token. Remember to copy the connection string from the resource through Azure portal.

  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For more information, see [Use Azure CLI to Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md?pivots=platform-azcli).

## Accessing pre-call diagnostics

>[!IMPORTANT]
>Pre-call diagnostics are available starting with version [1.9.1-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.9.1-beta.1) of the Calling SDK. Make sure to use that version or higher when following these instructions.

To Access pre-call diagnostics, you need to initialize a `callClient`, and provision an Azure Communication Services access token. There you can access the `PreCallDiagnostics` feature and the `startTest` method.

```javascript
import { CallClient, Features} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

const callClient = new CallClient(); 
const tokenCredential = new AzureCommunicationTokenCredential("INSERT ACCESS TOKEN");
const preCallDiagnosticsResult = await callClient.feature(Features.PreCallDiagnostics).startTest(tokenCredential);

```

Once it finishes running, developers can access the result object.

## Diagnostic results

Pre-call diagnostics returns a full diagnostic of the device including details like device permissions, availability and compatibility, call quality statistics, and in-call diagnostics. The results are returned as a `PreCallDiagnosticsResult` object. 

```javascript

export declare type PreCallDiagnosticsResult  = {
    deviceAccess: Promise<DeviceAccess>;
    deviceEnumeration: Promise<DeviceEnumeration>;
    inCallDiagnostics: Promise<InCallDiagnostics>;
    browserSupport?: Promise<DeviceCompatibility>;
    id: string;
    callMediaStatistics?: Promise<MediaStatsCallFeature>;
};

```

You can access individual result objects using the `preCallDiagnosticsResult` type. Results for individual tests are returned as they're completed with many of the test results being available immediately. If you use the `inCallDiagnostics` test, the results might take up to 1 minute as the test validates the quality of the video and audio.

### Browser support

Browser compatibility check. Checks for `Browser` and `OS` compatibility and returns a `Supported` or `NotSupported` value. 

```javascript

const browserSupport =  await preCallDiagnosticsResult.browserSupport;
  if(browserSupport) {
    console.log(browserSupport.browser)
    console.log(browserSupport.os)
  }

```

If the test fails and the browser being used by the user is `NotSupported`, the easiest way to fix that is by asking the user to switch to a supported browser. Refer to the supported browsers in [Calling SDK overview > JavaScript Calling SDK support by OS and browser](./calling-sdk-features.md#javascript-calling-sdk-support-by-os-and-browser).

>[!NOTE]
>Known issue: `browser support` test returning `Unknown` in cases where it should be returning a correct value.

### Device access

The permission check determines whether video and audio devices are available from a permissions perspective. Provides `boolean` value for `audio` and `video` devices. 

```javascript

  const deviceAccess =  await preCallDiagnosticsResult.deviceAccess;
  if(deviceAccess) {
    console.log(deviceAccess.audio)
    console.log(deviceAccess.video)
  }

```

If the test fails and the permissions are false for audio and video, the user shouldn't continue into joining a call. Rather, prompt the user to enable the permissions. The best way to do this is by providing the specific instruction on how to access permissions based on the OS, version, and browser they're using. For more information about permissions, see the [Checklist for advanced calling experiences in web browsers](https://techcommunity.microsoft.com/t5/azure-communication-services/checklist-for-advanced-calling-experiences-in-mobile-web/ba-p/3266312).

### Device enumeration

Device availability. Checks whether microphone, camera, and speaker devices are detected in the system and ready to use. Returns an `Available` or `NotAvailable` value.

```javascript

  const deviceEnumeration = await preCallDiagnosticsResult.deviceEnumeration;
  if(deviceEnumeration) {
    console.log(deviceEnumeration.microphone)
    console.log(deviceEnumeration.camera)
    console.log(deviceEnumeration.speaker)
  }

```

If devices aren't available, the user shouldn't continue into joining a call. Rather, prompt the user to check device connections to ensure any headsets, cameras, or speakers are properly connected. For more information about device management, see [Manage video during calls](../../how-tos/calling-sdk/manage-video.md?pivots=platform-web#device-management).

### InCall diagnostics

Performs a quick call to check in-call metrics for audio and video and provides results back. Includes connectivity (`connected`, boolean), bandwidth quality (`bandWidth`, `'Bad' | 'Average' | 'Good'`) and call diagnostics for audio and video (`diagnostics`). Provided diagnostic categories include `jitter`, `packetLoss`, and `rtt` and results are generated using a simple quality grade (`'Bad' | 'Average' | 'Good'`).

InCall diagnostics uses [Media quality statistics](./media-quality-sdk.md) to calculate quality scores and diagnose issues. During the pre-call diagnostic, the full set of media quality statistics are available for consumption. These statistics include raw values across video and audio metrics that you can use programatically.

The InCall diagnostic provides a convenience layer on top of media quality statistics to consume the results without the need to process all the raw data. For more information including instructions to access, see [Media quality statistics for an ongoing call](./media-quality-sdk.md#media-quality-statistics-for-an-ongoing-call).


```javascript

  const inCallDiagnostics =  await preCallDiagnosticsResult.inCallDiagnostics;
  if(inCallDiagnostics) {    
    console.log(inCallDiagnostics.connected)
    console.log(inCallDiagnostics.bandWidth)
    console.log(inCallDiagnostics.diagnostics.audio)
    console.log(inCallDiagnostics.diagnostics.video)
  }

```

At this step, there are multiple possible failure points. The values provided by the API are based on the threshold values required by the service. The raw thresholds can be found in [Media quality statistics](./media-quality-sdk.md#best-practices).

- If a connection fails, prompt users to recheck their network connectivity. Connection failures can also be attributed to network conditions like DNS, proxies, or firewalls. For more information on recommended network setting, see [Network recommendations](network-requirements.md).
- If bandwidth is `Bad`, prompt users to try a different network or verify the bandwidth availability on their current network. Ensure no other high bandwidth activities are taking place.

## Pricing

When the pre-call diagnostic test runs behind the scenes, it uses calling minutes to run the diagnostic. The test lasts for roughly 30 seconds, using up 30 seconds of calling time which is charged at the standard rate of $0.004 per participant per minute. For the case of pre-call diagnostics, the charge is for 1 participant x 30 seconds = $0.002. 

## Next steps

- [Check your network condition with the diagnostics tool](../developer-tools/network-diagnostic.md)
- [Explore User-Facing Diagnostic APIs](../voice-video-calling/user-facing-diagnostics.md)
- [Enable Media Quality Statistics in your application](../voice-video-calling/media-quality-sdk.md)
- [Consume call logs with Azure Monitor](../analytics/logs/voice-and-video-logs.md)
