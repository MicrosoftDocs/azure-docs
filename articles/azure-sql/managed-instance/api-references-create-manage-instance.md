---
title: Management API reference for Azure SQL Managed Instance
description: Learn about creating and configuring managed instances of Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: devx-track-azurecli
ms.devlang: 
ms.topic: reference
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 03/12/2019
---
# Managed API reference for Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

You can create and configure managed instances of Azure SQL Managed Instance using the Azure portal, PowerShell, Azure CLI, REST API, and Transact-SQL. In this article, you can find an overview of the functions and the API that you can use to create and configure managed instances.

## Azure portal: Create a managed instance

For a quickstart showing you how to create a managed instance, see [Quickstart: Create a managed instance](instance-create-quickstart.md).

## PowerShell: Create and configure managed instances

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRM modules are substantially identical.

To create and manage managed instances with Azure PowerShell, use the following PowerShell cmdlets. If you need to install or upgrade PowerShell, see [Install the Azure PowerShell module](/powershell/azure/install-az-ps).

> [!TIP]
> For PowerShell example scripts, see [Quickstart script: Create a managed instance using a PowerShell library](/archive/blogs/sqlserverstorageengine/quick-start-script-create-azure-sql-managed-instance-using-powershell).

| Cmdlet | Description |
| --- | --- |
|[New-AzSqlInstance](/powershell/module/az.sql/new-azsqlinstance)|Creates a managed instance. |
|[Get-AzSqlInstance](/powershell/module/az.sql/get-azsqlinstance)|Returns information about a managed instance.|
|[Set-AzSqlInstance](/powershell/module/az.sql/set-azsqlinstance)|Sets properties for a managed instance.|
|[Remove-AzSqlInstance](/powershell/module/az.sql/remove-azsqlinstance)|Removes a managed instance.|
|[Get-AzSqlInstanceOperation](/powershell/module/az.sql/get-azsqlinstanceoperation)|Gets a list of management operations performed on the managed instance or specific operation.|
|[Stop-AzSqlInstanceOperation](/powershell/module/az.sql/stop-azsqlinstanceoperation)|Cancels the specific management operation performed on the managed instance.|
|[New-AzSqlInstanceDatabase](/powershell/module/az.sql/new-azsqlinstancedatabase)|Creates a SQL Managed Instance database.|
|[Get-AzSqlInstanceDatabase](/powershell/module/az.sql/get-azsqlinstancedatabase)|Returns information about a SQL Managed Instance database.|
|[Remove-AzSqlInstanceDatabase](/powershell/module/az.sql/remove-azsqlinstancedatabase)|Removes a SQL Managed Instance database.|
|[Restore-AzSqlInstanceDatabase](/powershell/module/az.sql/restore-azsqlinstancedatabase)|Restores a SQL Managed Instance database.|

## Azure CLI: Create and configure managed instances

To create and configure managed instances with [Azure CLI](/cli/azure), use the following [Azure CLI commands for SQL Managed Instance](/cli/azure/sql/mi). Use [Azure Cloud Shell](../../cloud-shell/overview.md) to run the CLI in your browser, or [install](/cli/azure/install-azure-cli) it on macOS, Linux, or Windows.

> [!TIP]
> For an Azure CLI quickstart, see [Working with SQL Managed Instance using Azure CLI](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44).

| Cmdlet | Description |
| --- | --- |
|[az sql mi create](/cli/azure/sql/mi#az_sql_mi_create) |Creates a managed instance.|
|[az sql mi list](/cli/azure/sql/mi#az_sql_mi_list)|Lists available managed instances.|
|[az sql mi show](/cli/azure/sql/mi#az_sql_mi_show)|Gets the details for a managed instance.|
|[az sql mi update](/cli/azure/sql/mi#az_sql_mi_update)|Updates a managed instance.|
|[az sql mi delete](/cli/azure/sql/mi#az_sql_mi_delete)|Removes a managed instance.|
|[az sql mi op list](/cli/azure/sql/mi/op#az_sql_mi_op_list)|Gets a list of management operations performed on the managed instance.|
|[az sql mi op show](/cli/azure/sql/mi/op#az_sql_mi_op_show)|Gets the specific management operation performed on the managed instance.|
|[az sql mi op cancel](/cli/azure/sql/mi/op#az_sql_mi_op_cancel)|Cancels the specific management operation performed on the managed instance.|
|[az sql midb create](/cli/azure/sql/midb#az_sql_midb_create) |Creates a managed database.|
|[az sql midb list](/cli/azure/sql/midb#az_sql_midb_list)|Lists available managed databases.|
|[az sql midb restore](/cli/azure/sql/midb#az_sql_midb_restore)|Restores a managed database.|
|[az sql midb delete](/cli/azure/sql/midb#az_sql_midb_delete)|Removes a managed database.|

## Transact-SQL: Create and configure instance databases

To create and configure instance databases after the managed instance is created, use the following T-SQL commands. You can issue these commands using the Azure portal, [SQL Server Management Studio](/sql/ssms/use-sql-server-management-studio), [Azure Data Studio](/sql/azure-data-studio/what-is), [Visual Studio Code](https://code.visualstudio.com/docs), or any other program that can connect to a server and pass Transact-SQL commands.

> [!TIP]
> For quickstarts showing you how to configure and connect to a managed instance using SQL Server Management Studio on Microsoft Windows, see [Quickstart: Configure Azure VM to connect to Azure SQL Managed Instance](connect-vm-instance-configure.md) and [Quickstart: Configure a point-to-site connection to Azure SQL Managed Instance from on-premises](point-to-site-p2s-configure.md).

> [!IMPORTANT]
> You cannot create or delete a managed instance using Transact-SQL.

| Command | Description |
| --- | --- |
|[CREATE DATABASE](/sql/t-sql/statements/create-database-transact-sql?preserve-view=true&view=azuresqldb-mi-current)|Creates a new instance database in SQL Managed Instance. You must be connected to the master database to create a new database.|
| [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql?preserve-view=true&view=azuresqldb-mi-current) |Modifies an instance database in SQL Managed Instance.|

## REST API: Create and configure managed instances

To create and configure managed instances, use these REST API requests.

| Command | Description |
| --- | --- |
|[Managed Instances - Create Or Update](/rest/api/sql/managedinstances/createorupdate)|Creates or updates a managed instance.|
|[Managed Instances - Delete](/rest/api/sql/managedinstances/delete)|Deletes a managed instance.|
|[Managed Instances - Get](/rest/api/sql/managedinstances/get)|Gets a managed instance.|
|[Managed Instances - List](/rest/api/sql/managedinstances/list)|Returns a list of managed instances in a subscription.|
|[Managed Instances - List By Resource Group](/rest/api/sql/managedinstances/listbyresourcegroup)|Returns a list of managed instances in a resource group.|
|[Managed Instances - Update](/rest/api/sql/managedinstances/update)|Updates a managed instance.|
|[Managed Instance Operations - List By Managed Instance](/rest/api/sql/managedinstanceoperations/listbymanagedinstance)|Gets a list of management operations performed on the managed instance.|
|[Managed Instance Operations - Get](/rest/api/sql/managedinstanceoperations/get)|Gets the specific management operation performed on the managed instance.|
|[Managed Instance Operations - Cancel](/rest/api/sql/managedinstanceoperations/cancel)|Cancels the specific management operation performed on the managed instance.|

## Next steps

- To learn about migrating a SQL Server database to Azure, see [Migrate to Azure SQL Database](../database/migrate-to-database-from-sql-server.md).
- For information about supported features, see [Features](../database/features-comparison.md).