---
title: "PowerShell script: Create a custom role in a lab in Azure DevTest Labs | Microsoft Docs"
description: This PowerShell script adds an external user to a lab in Azure DevTest Labs.  
services: lab-services
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/11/2018
ms.author: spelluru
---

# Use PowerShell to create a custom role in a lab in Azure DevTest Labs

This sample PowerShell script creates a custom role to use in a lab in Azure DevTest Labs. 

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

## Prerequisites
* **A lab**. The script requires you to have an existing lab. 

## Sample script

[!code-powershell[main](../../../powershell_scripts/devtest-lab/create-custom-role-in-lab/create-custom-role-in-lab.ps1 "Add external user to a lab")]

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [Get-AzureRmProviderOperation](/powershell/module/azurerm.resources/get-azurermprovideroperation) | Gets the operations for an Azure resource provider that are securable using Azure RBAC. |
| [Get-AzureRmRoleDefinition](/powershell/module/azurerm.resources/get-azurermroledefinition) | Lists all Azure RBAC roles that are available for assignment. |
| [New-AzureRmRoleDefinition](/powershell/module/azurerm.resources/new-azurermroledefinition) | Creates a custom role. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Lab Services PowerShell script samples can be found in the [Azure Lab Services PowerShell samples](../samples-powershell.md).