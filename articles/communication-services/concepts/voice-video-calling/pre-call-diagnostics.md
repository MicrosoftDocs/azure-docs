---
title: Azure Communication Services Pre-Call diagnostics
titleSuffix: An Azure Communication Services concept document
description: Overview of Pre-Call Diagnostic APIs
author: tophpalmer
manager: chpalm
services: azure-communication-services
ms.author: chpalm
ms.date: 04/01/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Pre-Call diagnostic

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include.md)]

The Pre-Call API enables developers to programmatically validate a client’s readiness to join an Azure Communication Services Call. The Pre-Call APIs can be accessed through the Calling SDK. They provide multiple diagnostics including device, connection, and call quality. Pre-Call APIs are available only for Web (JavaScript). We'll be enabling these capabilities across platforms in the future,  provide us with feedback on what platforms you would like to see Pre-Call APIs on.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) active Long Term Support(LTS) versions are recommended.
- An active Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A User Access Token to instantiate the call client. Learn how to [create and manage user access tokens](../../quickstarts/identity/access-tokens.md). You can also use the Azure CLI and run the next command with your connection string to create a user and an access token. (Need to grab connection string from the resource through Azure portal.)

  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md?pivots=platform-azcli).

## Accessing Pre-Call APIs

>[!IMPORTANT]
>Pre-Call diagnostics are available starting on the version [1.9.1-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.9.1-beta.1) of the Calling SDK. Make sure to use that version when trying the next instructions.

To Access the Pre-Call API, you need to initialize a `callClient`, and provision an Azure Communication Services access token. There you can access the `PreCallDiagnostics` feature and the `startTest` method.

```javascript
import { CallClient, Features} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

const callClient = new CallClient(); 
const tokenCredential = new AzureCommunicationTokenCredential("INSERT ACCESS TOKEN");
const preCallDiagnosticsResult = await callClient.feature(Features.PreCallDiagnostics).startTest(tokenCredential);

```

Once it finishes running, developers can access the result object.

## Diagnostic results

The Pre-Call API returns a full diagnostic of the device including details like device permissions, availability and compatibility, call quality stats and in-call diagnostics. The results are returned as a `PreCallDiagnosticsResult` object. 

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

Individual result objects can be accessed as such using the `preCallDiagnosticsResult` constant. Results for individual tests be returned as they're completed with many of the test results being available immediately. If you use the `inCallDiagnostics` test, the results might take up to 1 minute as the test validates quality of the video and audio.

### Browser support
Browser compatibility check. Checks for `Browser` and `OS` compatibility and provides a `Supported` or `NotSupported` value back. 

```javascript

const browserSupport =  await preCallDiagnosticsResult.browserSupport;
  if(browserSupport) {
    console.log(browserSupport.browser)
    console.log(browserSupport.os)
  }

```

