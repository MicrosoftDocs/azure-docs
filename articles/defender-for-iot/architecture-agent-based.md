---
title: Agent-based solution architecture 
description: Learn about Azure Defender for IoT agent-based architecture and information flow.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: shhazam-ms
manager: rkarlin
editor: ''

ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 1/25/2021
ms.author: shhazam
---

# Agent-based solution for device builders

This article describes the functional system architecture of the Defender for IoT agent-based solution. Azure Defender for IoT offers two sets of capabilities to fit your environment's needs, agentless solution for organizations, and agent-based solution for device builders.

## IoT hub built-in security

Defender for IoT is enabled by default in every new IoT Hub that is created. Defender for IoT provides real-time monitoring, recommendations, and alerts, without requiring agent installation on any devices and uses advanced analytics on logged IoT Hub meta data to analyze and protect your field devices and IoT hubs. 

## Defender for IoT micro agent 

Defender for IoT micro agent provides depth security protection and visibility into device behavior. collects, aggregates, and analyze raw security events from your devices. Raw security events can include IP connections, process creation, user logins, and other security-relevant information. Defender for IoT device agents also handles event aggregation to help avoid high network throughput. The agents are highly customizable, allowing you to use them for specific tasks, such as sending only important information at the fastest SLA, or for aggregating extensive security information and context into larger segments, avoiding higher service costs.

Device agents, and other applications use the **Azure send security message SDK** to send security information into Azure IoT hub. IoT hub gets this information and forwards it to the Defender for IoT service.

Once the Defender for IoT service is enabled, in addition to the forwarded data, IoT hub also sends out all of its internal data for analysis by Defender for IoT. This data includes device-cloud operation logs, device identities, and hub configuration. All of this information helps to create the Defender for IoT analytics pipeline.

Defender for IoT analytics pipeline also receives other threat intelligence streams from various sources within Microsoft and Microsoft partners. The Defender for IoT entire analytics pipeline works with every customer configuration made on the service (such as custom alerts and use of the send security message SDK).

Using the analytics pipeline, Defender for IoT combines all of the streams of information to generate actionable recommendations and alerts. The pipeline contains both custom rules created by security researchers and experts as well as   machine learning models searching for deviation from standard device behavior and risk analysis.

Defender for IoT recommendations and alerts (analytics pipeline output) is written to the Log Analytics workspace of each customer. Including the raw events in the workspace and the alerts and recommendations enables deep dive investigations and queries using the exact details of the suspicious activities detected.

:::image type="content" source="media/architecture/micro-agent-architecture.png" alt-text="The micro agent architecture.":::

## See also

[Defender for IoT FAQ](resources-frequently-asked-questions.md)

[System prerequisites](quickstart-system-prerequisites.md)
