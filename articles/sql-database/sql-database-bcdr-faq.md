<properties 
   pageTitle="SQL Database Business Continuity FAQ" 
   description="Common questions and answers that customers ask about built-in and optional features for business continuity and disaster recovery with Azure SQL Database." 
   services="sql-database" 
   documentationCenter="" 
   authors="elfisher" 
   manager="jeffreyg" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management" 
   ms.date="07/14/2015"
   ms.author="elfish"/>

# Business Continuity FAQ

## 1.	What happen to my restore point retention period when I downgrade/upgrade by service tier?
After downgrading to a lower performance tier, the restore point’s retention period is immediately truncated to the retention period of the performance tier of the current DB. 

If the DB service tier is upgraded, the retention period will begin extending only after the DB is upgraded. 

For example, if DB is downgraded from P1 to S3, the retention period will change from 35 days to 14 days immediately, all the restore points prior to 14 days will no longer be available. Subsequently, if it is upgraded to P1 again, the retention period would begin from 14 days and start building up to 35 days.

## 2.	How long is the retention period for a dropped DB? 
The retention period is determined by the service tier of the database while it existed or the number of days where the database exists, whichever is less.

## 3.	How can I restore a deleted server?

There is no support for restoring a deleted server at this time. 

## 4.	How long does it take to restore a DB?

The duration it takes to restore a DB depends on multiple factors such as the size of the DB, the number of transaction log, network bandwidth and etc. Majority of the database restores within 12 hours.

## 5.	Can I change the restore point retention period of my database?

No. 

## 6.	How do I find out the available restore point available for my database?

For recovery from user error – The current time is the latest restore point available. To find out the oldest available restore point, use [Get Database](https://msdn.microsoft.com/library/dn505708.aspx) (*RecoveryPeriodStartDate*) to get the oldest restore point (non Geo-replicated restore point).

For recovery from outage - Use the [Get Recoverable Database](https://msdn.microsoft.com/library/dn800985.aspx) (*LastAvailableBackupDate*) to get the latest Geo-replicated restore point.

## 7.	How could I bulk restore databases under my server?

There is no built-in functionality to do bulk restore. You can use [Azure SQL Database: Full Server Recovery](https://gallery.technet.microsoft.com/Azure-SQL-Database-Full-82941666) script to accomplish this task. 

## 8.	What is the difference between standard geo-replication and active geo-replication?

For standard geo-replication, the secondary database is not readable. It is only available for failover during outages.

For active geo-replication, all the secondaries database is readable (up to 4 secondaries).

## 9.	What is the replication delay when using standard geo-replication or active geo-replication?

Geo-Replication uses continuous copy. Hence, use the [sys.dm_continuous_copy_status](https://msdn.microsoft.com/library/azure/dn741329.aspx) dynamic management view (DMVs) to get the last replication time and other information.




 
