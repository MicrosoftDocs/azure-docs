---
title: Troubleshoot SSH access to Azure Arc-enabled servers
description: Learn how to troubleshoot and resolve issues with SSH access to Arc-enabled servers.
ms.date: 07/01/2023
ms.topic: conceptual
---

# Troubleshoot SSH access to Azure Arc-enabled servers

This article provides information on troubleshooting and resolving issues that may occur while attempting to connect to Azure Arc-enabled servers via SSH.
For general information, see [SSH access to Arc-enabled servers overview](./ssh-arc-overview.md).

## Client-side issues

These issues are due to errors that occur on the machine that the user is connecting from.

### Unable to locate client binaries

This issue occurs when the client side SSH binaries required to connect aren't found. Possible errors:

- `Failed to create ssh key file with error: \<ERROR\>.`
- `Failed to run ssh command with error: \<ERROR\>.`
- `Failed to get certificate info with error: \<ERROR\>.`
- `Failed to create ssh key file with error: [WinError 2] The system cannot find the file specified.`
- `Failed to create ssh key file with error: [Errno 2] No such file or directory: 'ssh-keygen'.`

Resolution:

- Provide the path to the folder that contains the SSH client executables by using the ```--ssh-client-folder``` parameter.
- Ensure that the folder is in the PATH environment variable for Azure PowerShell

### Azure PowerShell module version mismatch 
This issue occurs when the installed Azure PowerShell submodule, Az.Ssh.ArcProxy, isn't supported by the installed version of Az.Ssh. Error:

- `This version of Az.Ssh only supports version 1.x.x of the Az.Ssh.ArcProxy PowerShell Module. The Az.Ssh.ArcProxy module {ModulePath} version is {ModuleVersion}, and it is not supported by this version of the Az.Ssh module. Check that this version of Az.Ssh is the latest available.`

Resolution:

- Update the Az.Ssh and Az.Ssh.ArcProxy modules

### Az.Ssh.ArcProxy not installed
This issue occurs when the proxy module isn't found on the client machine. Error:

- `Failed to find the PowerShell module Az.Ssh.ArcProxy installed in this machine. You must have the Az.Ssh.Proxy PowerShell module installed in the client machine in order to connect to Azure Arc resources. You can find the module in the PowerShell Gallery (see: https://aka.ms/PowerShellGallery-Az.Ssh.ArcProxy).`

Resolution:

- Install the module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.Ssh.ArcProxy): `Install-Module -Name Az.Ssh.ArcProxy`

### User doesn't have permissions to execute proxy
This issue happens when the user doesn't have permissions to execute the SSH proxy that is used to connect.  Errors:

- `/bin/bash: line 1: exec: /usr/local/share/powershell/Modules/Az.Ssh.ArcProxy/1.0.0/sshProxy_linux_amd64_1.3.022941: cannot execute: Permission denied`
- `CreateProcessW failed error:5 posix_spawnp: Input/output error`

Resolution:

- Ensure that the user has permissions to execute the proxy file.

## Server-side issues

### Unable to connect after the public preview
If the user had participated in the public preview and has updated their Arc agent and the Azure CLI/PowerShell to the general availability releases, then the connectivity may fail.

Resolution:

- Re-enable the functionality on the [Azure Arc-enabled servers](ssh-arc-overview.md).

### SSH traffic not allowed on the server
This issue occurs when SSHD isn't running on the server, or SSH traffic isn't allowed on the server. Error:

- `{"level":"fatal","msg":"sshproxy: error copying information from the connection: read tcp 192.168.1.180:60887-\u003e40.122.115.96:443: wsarecv: An existing connection was forcibly closed by the remote host.","time":"2022-02-24T13:50:40-05:00"}`
- `{"level":"fatal","msg":"sshproxy: error connecting to the address: 503 connection to localhost:22 failed: dial tcp [::1]:22: connectex: No connection could be made because the target machine actively refused it.. websocket: bad handshake","proxyVersion":"1.3.022941"}`
- `SSH connection is not enabled in the target port {Port}. `

