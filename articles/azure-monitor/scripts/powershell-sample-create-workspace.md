---
title: Create Log Analytics workspace - Azure PowerShell
description: Azure PowerShell Script Sample -  Create a Log Analytics workspace to
ms.subservice: logs
ms.topic: sample
author: bwren
ms.author: bwren
ms.date: 09/07/2017

---

# Create a Log Analytics workspace with PowerShell

This script gets you up and running quickly with an Azure Log Analytics workspace, which is required if you want to start collecting, analyzing, and taking action on data.  

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-powershell[main](../../../powershell_scripts/log-analytics/log-analytics-create-new-resource/log-analytics-create-new-resource.ps1 "Create new Log Analytics workspace")]

## Script explanation

This script uses following commands to create a new Log Analytics workspace in your  subscription. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Get-AzOperationalInsightsWorkspace](/powershell/module/az.operationalinsights/get-azoperationalinsightsworkspace) | Gets information about an existing workspace. |
| [New-AzOperationalInsightsWorkspace](/powershell/module/az.operationalinsights/new-azoperationalinsightsworkspace) | Creates a workspace in the specified resource group and location. |


## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

