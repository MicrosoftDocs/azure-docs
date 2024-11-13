---
title: How to replace network devices in Azure Operator Nexus Network Fabric
description: Process of replacing network devices in Azure Operator Nexus Network Fabric.
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/12/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Azure Operator Nexus Network Fabric device replacement guide

This document provides a guide for replacing devices in the Azure Operator Nexus Network Fabric. The supported devices include CE devices, TOR switches, Network Packet Brokers (NPB), and Management switches. Note that the Nexus Network Fabric currently supports CE devices and TORs in maintenance mode; NPBs and Management switches do not support maintenance mode.

## Putting a device in maintenance mode

For the identified device, you can perform a post-action to keep the device in maintenance mode to drain out the traffic. Follow these steps to put the device in maintenance mode:

### Steps to put a device in maintenance mode

1. **Identify the device**: Determine the device that needs to be put into maintenance mode.

2. **Execute maintenance mode command**: Follow the instructions on how to put the device in maintenance mode as defined in [How to put a network device in maintenance mode](howto-put-device-in-maintenance-mode.md).

3. **Verify maintenance mode**: Confirm that the device is successfully in maintenance mode by checking its status as detailed in the documentation.

> [!NOTE]
> - **CE Devices and TORs**: These devices support maintenance mode in the Nexus Network Fabric.
> - **NPBs and Management Switches**: These devices do not support maintenance mode and will require direct intervention for replacement without maintenance mode capabilities.

## Device replacement process

For the replacement of CE devices, TORs, Network Packet Brokers (NPBs), and Management switches, follow the process below:

1. **Raise a support ticket**: Contact Microsoft Support to initiate the device replacement process. Provide all necessary details about the device and the issue.

2. **Coordinate with support**: Work with Microsoft Support to plan and execute the replacement. They will guide you through the necessary steps and ensure minimal disruption to your network operations.

3. **Device replacement**: Follow the instructions provided by Microsoft Support to physically replace the device.

4. **Post-replacement verification**: After replacing the device, verify that it is functioning correctly and that network traffic is flowing as expected.
