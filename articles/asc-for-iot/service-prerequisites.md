---
title: Components & prerequisites
description: Details of everything needed to get started with Azure Security Center for IoT service prerequisites.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: 790cbcb7-1340-4cc1-9509-7b262e7c3181
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/25/2019
ms.author: mlottner
ms.custom: references_regions
---

# Azure Security Center for IoT prerequisites

This article provides an explanation of the different components of the Azure Security Center for IoT service, what you need to begin, and explains the basic concepts to help understand the service.

## Minimum requirements

- IoT Hub Standard tier
  - RBAC role **Owner** level privileges
- [Log Analytics Workspace](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace)
- Azure Security Center (recommended)
  - Use of Azure Security Center is a recommendation, and not a requirement. Without Azure Security Center, you'll be unable to view your other Azure resources within IoT Hub.

## Working with Azure Security Center for IoT service

Azure Security Center for IoT insights and reporting are available using Azure IoT Hub and Azure Security Center. To enable Azure Security Center for IoT on your Azure IoT Hub, an account with **Owner** level privileges is required. After enabling ASC for IoT in your IoT Hub, Azure Security Center for IoT insights are displayed as the **Security** feature in Azure IoT Hub and as  **IoT** in Azure Security Center.

## Supported service regions

Azure Security Center for IoT is currently supported for IoT Hubs in the following Azure regions:

- Central US
- East US
- East US 2
- West Central US
- West US
- West US2
- Central US South
- North Central US
- Canada Central
- Canada East
- North Europe
- Brazil South
- France Central
- UK West
- UK South
- West Europe
- Northern Europe
- Japan West
- Japan East
- Australia Southeast
- Australia East
- East Asia
- Southeast Asia
- Korea Central
- Korea South
- Central India
- South India

Azure Security Center for IoT routes all traffic from all European regions to the West Europe regional data center and all remaining regions to the Central US regional data center.

## Where's my IoT Hub?

Check your IoT Hub location to verify service availability before you begin.

1. Open your IoT Hub.
1. Click **Overview**.
1. Verify the location listed matches one of the [supported service regions](#supported-service-regions).

## Supported platforms for agents

Azure Security Center for IoT agents supports a growing list of devices and platforms. See the [supported platform list](how-to-deploy-agent.md) to check your existing or planned device library.

## Next steps

- Read the Azure IoT Security [Overview](overview.md)
- Learn how to [Enable the service](quickstart-onboard-iot-hub.md)
- Read the [Azure Security Center for IoT FAQ](resources-frequently-asked-questions.md)
- Explore how to [Understand Azure Security Center for IoT alerts](concept-security-alerts.md)
