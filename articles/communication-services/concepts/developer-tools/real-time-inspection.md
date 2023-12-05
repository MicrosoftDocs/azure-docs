---
title: Developer Tools - Azure Communication Services Communication Monitoring
description: Conceptual documentation outlining the capabilities provided by the Communication Monitoring tool.
author: tophpalmer
manager: chpalm
services: azure-communication-services
ms.author: chpalm
ms.date: 03/29/2022
ms.topic: conceptual
ms.service: azure-communication-services
---

# Azure Communication Services communication monitoring

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

The Azure Communication Services communication monitoring tool enables developers to inspect the state of the `Call` to debug or monitor their solution. For developers building an Azure Communication Services solution, they might need visibility for debugging into general call information such as the `Call ID` or advanced states, such as did a user facing diagnostic fire. The communication monitoring tool provides developers this information and more. It can be easily added to any JavaScript (Web) solution by downloading the npm package `@azure/communication-monitoring`.

>[!NOTE]
>Find the open-source repository for the tool [here](https://github.com/Azure/communication-monitoring).

## Capabilities

The Communication Monitoring tool provides developers three categories of information that can be used for debugging purposes:

| Category                       | Descriptions                      |
|--------------------------------|-----------------------------------|
| General Call Information       | Includes call id, participants, devices and user agent information (browser, version, etc.) |
| Media Quality Stats            | Metrics and statistics provided by [Media Quality APIs](../voice-video-calling/media-quality-sdk.md). Metrics are clickable for time series view.|
| User Facing Diagnostics        | List of [user facing diagnostics](../voice-video-calling/user-facing-diagnostics.md).|

Data collected by the tool is only kept locally and temporarily. It can be downloaded from within the interface. 

Communication Monitoring is compatible with the same browsers as the Calling SDK [here](../voice-video-calling/calling-sdk-features.md?msclkid=f9cf66e6a6de11ec977ae3f6d266ba8d#javascript-calling-sdk-support-by-os-and-browser).

## Get started with Communication Monitoring

The tool can be accessed through an npm package `@azure/communication-monitoring`. The package contains the `CommunicationMonitoring` object that can be attached to a `Call`. Instructions on how to initialize the required `CallClient` and `CallAgent` objects can be found [here](../../how-tos/calling-sdk/manage-calls.md?pivots=platform-web#initialize-required-objects). `CommunicationMonitoring` also requires an `HTMLDivElement` as part of its constructor on which it will be rendered. The `HTMLDivElement` will dictate the size of the rendered panel.

### Installing Communication Monitoring

```bash
npm i  @azure/communication-monitoring
```

### Initialize Communication Monitoring

```javascript
import { CallAgent, CallClient } from '@azure/communication-calling'
import { CommunicationMonitoring } from '@azure/communication-monitoring'

const selectedDiv = document.getElementById('selectedDiv')

const options = {
  callClient = {INSERT CALL CLIENT OBJECT},
  callAgent = {INSERT CALL AGENT OBJECT},
  divElement = selectedDiv,
}

const communicationMonitoring = new CommunicationMonitoring(options)

```
## Usage

`start`: enable the `CommunicationMonitoring` instance to start reading data from the call object and storing it locally for visualization.

```javascript

communicationMonitoring.start()

```

`stop`: disable the `CommunicationMonitoring` instance from reading data from the call object.

```javascript

communicationMonitoring.stop()

```

`open`: Open the `CommunicationMonitoring` instance in the UI.

```javascript

communicationMonitoring.open()

```

`close`: Dismiss the `CommunicationMonitoring` instance in the UI.

```javascript

communicationMonitoring.close()

```

## Download logs

The tool includes the ability to download the logs captured using the `Download logs` button on the top right. The tool will generate a compressed log file that can be provided to our customer support team for debugging.

## Next Steps

- [Explore User-Facing Diagnostic APIs](../voice-video-calling/user-facing-diagnostics.md)
- [Enable Media Quality Statistics in your application](../voice-video-calling/media-quality-sdk.md)
- [Leverage Network Diagnostic Tool](./network-diagnostic.md)
- [Consume call logs with Azure Monitor](../analytics/logs/voice-and-video-logs.md)