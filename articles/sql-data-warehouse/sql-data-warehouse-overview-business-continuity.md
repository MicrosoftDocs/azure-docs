<properties
   pageTitle="Planning for business continuity in SQL Data Warehouse | Microsoft Azure"
   description="Overview of business continuity in SQL Data Warehouse. "
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sahaj08"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/25/2015"
   ms.author="sahajs"/>


# Planning for business Continuity in SQL Data Warehouse

This article walks through the basics of planning business continuity and disaster recovery with the SQL Data Warehouse. Data warehouses are the central repository of information for businesses and they play a critical role in the day-to-day operations for analytics and business intelligence at all levels of the organization. It is therefore essential that your data warehouse is reliable and allows for recoverability and continuous operation. In particular, this article will show you how SQL Data Warehouse allows you to recover from user errors and disasters using Point-in-Time Restore and Geo-Restore.

## Concepts

Business continuity and disaster recovery plans need to optimize for the following:

**Recovery Time Objective (RTO):** The maximum acceptable time before the database fully recovers after a disruptive event i.e. maximum loss of availability during failures.

**Recovery Point Objective (RPO):** The maximum acceptable time window of lost updates when the database recovers from a disruptive event i.e. maximum loss of data during failures.

**Estimated Recovery Time (ERT):** The estimated duration for the database to be fully functional after a restore request.

## Business continuity scenarios

**Recovering from infrastructure failures:** This scenario refers to recovering from infrastructure issues such as disk failures etc. A customer would like to ensure business continuity with a fault tolerant and highly available infrastructure.

**Recovering from user errors:** This scenario refers to recovering from unintentional or incidental Data Corruption or Deletion. In the event that a user unintentionally or incidentally modifies or deletes data, a customer would like to ensure business continuity by restoring the database to an earlier point in time.

**Recovering from disasters (DR):** This scenario refers to recovering from a major catastrophe. In the scenario where a disruptive event like a natural disaster or a regional outage causes the database to become unavailable, a customer would like to recover the database in a different region to continue business operations.


## Business continuity features

Let us take a look at how SQL Data Warehouse enhances the reliability of your database and allows for recoverability and continuous operation in the aforementioned scenarios. 


### Data redundancy

Since SQL Data Warehouse separates compute and storage, all your data is directly written to geo-redundant Azure Storage (RA-GRS). Geo-redundant storage replicates your data to a secondary region that is hundreds of miles away from the primary region. In both primary and secondary regions, your data is replicated three times each, across separate fault domains and upgrade domains. This ensures that your data is durable even in the case of a complete regional outage or disaster that renders one of the regions unavailable. To learn more about Read-Access Geo-Redundant Storage, read [Azure storage redundancy options][].

### Database Restore

Database restore is designed to restore your database to an earlier point in time. Azure SQL Data Warehouse service protects all databases with automatic storage snapshots every 8 hours and retains them for 7 days to provide you with a discrete set of restore points. These backups are stored on RA-GRS Azure Storage and are therefore geo-redundant by default. The automatic backup and restore features come with no additional charges and provide a zero-cost and zero-admin way to protect databases from accidental corruption or deletion. To learn more about database restore, refer to [Recover from user error][].

### Geo-Restore

Geo-Restore is designed to recover your database in case it becomes unavailable due to a disruptive event. You can contact support to restore a database from a geo-redundant backup to create a new database in any Azure region. Because the backup is geo-redundant it can be used to recover a database even if the database is inaccessible due to an outage. Geo-Restore feature comes with no additional charges.


## Next steps
To learn about the business continuity features of other SQL Database editions, please read the [SQL Database business continuity overview][].

<!--Image references-->

<!--Article references-->
[business continuity overview]: ../sql-database/sql-database-business-continuity.md
[Finalize a recovered database]: ../sql-database/sql-database-recovered-finalize.md
[Azure storage redundancy options]: storage-redundancy/#read-access-geo-redundant-storage-ra-grs.md
[SQL Database business continuity overview]: ../sql-database/sql-database-business-continuity.md
[Recover from user error]: sql-data-warehouse-business-continuity-recover-from-user-error.md

<!--MSDN references-->
[Create database restore request]: http://msdn.microsoft.com/library/azure/dn509571.aspx
[Database operation status]: http://msdn.microsoft.com/library/azure/dn720371.aspx
[Get restorable dropped database]: http://msdn.microsoft.com/library/azure/dn509574.aspx
[List restorable dropped databases]: http://msdn.microsoft.com/library/azure/dn509562.aspx

<!--Other Web references-->


