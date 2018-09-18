---
title: Limitations in Azure Database for PostgreSQL
description: This article describes limitations in Azure Database for PostgreSQL, such as number of connection and storage engine options.
services: postgresql
author: rachel-msft
ms.author: raagyema
manager: kfile
editor: jasonwhowell
ms.service: postgresql
ms.topic: article
ms.date: 06/30/2018
---
# Limitations in Azure Database for PostgreSQL
The following sections describe capacity and functional limits in the database service.

## Maximum connections
The maximum number of connections per pricing tier and vCores are as follows: 

|**Pricing Tier**| **vCore(s)**| **Max Connections** |
|---|---|---|
|Basic| 1| 50 |
|Basic| 2| 100 |
|General Purpose| 2| 150|
|General Purpose| 4| 250|
|General Purpose| 8| 480|
|General Purpose| 16| 950|
|General Purpose| 32| 1500|
|Memory Optimized| 2| 150|
|Memory Optimized| 4| 250|
|Memory Optimized| 8| 480|
|Memory Optimized| 16| 950|

When connections exceed the limit, you may receive the following error:
> FATAL:  sorry, too many clients already

The Azure system requires five connections to monitor the Azure Database for PostgreSQL server. 

## Functional limitations
### Scale operations
- Dynamic scaling to and from the Basic pricing tiers is currently not supported.
- Decreasing server storage size is currently not supported.

### Server version upgrades
- Automated migration between major database engine versions is currently not supported. If you would like to upgrade to the next major version, take a [dump and restore](./howto-migrate-using-dump-and-restore.md) it to a server that was created with the new engine version.

### VNet service endpoints
- Support for VNet service endpoints is only for General Purpose and Memory Optimized servers.

### Restoring a server
- When using the PITR feature, the new server is created with the same pricing tier configurations as the server it is based on.
- The new server created during a restore does not have the firewall rules that existed on the original server. Firewall rules need to be set up separately for this new server.
- Restoring a deleted server is not supported.

## Next steps
- Understand [what’s available in each pricing tier](concepts-pricing-tiers.md)
- Learn about [Supported PostgreSQL Database Versions](concepts-supported-versions.md)
- Review [how to back up and restore a server in Azure Database for PostgreSQL using the Azure portal](howto-restore-server-portal.md)
