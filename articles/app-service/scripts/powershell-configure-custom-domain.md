---
title: Azure PowerShell Script Sample - Assign a custom domain to a web app | Microsoft Docs
description: Azure PowerShell Script Sample - Assign a custom domain to a web app
services: app-service\web
documentationcenter: 
author: msangapu
manager: jeconnoc
editor: 
tags: azure-service-management

ms.assetid: 356f5af9-f62e-411c-8b24-deba05214103
ms.service: app-service-web
ms.workload: web
ms.devlang: na
ms.topic: sample
ms.date: 03/20/2017
ms.author: msangapu
ms.custom: mvc
ms.custom: seodec18
---

# Assign a custom domain to a web app using PowerShell

This sample script creates a web app in App Service with its related resources, and then maps `www.<yourdomain>` to it. 

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Connect-AzAccount` to create a connection with Azure. Also, you need to have access to your domain registrar's DNS configuration page.

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/map-custom-domain/map-custom-domain.ps1?highlight=1 "Assign a custom domain to a web app")]

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
| [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp) | Modifies a web app's configuration. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../samples-powershell.md).
