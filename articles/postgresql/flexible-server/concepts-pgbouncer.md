---
title: PgBouncer in Azure Database for PostgreSQL - Flexible Server
description: This article provides an overview of the built-in PgBouncer feature.
author: varun-dhawan
ms.author: varundhawan
ms.reviewer: maghan
ms.date: 05/22/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# PgBouncer in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL flexible server offers [PgBouncer](https://github.com/pgbouncer/pgbouncer) as a built-in connection pooling solution. PgBouncer is an optional feature that you can enable on a per-database-server basis. It's supported on General Purpose and Memory Optimized compute tiers in both public access and private access networks.

PgBouncer runs on the same virtual machine (VM) as the database server for Azure Database for PostgreSQL flexible server. Postgres uses a process-based model for connections, so maintaining many idle connections is expensive. Postgres runs into resource constraints when the server runs more than a few thousand connections. The primary benefit of PgBouncer is to improve idle connections and short-lived connections at the database server.

PgBouncer uses a lightweight model that utilizes asynchronous I/O. It uses Postgres connections only when needed--that is, when inside an open transaction or when a query is active. This model allows scaling to up to 10,000 connections with low overhead.

PgBouncer runs on port 6432 on your database server. You can change your application's database connection configuration to use the same host name, but change the port to 6432 to start using PgBouncer and benefit from improved scaling of idle connections.

PgBouncer in Azure Database for PostgreSQL flexible server supports [Microsoft Entra authentication](./concepts-azure-ad-authentication.md).

## Enabling and configuring PgBouncer

To enable PgBouncer, go to the **Server parameters** pane in the Azure portal, search for **PgBouncer**, and change the `pgbouncer.enabled` setting to `true`. There's no need to restart the server.

You can configure PgBouncer settings by using these parameters.

> [!NOTE]
> The following list of PgBouncer server parameters is visible on the **Server parameters** pane only if the `pgbouncer.enabled` server parameter is set to `true`. Otherwise, they're deliberately hidden.

[!INCLUDE [pgbouncer-parameters-table](./includes/pgbouncer-parameters-table.md)]

