---
title: Defender for IoT frequently asked questions
description: Find answers to the most frequently asked questions about Microsoft Defender for IoT features and service.
ms.topic: conceptual
ms.date: 11/09/2021
---

# Microsoft Defender for IoT frequently asked questions

This article provides a list of frequently asked questions and answers about Defender for IoT.

## What is Azure's unique value proposition for IoT security?

Defender for IoT enables enterprises to extend their existing cyber security view to their entire IoT solution. Azure provides an end to end view of your business solution, enabling you to take business-related actions and decisions based on your enterprise security posture and collected data. Combined security using Azure IoT, Azure IoT Edge, and Microsoft Defender for Cloud enable you to create the solution you want with the security you need.

## Our organization uses proprietary non-standard industrial protocols. Are they supported? 

Microsoft Defender for IoT provides comprehensive protocol support. In addition to embedded protocol support, you can secure IoT and OT devices running proprietary and custom protocols, or protocols that deviate from any standard. Using the Horizon Open Development Environment (ODE) SDK, developers can create dissector plugins that decode network traffic based on defined protocols. Traffic is analyzed by services to provide complete monitoring, alerting, and reporting. Use Horizon to:
- Expand visibility and control without the need to upgrade to new versions.
- Secure proprietary information by developing on-site as an external plugin. 
- Localize text for alerts, events, and protocol parameters.

This unique solution for developing protocols as plugins, doesn't require dedicated developer teams or version releases in order to support a new protocol. Developers, partners, and customers can securely develop protocols and share insights and knowledge using Horizon. 

## Do I have to purchase hardware appliances from Microsoft partners?
Microsoft Defender for IoT sensor runs on specific hardware specs as described in the [Hardware Specifications Guide](./how-to-identify-required-appliances.md), customers can purchase certified hardware from Microsoft partners or use the supplied bill of materials  (BOM) and purchase it on their own. 

Certified hardware has been tested in our labs for driver stability, packet drops and network sizing.


## Regulation doesn't allow us to connect our system to the Internet. Can we still utilize Defender for IoT?

Yes you can! The Microsoft Defender for IoT platform on-premises solution is deployed as a physical or virtual sensor appliance that passively ingests network traffic (via SPAN, RSPAN, or TAP) to analyze, discover, and continuously monitor IT, OT, and IoT networks. For larger enterprises, multiple sensors can aggregate their data to an on-premises management console.

## Where in the network should I connect monitoring ports?

The Microsoft Defender for IoT sensor connects to a SPAN port or network TAP and immediately begins collecting ICS network traffic via passive (agentless) monitoring. It has zero impact on OT networks since it isn’t placed in the data path and doesn’t actively scan OT devices.

For example:
- A single appliance (virtual of physical) can be in the Shop Floor DMZ layer, having all Shop Floor cell traffic routed to this layer.
- Alternatively, locate small mini-sensors in each Shop Floor cell with either cloud or local management that will reside in the Shop Floor DMZ layer. Another appliance (virtual or physical) can monitor the traffic in the Shop Floor DMZ layer (for SCADA, Historian, or MES).

## How does Defender for IoT compare to the competition?

Microsoft Defender for IoT delivers comprehensive security across all your IoT/OT devices. For **end-user organizations**, Microsoft Defender for IoT offers agentless, network-layer security that is rapidly deployed, works with diverse proprietary OT equipment and legacy Windows systems, and interoperates with Microsoft Sentinel and other SOC tools. It can be deployed on-premises or in Azure-connected environments. For **IoT device builders**, Microsoft Defender for IoT offers lightweight agents to embed device-layer security into new IoT/OT initiatives.

## Do I have to be an Azure customer?

No, for the agentless version of Microsoft Defender for IoT, you do not need to be an Azure customer. However, if you want to send alerts to Microsoft Sentinel; provision network sensors and monitor their health from the cloud; and benefit from automatic software and threat intelligence updates, you will need to connect the sensor to Azure and Defender for IoT. For more information, see [Sensor connection methods](architecture-connections.md).

For the agent-based version of Microsoft Defender for IoT, you must be an Azure customer.

## What happens when the internet connection stops working?

The sensors and agents continue to run and store data as long as the device is running. Data is stored in the security message cache according to size configuration. When the device regains connectivity, security messages resume sending.

## How can I change a user's passwords

Learn how to [Change a user's password](how-to-create-and-manage-users.md#change-a-users-password) for either the sensor or the on-premises management console.

You can also [Recover the password for the on-premises management console, or the sensor](how-to-create-and-manage-users.md#recover-the-password-for-the-on-premises-management-console-or-the-sensor).

## How do I activate the sensor and on-premises management console

For information on how to activate your sensor, see [Sign in and activate the sensor](how-to-activate-and-set-up-your-sensor.md#sign-in-and-activate-the-sensor).

For information on how to activate your on-premises management console, see [Activate the on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md#activate-the-on-premises-management-console).

## How to change the network configuration

You can update your sensor network configuration before or after activation. For more information, see [Activate and set up your sensor](how-to-activate-and-set-up-your-sensor.md#activate-and-set-up-your-sensor).

You can also [update the sensor network configuration](how-to-manage-individual-sensors.md#update-the-sensor-network-configuration) after activation.

You can work with CLI [commands](references-work-with-defender-for-iot-cli-commands.md#network-configuration) to [change network configurations](references-work-with-defender-for-iot-cli-commands.md#network-configuration).

## How do I check the sanity of my deployment

After installing the software for your sensor or on-premises management console, you will want to perform the [Post-installation validation](how-to-install-software.md#post-installation-validation).

You can also use our [UI and CLI tools](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md#check-system-health) to check system health and review your overall system statistics.

For more information, see [Troubleshoot the sensor and on-premises management console](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md).

## Next steps

To learn more about how to get started with Defender for IoT, see the following articles:

- Read the Defender for IoT [overview](overview.md)
- [Get started with Defender for IoT](getting-started.md)