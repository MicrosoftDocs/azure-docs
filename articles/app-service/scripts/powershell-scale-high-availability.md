---
title: 'PowerShell: Scale with Traffic Manager'
description: Learn how to use Azure PowerShell to automate deployment and management of App Service. This sample shows how to scale an app worldwide with Traffic Manager.
tags: azure-service-management

ms.assetid: 470f0129-1efe-462c-a029-5c66e04158a8
ms.topic: sample
ms.date: 03/20/2017
ms.custom: mvc
---

# Scale a web app worldwide with a high-availability architecture

In this scenario you will create a resource group, two app service plans, two web apps, a traffic manager profile, and two traffic manager endpoints. Once the exercise is complete you will have a high-available architecture which allows provides global availability of your web app based on the lowest network latency.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/scale-geographic/scale-geographic.ps1 "Scale a web app worldwide with a high-availability architecture")]

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
| [New-AzTrafficManagerProfile](/powershell/module/az.trafficmanager/new-aztrafficmanagerprofile) | Creates a Traffic Manager profile. |
| [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) | Creates an App Service plan. |
| [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) | Creates a web app. |
| [New-AzTrafficManagerEndpoint](/powershell/module/az.trafficmanager/new-aztrafficmanagerendpoint) | Creates an endpoint in a Traffic Manager profile. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../samples-powershell.md).
