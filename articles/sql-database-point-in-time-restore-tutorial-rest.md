<properties 
   pageTitle="Restore an Azure SQL database using Point in Time Restore with REST API" 
   description="Point in Time Restore, Microsoft Azure SQL Database, restore database, recover database, REST API" 
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
   ms.date="03/17/2015"
   ms.author="elfish; v-romcal"/>

# Restore an Azure SQL database using Point in Time Restore with REST API

> [AZURE.SELECTOR]
- [Point in Time Restore - portal](sql-database-point-in-time-restore-tutorial-management-portal.md)
- [Point in Time Restore - PowerShell](sql-database-point-in-time-restore-tutorial-powershell.md) 

## Overview

This guide shows you how to restore an Azure SQL database using Point in Time Restore with REST API. Links to more detailed operations are provided.

Point in Time Restore creates a new database. The service automatically selects the service tier based on the backup used at the restore point. Make sure you have available quota on the logical server to create another database. If you'd like to request an increased quota, contact [Azure Support](http://azure.microsoft.com/support/options/).

## Restrictions and Security

See [Restore an Azure SQL database using Point in Time Restore in the Azure portal](sql-database-point-in-time-restore-tutorial-management-portal.md).

## How to: Restore an Azure SQL database using REST API

1.	Get the database you want to restore using the [Get Database](http://msdn.microsoft.com/library/azure/dn505708.aspx) operation.

2.	Create the restore request using the [Create Database Restore Request](http://msdn.microsoft.com/library/azure/dn509571.aspx) operation.
	
3.	Track the restore request using the [Database Operation Status](http://msdn.microsoft.com/library/azure/dn720371.aspx) operation.

## Next steps

For more information, see the following: 

[Azure SQL Database Business Continuity](http://msdn.microsoft.com/library/azure/hh852669.aspx)

[Azure SQL Database Backup and Restore](http://msdn.microsoft.com/library/azure/jj650016.aspx)

[Azure SQL Database Point in Time Restore (blog)](http://azure.microsoft.com/blog/2014/10/01/azure-sql-database-point-in-time-restore/)

[Service Management REST API Reference](https://msdn.microsoft.com/library/azure/ee460799.aspx)
