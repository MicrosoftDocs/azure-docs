---
title: Azure PowerShell Script-Import-bacpac-SQL database | Microsoft Docs
description: Azure PowerShell Script Sample - Import from a bacpac into a SQL database using PowerShell
services: sql-database
documentationcenter: sql-database
author: janeng
manager: jstrauss
editor: carlrab
tags: azure-service-management

ms.assetid:
ms.service: sql-database
ms.custom: sample
ms.devlang: PowerShell
ms.topic: article
ms.tgt_pltfrm: sql-database
ms.workload: database
ms.date: 03/07/2017
ms.author: janeng
---

# Import from a bacpac into a SQL database using PowerShell

This sample PowerShell script imports a database from a bacpac.  

Before running this script, ensure that a connection with Azure has been created using the `Add-AzureRmAccount` cmdlet.

## Sample script

[!code-powershell[main](../../../powershell_scripts/sql-database/import-from-bacpac/import-from-bacpac.ps1 "Create SQL Database")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the Resource Group, logical server and SQL database.

```powershell
Remove-AzureRmResourceGroup -ResourceGroupName "myResourceGroup"
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup]() | Creates a resource group in which all resources are stored. |
| [New-AzureRmSqlServer]() | Creates a logical server that hosts the SQL Database. |
| [New-AzureRmSqlServerFirewallRule]() | Creates a firewall rule to allow access to all SQL Databases on the server from the entered IP address range. |
| [New-AzureRmSqlDatabase]() | Creates the SQL Database in the logical server. |
| [Remove-AzureRmResourceGroup]() | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional SQL Database PowerShell script samples can be found in the [Azure SQL Database PowerShell scripts](../sql-database-powershell-samples.md).