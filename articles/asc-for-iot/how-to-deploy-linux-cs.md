---
title: Install & deploy Linux C# agent
description: Learn how to install the Azure Security Center for IoT agent on both 32-bit and 64-bit Linux.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: b0982203-c3c8-4a0b-8717-5b5ac4038d8c
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/27/2019
ms.author: mlottner
---

# Deploy Azure Security Center for IoT C# based security agent for Linux

This guide explains how to install and deploy the Azure Security Center for IoT C#-based security agent on Linux.

In this guide, you learn how to:

> [!div class="checklist"]
> * Install
> * Verify deployment
> * Uninstall the agent
> * Troubleshoot

## Prerequisites

For other platforms and agent flavors, see [Choose the right security agent](how-to-deploy-agent.md).

1. To deploy the security agent, local admin rights are required on the machine you wish to install on.

1. [Create a security module](quickstart-create-security-twin.md) for the device.

## Installation

To deploy the security agent, use the following steps:

1. Download the most recent version to your machine from [GitHub](https://aka.ms/iot-security-github-cs).

1. Extract the contents of the package and navigate to the _/Install_ folder.

1. Add running permissions to the **InstallSecurityAgent script** by running `chmod +x InstallSecurityAgent.sh`

1. Next, run the following command with **root privileges**:

   ```
   ./InstallSecurityAgent.sh -i -aui <authentication identity>  -aum <authentication method> -f <file path> -hn <host name>  -di <device id> -cl <certificate location kind>
   ```

   for more information about authentication parameters, see [How to configure authentication](concept-security-agent-authentication-methods.md).

This script performs the following actions:

- Installs prerequisites.

- Adds a service user (with interactive sign in disabled).

- Installs the agent as a **Daemon** - assumes the device uses **systemd** for classic deployment model.

- Configures **sudoers** to allow the agent to do certain tasks as root.

- Configures the agent with the provided authentication parameters.

For additional help, run the script with the –help parameter: `./InstallSecurityAgent.sh --help`

### Uninstall the agent

To uninstall the agent, run the script with the –u parameter: `./InstallSecurityAgent.sh -u`.

> [!NOTE]
> Uninstall does not remove any missing prerequisites that were installed during installation.

## Troubleshooting

1. Check the deployment status by running:

    `systemctl status ASCIoTAgent.service`

1. Enable logging.
   If the agent fails to start, turn on logging to get more information.

   Turn on the logging by:

   1. Open the configuration file for editing in any Linux editor:

        `vi /var/ASCIoTAgent/General.config`

   1. Edit the following values:

      ```
      <add key="logLevel" value="Debug"/>
      <add key="fileLogLevel" value="Debug"/>
      <add key="diagnosticVerbosityLevel" value="Some" />
      <add key="logFilePath" value="IotAgentLog.log"/>
      ```

       The **logFilePath** value is configurable.

       > [!NOTE]
       > We recommend turning logging **off** after troubleshooting is complete. Leaving logging **on** increases log file size and data usage.

   1. Restart the agent by running:

       `systemctl restart ASCIoTAgent.service`

   1. View the log file for more information about the failure.

       Log file location is: `/var/ASCIoTAgent/IotAgentLog.log`

       Change the file location path according to the name you chose for the **logFilePath** in step 2.

## Next steps

- Read the Azure Security Center for IoT service [Overview](overview.md)
- Learn more about Azure Security Center for IoT [Architecture](architecture.md)
- Enable the [service](quickstart-onboard-iot-hub.md)
- Read the [FAQ](resources-frequently-asked-questions.md)
- Understand [alerts](concept-security-alerts.md)
