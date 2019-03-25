---
title:  device agent prerequisites Preview| Microsoft Docs
description: Details of what's needed to get started with ATP for IoT device agents.
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 0f22eb2d-c9cd-4dbd-8b12-263f8972bcef
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2019
ms.author: mlottner

---
# ATP for IoT device agent prerequisites

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


This article provides an explanation of the possible device agent building blocks to use with the ATP for IoT service, what you need to begin, and basic concepts to help understand the service. 

## Minimum requirements

**IoT Hub**
Azure IoT
 
## Supported resources

Security analytics and best practices are provided for the following resources:

- IoT Edge devices – coming soon
- IoT leaf devices
  - ATP for IoT agent model: <br>Use for monitoring remote connections, active applications, login events and OS configuration best practices.
  - Bring your own agent model: <br>Use for monitoring device identity management, device to cloud, and cloud to device communication patterns.
- Azure IoT Hub
- Related non-IoT Azure resources, powered by Azure Security Center

## Feature access
ATP for IoT insights and reporting features are available using Azure IoT Hub and Azure Security Center. To [onboard ATP for IoT into your Azure IoT Hub](quickstart-onboard-iot-hub), an account with Owner level privileges is required. After onboarding ATP for IoT into your IoT Hub, ATP for IoT insights are displayed as the **Security** menu in Azure IoT Hub and as  **Device** alerts in ASC for IoT. 

## Supported service regions 
ATP for IoT is currently supported in the following Azure regions:
  - Central US
  - Northern Europe
  - Southeast Asia

Support for additional regions is planned for a future release.  

## Supported platforms for ATP for IoT agents

The following list includes all supported platforms as of public preview. Support for additional platforms is planned for future releases.  

|ATP for IoT agent |Operating System |Architecture |
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
- [Overview](overview.md)
- [service prerequisites](service-prerequisites.md)
- [Onboarding](quickstart-onboard-iot-hub.md)
- [Configure a agent](quickstart-agent-configuration.md)
- [ATP for IoT FAQ](resources-frequently-asked-questions.md)
- [Understanding ATP for IoT alerts](concept-security-alerts.md)
