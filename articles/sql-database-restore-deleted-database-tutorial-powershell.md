<properties 
   pageTitle="Restore a deleted Azure SQL database in Azure PowerShell" 
   description="Microsoft Azure SQL Database, restore deleted database, recover deleted database, Azure PowerShell" 
   services="sql-database" 
   documentationCenter="" 
   authors="elfisher" 
   manager="jeffreyg" 
   editor="v-romcal"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="storage-backup-recovery" 
   ms.date="03/18/2015"
   ms.author="elfish; v-romcal; v-stste"/>

# Restore a deleted Azure SQL database in Azure PowerShell

> [AZURE.SELECTOR]
- [Restore deleted database - portal](sql-database-restore-deleted-database-tutorial-management-portal.md)
- [Restore deleted database - REST API](sql-database-restore-deleted-database-tutorial-rest.md)

## Overview

This tutorial shows you how to restore a deleted Azure SQL database in [Azure PowerShell](powershell-install-configure.md). You can restore a database that was deleted during its retention period to the point at which it was deleted. The retention period is determined by the service tier of the database.

Restoring a deleted Azure SQL database creates a new database. The service automatically selects the service tier based on the backup used at the restore point. Make sure you have available quota on the logical server to create another database. If you'd like to request an increased quota, contact [Azure Support](http://azure.microsoft.com/support/options/).

## Restrictions and Security

See [Restore a deleted Azure SQL database in the Azure portal](sql-database-restore-deleted-database-tutorial-management-portal.md).

## How to: Restore a deleted Azure SQL database in Azure PowerShell

> [AZURE.VIDEO restore-a-deleted-sql-database-with-microsoft-azure-powershell]

You must use certificate based authentication to run the following cmdlets. For more information, see the *Use the certificate method* section in [How to install and configure Azure PowerShell](powershell-install-configure.md#use-the-certificate-method).

1. Get the list of recoverable databases by using the [Get-AzureSqlDatabase](http://msdn.microsoft.com/library/azure/dn546735.aspx) cmdlet.
	* Use the **RestorableDropped** switch and specify the **ServerName** of the server from which the database was deleted.
	* Running the following command stores the results in a variable called **$RecoverableDBs**.
	
	`PS C:\>$RecoverableDBs = Get-AzureSqlDatabase -ServerName "myserver" –RestorableDropped`

2. Choose the deleted database you want to restore from the list of deleted databases.

	* Type the deleted database number from the **$RecoverableDBs** list.  

	`PS C:\>$Database = $RecoverableDBs[<deleted database number>]`

	* For more information about how to get a restorable dropped database object, see [Get-AzureSqlDatabase](http://msdn.microsoft.com/library/dn546735.aspx).

3. Begin the restore by using the [Start-AzureSqlDatabaseRestore](http://msdn.microsoft.com/library/azure/dn720218.aspx) cmdlet. Specify the following parameters:	
	* **SourceRestorableDroppedDatabase**
	* **TargetDatabaseName** of the database you are restoring to.

	Store what is returned to a variable called **$RestoreRequest**. This variable contains the restore request ID which is used for monitoring the status of a restore.
	
	`PS C:\>$RestoreRequest = Start-AzureSqlDatabaseRestore -SourceRestorableDroppedDatabase $Database –TargetDatabaseName “myrestoredDB”`

A restore may take some time to complete. To monitor the status of the restore, use the [Get-AzureSqlDatabaseOperation](http://msdn.microsoft.com/library/azure/dn546738.aspx) cmdlet and specify the following parameters:

* **ServerName** of the database you are restoring to.
* **OperationGuid** which is the Restore Request ID that was stored in the **$RestoreRequest** variable in Step 3.

	`PS C:\>Get-AzureSqlDatabaseOperation –ServerName "myserver" –OperationGuid $RestoreRequest.RequestID`

The **State** and **PercentComplete** fields show the status of the restore.

## Next steps

For more information, see the following:

[Azure SQL Database Business Continuity](http://msdn.microsoft.com/library/azure/hh852669.aspx)

[Azure SQL Database Backup and Restore](http://msdn.microsoft.com/library/azure/jj650016.aspx)

[Azure PowerShell](http://msdn.microsoft.com/library/azure/jj156055.aspx)