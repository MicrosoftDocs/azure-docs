---
title: 'PowerShell: Create and manage Azure SQL Database servers | Microsoft Docs'
description: Quick reference on how to create and manage Azure SQL Database servers with the PowerShell.
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: servers
ms.devlang: NA
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA
ms.date: 02/06/2017
ms.author: carlrab

---
 
# Create and manage Azure SQL Database servers with PowerShell

You can create and manage Azure SQL Database server with the [Azure portal](https://portal.azure.com/), PowerShell, the REST API, or C#. This topic is about using PowerShell. For the Azure portal, see [Create and manage servers using the Azure portal](sql-database-manage-servers-portal.md). 

## Create an Azure SQL Database server using PowerShell

To create a SQL database server, use the [New-AzureRmSqlServer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.3.0/new-azurermsqlserver) cmdlet. Replace *server1* with the name for your server. Server names must be unique across all Azure SQL database servers. If the server name is already taken, you get an error. This command may take several minutes to complete. The resource group must already exist in your subscription.

```
$resourceGroupName = "resourcegroup1"

$sqlServerName = "server1"
$sqlServerVersion = "12.0"
$sqlServerLocation = "northcentralus"
$serverAdmin = "loginname"
$serverPassword = "password" 
$securePassword = ConvertTo-SecureString -String $serverPassword -AsPlainText -Force
$creds = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $serverAdmin, $securePassword


$sqlServer = New-AzureRmSqlServer -ServerName $sqlServerName `
 -SqlAdministratorCredentials $creds -Location $sqlServerLocation `
 -ResourceGroupName $resourceGroupName -ServerVersion $sqlServerVersion
```

> [!TIP]
> For a sample script, see [Create a SQL database using PowerShell script](sql-database-get-started-powershell.md).
>

## Next steps
* For an overview of management tools, see [Overview of management tools](sql-database-manage-overview.md)
* To see how to perform management tasks using the Azure portal, see [Manage Azure SQL Databases using the Azure portal](sql-database-manage-portal.md)
* To see how to perform management tasks using PowerShell, see [Manage Azure SQL Databases using PowerShell](sql-database-manage-powershell.md)
* To see how to perform additional tasks using SQL Server Management Studio, see [SQL Server Management Studio](sql-database-manage-azure-ssms.md).
* For information about the SQL Database service, see [What is SQL Database](sql-database-technical-overview.md). 
* For information about Azure Database servers and database features, see [Features](sql-database-features.md).
