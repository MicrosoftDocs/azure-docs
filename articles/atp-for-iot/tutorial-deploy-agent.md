---
title: Deploy an ATP for IoT agent Preview| Microsoft Docs
description: Learn about how to deploy ATP for IoT security agent on IoT devices.
services: azureiotsecurity
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 32a9564d-16fd-4b0d-9618-7d78d614ce76
ms.service: azureiotsecurity
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/19/2019
ms.author: mlottner

---

# Deploy security agent on your IoT device

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


ASC for IoT provides reference architectures for security agents that monitor and collect data from IoT devices.
Security agents are developed as open source projects, and are available in two flavours: [C](https://aka.ms/iot-security-github-c), and [C#](https://aka.ms/iot-security-github-cs).

## Supported platforms for ATP for IoT agents

The following list includes all supported platforms as of public preview. Support for additional platforms is planned for future releases.  

|ATP for IoT agent |Operating System |Architecture |
|--------------|------------|--------------|
|C|Ubuntu 16.04 |	x64|
|C|Ubuntu 18.04 |	x64|
|C|Debian 9 |	x64, x86|
|C#|Ubuntu 16.04 	|x64|
|C#|Ubuntu 18.04	|x64|
|C#|Debian 9	|x64|
|C#|Windows Server 2016|	X64|
|C#|Windows 10 IoT Core build 17763	|x64|


## Which flavours should I use?

Consider the following questions with respect to your IoT devices:

- Are you using _Windows Server_ or _Windows IoT Core_? see [ATP for IoT installation for Windows with the C#-based security agent](tutorial-deploy-windows-cs.md).
- Are you using a Linux distribution with x86 architecture? see [ATP for IoT installation for Linux with the C-based security agent](tutorial-deploy-linux-c.md).
- Are you using a Linux distribution with x64 architecture? you can use both flavours. See [ATP for IoT installation for Linux with the C-based security agent](tutorial-deploy-linux-c.md) and [ATP for IoT installation for Linux with the C#-based security agent](tutorial-deploy-linux-cs.md).

Both flavours have the same set of features, and support the similar configuration options. The C-based security agent has a lower memory footprint.


## See Also
- [Overview](overview.md)
- [Security agents](security-agent-architecture.md)
- [Security agent authentication methods](concept-security-agent-authentication-methods.md)
- [ATP for IoT FAQ](resources-frequently-asked-questions.md)