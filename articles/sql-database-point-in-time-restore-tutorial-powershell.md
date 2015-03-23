<properties 
   pageTitle="Restore an Azure SQL database using Point in Time Restore in Azure PowerShell" 
   description="Point in Time Restore, Microsoft Azure SQL Database, restore database, recover database, Azure PowerShell" 
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

# Restore an Azure SQL database using Point in Time Restore in Azure PowerShell

> [AZURE.SELECTOR]
- [Point in Time Restore - portal](sql-database-point-in-time-restore-tutorial-management-portal.md)
- [Point in Time Restore - REST API](sql-database-point-in-time-restore-tutorial-rest.md) 

## Overview

This tutorial shows you how to restore an Azure SQL database using Point in Time Restore in [Azure PowerShell](powershell-install-configure.md). Azure SQL Database has built-in backups to support self-service Point in Time Restore for Basic, Standard, and Premium service tiers.

Point in Time Restore creates a new database. The service automatically selects the service tier based on the backup used at the restore point. Make sure you have available quota on the logical server to create another database. If you'd like to request an increased quota, contact [Azure Support](http://azure.microsoft.com/support/options/).

## Restrictions and Security

See [Restore an Azure SQL database using Point in Time Restore in the Azure portal](sql-database-point-in-time-restore-tutorial-management-portal.md).

## How to: Restore an Azure SQL database using Point in Time Restore in Azure PowerShell

> [AZURE.VIDEO restore-a-sql-database-using-point-in-time-restore-with-microsoft-azure-powershell]

You must use certificate based authentication to run the following cmdlets. For more information, see the *Use the certificate method* section in [How to install and configure Azure PowerShell](powershell-install-configure.md#use-the-certificate-method).

1. Get the database you want to restore by using the [Get-AzureSqlDatabase](http://msdn.microsoft.com/library/azure/dn546735.aspx) cmdlet. Specify the following parameters:
	* **ServerName** where the database is located.
	* **DatabaseName** of the database you want to restore.	

	`PS C:\>$Database = Get-AzureSqlDatabase -ServerName "myserver" –DatabaseName “mydb”`

2. Begin the restore by using the [Start-AzureSqlDatabaseRestore](http://msdn.microsoft.com/library/azure/dn720218.aspx) cmdlet. Specify the following parameters:	
	* **SourceDatabase** you want to restore from.
	* **TargetDatabaseName** of the database you are restoring to.
	* **PointInTime** you want to restore to.

	Store what is returned to a variable called **$RestoreRequest**. This variable contains the restore request ID which is used for monitoring the status of a restore. 

	`PS C:\>$RestoreRequest = Start-AzureSqlDatabaseRestore -SourceDatabase $Database –TargetDatabaseName “myrestoredDB” –PointInTime “2015-01-01 06:00:00”`

A restore may take some time to complete. To monitor the status of the restore, use the [Get-AzureSqlDatabaseOperation](http://msdn.microsoft.com/library/azure/dn546738.aspx) cmdlet and specify the following parameters:

* **ServerName** of the database you are restoring to.
* **OperationGuid** which is the Restore Request ID that was stored in the **$RestoreRequest** variable in Step 2.

	`PS C:\>Get-AzureSqlDatabaseOperation –ServerName "myserver" –OperationGuid $RestoreRequest.RequestID`

The **State** and **PercentComplete** fields show the status of the restore. 

## Next steps

For more information, see the following:  

[Azure SQL Database Business Continuity](http://msdn.microsoft.com/library/azure/hh852669.aspx)

[Azure SQL Database Backup and Restore](http://msdn.microsoft.com/library/azure/jj650016.aspx)

[Azure SQL Database Point in Time Restore (blog)](http://azure.microsoft.com/blog/2014/10/01/azure-sql-database-point-in-time-restore/)

[Azure PowerShell](https://msdn.microsoft.com/library/azure/jj156055.aspx)
