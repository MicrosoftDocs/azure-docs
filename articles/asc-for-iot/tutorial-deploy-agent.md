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
ms.date: 03/19/2019
ms.author: mlottner

---

# Select and deploy a security agent on your IoT device

> [!IMPORTANT]
> ASC for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


ASC for IoT provides reference architectures for security agents that monitor and collect data from IoT devices.
Security agents are developed as open source projects, and are available in two flavours: <br> [C](https://aka.ms/iot-security-github-c), and [C#](https://aka.ms/iot-security-github-cs).

In this tutorial, you will: 
> [!div class="checklist"]
> * Compare security agent flavours
> * Discover supported agent platforms
> * Choose the right agent flavour for your solution

## Security agent comparison

Both flavours have the same set of features, and support the similar configuration options. The C-based security agent has a lower memory footprint.

|     | C-based security agent | C#-based security agent |
| --- | ----------- | --------- |
| Open source | Available under [MIT license](https://en.wikipedia.org/wiki/MIT_License) in [Github](https://aka.ms/iot-security-github-cs) | Available under [MIT license](https://en.wikipedia.org/wiki/MIT_License) in [Github](https://aka.ms/iot-security-github-c) |
| Development language    | C | C# |
| Supported Windows platforms? | No | Yes |
| Windows prerequisites | --- | [WMI](https://docs.microsoft.com/en-us/windows/desktop/wmisdk/) |
| Supported Linux platforms? | Yes, x64 and x86 | Yes, x64 only |
| Linux prerequisites | libunwind8, libcurl3, uuid-runtime, auditd, audispd-plugins | libunwind8, libcurl3, uuid-runtime, auditd, audispd-plugins, sudo, netstat, iptables |
| Disk footprint | XXX | XXX |
| Memory footprint (on average) | XXX | XXX |
| [Authentication](concept-security-agent-authentication-methods.md) to IoT Hub | Yes | Yes |
| Security data [collection](tutorial-agent-configuration.md#supported-security-events) | Yes | Yes |
| Event aggregation | Yes | Yes |
| Remote configuration through [security module twin](concept-security-module.md) | Yes | Yes |



## Supported platforms for ASC for IoT agents

The following list includes all supported platforms as of public preview. Support for additional platforms is planned for future releases.  

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


## Which flavours should I use?

Consider the following questions with respect to your IoT devices:

- Are you using _Windows Server_ or _Windows IoT Core_? [Deploy a C#-based security agent](tutorial-deploy-windows-cs.md).
- Are you using a Linux distribution with x86 architecture? see [Deploy a C-based security agent](tutorial-deploy-linux-c.md).
- Are you using a Linux distribution with x64 architecture? you can use both flavours. [Deploy a C-based security agent](tutorial-deploy-linux-c.md) or [deploy a C#-based security agent](tutorial-deploy-linux-cs.md).

Both flavours have the same set of features and support the similar configuration options.
For more information, see [Security agent comparison](tutorial-deploy-agent.md#security-agent-comparison).


## See Also
- [Overview](overview.md)
- [Security agents](security-agent-architecture.md)
- [Security agent authentication methods](concept-security-agent-authentication-methods.md)
- [ASC for IoT FAQ](resources-frequently-asked-questions.md)