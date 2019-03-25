---
title: Linux C installation of ATP for IoT agent Preview| Microsoft Docs
description: Learn how to install the ATP for IoT agent on both 32bit and 64bit Linux. 
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 3ccf2aec-106a-4d2c-8079-5f3e8f2afdcb
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/07/2019
ms.author: mlottner

---
# ATP for IoT installation for Linux C

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains how to install the ATP for IoT service on Linux using the ATP for IoT C installer. 

The C installer is the only installer that supports 32bit Linux. If you are running 64 bit Linux, you can choose between using the C and C# installer. The C# ATP for IoT agent requires more system resources, but includes the same functionality.   

ATP for IoT offers different installer agents for Windows, 32bit Linux and 64bit Linux . Make sure you have the correct agent installer for each of your devices. 

| 32 or 64bit | Linux | Windows |    Details|
|----------|----------------------------------------------|-------------|-------------------------------------------|
| 32bit  | C  | C#  ||
| 64bit  | C# or C           | C#      | Use the C agent for devices with minimal resources|

## Prerequisites

To deploy the security agent, local admin rights are required on the machine you wish to install on. 

## Installation 

To install deploy the security agent, do the following:

1. To install the ATP for IoT agent on the device, download the most recent version to your machine from the GitHub releases (../../releases) folder.

2. Extract the contents of the package, and navigate to the /installation folder.

3. Add running permissions to the **InstallSecurityAgent script** by running `chmod +x InstallSecurityAgent.sh`
	1. Next, run:

	```
	.\InstallSecurityAgent.sh -aui <authentication identity> -aum <authentication type> -f <file path> -hn <host name> -di <device id> -i
	```

The script does the following:

- Installs prerequisites.
- Installs the agent as a daemon.
- Configures the agent with the authentication parameters provided.

See [How to configure authentication](how-to-configure-authentication-methods.md) for more information about authentication parameters.  

For additional help, run the script with the –help parameter: `./InstallSecurityAgent.sh --help`

### Uninstall the agent

To uninstall the agent, run the script with the –u parameter: `./InstallSecurityAgent.sh -u`. 
```
.\InstallSecurityAgent.sh –uninstall / -u
``` 

## Troubleshooting
1. Check the deployment status by running:
	```
	systemctl status ASCIoTAgent.service
	```


## See Also
- [Overview](overview.md)
- [Architecture](architecture.md)
- [Onboarding](quickstart-onboard-iot-hub.md)
- [ATP for IoT FAQ](resources-frequently-asked-questions.md)
- [Understanding ATP for IoT alerts](concept-security-alerts.md)