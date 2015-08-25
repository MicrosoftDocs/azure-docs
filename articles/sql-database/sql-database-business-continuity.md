<properties 
   pageTitle="Azure SQL Database Business Continuity Overview"
   description="Learn the built-in features and available options of Azure SQL Database that help keep your mission critical cloud applications running and help you recover from outages and errors."
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

# Business Continuity Overview

Business continuity is about designing, deploying and running your application in a way that it is resilient to planned or unplanned disruptive events that result in permanent or temporary loss of the application’s ability to conduct its business function. The unplanned events range from human errors to permanent or temporary outages to regional disasters that could cause wide scale loss of facility in a particular Azure region. The planned events include application redeployment to a different region, application upgrades etc. The goal of business continuity is for your application to continue to function during these events with minimal impact on the business function. 

To discuss the business continuity solutions there are several concepts you need be familiar with.

**Disaster recovery (DR):** a process of restoring the normal business function of the application

**Estimated Recovery Time (ERT):** The estimated duration for the database to be fully available after a restore or failover request.

**Recovery time objective (RTO)** – maximum acceptable time before the application fully recovers after the disruptive event. RTO measures the maximum loss of availability during the failures.

**Recovery point objective (RPO)** – maximum amount of last updates (time interval) the application can lose by the moment it fully recovers after the disruptive event. RPO measures the maximum loss of data during the failures.


## Business continuity scenarios

Business continuity addresses the following key scenarios.

###Design for business continuity

The application I am building is critical for my business. I want to design and configure it to be able to survive a regional disaster of catastrophic failure of the service. I know the RPO and RTO requirements for my application and will choose the configuration that meets these requirements.

###Recover from human error

I have administrative rights to access the production version of the application. As part of regular maintenance process I made a mistake and deleted some critical data in production. I want to quickly restore the data in order to mitigate the impact of the error.

###Recover from an outage

I am running my application in production and receive an alert suggesting that there is a major outage in the region it is deployed in. I want to initiate the recovery process to bring it back in a different region to mitigate the impact on the business.

###Perform disaster recovery drill

Because the recovery from an outage will relocate the application’s data tier to a different region I want to periodically test the recovery process and evaluate its impact on the application to stay prepared.

###Application upgrade without downtime

I am releasing a major upgrade of my application. It involves the database schema changes, deployment of additional stored procs etc. This process will require stopping user access to the database. At the same I want to make sure the upgrade does not cause a significant disruption of the business operations.

##Business continuity features

The following table shows the differences of the business continuity features across the service tiers:

| Capability | Basic tier | Standard tier |Premium tier 
| --- |--- | --- | ---
| Point In Time Restore | Any restore point within 7 days | Any restore point within 14 days | Any restore point within 35 days
| Geo-Restore | ERT < 12h, RPO < 1h | ERT < 12h, RPO < 1h | ERT < 12h, RPO < 1h
| Standard Geo-Replication | not included |  ERT < 30s, RPO < 5s | ERT < 30s, RPO < 5s
| Active Geo-Replication | not included | not included | ERT < 30s, RPO < 5s

These features are provided to address the scenarios listed earlier. Please refer to the [Design for business continuity](sql-database-business-continuity-design.md) section for guidance how to select the specific feature. 

###Point In Time Restore

Point In Time Restore is designed to return your database to an earlier point in time. It uses the database backups, incremental backups and transaction log backups that the service automatically maintains for every user database. This capability is available for  all service tiers. You can go back 7 days with Basic, 14 days with Standard, and 35 days with Premium. Refer to [Recover from human error](sql-database-user-error-recovery.md) for details of how to use Point In Time Restore.

###Geo-Restore

Geo-Restore is also available with Basic, Standard, and Premium databases. It provides the default recovery option when also  database is unavailable because of an incident in the region where your database is hosted. Similar to Point In Time Restore, Geo-Restore relies on database backups in geo-redundant Azure storage. It restores from the geo-replicated backup copy and therefore is resilient to the storage outages in the primary region.  Refer to [Recover from an outage](sql-database-disaster-recovery.md) for details of how to use Geo-Restore.

###Standard Geo-Replication

Standard Geo-Replication is available for Standard and Premium databases. It’s designed for applications that can use the capacity of standard service tier but have more aggressive recovery requirements than Geo-Restore can offer. When the primary database fails you can initiate failover to a non-readable secondary database stored in the DR paired region. Refer to [Design for business continuity](sql-database-business-continuity-design.md) for details on how to configure Geo-Replication and to [Recover from an outage](sql-database-disaster-recovery.md) for details of how to failover to the secondary database.

###Active Geo-Replication

Active Geo-Replication is available for Premium databases. It’s designed for write-intensive applications with the most aggressive recovery requirements. Using Active Geo-Replication, you can create up to four readable secondaries on servers in different regions. You can initiate failover to any of the secondaries in the same way as Standard Geo-Replication.  In addition, Active Geo-Replication can be used to support the application upgrade or relocation scenarios, as well as load balancing for read-only workloads. Refer to [Design for business continuity](sql-database-business-continuity-design.md) for details on how to configure Geo-Replication and to [Recover from an outage](sql-database-disaster-recovery.md) for details of how to failover to the secondary database. Refer to [Application upgrade without downtime](sql-database-business-continuity-application-upgrade.md) for details on how to implement the application upgrade without downtime.



 
