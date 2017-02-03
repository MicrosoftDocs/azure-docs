---
title: Create an Azure SQL database | Microsoft Docs
description: Quick reference on how to create an Azure SQL database using the Azure portal, PowerShell, Transact-SQL.
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: single databases
ms.devlang: NA
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA
ms.date: 02/01/2017
ms.author: carlrab

---
# Create an Azure SQL database

You can create an Azure SQL database using the [Azure portal](https://portal.azure.com/), PowerShell, Transact-SQL, the REST API or C#. 

## Create an Azure SQL database using the Azure portal

1. Open the **SQL databases** blade in the [Azure portal](https://portal.azure.com/). 

    ![sql databases](./media/sql-database-get-started/sql-databases.png)
2. On the SQL databases blade, click **Add**.

    ![add sql database](./media/sql-database-get-started/add-sql-database.png)

> [!TIP]
> For a getting started tutorial using the Azure portal and SQL Server Management Studio, see [Get started with Azure SQL Database servers, databases and firewall rules by using the Azure portal and SQL Server Management Studio](sql-database-get-started.md).
>

## Create an Azure SQL database using PowerShell

To create a SQL database, use the [New-AzureRmSqlDatabase](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.3.0/new-azurermsqldatabase) cmdlet. The resource group, and server must already exist in your subscription. 

```
$resourceGroupName = "resourcegroup1"
$sqlServerName = "server1"

$databaseName = "database1"
$databaseEdition = "Standard"
$databaseServiceLevel = "S0"

$currentDatabase = New-AzureRmSqlDatabase -ResourceGroupName $resourceGroupName `
 -ServerName $sqlServerName -DatabaseName $databaseName `
 -Edition $databaseEdition -RequestedServiceObjectiveName $databaseServiceLevel
```
> [!TIP]
> For a sample script, see [Create a SQL database PowerShell script](sql-database-get-started-powershell.md).
>

## Create an Azure SQL database using Transact-SQL in SQL Server Management Studio

To create a SQL Database using Transact-SQL in SQL Server Management Studio:

1. Using SQL Server Management Studio, connect to the Azure Database server using the server-level principal login or a login that is a member of the **dbmanager** role. For more information on logins, see [Manage logins](sql-database-manage-logins.md).
2. In Object Explorer, open the Databases node, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.
3. Use the **CREATE DATABASE** statement to create a database. For
  more information, see [CREATE DATABASE (SQL Database)](https://msdn.microsoft.com/library/dn268335.aspx). The following statement creates a database named **myTestDB** and specifies that it is a Standard S0 Edition database with a default maximum size of 250 GB.
  
      CREATE DATABASE myTestDB
      (EDITION='Standard',
       SERVICE_OBJECTIVE='S0');

4. Click **Execute** to run the query.
5. In Object Explorer, right-click the Databases node and click **Refresh** to view the new database in Object Explorer. 

> [!TIP]
> For a getting started tutorial using the Azure portal and SQL Server Management Studio, see [Get started with Azure SQL Database servers, databases and firewall rules by using the Azure portal and SQL Server Management Studio](sql-database-get-started.md).
>

## Additional resources
* For an overview of management tools, see [Overview of management tools](sql-database-manage-overview.md).
* To see how to perform management tasks using the Azure portal, see [Manage Azure SQL Databases using the Azure portal](sql-database-manage-portal.md).
* To see how to perform management tasks using PowerShell, see [Manage Azure SQL Databases using PowerShell](sql-database-manage-powershell.md).
* To see how to perform management tasks using SQL Server Management Studio, see [SQL Server Management Studio](sql-database-manage-azure-ssms.md).
* For information about the SQL Database service, see [What is SQL Database](sql-database-technical-overview.md). 
* For information about Azure Database servers and database features, see [Features](sql-database-features.md).
