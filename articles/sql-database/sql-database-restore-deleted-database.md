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
   ms.workload="data-management"
   ms.date="06/09/2016"
   ms.author="sstein"/>

# Overview: Restore a deleted Azure SQL database

> [AZURE.SELECTOR]
- [Overview](sql-database-restore-deleted-database.md)
- [Azure portal](sql-database-restore-deleted-database-portal.md)
- [PowerShell](sql-database-restore-deleted-database-powershell.md)

You can restore a deleted database during the retenion period for the [SQL Database automated backups](sql-database-automated-backups.md). You can use the [Azure portal](sql-database-restore-deleted-database-portal.md), [PowerShell](sql-database-restore-deleted-database-powershell.md) or the [REST API](https://msdn.microsoft.com/library/azure/mt163685.aspx). 

If you delete a database the final backup is retained for the normal retention period allowing you to restore the database to the point at which it was deleted. 

## Restoring a Recently Deleted Database

For deleted databases the restore point is fixed to the deletion time of the database. When restoring a deleted database, it can only be restored to the server that contained the original database. Be mindful of this when deleting a server as you will not be able to restore databases previously located on that server once it is deleted. 

> [AZURE.IMPORTANT] If you delete an Azure SQL Database server instance, all of its databases are also deleted and cannot be recovered. 

## Summary

Automatic backups protect your databases from accidental database deletion. This zero-cost zero-admin solution is available with all SQL databases. 

## Next steps

- [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md)
- [Restore a deleted database using the Azure Portal](sql-database-restore-deleted-database-portal.md)
- [Restore a deleted database using PowerShell](sql-database-restore-deleted-database-powershell.md)
- [Restore a deleted database using the REST API](https://msdn.microsoft.com/library/azure/mt163685.aspx)
- [SQL Database automated backups](sql-database-automated-backups.md)

## Additional resources

- [Point-in-time restore](sql-database-point-in-time-restore.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