In the case that the test fails and the browser being used by the user is `NotSupported`, the easiest way to fix that is by asking the user to switch to a supported browser. Refer to the supported browsers in our [documentation](./calling-sdk-features.md#javascript-calling-sdk-support-by-os-and-browser).

>[!NOTE]
>Known issue: `browser support` test returning `Unknown` in cases where it should be returning a correct value.

### Device access
Permission check. Checks whether video and audio devices are available from a permissions perspective. Provides `boolean` value for `audio` and `video` devices. 

```javascript

  const deviceAccess =  await preCallDiagnosticsResult.deviceAccess;
  if(deviceAccess) {
    console.log(deviceAccess.audio)
    console.log(deviceAccess.video)
  }

```

In the case that the test fails and the permissions are false for audio and video, the user shouldn't continue into joining a call. Rather you need to prompt the user to enable the permissions. To do it, the best way is provided the specific instruction on how to access permission access based on the OS, version and browser they are on. For more information on permissions, check out our [recommendations](https://techcommunity.microsoft.com/t5/azure-communication-services/checklist-for-advanced-calling-experiences-in-mobile-web/ba-p/3266312).

### Device enumeration
Device availability. Checks whether microphone, camera and speaker devices are detected in the system and ready to use. Provides an `Available` or `NotAvailable` value back.

```javascript

  const deviceEnumeration = await preCallDiagnosticsResult.deviceEnumeration;
  if(deviceEnumeration) {
    console.log(deviceEnumeration.microphone)
    console.log(deviceEnumeration.camera)
    console.log(deviceEnumeration.speaker)
  }

```

In the case that devices aren't available, the user shouldn't continue into joining a call. Rather the user should be prompted to check device connections to ensure any headsets, cameras or speakers are properly connected. For more information on device management, check out our [documentation](../../how-tos/calling-sdk/manage-video.md?pivots=platform-web#device-management)

### InCall diagnostics
Performs a quick call to check in-call metrics for audio and video and provides results back. Includes connectivity (`connected`, boolean), bandwidth quality (`bandWidth`, `'Bad' | 'Average' | 'Good'`) and call diagnostics for audio and video (`diagnostics`). Diagnostic are provided `jitter`, `packetLoss` and `rtt` and results are generated using a simple quality grade (`'Bad' | 'Average' | 'Good'`).

InCall diagnostics uses [media quality stats](./media-quality-sdk.md) to calculate quality scores and diagnose issues. During the pre-call diagnostic, the full set of media quality stats are available for consumption. These stats include raw values across video and audio metrics that can be used programatically. The InCall diagnostic provides a convenience layer on top of media quality stats to consume the results without the need to process all the raw data. See section on media stats for instructions to access.


```javascript

  const inCallDiagnostics =  await preCallDiagnosticsResult.inCallDiagnostics;
  if(inCallDiagnostics) {    
    console.log(inCallDiagnostics.connected)
    console.log(inCallDiagnostics.bandWidth)
    console.log(inCallDiagnostics.diagnostics.audio)
    console.log(inCallDiagnostics.diagnostics.video)
  }

```

At this step, there are multiple failure points to watch out for. The values provided by the API are based on the threshold values required by the service. Those raw thresholds can be found in our [media quality stats documentation](./media-quality-sdk.md#best-practices).

- If connection fails, the user should be prompted to recheck their network connectivity. Connection failures can also be attributed to network conditions like DNS, Proxies or Firewalls. For more information on recommended network setting, check out our [documentation](network-requirements.md).
- If bandwidth is `Bad`, the user should be prompted to try out a different network or verify the bandwidth availability on their current one. Ensure no other high bandwidth activities might be taking place.

### Media stats
For granular stats on quality metrics like jitter, packet loss, rtt, etc. `callMediaStatistics` are provided as part of the `preCallDiagnosticsResult` feature.  See the [full list and description of the available metrics](./media-quality-sdk.md) in the linked article.  You can subscribe to the call media stats to get full collection of them. This stat is the raw metrics that are used to calculate InCall diagnostic results and which can be consumed granularly for further analysis.

```javascript

const mediaStatsCollector = callMediaStatistics.startCollector(); 

mediaStatsCollector.on('mediaStatsEmitted', (mediaStats: SDK.MediaStats) => { 
    // process the stats for the call. 
    console.log(mediaStats);
});

```

## Pricing

When the Pre-Call diagnostic test runs, behind the scenes it uses calling minutes to run the diagnostic. The test lasts for roughly 30 seconds, using up 30 seconds of calling which is charged at the standard rate of $0.004 per participant per minute. For the case of Pre-Call diagnostic, the charge will be for 1 participant x 30 seconds = $0.002. 

## Next steps

- [Check your network condition with the diagnostics tool](../developer-tools/network-diagnostic.md)
- [Explore User-Facing Diagnostic APIs](../voice-video-calling/user-facing-diagnostics.md)
- [Enable Media Quality Statistics in your application](../voice-video-calling/media-quality-sdk.md)
- [Consume call logs with Azure Monitor](../analytics/logs/voice-and-video-logs.md)
