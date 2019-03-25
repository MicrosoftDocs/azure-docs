---
title: Understanding ATP for IoT security agent architecture Preview| Microsoft Docs
description: Understand security agent architecture for the agents used in the ATP for IoT service.
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: e78523ae-d70a-456a-818d-f8b1b025d7cb
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/25/2019
ms.author: mlottner

---
# Security agent reference architecture

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


ATP for IoT provides reference architecture for security agents that log, process, aggregate, and send security data through IoT hub.

Security agents are designed to work in a constrained IoT environment, and are highly customizable in terms of values they provide when compared to the resources they consume.

Security agents support the following IoT solution features:

- Collect raw security events from the underlying OS (Linux, Windows). To learn more about available security data collectors, see [ATP for IoT agent configuration](tutorial-agent-configuration.md).

- Aggregate raw security events into messages sent through IoT hub.

- Authenticate with existing device identity, or a dedicated module identity. See [Security agent authentication methods](concept-security-agent-authentication-methods.md) to learn more.

- Configure remotely through use of the **atpforiot** module twin. To learn more, see [Configure an ATP for IoT agent](tutorial-agent-configuration.md).

ATP for IoT Security agents are developed as open-source projects, and are available from GitHub: 

- [IoT-ATP-Agent-C](https://github.com/Azure/IoT-ATP-Agent-C) 
- [IoT-ATP-Agent-CS](https://github.com/Azure/IoT-ATP-Agent-CS)

## Agent supported platforms

ATP for IoT offers different installer agents for 32bit and 64bit Windows, and the same for 32bit and 64bit Linux. Make sure you have the correct agent installer for each of your devices according to the following table:

| 32 or 64bit | Linux | Windows |    Details|
|----------|----------------------------------------------|-------------|-------------------------------------------|
| 32bit  | C  | C#  ||
| 64bit  | C# or C           | C#      | Use the C agent for devices with minimal resources|


## Next steps
In this article, you learned about ATP for IoT security agent architecture, and the available installers. To get started installing agents on your devices, see the following articles:

## See Also
- [Service prerequisites](service-prerequisites.md)
- [Device agent prerequisites](device-agent-prerequisites.md)
- [Linux C# installation](quickstart-linux-cs-installation.md)
- [Linux C installation](quickstart-linux-c-installation.md)
- [Windows installation](quickstart-windows-cs-installation.md)
- [Configure your solution](quickstart-configure-your-solution.md)
- [Onboard to IoT hub](quickstart-onboard-iot-hub.md)
- [ATP for IoT FAQ](resources-frequently-asked-questions.md)
- [Understand ATP for IoT security alerts](concept-security-alerts.md)

