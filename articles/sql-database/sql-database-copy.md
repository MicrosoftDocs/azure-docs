---
title: Copy a database 
description: Create a transactionally consistent copy of an existing Azure SQL database on either the same server or a different server.
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sashan
ms.reviewer: carlrab
ms.date: 11/14/2019
---
# Copy a transactionally consistent copy of an Azure SQL database

Azure SQL Database provides several methods for creating a transactionally consistent copy of an existing Azure SQL database ([single database](sql-database-single-database.md)) on either the same server or a different server. You can copy a SQL database by using the Azure portal, PowerShell, or T-SQL.

## Overview

A database copy is a snapshot of the source database as of the time of the copy request. You can select the same server or a different server. Also you can choose to keep its service tier and compute size, or use a different compute size within the same service tier (edition). After the copy is complete, it becomes a fully functional, independent database. At this point, you can upgrade or downgrade it to any edition. The logins, users, and permissions can be managed independently. The copy is created using the geo-replication technology and once seeding is completed the geo-replication link is automatically terminated. All the requirements for using geo-replication apply to the database copy operation. See [Active geo-replication overview](sql-database-active-geo-replication.md) for details.

> [!NOTE]
> [Automated database backups](sql-database-automated-backups.md) are used when you create a database copy.

## Logins in the database copy

When you copy a database to the same SQL Database server, the same logins can be used on both databases. The security principal you use to copy the database becomes the database owner on the new database. All database users, their permissions, and their security identifiers (SIDs) are copied to the database copy.  

When you copy a database to a different SQL Database server, the security principal on the new server becomes the database owner on the new database. If you use [contained database users](sql-database-manage-logins.md) for data access, ensure that both the primary and secondary databases always have the same user credentials, so that after the copy is complete you can immediately access it with the same credentials.

If you use [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md), you can completely eliminate the need for managing credentials in the copy. However, when you copy the database to a new server, the login-based access might not work, because the logins do not exist on the new server. To learn about managing logins when you copy a database to a different SQL Database server, see [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md).

