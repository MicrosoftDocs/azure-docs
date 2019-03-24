---
title: Create a module twin for Azure IoT Security Preview| Microsoft Docs
description: Learn how to create a Microsoft.Security module twin for Azure IoT Security.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: c782692e-1284-4c54-9d76-567bc13787cc
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/12/2019
ms.author: mlottner

---
# Quickstart: Create a Microsoft.Security module twin

> [!IMPORTANT]
> Azure IoT Security is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an explanation of how to create a Microsoft.Security module twin for use with the Azure IoT Security preview.

## Understanding Microsoft.Security module twins 

For IoT solutions built in Azure, device twins play a key role in both device management and process automation. 

Azure IoT Security offers full integration with your existing IoT device management platform, enabling you to manage your device security status as well as make use of existing device control capabilities. Integration is achieved by making use of the IoT Hub twin mechanism.  
Device twins XYZ. Learn more about device twins in Azure. 
 
Azure IoT Security maintains a security module twin, that holds all the information relevant to device security for each device. These security properties are maintained in a dedicated security module twin.  
This article defines the creation, usage and configuration of Azure IoT Security in IoT Hub twin mechanisms. 

## Create Microsoft.Security module 

Microsoft.Security module twins can be added using the default by batch, or individually with specific configurations for each agent. To add by batch, use the Module batch script. To create a unique twin, use the following instructions. 

To create a new Microsoft.Security module twin for a specific device follow these steps or use the following script to create Microsoft.Security module twins for **all** of your devices: 

1. In the **IoT Hub**, click on IoT devices, select the device, Add module identity, where the device you wish to add a Microsoft.Security module, select the device you wish to create a twin for in the list of devices.  
2. In the **Module Identity Name** field,symmetric key, Save enter **Microsoft.Security**.

Your Microsoft.Security module was created. Use to add to a security group or to configure your agent. 

To learn more about customizing properties of Microsoft.Security module twins, see [Agent configuration](quickstart-agent-configuration.md).


## See Also
- [Azure IoT Security preview](overview.md)
- [Authentication](authentication-methods.md)
- [Azure IoT Security alerts](concepts-security-alerts.md)
- [Data access](data-access.md)
- - [Azure IoT Security FAQ](resources-frequently-asked-questions.md)


