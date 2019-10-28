---
title: "PowerShell script: Add an external user to a lab in Azure DevTest Labs | Microsoft Docs"
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

# Use PowerShell to add an external user to a lab in Azure DevTest Labs

This sample PowerShell script adds an external user to a lab in Azure DevTest Labs. 

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

## Prerequisites
* **A lab**. The script requires you to have an existing lab. 

## Sample script

[!code-powershell[main](../../../powershell_scripts/devtest-lab/add-external-user-to-lab/add-external-user-to-custom-lab.ps1 "Add external user to a lab")]

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [Get-AzADUser](/powershell/module/az.resources/get-azaduser) | Retries the user object from Azure active directory. |
| [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) | Assigns the specified role to the specified principal, at the specified scope. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Lab Services PowerShell script samples can be found in the [Azure Lab Services PowerShell samples](../samples-powershell.md).
