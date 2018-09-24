---
title: "PowerShell script: Add a marketplace image to a lab in Azure DevTest Labs | Microsoft Docs"
description: This PowerShell script adds a marketplace image to a lab in Azure DevTest Labs.
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

# Use PowerShell to add a marketplace image to a lab in Azure DevTest Labs

This sample PowerShell script adds a marketplace image to a lab in Azure DevTest Labs. 

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

## Prerequisites
* **A lab**. The script requires you to have an existing lab. 

## Sample script

[!code-powershell[main](../../../powershell_scripts/devtest-lab/add-marketplace-images-to-lab/add-marketplace-images-to-lab.ps1 "Add marketplace images to a lab")]

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [Find-AzureRmResource](/powershell/module/azurerm.resources/find-azurermresource) | Searches for resources based on specified parameters. |
| [Get-AzureRmResource](/powershell/module/azurerm.resources/get-azurermresource) | Gets resources. |
| [Set-AzureRmResource](/powershell/module/azurerm.resources/set-azurermresource) | Modifies a resource. |
| [New-AzureRmResource](/powershell/module/azurerm.resources/new-azurermresource) | Create a resource. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Lab Services PowerShell script samples can be found in the [Azure Lab Services PowerShell samples](../samples-powershell.md).
