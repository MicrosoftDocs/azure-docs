---
title: Troubleshoot low memory issues in Azure Database for MySQL 
description: Learn how to troubleshoot low memory issues in Azure Database for MySQL.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.topic: troubleshooting
ms.date: 06/20/2022
---

# Troubleshoot low memory issues in Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

To help ensure that a MySQL database server performs optimally, it's very important to have the appropriate memory allocation and utilization. By default, when you create an instance of Azure Database for MySQL, the available physical memory is dependent on the tier and size you select for your workload. In addition, memory is allocated for buffers and caches to improve database operations. For more information, see [How MySQL Uses Memory](https://dev.mysql.com/doc/refman/5.7/en/memory-use.html).

Note that the Azure Database for MySQL service consumes memory to achieve as much cache hit as possible. As a result, memory utilization can often hover between 80- 90% of the available physical memory of an instance. Unless there's an issue with the progress of the query workload, it isn't a concern. However, you may run into out of memory issues for reasons such as that you have:

* Configured too large buffers.
* Sub optimal queries running.
* Queries performing joins and sorting large data sets.
* Set the maximum connections on a database server too high.

A majority of a server’s memory is used by InnoDB’s global buffers and caches, which include components such as **innodb_buffer_pool_size**, **innodb_log_buffer_size**, **key_buffer_size**, and **query_cache_size**.

The value of the **innodb_buffer_pool_size** parameter specifies the area of memory in which InnoDB caches the database tables and index-related data. MySQL tries to accommodate as much table and index-related data in the buffer pool as possible. A larger buffer pool requires fewer I/O operations being diverted to the disk.

## Monitoring memory usage

Azure Database for MySQL provides a range of metrics to gauge the performance of your database instance. To better understand the memory utilization for your database server, view the **Host Memory Percent** or **Memory Percent** metrics.

![Viewing memory utilization metrics](media/how-to-troubleshoot-low-memory-issues/average-host-memory-percentage.png)

If you notice that memory utilization has suddenly increased and that available memory is dropping quickly, monitor other metrics, such as **Host CPU Percent**, **Total Connections**, and **IO Percent**, to determine if a sudden spike in the workload is the source of the issue.

It’s important to note that each connection established with the database server requires the allocation of some amount of memory. As a result, a surge in database connections can cause memory shortages.

## Causes of high memory utilization

Let’s look at some more causes of high memory utilization in MySQL. These causes are dependent on the characteristics of the workload.

### An increase in temporary tables

MySQL uses “temporary tables”, which are a special type of table designed to store a temporary result set. Temporary tables can be reused several times during a session. Since any temporary tables created are local to a session, different sessions can have different temporary tables. In production systems with many sessions performing compilations of large temporary result sets, you should regularly check the global status counter created_tmp_tables, which tracks the number of temporary tables being created during peak hours. A large number of in-memory temporary tables can quickly lead to low available memory in an instance of Azure Database for MySQL.

With MySQL, temporary table size is determined by the values of two parameters, as described in the following table.

| **Parameter** | **Description** |
|----------|----------|
| tmp_table_size | Specifies the maximum size of internal, in-memory temporary tables. |
| max_heap_table_size | Specifies the maximum size to which user created MEMORY tables can grow. |

> [!NOTE]
> When determining the maximum size of an internal, in-memory temporary table, MySQL considers the lower of the values set for the tmp_table_size and max_heap_table_size parameters.
>

#### Recommendations

To troubleshoot low memory issues related to temporary tables, consider the following recommendations.

* Before increasing the tmp_table_size value, verify that your database is indexed properly, especially for columns involved in joins and grouped by operations. Using the appropriate indexes on underlying tables limits the number of temporary tables that are created. Increasing the value of this parameter and the max_heap_table_size parameter without verifying your indexes can allow inefficient queries to run without indexes and create more temp tables than are necessary.
* Tune the values of the max_heap_table_size and tmp_table_size parameters to address the needs of your workload.
* If the values you set for the max_heap_table_size and tmp_table_size parameters are too low, temporary tables may regularly spill to storage, adding latency to your queries. You can track temporary tables spilling to disk using the global status counter created_tmp_disk_tables. By comparing the values of the created_tmp_disk_tables and created_tmp_tables variables, you view the number of internal, on-disk temporary tables that have been created to the total number of internal temporary tables created.

### Table cache

As a multi-threaded system, MySQL maintains a cache of table file descriptors so that the tables can be concurrently opened independently by multiple sessions. MySQL uses some amount of memory and OS file descriptors to maintain this table cache. The variable table_open_cache defines the size of the table cache.

#### Recommendations

To troubleshoot low memory issues related to the table cache, consider the following recommendations.

