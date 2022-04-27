## Introduction 

On several occasions it is observed that during the performance management of PostgreSQL database, DBA’s come across a situation where CPU utilization is extremely high. In such circumstances an immediate standard process to resolve the issue will be helpful to reduce any downtime/performance management challenges. Keeping this in mind, this document is prepared. This document will help you in the following areas – 

-   Quickly identify the root cause of High CPU utilization 
-   Remedial action to control CPU utilization 
-   Proactive steps to identify High CPU utilization 

Areas which are highlighted in this document are –  
-   Tools to identify high CPU utilization  
	- Azure Metrics  
	- Query Store  
	- PG_STAT_STATEMENTS 

- Identify root causes    
	- Long running queries 
	- Total Connections 

- Resolve high CPU  
	- Using EXPLAIN ANALYZE 
	- Connection Pooling 
	- Vacuuming the tables 

The following is the list of several reasons which contribute to high CPU utilization. Along with the reasons, listed tools, and techniques to resolve the high CPU utilization issue. 

### Tools to Identify high CPU Utilization 

#### Azure Metrics 

Azure Metrics is a good starting point to check the CPU utilization for the definite date and period. Metrics gives information about the time duration during which the CPU utilization is high. Compare the graphs of Write IOPs, Read IOPs, Read Throughput, and Write Throughput with the CPU utilization to find out the times at which the workload caused high CPU. For proactive monitoring, you can configure alerts on the metrics. For step-by-step guidance, see [Azure Metrics](https://docs.microsoft.com/en-us/azure/postgresql/howto-alert-on-metric)

#### Query Store
Query Store automatically captures the history of queries and runtime statistics, and it retains them for your review. It slices the data by time so that you can see temporal usage patterns. Data for all users, databases and queries is stored in a database named azure_sys in the Azure Database for PostgreSQL instance.For step-by-step guidance, see [Query Store](https://docs.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-query-store)

#### pg_stat_statements
pg_stat_statements extension helps in identifying the queries which consume time on the server. pg_stat_statements extension is not available globally but can be enabled for a specific database with following script:

SELECT current_database(). 
CREATE EXTENSION pg_stat_statements; 

 Once pg_stat_statements are enabled, you can use following queries to identify query and execution time. 

SQL statements that consume the most time –   

#### Postgres version 13 and above

	SELECT (total_exec_time / 1000 / 3600) as total_hours, 
		(total_exec_time / 1000) as total_seconds, 
		(total_exec_time / calls) as avg_millis,  
		calls num_calls, 
		query  
	FROM pg_stat_statements  
	ORDER BY 1 DESC LIMIT 10. 

#### Postgres version 9.6, 10, 11, 12

 	SELECT (total_time / 1000 / 3600) as total_hours, 
  	   (total_time / 1000) as total_seconds, 
        (total_time / calls) as avg_millis,  
        calls num_calls, 
        query  
    FROM pg_stat_statements  
    ORDER BY 1 DESC LIMIT 10. 

 
Run the following command to view the top five SQL statements that consume the most time in one call: 

#### Postgres version 13 and above

	SELECT userid::regrole, dbid, query, mean_exec_time 
	FROM pg_stat_statements 
	ORDER BY mean_exec_time 
	DESC LIMIT 5. 

#### Postgres version 9.6, 10, 11, 12

	SELECT userid: :regrole, dbid, query 
	FROM pg_stat_statements 
	ORDER BY mean_time 
	DESC LIMIT 5. 

Run the following command to view the top five SQL statements that consume the most time in total: 

#### Postgres version 13 and above

	SELECT userid::regrole, dbid, query 
	FROM pg_stat_statements 
	ORDER BY total_exec_time 
	DESC LIMIT 5. 

#### Postgres version 9.6, 10, 11, 12

	SELECT userid: :regrole, dbid, query, 
	FROM pg_stat_statements 
	ORDER BY total_time 
	DESC LIMIT 5. 

### Identify Root Causes 

In Azure Database for PostgreSQL and in PostgreSQL in general, there are no statistics around memory, CPU, or IO consumption by a query, so the specific bottleneck caused by a query is hard to detect. If CPU consumption levels are high in general, we could do the following - 

#### Long Running Transactions  

 Following query helps to find out the connections running for the longest time:  

	SELECT pid, usename, datname, query, now() - xact_start as duration 
	FROM pg_stat_activity  
	WHERE pid <> pg_backend_pid() and state IN ('idle in transaction', 'active') 
	ORDER BY duration DESC


Apart from this, there are quick executed queries which causes issue if they are executed for number of times for example, you detect a query that finish running in 1 ms but being called thousands of times then it will consume a lot of resources. Query Store and pg_stat_statements should help in identifying such type of queries. 

#### Total Number of Connections and Number Connections by State  
This query will give information about the number of connections by state – 

	SELECT state, count(*)  
	FROM  pg_stat_activity   
	WHERE pid <> pg_backend_pid()  
	GROUP BY 1 ORDER BY 1 

 Idle connections represent connections that are not “doing” anything, those usually, are waiting for additional requests from the client. While this situation of having idle connections does not sound harmful, having many idle connections will consume CPU and memory.  
 
 A large of connections to database is also another issue which might lead to increased CPU utilization

### Resolve High CPU: 

#### Using EXPLAIN ANALZE to debug slow query 

Once you know the query which is running for long time one can use “EXPLAIN” and “EXPLAIN ANALYZE” to further investigate the query and tune it. 

For more information on EXPLAIN command [Explain Plan](https://www.postgresql.org/docs/current/sql-explain.html) 

 
#### PG Bouncer or Connection Pooling 

In situations where there are lot of idle connections or lot of connections which are consuming the CPU consider use of a connection pooler like pg bouncer.
For more details of pg bouncer

[Connection Pooler](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717)

[Best Practices](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connection-handling-best-practice-with-postgresql/ba-p/790883)

[Pg Bouncer Setup](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/steps-to-install-and-setup-pgbouncer-connection-pooling-proxy/ba-p/730555)


Azure Database for Flexible Server offers PgBouncer as a built-in connection pooling solution. For more details, see [Pg Bouncer](https://docs.microsoft.com/azure/postgresql/flexible-server/concepts-pgbouncer )

#### Terminating a long running session 

In many scenarios, you would consider terminating (aka “kill”) a session, it can be because of Locks and blocking operations, stale sessions of an application you are trying to stop, or other reasons, such as: long running query  

To terminate a session, you will need to detect the PID.  

Using a query like the following: 

	SELECT * FROM pg_stat_activity  
	WHERE usename != 'azure_superuser'  
	AND application_name LIKE '<YOUR APPLICATION NAME>'; 


You can also filter by other properties like usename (username), datname (database name), client_addr (client’s address), state, etc.  
Once you have the sessions that you want to terminate, replace the “SELECT *” with “pg_terminate_backend(pid)” and those sessions will be terminated 

For example, to the updated query for one above you can use: 

	SELECT pg_terminate_backend(pid) FROM pg_stat_activity  
	WHERE usename != 'azure_superuser'  
	AND application_name LIKE '<YOUR APPLICATION NAME>' ; 

#### Monitoring Vacuum and Table Stats 

Keeping the table statistics up to date helps in improving the performance of queries. Monitor whether regular auto vacuuming is being carried out. 

The following query helps to identify the tables that need vacuuming 

	SELECT schemaname, relname, n_dead_tup, n_live_tup, n_dead_tup,
	round(n_dead_tup::float/n_live_tup::float*100) dead_pct ,autovacuum_count , last_vacuum, last_autovacuum ,last_autoanalyze  
	FROM pg_stat_all_tables    
	WHERE n_live_tup > 0    
	ORDER BY 10 DESC.   

If the tables are not being vacuumed on a regular basis steps should be taken to tune autovacuum. The details are found autovacuum tuning troubleshooting guide.
A more short term solution would be to do manual vacuum analyze of the tables where slow queries are seen:

	vacuum Analyze <table_name>