After the copying succeeds and before other users are remapped, only the login that initiated the copying, the database owner, can log in to the new database. To resolve logins after the copying operation is complete, see [Resolve logins](#resolve-logins).

## Copy a database by using the Azure portal

To copy a database by using the Azure portal, open the page for your database, and then click **Copy**.

   ![Database copy](./media/sql-database-copy/database-copy.png)

## Copy a database by using PowerShell

To copy a database, use the following examples.

# [PowerShell](#tab/azure-powershell)

For PowerShell, use the [New-AzSqlDatabaseCopy](/powershell/module/az.sql/new-azsqldatabasecopy) cmdlet.

> [!IMPORTANT]
> The PowerShell Azure Resource Manager (RM) module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. The AzureRM module will continue to receive bug fixes until at least December 2020.  The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. For more about their compatibility, see [Introducing the new Azure PowerShell Az module](/powershell/azure/new-azureps-module-az).

```powershell
New-AzSqlDatabaseCopy -ResourceGroupName "<resourceGroup>" -ServerName $sourceserver -DatabaseName "<databaseName>" `
    -CopyResourceGroupName "myResourceGroup" -CopyServerName $targetserver -CopyDatabaseName "CopyOfMySampleDatabase"
```

The database copy is a asynchronous operation but the target database is created immediately after the request is accepted. If you need to cancel the copy operation while still in progress, drop the the target database using the [Remove-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase) cmdlet.

# [Azure CLI](#tab/azure-cli)

```azure-cli
az sql db copy --dest-name "CopyOfMySampleDatabase" --dest-resource-group "myResourceGroup" --dest-server $targetserver `
    --name "<databaseName>" --resource-group "<resourceGroup>" --server $sourceserver
```

The database copy is a asynchronous operation but the target database is created immediately after the request is accepted. If you need to cancel the copy operation while still in progress, drop the the target database using the [az sql db delete](/cli/azure/sql/db#az-sql-db-delete) command.

* * *

For a complete sample script, see [Copy a database to a new server](scripts/sql-database-copy-database-to-new-server-powershell.md).

## RBAC roles to manage database copy

To create a database copy, you will need to be in the following roles

- Subscription Owner or
- SQL Server Contributor role or
- Custom role on the source and target databases with following permission:

   Microsoft.Sql/servers/databases/read
   Microsoft.Sql/servers/databases/write

To cancel a database copy, you will need to be in the following roles

- Subscription Owner or
- SQL Server Contributor role or
- Custom role on the source and target databases with following permission:

   Microsoft.Sql/servers/databases/read
   Microsoft.Sql/servers/databases/write

To manage database copy using Azure portal, you will also need the following permissions:

   Microsoft.Resources/subscriptions/resources/read
   Microsoft.Resources/subscriptions/resources/write
   Microsoft.Resources/deployments/read
   Microsoft.Resources/deployments/write
   Microsoft.Resources/deployments/operationstatuses/read

If you want to see the operations under deployments in the resource group on the portal, operations across multiple resource providers including SQL operations, you will need these additional RBAC roles:

   Microsoft.Resources/subscriptions/resourcegroups/deployments/operations/read
   Microsoft.Resources/subscriptions/resourcegroups/deployments/operationstatuses/read

## Copy a database by using Transact-SQL

Log in to the master database with the server-level principal login or the login that created the database you want to copy. For database copying to succeed, logins that are not the server-level principal must be members of the dbmanager role. For more information about logins and connecting to the server, see [Manage logins](sql-database-manage-logins.md).

Start copying the source database with the [CREATE DATABASE](https://msdn.microsoft.com/library/ms176061.aspx) statement. Executing this statement initiates the database copying process. Because copying a database is an asynchronous process, the CREATE DATABASE statement returns before the database copying is complete.

### Copy a SQL database to the same server

Log in to the master database with the server-level principal login or the login that created the database you want to copy. For database copying to succeed, logins that are not the server-level principal must be members of the dbmanager role.

This command copies Database1 to a new database named Database2 on the same server. Depending on the size of your database, the copying operation might take some time to complete.

   ```sql
   -- execute on the master database to start copying
   CREATE DATABASE Database2 AS COPY OF Database1;
   ```

### Copy a SQL database to a different server

Log in to the master database of the destination server, the SQL Database server where the new database is to be created. Use a login that has the same name and password as the database owner of the source database on the source SQL Database server. The login on the destination server must also be a member of the dbmanager role or be the server-level principal login.

This command copies Database1 on server1 to a new database named Database2 on server2. Depending on the size of your database, the copying operation might take some time to complete.

```sql
-- Execute on the master database of the target server (server2) to start copying from Server1 to Server2
CREATE DATABASE Database2 AS COPY OF server1.Database1;
```

> [!IMPORTANT]
> Both servers' firewalls must be configured to allow inbound connection from the IP of the client issuing the T-SQL COPY command.

### Copy a SQL database to a different subscription

You can use the steps described in the previous section to copy your database to a SQL Database server in a different subscription. Make sure you use a login that has the same name and password as the database owner of the source database and it is a member of the dbmanager role or is the server-level principal login. 

> [!NOTE]
> The [Azure portal](https://portal.azure.com) does not support copy to a different subscription because Portal calls the ARM API and it uses the subscription certificates to access both servers involved in geo-replication.  

### Monitor the progress of the copying operation

Monitor the copying process by querying the sys.databases and sys.dm_database_copies views. While the copying is in progress, the **state_desc** column of the sys.databases view for the new database is set to **COPYING**.

* If the copying fails, the **state_desc** column of the sys.databases view for the new database is set to **SUSPECT**. Execute the DROP statement on the new database, and try again later.
* If the copying succeeds, the **state_desc** column of the sys.databases view for the new database is set to **ONLINE**. The copying is complete, and the new database is a regular database that can be changed independent of the source database.

> [!NOTE]
> If you decide to cancel the copying while it is in progress, execute the [DROP DATABASE](https://msdn.microsoft.com/library/ms178613.aspx) statement on the new database. Alternatively, executing the DROP DATABASE statement on the source database also cancels the copying process.

> [!IMPORTANT]
> If you need to create a copy with a substantially smaller SLO than the source, the target database may not have sufficient resources to complete the seeding process and it can cause the copy operation to fail. In this scenario use a geo-restore request to create a copy in a different server and/or a different region. See [Recover an Azure SQL database using database backups](sql-database-recovery-using-backups.md#geo-restore) for more information.

## Resolve logins

After the new database is online on the destination server, use the [ALTER USER](https://msdn.microsoft.com/library/ms176060.aspx) statement to remap the users from the new database to logins on the destination server. To resolve orphaned users, see [Troubleshoot Orphaned Users](https://msdn.microsoft.com/library/ms175475.aspx). See also [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md).

All users in the new database retain the permissions that they had in the source database. The user who initiated the database copy becomes the database owner of the new database and is assigned a new security identifier (SID). After the copying succeeds and before other users are remapped, only the login that initiated the copying, the database owner, can log in to the new database.

To learn about managing users and logins when you copy a database to a different SQL Database server, see [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md).

## Database copy errors

The following errors can be encountered while copying a database in Azure SQL Database. For more information, see [Copy an Azure SQL Database](sql-database-copy.md).

| Error code | Severity | Description |
| ---:| ---:|:--- |
| 40635 |16 |Client with IP address '%.&#x2a;ls' is temporarily disabled. |
| 40637 |16 |Create database copy is currently disabled. |
| 40561 |16 |Database copy failed. Either the source or target database does not exist. |
| 40562 |16 |Database copy failed. The source database has been dropped. |
| 40563 |16 |Database copy failed. The target database has been dropped. |
| 40564 |16 |Database copy failed due to an internal error. Please drop target database and try again. |
| 40565 |16 |Database copy failed. No more than 1 concurrent database copy from the same source is allowed. Please drop target database and try again later. |
| 40566 |16 |Database copy failed due to an internal error. Please drop target database and try again. |
| 40567 |16 |Database copy failed due to an internal error. Please drop target database and try again. |
| 40568 |16 |Database copy failed. Source database has become unavailable. Please drop target database and try again. |
| 40569 |16 |Database copy failed. Target database has become unavailable. Please drop target database and try again. |
| 40570 |16 |Database copy failed due to an internal error. Please drop target database and try again later. |
| 40571 |16 |Database copy failed due to an internal error. Please drop target database and try again later. |

## Next steps

- For information about logins, see [Manage logins](sql-database-manage-logins.md) and [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md).
- To export a database, see [Export the database to a BACPAC](sql-database-export.md).
