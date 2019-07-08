---
title: Windows installation of Azure Security Center for IoT agent Preview| Microsoft Docs
description: Learn about how to install Azure Security Center for IoT agent on 32-bit or 64-bit Windows devices.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: 2cf6a49b-5d35-491f-abc3-63ec24eb4bc2
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/19/2019
ms.author: mlottner

---

# Deploy an Azure Security Center for IoT C#-based security agent for Windows

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This guide explains how to install the Azure Security Center (ASC) for IoT C#-based security agent on Windows.

In this guide, you learn how to: 
> [!div class="checklist"]
> * Install
> * Verify deployment
> * Uninstall the agent
> * Troubleshoot 

## Prerequisites

For other platforms and agent flavours, see [Choose the right security agent](how-to-deploy-agent.md).

1. Local admin rights on the machine you wish to install on. 

1. [Create a security module](quickstart-create-security-twin.md) for the device.

## Installation 

To install the security agent, do the following:

1. To install the ASC for IoT Windows C# agent on the device, download the most recent version to your machine from the ASC for IoT [GitHub repository](https://github.com/Azure/Azure-IoT-Security-Agent-CS).

2. Extract the contents of the package, and navigate to the /Install folder.

3. Open Windows PowerShell as Administrator. 
    1. Add running permissions to the InstallSecurityAgent script by running
    ```Unblock-File .\InstallSecurityAgent.ps1```
    
        and run:

    ```
	.\InstallSecurityAgent.ps1 -Install -aui <authentication identity> -aum <authentication method> -f <file path> -hn <host name> -di <device id> -cl <certificate location kind>
	```
	
	For example:
	
    ```
	.\InstallSecurityAgent.ps1 -Install -aui Device -aum SymmetricKey -f c:\Temp\Key.txt -hn MyIotHub.azure-devices.net -di Mydevice1 -cl store
	```
	
	See [How to configure authentication](concept-security-agent-authentication-methods.md) for more information about authentication parameters.

This script does the following:

- Installs prerequisites.

- Adds a service user (with interactive login disabled).

- Installs the agent as a **System Service**.

- Configures the agent with the provided authentication parameters.


For additional help, use the Get-Help command in PowerShell <br>Get-Help example:  
    ```Get-Help .\InstallSecurityAgent.ps1```

### Verify deployment status

- Check the agent deployment status by running:<br>
    ```sc.exe query "ASC IoT Agent"```

### Uninstall the agent

To uninstall the agent:

1. Run the following PowerShell script with the **-mode** parameter set to **Uninstall**.  

    ```
    .\InstallSecurityAgent.ps1 -Uninstall
    ``` 

## Troubleshooting

If the agent fails to start, turn on logging (logging is *off* by default) to get more information.

To turn on logging:

1. Open the configuration file (General.config) for editing using a standard file editor.

1. Edit the following values:

   ```xml
   <add key="logLevel" value="Debug" />
   <add key="fileLogLevel" value="Debug"/> 
   <add key="diagnosticVerbosityLevel" value="Some" /> 
   <add key="logFilePath" value="IoTAgentLog.log" />
   ```

    > [!NOTE]
    > We recommend turning logging **off** after troubleshooting is complete. Leaving logging **on** increases log file size and data usage. 

1. Restart the agent by running the following PowerShell or command line:

    **Powershell**
	 ```
	 Restart-Service "ASC IoT Agent"
	 ```
	 
   or

    **CMD**
	 ```
	 sc.exe stop "ASC IoT Agent" 
	 sc.exe start "ASC IoT Agent" 
	 ```

1. Review the log file for more information about the failure.

   Log file location: `%WinDir%/System32/IoTAgentLog.log`


## Next steps
- Read the ASC for IoT service [Overview](overview.md)
- Learn more about ASC for IoT [Architecture](architecture.md)
- Enable the [service](quickstart-onboard-iot-hub.md)
- Read the [FAQ](resources-frequently-asked-questions.md)
- Understand [alerts](concept-security-alerts.md)