Resolution:
 - Ensure that the SSHD service is running on the Arc-enabled server.
 - Ensure that the functionality is enabled on your Arc-enabled server on port 22 (or other nondefault port) 

#### [Azure CLI](#tab/azure-cli)

```az rest --method put --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default/serviceconfigurations/SSH?api-version=2023-03-15 --body '{\"properties\": {\"serviceName\": \"SSH\", \"port\": \"22\"}}'```

#### [Azure PowerShell](#tab/azure-powershell)

```Invoke-AzRestMethod -Method put -Path /subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default/serviceconfigurations/SSH?api-version=2023-03-15 -Payload '{"properties": {"serviceName": "SSH", "port": "22"}}'```

---
   
## Azure permissions issues
### Incorrect role assignments to enable SSH connectivity
This issue occurs when the current user doesn't have the proper role assignment to make contributions to the target resource. Error:

- `Client is not authorized to create a Default connectivity endpoint for {Name} in the Resource Group {ResourceGroupName}. This is a one-time operation that must be performed by an account with Owner or Contributor role to allow connections to target resource`

Resolution:
- Ensure that you have the Owner or Contributor role on the resource or contact the owner/contributor of the resource to set up SSH connectivity.

### Incorrect role assignments to connect
This issue occurs when the current user doesn't have the proper role assignment on the target resource, specifically a lack of `read` permissions. Possible errors:

- `Unable to determine the target machine type as Azure VM or Arc Server`
- `Unable to determine that the target machine is an Arc Server`
- `Unable to determine that the target machine is an Azure VM`
- `Permission denied (publickey).`
- `Request for Azure Relay Information Failed: (AuthorizationFailed) The client '\<user name\>' with object id '\<ID\>' does not have authorization to perform action 'Microsoft.HybridConnectivity/endpoints/listCredentials/action' over scope '/subscriptions/\<Subscription ID\>/resourceGroups/\<Resource Group\>/providers/Microsoft.HybridCompute/machines/\<Machine Name\>/providers/Microsoft.HybridConnectivity/endpoints/default' or the scope is invalid. If access was recently granted, please refresh your credentials.`

Resolution:
- Ensure that you have the Virtual Machine Local user Login role on the resource you're connecting to. If using Azure AD login, ensure you have the Virtual Machine User Login or the Virtual Machine Administrator Login roles and that the Azure AD SSH Login extension is installed on the Arc-Enabled Server.

### HybridConnectivity RP not registered

This issue occurs when the HybridConnectivity resource provider isn't registered for the subscription. Error:

- Request for Azure Relay Information Failed: (NoRegisteredProviderFound) Code: NoRegisteredProviderFound

Resolution:

- Run ```az provider register -n Microsoft.HybridConnectivity```
- Confirm success by running ```az provider show -n Microsoft.HybridConnectivity```, verify that `registrationState` is set to `Registered`
- Restart the hybrid agent on the Arc-enabled server


 ## Disable SSH to Arc-enabled servers
 
 This functionality can be disabled by completing the following actions:

 #### [Azure CLI](#tab/azure-cli)
 
  - Remove the SSH port and functionality from the Arc-enabled server: ```az rest --method delete --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default/serviceconfigurations/SSH?api-version=2023-03-15 --body '{\"properties\": {\"serviceName\": \"SSH\", \"port\": \"22\"}}'```

  - Delete the default connectivity endpoint: ```az rest --method delete --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default?api-version=2023-03-15```

#### [Azure PowerShell](#tab/azure-powershell)

  - Remove the SSH port and functionality from the Arc-enabled server: ```Invoke-AzRestMethod -Method delete -Path /subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default/serviceconfigurations/SSH?api-version=2023-03-15 -Payload '{"properties": {"serviceName": "SSH", "port": "22"}}'```

  - Delete the default connectivity endpoint: ```Invoke-AzRestMethod -Method delete -Path /subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default?api-version=2023-03-15```

---

## Next steps

- Learn about SSH access to [Azure Arc-enabled servers](ssh-arc-overview.md).
- Learn about troubleshooting [agent connection issues](troubleshoot-agent-onboard.md).

