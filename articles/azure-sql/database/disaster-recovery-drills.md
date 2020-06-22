---
title: Disaster recovery drills 
description: Learn guidance and best practices for using Azure SQL Database to perform disaster recovery drills.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang:
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: mathoma, carlrab
ms.date: 12/18/2018
---
# Performing disaster recovery drills
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

It is recommended that validation of application readiness for recovery workflow is performed periodically. Verifying the application behavior and implications of data loss and/or the disruption that failover involves is a good engineering practice. It is also a requirement by most industry standards as part of business continuity certification.

Performing a disaster recovery drill consists of:

* Simulating data tier outage
* Recovering
* Validate application integrity post recovery

Depending on how you [designed your application for business continuity](business-continuity-high-availability-disaster-recover-hadr-overview.md), the workflow to execute the drill can vary. This article describes the best practices for conducting a disaster recovery drill in the context of Azure SQL Database.

## Geo-restore

To prevent the potential data loss when conducting a disaster recovery drill, perform the drill using a test environment by creating a copy of the production environment and using it to verify the application’s failover workflow.

### Outage simulation

To simulate the outage, you can rename the source database. This name change causes application connectivity failures.

### Recovery

* Perform the geo-restore of the database into a different server as described [here](disaster-recovery-guidance.md).
* Change the application configuration to connect to the recovered database and follow the [Configure a database after recovery](disaster-recovery-guidance.md) guide to complete the recovery.

### Validation

Complete the drill by verifying the application integrity post recovery (including connection strings, logins, basic functionality testing, or other validations part of standard application signoffs procedures).

## Failover groups

For a database that is protected using failover groups, the drill exercise involves planned failover to the secondary server. The planned failover ensures that the primary and the secondary databases in the failover group remain in sync when the roles are switched. Unlike the unplanned failover, this operation does not result in data loss, so the drill can be performed in the production environment.

### Outage simulation

To simulate the outage, you can disable the web application or virtual machine connected to the database. This outage simulation results in the connectivity failures for the web clients.

### Recovery

* Make sure the application configuration in the DR region points to the former secondary, which becomes the fully accessible new primary.
* Initiate [planned failover](scripts/setup-geodr-and-failover-database-powershell.md) of the failover group from the secondary server.
* Follow the [Configure a database after recovery](disaster-recovery-guidance.md) guide to complete the recovery.

### Validation

Complete the drill by verifying the application integrity post recovery (including connectivity, basic functionality testing, or other validations required for the drill signoffs).

## Next steps

* To learn about business continuity scenarios, see [Continuity scenarios](business-continuity-high-availability-disaster-recover-hadr-overview.md).
* To learn about Azure SQL Database automated backups, see [SQL Database automated backups](automated-backups-overview.md)
* To learn about using automated backups for recovery, see [restore a database from the service-initiated backups](recovery-using-backups.md).
* To learn about faster recovery options, see [Active geo-replication](active-geo-replication-overview.md) and [Auto-failover groups](auto-failover-group-overview.md).
