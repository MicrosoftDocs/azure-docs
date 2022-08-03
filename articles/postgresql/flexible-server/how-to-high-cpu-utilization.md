---
title: High CPU Utilization
description: Troubleshooting guide for high cpu utilization in Azure Database for PostgreSQL - Flexible Server
ms.author: sbalijepalli
author: sarat0681
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 7/28/2022
---

#  Troubleshoot high CPU utilization in Azure Database for PostgreSQL - Flexible Server


This article shows you how to quickly identify the root cause of high CPU utilization, and possible remedial actions to control CPU utilization when using Azure Database for PostgreSQL - Flexible Server. 


-   Quickly identify the root cause of High CPU utilization 
-   Remedial actions to control CPU utilization 

In this article, you will learn: 
- About tools to identify high CPU utilization such as Azure Metrics, Query Store, and pg_stat_statements. 
- How to identify root causes, such as long running queries and total connections. 
- How to resolve high CPU utilization by using Explain Analyze, Connection Pooling, and Vacuuming tables. 



## Tools to Identify high CPU Utilization 

### Azure Metrics 

Azure Metrics is a good starting point to check the CPU utilization for the definite date and period. Metrics give information about the time duration during which the CPU utilization is high. Compare the graphs of Write IOPs, Read IOPs, Read Throughput, and Write Throughput with CPU utilization to find out times when the workload caused high CPU. For proactive monitoring, you can configure alerts on the metrics. For step-by-step guidance, see [Azure Metrics](./howto-alert-on-metrics.md).


### Query Store
Query Store automatically captures the history of queries and runtime statistics, and it retains them for your review. It slices the data by time so that you can see temporal usage patterns. Data for all users, databases and queries is stored in a database named azure_sys in the Azure Database for PostgreSQL instance. For step-by-step guidance, see [Query Store](./concepts-query-store.md).

### pg_stat_statements
The pg_stat_statements extension helps identify queries that consume time on the server.


Execute the following statements to view the top five SQL statements by mean or average execution time: 


##### Postgres version 13 and above
~~~
SELECT userid::regrole, dbid, query, mean_exec_time 
FROM pg_stat_statements 
ORDER BY mean_exec_time 
DESC LIMIT 5;   
~~~
##### Postgres version 9.6, 10, 11, 12
~~~
SELECT userid::regrole, dbid, query 
FROM pg_stat_statements 
ORDER BY mean_time 
DESC LIMIT 5;    
~~~
Execute the following statements to view the top five SQL statements by total time taken: 

##### Postgres version 13 and above
~~~
SELECT userid::regrole, dbid, query 
FROM pg_stat_statements 
ORDER BY total_exec_time 
DESC LIMIT 5;   
~~~
##### Postgres version 9.6, 10, 11, 12
~~~
SELECT userid: :regrole, dbid, query, 
FROM pg_stat_statements 
ORDER BY total_time 
DESC LIMIT 5;    
~~~
## Identify Root Causes 

If CPU consumption levels are high in general, the following could be possible root causes: 


### Long Running Transactions  

Long running transactions can consume CPU resources that can lead to high CPU utilization.

The following query helps identify the connections running for the longest time:  

~~~
SELECT pid, usename, datname, query, now() - xact_start as duration 
FROM pg_stat_activity  
WHERE pid <> pg_backend_pid() and state IN ('idle in transaction', 'active') 
ORDER BY duration DESC;   
~~~

### Total Number of Connections and Number Connections by State 

A large number of connections to the database is also another issue that might lead to increased CPU as well as memory utilization.


The following query gives information about the number of connections by state: 

~~~
SELECT state, count(*)  
FROM  pg_stat_activity   
WHERE pid <> pg_backend_pid()  
GROUP BY 1 ORDER BY 1;   
~~~
  

## Resolve High CPU Utilization: 

### Using Explain Analyze 

Once you know the query that's running for a long time, use **EXPLAIN** to further investigate the query and tune it. 
For more information about the **EXPLAIN** command, review [Explain Plan](https://www.postgresql.org/docs/current/sql-explain.html). 


 
### PGBouncer And Connection Pooling 

In situations where there are lots of idle connections or lot of connections which are consuming the CPU consider use of a connection pooler like PgBouncer.


For more details about PgBouncer, review: 


[Connection Pooler](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717)

[Best Practices](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connection-handling-best-practice-with-postgresql/ba-p/790883)


Azure Database for Flexible Server offers PgBouncer as a built-in connection pooling solution. For more information, see [PgBouncer](./concepts-pgbouncer.md)


### Terminating Long Running Transactions

You could consider killing a long running transaction as an option.

To terminate a session's PID, you will need to detect the PID using the following query: 
~~~
SELECT pid, usename, datname, query, now() - xact_start as duration 
FROM pg_stat_activity  
WHERE pid <> pg_backend_pid() and state IN ('idle in transaction', 'active') 
ORDER BY duration DESC;   
~~~

You can also filter by other properties like usename (username), datname (database name) etc.  

Once you have the session's PID you can terminate using the following query:
~~~
SELECT pg_terminate_backend(pid);
~~~
### Monitoring Vacuum And Table Stats 

Keeping table statistics up to date helps improve query performance. Monitor whether regular autovacuuming is being carried out. 


The following query helps to identify the tables that need vacuuming 
~~~
select schemaname,relname,n_dead_tup,n_live_tup,last_vacuum,last_analyze,last_autovacuum,last_autoanalyze from pg_stat_all_tables where n_live_tup > 0;   
~~~
`last_autovacuum` and `last_autoanalyze` columns give the date and time when the table was last autovacuumed or analyzed. If the tables are not being vacuumed regularly, take steps to tune autovacuum. For more information about autovacuum troubleshooting and tuning, see [Autovacuum Troubleshooting](./how-to-autovacuum-tuning.md).


A more short term solution would be to do a manual vacuum analyze of the tables where slow queries are seen:
~~~
vacuum analyze <table_name>;
~~~

## Next steps
