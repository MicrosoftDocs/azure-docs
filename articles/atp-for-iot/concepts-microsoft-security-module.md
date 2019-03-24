---
title: Security alert guide for ASC for IoT Preview| Microsoft Docs
description: Learn about security alerts and recommended remediation using ASC for IoT features and service.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: a5c25cba-59a4-488b-abbe-c37ff9b151f9
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/07/2019
ms.author: mlottner

---

> [!IMPORTANT]
> ASC for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

# Microsoft.Security module twins

For IoT solutions built in Azure, device twins play a key role in both device management and process automation.  
ASC for IoT offers full integration with your existing IoT device management platform, enabling you to manage your device security status as well as make use of existing device control capabilities. 

Integration is achieved by making use of the IoT Hub twin mechanism.  
Device twins XYZ. Learn more about device twins in Azure.  

ASC for IoT maintains a security module twin. The security module twin holds all the information relevant to device security for each device. These security properties are maintained in a dedicated security module twin for safer and less resource consuming updates and maintenance. 

See [Create microsoft.Security module twin](quickstart-security-twin.md) and [Microsoft.Security configuration objects](modify-module-configuration.md) to learn how to create, customize and configure the twin. 
 

## See also
- [ASC for IoT Preview](overview.md)
- [Installation for Windows](quickstart-windows-installation.md)
- [Authentication](authentication-methods.md)
- [Access your IoT data](dataaccess.md)