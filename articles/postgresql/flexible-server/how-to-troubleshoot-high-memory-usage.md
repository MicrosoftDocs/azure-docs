## Introduction 
The purpose of the document is to discuss common scenarios and root causes that might lead to high memory utilization. The documents highlight the following -

-   Tools to Identify high memory utilization. 
-   Reasons & Remedial actions  

### Tools to Identify high Memory Utilization 

##### Azure Metrics
We can monitor various metrics including percentage of memory in use for the definite date and time frame with help of Azure Metrics. Metrics gives information about the time duration during which the memory utilization is high, and each metric is emitted at a one-minute frequency, we can get 93 days of historic data. For proactive monitoring, you can configure alerts on the metrics. For step-by-step guidance, see [Azure Metrics](https://docs.microsoft.com/bs-latn-ba/azure/postgresql/flexible-server/howto-alert-on-metrics)


##### Query Store

Query Store automatically captures history of queries and runtime statistics, and it retains them for your review. It can correlate wait event information with query run time statistics. This gives flexibility to identify queries who have high memory waits during the period of interest. 

For more information on setting up and usage of query store, please visit [query store](https://docs.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-query-store)

### Reasons And Remedial Actions

#### Server Parameters

There are a few server parameters that can be investigated and make sure the values are set appropriately  

##### Work_Mem  
The `work_mem` parameter basically provides the amount of memory to be used by internal sort operations and hash tables before writing to temporary disk files. It is not per query basis rather; it’s set based on the number of sort/hash operations. 

The guidance is that if the workload has lot of short running queries with simple joins and minimal sort operations it is advised to keep lower `work_mem`. In scenarios where we have few active queries but have complex joins, sorts then it is advised to keep a higher work_mem. 

Its tough to get a right value of `work_mem`. But in cases where we see high memory utilization or worse out of memory issues decrease `work_mem` because that is the amount of memory that can be consumed by each process on the database

A safer setting for `work_mem` is 

`work_mem` = Total RAM / Max_Connections / 16 

The default value of `work_mem` = 4MB. You can set `work_mem` value on multiple levels including at the server level via parameters page in Azure Portal. A good strategy is to monitor the memory during the peak times. If disk sorts are happening during this time and we find plenty of memory not used, then increase work_mem gradually and continue the same of process to adjust work_mem until a good balance of available and used memory is reached. On the other hand, If the memory use looks high, reduce the work_mem. 

##### Maintenance_Work_Mem 

`maintenance_work_mem` is for maintenance tasks like Vacuuming, adding indexes or foreign keys. We can set a large value which can help in the tasks like vacuum, create index, alter table add foreign key. The usage of memory in this scenario is per session. 

Ex: We have session which is creating an index and at the same time we have 2 auto vacuum workers running. If the `maintenance_work_mem` is set to 1 GB, then all the sessions combine use 3 GB of memory 

A very high `maintenance_work_mem` value along with multiple running sessions for vacuuming/index creation/adding foreign keys can cause high memory utilization also. The maximum allowed value for ``maintenance_work_mem`` server parameter in Azure Database for flexible server is 2 GB.


##### Shared Buffers 

The `shared_buffers` determine how much memory is dedicated to the server for caching data. The objective of shared buffers is to reduce DISK IO. 

A reasonable setting for shared buffers is 25% of RAM. It is recommended not to set to a value more than 40% of RAM. 
                                                                                                         
##### Max Connections 

Every new or an idle connection on a postgres database consumes 10MB of memory. One of the methods to monitor the connections is using the below statement: 

    select count (*) from pg_stat_activity;

When the number connections to database are high then the consumption of memory also increases leading to a higher memory utilization. 

In situations where there are lot of idle connections or lot of connections which are consuming the CPU consider use of a connection pooler like pg bouncer.

For more details of pg bouncer

[Connection Pooler](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717)

[Best Practices](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connection-handling-best-practice-with-postgresql/ba-p/790883)

[Pg Bouncer Setup](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/steps-to-install-and-setup-pgbouncer-connection-pooling-proxy/ba-p/730555)


Azure Database for Flexible Server offers PgBouncer as a built-in connection pooling solution. For more details, see [Pg Bouncer](https://docs.microsoft.com/azure/postgresql/flexible-server/concepts-pgbouncer )

#### EXPLAIN ANALZE 

Once you know the query which is running and consuming memory that was identified from query store one can use “EXPLAIN” and “EXPLAIN ANALYZE” to further investigate the query and tune it. 

For more information on EXPLAIN command [Explain Plan](https://www.postgresql.org/docs/current/sql-explain.html) 
