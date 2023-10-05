---
title: App development best practices - Azure Database for PostgreSQL single server
description: Learn about best practices for building an app by using Azure Database for PostgreSQL single server.
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
author: sunilagarwal
ms.author: sunila
ms.reviewer: ""
ms.date: 06/24/2022
---

# Best practices for building an application with Azure Database for PostgreSQL single server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Here are some best practices to help you build a cloud-ready application by using Azure Database for PostgreSQL. These best practices can reduce development time for your app.

## Configuration of application and database resources

### Keep the application and database in the same region

Make sure all your dependencies are in the same region when deploying your application in Azure. Spreading instances across regions or availability zones creates network latency, which might affect the overall performance of your application.

### Keep your PostgreSQL server secure

Configure your PostgreSQL server to be [secure](./concepts-security.md) and not accessible publicly. Use one of these options to secure your server:

- [Firewall rules](./concepts-firewall-rules.md)
- [Virtual networks](./concepts-data-access-and-security-vnet.md)
- [Azure Private Link](./concepts-data-access-and-security-private-link.md)

For security, you must always connect to your PostgreSQL server over SSL and configure your PostgreSQL server and your application to use TLS 1.2. See [How to configure SSL/TLS](./concepts-ssl-connection-security.md).


### Use environment variables for connection information

Do not save your database credentials in your application code. Depending on the front end application, follow the guidance to set up environment variables. For App service use, see [how to configure app settings](../../app-service/configure-common.md#configure-app-settings) and for Azure Kubernetes service, see [how to use Kubernetes secrets](https://kubernetes.io/docs/concepts/configuration/secret/).

## Performance and resiliency

Here are a few tools and practices that you can use to help debug performance issues with your application.

### Use Connection Pooling

With connection pooling, a fixed set of connections is established at the startup time and maintained. This also helps reduce the memory fragmentation on the server that is caused by the dynamic new connections established on the database server. The connection pooling can be configured on the application side if the app framework or database driver supports it. If that is not supported, the other recommended option is to leverage a proxy connection pooler service like [PgBouncer](https://pgbouncer.github.io/) or [Pgpool](https://pgpool.net/mediawiki/index.php/Main_Page) running outside the application and connecting to the database server. Both PgBouncer and Pgpool are community based tools that work with Azure Database for PostgreSQL.

### Retry logic to handle transient errors

Your application might experience transient errors where connections to the database are dropped or lost intermittently. In such situations, the server is up and running after one to two retries in 5 to 10 seconds. A good practice is to wait for 5 seconds before your first retry. Then follow each retry by increasing the wait gradually, up to 60 seconds. Limit the maximum number of retries at which point your application considers the operation failed, so you can then further investigate. See [How to troubleshoot connection errors](./concepts-connectivity.md) to learn more.

### Enable read replication to mitigate failovers

You can use [Data-in Replication](./concepts-read-replicas.md) for failover scenarios. When you're using read replicas, no automated failover between source and replica servers occurs. You'll notice a lag between the source and the replica because the replication is asynchronous. Network lag can be influenced by many factors, like the size of the workload running on the source server and the latency between datacenters. In most cases, replica lag ranges from a few seconds to a couple of minutes.

## Database deployment

### Configure CI/CD deployment pipeline

Occasionally, you need to deploy changes to your database. In such cases, you can use continuous integration (CI) through [GitHub Actions](https://github.com/Azure/postgresql/blob/master/README.md) for your PostgreSQL server to update the database by running a custom script against it.

### Define manual database deployment process

During manual database deployment, follow these steps to minimize downtime or reduce the risk of failed deployment:

- Create a copy of a production database on a new database by using pg_dump.
- Update the new database with your new schema changes or updates needed for your database.
- Put the production database in a read-only state. You should not have write operations on the production database until deployment is completed.
- Test your application with the newly updated database from step 1.
- Deploy your application changes and make sure the application is now using the new database that has the latest updates.
- Keep the old production database so that you can roll back the changes. You can then evaluate to either delete the old production database or export it on Azure Storage if needed.

> [!NOTE]
> If the application is like an e-commerce app and you can't put it in read-only state, deploy the changes directly on the production database after making a backup. Theses change should occur during off-peak hours with low traffic to the app to minimize the impact, because some users might experience failed requests. Make sure your application code also handles any failed requests.

## Database schema and queries

Here are few tips to keep in mind when you build your database schema and your queries.

### Use BIGINT or UUID for Primary Keys

When building custom application or some frameworks they maybe using `INT` instead of `BIGINT` for primary keys. When you use ```INT```, you run the risk of where the value in your database can exceed storage capacity of ```INT``` data type. Making this change to an existing production application can be time consuming with cost more development time. Another option is to use [UUID](https://www.postgresql.org/docs/current/datatype-uuid.html) for primary keys.This identifier uses an auto-generated 128-bit string, for example ```a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11```. Learn more about [PostgreSQL data types](https://www.postgresql.org/docs/current/datatype.html).

### Use indexes

There are many types of [indexes](https://www.postgresql.org/docs/current/indexes.html) in Postgres which can be used in different ways. Using an index helps the server find and retrieve specific rows much faster than it could do without an index. But indexes also add overhead to the database server, hence avoid having too many indexes.

### Use autovacuum

You can optimize your server with autovacuum on an Azure Database for PostgreSQL server. PostgreSQL allow greater database concurrency but with every update  results in insert and delete. For delete, the records are soft marked which will be purged later. To carry out these tasks, PostgreSQL runs a vacuum job. If you don't vacuum from time to time, the dead tuples that accumulate can result in:

- Data bloat, such as larger databases and tables.
- Larger suboptimal indexes.
- Increased I/O.

Learn more about [how to optimize with autovacuum](how-to-optimize-autovacuum.md).

### Use pg_stats_statements

Pg_stat_statements is a PostgreSQL extension that's enabled by default in Azure Database for PostgreSQL. The extension provides a means to track execution statistics for all SQL statements executed by a server. See [how to use pg_statement](how-to-optimize-query-stats-collection.md).

### Use the Query Store

The [Query Store](./concepts-query-store.md) feature in Azure Database for PostgreSQL provides a method to track query statistics. We recommend this feature as an alternative to using pg_stats_statements.

### Optimize bulk inserts and use transient data

If you have workload operations that involve transient data or that insert large datasets in bulk, consider using unlogged tables. It provides atomicity and durability, by default. Atomicity, consistency, isolation, and durability make up the ACID properties. See [how to optimize bulk inserts](how-to-optimize-bulk-inserts.md).

