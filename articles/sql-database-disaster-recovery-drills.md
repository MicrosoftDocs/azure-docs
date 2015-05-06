<properties 
   pageTitle="SQL Database Disaster Recovery Drills" 
   description="Learn guidance and best practices for using Azure SQL Database to perform disaster recovery drills that will help keep your mission critical business applications resilient to failures and outages." 
   services="sql-database" 
   documentationCenter="" 
   authors="mihaelablendea" 
   manager="jeffreyg" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management" 
   ms.date="04/13/2015"
   ms.author="mihaelab"/>

#Performing Disaster Recovery Drill

It is recommended that validation of application readiness for recovery workflow is performed periodically. Verifying the application behavior and implications of data loss and/or the disruption that failover involves is a good engineering practice. It is also a requirement by most industry standards as part of business continuity certification.

Performing a disaster recovery drill consists of:

- Simulating data tier outage
- Recovering 
- Validate application integrity post recovery

Depending how you [design for business continuity](sql-database-business-continuity.md), the workflow to execute the drill can vary. Below we describe the best practices conducting a disaster recovery drill in the context of Azure SQL Database. 

##Geo-Restore

To prevent the potential data loss when conducting a disaster recovery drill, we recommend performing the drill using a test environment by creating a copy of the production environment and using it to verify the application’s failover workflow.
 
####Outage simulation

- Simulate the outage by either deleting or renaming the source database and cause application connectivity failure. This way you can validate outage detection/alerting and measure RTO for recovery duration.

####Recovery

- Perform the Geo-Restore of the database into a different server as described [here](sql-database-disaster-recovery.md). 
- Change the application configuration to connect to the recovered database(s) and follow the [Finalize a Recovered Database](sql-database-recovered-finalize.md) guide to complete the recovery.

####Validation

- Complete the drill by verifying the application integrity post recovery (i.e. connection strings, logins, basic functionality testing or other validations part of standard application signoffs procedures).

##Standard Geo-Replication

A database that is protected using Standard Geo-Replication can only have one non-readable secondary database. The drill exercise will involve forced termination of the link, at which point the database will be unprotected. Moreover, there is a possibility of data loss, so we don’t recommend customers to perform such test on production databases. Instead we recommend creating a copy of the production environment and using it to verify the application’s failover workflow.

####Outage simulation

- Simulate workload on primary database. If the primary is active at the time of termination data loss might occur, which will make the drill more realistic.
- Delete the primary database or [perform forced termination](sql-database-disaster-recovery.md) of the link on the secondary database side.

####Recovery

- Change the application configuration to connect to the former read-only secondary which will become fully accessible and the application can use it as the new primary. 
- Follow the [Finalize a Recovered Database](sql-database-recovered-finalize.md) guide to complete the recovery.

####Validation

- Complete the drill by verifying the application integrity post recovery (i.e. connection strings, logins, basic functionality testing or other validations part of standard application signoffs procedures).

##Active Geo-Replication

The disaster recovery drill will be conducted by using a parallel target server and creating another set of read only secondaries in it. A test version of the application tier should be used to verify the operation health and data integrity by running tests against that server after forced termination. 

####Outage simulation

- [Create a new active geo-replication link](sql-database-business-continuity-design.md) from primary database to a secondary test server. If the primary is active at the time of termination the data loss might occur, which will make the drill more realistic.
- [Perform forced termination](sql-database-disaster-recovery.md) of the link on the secondary database which resides on the test server.

####Recovery

- Change the application configuration to connect to the former read only secondary which will become available for writes after termination.
- Follow the [Finalize a Recovered Database](sql-database-recovered-finalize.md) guide to complete the recovery.

####Validation

- Complete the drill by verifying the application integrity post recovery (i.e. connection strings, logins, basic functionality testing or other validations part of standard application signoffs procedures).

