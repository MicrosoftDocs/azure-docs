<properties 
    pageTitle="Copy an Azure SQL database using PowerShell | Microsoft Azure" 
    description="Create copy of an Azure SQL database using PowerShell" 
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="09/07/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Copy an Azure SQL database using PowerShell


> [AZURE.SELECTOR]
- [Overview](sql-database-copy.md)
- [Azure Portal](sql-database-copy-portal.md)
- [PowerShell](sql-database-copy-powershell.md)
- [T-SQL](sql-database-copy-transact-sql.md)

This following steps show you how to copy a SQL database with PowerShell to the same server or a different server. The database copy operation uses the [New-AzureRmSqlDatabaseCopy](https://msdn.microsoft.com/library/mt603644.aspx) cmdlet. 


To complete this article you need the following:

- An Azure SQL Database (a database to copy). If you do not have a SQL database, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).
- The latest version of Azure PowerShell. For detailed information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).


Many new features of SQL Database are only supported when you are using the [Azure Resource Manager deployment model](../articles/resource-group-overview.md), so examples use the [Azure SQL Database PowerShell cmdlets](https://msdn.microsoft.com/library/azure/mt574084.aspx) for Resource Manager. The existing classic deployment model [Azure SQL Database (classic) cmdlets](https://msdn.microsoft.com/library/azure/dn546723.aspx) are supported for backward compatibility, but we recommend you use the Resource Manager cmdlets.

**To submit a copy database request to the SQL Database service, run the [New-AzureRmSqlDatabase](https://msdn.microsoft.com/library/mt603644.aspx) cmdlet.** 

This article provides code snippets to create a SQL database copy in the same server, in a different server, or into an elastic database pool.

>[AZURE.NOTE] Depending on the size of your database, the copy operation may take some time to complete.



## Copy a SQL database to the same server

To create the copy on the same server, omit the `-CopyServerName` parameter (or set it to the same server).

    New-AzureRmSqlDatabaseCopy -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -CopyDatabaseName "database1_copy"

## Copy a SQL database to a different server

To create the copy on a different server, include the `-CopyServerName` parameter and set it to a different (but existing) server.

    New-AzureRmSqlDatabaseCopy -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -CopyServerName "server2" -CopyDatabaseName "database1_copy"


## Copy a SQL database into an elastic database pool

To create a copy of a SQL database in a pool set the `-ElasticPoolName` parameter to an existing pool.

    New-AzureRmSqlDatabaseCopy -ResourceGroupName "resourcegoup1" -ServerName "server1" -DatabaseName "database1" -CopyResourceGroupName "poolResourceGroup" -CopyServerName "poolServer1" -CopyDatabaseName "database1_copy" -ElasticPoolName "poolName"





## Monitor the progress of a copy operation

After running **New-AzureRmSqlDatabaseCopy** you can check the status of the copy request. Running this immediately after the request will usually return **State : Pending** or **State : Running** so you can run this multiple times until you see **State : COMPLETED** in the output. 

    Get-AzureRmSqlDatabaseActivity -ResourceGroupName $copyDbResourceGroupName -ServerName $copyDbServerName -DatabaseName $copyDbName

## Resolve logins

To resolve logins after the copy operation completes, see [Resolve logins](sql-database-copy-transact-sql.md#resolve-logins-after-the-copy-operation-completes)


## Example PowerShell script

The following script assumes all resource groups, servers, and the pool already exist (replace the variable values with your existing resources). Everything must exist except for the copyDbName:

    # Sign in to Azure and set the subscription to work with
    # ---------------------------------------------------
    $SubscriptionId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    Add-AzureRmAccount
    Select-AzureRmSubscription -SubscriptionId $SubscriptionId
    
    
    # SQL database source (the existing database to copy)
    # ---------------------------------------------------
    $sourceDbName = "db1"
    $sourceDbServerName = "server1"
    $sourceDbResourceGroupName = "rg1"
    $sourceDbLocation = "westus"
    
    # SQL database copy (the new db to be created)
    # --------------------------------------------
    $copyDbName = "db1_copy"
    $copyDbServerName = "server2"
    $copyDbResourceGroupName = "rg2"
    $copyDbLocation = "westus2"
    
    # Copy a database to the same server
    # ----------------------------------
    New-AzureRmSqlDatabaseCopy -ResourceGroupName $sourceDbResourceGroupName -ServerName $sourceDbServerName -DatabaseName $sourceDbName -CopyDatabaseName $copyDbName
    
    # Copy a database to a different server
    # -------------------------------------
    New-AzureRmSqlDatabaseCopy -ResourceGroupName $sourceDbResourceGroupName -ServerName $sourceDbServerName -DatabaseName $sourceDbName -CopyResourceGroupName $copyDbResourceGroupName -CopyServerName $copyDbServerName -CopyDatabaseName $copyDbName
    
    # Copy a database into an elastic database pool
    # ---------------------------------------------
    $poolName = "pool1"
    
    New-AzureRmSqlDatabaseCopy -ResourceGroupName $sourceDbResourceGroupName -ServerName $sourceDbServerName -DatabaseName $sourceDbName -CopyResourceGroupName $copyDbResourceGroupName -CopyServerName $copyDbServerName -ElasticPoolName $poolName -CopyDatabaseName $copyDbName



    

## Next steps

- See [Copy an Azure SQL database](sql-database-copy.md) for an overview of copying an Azure SQL Database.
- See [Copy an Azure SQL database using the Azure Portal](sql-database-copy-portal.md) to copy a database using the Azure portal.
- See [Copy an Azure SQL database using T-SQL](sql-database-copy-transact-sql.md) to copy a database using Transact-SQL.
- See [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md) to learn about managing users and logins when copying a database to a different logical server.


## Additional resources

- [Manage logins](sql-database-manage-logins.md)
- [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)
- [Export the database to a BACPAC](sql-database-export.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)
