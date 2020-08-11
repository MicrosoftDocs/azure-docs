
# Application development Best practices

Here are some best practices to help build cloud-ready applications using Azure Database for MySQL. Using these best pratices can save you a lot of development time and debugging issues as your application grows.

## Application and Database resource configuration

### Application and Database in the same region
Make sure all your dependencies are in the same region	When deploying your application in Azure, spreading instances across regions or availability zones creates network latency, which may impact the overall performance of your application. Make sure all your application dependencies including your database server are in the same region.

### Keep you MySQL server secure
Your MySQL server should be configured to be secure and not accessible publicly. Use Firewalls or Virtual Networks or Private Link features to keep it secure. Always connect to your MySQL server over SSL and configure your MySQL server and your application to use TLS1.2.

### Resetting your password
You can reset your password for using Azure Portal. In a case where you have to reset password for a production database, it can cause downtime for your application until you have updated your application to use the new password. It is a good pattern to reset the password for any production workloads at off-peak hours to minimize the impact of this change.

### Never store your database connection string in you application code 
Use the tools available with your application front end whether it is App Services, AKS or Virtual machines by using environment variables or Key Vault to store your credentials to read the connection stirng from. This would help when you reset the password to just updatethe evnvironment variables or Key vault secret for the application to read the new password without having to do a new deployment. This can reduce the time taken to 

## Performance and Resiliency 
When building any application , you would need to debug performance issues with your application. Here are  few best practices to use with Azure Database for MySQL. 

### Enable slow query logs identify performance issues
You can enable slow query and audit logging on your server. These logs are also available through Azure Diagnostic Logs in Azure Monitor logs, Event Hubs, and Storage Account. To learn more on how to configure slow query logs and how to configure audit logs.

### Use connection pooling
Managing database connections can have a significant impact on the performance of the application as a whole. To optimize the performance of your application, the goal should be to reduce the number of times connections are established and time for establishing connections in key code paths. We strongly recommend using database connection pooling or persistent connections to connect to Azure Database for MySQL.you can also use a connection pooler like ProxySQL to efficiently manage connections. Using a connection pooler can decrease idle connections and reuse existing connections will help avoid this. To learn about setting up ProxySQL, visit our blog post.

## Retry logic to handle transient errors
There could be transient error ofr situations like when you see intermittent connection being dropped or lost. Typically in transient errors, the server is up and running after one to two retry in 5-10 seconds. A good pattern to follow with rety is to wait for 5 seconds before your first retry and then follow each retry by increasing the wait gradually upto 60 seconds. You must set a max number of retries at which point your application considers the operation failed so you can then further investigate.
## Enable read replication to mitigate failovers
You can use Data-in replication for failover scenarios. When using read replicas , there is no automated failover between master and replica servers. Since replication is asynchronous, there is lag between the master and the replica. The amount of lag can be influenced by a number of factors like how heavy the workload running on the master server is and the latency between data centers. In most cases, replica lag ranges between a few seconds to a couple minutes.

## Database Deployment 

### Configure Azure database for MySQL task in your CI/CD deployment pipeline

Database changes are not that often but sometimes needed based on your application. You can create a continuous integration (CI) and continuous delivery (CD) pipeline to Azure and use a task for [your MySQL server](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/deploy/azure-mysql-deployment?view=azure-devops) to update the database by running a customer sccript against your database.


### Manual Database deployment 
If for some reason you are not using Azure pipelines for CI/CD and need to make a database deployment. Here is a good pattern to follow for a manual update to the database

- Create a copy of production database on a new database using mysqldump or MySQL workbench 
- Update the new database with your new schema changes or updates needed for your database. 
- Put the production database on read only state
-  No writes operations should be performed on the production database until deployment is completed 
- Update the production database Clone with the changes needed 
- Test the copied DB with Dev/test environment 
- Update your application deployment with the new database information to point to the new database that has all the changes needed 

>{!NOTE]
>  - If the app is  like ecommerce app where you might not be able to put it in read only state , then deploy the changes directly on the production database after making a backup.  Theses change should occur during the off-peak hours with low traffic to the app to minimze the impact as some users may experience a failed requests. 
>  - Make sure your application code also handles any failed requests 

## Database Schema and Queries

Here are few best practices to keep in mind on how you build your database schema and  build your queries for your application.

### Always use the right datatype for your  Table columns
Using the right datatypes based on the type of data you want to store can optimize storage and reduce any errors that can occur due to incorrect datatypes.

### Use Indexes
To avoid slow queries , you can use Indexes. Indexes can help find rows with specific columns quickly. See [how to use Indexes in MySQL](https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html).

### EXPLAIN your SELECT queries
Use the [EXPLAIN](https://dev.mysql.com/doc/refman/8.0/en/explain.html) to get insights on what MySQL is doing to execute your query. This can help you  detect bottlenecks or issues with your query.

### Calculate the possible tmp_table_size
Server sometimes need to be tuned for your application workload. For read-heavy workloads tuning these parameters  'tmp_table_size and max_heap_table_size' can help optimize for better performance. To calculate the values required for tmp_table_size and max_heap_table_size, look at the total per-connection memory values and the base memory. The sum of per-connection memory parameters, excluding tmp_table_size, combined with the base memory accounts for total memory of the server.

To calculate the largest possible size of tmp_table_size and max_heap_table_size, use the following formula:

```(total memory - (base memory + (sum of per-connection memory * # of connections)) / # of connections```

> [!NOTE]
> Total memory indicates the total amount of memory the server has across the vCores provisioned.  For example, in a General Purpose 2 vCore Azure Database for MySQL server, the total memory will be 5GB * 2.  More details about memory for each tier can be found in the [pricing tier](https://docs.microsoft.com/en-us/azure/mysql/concepts-pricing-tiers) documentation.
> Base memory indicates the memory variables, like query_cache_size and innodb_buffer_pool_size, that MySQL will initialize and allocate at server start.  Per connection memory, like sort_buffer_size and join_buffer_size, is memory that is allocated only when a query requires it.

### Use MySQL native metrics to see if your workload is exceeding in-memory temporary table sizes
With a read-heavy workload, queries executing against your MySQL server could exceed the in-memory temporary table sizes. This will cause your server to switch to writing temporary tables to disk, thus affecting the performance for your application. To determine if your server is writing to disk as a result of exceeding temporary table size, look at the following metrics:

```
show global status like 'created_tmp_disk_tables';
show global status like 'created_tmp_tables';
```

The created_tmp_disk_tables metric indicates how many tables were created on disk, while the created_tmp_table metric tells you how many temporary tables have to be formed in memory given your workload. To determine if running a specific query will use temporary tables, run explain on the query. The detail in the 'extra' column indicates 'Using temporary' if the query will run using temporary tables.

To calculate the percentage of your workload with queries spilling to disks, use your metric values in the formula below:

```(created_tmp_disk_tables / (created_tmp_disk_tables + created_tmp_tables)) * 100```

Ideally, this percentage should be less 25%. If you see that the percentage is 25% or greater, we suggest modifying two server parameters, tmp_table_size and max_heap_table_si


