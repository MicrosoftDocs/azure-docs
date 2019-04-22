---
title: Azure PowerShell Script Sample - Connect an app to a SQL database | Microsoft Docs
description: Azure PowerShell Script Sample - Connect an App Service app to a SQL database
services: app-service\web
documentationcenter: 
author: syntaxc4
manager: erikre
editor: 
tags: azure-service-management

ms.assetid: 055440a9-fff1-49b2-b964-9c95b364e533
ms.service: app-service
ms.devlang: multiple
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 03/20/2017
ms.author: cfowler
ms.custom: mvc
---

# Connect an App Service app to a SQL database

In this scenario you will learn how to create an Azure SQL database and an App Service app. Then you will link the SQL database to the app using app settings.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/connect-to-sql/connect-to-sql.ps1?highlight=13 "Connect an app to a SQL database")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource group, App Service app, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) | Creates an App Service plan. |
| [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) | Creates an App Service app. |
| [New-AzSQLServer](/powershell/module/az.sql/new-azsqlserver) | Creates a SQL Database server. |
| [New-AzSqlServerFirewallRule](/powershell/module/az.sql/new-azsqlserverfirewallrule) | Creates a firewall rule for a SQL Database server. |
| [New-AzSQLDatabase](/powershell/module/az.sql/new-azsqldatabase) | Creates a database or an elastic database. |
| [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp) | Modifies an App Service app's configuration. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure App Service can be found in the [Azure PowerShell samples](../samples-powershell.md).
