<properties 
   pageTitle="Recover an Azure SQL database using Geo-Restore with REST API" 
   description="Geo-Restore, Microsoft Azure SQL Database, restore database, recover database, REST API" 
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

# Recover an Azure SQL database using Geo-Restore with REST API

> [AZURE.SELECTOR]
- [Geo-Restore - portal](sql-database-geo-restore-tutorial-management-portal.md)
- [Geo-Restore - PowerShell](sql-database-geo-restore-tutorial-powershell.md)

## Overview

This guide shows you how to recover an Azure SQL database using REST API. Links to more detailed operations are provided. Geo-Restore is the core disaster recovery protection included for all Basic, Standard, and Premium Azure SQL Databases service tiers.

## Restrictions and Security

See [Recover an Azure SQL Database using Geo-Restore in the Azure portal](sql-database-geo-restore-tutorial-management-portal.md).

## How to: Recover an Azure SQL database using REST API

1.	Get your list of recoverable databases using the [List Recoverable Databases](http://msdn.microsoft.com/library/azure/dn800984.aspx) operation.
	
2.	Get the database you want to recover using the [Get Recoverable Database](http://msdn.microsoft.com/library/azure/dn800985.aspx) operation.
	
3.	Create the recovery request using the [Create Database Recovery Request](http://msdn.microsoft.com/library/azure/dn800986.aspx) operation.
	
4.	Track the status of the recovery using the [Database Operation Status](http://msdn.microsoft.com/library/azure/dn720371.aspx) operation.

## Next steps

For more information, see the following:

[Restore an Azure SQL database using Point in Time Restore in the Azure portal](sql-database-point-in-time-restore-tutorial-management-portal.md)

[Restore a deleted Azure SQL database in the Azure portal](sql-database-restore-deleted-database-tutorial-management-portal.md)

[Azure SQL Database Business Continuity](http://msdn.microsoft.com/library/azure/hh852669.aspx)

[Azure SQL Database Backup and Restore](http://msdn.microsoft.com/library/azure/jj650016.aspx)

[Azure SQL Database Geo-Restore (blog)](http://azure.microsoft.com/blog/2014/09/13/azure-sql-database-geo-restore/)

[Service Management REST API Reference](https://msdn.microsoft.com/library/azure/ee460799.aspx)
