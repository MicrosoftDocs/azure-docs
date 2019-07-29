---
title: Azure PowerShell Script Sample - Monitor a web app with web server logs | Microsoft Docs
description: Azure PowerShell Script Sample - Monitor a web app with web server logs
services: app-service\web
documentationcenter: 
author: syntaxc4
manager: erikre
editor: 
tags: azure-service-management

ms.assetid: 5805d7cd-9e56-4eba-bd85-75b013690ff5
ms.service: app-service
ms.devlang: multiple
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 03/20/2017
ms.author: cfowler
ms.custom: mvc
---

# Monitor a web app with web server logs

In this scenario you will create a resource group, app service plan, web app and configure the web app to enable web server logs. You will then download the log files for review.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/monitor-with-logs/monitor-with-logs.ps1 "Monitor a web app with web server logs")]

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
| [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp) | Modifies a web app's configuration. |
| [Get-AzWebAppMetric](/powershell/module/az.websites/get-azwebappmetric) | Gets a web app's metrics. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../samples-powershell.md).
