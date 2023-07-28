---
title: PgBouncer - Azure Database for PostgreSQL - Flexible Server
description: This article provides an overview with the built-in PgBouncer extension.
author: varun-dhawan
ms.author: varundhawan
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 7/25/2023
---

# PgBouncer in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL – Flexible Server offers [PgBouncer](https://github.com/pgbouncer/pgbouncer) as a built-in connection pooling solution. This is an optional service that can be enabled on a per-database server basis and is supported with both public and private access. PgBouncer runs in the same virtual machine as the Postgres database server. Postgres uses a process-based model for connections, which makes it expensive to maintain many idle connections. So, Postgres itself runs into resource constraints once the server runs more than a few thousand connections. The primary benefit of PgBouncer is to improve idle connections and short-lived connections at the database server.

PgBouncer uses a more lightweight model that utilizes asynchronous I/O, and only uses actual Postgres connections when needed, that is, when inside an open transaction, or when a query is active. This model can support thousands of connections more easily with low overhead and allows scaling to up to 10,000 connections with low overhead.

When enabled, PgBouncer runs on port 6432 on your database server. You can change your application’s database connection configuration to use the same host name, but change the port to 6432 to start using PgBouncer and benefit from improved idle connection scaling.

> [!NOTE]
> PgBouncer is supported on General Purpose and Memory Optimized compute tiers in both public access and private access networking. 

## Enabling and configuring PgBouncer

In order to enable PgBouncer, you can navigate to the “Server Parameters” blade in the Azure portal, and search for “PgBouncer” and change the pgbouncer.enabled setting to “true” for PgBouncer to be enabled. There's no need to restart the server. However, to set other PgBouncer parameters, see the limitations section.

You can configure PgBouncer, settings with these parameters:

| Parameter Name             | Description | Default | 
|----------------------|--------|-------------|
| pgbouncer.default_pool_size | Set this parameter value to the number of connections per user/database pair      | 50       | 
| pgBouncer.max_client_conn | Set this parameter value to the highest number of client connections to PgBouncer that you want to support.     | 5000     | 
| pgBouncer.pool_mode | Set this parameter value to TRANSACTION for transaction pooling (which is the recommended setting for most workloads).      | TRANSACTION     |
| pgBouncer.min_pool_size | Add more server connections to pool if below this number.    |   0 (Disabled)   |
| pgbouncer.ignore_startup_parameters | Comma-separated list of parameters that PgBouncer can ignore. For example, you can let PgBouncer ignore `extra_float_digits` parameter. Some parameters are allowed, all others raise error. This ability is needed to tolerate overenthusiastic JDBC wanting to unconditionally set 'extra_float_digits=2' in startup packet. Use this option if the library you use report errors such as `pq: unsupported startup parameter: extra_float_digits`. |   |
| pgbouncer.query_wait_timeout | Maximum time (in seconds) queries are allowed to spend waiting for execution. If the query isn't assigned to a server during that time, the client is disconnected. | 120s |
| pgBouncer.stats_users | Optional. Set this parameter value to the name of an existing user, to be able to log in to the special PgBouncer statistics database (named “PgBouncer”).    |      |

