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
ms.date: 03/02/2021
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
Azure Defender for IoT sensor runs on specific hardware specs as described in the [Hardware Specifications Guide](./how-to-identify-required-appliances.md), customers can purchase certified hardware from Microsoft partners or use the supplied bill of materials  (BOM) and purchase it on their own. 

Certified hardware has been tested in our labs for driver stability, packet drops and network sizing.


## Regulation does not allow us to connect our system to the Internet. Can we still utilize Defender for IoT?

Yes you can! The Azure Defender for IoT platform on-premises solution is deployed as a physical or virtual sensor appliance that passively ingests network traffic (via SPAN, RSPAN, or TAP) to analyze, discover, and continuously monitor IT, OT, and IoT networks. For larger enterprises, multiple sensors can aggregate their data to an on-premises management console.

## Where in the network should I connect monitoring ports?

The Azure Defender for IoT sensor connects to a SPAN port or network TAP and immediately begins collecting ICS network traffic via passive (agentless) monitoring. It has zero impact on OT networks since it isn’t placed in the data path and doesn’t actively scan OT devices.

For example:
- A single appliance (virtual of physical) can be in the Shop Floor DMZ layer, having all Shop Floor cell traffic routed to this layer.
- Alternatively, locate small mini-sensors in each Shop Floor cell with either cloud or local management that will reside in the Shop Floor DMZ layer. Another appliance (virtual or physical) can monitor the traffic in the Shop Floor DMZ layer (for SCADA, Historian, or MES).

## How does Defender for IoT compare to the competition?

Azure Defender for IoT delivers comprehensive security across all your IoT/OT devices. For **end-user organizations**, Azure Defender for IoT offers agentless, network-layer security that is rapidly deployed, works with diverse proprietary OT equipment and legacy Windows systems, and interoperates with Azure Sentinel and other SOC tools. It can be deployed on-premises or in Azure-connected environments. For **IoT device builders**, Azure Defender for IoT offers lightweight agents to embed device-layer security into new IoT/OT initiatives.

## Do I have to be an Azure customer?

No, for the agentless version of Azure Defender for IoT, you do not need to be an Azure customer. However, if you want to send alerts to Azure Sentinel; provision network sensors and monitor their health from the cloud; and benefit from automatic software and threat intelligence updates, you will need to connect the sensor to Azure via Azure IoT Hub.

For the agent-based version of Azure Defender for IoT, you must be an Azure customer.

## Can I create my own alerts?

Yes, you can create custom alerts based on multiple parameters including IP/MAC address, protocol type, class, service, function, command, etc. as well as values of custom tags contained in the payloads.  See [Create custom alerts](quickstart-create-custom-alerts.md) to learn more about custom alerts and how to create them.

## What happens when the internet connection stops working?

The sensors and agents continue to run and store data as long as the device is running. Data is stored in the security message cache according to size configuration. When the device regains connectivity, security messages resume sending.

## Next steps

To learn more about how to get started with Defender for IoT, see the following articles:

- Read the Defender for IoT [overview](overview.md)
- Verify the [System prerequisites](quickstart-system-prerequisites.md)
- Learn more about how to [Getting started with Defender for IoT](getting-started.md)
- Understand [Defender for IoT security alerts](concept-security-alerts.md)