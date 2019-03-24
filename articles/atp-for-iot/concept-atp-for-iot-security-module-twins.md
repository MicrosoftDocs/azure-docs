---
title: Understand ATP for IoT security module twins Preview| Microsoft Docs
description: Learn about the concept of security module twins and how they are used in ATP for IoT.
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: a5c25cba-59a4-488b-abbe-c37ff9b151f9
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2019
ms.author: mlottner

---

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

# ATP for IoT module twins

For IoT solutions built in Azure, device twins play a key role in both device management and process automation.  
ATP for IoT offers full integration with your existing IoT device management platform, enabling you to manage your device security status as well as make use of existing device control capabilities. Integration is achieved by making use of the IoT Hub twin mechanism.  

Learn more about [device](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-device-twins) and [module](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-module-twins) twins concepts in Azure IoT Hub.  

ATP for IoT maintains a security module twin for each device in the service. The security module twin holds all the information relevant to device security for each specific device in your solution. Device security properties are maintained in a dedicated security module twin for safer communication and for enabling updates and maintenance that require fewer resources.  

See [Create ATP for IoT module twin](quickstart-create-security-module.md) and [ATP for IoT configuration objects](tutorial-agent-configuration.md) to learn how to create, customize and configure the twin. See [Understanding module twins](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-module-twins) to learn more about the concept of module twins in IoT Hub. 
 

## See also
- [ATP for IoT Preview](overview.md)
- [Device agent prerequisites](device-agent-prerequisites.md)
- [Installation for Windows](quickstart-windows-installation.md)
- [Authentication](concept-security-agent-authentication-methods.md)
- [Access your IoT security data](how-to-security-data-access.md)