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
# ATP for IoT C-based security agent deployment for Linux

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains how to install the ATP for IoT C-based security agent on Linux.
For other platforms and agent flavours, see [Choose the right security agent](tutorial-deploy-agent.md).

## Prerequisites

1. To deploy the security agent, local admin rights are required on the machine you wish to install on.

1. [Create a security module](quickstart-create-security-twin.md) for the device.

## Installation 

To install deploy the security agent, do the following:

1. Download the most recent version to your machine from [Github](https://aka.ms/iot-security-github-cs).

1. Extract the contents of the package and navigate to the _/installation_ folder.

1. Add running permissions to the **InstallSecurityAgent script** by running `chmod +x InstallSecurityAgent.sh` 

1. Next, run: 

   ```
   ./InstallSecurityAgent.sh -i -aui <authentication identity>  -aum <authentication method> -f <file path> -hn <host name>  -di <device id> -cl <certificate location kind>
   ```
   
   See [How to configure authentication](concept-security-agent-authentication-methods.md) for more information about authentication parameters.

This script does the following:

- Installs prerequisites.

- Adds a service user (with interactive login disabled).

- Installs the agent as a **Daemon** - this assumes the device uses **systemd** for service management.

- Configures **sudoers** to allow the agent to perform certain tasks as root.

- Configures the agent with the provided authentication parameters.

For additional help, run the script with the –help parameter: `./InstallSecurityAgent.sh --help`

### Uninstall the agent

To uninstall the agent, run the script with the –u parameter: `./InstallSecurityAgent.sh -u`. 
```
.\InstallSecurityAgent.sh –uninstall / -u
``` 

## Troubleshooting
Check the deployment status by running:
```
systemctl status ASCIoTAgent.service
```


## See Also
- [Overview](overview.md)
- [Architecture](architecture.md)
- [Onboarding](quickstart-onboard-iot-hub.md)
- [ATP for IoT FAQ](resources-frequently-asked-questions.md)
- [Understanding ATP for IoT alerts](concept-security-alerts.md)