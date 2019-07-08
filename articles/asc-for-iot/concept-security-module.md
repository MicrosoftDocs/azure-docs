---
title: Understand Azure Security Center for IoT security module twins Preview| Microsoft Docs
description: Learn about the concept of security module twins and how they are used in Azure Security Center for IoT.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: a5c25cba-59a4-488b-abbe-c37ff9b151f9
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/26/2019
ms.author: mlottner

---

# Security module

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains how Azure Security Center (ASC) for IoT uses device twins and modules. 

## Device twins

For IoT solutions built in Azure, device twins play a key role in both device management and process automation.  

ASC for IoT offers full integration with your existing IoT device management platform, enabling you to manage your device security status as well as make use of existing device control capabilities. Integration is achieved by making use of the IoT Hub twin mechanism.  

Learn more about the concept of [device twins](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-device-twins) in Azure IoT Hub. 

## Security module twins

ASC for IoT maintains a security module twin for each device in the service.
The security module twin holds all the information relevant to device security for each specific device in your solution.
Device security properties are maintained in a dedicated security module twin for safer communication and for enabling updates and maintenance that require fewer resources.  

See [Create security module twin](quickstart-create-security-twin.md) and [Configure security agents](how-to-agent-configuration.md) to learn how to create, customize and configure the twin. See [Understanding module twins](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-module-twins) to learn more about the concept of module twins in IoT Hub. 
 

## See also
- [ASC for IoT Preview](overview.md)
- [Deploy security agents](how-to-deploy-agent.md)
- [Security agent authentication methods](concept-security-agent-authentication-methods.md)