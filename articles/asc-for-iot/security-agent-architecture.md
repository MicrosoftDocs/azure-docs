---
title: Security agent architecture
description: Understand security agent architecture for the agents used in the Azure Security Center for IoT service.
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
ms.date: 07/26/2019
ms.author: mlottner
---

# Security agent reference architecture

Azure Security Center for IoT provides reference architecture for security agents that log, process, aggregate, and send security data through IoT Hub.

Security agents are designed to work in a constrained IoT environment, and are highly customizable in terms of values they provide when compared to the resources they consume.

Security agents support the following features:

- Collect raw security events from the underlying Operating System (Linux, Windows). To learn more about available security data collectors, see [Azure Security Center for IoT agent configuration](how-to-agent-configuration.md).

- Aggregate raw security events into messages sent through IoT Hub.

- Authenticate with existing device identity, or a dedicated module identity. See [Security agent authentication methods](concept-security-agent-authentication-methods.md) to learn more.

- Configure remotely through use of the **azureiotsecurity** module twin. To learn more, see [Configure an Azure Security Center for IoT agent](how-to-agent-configuration.md).

Azure Security Center for IoT Security agents are developed as open-source projects, and are available from GitHub:

- [Azure Security Center for IoT C-based agent](https://github.com/Azure/Azure-IoT-Security-Agent-C)
- [Azure Security Center for IoT C#-based agent](https://github.com/Azure/Azure-IoT-Security-Agent-CS)

## Agent supported platforms

Azure Security Center for IoT offers different installer agents for 32bit and 64bit Windows, and the same for 32bit and 64bit Linux. Make sure you have the correct agent installer for each of your devices according to the following table:

| Architecture | Linux | Windows |    Details|
|----------|----------------------------------------------|-------------|-------------------------------------------|
| 32bit  | C  | C#  ||
| 64bit  | C# or C           | C#      | We recommend using the C agent for devices with more restricted or minimal device resources.|
|

## Next steps

In this article, you learned about Azure Security Center for IoT security agent architecture, and the available installers.

To continue getting started with Azure Security Center for IoT deployment, use the following articles:

- Understand [security agent authentication methods](concept-security-agent-authentication-methods.md)
- Select and deploy a [security agent](how-to-deploy-agent.md)
- Review the Azure Security Center for IoT [service prerequisites](service-prerequisites.md)
- Learn how to [enable Azure Security Center for IoT service in your IoT Hub](quickstart-onboard-iot-hub.md)
- Learn more about the service from the [Azure Security Center for IoT FAQ](resources-frequently-asked-questions.md)
