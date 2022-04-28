---
title: High CPU Utilization
description: Troubleshooting guide for high cpu utilization in Azure Database for PostgreSQL - Flexible Server
ms.author: sbalijepalli
author: sarat0681
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 4/28/2022
---

# High CPU Utilization

The purpose of the document is to :

-   Quickly identify the root cause of High CPU utilization 
-   Remedial actions to control CPU utilization 

Areas which are highlighted in this document are –  
-   Tools to identify high CPU utilization  
	- Azure Metrics  
	- Query Store  
	- pg_stat_statements

- Identify root causes    
	- Long running queries 
	- Total Connections 

- Resolve high CPU  
	- Using Explain Analyze 
	- Connection Pooling 
	- Vacuuming the tables 


### Tools to Identify high CPU Utilization 

#### Azure Metrics 

Azure Metrics is a good starting point to check the CPU utilization for the definite date and period. Metrics gives information about the time duration during which the CPU utilization is high. Compare the graphs of Write IOPs, Read IOPs, Read Throughput, and Write Throughput with the CPU utilization to find out the times at which the workload caused high CPU. For proactive monitoring, you can configure alerts on the metrics. For step-by-step guidance, see [Azure Metrics](howto-alert-on-metrics.md)

#### Query Store
Query Store automatically captures the history of queries and runtime statistics, and it retains them for your review. It slices the data by time so that you can see temporal usage patterns. Data for all users, databases and queries is stored in a database named azure_sys in the Azure Database for PostgreSQL instance.For step-by-step guidance, see [Query Store](concepts-query-store.md)

#### pg_stat_statements
pg_stat_statements extension helps in identifying the queries which, consume time on the server.

SQL statements that consume the most time –   

#### Postgres version 13 and above
~~~
SELECT (total_exec_time / 1000 / 3600) as total_hours, 
(total_exec_time / 1000) as total_seconds, 
(total_exec_time / calls) as avg_millis,  
calls num_calls, 
query  
FROM pg_stat_statements  
ORDER BY 1 DESC LIMIT 10;   	
~~~
#### Postgres version 9.6, 10, 11, 12
~~~
SELECT (total_time / 1000 / 3600) as total_hours, 
(total_time / 1000) as total_seconds, 
(total_time / calls) as avg_millis,  
calls num_calls, 
query  
FROM pg_stat_statements  
ORDER BY 1 DESC LIMIT 10;   
~~~
 
Run the following command to view the top five SQL statements that consume the most time in one call: 

#### Postgres version 13 and above
~~~
SELECT userid::regrole, dbid, query, mean_exec_time 
FROM pg_stat_statements 
ORDER BY mean_exec_time 
DESC LIMIT 5;   
~~~
#### Postgres version 9.6, 10, 11, 12
~~~
SELECT userid: :regrole, dbid, query 
FROM pg_stat_statements 
ORDER BY mean_time 
DESC LIMIT 5;    
~~~
Run the following command to view the top five SQL statements that consume the most time in total: 

#### Postgres version 13 and above
~~~
SELECT userid::regrole, dbid, query 
FROM pg_stat_statements 
ORDER BY total_exec_time 
DESC LIMIT 5;   
~~~
#### Postgres version 9.6, 10, 11, 12
~~~
SELECT userid: :regrole, dbid, query, 
FROM pg_stat_statements 
ORDER BY total_time 
DESC LIMIT 5;    
~~~
### Identify Root Causes 

If CPU consumption levels are high in general, we could do the following - 

#### Long Running Transactions  

Long running transactions can consume cpu resources that can lead to high cpu utilization.

Following query helps to find out the connections running for the longest time:  
~~~
SELECT pid, usename, datname, query, now() - xact_start as duration 
FROM pg_stat_activity  
WHERE pid <> pg_backend_pid() and state IN ('idle in transaction', 'active') 
ORDER BY duration DESC;   
~~~

#### Total Number of Connections and Number Connections by State 

This query will give information about the number of connections by state – 
~~~
SELECT state, count(*)  
FROM  pg_stat_activity   
WHERE pid <> pg_backend_pid()  
GROUP BY 1 ORDER BY 1;   
~~~
Idle connections represent connections that are not doing anything, those usually, are waiting for additional requests from the client. While this situation of having idle connections does not sound harmful, having many idle connections will consume CPU and memory.  
 
A large of connections to database is also another issue which might lead to increased CPU utilization

### Resolve High CPU Utilization: 

#### Using EXPLAIN ANALZE to debug slow query 

Once you know the query, which is running for long time one can use “EXPLAIN” and “EXPLAIN ANALYZE” to further investigate the query and tune it. 

For more information on EXPLAIN command [Explain Plan](https://www.postgresql.org/docs/current/sql-explain.html) 

 
#### PG Bouncer or Connection Pooling 

In situations where there are lot of idle connections or lot of connections which are consuming the CPU consider use of a connection pooler like pg bouncer.
For more details of pg bouncer

[Connection Pooler](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717)

[Best Practices](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connection-handling-best-practice-with-postgresql/ba-p/790883)

[Pg Bouncer Setup](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/steps-to-install-and-setup-pgbouncer-connection-pooling-proxy/ba-p/730555)


Azure Database for Flexible Server offers PgBouncer as a built-in connection pooling solution. For more details, see [Pg Bouncer](concepts-pgbouncer.md)

#### Terminating a long running session 

You could consider killing a long running transaction as an option.

To terminate a session, you will need to detect the PID Using a query like the following: 
~~~
SELECT * FROM pg_stat_activity  
WHERE usename != 'azure_superuser'  
AND application_name LIKE '<YOUR APPLICATION NAME>'; 
~~~

You can also filter by other properties like usename (username), datname (database name), client_addr (client’s address), state, etc.  
Once you have the sessions that you want to terminate, replace the “SELECT *” with “pg_terminate_backend(pid)” and those sessions will be terminated 

For example, to the updated query for one above you can use: 
~~~
SELECT pg_terminate_backend(pid) FROM pg_stat_activity  
WHERE usename != 'azure_superuser'  
AND application_name LIKE '<YOUR APPLICATION NAME>' ; 
~~~
#### Monitoring Vacuum and Table Stats 

Keeping the table statistics up to date helps in improving the performance of queries. Monitor whether regular auto vacuuming is being carried out. 

The following query helps to identify the tables that need vacuuming 
~~~
SELECT schemaname, relname, n_dead_tup, n_live_tup, autovacuum_count , last_vacuum, last_autovacuum ,last_autoanalyze  
FROM pg_stat_all_tables    
WHERE n_live_tup > 0 ;   
~~~
last_autovacuum and last_autoanalyze columns will give date time when the table was last autovacuumed or analyzed.If the tables are not being vacuumed on a regular basis steps should be taken to tune autovacuum. The details are found autovacuum tuning troubleshooting guide.

A more short term solution would be to do a manual vacuum analyze of the tables where slow queries are seen:
~~~
vacuum analyze <table_name>
~~~
