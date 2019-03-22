---
title:  device agent prerequisites Preview| Microsoft Docs
description: Details of what's needed to get started with Azure IoT Security device agents.
services: azureiotsecurity
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 0f22eb2d-c9cd-4dbd-8b12-263f8972bcef
ms.service: azureiotsecurity
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/20/2019
ms.author: mlottner

---
# Azure IoT Security device agent prerequisites

> [!IMPORTANT]
> Azure IoT Security is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).



Clarify agent-less option. If you choose agents  -hybrid model (agent/agent-less) Onboard devices and send out security information. 

This article provides an explanation of the different building blocks of the Azure IoT Security service, what you need to begin and basic concepts to help understand the service. 

## Minimum requirements

**IoT Hub**
Azure IoT
 
## Supported resources

Security analytics and best practices are provided for the following resources:

- IoT Edge devices – coming soon
- IoT leaf devices
  - Azure IoT Security agent model: <br>Use for monitoring remote connections, active applications, login events and OS configuration best practices.
  - Bring your own agent model: <br>Use for monitoring device identity management, device to cloud, and cloud to device communication patterns.
- Azure IoT Hub
- Related non-IoT Azure resources, powered by Azure Security Center

## Feature access
Azure IoT Security insights and reporting features are available using Azure IoT Hub and Azure Security Center. To [onboard Azure IoT Security into your Azure IoT Hub](quickstart-onboard-iot-hub), an account with Owner level privileges is required. After onboarding Azure IoT Security into your IoT Hub, Azure IoT Security insights are displayed as the **Security** menu in Azure IoT Hub and as  **Device** alerts in Azure IoT Security. 

## Supported service regions 
Azure IoT Security is currently supported in the following Azure regions:
  - Central US
  - Northern Europe
  - Southeast Asia

Support for additional regions is planned for a future release.  

## Supported platforms for Azure IoT Security agents

The following list includes all supported platforms as of public preview. Support for additional platforms is planned for future releases.  

|Azure IoT Security agent |Operating System |Architecture |
|--------------|------------|--------------|
|C|Ubuntu 16.04 LTS|	X64|
|C|	Ubuntu 18.04 LTS|	X64|
|C|	Ubuntu 18.04 LTS|	X64|
|C|	OSX 10.13.4|	x64|
|C|	Windows Server 2016|	x64|
|C|	Windows Server 2016|	x86|
|C|	Debian 9 Stretch|	x64|
|C|	Windows CE 2013	 
|C#|Ubuntu 16.04 LTS	|X64|
|C#|	Windows Server 2016|	X64
|C#|	Ubuntu Server 18.04	|Amd64
|C#|	Windows Server 2016	|X64
|C#|	Windows Server 2016	|X64
|C#|	Windows 10 IoT Core build 17763	|Amd64
|C#|	Windows 10 IoT Enterprise build 17763	|Amd64
|C#|	Windows Server 2019	|Amd64
|C#|	CentOS 7.5	|AMD64 + ARM32v7
|C#| Debian 8	|AMD64 + ARM32v7
|C#|	Debian 9	|AMD64 + ARM32v7
|C#|	RHEL 7.5|	AMD64 + ARM32v7
|C#|	Ubuntu 18.04	|AMD64 + ARM32v7
|C#| Ubuntu 16.04	|AMD64 + ARM32v7
|C#|	Wind River 8|	AMD64 + ARM32v7
|C#|	Yocto	|AMD64 + ARM32v7|
|



## See Also
- [Azure IoT Security preview](overview.md)
- [Prerequisites](prerequisites.md)
- [Onboarding](quickstart-onboard-iot-hub.md)
- [Azure IoT Security FAQ](resources-frequently-asked-questions.md)
- [Azure IoT Security alerts](concepts-security-alerts.md)
