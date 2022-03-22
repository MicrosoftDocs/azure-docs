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
 - “Unable to determine the target machine type as Azure VM or Arc Server”
 - “Unable to determine that the target machine is an Arc Server”
 - “Unable to determine that the target machine is an Azure VM” 

Resolution:
 - Run ```az account set -s <AzureSubscriptionId>``` where "AzureSubscriptionId" corresponds to the subscription that contains the target resource.



## Server-side issues

## Azure permissions issues

### Incorrect role assignments
This occurs when the current user does not have the proper role assignment on the target resource.

