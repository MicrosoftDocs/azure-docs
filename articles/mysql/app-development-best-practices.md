---
title: App development best practices - Azure Database for MySQL
description: Learn about best practices when building an app with Azure Database for MySQL
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.topic: conceptual
ms.date: 08/11/2020
---

# Best practices for building applications with Azure Database for MySQL 

Here are some best practices to help build cloud-ready applications using Azure Database for MySQL that can reduce development time for your application. 

## Application and Database resource configuration

### Application and Database in the same region
Make sure **all your dependencies are in the same region**	when deploying your application in Azure. Spreading instances across regions or availability zones creates network latency, which may impact the overall performance of your application. 

### Keep your MySQL server secure
Your MySQL server should be configured to be [secure](https://docs.microsoft.com/azure/mysql/concepts-security) and not accessible publicly. Use either one of these options to secure your server: 
- [Firewall rules](https://docs.microsoft.com/azure/mysql/concepts-firewall-rules) or
- [Virtual Networks](https://docs.microsoft.com/azure/mysql/concepts-data-access-and-security-vnet) or 
- [Private Link](https://docs.microsoft.com/azure/mysql/concepts-data-access-security-private-link)

For security, you must always connect to your MySQL server over **SSL** and configure your MySQL server and your application to use **TLS1.2**. See [How to configure SSL/TLS](https://docs.microsoft.com/azure/mysql/concepts-ssl-connection-security). 

### Tune your server parameters
For read-heavy workloads tuning these parameters, 'tmp_table_size and max_heap_table_size' can help optimize for better performance. To calculate the values required for tmp_table_size and max_heap_table_size, look at the total per-connection memory values and the base memory. The sum of per-connection memory parameters, excluding tmp_table_size, combined with the base memory accounts for total memory of the server.

To calculate the largest possible size of tmp_table_size and max_heap_table_size, use the following formula:

```(total memory - (base memory + (sum of per-connection memory * # of connections)) / # of connections```

>[!NOTE]
> Total memory indicates the total amount of memory the server has across the vCores provisioned.  For example, in a General Purpose 2 vCore Azure Database for MySQL server, the total memory will be 5GB * 2.  More details about memory for each tier can be found in the [pricing tier](https://docs.microsoft.com/azure/mysql/concepts-pricing-tiers) documentation.
> Base memory indicates the memory variables, like query_cache_size and innodb_buffer_pool_size, that MySQL will initialize and allocate at server start.  Per connection memory, like sort_buffer_size and join_buffer_size, is memory that is allocated only when a query requires it.

### Create a non-admin user 
[Create non-admin users](https://docs.microsoft.com/azure/mysql/howto-create-users) for each of the databases. Typically, the user names are identified as the DB names.

### Resetting your password
You can [reset your password](https://docs.microsoft.com/azure/mysql/howto-create-manage-server-portal#update-admin-password) for your MySQL server using Azure portal. 

Resetting your server password for a production database can bring down your application. It is a good pattern to reset the password for any production workloads at off-peak hours to minimize the impact to your application end users.

## Performance and Resiliency 
Here are a few tools and patterns that you can use to help debug performance issues with your application.

### Enable slow query logs identify performance issues
You can enable [slow query logs](https://docs.microsoft.com/azure/mysql/concepts-server-logs) and [audit logs](https://docs.microsoft.com/azure/mysql/concepts-audit-logs) on your server. Analyzing slow query logs can help identify performance bottlenecks for troubleshooting. 

Audit logs are also available through Azure Diagnostic Logs in Azure Monitor logs, Event Hubs, and Storage Account as well. See [how to troubleshoot query performance issues](https://docs.microsoft.com/azure/mysql/howto-troubleshoot-query-performance).

### Use connection pooling
Managing database connections can have a significant impact on the performance of the application as a whole. For optimizing performance you must reduce the number of times connections are established and time for establishing connections in key code paths.  Use [connection pooling](https://docs.microsoft.com/azure/mysql/concepts-connectivity#access-databases-by-using-connection-pooling-recommended) to connect to Azure Database for MySQL to improve resiliency and performance. 

[ProxySQL](https://proxysql.com/), which is a connection pooler can be efficiently used to manage connections. Using a connection pooler can decrease idle connections and reuse existing connections will help avoid issues. See [How to setup ProxySQL](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/connecting-efficiently-to-azure-database-for-mysql-with-proxysql/ba-p/1279842) to learn more. 

### Retry logic to handle transient errors
Your application could experience [transient errors](https://docs.microsoft.com/azure/mysql/concepts-connectivity#handling-transient-errors) where connections to the database are being dropped or lost intermittently. In such situations, the server is up and running after one to two retry in 5-10 seconds. 

A good pattern to follow with retry is to wait for 5 seconds before your first retry and then follow each retry by increasing the wait gradually upto 60 seconds. Limit the max number of retries at which point your application considers the operation failed so you can then further investigate. See [how to troubleshoot connection errors](https://docs.microsoft.com/azure/mysql/howto-troubleshoot-common-connection-issues) to learn more. 

### Enable read replication to mitigate failovers
You can use [Data-in replication](https://docs.microsoft.com/azure/mysql/howto-data-in-replication) for failover scenarios. When using read replicas, no automated failover between master and replica servers occur. You will notice a lag between the master and the replica since the replication is asynchronous. Network lag can be influenced by a many factors like how heavy the workload running on the master server is and the latency between data centers. In most cases, replica lag ranges between a few seconds to a couple minutes.

## Database Deployment 

### Configure Azure database for MySQL task in your CI/CD deployment pipeline
Occasionally you would need to deploy changes to your database. In such cases, you can create use continuous integration (CI) and continuous delivery (CD) through [Azure pipelines](https://azure.microsoft.com/services/devops/pipelines/) and use a task for [your MySQL server](https://docs.microsoft.com/azure/devops/pipelines/tasks/deploy/azure-mysql-deployment?view=azure-devops) to update the database by running a custom script against your database.

### Manual Database deployment 
During manual database deployment, here is a good pattern to follow to minimize downtime or reduce risk of failed deployment: 

1. Create a copy of production database on a new database using [mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html) or [MySQL workbench](https://dev.mysql.com/doc/workbench/en/wb-admin-export-import-management.html) 
2. Update the new database with your new schema changes or updates needed for your database. 
3. Put the production database on read-only state. You should not have write operations on the production database until deployment is completed. 
4. Test your application with the newly updated database from step 1.
5. Deploy your application changes and make sure the application is now using the new database that has the latest updates. 
6. Keep the old production database so that you can roll back the changes. You can then evaluate to either delete the old production database or export it on Azure storage if needed. 

>[!NOTE]
>  - If the application is like ecommerce app where you might not be able to put it in read-only state, then deploy the changes directly on the production database after making a backup.  Theses change should occur during the off-peak hours with low traffic to the app to minimze the impact as some users may experience a failed requests. 
>  - Make sure your application code also handles any failed requests.

### Use MySQL native metrics to see if your workload is exceeding in-memory temporary table sizes
With a read-heavy workload, queries executing against your MySQL server could exceed the in-memory temporary table sizes. It can cause your server to switch to writing temporary tables to disk which affects the performance for your application. To determine if your server is writing to disk as a result of exceeding temporary table size, look at the following metrics:

```
show global status like 'created_tmp_disk_tables';
show global status like 'created_tmp_tables';
```
The created_tmp_disk_tables metric indicates how many tables were created on disk, while the created_tmp_table metric tells you how many temporary tables have to be formed in memory given your workload. To determine if running a specific query will use temporary tables, run explain on the query. The detail in the 'extra' column indicates 'Using temporary' if the query will run using temporary tables.

To calculate the percentage of your workload with queries spilling to disks, use your metric values in the formula below:

```(created_tmp_disk_tables / (created_tmp_disk_tables + created_tmp_tables)) * 100```

Ideally, this percentage should be less 25%. If you see that the percentage is 25% or greater, we suggest modifying two server parameters, tmp_table_size and max_heap_table_si


## Database Schema and Queries

Here are few tips and tricks to keep in mind when you build your database schema and your queries.

### Always use the right datatype for your  Table columns
Using the right datatypes based on the type of data you want to store can optimize storage and reduce any errors that can occur because of incorrect datatypes.

### Use Indexes
To avoid slow queries, you can use Indexes. Indexes can help find rows with specific columns quickly. See [how to use Indexes in MySQL](https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html).

### EXPLAIN your SELECT queries
Use the [EXPLAIN](https://dev.mysql.com/doc/refman/8.0/en/explain.html) to get insights on what MySQL is doing to execute your query. This can help you  detect bottlenecks or issues with your query. See [How to use EXPLAIN to profile query performance](https://docs.microsoft.com/azure/mysql/howto-troubleshoot-query-performance).


