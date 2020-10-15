---
title: Defender for IoT frequently asked questions
description: Find answers to the most frequently asked questions about Azure Defender for IoT features and service.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''


ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/07/2020
ms.author: rkarlin
---

# Azure Defender for IoT frequently asked questions

This article provides a list of frequently asked questions and answers about Defender for IoT.

## What is Azure's unique value proposition for IoT security?

Defender for IoT enables enterprises to extend their existing cyber security view to their entire IoT solution. Azure provides an end to end view of your business solution, enabling you to take business-related actions and decisions based on your enterprise security posture and collected data. Combined security using Azure IoT, Azure IoT Edge, and Azure Security Center enable you to create the solution you want with the security you need.

## Our organization uses proprietary non-standard industrial protocols. Are they supported? 

Azure Defender for IoT provides comprehensive protocol support. In addition to embedded protocol support, you can secure IoT and OT devices running proprietary and custom protocols, or protocols that deviate from any standard. Using the Horizon Open Development Environment (ODE) SDK, developers can create dissector plugins that decode network traffic based on defined protocols. Traffic is analyzed by services to provide complete monitoring, alerting, and reporting. Use Horizon to:
- Expand visibility and control without the need to upgrade to new versions.
- Secure proprietary information by developing on-site as an external plugin. 
- Localize text for alerts, events, and protocol parameters.

This unique solution for developing protocols as plugins, does not require dedicated developer teams or version releases in order to support a new protocol. Developers, partners, and customers can securely develop protocols and share insights and knowledge using Horizon. 

## Do I have to purchase hardware appliances from Microsoft partners?
Azure Defender for IoT sensor runs on specific hardware specs as described in the [Hardware Specifications Guide](https://aka.ms/AzureDefenderforIoTBareMetalAppliance), customers can purchase certified hardware from Microsoft partners or use the supplied bill of materials  (BOM) and purchase it on their own. 

Certified hardware has been tested in our labs for driver stability, packet drops and network sizing.


## Regulation does not allow us to connect our system to the Internet. Can we still utilize Defender for IoT?

Yes you can! The Azure Defender for IoT platform on-premises solution is deployed as a physical or virtual sensor appliance that passively ingests network traffic (via SPAN, RSPAN, or TAP) to analyze, discover, and continuously monitor IT, OT, and IoT networks. For larger enterprises, multiple sensors can aggregate their data to an on-premises management console.

## Where in the network should I connect monitoring ports?

The Azure Defender for IoT sensor connects to a SPAN port or network TAP and immediately begins collecting ICS network traffic via passive (agentless) monitoring. It has zero impact on OT networks since it isn’t placed in the data path and doesn’t actively scan OT devices.

For example:
- A single appliance (virtual of physical) can be in the Shop Floor DMZ layer, having all Shop Floor cell traffic routed to this layer.
- Alternatively, locate small mini-sensors in each Shop Floor cell with either cloud or local management that will reside in the Shop Floor DMZ layer. Another appliance (virtual or physical) can monitor the traffic in the Shop Floor DMZ layer (for SCADA, Historian, or MES).

## How does Defender for IoT compare to the competition?

While other solutions provide a set of capabilities that allow customers to create their own solutions, Defender for IoT provides a unique end-to-end IoT security solution that provides a wide view across the security of all of your related Azure resources. Azure enables fast deployment and full integration with IoT Hub module twins for easy integration with existing device management tools.


## Do I have to be an Azure IoT customer?

Yes. For cloud connected deployments, Azure Defender for IoT relies on Azure IoT connectivity and infrastructure.
## Can I create my own alerts?

Yes. You can set a customized alert on pre-determined set of behaviors such as IP address and open ports. See [Create custom alerts](quickstart-create-custom-alerts.md) to learn more about custom alerts and how to make them.

## Where can I see logs? Can I customize logs?

- View alerts and recommendations using your connected Log Analytics workspace. Configure storage size and duration in the workspace.

- Raw data from your security agent can also be stored in your Log Analytics account. Consider size, duration, storage requirements, and associated costs before changing the configuration of this option.



## What happens when the internet connection stops working?

The sensors and agents continue to run and store data as long as the device is running. Data is stored in the security message cache according to size configuration. When the device regains connectivity, security messages resume sending.





## Next steps

To learn more about how to get started with Defender for IoT, see the following articles:

- Read the Defender for IoT [overview](overview.md)
- Verify the [Service prerequisites](service-prerequisites.md)
- Learn more about how to [Get started](getting-started.md)
- Understand [Defender for IoT security alerts](concept-security-alerts.md)
