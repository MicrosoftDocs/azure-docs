---
title: Windows installation of ATP for IoT agent Preview| Microsoft Docs
description: Learn about how to install ATP for IoT agent on 32bit or 64bit Windows devices.
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

# ATP for IoT C#-based security agent deployment for Windows

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains how to install the ATP for IoT C#-based security agent on Windows.
For other platforms and agent flavours, see [Choose the right security agent](tutorial-deploy-agent.md).

## Prerequisites

1. To deploy the security agent, local admin rights are required on the machine you wish to install on. 

1. [Create a security module](quickstart-create-security-twin.md) for the device.

## Installation 

To install the security agent, do the following:

1. To install the ATP for IoT agent on the device, download the most recent version to your machine from the ATP for IoT GitHub repository(../../releases) folder.

2. Extract the contents of the package, and navigate to the /Install folder.

3. Open Windows PowerShell. 
    1. Add running permissions to the InstallSecurityAgent script by running ```Unblock-File .\InstallSecurityAgent.ps1```
    
    and run:

    ```
	.\InstallSecurityAgent.ps1 -Install -aui <authentication identity> -aum <authentication method> -f <file path> -hn <host name> -di <device id> -cl <certificate location kind>
	```
	
	See [How to configure authentication](concept-security-agent-authentication-methods.md) for more information about authentication parameters.

This script does the following:

- Installs prerequisites.

- Adds a service user (with interactive login disabled).

- Installs the agent as a **System Service**.

- Configures the agent with the provided authentication parameters.


For additional help, use the Get-Help command in PowerShell <br>Get-Help example:  
```Get-Help .\InstallSecurityAgent.ps1```

### Check deployment status

Check the deployment status by running:
```sc.exe query "ASC IoT Agent" ```

### Uninstall the agent

To uninstall the agent, run the PowerShell script with the **-mode** parameter set to **Uninstall**: 

```
.\InstallSecurityAgent.ps1 -Uninstall
``` 

## Troubleshooting

If the agent fails to start, turn on logging (logging is *off* by default) to get more information.

To turn on logging:

1. Open the configuration file for editing using a standard file editor.

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

   - Powershell:
	 ```
	 Restart-Service "ASC IoT Agent"
	 ```
	 
   OR

   - CMD:
	 ```
	 sc.exe stop "ASC IoT Agent" 
	 sc.exe start "ASC IoT Agent" 
	 ```

1. Review the log file for more information about the failure.

   The log file is located at: `<unpacked_agent_location>/IoTAgentLog.log`


## See Also
- [Overview](overview.md)
- [Architecture](architecture.md)
- [Onboarding](quickstart-onboard-iot-hub.md)
- [ATP for IoT FAQ](resources-frequently-asked-questions.md)
- [Understanding ATP for IoT alerts](concept-security-alerts.md)