---
title: SSH access to Azure Arc-enabled servers with PowerShell remoting
description: Use PowerShell remoting over SSH to access and manage Azure Arc-enabled servers.
ms.date: 04/08/2024
ms.topic: conceptual
ms.custom: references_regions
---

# PowerShell remoting to Azure Arc-enabled servers
SSH for Arc-enabled servers enables SSH based connections to Arc-enabled servers without requiring a public IP address or additional open ports.
[PowerShell remoting over SSH](/powershell/scripting/security/remoting/ssh-remoting-in-powershell) is available for Windows and Linux machines.

## Prerequisites
To leverage PowerShell remoting over SSH access to Azure Arc-enabled servers, ensure the following:
 - Ensure the requirements for SSH access to Azure Arc-enabled servers are met.
 - Ensure the requirements for PowerShell remoting over SSH are met.
 - The Azure PowerShell module or the Azure CLI extension for connecting to Arc machines is present on the client machine.

## How to connect via PowerShell remoting
Follow the below steps to connect via PowerShell remoting to an Arc-enabled server.

#### [Generate a SSH config file with Azure CLI:](#tab/azure-cli)
```bash
az ssh config --resource-group <myRG> --name <myMachine> --local-user <localUser> --resource-type Microsoft.HybridCompute --file <SSH config file>
```
 
#### [Generate a SSH config file with Azure PowerShell:](#tab/azure-powershell)
 ```powershell
Export-AzSshConfig -ResourceGroupName <myRG> -Name <myMachine> -LocalUser <localUser> -ResourceType Microsoft.HybridCompute/machines -ConfigFilePath <SSH config file>
```
 ---

#### Find newly created entry in the SSH config file
Open the created or modified SSH config file. The entry should have a similar format to the following.
```powershell
Host <myRG>-<myMachine>-<localUser>
	HostName <myMachine>
	User <localUser>
	ProxyCommand "<path to proxy>\.clientsshproxy\sshProxy_windows_amd64_1_3_022941.exe" -r "<path to relay info>\az_ssh_config\<myRG>-<myMachine>\<myRG>-<myMachine>-relay_info"
```
#### Leveraging the -Options parameter
Levering the [options](/powershell/module/microsoft.powershell.core/new-pssession#-options) parameter allows you to specify a hashtable of SSH options used when connecting to a remote SSH-based session.
Create the hashtable by following the below format. Be mindful of the locations of quotation marks.
```powershell
$options = @{ProxyCommand = '"<path to proxy>\.clientsshproxy\sshProxy_windows_amd64_1_3_022941.exe -r <path to relay info>\az_ssh_config\<myRG>-<myMachine>\<myRG>-<myMachine>-relay_info"'}
```
Next leverage the options hashtable in a PowerShell remoting command.
```powershell
New-PSSession -HostName <myMachine> -UserName <localUser> -Options $options
```

## Next steps

- Learn about [OpenSSH for Windows](/windows-server/administration/openssh/openssh_overview)
- Learn about troubleshooting [SSH access to Azure Arc-enabled servers](ssh-arc-troubleshoot.md).
- Learn about troubleshooting [agent connection issues](troubleshoot-agent-onboard.md).
