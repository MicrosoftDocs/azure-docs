---
title: Security alert guide for Azure IoT Security Preview| Microsoft Docs
description: Learn about security alerts and recommended remediation using Azure IoT Security features and service.
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
> Azure IoT Security is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

# Azure IoT Security module twins

For IoT solutions built in Azure, device twins play a key role in both device management and process automation.  
Azure IoT Security offers full integration with your existing IoT device management platform, enabling you to manage your device security status as well as make use of existing device control capabilities. Integration is achieved by making use of the IoT Hub twin mechanism.  

Learn more about [device](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-device-twins) and [module](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-module-twins) twins concepts in Azure IoT Hub.  

Azure IoT Security maintains a security module twin for each device in the service. The security module twin holds all the information relevant to device security for each specific device in your solution. Device security properties are maintained in a dedicated security module twin for safer communication and for enabling updates and maintenance that require fewer resources.  

See [Create Azure IoT Security module twin](quickstart-security-module.md) and [Azure IoT Security configuration objects](tutorial-agent-configuration.md) to learn how to create, customize and configure the twin. See [Understanding module twins]https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-module-twins to learn more about the concept of module twins in IoT Hub. 
 

## See also
- [Azure IoT Security Preview](overview.md)
- [Device agent prerequisites](device-agent-prerequisites.md)
- [Installation for Windows](quickstart-windows-installation.md)
- [Authentication](concept-security-agent-authentication-methods.md)
- [Access your IoT data](data-access.md)