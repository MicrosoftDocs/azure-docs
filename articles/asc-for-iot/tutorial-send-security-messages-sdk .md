---
title: ASC for IoT send security messages SDK  Preview| Microsoft Docs
description: Access the Send Security Messages SDK of ASC for IoT.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: c41af7d5-ee24-423b-9371-83331aca9c72
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/11/2019
ms.author: mlottner

---

# Send Security Messages SDK

> [!IMPORTANT]
> ASC for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains how to use the Send Security Messages SDK for ASC for IoT


```private static async Task SendSecurityMessageAsync()
        {
            string messageContent = "Security Data";
            ModuleClient client = ModuleClient.CreateFromConnectionString("<connection_string>");
            Message  securityMessage = new Message(Encoding.UTF8.GetBytes(messageContent));
            securityMessage.SetAsSecurityMessage();
            await client.SendEventAsync(securityMessage);
        }```
 



## Prerequisites

To deploy the security agent, local admin rights are required on the machine you wish to install on. 

## Installation 

To install deploy the security agent, do the following:

1. To install the ASC for IoT agent on the device, download the most recent version to your machine from the [releases](../../releases) folder.

2. Extract the contents of the package, and navigate to the /Install folder.

3. Open Windows PowerShell. 
    1. Add running permissions to the InstallAgent script by running ```Unblock-File .\InstallSecurityAgent.ps1```
    
    and run:

    ```.\InstallSecurityAgent.ps1 -authenticationIdentity <authentication identity> -authenticationType <authentication type> -filePath <file path> -gwFqdn <gw fqdn> -deviceId <device id>```
    
    The PowerShell script does the following:
    - Installs prerequisites
    - Installs the agent as a System Service

    - Configures the agent with the authentication parameters provided.

    For more information, see [Authentication parameters](authentication.md).  

    For additional help, use the Get-Help command in PowerShell <br>Get-Help example:  
    ```Get-Help .\InstallSecurityAgent.ps1```

### Check deployment status

- Check the deployment status by running:
    ```sc.exe query "ASC IoT Agent" ```

### Uninstall the agent

To uninstall the agent, run the PowerShell script with the **-mode** parameter set to **Uninstall**: 

```
.\InstallSecurityAgent.ps1 -mode Uninstall
``` 

## Troubleshooting

- If the agent fails to start, turn on logging (logging is *off* by default) to get more information.

To turn on logging:

1. Open the configuration file for editing using a standard file editor.

2. Edit the following values:

```<add key="logLevel" value="Debug" />
  <add key="fileLogLevel" value="Debug"/> 
  <add key="diagnosticVerbosityLevel" value="Some" /> 
  <add key="logFilePath" value="IotAgentLog.log" />```

> [!NOTE]
> We recommend turning logging **off** after troubleshooting is complete. Leaving logging **on** increases log file size and data usage. 

3. Restart the agent by running the following PowerShell or command line:

    - Powershell:
    ```
    Restart-Service "ASC IoT Agent"
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
- [ASC for IoT preview](preview.md)
- [Authentication](authentication.md)
- [ASC for IoT alerts](alerts.md)
- [Data access](dataaccess.md)
- [Linux C installation](linuxcinstallation.md)
- [Linux C# installation](linuxc#installation.md)