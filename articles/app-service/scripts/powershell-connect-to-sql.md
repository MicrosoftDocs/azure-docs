---
title: 'PowerShell: Connect to SQL Database'
description: Learn how to use Azure PowerShell to automate deployment and management of App Service. This sample shows how to connect an app to a SQL Database.
tags: azure-service-management

ms.assetid: 055440a9-fff1-49b2-b964-9c95b364e533
ms.topic: sample
ms.date: 12/06/2022
ms.custom: mvc, devx-track-azurepowershell
---

# Connect an App Service app to SQL Database

In this scenario you will learn how to create a database in Azure SQL Database and an App Service app. Then you will link the database to the app using app settings.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/), and then run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/connect-to-sql/connect-to-sql.ps1?highlight=13 "Connect an app to SQL Database")]

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
| [New-AzSQLServer](/powershell/module/az.sql/new-azsqlserver) | Creates a  server. |
| [New-AzSqlServerFirewallRule](/powershell/module/az.sql/new-azsqlserverfirewallrule) | Creates a server-level firewall rule. |
| [New-AzSQLDatabase](/powershell/module/az.sql/new-azsqldatabase) | Creates a database or an elastic database. |
| [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp) | Modifies an App Service app's configuration. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional Azure PowerShell samples for Azure App Service can be found in the [Azure PowerShell samples](../samples-powershell.md).