* The parameter table_open_cache specifies the number of open tables for all threads. Increasing this value increases the number of file descriptors that mysqld requires. You can check whether you need to increase the table cache by checking the opened_tables status variable in the show global status counter. Increase the value of this parameter in increments to accommodate your workload.
* Setting table_open_cache too low may cause MySQL to spend more time in opening and closing tables needed for query processing.
* Setting this value too high may cause usage of more memory and the operating system running of file descriptors leading to refused connections or failing to process queries.

### Other buffers and the query cache

When troubleshooting issues related to low memory, you can work with a few more buffers and a cache to help with the resolution.

#### Net buffer (net_buffer_length)

The net buffer is size for connection and thread buffers for each client thread and can grow to value specified for max_allowed_packet. If a query statement is large, for example, all the inserts/updates have a very large value, then increasing the value of the net_buffer_length parameter will help to improve performance.

#### Join buffer (join_buffer_size)

The join buffer is allocated to cache table rows when a join can’t use an index. If your database has many joins performed without indexes, consider adding indexes for faster joins.  If you can’t add indexes, then consider increasing the value of the join_buffer_size parameter, which specifies the amount of memory allocated per connection.

#### Sort buffer (sort_buffer_size)

The sort buffer is used for performing sorts for some ORDER BY and GROUP BY queries. If you see many Sort_merge_passes per second in the SHOW GLOBAL STATUS output, consider increasing the sort_buffer_size value to speed up ORDER BY or GROUP BY operations that can’t be improved using query optimization or better indexing.

Avoid arbitrarily increasing the sort_buffer_size value unless you have related information that indicates otherwise. Memory for this buffer is assigned per connection. In the MySQL documentation, the Server System Variables article calls out that on Linux, there are two thresholds, 256 KB and 2 MB, and that using larger values can significantly slow down memory allocation. As a result, avoid increasing the sort_buffer_size value beyond 2M, as the performance penalty will outweigh any benefits.

#### Query cache (query_cache_size)

The query cache is an area of memory that is used for caching query result sets. The query_cache_size parameter determines the amount of memory that is allocated for caching query results. By default, the query cache is disabled. In addition, the query cache is deprecated in MySQL version 5.7.20 and removed in MySQL version 8.0. If the query cache is currently enabled in your solution, before disabling it, verify that there aren’t any queries relying on it.

### Calculating buffer cache hit ratio

Buffer cache hit ratio is important in MySQL environment to understand if the buffer pool can accommodate the workload requests or not, and as a general rule of thumb it’s a good practice to always have a buffer pool cache hit ratio more than 99%.

To compute the InnoDB buffer pool hit ratio for read requests, you can run the SHOW GLOBAL STATUS to retrieve counters “Innodb_buffer_pool_read_requests” and “Innodb_buffer_pool_reads” and then compute the value using the formula shown below.

```
InnoDB Buffer pool hit ratio = Innodb_buffer_pool_read_requests / (Innodb_buffer_pool_read_requests + Innodb_buffer_pool_reads) * 100
```

Consider the following example.

```
mysql> show global status like "innodb_buffer_pool_reads";
+--------------------------+-------+
| Variable_name            | Value |
+--------------------------+-------+
| Innodb_buffer_pool_reads | 197   |
+--------------------------+-------+
1 row in set (0.00 sec)

mysql> show global status like "innodb_buffer_pool_read_requests";
+----------------------------------+----------+
| Variable_name                    | Value    |
+----------------------------------+----------+
| Innodb_buffer_pool_read_requests | 22479167 |
+----------------------------------+----------+
1 row in set (0.00 sec)
```

Using the above values, computing the InnoDB buffer pool hit ratio for read requests yields the following result:

```
InnoDB Buffer pool hit ratio = 22479167/(22479167+197) * 100 

Buffer hit ratio = 99.99%
```

In addition to select statements buffer cache hit ratio, for any DML statements, writes to the InnoDB Buffer Pool happen in the background. However, if it's necessary to read or create a page and no clean pages are available, it's also necessary to wait for pages to be flushed first.

The Innodb_buffer_pool_wait_free counter counts how many times this has happened.  Innodb_buffer_pool_wait_free greater than 0 is a strong indicator that the InnoDB Buffer Pool is too small and increase in buffer pool size or instance size is required to accommodate the writes coming into the database.

## Recommendations

* Ensure that your database has enough resources allocated to run your queries. At times, you may need to scale up the instance size to get more physical memory so the buffers and caches to accommodate your workload.
* Avoid large or long-running transactions by breaking them into smaller transactions.
* Use alerts “Host Memory Percent” so that you get notifications if the system exceeds any of the specified thresholds.
* Use Query Performance Insights or Azure Workbooks to identify any problematic or slowly running queries, and then optimize them.
* For production database servers, collect diagnostics at regular intervals to ensure that everything is running smoothly. If not, troubleshoot and resolve any issues that you identify.

## Next steps

To find peer answers to your most important questions or to post or answer a question, visit [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-database-mysql).
