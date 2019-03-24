---
title: Windows installation of Azure IoT Security agent Preview| Microsoft Docs
description: Learn about how to install Azure IoT Security agent on 32bit or 64bit Windows devices.
services: azureiotsecurity
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 2cf6a49b-5d35-491f-abc3-63ec24eb4bc2
ms.service: azureiotsecurity
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/19/2019
ms.author: mlottner

---

# Azure IoT Security installation for Windows

> [!IMPORTANT]
> Azure IoT Security is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains how to install the Azure IoT Security service agent on 32bit or 64bit Windows. 

Azure IoT Security offers different installer agents for 32 and 64bit Windows, and the same for 32 and 64bit Linux. Make sure you have the correct agent installer for each of your devices according to the following table:

| 32 or 64bit | Linux | Windows |    Details|
|----------|----------------------------------------------|-------------|-------------------------------------------|
| 32bit  | C  | C#  ||
| 64bit  | C# or C           | C#      | We recommend using the C agent for devices with limited resources|

## Prerequisites

To deploy the security agent, local admin rights are required on the machine you wish to install on. 

## Installation 

To install the security agent, do the following:

1. To install the Azure IoT Security agent on the device, download the most recent version to your machine from the [Azure IoT Security repository](../../releases) folder.

2. Extract the contents of the package, and navigate to the /Install folder.

3. Open Windows PowerShell. 
    1. Add running permissions to the InstallSecurityAgent script by running ```Unblock-File .\InstallSecurityAgent.ps1```
    
    and run:

    ```.\InstallSecurityAgent.ps1 -Install -authenticationIdentity <authentication identity> -authenticationMethod <authentication method> -filePath <file path> -hostName <host name> -deviceId <device id> certificateLocationKind <certificate location kind>```
    
    The PowerShell script does the following:
    - Installs prerequisites
    - Installs the agent as a System Service

    - Configures the agent with the authentication parameters provided.

    For more information, see [Authentication parameters](authentication.md).  

    For additional help, use the Get-Help command in PowerShell <br>Get-Help example:  
    ```Get-Help .\InstallSecurityAgent.ps1```

### Check deployment status

- Check the deployment status by running:
    ```sc.exe query "AzureIoTSecurity" ```

### Uninstall the agent

To uninstall the agent, run the PowerShell script with the **-mode** parameter set to **Uninstall**: 

```
.\InstallSecurityAgent.ps1 -Uninstall
``` 

## Troubleshooting

- If the agent fails to start, turn on logging (logging is *off* by default) to get more information.

To turn on logging:

1. Open the configuration file for editing using a standard file editor.

2. Edit the following values:

```<add key="logLevel" value="Debug" />
  <add key="fileLogLevel" value="Debug"/> 
  <add key="diagnosticVerbosityLevel" value="Some" /> 
  <add key="logFilePath" value="IoTAgentLog.log" />```

> [!NOTE]
> We recommend turning logging **off** after troubleshooting is complete. Leaving logging **on** increases log file size and data usage. 

3. Restart the agent by running the following PowerShell or command line:

    - Powershell:
    ```
    Restart-Service "AzureIoTSecurity"
    ```
    -OR-

    - CMD:
    ```
    sc.exe stop "AzureIoTSecurity" 
    sc.exe start "AzureIoTSecurity" 
 ```
4. Review the log file for more information about the failure.

    - The log file is located at: \<wherever you unpacked your agent>/IoTAgentLog.log


## See Also
- [Azure IoT Security preview](overview.md)
- [Authentication](authentication-methods.md)
- [Azure IoT Security alerts](concepts-security-alerts.md)
- [Data access](data-access.md)