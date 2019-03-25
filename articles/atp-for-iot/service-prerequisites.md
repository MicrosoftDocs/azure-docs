---
title: ATP for IoT prerequisites Preview| Microsoft Docs
description: Details of everything needed to get started with ATP for IoT service prerequisites.
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 790cbcb7-1340-4cc1-9509-7b262e7c3181
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/20/2019
ms.author: mlottner

---
# ATP for IoT prerequisites

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an explanation of the different building blocks of the ATP for IoT service, what you need to begin and basic concepts to help understand the service. 

## Minimum requirements

- IoT Hub Standard tier
    - RBAC role **Owner** level privileges 
- [Log Analytics Workspace](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace) 
- Azure Security Center (recommended)
    - While use of Azure Security Center is only a recommendation and not a requirement, without it, you won't be able to view your other Azure resources within IoT hub. 
 
## Portal

ATP for IoT insights and reporting are available using Azure IoT Hub and Azure Security Center. To onboard ATP for IoT into your Azure IoT hub, an account with Owner level privileges is required. After onboarding ATP for IoT into your IoT Hub, ATP for IoT insights are displayed as the **Security** feature in Azure IoT Hub and as  **IoT** in Azure Security Center. 

## Supported service regions 

ATP for IoT is currently supported for IoT Hubs in the following Azure regions:
  - Central US
  - Northern Europe
  - Southeast Asia

## Where's my IoT hub?

Check your IoT Hub location to verify service availability before you begin. 

1. Open your IoT Hub. 
2. Click **Overview**. 
3. Verify the location listed matches one of the [supported service regions](#supported-service-regions). 

Support for additional regions is planned for a future release.  

## Device agent prerequisites

ATP for IoT agent supports a growing list of devices and platforms. See the [supported platform list](device-agent-prerequisites.md) to check your existing or planned device library.  

## See Also
- [Overview](overview.md)
- [Device agent prerequisites](device-agent-prerequisites.md)
- [Service onboarding](quickstart-onboard-iot-hub.md)
- [ATP for IoT FAQ](resources-frequently-asked-questions.md)
- [Understanding ATP for IoT alerts](concept-security-alerts.md)
