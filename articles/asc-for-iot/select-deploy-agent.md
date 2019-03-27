---
title: Select and deploy an ASC for IoT agent Preview| Microsoft Docs
description: Learn about how select and deploy ASC for IoT security agents on IoT devices.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 32a9564d-16fd-4b0d-9618-7d78d614ce76
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/27/2019
ms.author: mlottner

---

# Select and deploy a security agent on your IoT device

> [!IMPORTANT]
> ASC for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


ASC for IoT provides reference architectures for security agents that monitor and collect data from IoT devices.

Security agents are developed as open source projects, and are available in two flavors: <br> [C](https://aka.ms/iot-security-github-c), and [C#](https://aka.ms/iot-security-github-cs).

## Supported platforms for ASC for IoT agents

The following list includes all currently supported platforms.  

|ASC for IoT agent |Operating System |Architecture |
|--------------|------------|--------------|
|C|Ubuntu 16.04 |	x64|
|C|Ubuntu 18.04 |	x64|
|C|Debian 9 |	x64, x86|
|C#|Ubuntu 16.04 	|x64|
|C#|Ubuntu 18.04	|x64|
|C#|Debian 9	|x64|
|C#|Windows Server 2016|	X64|
|C#|Windows 10 IoT Core build 17763	|x64|


## Which flavor should I use?

Consider the following questions with respect to your IoT devices:

- Are you using _Windows Server_ or _Windows IoT Core_? 

    Use [ASC for IoT installation for Windows with the C#-based security agent](tutorial-deploy-windows-cs.md).

- Are you using a Linux distribution with x86 architecture? 

    Use [ASC for IoT installation for Linux with the C-based security agent](tutorial-deploy-linux-c.md).
- Are you using a Linux distribution with x64 architecture?

    You can use both flavors. <br>
    [ASC for IoT installation for Linux with the C-based security agent](tutorial-deploy-linux-c.md) and/or 
    [ASC for IoT installation for Linux with the C#-based security agent](tutorial-deploy-linux-cs.md).

Both flavors have the same set of features, and support the similar configuration options. The C-based security agent has a lower memory footprint.


## Next steps
- [Overview](overview.md)
- [Security agents](security-agent-architecture.md)
- [Security agent authentication methods](concept-security-agent-authentication-methods.md)
- [ASC for IoT FAQ](resources-frequently-asked-questions.md)