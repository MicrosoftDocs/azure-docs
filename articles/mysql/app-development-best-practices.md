---
title: App development best practices - Azure Database for MySQL
description: Learn about best practices for building an app by using Azure Database for MySQL.
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.topic: conceptual
ms.date: 08/11/2020
---

# Best practices for building an application with Azure Database for MySQL 

Here are some best practices to help you build a cloud-ready application by using Azure Database for MySQL. These best practices can reduce development time for your app. 

## Configuration of application and database resources

### Keep the application and database in the same region
Make sure all your dependencies are in the same region when deploying your application in Azure. Spreading instances across regions or availability zones creates network latency, which might affect the overall performance of your application. 

### Keep your MySQL server secure
Configure your MySQL server to be [secure](https://docs.microsoft.com/azure/mysql/concepts-security) and not accessible publicly. Use one of these options to secure your server: 
- [Firewall rules](https://docs.microsoft.com/azure/mysql/concepts-firewall-rules)
- [Virtual networks](https://docs.microsoft.com/azure/mysql/concepts-data-access-and-security-vnet) 
- [Azure Private Link](https://docs.microsoft.com/azure/mysql/concepts-data-access-security-private-link)

For security, you must always connect to your MySQL server over SSL and configure your MySQL server and your application to use TLS 1.2. See [How to configure SSL/TLS](https://docs.microsoft.com/azure/mysql/concepts-ssl-connection-security). 

### Tune your server parameters
For read-heavy workloads tuning server parameters, `tmp_table_size` and `max_heap_table_size` can help optimize for better performance. To calculate the values required for these variables, look at the total per-connection memory values and the base memory. The sum of per-connection memory parameters, excluding `tmp_table_size`, combined with the base memory accounts for total memory of the server.

To calculate the largest possible size of `tmp_table_size` and `max_heap_table_size`, use the following formula:

```(total memory - (base memory + (sum of per-connection memory * # of connections)) / # of connections```

>[!NOTE]
> Total memory indicates the total amount of memory that the server has across the provisioned vCores.  For example, in a General Purpose two-vCore Azure Database for MySQL server, the total memory will be 5 GB * 2. You can find more details about memory for each tier in the [pricing tier](https://docs.microsoft.com/azure/mysql/concepts-pricing-tiers) documentation.
>
> Base memory indicates the memory variables, like `query_cache_size` and `innodb_buffer_pool_size`, that MySQL will initialize and allocate at server start. Per-connection memory, like `sort_buffer_size` and `join_buffer_size`, is memory that's allocated only when a query needs it.

### Create non-admin users 
[Create non-admin users](https://docs.microsoft.com/azure/mysql/howto-create-users) for each database. Typically, the user names are identified as the database names.

### Reset your password
You can [reset your password](https://docs.microsoft.com/azure/mysql/howto-create-manage-server-portal#update-admin-password) for your MySQL server by using the Azure portal. 

Resetting your server password for a production database can bring down your application. It's a good practice to reset the password for any production workloads at off-peak hours to minimize the impact on your application's users.

## Performance and resiliency 
Here are a few tools and practices that you can use to help debug performance issues with your application.

### Enable slow query logs to identify performance issues
You can enable [slow query logs](https://docs.microsoft.com/azure/mysql/concepts-server-logs) and [audit logs](https://docs.microsoft.com/azure/mysql/concepts-audit-logs) on your server. Analyzing slow query logs can help identify performance bottlenecks for troubleshooting. 

Audit logs are also available through Azure Diagnostics logs in Azure Monitor logs, Azure Event Hubs, and storage accounts. See [How to troubleshoot query performance issues](https://docs.microsoft.com/azure/mysql/howto-troubleshoot-query-performance).

### Use connection pooling
Managing database connections can have a significant impact on the performance of the application as a whole. To optimize performance, you must reduce the number of times that connections are established and the time for establishing connections in key code paths. Use [connection pooling](https://docs.microsoft.com/azure/mysql/concepts-connectivity#access-databases-by-using-connection-pooling-recommended) to connect to Azure Database for MySQL to improve resiliency and performance. 

You can use the [ProxySQL](https://proxysql.com/) connection pooler to efficiently manage connections. Using a connection pooler can decrease idle connections and reuse existing connections, which will help avoid problems. See [How to set up ProxySQL](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/connecting-efficiently-to-azure-database-for-mysql-with-proxysql/ba-p/1279842) to learn more. 

### Retry logic to handle transient errors
Your application might experience [transient errors](https://docs.microsoft.com/azure/mysql/concepts-connectivity#handling-transient-errors) where connections to the database are dropped or lost intermittently. In such situations, the server is up and running after one to two retries in 5 to 10 seconds. 

A good practice is to wait for 5 seconds before your first retry. Then follow each retry by increasing the wait gradually, up to 60 seconds. Limit the maximum number of retries at which point your application considers the operation failed, so you can then further investigate. See [How to troubleshoot connection errors](https://docs.microsoft.com/azure/mysql/howto-troubleshoot-common-connection-issues) to learn more. 

### Enable read replication to mitigate failovers
You can use [Data-in Replication](https://docs.microsoft.com/azure/mysql/howto-data-in-replication) for failover scenarios. When you're using read replicas, no automated failover between source and replica servers occurs. 

You'll notice a lag between the source and the replica because the replication is asynchronous. Network lag can be influenced by many factors, like the size of the workload running on the source server and the latency between datacenters. In most cases, replica lag ranges from a few seconds to a couple of minutes.

## Database deployment 

### Configure an Azure database for MySQL task in your CI/CD deployment pipeline
Occasionally, you need to deploy changes to your database. In such cases, you can use continuous integration (CI) and continuous delivery (CD) through [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/) and use a task for [your MySQL server](https://docs.microsoft.com/azure/devops/pipelines/tasks/deploy/azure-mysql-deployment?view=azure-devops) to update the database by running a custom script against it.

### Use an effective process for manual database deployment 
During manual database deployment, follow these steps to minimize downtime or reduce the risk of failed deployment: 

1. Create a copy of a production database on a new database by using [mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html) or [MySQL Workbench](https://dev.mysql.com/doc/workbench/en/wb-admin-export-import-management.html). 
2. Update the new database with your new schema changes or updates needed for your database. 
3. Put the production database in a read-only state. You should not have write operations on the production database until deployment is completed. 
4. Test your application with the newly updated database from step 1.
5. Deploy your application changes and make sure the application is now using the new database that has the latest updates. 
6. Keep the old production database so that you can roll back the changes. You can then evaluate to either delete the old production database or export it on Azure Storage if needed. 

>[!NOTE]
>If the application is like an e-commerce app and you can't put it in read-only state, deploy the changes directly on the production database after making a backup. Theses change should occur during off-peak hours with low traffic to the app to minimize the impact, because some users might experience failed requests. 
>
>Make sure your application code also handles any failed requests.

### Use MySQL native metrics to see if your workload is exceeding in-memory temporary table sizes
With a read-heavy workload, queries running against your MySQL server might exceed the in-memory temporary table sizes. A read-heavy workload can cause your server to switch to writing temporary tables to disk, which affects the performance of your application. To determine if your server is writing to disk as a result of exceeding temporary table size, look at the following metrics:

```
show global status like 'created_tmp_disk_tables';
show global status like 'created_tmp_tables';
```
The `created_tmp_disk_tables` metric indicates how many tables were created on disk. The `created_tmp_table` metric tells you how many temporary tables have to be formed in memory, given your workload. To determine if running a specific query will use temporary tables, run the [EXPLAIN](https://dev.mysql.com/doc/refman/8.0/en/explain.html) statement on the query. The detail in the `extra` column indicates `Using temporary` if the query will run using temporary tables.

To calculate the percentage of your workload with queries spilling to disks, use your metric values in the following formula:

```(created_tmp_disk_tables / (created_tmp_disk_tables + created_tmp_tables)) * 100```

Ideally, this percentage should be less 25%. If you see that the percentage is 25% or greater, we suggest modifying two server parameters, tmp_table_size and max_heap_table_size.

## Database schema and queries

Here are few tips to keep in mind when you build your database schema and your queries.

### Use the right datatype for your table columns
Using the right datatype based on the type of data you want to store can optimize storage and reduce errors that can occur because of incorrect datatypes.

### Use indexes
To avoid slow queries, you can use indexes. Indexes can help find rows with specific columns quickly. See [How to use indexes in MySQL](https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html).

### Use EXPLAIN for your SELECT queries
Use the `EXPLAIN` statement to get insights on what MySQL is doing to run your query. It can help you detect bottlenecks or issues with your query. See [How to use EXPLAIN to profile query performance](https://docs.microsoft.com/azure/mysql/howto-troubleshoot-query-performance).