For more information about PgBouncer configurations, see [pgbouncer.ini](https://www.pgbouncer.org/config.html).

> [!IMPORTANT]
> Upgrading of PgBouncer is managed by Azure.

## Benefits and Limitations of built-in PGBouncer feature

By using the benefits of built-in PgBouncer with Flexible Server, users can enjoy the convenience of simplified configuration, the reliability of a managed service, support for various connection types, and seamless high availability during failover scenarios. Using built-in PGBouncer feature provides for following benefits:
 * As it's seamlessly integrated with Azure Database for PostgreSQL - Flexible Server service, there's no need for a separate installation or complex setup. It can be easily configured directly from the server parameters, ensuring a hassle-free experience. 
 * As a managed service, users can enjoy the advantages of other Azure managed services. This includes automatic updates, eliminating the need for manual maintenance and ensuring that PgBouncer stays up-to-date with the latest features and security patches. 
 * The built-in PgBouncer in Flexible Server provides support for both public and private connections. This functionality allows users to establish secure connections over private networks or connect externally, depending on their specific requirements. 
 * In the event of a failover, where a standby server is promoted to the primary role, PgBouncer seamlessly restarts on the newly promoted standby without any changes required to the application connection string. This ability ensures continuous availability and minimizes disruption to the application's connection pool. 

## Monitoring PgBouncer

### PgBouncer Metrics

Azure Database for PostgreSQL - Flexible Server now provides six new metrics for monitoring PgBouncer connection pooling.  

|Display Name                            |Metrics ID                |Unit |Description                                                                          |Dimension   |Default enabled|
|----------------------------------------|--------------------------|-----|-------------------------------------------------------------------------------------|------------|---------------|
|**Active client connections** (Preview) |client_connections_active |Count|Connections from clients that are associated with a PostgreSQL connection           |DatabaseName|No             |
|**Waiting client connections** (Preview)|client_connections_waiting|Count|Connections from clients that are waiting for a PostgreSQL connection to service them|DatabaseName|No             |
|**Active server connections** (Preview) |server_connections_active |Count|Connections to PostgreSQL that are in use by a client connection                     |DatabaseName|No             |
|**Idle server connections** (Preview)   |server_connections_idle   |Count|Connections to PostgreSQL that are idle, ready to service a new client connection    |DatabaseName|No             |
|**Total pooled connections** (Preview)  |total_pooled_connections  |Count|Current number of pooled connections                                                 |DatabaseName|No             |
|**Number of connection pools** (Preview)|num_pools                 |Count|Total number of connection pools                                                     |DatabaseName|No             |

To learn more, see [pgbouncer metrics](./concepts-monitoring.md#pgbouncer-metrics)

### Admin Console

PgBouncer also provides an **internal** database that you can connect to called `pgbouncer`. Once connected to the database you can execute `SHOW` commands that provide information on the current state of pgbouncer.

Steps to connect to `pgbouncer` database
1. Set `pgBouncer.stats_users` parameter to the name of an existing user (ex. "myUser"), and apply the changes.
1. Connect to `pgbouncer` database as this user and port as `6432`

```sql
psql "host=myPgServer.postgres.database.azure.com port=6432 dbname=pgbouncer user=myUser password=myPassword sslmode=require"
```

Once connected, use **SHOW** commands to view pgbouncer stats
* `SHOW HELP` - list all the available show commands
* `SHOW POOLS` —  show number of connections in each state for each pool
* `SHOW DATABASES` - show current applied connection limits for each database
* `SHOW STATS` - show stats on requests and traffic for every database

For more details on the PgBouncer show command, please refer [Admin console](https://www.pgbouncer.org/usage.html#admin-console).

## Switching your application to use PgBouncer

In order to start using PgBouncer, follow these steps:
1. Connect to your database server, but use port **6432** instead of the regular port 5432--verify that this connection works
```azurecli-interactive
psql "host=myPgServer.postgres.database.azure.com port=6432 dbname=postgres user=myUser password=myPassword sslmode=require"
```
2. Test your application in a QA environment against PgBouncer, to make sure you don’t have any compatibility problems. The PgBouncer project provides a compatibility matrix, and we recommend using **transaction pooling** for most users: https://www.PgBouncer.org/features.html#sql-feature-map-for-pooling-modes.
3. Change your production application to connect to port **6432** instead of **5432**, and monitor for any application side errors that may point to any compatibility issues.



## PgBouncer in Zone-redundant high availability

In zone-redundant high availability configured servers, the primary server runs the PgBouncer. You can connect to the primary server's PgBouncer over port 6432. After a failover, the PgBouncer is restarted on the newly promoted standby, which is the new primary server. So your application connection string remains the same post failover. 

## Using PgBouncer with other connection pools

In some cases, you may already have an application side connection pool, or have PgBouncer set up on your application side such as an AKS side car. In these cases,  it can still be useful to utilize the built-in PgBouncer, as it provides idle connection scaling benefits.

Utilizing an application side pool together with PgBouncer on the database server can be beneficial. Here, the application side pool brings the benefit of reduced initial connection latency (as the initial roundtrip to initialize the connection is much faster), and the database-side PgBouncer provides idle connection scaling.

## Limitations
 
* PgBouncer feature is currently not supported with Burstable server compute tier. 
* If you change the compute tier from General Purpose or Memory Optimized to Burstable tier, you lose the built-in PgBouncer capability.
* Whenever the server is restarted during scale operations, HA failover, or a restart, the PgBouncer is also restarted along with the server virtual machine. Hence the existing connections have to be re-established.
* Due to a known issue, the portal doesn't show all PgBouncer parameters. Once you enable PgBouncer and save the parameter, you have to exit Parameter screen (for example, click Overview) and then get back to Parameters page. 
* Transaction and statement pool modes can't be used along with prepared statements. Refer to the [PgBouncer documentation](https://www.pgbouncer.org/features.html) to check other limitations of chosen pool mode.

> [!IMPORTANT]
> Parameter pgbouncer.client_tls_sslmode for built-in PgBouncer feature has been deprecated in Azure Database for PostgreSQL - Flexible Server with built-in PgBouncer feature enabled. When TLS\SSL for connections to Azure Database for PostgreSQL - Flexible Server is enforced via setting the **require_secure_transport** server parameter to ON, TLS\SSL is automatically enforced for connections to built-in PgBouncer. This setting to enforce SSL\TLS is on by default on creation of new PostgreSQL Flexible Server and enabling  built-in PgBouncer feature.  For more on SSL\TLS in Flexible Server see this [doc.](./concepts-networking.md#tls-and-ssl)

  
For those customers that are looking for simplified management, built-in high availability, easy connectivity with containerized applications and are interested in utilizing most popular configuration parameters with PGBouncer built-in PGBouncer feature is good choice. For customers looking for full control of all parameters and debugging experience another choice could be setting up PGBouncer on Azure VM as an alternative. 

## Next steps

- Learn about [networking concepts](./concepts-networking.md)
- Flexible server [overview](./overview.md)
