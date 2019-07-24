---
title: Guide to install and deploy Linux C agent of Azure Security Center for IoT agent Preview| Microsoft Docs
description: Learn how to install the Azure Security Center for IoT agent on both 32-bit and 64-bit Linux. 
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: 3ccf2aec-106a-4d2c-8079-5f3e8f2afdcb
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/28/2019
ms.author: mlottner

---
# Deploy Azure Security Center for IoT C-based security agent for Linux

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This guide explains how to install and deploy the Azure Security Center (ASC) for IoT C-based security agent on Linux.

In this guide, you learn how to: 
> [!div class="checklist"]
> * Install
> * Verify deployment
> * Uninstall the agent
> * Troubleshoot 

## Prerequisites

For other platforms and agent flavors, see [Choose the right security agent](how-to-deploy-agent.md).

1. To deploy the security agent, local admin rights are required on the machine you wish to install on (sudo).

1. [Create a security module](quickstart-create-security-twin.md) for the device.

## Installation 

To install and deploy the security agent, do the following:


1. Download the most recent version to your machine from [Github](https://aka.ms/iot-security-github-c).

1. Extract the contents of the package and navigate to the _/Install_ folder.

1. Add running permissions to the **InstallSecurityAgent script** by running the following:
    
   ```
   chmod +x InstallSecurityAgent.sh
   ```

1. Next, run: 

   ```
   ./InstallSecurityAgent.sh -aui <authentication identity> -aum <authentication method> -f <file path> -hn <host name> -di <device id> -i
   ```
   
   See [How to configure authentication](concept-security-agent-authentication-methods.md) for more information about authentication parameters.

This script does the following:

1. Installs prerequisites.

2. Adds a service user (with interactive login disabled).

3. Installs the agent as a **Daemon** - assumes the device uses **systemd** for service management.

4. Configures the agent with the authentication parameters provided. 

For additional help, run the script with the –help parameter: 
    
    ./InstallSecurityAgent.sh --help

### Uninstall the agent

To uninstall the agent, run the script with the –-uninstall parameter:

    ./InstallSecurityAgent.sh -–uninstall

## Troubleshooting
Check the deployment status by running:

    systemctl status ASCIoTAgent.service


## Next steps
- Read the ASC for IoT service [Overview](overview.md)
- Learn more about ASC for IoT [Architecture](architecture.md)
- Enable the [service](quickstart-onboard-iot-hub.md)
- Read the [FAQ](resources-frequently-asked-questions.md)
- Understand [security alerts](concept-security-alerts.md)