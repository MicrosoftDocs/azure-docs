---
title: Tutorial to install and deploy Linux C agent of ASC for IoT agent Preview| Microsoft Docs
description: Learn how to install the ASC for IoT agent on both 32-bit and 64-bit Linux. 
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 3ccf2aec-106a-4d2c-8079-5f3e8f2afdcb
ms.service: ascforiot
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/26/2019
ms.author: mlottner

---
# Tutorial: Deploy ASC for IoT C-based security agent for Linux

> [!IMPORTANT]
> ASC for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This tutorial explains how to install and deploy the ASC for IoT C-based security agent on Linux.

In this tutorial, you learn how to: 
> [!div class="checklist"]
> * Install
> * Verify deployment
> * Uninstall the agent
> * Troubleshoot 

## Prerequisites

For other platforms and agent flavours, see [Choose the right security agent](select-deploy-agent.md).

1. To deploy the security agent, local admin rights are required on the machine you wish to install on.

1. [Create a security module](quickstart-create-security-twin.md) for the device.

## Installation 

To install and deploy the security agent, do the following:

1. Download the most recent version to your machine from [Github](https://aka.ms/iot-security-github-cs).

1. Extract the contents of the package and navigate to the _/installation_ folder.

1. Add running permissions to the **InstallSecurityAgent script** by running the following:
    
    `chmod +x InstallSecurityAgent.sh` 

1. Next, run: 

   ```
   ./InstallSecurityAgent.sh -i -aui <authentication identity>  -aum <authentication method> -f <file path> -hn <host name>  -di <device id> -cl <certificate location kind>
   ```
   
   See [How to configure authentication](concept-security-agent-authentication-methods.md) for more information about authentication parameters.

This script does the following:

1. Installs prerequisites.

2. Adds a service user (with interactive login disabled).

3. Installs the agent as a **Daemon** - assumes the device uses **systemd** for service management.

4. Configures **sudoers** to allow the agent to perform certain tasks as root.

5. Configures the agent with the authentication parameters provided. 

For additional help, run the script with the –help parameter: 
    
    `./InstallSecurityAgent.sh --help`

### Uninstall the agent

To uninstall the agent, run the script with the –u parameter:

    `./InstallSecurityAgent.sh -u`. 

```
 .\InstallSecurityAgent.sh –uninstall / -u
``` 

## Troubleshooting
Check the deployment status by running:

```
systemctl status ASCIoTAgent.service
```


## Next steps
- Read the ASC for IoT service [Overview](overview.md)
- Learn more about ASC for IoT [Architecture](architecture.md)
- Enable the [service](quickstart-onboard-iot-hub.md)
- Read the [FAQ](resources-frequently-asked-questions.md)
- Understand [security alerts](concept-security-alerts.md)