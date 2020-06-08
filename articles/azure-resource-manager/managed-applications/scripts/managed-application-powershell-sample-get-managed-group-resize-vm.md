---
title: Get managed resource group & resize VMs - Azure PowerShell
description: Provides Azure PowerShell sample script that gets a managed resource group for an Azure Managed Application. The script resizes VMs.
author: tfitzmac

ms.devlang: powershell
ms.topic: sample
ms.date: 10/27/2017
ms.author: tomfitz
---

# Get resources in a managed resource group and resize VMs with PowerShell

This script retrieves resources from a managed resource group, and resizes the VMs in that resource group.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

[!code-powershell[main](../../../../powershell_scripts/managed-applications/get-application/get-application.ps1 "Get application")]


## Script explanation

This script uses the following commands to deploy the managed application. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [Get-AzManagedApplication](https://docs.microsoft.com/powershell/module/az.resources/get-azmanagedapplication) | List managed applications. Provide resource group name to focus the results. |
| [Get-AzResource](https://docs.microsoft.com/powershell/module/az.resources/get-azresource) | List resources. Provide a resource group and resource type to focus the result. |
| [Update-AzVM](https://docs.microsoft.com/powershell/module/az.compute/update-azvm) | Update a virtual machine's size. |


## Next steps

* For an introduction to managed applications, see [Azure Managed Application overview](../overview.md).
* For more information on PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/azure/get-started-azureps).
