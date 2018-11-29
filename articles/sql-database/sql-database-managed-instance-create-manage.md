---
title: Create, manage Azure SQL Managed Instance | Microsoft Docs
description: Learn about creating and managing Azure SQL Database Managed Instances.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: CarlRabeler
ms.author: carlrab
ms.reviewer:
manager: craigg
ms.date: 12/03/2018
---
# Create and manage Azure SQL Database Managed Instances

You can create and manage Azure SQL Database Managed Instances using the Azure portal, PowerShell, Azure CLI, REST API, and Transact-SQL.

## Azure portal: Create a Managed Instance

For a quickstart showing you how to create an Azure SQL Database Managed Instance, see [Quickstart: Create an Azure SQL Database Managed Instance](sql-database-managed-instance-get-started).

## PowerShell: Create and manage a Managed Instance

To create and manage Azure SQL server, databases, and firewalls with Azure PowerShell, use the following PowerShell cmdlets. If you need to install or upgrade PowerShell, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

> [!TIP]
> For PowerShell example scripts, see [Quick-start script: Create Azure SQL Managed Instance using PowerShell library](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2018/06/27/quick-start-script-create-azure-sql-managed-instance-using-powershell/).

| Cmdlet | Description |
| --- | --- |
|[New-AzureRmSqlInstance](https://docs.microsoft.com/powershell/module/azurerm.sql/new-azurermsqlinstance)|Creates an Azure SQL Database Managed Instance |
|[Get-AzureRmSqlInstance](https://docs.microsoft.com/powershell/module/azurerm.sql/Get-AzureRmSqlInstance)|Returns information about Azure SQL Managed Instance|
|[Set-AzureRmSqlInstance](https://docs.microsoft.com/powershell/module/azurerm.sql/Set-AzureRmSqlInstance)|Sets properties for an Azure SQL Database Managed Instance|
|[Remove-AzureRmSqlInstance](https://docs.microsoft.com/powershell/module/azurerm.sql/Remove-AzureRmSqlInstance)|Removes an Azure SQL Managed Database Instance|

## Azure CLI: Manage logical servers and databases

To create and manage Azure SQL server, databases, and firewalls with [Azure CLI](/cli/azure), use the following [Azure CLI SQL Managed Instance](/cli/azure/sql/mi) commands. Use the [Cloud Shell](/azure/cloud-shell/overview) to run the CLI in your browser, or [install](/cli/azure/install-azure-cli) it on macOS, Linux, or Windows.

> [!TIP]
> For an Azure CLI quickstart, see [Working with SQL Managed Instance using Azure CLI](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44). 
>

| Cmdlet | Description |
| --- | --- |
|[az sql mi create](https://docs.microsoft.com/cli/azure/sql/db#az-sql-mi-create) |Creates a Managed Instance|
|[az sql mi list](https://docs.microsoft.com/cli/azure/sql/db#az-sql-mi-list)|Lists available Managed Instances|
|[az sql mi show](/cli/azure/sql/db#az-sql-mi-show)|Get the details for a Managed Instance|
|[az sql mi update](/cli/azure/sql/db#az-sql-mi-update)|Updates a Managed Instance|
|[az sql mi delete](/cli/azure/sql/db#az-sql-mi-delete)|Removes a Managed Instance|

## Transact-SQL: Manage logical servers and databases

To create and manage Azure SQL Database Managed Instance database after the Managed Instance is created, use the following T-SQL commands. You can issue these commands using the Azure portal, [SQL Server Management Studio](/sql/ssms/use-sql-server-management-studio), [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/what-is). [Visual Studio Code](https://code.visualstudio.com/docs), or any other program that can connect to an Azure SQL Database server and pass Transact-SQL commands.

> [!TIP]
> For quickstarts showing you have to configure and connect to a Managed Instance using SQL Server Management Studio on Microsoft Windows, see [Quickstart: Configure Azure VM to connect to an Azure SQL Database Managed Instance](sql-database-managed-instance-configure-vm.md) and [Quickstart: Configure a point-to-site connection to an Azure SQL Database Managed Instance from on-premises](sql-database-managed-instance-configure-p2s.md).

> [!IMPORTANT]
> You cannot create or delete a Managed Instance using Transact-SQL.

| Command | Description |
| --- | --- |
|[CREATE DATABASE](https://docs.microsoft.com/sql/t-sql/statements/create-database-transact-sql?view=azuresqldb-mi-current)|Creates a new Managed Instance database. You must be connected to the master database to create a new database.|
| [ALTER DATABASE](https://docs.microsoft.com/en-us/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-mi-current) |Modifies an Azure SQL Managed Instance database.|

## REST API: Manage logical servers and databases

To create and manage Azure SQL Database Managed Instance, use these REST API requests.

| Command | Description |
| --- | --- |
|[Managed Instances - Create Or Update](https://docs.microsoft.com/rest/api/sql/managedinstances/createorupdate)|Creates or updates a Managed Instance.|
|[Managed Instances - Delete](https://docs.microsoft.com/rest/api/sql/managedinstances/delete)|Deletes a Managed Instance.|
|[Managed Instances - Get](https://docs.microsoft.com/rest/api/sql/managedinstances/get)|Gets a Managed Instance.|
|[Managed Instances - List](https://docs.microsoft.com/rest/api/sql/managedinstances/list)|Returns a list of Managed Instances in a subscription.|
|[Managed Instances - List By Resource Group](https://docs.microsoft.com/rest/api/sql/managedinstances/listbyresourcegroup)|Returns a list of Managed Instances in a resource group.|
|[Managed Instances - Update](https://docs.microsoft.com/rest/api/sql/managedinstances/update)|Updates a Managed Instance.|

## Next steps

- To learn about migrating a SQL Server database to Azure, see [Migrate to Azure SQL Database](sql-database-cloud-migrate.md).
- For information about supported features, see [Features](sql-database-features.md).
