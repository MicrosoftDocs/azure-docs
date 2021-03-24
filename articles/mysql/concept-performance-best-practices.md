---
title: Performance best practices - Azure Database for MySQL
description: This article describes some recommendations to monitor and tune performance for your Azure Database for MySQL.
author: Bashar-MSFT
ms.author: bahusse
ms.service: mysql
ms.topic: conceptual
ms.date: 1/28/2021
---

# Best practices for optimal performance of your Azure Database for MySQL - Single server

Learn how to get best performance while working with your Azure Database for MySQL - Single server. As we add new capabilities to the platform, we will continue refining our recommendations in this section.

## Physical Proximity

 Make sure you deploy an application and the database in the same region. A quick check before starting any performance benchmarking run is to determine the network latency between the client and database using a simple SELECT 1 query. 

## Accelerated Networking

Use accelerated networking for the application server if you are using Azure virtual machine, Azure Kubernetes, or App Services. Accelerated Networking enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the datapath, reducing latency, jitter, and CPU utilization, for use with the most demanding network workloads on supported VM types.

## Connection Efficiency

Establishing a new connection is always an expensive and time-consuming task. When an application requests a database connection, it prioritizes the allocation of existing idle database connections rather than creating a new one.  Here are some options for good connection practices:

- **ProxySQL**: Use [ProxySQL](https://proxysql.com/) which provides built-in connection pooling and [load balance your workload](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/load-balance-read-replicas-using-proxysql-in-azure-database-for/ba-p/880042) to multiple read replicas as required on demand with any changes in application code.

- **Heimdall Data Proxy**: Alternatively, you can also leverage Heimdall Data Proxy, a vendor-neutral proprietary proxy solution. It supports query caching and read/write split with replication lag detection. You can also refer to how to [accelerate MySQL Performance with the Heimdall proxy](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/accelerate-mysql-performance-with-the-heimdall-proxy/ba-p/1063349).  

- **Persistent or Long-Lived Connection**: If your application has short transactions or queries typically with execution time < 5-10 ms, then replace short connections with persistent connections. Replace short connections with persistent connections requires only minor changes to the code, but it has a major effect in terms of improving performance in many typical application scenarios. Make sure to set the timeout or close connection when the transaction is complete.

- **Replica**: If you are using replica, use [ProxySQL](https://proxysql.com/) to balance off load between the primary server and the readable secondary replica server. Learn [how to set up ProxySQL](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/scaling-an-azure-database-for-mysql-workload-running-on/ba-p/1105847).

## Data Import configurations

- You can temporarily scale your instance to higher SKU size before starting a data import operation and then scale it down when the import is successful.
- You can import your data with minimal downtime by using [Azure Database Migration Service (DMS)](https://datamigration.microsoft.com/) for online or offline migrations. 

## Azure Database for MySQL Memory Recommendations

An Azure Database for MySQL performance best practice is to allocate enough RAM so that you’re working set resides almost completely in memory. 

- Check if the memory percentage being used in reaching the [limits](./concepts-pricing-tiers.md) using the [metrics for the MySQL server](./concepts-monitoring.md). 
- Set up alerts on such numbers to ensure that as the servers reaches limits you can take prompt actions to fix it. Based on the limits defined, check if scaling up the database SKU—either to higher compute size or to better pricing tier, which results in a dramatic increase in performance. 
- Scale up until your performance numbers no longer drops dramatically after a scaling operation. For information on monitoring a DB instance's metrics, see [MySQL DB Metrics](./concepts-monitoring.md#metrics).
 
## Use InnoDB Buffer Pool Warmup

After restarting Azure Database for MySQL server, the data pages residing in storage are loaded as the tables are queried which leads to increased latency and slower performance for the first execution of the queries. This may not be acceptable for latency sensitive workloads. 

Utilizing InnoDB buffer pool warmup shortens the warmup period by reloading disk pages that were in the buffer pool before the restart rather than waiting for DML or SELECT operations to access corresponding rows.

You can reduce the warmup period after restarting your Azure Database for MySQL server, which represents a performance advantage by configuring [InnoDB buffer pool server parameters](https://dev.mysql.com/doc/refman/8.0/en/innodb-preload-buffer-pool.html). InnoDB saves a percentage of the most recently used pages for each buffer pool at server shutdown and restores these pages at server startup.

It is also important to note that improved performance comes at the expense of longer start-up time for the server. When this parameter is enabled, server startup and restart time is expected to increase depending on the IOPS provisioned on the server. 

We recommend testing and monitor the restart time to ensure the start-up/restart performance is acceptable as the server is unavailable during that time. It is not recommended to use this parameter with less than 1000 provisioned IOPS (or in other words, when storage provisioned is less than 335 GB).

To save the state of the buffer pool at server shutdown, set server parameter `innodb_buffer_pool_dump_at_shutdown` to `ON`. Similarly, set server parameter `innodb_buffer_pool_load_at_startup` to `ON` to restore the buffer pool state at server startup. You can control the impact on start-up/restart time by lowering and fine-tuning the value of server parameter `innodb_buffer_pool_dump_pct`. By default, this parameter is set to `25`.

> [!Note]
> InnoDB buffer pool warmup parameters are only supported in general purpose storage servers with up to 16-TB storage. Learn more about [Azure Database for MySQL storage options here](./concepts-pricing-tiers.md#storage).

## Next steps

- [Best practice for server operations using Azure Database for MySQL](concept-operation-excellence-best-practices.md) <br/>
- [Best practice for monitoring your Azure Database for MySQL](concept-monitoring-best-practices.md)<br/>
- [Get started with Azure Database for MySQL](quickstart-create-mysql-server-database-using-azure-portal.md)<br/>