---
title: Developer Tools - Real-Time Inspection for Azure Communication Services
description: Conceptual documentation outlining the capabilities provided by the Real-Time Inspection tool.
author: ddematheu2
manager: chpalm
services: azure-communication-services

ms.author: dademath
ms.date: 03/29/2022
ms.topic: conceptual
ms.service: azure-communication-services
---

# Real-time Inspection Tool for Azure Communication Services

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

The Real-time Inspection Tool enables Azure Communication Services developers to inspect the state of the `Call` to debug or monitor their solution. For developers building an Azure Communication Services solution, they might need visibility for debugging into general call information such as the `Call ID` or advanced states, such as did a user facing diagnostic fire. The Real-time Inspection Tool provides developers this information and more. It can be easily added to any JavaScript (Web) solution by downloading the npm package `azure/communication-tools`.

>[!NOTE]
>Find the open-source repository for the tool [here](https://github.com/Azure/communication-inspection).

## Capabilities

The Real-time Inspection Tool provides developers three categories of information that can be used for debugging purposes:

| Category                       | Descriptions                      |
|--------------------------------|-----------------------------------|
| General Call Information       | Includes call id, participants, devices and user agent information (browser, version, etc.) |
| Media Quality Stats            | Metrics and statistics provided by [Media Quality APIs](../voice-video-calling/media-quality-sdk.md). Metrics are clickable for time series view.|
| User Facing Diagnostics        | List of [user facing diagnostics](../voice-video-calling/user-facing-diagnostics.md).|

Data collected by the tool is only kept locally and temporarily. It can be downloaded from within the interface. 

Real-time Inspection Tool is compatible with the same browsers as the Calling SDK [here](../voice-video-calling/calling-sdk-features.md?msclkid=f9cf66e6a6de11ec977ae3f6d266ba8d#javascript-calling-sdk-support-by-os-and-browser).

## Get started with Real-time Inspection Tool

The tool can be accessed through an npm package `azure/communication-inspection`. The package contains the `InspectionTool` object that can be attached to a `Call`. The Call Inspector requires an `HTMLDivElement` as part of its constructor on which it will be rendered. The `HTMLDivElement` will dictate the size of the Call Inspector.

### Installing Real-time Inspection Tool

```bash
npm i  @azure/communication-inspection
```

### Initialize Real-time Inspection Tool

```javascript
import { CallClient, CallAgent } from "@azure/communication-calling";
import { InspectionTool } from "@azure/communication-tools";

const callClient = new callClient();
const callAgent = await callClient.createCallAgent({INSERT TOKEN CREDENTIAL});
const call = callAgent.startCall({INSERT CALL INFORMATION});

const inspectionTool =  new InspectionTool(call, {HTMLDivElement});

```
## Usage

`start`: enable the `InspectionTool` to start reading data from the call object and storing it locally for visualization.

```javascript

inspectionTool.start()

```

`stop`: disable the `InspectionTool` from reading data from the call object.

```javascript

inspectionTool.stop()

```

`open`: Open the `InspectionTool` in the UI.

```javascript

inspectionTool.open()

```

`close`: Dismiss the `InspectionTool` in the UI.

```javascript

inspectionTool.close()

```

## Next Steps

- [Explore User-Facing Diagnostic APIs](../voice-video-calling/user-facing-diagnostics.md)
- [Enable Media Quality Statistics in your application](../voice-video-calling/media-quality-sdk.md)
- [Leverage Network Diagnostic Tool](./network-diagnostic.md)
- [Consume call logs with Azure Monitor](../analytics/call-logs-azure-monitor.md)
