---
title: How to migrate an existing database to Hyperscale
description: How to migrate a database in Azure SQL Database to the Hyperscale service tier.
services: sql-database
ms.service: sql-database
ms.subservice: service-overview
ms.topic: conceptual
author: dimitri-furman
ms.author: dfurman
ms.reviewer: kendralittle, mathoma
ms.date: 2/17/2022
---


# 

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

 The [Hyperscale service tier](service-tier-hyperscale.md) provides a highly scalable storage and compute performance tier that leverages the Azure architecture to scale out storage and compute resources for an Azure SQL Database substantially beyond the limits available for the General Purpose and Business Critical service tiers. This article describes how to carry out essential administration tasks for Hyperscale databases, including migrating an existing database to Hyperscale, restoring a Hyperscale database to a different region, and reverse migrating from Hyperscale to another service tier.


## Migrate an existing database to Hyperscale

### Prerequisites

To move a database that is a part of a [geo-replication](active-geo-replication-overview.md) relationship, either as the primary or as a secondary, to Hyperscale, you need to stop replication. Databases in a [failover group](auto-failover-group-overview.md) must be removed from the group first.

Once a database has been moved to Hyperscale, you can create a new Hyperscale geo-replica for that database. Geo-replication for Hyperscale is in preview with certain [limitations](active-geo-replication-overview.md).


### Migrate a database to the Hyperscale service tier

The following T-SQL command moves a database into the Hyperscale service tier. You must specify both the edition and service objective in the `ALTER DATABASE` statement.

```sql
-- Alter a database to make it a Hyperscale Database
ALTER DATABASE [DB2] MODIFY (EDITION = 'Hyperscale', SERVICE_OBJECTIVE = 'HS_Gen5_4');
GO
```

## Restore a Hyperscale database to a different region




## Reverse migrate from Hyperscale

After you migrate an existing Azure SQL Database to the Hyperscale service tier, you can reverse migrate a Hyperscale database to the General Purpose service tier. Reverse migration is available within 45 days of the original migration to Hyperscale. If you wish to migrate the database to another service tier, such as Business Critical, reverse migrate to the General Purpose service tier, then perform a further migration.


## Next steps

Learn more about Hyperscale databases in the following articles:

* TODO: add link for quickstart on create Hyperscale database