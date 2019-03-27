---
title: Understanding ASC for IoT security module for IoT Edge | Microsoft Docs
description: Understand the architecture and capabilities of ASC for IoT security module for IoT Edge.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: e78523ae-d70a-456a-818d-f8b1b025d7cb
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/25/2019
ms.author: mlottner

---
# Edge security module

> [!IMPORTANT]
> ASC for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production worklo§1ads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[Azure IoT Edge](https://docs.microsoft.com/en-us/azure/iot-edge/) provides powerful capabilities to manange and perform business workflows at the edge.
The key part that it plays in IoT environments coupled with the relateive abundance of resources compared to other IoT devices, make it particularly attractive for mailcious intenders.

ASC for IoT security module provides a comprehensive security solution for your IoT Edge device.
Security module collects, aggregates and analyzes raw security data from your Operating System and Container system into actionable security recommendations and alerts.

Similarly to ASC for IoT security agents for IoT devices, security Edge module is highly customizable through it's module twin.
For more details, see [Configure your agent](how-to-agent-configuration.md).

ASC for IoT security module for IoT Edge support the following features:

- Collect raw security events from

  - The underlying Operating System (Linux)
  - The Edge Container systems
  
  To learn more about available security data collectors, see [ASC for IoT agent configuration](how-to-agent-configuration.md).

- Analyze Edge deployment manifest

- Aggregate raw security events into messages sent through [Edge hub](https://docs.microsoft.com/en-us/azure/iot-edge/iot-edge-runtime#iot-edge-hub).

- Configure remotely through use of the security module twin. To learn more, see [Configure an ASC for IoT agent](how-to-agent-configuration.md).

ASC for IoT security module for IoT Edge runs as privelged module under IoT Edge.
Privilege mode is required to allow the module to monitor the Operating System, and other Edge modules.

## Agent supported platforms

ASC for IoT security module for IoT Edge is currently available only for Linux.

## Next steps

In this article, you learned about the architecture and capabilities of ASC for IoT security module for IoT Edge.

To continue getting started with ASC for IoT deployment, use the following articles:

- Deploy [security module for IoT Edge](how-to-deploy-edge.md)
- Learn how to [configure your security module](how-to-agent-configuration.md)
- Review the ASC for IoT [Service prerequisites](service-prerequisites.md)
- Learn how to [Enable ASC for IoT service in your IoT Hub](quickstart-onboard-iot-hub.md)
- Learn more about the service from the [ASC for IoT FAQ](resources-frequently-asked-questions.md)