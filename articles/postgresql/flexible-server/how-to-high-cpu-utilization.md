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

# High CPU Utilization

The purpose of the document is to:

-   Quickly identify the root cause of High CPU utilization 
-   Remedial actions to control CPU utilization 

The document covers –  
-   Tools to identify high CPU utilization
	- Azure Metrics  
	- Query Store  
	- pg_stat_statements

- Identify root causes    
	- Long running queries 
	- Total Connections 

- Resolve high CPU Utilization
	- Using Explain Analyze 
	- Connection Pooling 
	- Vacuuming the tables 


## Tools to Identify high CPU Utilization 

### Azure Metrics 

Azure Metrics is a good starting point to check the CPU utilization for the definite date and period. Metrics give information about the time duration during which the CPU utilization is high. Compare the graphs of Write IOPs, Read IOPs, Read Throughput, and Write Throughput with the CPU utilization to find out the times at which the workload caused high CPU. For proactive monitoring, you can configure alerts on the metrics. For step-by-step guidance, see [Azure Metrics](./howto-alert-on-metrics.md).

### Query Store
Query Store automatically captures the history of queries and runtime statistics, and it retains them for your review. It slices the data by time so that you can see temporal usage patterns. Data for all users, databases and queries is stored in a database named azure_sys in the Azure Database for PostgreSQL instance. For step-by-step guidance, see [Query Store](./concepts-query-store.md).

### pg_stat_statements
pg_stat_statements extension helps in identifying the queries that consume time on the server.

Execute the following statements to view the top five SQL statements by mean or average time taken: 

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

If CPU consumption levels are high in general, we could do the following – 

### Long Running Transactions  

Long running transactions can consume CPU resources that can lead to high CPU utilization.

The following query helps to find out the connections running for the longest time:  
~~~
SELECT pid, usename, datname, query, now() - xact_start as duration 
FROM pg_stat_activity  
WHERE pid <> pg_backend_pid() and state IN ('idle in transaction', 'active') 
ORDER BY duration DESC;   
~~~

### Total Number of Connections and Number Connections by State 

A large number of connections to database is also another issue that might lead to increased CPU as well as memory utilization.

Following query will give information about the number of connections by state – 
~~~
SELECT state, count(*)  
FROM  pg_stat_activity   
WHERE pid <> pg_backend_pid()  
GROUP BY 1 ORDER BY 1;   
~~~
  

## Resolve High CPU Utilization: 

### Using Explain Analyze 

Once you know the query, which is running for long time one can use “EXPLAIN” to further investigate the query and tune it. For more information on EXPLAIN command see [Explain Plan](https://www.postgresql.org/docs/current/sql-explain.html) 

 
### PGBouncer And Connection Pooling 

In situations where there are lots of idle connections or lot of connections which are consuming the CPU consider use of a connection pooler like pgBouncer.
For more details of pg bouncer

[Connection Pooler](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717)

[Best Practices](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connection-handling-best-practice-with-postgresql/ba-p/790883)


Azure Database for Flexible Server offers PgBouncer as a built-in connection pooling solution. For more information, see [Pg Bouncer](./concepts-pgbouncer.md)

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

Keeping the table statistics up to date helps in improving the performance of queries. Monitor whether regular auto vacuuming is being carried out. 

The following query helps to identify the tables that need vacuuming 
~~~
select schemaname,relname,n_dead_tup,n_live_tup,last_vacuum,last_analyze,last_autovacuum,last_autoanalyze from pg_stat_all_tables where n_live_tup > 0;   
~~~
last_autovacuum and last_autoanalyze columns will give date time when the table was last autovacuumed or analyzed. If the tables are not being vacuumed regularly steps should be taken to tune autovacuum. For more details about autovacuum troubleshooting and tuning, see [Autovacuum Troubleshooting](./how-to-autovacuum-tuning.md).

A more short term solution would be to do a manual vacuum analyze of the tables where slow queries are seen:
~~~
vacuum analyze <table_name>;
~~~
