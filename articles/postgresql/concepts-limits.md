---
title: Limits in Azure Database for PostgreSQL - Single Server
description: This article describes limits in Azure Database for PostgreSQL - Single Server, such as number of connection and storage engine options.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 06/25/2019
ms.custom: fasttrack-edit
---
# Limits in Azure Database for PostgreSQL - Single Server
The following sections describe capacity and functional limits in the database service. If you'd like to learn about resource (compute, memory, storage) tiers, see the [pricing tiers](concepts-pricing-tiers.md) article.


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
|General Purpose| 64| 1900|
|Memory Optimized| 2| 300|
|Memory Optimized| 4| 500|
|Memory Optimized| 8| 960|
|Memory Optimized| 16| 1900|
|Memory Optimized| 32| 1987|

When connections exceed the limit, you may receive the following error:
> FATAL:  sorry, too many clients already

The Azure system requires five connections to monitor the Azure Database for PostgreSQL server. 

## Functional limitations
### Scale operations
- Dynamic scaling to and from the Basic pricing tiers is currently not supported.
- Decreasing server storage size is currently not supported.

### Server version upgrades
- Automated migration between major database engine versions is currently not supported. If you would like to upgrade to the next major version, take a [dump and restore](./howto-migrate-using-dump-and-restore.md) it to a server that was created with the new engine version.

> Note that prior to PostgreSQL version 10, the [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/) considered a _major version_ upgrade to be an increase in the first _or_ second number (for example, 9.5 to 9.6 was considered a _major_ version upgrade).
> As of version 10, only a change in the first number is considered a major version upgrade (for example, 10.0 to 10.1 is a _minor_ version upgrade, and 10 to 11 is a _major_ version upgrade).

### VNet service endpoints
- Support for VNet service endpoints is only for General Purpose and Memory Optimized servers.

### Restoring a server
- When using the PITR feature, the new server is created with the same pricing tier configurations as the server it is based on.
- The new server created during a restore does not have the firewall rules that existed on the original server. Firewall rules need to be set up separately for this new server.
- Restoring a deleted server is not supported.

### UTF-8 characters on Windows
- In some scenarios, UTF-8 characters are not supported fully in open source PostgreSQL on Windows, which affects Azure Database for PostgreSQL. Please see the thread on [Bug #15476 in the postgresql-archive](https://www.postgresql-archive.org/BUG-15476-Problem-on-show-trgm-with-4-byte-UTF-8-characters-td6056677.html) for more information.

## Next steps
- Understand [what’s available in each pricing tier](concepts-pricing-tiers.md)
- Learn about [Supported PostgreSQL Database Versions](concepts-supported-versions.md)
- Review [how to back up and restore a server in Azure Database for PostgreSQL using the Azure portal](howto-restore-server-portal.md)
