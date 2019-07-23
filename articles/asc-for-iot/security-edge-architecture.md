---
title: Understanding Azure Security Center for IoT security module for IoT Edge | Microsoft Docs
description: Understand the architecture and capabilities of Azure Security Center for IoT security module for IoT Edge.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: e78523ae-d70a-456a-818d-f8b1b025d7cb
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/25/2019
ms.author: mlottner

---
# Azure IoT Edge security module

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production worklo§1ads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/) provides powerful capabilities to manage and perform business workflows at the edge.
The key part that IoT Edge plays in IoT environments make it particularly attractive for malicious actors.

Azure Security Center (ASC) for IoT security module provides a comprehensive security solution for your IoT Edge devices.
ASC for IoT module collects, aggregates and analyzes raw security data from your Operating System and container system into actionable security recommendations and alerts.

Similar to ASC for IoT security agents for IoT devices, the ASC for IoT Edge module is highly customizable through its module twin.
See [Configure your agent](how-to-agent-configuration.md) to learn more.

ASC for IoT security module for IoT Edge offers the following features:

- Collects raw security events from the underlying Operating System (Linux), and the IoT Edge Container systems.
  
  See [ASC for IoT agent configuration](how-to-agent-configuration.md) to learn more about available security data collectors.

- Analysis of IoT Edge deployment manifests.

- Aggregates raw security events into messages sent through [IoT Edge Hub](https://docs.microsoft.com/azure/iot-edge/iot-edge-runtime#iot-edge-hub).

- Remove configuration through use of the security module twin.

  See [Configure an ASC for IoT agent](how-to-agent-configuration.md) to learn more.

ASC for IoT security module for IoT Edge runs in a privileged mode under IoT Edge.
Privileged mode is required to allow the module to monitor the Operating System, and other IoT Edge modules.

## Agent supported platforms

ASC for IoT security module for IoT Edge is currently only available for Linux.

## Next steps

In this article, you learned about the architecture and capabilities of ASC for IoT security module for IoT Edge.

To continue getting started with ASC for IoT deployment, use the following articles:

- Deploy [security module for IoT Edge](how-to-deploy-edge.md)
- Learn how to [configure your security module](how-to-agent-configuration.md)
- Review the ASC for IoT [Service prerequisites](service-prerequisites.md)
- Learn how to [Enable ASC for IoT service in your IoT Hub](quickstart-onboard-iot-hub.md)
- Learn more about the service from the [ASC for IoT FAQ](resources-frequently-asked-questions.md)