For more information about PgBouncer configurations, see the [pgbouncer.ini documentation](https://www.pgbouncer.org/config.html).

## Version of PgBouncer

Currently, the version of PgBouncer deployed on all supported major versions of the engine ([!INCLUDE [pgbouncer-table](./includes/majorversionsascending.md)]), in Azure Database for PostgreSQL Flexible Server, is **[!INCLUDE [pgbouncer-table](./includes/pgbouncer-table.md)]**.

## Benefits

By using the built-in PgBouncer feature with Azure Database for PostgreSQL flexible server, you can get these benefits:

* **Convenience of simplified configuration**: Because PgBouncer is integrated with Azure Database for PostgreSQL flexible server, there's no need for a separate installation or complex setup. You can configure it directly from the server parameters.

* **Reliability of a managed service**: PgBouncer offers the advantages of Azure managed services. For example, Azure manages updates of PgBouncer. Automatic updates eliminate the need for manual maintenance and ensure that PgBouncer stays up to date with the latest features and security patches.

* **Support for various connection types**: PgBouncer in Azure Database for PostgreSQL flexible server provides support for both public and private connections. You can use it to establish secure connections over private networks or connect externally, depending on your specific requirements.

* **High availability in failover scenarios**: If a standby server is promoted to the primary role during a failover, PgBouncer seamlessly restarts on the newly promoted standby. You don't need to make any changes to the application connection string. This ability helps ensure continuous availability and minimizes disruption to the application's connection pool.

## Monitoring PgBouncer

### Metrics

Azure Database for PostgreSQL flexible server provides six metrics for monitoring PgBouncer connection pooling:

|Display name                            |Metric ID                |Unit |description                                                                          |Dimension   |Default enabled|
|----------------------------------------|--------------------------|-----|-------------------------------------------------------------------------------------|------------|---------------|
|**Active client connections** (preview) |`client_connections_active` |Count|Connections from clients that are associated with an Azure Database for PostgreSQL flexible server connection           |`DatabaseName`|No             |
|**Waiting client connections** (preview)|`client_connections_waiting`|Count|Connections from clients that are waiting for an Azure Database for PostgreSQL flexible server connection to service them|`DatabaseName`|No             |
|**Active server connections** (preview) |`server_connections_active` |Count|Connections to Azure Database for PostgreSQL flexible server that a client connection is using                    |`DatabaseName`|No             |
|**Idle server connections** (preview)   |`server_connections_idle`   |Count|Connections to Azure Database for PostgreSQL flexible server that are idle and ready to service a new client connection    |`DatabaseName`|No             |
|**Total pooled connections** (preview)  |`total_pooled_connections`  |Count|Current number of pooled connections                                                 |`DatabaseName`|No             |
|**Number of connection pools** (preview)|`num_pools`                 |Count|Total number of connection pools                                                     |`DatabaseName`|No             |

To learn more, see [PgBouncer metrics](./concepts-monitoring.md#pgbouncer-metrics).

### Admin console

PgBouncer also provides an *internal* database called `pgbouncer`. When you connect to that database, you can run `SHOW` commands that provide information on the current state of PgBouncer.

To connect to the `pgbouncer` database:

1. Set the `pgBouncer.stats_users` parameter to the name of an existing user (for example, `myUser`), and apply the changes.
1. Connect to the `pgbouncer` database as this user and set the port as `6432`:

   ```sql
   psql "host=myPgServer.postgres.database.azure.com port=6432 dbname=pgbouncer user=myUser password=myPassword sslmode=require"
   ```

After you're connected to the database, use `SHOW` commands to view PgBouncer statistics:

* `SHOW HELP`: List all the available `SHOW` commands.
* `SHOW POOLS`: Show the number of connections in each state for each pool.
* `SHOW DATABASES`: Show the current applied connection limits for each database.
* `SHOW STATS`: Show statistics on requests and traffic for every database.

For more information on the PgBouncer `SHOW` commands, see [Admin console](https://www.pgbouncer.org/usage.html#admin-console).

## Switching your application to use PgBouncer

To start using PgBouncer, follow these steps:

1. Connect to your database server, but use port 6432 instead of the regular port 5432. Verify that this connection works.

   ```azurecli-interactive
   psql "host=myPgServer.postgres.database.azure.com port=6432 dbname=postgres user=myUser password=myPassword sslmode=require"
   ```

2. Test your application in a QA environment against PgBouncer, to make sure you don't have any compatibility problems. The PgBouncer project provides a compatibility matrix, and we recommend [transaction pooling](https://www.PgBouncer.org/features.html#sql-feature-map-for-pooling-modes) for most users.
3. Change your production application to connect to port 6432 instead of 5432. Monitor for any application-side errors that might point to compatibility issues.

## PgBouncer in zone-redundant high availability

In zone-redundant, high-availability (HA) servers, the primary server runs PgBouncer. You can connect to PgBouncer on the primary server over port 6432. After a failover, PgBouncer is restarted on the newly promoted standby, which is now the primary server. So your application connection string remains the same after failover.

## Using PgBouncer with other connection pools

In some cases, you might already have an application-side connection pool or have PgBouncer set up on your application side (for example, an Azure Kubernetes Service sidecar). In these cases, the built-in PgBouncer feature can still be useful because it provides the benefits of idle connection scaling.

Using an application-side pool together with PgBouncer on the database server can be beneficial. Here, the application-side pool brings the benefit of reduced initial connection latency (because the roundtrip to initialize the connection is much faster), and the database-side PgBouncer provides idle connection scaling.

## Limitations

* The PgBouncer feature is currently not supported with the Burstable server compute tier. If you change the compute tier from General Purpose or Memory Optimized to Burstable, you lose the built-in PgBouncer capability.

* Whenever the server is restarted during scale operations, HA failover, or a restart, PgBouncer and the VM are also restarted. You then have to re-establish the existing connections.

* The portal doesn't show all PgBouncer parameters. After you enable PgBouncer and save the parameters, you have to close the **Server parameters** pane (for example, select **Overview**) and then go back to the **Server parameters** pane.

* You can't use statement pool modes along with prepared statements. Current version of PgBouncer added support for prepared statements inside of transaction mode. This support can enabled and configured via [max_prepared_statements parameter](./concepts-server-parameters.md). Setting this parameter above default value of 0 will turn on support for prepared statements. This support only only applies to protocol-level prepared statements. For most programming languages, this means that we are using the *[libpq](https://www.postgresql.org/docs/current/libpq.html)* function *PQprepare* on the client, sending protocol level commands that PgBouncer can intercept, rather than issuing a dynamic SQL command similar to *PREPARE proc AS*, which is sending text that PgBouncer will not interpret correctly.  To check other limitations of your chosen pool mode, refer to the [PgBouncer documentation](https://www.pgbouncer.org/features.html).

* If PgBouncer is deployed as a feature, it becomes a potential single point of failure. If the PgBouncer feature is down, it can disrupt the entire database connection pool and cause downtime for the application. To mitigate the single point of failure, you can set up multiple PgBouncer instances behind a load balancer for high availability on Azure VMs.

* PgBouncer is a lightweight application that uses a single-threaded architecture. This design is great for most application workloads. But in applications that create a large number of short-lived connections, this design might affect pgBouncer performance and limit your ability to scale your application. You might need to try one of these approaches:

  * Distribute the connection load across multiple PgBouncer instances on Azure VMs.
  * Consider alternative solutions, including multithreaded solutions like [PgCat](https://github.com/postgresml/pgcat), on Azure VMs.

> [!IMPORTANT]
> The parameter `pgbouncer.client_tls_sslmode` for the built-in PgBouncer feature has been deprecated in Azure Database for PostgreSQL flexible server.
>
> When TLS/SSL for connections to Azure Database for PostgreSQL flexible server is enforced via setting the `require_secure_transport` server parameter to `ON`, TLS/SSL is automatically enforced for connections to the built-in PgBouncer feature. This setting is on by default when you create a new Azure Database for PostgreSQL flexible server instance and enable the built-in PgBouncer feature. For more information, see [Networking overview for Azure Database for PostgreSQL - Flexible Server with private access](./concepts-networking.md#tls-and-ssl).

For customers who want simplified management, built-in high availability, easy connectivity with containerized applications, and the ability to use the most popular configuration parameters, the built-in PgBouncer feature is a good choice. For customers who want multithreaded scalability, full control of all parameters, and a debugging experience, setting up PgBouncer on Azure VMs might be an alternative.

## Next steps

* Learn about [network concepts](./concepts-networking.md).
* Get an [overview of Azure Database for PostgreSQL flexible server](./overview.md).
