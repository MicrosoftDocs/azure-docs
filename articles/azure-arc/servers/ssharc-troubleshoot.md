---
title: Troubleshoot SSH access to Azure Arc-enabled servers issues
description: This article tells how to troubleshoot and resolve issues with the SSH access to Arc-enabled servers.
ms.date: 03/21/2022
ms.topic: conceptual
---

# Troubleshoot SSH access to Azure Arc enabled servers

This article provides information on troubleshooting and resolving issues that may occur while attempting to connect to Azure Arc enabled servers via SSH.
For general information, see [SSH access to Arc enabled servers overview](./ssharc-overview.md).

## Client-side issues
These issues are due to errors that occur on the machine that the user is connecting from.

### Incorrect Azure subscription
This occurs when the active subscription for Azure CLI is not the same as the server that is being connected to.
Possible errors:
 - "Unable to determine the target machine type as Azure VM or Arc Server"
 - "Unable to determine that the target machine is an Arc Server"
 - "Unable to determine that the target machine is an Azure VM"
 - "The resource <name> in the resource group <resource group> was not found"

Resolution:
 - Run ```az account set -s <AzureSubscriptionId>``` where "AzureSubscriptionId" corresponds to the subscription that contains the target resource.

### Unable to locate client binaries
This occurs when the client side SSH binaries required to connect cannot be found.
Error:
 - "Could not find <command>.exe

Resolution:
 - Provide the path to the folder that contains the SSH client executables by using the ```--ssh-client-folder``` parameter.

## Server-side issues
### SSH traffic is not allowed on the server
This occurs when SSHD is not running on the server, or SSH traffic is not allowed on the server.
Possible errors:
 - {"level":"fatal","msg":"sshproxy: error copying information from the connection: read tcp 192.168.1.180:60887-\u003e40.122.115.96:443: wsarecv: An existing connection was forcibly closed by the remote host.","time":"2022-02-24T13:50:40-05:00"}

Resolution:
 - Ensure that the SSHD service is running on the Arc-enabled server
 - Ensure that port 22 (or other non-default port) is listed in allowed incomming connections. Run ```azcmagent config list``` on the Arc-enabled server in an elevated session

## Azure permissions issues

### Incorrect role assignments
This occurs when the current user does not have the proper role assignment on the target resource, specifically a lack of "read" permissions.
Possible errors:
 - "Unable to determine the target machine type as Azure VM or Arc Server"
 - "Unable to determine that the target machine is an Arc Server"
 - "Unable to determine that the target machine is an Azure VM"
 - "Permission denied (publickey)." 

Resolution:
 - Ensure that you have contributer or owner permissions on the resource you are connecting to.
 - If using AAD login, ensure you have the "Virtual Machine User Login" or the "Virtual Machine Aministrator Login" roles

### HybridConnectiviry RP was not registered
This occurs when the HybridConnectivity RP has not been registered for the subscription.
Error:
 - Request for Azure Relay Information Failed: (NoRegisteredProviderFound) Code: NoRegisteredProviderFound

Resolution:
 - Run ```az provider register -n Microsoft.HybridConnectivity```
 - Confirm success by running ```az provider show -n Microsoft.HybridConnectivity```, verify that "registrationState" is set to "Registered"
 - Restart the hybrid agent on the Arc-enabled server