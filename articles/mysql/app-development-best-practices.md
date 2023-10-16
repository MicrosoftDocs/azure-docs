---
title: App development best practices - Azure Database for MySQL
description: Learn about best practices for building an app by using Azure Database for MySQL.
author: mksuni
ms.author: sumuth
ms.reviewer: maghan
ms.date: 03/29/2023
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
---

# Best practices for building an application with Azure Database for MySQL

[!INCLUDE [applies-to-mysql-single-flexible-server](includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE [azure-database-for-mysql-single-server-deprecation](includes/Azure-database-for-mysql-single-server-deprecation.md)]

Here are some best practices to help you build a cloud-ready application using Azure Database for MySQL. These best practices can reduce the development time for your app.

## Configuration of application and database resources

### Keep the application and database in the same region

Ensure all your dependencies are in the same region when deploying your application in Azure. Spreading instances across regions or availability zones creates network latency, which might affect the overall performance of your application.

### Keep your MySQL server secure

Configure your MySQL server to be [secure](single-server/concepts-security.md) and not accessible publicly. Use one of these options to secure your server:

- [Firewall rules](single-server/concepts-firewall-rules.md)
- [Virtual networks](single-server/concepts-data-access-and-security-vnet.md)
- [Azure Private Link](single-server/concepts-data-access-security-private-link.md)

For security, you must always connect to your MySQL server over SSL and configure your MySQL server and your application to use TLS 1.2. See [How to configure SSL/TLS](single-server/concepts-ssl-connection-security.md).

### Use advanced networking with AKS

When accelerated networking is enabled on a VM, there's lower latency, reduced jitter, and decreased CPU utilization on the VM. To learn more, see [Best practices for Azure Kubernetes Service and Azure Database for MySQL](single-server/concepts-aks.md).

### Tune your server parameters

For read-heavy workloads tuning server parameters, `tmp_table_size` and `max_heap_table_size` can help optimize for better performance. To calculate the values required for these variables, look at the total per-connection and base memory values. The sum of per-connection memory parameters, excluding `tmp_table_size`, combined with the base memory accounts for total memory of the server.

To calculate the largest possible size of `tmp_table_size` and `max_heap_table_size`, use the following formula:

`(total memory - (base memory + (sum of per-connection memory * # of connections)) / # of connections`

> [!NOTE]  
> Total memory indicates the total amount of memory that the server has across the provisioned vCores. For example, in a General Purpose two-vCore Azure Database for MySQL server, the total memory will be 5 GB * 2. You can find more details about memory for each tier in the [pricing tier](single-server/concepts-pricing-tiers.md) documentation.
>  
> Base memory indicates the memory variables, like `query_cache_size` and `innodb_buffer_pool_size`, that MySQL will initialize and allocate at the server start. Per-connection memory, like `sort_buffer_size` and `join_buffer_size`, is the memory allocated only when a query needs it.

### Create nonadmin users

[Create nonadmin users](how-to-create-users.md) for each database. Typically, the user names are identified as the database names.

### Reset your password

You can [reset your password](single-server/how-to-create-manage-server-portal.md#update-admin-password) for your MySQL server using the Azure portal.

Resetting your server password for a production database can bring down your application. It's a good practice to reset the password for any production workloads at off-peak hours to minimize the impact on your application's users.

## Performance and resiliency

Here are a few tools and practices to help debug your application's performance issues.

### Enable slow query logs to identify performance issues

You can enable [slow query logs](single-server/concepts-server-logs.md) and [audit logs](single-server/concepts-audit-logs.md) on your server. Analyzing slow query logs can help identify performance bottlenecks for troubleshooting.

Audit logs are also available through Azure Diagnostics logs in Azure Monitor logs, Azure Event Hubs, and storage accounts. See [How to troubleshoot query performance issues](single-server/how-to-troubleshoot-query-performance.md).

### Use connection pooling

Managing database connections can have a significant impact on the performance of the application as a whole. To optimize performance, you must reduce the number of times connections are established and the time for establishing connections in key code paths. Use [connection pooling](single-server/concepts-connectivity.md#access-databases-by-using-connection-pooling-recommended) to connect to Azure Database for MySQL to improve resiliency and performance.

You can use the [ProxySQL](https://proxysql.com/) connection pooler to manage connections efficiently. Using a connection pooler can decrease idle connections and reuse existing connections, which helps avoid problems. See [How to set up ProxySQL](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/connecting-efficiently-to-azure-database-for-mysql-with-proxysql/ba-p/1279842) to learn more.

### Retry logic to handle transient errors

Your application might experience [transient errors](single-server/concepts-connectivity.md#handling-transient-errors) where connections to the database are dropped or lost intermittently. In such situations, the server is up and running after one to two retries in 5 to 10 seconds.

A good practice is to wait for 5 seconds before your first retry. Then follow each retry by increasing the wait gradually, up to 60 seconds. Limit the maximum number of retries, at which point your application considers the operation failed, so you can further investigate. See [How to troubleshoot connection errors](single-server/how-to-troubleshoot-common-connection-issues.md) to learn more.

### Enable read replication to mitigate failovers

For failover scenarios, you can use [Data-in Replication](single-server/how-to-data-in-replication.md). No automated failover between source and replica servers occurs when using read replicas.

You notice a lag between the source and the replica because the replication is asynchronous. Network lag can be influenced by many factors, like the size of the workload running on the source server and the latency between data centers. In most cases, replica lag ranges from a few seconds to a few minutes.

## Database deployment

### Configure an Azure database for MySQL task in your CI/CD deployment pipeline

Occasionally, you need to deploy changes to your database. In such cases, you can use continuous integration (CI) and continuous delivery (CD) through [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/) and use a task for [your MySQL server](/azure/devops/pipelines/tasks/deploy/azure-mysql-deployment) to update the database by running a custom script against it.

### Use an effective process for manual database deployment

During manual database deployment, follow these steps to minimize downtime or reduce the risk of failed deployment:

1. Create a copy of a production database on a new database by using [mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html) or [MySQL Workbench](https://dev.mysql.com/doc/workbench/en/wb-admin-export-import-management.html).
1. Update the new database with your new schema changes or updates needed for your database.
1. Put the production database in a read-only state. It would be best if you didn't have write operations on the production database until deployment is completed.
1. Test your application with the newly updated database from step 1.
1. Deploy your application changes and make sure the application is now using the new database with the latest updates.
1. Keep the old production database to roll back the changes. You can then evaluate to delete the old production database or export it on Azure Storage if needed.

> [!NOTE]  
> If the application is like an e-commerce app and you can't put it in a read-only state, deploy the changes directly on the production database after making a backup. These changes should occur during off-peak hours with low traffic to the app to minimize the impact because some users might experience failed requests.
>  
> Make sure your application code also handles any failed requests.

### Use MySQL native metrics to see if your workload is exceeding in-memory temporary table sizes

With a read-heavy workload, queries against your MySQL server might exceed the in-memory temporary table sizes. A read-heavy workload can cause your server to switch to writing temporary tables to disk, affecting your application's performance. To determine if your server is writing to disk as a result of exceeding temporary table size, look at the following metrics:

```sql
show global status like 'created_tmp_disk_tables';
show global status like 'created_tmp_tables';
```

The `created_tmp_disk_tables` metric indicates how many tables were created on disk. Given your workload, the `created_tmp_table` metric tells you how many temporary tables must be formed in memory. To determine if a specific query uses temporary tables, run the [EXPLAIN](https://dev.mysql.com/doc/refman/8.0/en/explain.html) statement on the query. The detail in the `extra` column indicates `Using temporary` if the query runs using temporary tables.

To calculate the percentage of your workload with queries spilling to disks, use your metric values in the following formula:

`(created_tmp_disk_tables / (created_tmp_disk_tables + created_tmp_tables)) * 100`

Ideally, this percentage should be less than 25%. If the percentage is 25% or greater, we suggest modifying two server parameters, tmp_table_size, and max_heap_table_size.

## Database schema and queries

Here are a few tips to remember when building your database schema and queries.

### Use the correct datatype for your table columns

Using the correct datatype based on the type of data you want to store can optimize storage and reduce errors due to incorrect datatypes.

### Use indexes

To avoid slow queries, you can use indexes. Indexes can help find rows with specific columns quickly. See [How to use indexes in MySQL](https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html).

### Use EXPLAIN for your SELECT queries

Use the `EXPLAIN` statement to get insights on what MySQL is doing to run your query. It can help you detect bottlenecks or issues with your query. See [How to use EXPLAIN to profile query performance](single-server/how-to-troubleshoot-query-performance.md).
