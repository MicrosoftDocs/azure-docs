---
title: Troubleshoot SSH access to Azure Arc-enabled servers issues
description: This article tells how to troubleshoot and resolve issues with the SSH access to Arc-enabled servers.
ms.date: 04/30/2023
ms.topic: conceptual
---

# Troubleshoot SSH access to Azure Arc enabled servers

This article provides information on troubleshooting and resolving issues that may occur while attempting to connect to Azure Arc enabled servers via SSH.
For general information, see [SSH access to Arc enabled servers overview](./ssh-arc-overview.md).

## Client-side issues
These issues are due to errors that occur on the machine that the user is connecting from.

### Incorrect Azure subscription
If you receive an error "Authorization Error" or a "Resource Not Found" error for the target resource, check that the correct active subscription is setup using: `az account set -s` for Azure CLI or `Set-AzContext -Subscription` for Azure PowerShell.

### Unable to locate client binaries
This issue occurs when the client side SSH binaries required to connect can't be found.
Error:
 - "Failed to create ssh key file with error: \<ERROR\>."
 - "Failed to run ssh command with error: \<ERROR\>."
 - "Failed to get certificate info with error: \<ERROR\>."
 - "Failed to create ssh key file with error: [WinError 2] The system cannot find the file specified."
 - "Failed to create ssh key file with error: [Errno 2] No such file or directory: 'ssh-keygen'."

Resolution:
 - Provide the path to the folder that contains the SSH client executables by using the ```--ssh-client-folder``` parameter.

## Server-side issues
### SSH traffic isn't allowed on the server
This issue occurs when SSHD isn't running on the server, or SSH traffic isn't allowed on the server.
Possible errors:
 - {"level":"fatal","msg":"sshproxy: error copying information from the connection: read tcp 192.168.1.180:60887-\u003e40.122.115.96:443: wsarecv: An existing connection was forcibly closed by the remote host.","time":"2022-02-24T13:50:40-05:00"}

Resolution:
 - Ensure that the SSHD service is running on the Arc-enabled server.
 - Ensure that the functionality is enabled on your Arc-enabled server on port 22 (or other non-default port) 

#### [Azure CLI](#tab/azure-cli)

```az rest --method put --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default/serviceconfigurations/SSH?api-version=2023-03-15 --body '{\"properties\": {\"serviceName\": \"SSH\", \"port\": \"22\"}}'```

#### [Azure PowerShell](#tab/azure-powershell)

```Invoke-AzRestMethod -Method put -Path https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default/serviceconfigurations/SSH?api-version=2023-03-15 -Payload '{\"properties\": {\"serviceName\": \"SSH\", \"port\": \"22\"}}'```

---
   
## Azure permissions issues

### Incorrect role assignments
This issue occurs when the current user doesn't have the proper role assignment on the target resource, specifically a lack of "read" permissions.
Possible errors:
 - "Unable to determine the target machine type as Azure VM or Arc Server"
 - "Unable to determine that the target machine is an Arc Server"
 - "Unable to determine that the target machine is an Azure VM"
 - "Permission denied (publickey)." 
 - "Request for Azure Relay Information Failed: (AuthorizationFailed) The client '\<user name\>' with object id '\<ID\>' does not have authorization to perform action 'Microsoft.HybridConnectivity/endpoints/listCredentials/action' over scope '/subscriptions/\<Subscription ID\>/resourceGroups/\<Resource Group\>/providers/Microsoft.HybridCompute/machines/\<Machine Name\>/providers/Microsoft.HybridConnectivity/endpoints/default' or the scope is invalid. If access was recently granted, please refresh your credentials."

Resolution:
 - Ensure that you have Contributor or Owner permissions on the resource you're connecting to.
 - If using Azure AD login, ensure you have the Virtual Machine User Login or the Virtual Machine Administrator Login roles

### HybridConnectivity RP wasn't registered
This issue occurs when the HybridConnectivity RP has not been registered for the subscription.
Error:
 - Request for Azure Relay Information Failed: (NoRegisteredProviderFound) Code: NoRegisteredProviderFound

Resolution:
 - Run ```az provider register -n Microsoft.HybridConnectivity```
 - Confirm success by running ```az provider show -n Microsoft.HybridConnectivity```, verify that "registrationState" is set to "Registered"
 - Restart the hybrid agent on the Arc-enabled server

 ## Disable SSH to Arc-enabled servers
 This functionality can be disabled by completing the following actions:
  - Remove the SSH port and functionality from the Arc-enabled server: ```az rest --method delete --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default/serviceconfigurations/SSH?api-version=2023-03-15 --body '{\"properties\": {\"serviceName\": \"SSH\", \"port\": \"22\"}}'```
  - Delete the default connectivity endpoint: ```az rest --method delete --uri https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resourcegroup>/providers/Microsoft.HybridCompute/machines/<arc enabled server name>/providers/Microsoft.HybridConnectivity/endpoints/default?api-version=2021-10-06-preview```
