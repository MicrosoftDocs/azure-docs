---
title: Management API reference for Azure SQL Database Managed Instance | Microsoft Docs
description: Learn about creating and managing Azure SQL Database Managed Instances.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
manager: craigg
ms.date: 03/12/2019
---
# Managed API reference for Azure SQL Database Managed Instances

You can create and manage Azure SQL Database Managed Instances using the Azure portal, PowerShell, Azure CLI, REST API, and Transact-SQL. In this article, you can find an overview of functions and API that you can use to create and configure Managed Instance.

## Azure portal: Create a managed instance

For a quickstart showing you how to create an Azure SQL Database Managed Instance, see [Quickstart: Create an Azure SQL Database Managed Instance](sql-database-managed-instance-get-started.md).

## PowerShell: Create and manage managed instances

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical.

To create and manage managed instances with Azure PowerShell, use the following PowerShell cmdlets. If you need to install or upgrade PowerShell, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

> [!TIP]
> For PowerShell example scripts, see [Quick-start script: Create Azure SQL Managed Instance using PowerShell library](https://blogs.msdn.microsoft.com/sqlserverstorageengine/20../../quick-start-script-create-azure-sql-managed-instance-using-powershell/).

| Cmdlet | Description |
| --- | --- |
|[New-AzSqlInstance](https://docs.microsoft.com/powershell/module/az.sql/new-azsqlinstance)|Creates an Azure SQL Database Managed Instance |
|[Get-AzSqlInstance](https://docs.microsoft.com/powershell/module/az.sql/get-azsqlinstance)|Returns information about Azure SQL Managed Instance|
|[Set-AzSqlInstance](https://docs.microsoft.com/powershell/module/az.sql/set-azsqlinstance)|Sets properties for an Azure SQL Database Managed Instance|
|[Remove-AzSqlInstance](https://docs.microsoft.com/powershell/module/az.sql/remove-azsqlinstance)|Removes an Azure SQL Managed Database Instance|
|[New-AzSqlInstanceDatabase](https://docs.microsoft.com/powershell/module/az.sql/new-azsqlinstancedatabase)|Creates an Azure SQL Database Managed Instance database|
|[Get-AzSqlInstanceDatabase](https://docs.microsoft.com/powershell/module/az.sql/get-azsqlinstancedatabase)|Returns information about Azure SQL Managed Instance database|
|[Remove-AzSqlInstanceDatabase](https://docs.microsoft.com/powershell/module/az.sql/remove-azsqlinstancedatabase)|Removes an Azure SQL Managed Database Instance database|
|[Restore-AzSqlInstanceDatabase](https://docs.microsoft.com/powershell/module/az.sql/restore-azsqlinstancedatabase)|Restores an Azure SQL Managed Database Instance database|

## Azure CLI: Create and manage managed instances

To create and manage managed instances with [Azure CLI](/cli/azure), use the following [Azure CLI SQL Managed Instance](/cli/azure/sql/mi) commands. Use the [Cloud Shell](/azure/cloud-shell/overview) to run the CLI in your browser, or [install](/cli/azure/install-azure-cli) it on macOS, Linux, or Windows.

> [!TIP]
> For an Azure CLI quickstart, see [Working with SQL Managed Instance using Azure CLI](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44).

| Cmdlet | Description |
| --- | --- |
|[az sql mi create](https://docs.microsoft.com/cli/azure/sql/mi#az-sql-mi-create) |Creates a Managed Instance|
|[az sql mi list](https://docs.microsoft.com/cli/azure/sql/mi#az-sql-mi-list)|Lists available Managed Instances|
|[az sql mi show](https://docs.microsoft.com/cli/azure/sql/mi#az-sql-mi-show)|Get the details for a Managed Instance|
|[az sql mi update](https://docs.microsoft.com/cli/azure/sql/mi#az-sql-mi-update)|Updates a Managed Instance|
|[az sql mi delete](https://docs.microsoft.com/cli/azure/sql/mi#az-sql-mi-delete)|Removes a Managed Instance|
|[az sql midb create](https://docs.microsoft.com/cli/azure/sql/midb#az-sql-midb-create) |Creates a managed database|
|[az sql midb list](https://docs.microsoft.com/cli/azure/sql/midb#az-sql-midb-list)|Lists available managed databases|
|[az sql midb restore](https://docs.microsoft.com/cli/azure/sql/midb#az-sql-midb-restore)|Restore a managed database|
|[az sql midb delete](https://docs.microsoft.com/cli/azure/sql/midb#az-sql-midb-delete)|Removes a managed database|

## Transact-SQL: Create and manage instance databases

To create and manage instance database after the Managed Instance is created, use the following T-SQL commands. You can issue these commands using the Azure portal, [SQL Server Management Studio](/sql/ssms/use-sql-server-management-studio), [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/what-is). [Visual Studio Code](https://code.visualstudio.com/docs), or any other program that can connect to an Azure SQL Database server and pass Transact-SQL commands.

> [!TIP]
> For quickstarts showing you have to configure and connect to a Managed Instance using SQL Server Management Studio on Microsoft Windows, see [Quickstart: Configure Azure VM to connect to an Azure SQL Database Managed Instance](sql-database-managed-instance-configure-vm.md) and [Quickstart: Configure a point-to-site connection to an Azure SQL Database Managed Instance from on-premises](sql-database-managed-instance-configure-p2s.md).
> [!IMPORTANT]
> You cannot create or delete a Managed Instance using Transact-SQL.

| Command | Description |
| --- | --- |
|[CREATE DATABASE](https://docs.microsoft.com/sql/t-sql/statements/create-database-transact-sql?view=azuresqldb-mi-current)|Creates a new Managed Instance database. You must be connected to the master database to create a new database.|
| [ALTER DATABASE](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-mi-current) |Modifies an Azure SQL Managed Instance database.|

## REST API: Create and manage managed instances

To create and manage Managed Instances, use these REST API requests.

| Command | Description |
| --- | --- |
|[Managed Instances - Create Or Update](https://docs.microsoft.com/rest/api/sql/managedinstances/createorupdate)|Creates or updates a Managed Instance.|
|[Managed Instances - Delete](https://docs.microsoft.com/rest/api/sql/managedinstances/delete)|Deletes a Managed Instance.|
|[Managed Instances - Get](https://docs.microsoft.com/rest/api/sql/managedinstances/get)|Gets a Managed Instance.|
|[Managed Instances - List](https://docs.microsoft.com/rest/api/sql/managedinstances/list)|Returns a list of Managed Instances in a subscription.|
|[Managed Instances - List By Resource Group](https://docs.microsoft.com/rest/api/sql/managedinstances/listbyresourcegroup)|Returns a list of Managed Instances in a resource group.|
|[Managed Instances - Update](https://docs.microsoft.com/rest/api/sql/managedinstances/update)|Updates a Managed Instance.|

## Next steps

- To learn about migrating a SQL Server database to Azure, see [Migrate to Azure SQL Database](sql-database-single-database-migrate.md).
- For information about supported features, see [Features](sql-database-features.md).
