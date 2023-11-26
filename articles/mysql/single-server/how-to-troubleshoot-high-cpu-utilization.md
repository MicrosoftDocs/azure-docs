---
title: Troubleshoot high CPU utilization in Azure Database for MySQL 
description: Learn how to troubleshoot high CPU utilization in Azure Database for MySQL.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.topic: troubleshooting
ms.date: 10/20/2023
---

# Troubleshoot high CPU utilization in Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Azure Database for MySQL provides a range of metrics that you can use to identify resource bottlenecks and performance issues on the server. To determine whether your server is experiencing high CPU utilization, monitor metrics such as “Host CPU percent”, “Total Connections”, “Host Memory Percent”, and “IO Percent”. At times, viewing a combination of these metrics will provide insights into what might be causing the increased CPU utilization on your Azure Database for MySQL server.

For example, consider a sudden surge in connections that initiates surge of database queries that cause CPU utilization to shoot up.

Besides capturing metrics, it’s important to also trace the workload to understand if one or more queries are causing the spike in CPU utilization.

## High CPU causes

Most CPU spikes raises for two reasons, **connections spikes** and **bad written SQL queries** or **both**:

* **Connections Spike.**

When connections increases, that will increase number of threads which will cause CPU increases to handle these connections with their queries and resources, to troubleshoot connections spike, check [Total Connections](https://learn.microsoft.com/azure/mysql/flexible-server/concepts-monitoring#list-of-metrics) metrics and next section for details about these connections.   
You can use performance_schema to get hosts and users that are currerntly connected to server.

```
   select HOST,CURRENT_CONNECTIONS From performance_schema.hosts
   where CURRENT_CONNECTIONS > 0
   and host not in ('NULL','localhost');
```
```
   select USER,CURRENT_CONNECTIONS from performance_schema.users
   where CURRENT_CONNECTIONS >0
   and USER not in ('NULL','azure_superuser');
```
  
* **Bad written SQL queries.**

If queries have an expensive cost and scans a lot of rows with no index, or doing temporary sort along with other bad plans, will lead to CPU spikes, some queries when executed in single session, will be fast, with 100 session, will cause CPU spikes, always explain your queries that you capture from [show processlist](https://dev.mysql.com/doc/refman/5.7/en/show-processlist.html) and make sure their execution plans is effecient, by making sure, they scans low number of rows and uses indexes, more info about execution plan [here](https://dev.mysql.com/doc/refman/5.7/en/explain-output.html)

## Capturing details of the current workload

The SHOW (FULL) PROCESSLIST command displays a list of all user sessions currently connected to the Azure Database for MySQL server. It also provides details about the current state and activity of each session.

This command only produces a snapshot of the current session status and doesn't provide information about historical session activity.

Let’s take a look at sample output from running this command.

```
mysql> SHOW FULL PROCESSLIST;
+-------+------------------+--------------------+---------------+-------------+--------+-----------------------------+------------------------------------------+
| Id    | User             | Host               | db            | Command     | Time   | State                       | Info                                     |
+-------+------------------+--------------------+---------------+-------------+--------+-----------------------------+------------------------------------------+
|     1 | event_scheduler  | localhost          | NULL          | Daemon      |     13 | Waiting for next activation | NULL                                     |
|     6 | azure_superuser  | 127.0.0.1:33571    | NULL          | Sleep       |    115 |                             | NULL                                     
|
| 24835 | adminuser        | 10.1.1.4:39296     | classicmodels | Query       |      7 | Sending data                | select * from classicmodels.orderdetails;|
| 24837 | adminuser        | 10.1.1.4:38208     | NULL          | Query       |      0 | starting                    | SHOW FULL PROCESSLIST                    |
+-------+------------------+--------------------+---------------+-------------+--------+-----------------------------+------------------------------------------+
5 rows in set (0.00 sec)
```

Notice that there are two sessions owned by customer owned user “adminuser”, both from the same IP address:

* Session 24835 has been executing a SELECT statement for the last seven seconds.
* Session 24837 is executing “show full processlist” statement.

When necessary, it might be required to terminate a query, such as a reporting or HTAP query that has caused your production workload CPU usage to spike. However, always consider the potential consequences of terminating a query before taking the action in an attempt to reduce CPU utilization. Other times if there are any long running queries identified that are leading to CPU spikes, tune these queries so the resources are optimally utilized.

## Detailed current workload analysis

You need to use at least two sources of information to obtain accurate information about the status of a session, transaction, and query:

* The server’s process list from the INFORMATION_SCHEMA.PROCESSLIST table, which you can also access by running the SHOW [FULL] PROCESSLIST command.
* InnoDB’s transaction metadata from the INFORMATION_SCHEMA.INNODB_TRX table.

With information from only one of these sources, it’s impossible to describe the connection and transaction state. For example, the process list doesn’t inform you whether there’s an open transaction associated with any of the sessions. On the other hand, the transaction metadata doesn’t show session state and time spent in that state.

The following example query that combines process list information with some of the important pieces of InnoDB transaction metadata:

```
mysql> select    p.id as session_id, p.user, p.host, p.db, p.command, p.time, p.state,    substring(p.info, 1, 50) as info,    t.trx_started, unix_timestamp(now()) - unix_timestamp(t.trx_started) as trx_age_seconds, t.trx_rows_modified, t.trx_isolation_level   from information_schema.processlist p    left join information_schema.innodb_trx t    on p.id = t.trx_mysql_thread_id \G
```

The following example shows the output from this query below:

```
*************************** 1. row *************************** 
        session_id: 11 
               user: adminuser 
               host: 172.31.19.159:53624 
                 db: NULL 
            command: Sleep 
               time: 636 
              state: cleaned up 
               info: NULL 
        trx_started: 2019-08-01 15:25:07 
    trx_age_seconds: 2908 
  trx_rows_modified: 17825792 
trx_isolation_level: REPEATABLE READ 
*************************** 2. row *************************** 
         session_id: 12 
               user: adminuser 
               host: 172.31.19.159:53622 
                 db: NULL 
            command: Query 
               time: 15 
              state: executing 
               info: select * from classicmodels.orders 
        trx_started: NULL 
    trx_age_seconds: NULL 
  trx_rows_modified: NULL 
trx_isolation_level: NULL
```

An analysis of this information, by session, is listed in the following table.

| **Area** | **Analysis** |
|----|----|
| Session 11 | This session is currently idle (sleeping) with no queries running, and it has been for 636 seconds. Within the session, a transaction that’s been open for 2908 seconds has modified 17,825,792 rows, and it uses REPEATABLE READ isolation. |
| Session 12 | The session is currently executing a SELECT statement, which has been running for 15 seconds. There's no query running within the session, as indicated by the NULL values for trx_started and trx_age_seconds. The session will continue to hold the garbage collection boundary as long as it runs unless it’s using the more relaxed READ COMMITTED isolation. |

Note that if a session is reported as idle, it’s no longer executing any statements. At this point, the session has completed any prior work and is waiting for new statements from the client. However, idle sessions are still responsible for some CPU consumption and memory usage.

## Listing open transactions

The output from the following query provides a list of all the transactions currently running against the database server in order of transaction start time so that you can easily identify if there are any long running and blocking transactions exceeding their expected runtime.

```
SELECT trx_id, trx_mysql_thread_id, trx_state, Unix_timestamp() - ( To_seconds(trx_started) - To_seconds('1970-01-01 00:00:00') ) AS trx_age_seconds, trx_weight, trx_query, trx_tables_in_use, trx_tables_locked, trx_lock_structs, trx_rows_locked, trx_rows_modified, trx_isolation_level, trx_unique_checks, trx_is_read_only FROM information_schema.innodb_trx ORDER BY trx_started ASC;
```

## Understanding thread states

Transactions that contribute to higher CPU utilization during execution can have threads in various states, as described in the following sections. Use this information to better understand the query lifecycle and various thread states.

### Checking permissions/Opening tables

This state usually means the open table operation is consuming a long time. Usually, you can increase the table cache size to improve the issue. However, tables opening slowly can also be indicative of other issues, such as having too many tables under the same database.

### Sending data

While this state can mean that the thread is sending data through the network, it can also indicate that the query is reading data from the disk or memory. This state can be caused by a sequential table scan. You should check the values of the innodb_buffer_pool_reads and innodb_buffer_pool_read_requests to determine whether a large number of pages are being served from the disk into the memory. For more information, see [Troubleshoot low memory issues in Azure Database for MySQL](how-to-troubleshoot-low-memory-issues.md).

### Updating

This state usually means that the thread is performing a write operation. Check the IO-related metric in the Performance Monitor to get a better understanding on what the current sessions are doing.

### Waiting for <lock_type> lock

This state indicates that the thread is waiting for a second lock. In most cases, it might be a metadata lock. You should review all other threads and see who is taking the lock.

## Understanding and analyzing wait events

It’s important to understand the underlying wait events in MySQL engine, because long waits or a large number of waits in a database can lead to increased CPU utilization. The following example shows the appropriate command and sample output.

```
SELECT event_name AS wait_event,
count_star AS all_occurrences,
Concat(Round(sum_timer_wait / 1000000000000, 2), ' s') AS total_wait_time,
 Concat(Round(avg_timer_wait / 1000000000, 2), ' ms') AS
avg_wait_time
FROM performance_schema.events_waits_summary_global_by_event_name
WHERE count_star > 0 AND event_name <> 'idle'
ORDER BY sum_timer_wait DESC LIMIT 10;
+--------------------------------------+-----------------+-----------------+---------------+
| wait_event                           | all_occurrences | total_wait_time | avg_wait_time |
+--------------------------------------+-----------------+-----------------+---------------+
| wait/io/file/sql/binlog              |            7090 | 255.54 s        | 36.04 ms      |
| wait/io/file/innodb/innodb_log_file  |           17798 | 55.43 s         | 3.11 ms       |
| wait/io/file/innodb/innodb_data_file |          260227 | 39.67 s         | 0.15 ms       |
| wait/io/table/sql/handler            |         5548985 | 11.73 s         | 0.00 ms       |
| wait/io/file/sql/FRM                 |            1237 | 7.61 s          | 6.15 ms       |
| wait/io/file/sql/dbopt               |              28 | 1.89 s          | 67.38 ms      |
| wait/io/file/myisam/kfile            |              92 | 0.76 s          | 8.30 ms       |
| wait/io/file/myisam/dfile            |             271 | 0.53 s          | 1.95 ms       |
| wait/io/file/sql/file_parser         |              18 | 0.32 s          | 17.75 ms      |
| wait/io/file/sql/slow_log            |               2 | 0.05 s          | 25.79 ms      |
+--------------------------------------+-----------------+-----------------+---------------+
10 rows in set (0.00 sec)
```

## Restrict SELECT Statements execution time

If you don’t know about the execution cost and execution time for database operations involving SELECT queries, any long running SELECTs can lead to unpredictability or volatility in the database server. The size of statements and transactions, as well as the associated resource utilization, continues to grow depending on the underlying data set growth. Because of this unbounded growth, end user statements and transactions take longer and longer, consuming increasingly more resources until they overwhelm the database server. When using unbounded SELECT queries, it’s recommended to configure the max_execution_time parameter so that any queries exceeding this duration will be aborted.

## Recommendations

* Ensure that your database has enough resources allocated to run your queries. At times, you might need to scale up the instance size to get more CPU cores to accommodate your workload.
* Avoid large or long-running transactions by breaking them into smaller transactions.
* Run SELECT statements on read replica servers when possible.
* Use alerts on “Host CPU Percent” so that you get notifications if the system exceeds any of the specified thresholds.
* Use Query Performance Insights or Azure Workbooks to identify any problematic or slowly running queries, and then optimize them.
* For production database servers, collect diagnostics at regular intervals to ensure that everything is running smoothly. If not, troubleshoot and resolve any issues that you identify.

## Next steps

To find peer answers to your most important questions or to post or answer a question, visit [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-database-mysql).
