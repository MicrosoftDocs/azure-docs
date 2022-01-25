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

# How to migrate an existing database to Hyperscale

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]



The following T-SQL command moves a database into the Hyperscale service tier. You must specify both the edition and service objective in the `ALTER DATABASE` statement.

```sql
-- Alter a database to make it a Hyperscale Database
ALTER DATABASE [DB2] MODIFY (EDITION = 'Hyperscale', SERVICE_OBJECTIVE = 'HS_Gen5_4');
GO
```

> [!NOTE]
> To move a database that is a part of a [geo-replication](active-geo-replication-overview.md) relationship, either as the primary or as a secondary, to Hyperscale, you have to stop replication. Databases in a [failover group](auto-failover-group-overview.md) must be removed from the group first.
>
> Once a database has been moved to Hyperscale, you can create a new Hyperscale geo-replica for that database. Geo-replication for Hyperscale is in preview with certain [limitations](active-geo-replication-overview.md).
