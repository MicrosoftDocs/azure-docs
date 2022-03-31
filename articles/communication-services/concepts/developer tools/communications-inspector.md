---
title: Developer Tools - Communications Inspector
description: Conceptual documentation outlining the capabilities provided by the communications inspector.
author: ddematheu2
manager: chpalm
services: azure-communication-services

ms.author: dademath
ms.date: 03/29/2022
ms.topic: conceptual
ms.service: azure-communication-services
---

# Communications Inspector

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

The Communications Inspector enables Azure Communication Services developers to inspect the state of the call client to debug or monitor their solution. Many times, when building a solution developers might need visibility into general information like the call id or advanced state like did a user facing diagnostic fire. The communication inspector provides developers this information and more. It can be easily added to any JavaScript (Web) solution by downloading the npm package `azure/communication-tools`.

>[!NOTE]
>Find the open-soure repository for the tool [here](ADD LINK).

## Capabilities

The Communications Inspector provides developers three categories of information that can be used for debugging purposes:

| Category                       | Descriptions                      |
|--------------------------------|-----------------------------------|
| General Call Information       | Includes call id, participants, devices and user agent information (browser, version, etc.) |
| Media Quality Stats            | Metrics and statistics provided by [Media Quality APIs](./voice-video-calling/media-quality-sdk). Metrics are clickable for timeseries view.|
| User Facing Diagnostics        | List of [user facing diagnostics](./voice-video-calling/user-facing-diagnostics).|

Data collected by the tool is only kept locally and temporarily. It can be downloaded from within the interface. 

Communications Inspector is compatible with the same browsers as the Calling SDK [here](./voice-video-calling/calling-sdk-features?msclkid=f9cf66e6a6de11ec977ae3f6d266ba8d#javascript-calling-sdk-support-by-os-and-browser).

## Using the Communications Inspector

The tool can be accessed through an npm package `azure/communication-tools`. There developers can find the `CommunicationsInspector` object that can be attached to a `Call`.

CommunicationsInspector(call:Call);

CommunicationsInspector.start()

CommunicationsInspector.stop()

CommunicationsInspector.open()

CommunicationsInspector.close()
