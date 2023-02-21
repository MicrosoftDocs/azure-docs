---
title: 'PowerShell: Scale a web app manually'
description: Learn how to use Azure PowerShell to automate deployment and management of App Service. This sample shows how to scale an app manually.
author: msangapu-msft
tags: azure-service-management

ms.assetid: de5d4285-9c7d-4735-a695-288264047375
ms.topic: sample
ms.date: 12/06/2022
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurepowershell
---

# Scale a web app manually using PowerShell

In this scenario you will learn to create a resource group, app service plan and web app. You will then scale the App Service Plan from a single instance to multiple instances.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/), and then run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/scale-manual/scale-manual.ps1 "Scale a web app manually")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource group, web app, and all related resources.

```powershell
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) | Creates an App Service plan. |
| [Set-AzAppServicePlan](/powershell/module/az.websites/set-azappserviceplan) | Modifies an App Service plan's configuration. |
| [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) | Creates a web app. |
| [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp) | Modifies a web app's configuration. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional Azure PowerShell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../samples-powershell.md).
