---
title: Understanding ATP for IoT solution architecture Preview| Microsoft Docs
description: Learn about the flow of information in the ATP for IoT service.
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 2cf6a49b-5d35-491f-abc3-63ec24eb4bc2
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2019
ms.author: mlottner

---
# ATP for IoT architecture

This article explains the functional system architecture of the Azure Security Center for IoT solution. 

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## ATP for IoT components

ATP for IoT is composed of the following components:
- Device agents
- Send security message SDK
- IoT Hub integration
- Analytics pipeline
 
### ATP for IoT workflow

ATP for IoT device agents enables you to easily collect raw security events from your devices. Raw security events can include IP connections, process creation, user logins, and other security-relevant information. ATP for IoT device agents also handle event aggregation to help avoid high network throughput. The agents are highly customizable, allowing you to use them for specific tasks, such as sending only important information at the fastest SLA, or for aggregating extensive security information and context into larger segments, avoiding higher service costs.
 
Device agents, and other applications use the **Azure ATP send security message SDK** to send security information into Azure IoT Hub. IoT Hub picks up this information and forwards it to the ATP for IoT service.

Once the ATP for IoT service is enabled, in addition to the forwarded data, IoT Hub also sends out all of its internal data for analysis by ATP for IoT. This data includes device-cloud operation logs, device identities, and Hub configuration. All of this information helps to create the ATP for IoT analytics pipeline.
 
ATP for IoT analytics pipeline also receives additional threat intelligence streams from various sources within Microsoft and Microsoft partners. The ATP for IoT entire analytics pipeline works with every customer configuration made on the service (such as custom alerts and use of the send security message SDK).
 
Using the analytics pipeline, ATP for IoT combines all of the streams of information to generate actionable recommendations and alerts. The pipeline contains both custom rules created by security researchers and experts as well as   machine learning models searching for deviation from standard device behavior and risk analysis.
 
ATP for IoT recommendations and alerts (analytics pipeline output) is written to the Log Analytics workspace of each customer. Including the raw events in the workspace as well as the alerts and recommendations enables deep dive investigations and queries using the exact details of the suspicious activities detected.  

## Next steps
In this article, you learned about the basic architecture and workflow of ATP for IoT solution. To learn more about prerequisites, how to get started and enable your security solution in IoT Hub, see the following articles:

- [Service prerequisites](service-prerequisites.md)
- [Getting started](quickstart-getting-started.md)
- [Configure your solution](quickstart-configure-your-solution.md)
- [Enable security in IoT Hub](quickstart-onboard-iot-hub.md)
- [ATP for IoT FAQ](resources-frequently-asked-questions.md)
- [ATP for IoT security alerts](concept-security-alerts.md)

