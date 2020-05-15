---
title: Route traffic for HA of applications - Azure PowerShell - Traffic Manager
description: Azure PowerShell script sample - Route traffic for high availability of applications
services: traffic-manager
documentationcenter: traffic-manager
author: rohinkoul
manager: kumudD
editor: 
tags: azure-infrastructure

ms.assetid:
ms.service: traffic-manager
ms.devlang: powershell
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: traffic-manager
ms.date: 04/26/2018
ms.author: rohink
---

# Route traffic for high availability of applications using Azure PowerShell

This script creates a resource group, two app service plans, two web apps, a traffic manager profile, and two traffic manager endpoints. Traffic Manager directs traffic to the application in one region as the primary region, and to the secondary region when the application in the primary region is unavailable. Before executing the script, you must change the MyWebApp, MyWebAppL1 and MyWebAppL2 values to unique values across Azure. After running the script, you can access the app in the primary region with the URL mywebapp.trafficmanager.net.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure), and then run `Connect-AzAccount` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-powershell[main](../../../powershell_scripts/traffic-manager/direct-traffic-for-increased-application-availability/direct-traffic-for-increased-application-availability.ps1 "Route traffic for high availability")]


Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup1
Remove-AzResourceGroup -Name myResourceGroup2
```


## Script explanation

This script uses the following commands to create a resource group, web app, traffic manager profile, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup)  | Creates a resource group in which all resources are stored. |
| [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) | Creates an App Service plan. This is like a server farm for your Azure web app. |
| [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) | Creates an Azure web app within the App Service plan. |
| [Set-AzResource](/powershell/module/az.resources/new-azresource) | Creates an Azure web app within the App Service plan. |
| [New-AzTrafficManagerProfile](/powershell/module/az.trafficmanager/new-aztrafficmanagerprofile) | Creates an Azure Traffic Manager profile. |
| [New-AzTrafficManagerEndpoint](/powershell/module/az.trafficmanager/new-aztrafficmanagerendpoint) | Adds an endpoint to an Azure Traffic Manager Profile. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/azure/overview).

Additional networking PowerShell script samples can be found in the [Azure Networking Overview documentation](../powershell-samples.md?toc=%2fazure%2fnetworking%2ftoc.json).
