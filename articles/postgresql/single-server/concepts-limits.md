---
title: Limits - Azure Database for PostgreSQL - Single Server
description: This article describes limits in Azure Database for PostgreSQL - Single Server, such as number of connection and storage engine options.
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: sunila
author: sunilagarwal
ms.date: 06/24/2022
ms.custom: fasttrack-edit
---

# Limits in Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

The following sections describe capacity and functional limits in the database service. If you'd like to learn about resource (compute, memory, storage) tiers, see the [pricing tiers](concepts-pricing-tiers.md) article.

## Maximum connections

The maximum number of connections per pricing tier and vCores are shown below. The Azure system requires five connections to monitor the Azure Database for PostgreSQL server.

|**Pricing Tier**| **vCore(s)**| **Max Connections** | **Max User Connections** |
|---|---|---|---|
|Basic| 1| 55 | 50|
|Basic| 2| 105 | 100|
|General Purpose| 2| 150| 145|
|General Purpose| 4| 250| 245|
|General Purpose| 8| 480| 475|
|General Purpose| 16| 950| 945|
|General Purpose| 32| 1500| 1495|
|General Purpose| 64| 1900| 1895|
|Memory Optimized| 2| 300| 295|
|Memory Optimized| 4| 500| 495|
|Memory Optimized| 8| 960| 955|
|Memory Optimized| 16| 1900| 1895|
|Memory Optimized| 32| 1987| 1982|

When connections exceed the limit, you may receive the following error:
> FATAL:  sorry, too many clients already

> [!IMPORTANT]
> For best experience, we recommend that you use a connection pooler like pgBouncer to efficiently manage connections.

A PostgreSQL connection, even idle, can occupy up to 2MB of memory. Also, creating new connections takes time. Most applications request many short-lived connections, which compounds this situation. The result is fewer resources available for your actual workload leading to decreased performance. A connection pooler that decreases idle connections and reuses existing connections will help avoid this. To learn more, visit our [blog post](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717).

## Functional limitations

### Scale operations

- Dynamic scaling to and from the Basic pricing tiers is currently not supported.
- Decreasing server storage size is currently not supported.

### Server version upgrades

- Automated migration between major database engine versions is currently not supported. If you would like to upgrade to the next major version, take a [dump and restore](./how-to-migrate-using-dump-and-restore.md) it to a server that was created with the new engine version.

> Note that prior to PostgreSQL version 10, the [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/) considered a _major version_ upgrade to be an increase in the first _or_ second number (for example, 9.5 to 9.6 was considered a _major_ version upgrade).
> As of version 10, only a change in the first number is considered a major version upgrade (for example, 10.0 to 10.1 is a _minor_ version upgrade, and 10 to 11 is a _major_ version upgrade).

### VNet service endpoints

- Support for VNet service endpoints is only for General Purpose and Memory Optimized servers.

### Restoring a server

- When using the PITR feature, the new server is created with the same pricing tier configurations as the server it is based on.
- The new server created during a restore does not have the firewall rules that existed on the original server. Firewall rules need to be set up separately for this new server.
- Restoring a deleted server is not supported.

### UTF-8 characters on Windows

- In some scenarios, UTF-8 characters are not supported fully in open source PostgreSQL on Windows, which affects Azure Database for PostgreSQL. Please see the thread on [Bug #15476 in the postgresql-archive](https://www.postgresql.org/message-id/2101.1541220270%40sss.pgh.pa.us) for more information.

### GSS error

If you see an error related to **GSS**, you are likely using a newer client/driver version which Azure Postgres Single Server does not yet fully support. This error is known to affect [JDBC driver versions 42.2.15 and 42.2.16](https://github.com/pgjdbc/pgjdbc/issues/1868).
   - We plan to complete the update by the end of November. Consider using a working driver version in the meantime.
   - Or, consider disabling the GSS request.  Use a connection parameter like `gssEncMode=disable`.

### Storage size reduction

Storage size cannot be reduced. You have to create a new server with desired storage size, perform manual [dump and restore](./how-to-migrate-using-dump-and-restore.md) and migrate your database(s) to the new server.

## Next steps

- Understand [what’s available in each pricing tier](concepts-pricing-tiers.md)
- Learn about [Supported PostgreSQL Database Versions](concepts-supported-versions.md)
- Review [how to back up and restore a server in Azure Database for PostgreSQL using the Azure portal](how-to-restore-server-portal.md)
