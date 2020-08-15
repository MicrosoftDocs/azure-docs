---
title: Limits - Azure Database for PostgreSQL - Flexible Server
description: This article describes limits in Azure Database for PostgreSQL - Flexible Server, such as number of connection and storage engine options.
author: lfittl-msft
ms.author: lufittl
ms.service: postgresql
ms.topic: conceptual
ms.date: 9/22/2020
---

# Limits in Azure Database for PostgreSQL - Flexible Server

The following sections describe capacity and functional limits in the database service. If you'd like to learn about resource (compute, memory, storage) tiers, see the [compute and storage](concepts-compute-storage.md) article.

## Maximum connections

When connections exceed the limit, you may receive the following error:
> FATAL:  sorry, too many clients already

> [!IMPORTANT]
> For best experience, we recommend that you use a connection pooler like pgBouncer to efficiently manage connections.

A PostgreSQL connection, even idle, can occupy about 10 MB of memory. Also, creating new connections takes time. Most applications request many short-lived connections, which compounds this situation. The result is fewer resources available for your actual workload leading to decreased performance. Connection pooling can be used to decrease idle connections and reuse existing connections. To learn more, visit our [blog post](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717).

## Functional limitations

### Stop/start operation

- Stop/start for servers with Zone redundant HA is currently not supported

### Scale operations

- Decreasing server storage size is currently not supported.

### Server version upgrades

- Automated migration between major database engine versions is currently not supported.<!-- If you would like to upgrade to the next major version, take a [dump and restore](./howto-migrate-using-dump-and-restore.md) it to a server that was created with the new engine version.-->

### Restoring a server

- When using the Point-in-time-Restore feature, the new server is created with the same compute and storage configurations as the server it is based on.
- The new server created during a restore does not have the firewall rules that existed on the original server. You need to create firewall rules separately for the new server.
- Restoring a deleted server is not supported.

## Next steps

- Understand [what’s available for compute and storage options](concepts-compute-storage.md)
<!--- Learn about [Supported PostgreSQL Database Versions](concepts-supported-versions.md)
- Review [how to back up and restore a server in Azure Database for PostgreSQL using the Azure portal](howto-restore-server-portal.md)-->