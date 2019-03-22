---
title: Linux installation of Azure IoT Security agent Preview| Microsoft Docs
description: Learn how to install the Azure IoT Security agent on both 32bit and 64bit Linux. 
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 3ccf2aec-106a-4d2c-8079-5f3e8f2afdcb
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/07/2019
ms.author: mlottner

---
# Azure IoT Security installation for Linux C

> [!IMPORTANT]
> Azure IoT Security is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains how to install the Azure IoT Security service on Linux using the Azure IoT Security C installer. 

The C installer is the only installer that supports 32bit Linux. If you are running 64 bit Linux, you can choose between using the C and C# installer. The C# Azure IoT Security agent requires more system resources, but includes the same functionality.   

Azure IoT Security offers different installer agents for Windows, 32bit Linux and 64bit Linux . Make sure you have the correct agent installer for each of your devices. 

## Prerequisites

To deploy the security agent, local admin rights are required on the machine you wish to install on. 

## Installation 

To install deploy the security agent, do the following:

1. To install the Azure IoT Security agent on the device, download the most recent version to your machine from the [releases](../../releases) folder.

2. Extract the contents of the package, and navigate to the /installation folder.

3. Open Windows PowerShell. 
    1. Add running permissions to the InstallSecurityAgent script by running Unblock-File .\InstallSecurityAgent.ps1 
    and run:

    ```
    .\InstallSecurityAgent.sh --authentication_identity <authentication identity> --authentication_method <authentication type> --file_path <file path> --host_name <gw fqdn>  --device_id <device id>
    ```
    The PowerShell script does the following:

    - Installs prerequisites 
    - Installs the agent as a System Service

    - Configures the agent with the authentication parameters provided

    For more information, see [Authentication parameters](Authentication.md).  

    For additional help, use the Get-Help command in PowerShell <br>Get-Help example:  
    `Get-Help .\InstallSecurityAgent.sh –help / -h`

### Check deployment status
- Check the deployment status by running:
    ```
    sc.exe query "ASC IoT Agent" 
    ```

### Uninstall the agent

To uninstall the agent, run the PowerShell script with the **-mode** parameter set to **Uninstall**: 
```
.\InstallSecurityAgent.sh –uninstall / -u
``` 

## Troubleshooting

1. If the agent fails to start, turn on logging (logging is *off* by default) to get more information.

To turn on logging:

1. Open the configuration file for editing using a standard file editor.

2. Edit the following values:
```
  <add key="logLevel" value="Debug" />
  <add key="fileLogLevel" value="Debug"/> 
  <add key="diagnosticVerbosityLevel" value="Some" /> 
  <add key="logFilePath" value="IotAgentLog.log" />
```

> [!NOTE]
> We recommend turning logging **off** after troubleshooting is complete. Leaving logging **on** increases log file size and data usage. 

3. Restart the agent by running the following PowerShell or command line:

    - Powershell:
    ```
    Restart-Service "ASC IoT Agent" //ml
    ```
    -OR-

    - CMD:
    ```
    sc.exe stop "ASC IoT Agent" 
    sc.exe start "ASC IoT Agent" 
    ```
4. Review the log file for more information about the failure.

    - The log file is located at: \<wherever you unpacked your agent>/IotAgentLog.log


## See Also
- [Azure IoT Security FAQ](resources-frequently-asked-questions.md)
- [Authentication](authentication-methods.md)
- [Azure IoT Security alerts](concepts-security-alerts.md)
- [Data access](data-access.md)