<properties
   pageTitle="Cloud business continuity - Restore a deleted database - SQL Database | Microsoft Azure"
   description="Learn about Point-in-Time Restore, that enables you to roll back an Azure SQL Database to a previous point in time (up to 35 days)."
   services="sql-database"
   documentationCenter=""
   authors="stevestein"
   manager="jhubbard"
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="sqldb-bcdr"
   ms.date="06/09/2016"
   ms.author="sstein"/>

# Overview: Restore a deleted Azure SQL database

> [AZURE.SELECTOR]
- [Business continuity overview](sql-database-business-continuity.md)
- [Point-In-Time Restore](sql-database-point-in-time-restore.md)
- [Restore deleted database](sql-database-restore-deleted-database.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active Geo-Replication](sql-database-geo-replication-overview.md)
- [Business continuity scenarios](sql-database-business-continuity-scenarios.md)


You can restore a deleted database during the retenion period for the [SQL Database automated backups](sql-database-automated-backups.md) for your [service tier](sql-database-service-tiers.md). You can use the [Azure portal](sql-database-restore-deleted-database-portal.md), [PowerShell](sql-database-restore-deleted-database-powershell.md) or the [REST API](https://msdn.microsoft.com/library/azure/mt163685.aspx). 

> [AZURE.SELECTOR]
- [Azure portal](sql-database-restore-deleted-database-portal.md)
- [PowerShell](sql-database-restore-deleted-database-powershell.md)

## Restoring a Recently Deleted Database

You can restore the deleted database using the same or a different database name to the logical server that contained the original database. For deleted databases, the restore point is fixed to the deletion time of the database.  

> [AZURE.IMPORTANT] If you delete an Azure SQL Database server instance, all of its databases are also deleted and cannot be recovered. 

## Restoration time

The time taken to restore a database depends on many factors, including the size of the database, the number of transaction logs, the time point selected, and the amount of activity that needs to be replayed to reconstruct the state at the selected point. For a very large and/or active database the restore may take several hours. Restoring a database always creates a new database on the same server as the original database, so the restored database must be given a new name. The majority of database restorations complete within 12 hours.

## Summary

Automatic backups protect your databases from accidental database deletion. This zero-cost zero-admin solution is available with all SQL databases. 

## Next steps

- For detailed steps on how to restore a deleted database using the Azure portal, see [Restore a deleted database using the Azure Portal](sql-database-restore-deleted-database-portal.md).
- For detailed steps on how to restore a deleted database using PowerShell, see [Restore a deleted database using PowerShell](sql-database-restore-deleted-database-powershell.md).
- For information about how to restore a deleted database, see [Restore a deleted database using the REST API](https://msdn.microsoft.com/library/azure/mt163685.aspx).
- For detailed information regarding Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md).

## Additional resources

- [Point-In-Time Restore](sql-database-point-in-time-restore.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
