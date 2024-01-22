---
title: 'PowerShell: Deploy code to staging slot'
description: Learn how to use Azure PowerShell to automate deployment and management of App Service. This sample shows how to deploy code to a staging environment.
tags: azure-service-management

ms.assetid: 27cf0680-c3a9-4a58-9f71-6dec09f6b874
ms.topic: sample
ms.date: 12/06/2022
ms.custom: mvc, devx-track-azurepowershell
---

# Create a web app and deploy code to a staging environment

This sample script creates a web app in App Service with an additional deployment slot called "staging", and then deploys a sample app to the "staging" slot.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/), and then run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/deploy-deployment-slot/deploy-deployment-slot.ps1?highlight=1 "Create a web app and deploy code to a staging environment")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource group, web app, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) | Creates an App Service plan. |
| [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) | Creates a web app. |
| [Set-AzAppServicePlan](/powershell/module/az.websites/set-azappserviceplan) | Modifies an App Service plan to change its pricing tier. |
| [New-AzWebAppSlot](/powershell/module/az.websites/new-azwebappslot) | Creates a deployment slot for a web app. |
| [Set-AzResource](/powershell/module/az.resources/set-azresource) | Modifies a resource in a resource group. |
| [Switch-AzWebAppSlot](/powershell/module/az.websites/switch-azwebappslot) | Swaps a web app's deployment slot into production. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional Azure PowerShell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../samples-powershell.md).
