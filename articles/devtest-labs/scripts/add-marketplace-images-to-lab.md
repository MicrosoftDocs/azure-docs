---
title: PowerShell - Add a marketplace image to a lab in Azure DevTest Labs
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
ms.date: 04/22/2020
ms.author: spelluru
---

# Use PowerShell to add a marketplace image to a lab in Azure DevTest Labs

This sample PowerShell script adds a marketplace image to a lab in Azure DevTest Labs. 

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

## Prerequisites
* **A lab**. The script requires you to have an existing lab. 

## Sample script

[!code-powershell[main](../../../powershell_scripts/devtest-lab/add-marketplace-images-to-lab/add-marketplace-images-to-lab.ps1 "Add marketplace images to a lab")]

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| Find-AzResource | Searches for resources based on specified parameters. |
| [Get-AzResource](/powershell/module/az.resources/get-azresource) | Gets resources. |
| [Set-AzResource](/powershell/module/az.resources/set-azresource) | Modifies a resource. |
| [New-AzResource](/powershell/module/az.resources/new-azresource) | Create a resource. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Lab Services PowerShell script samples can be found in the [Azure Lab Services PowerShell samples](../samples-powershell.md).
