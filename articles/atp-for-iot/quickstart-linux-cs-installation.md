---
title: Linux C# installation of ATP for IoT agent Preview| Microsoft Docs
description: Learn how to install the ATP for IoT agent on both 32 and 64bit Linux. 
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: b0982203-c3c8-4a0b-8717-5b5ac4038d8c
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/25/2019
ms.author: mlottner

---
# ATP for IoT installation for Linux

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains how to install the ATP for IoT service agent on Linux. 

ATP for IoT offers installers for Linux 64bit, Windows 32bit and 64bit. Make sure you have the correct agent installer for each of your devices according to the following table:

| 32 or 64bit | Linux | Windows |    Details|
|----------|----------------------------------------------|-------------|-------------------------------------------|
| 32bit  | C  | C#  ||
| 64bit  | C# or C           | C#      | Use the C agent for devices with minimal resources|

## Prerequisites

To deploy the security agent, local admin rights are required on the machine you wish to install on. 

## Installation 

To deploy the security agent, do the following:

1. Add running permissions to the **InstallSecurityAgent script** by running `chmod +x InstallSecurityAgent.sh` 
    1. Next, run: 

    `./InstallSecurityAgent.sh -i -aui <authentication identity>  -aum <authentication method> -f <file path> -hn <host name>  -di <device id> -cl <certificate location kind> `

This script does the following:

- Installs prerequisites.

- Adds a service user (with interactive login disabled).

- Installs the agent as a **Daemon** - this assumes the device uses **systemd** for service management.

- Configures **sudoers** to allow the agent to perform certain tasks as root.

- Configures the agent with the provided authentication parameters.

See [Authentication](authentication-methods.md) to learn more about authentication parameters.

For additional help, run the script with the –help parameter: `./InstallSecurityAgent.sh --help`

### Uninstall the agent

To uninstall the agent, run the script with the –u parameter: `./InstallSecurityAgent.sh -u`. 

> [!NOTE]
> Uninstall does not remove any missing prerequisites that were installed during installation.

## Troubleshooting  

1. Check the deployment status by running:

    `systemctl status AzureIoTSecurityAgent.service`

2. Enable logging.  
If the agent fails to start, turn on logging to get more information.

    Turn on the logging by:

    1. Open the configuration file for editing in any Linux editor:

   `vi /var/AzureIoTSecurityAgent/General.config`

    2. Edit the following values: 

    ```
        <add key="logLevel" value="Debug"/>
        <add key="fileLogLevel" value="Debug"/>
        <add key="diagnosticVerbosityLevel" value="Some" /> 
        <add key="logFilePath" value="AzureIoTSecurityAgentLog.log"/>
    ```
   - The **logFilePath** value is configurable. 

> [!NOTE]
> We recommend turning logging **off** after troubleshooting is complete. Leaving logging **on** increases log file size and data usage.

    3. Restart the agent by running:

   `systemctl restart AzureIoTSecurityAgent.service`

    4. View the log file for more information about the failure.  

    Log file location is:
`/var/AzureIoTSecurityAgent/IotAgentLog.log`

- Change the file location path according to the name you chose for the logFilePath in step 2. 

## See Also
- [Overview](overview.md)
- [Architecture](architecture.md)
- [Onboarding](quickstart-onboard-iot-hub.md)
- [ATP for IoT FAQ](resources-frequently-asked-questions.md)
- [Understanding ATP for IoT alerts](concept-security-alerts.md)