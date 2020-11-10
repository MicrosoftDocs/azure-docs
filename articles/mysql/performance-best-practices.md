---
title: Performance best practices - Azure Database for MySQL
description: This article describes the best practices to monitor and tune performance for your Azure Database for MySQL.
author: manishku
ms.author: kummanish
ms.service: mysql
ms.topic: conceptual
ms.date: 04/13/2020
---

# Best practice for optimal performance of your Azure Database for MySQL

Learn about the best practices for getting the best performance while working with your Azure Database for MySQL. As we add new capabilities to the platform, we will continue refine the best practices detailed in this section.

## Physical Proximity

You can significantly increase the application throughput by creating the application server and database service in the same region. Make sure you deploy an application and the database in the same region. A quick check before starting any performance benchmarking run is to determine the network latency between the client and database using a simple SELECT 1 query. We have seen customers report significant improvement in throughput when the client and Azure Database for MySQL is in the same region.

## Accelerated Networking

Use accelerated networking for the application server/client machine, wherever it is applicable. Accelerated Networking enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the datapath, reducing latency, jitter, and CPU utilization, for use with the most demanding network workloads on supported VM types. For more information please refer to create a virtual machine with accelerated networking.

## Connection Efficiency

Establishing a new connection is always an expensive and time-consuming task, reduce the number of attempts to create new connections by implementing the following approaches.
Connection Pooling: Is a mechanism that manages the creation and allocation of database connections. When a program/application requests a database connection, it prioritizes the allocation of existing idle database connections rather than creating a new one. 

* For connection pooling, you can leverage ProxySQL, an open source, high performance proxy which provide built-in connection pooling and further allows you to scale out and [load balance your workload](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/load-balance-read-replicas-using-proxysql-in-azure-database-for/ba-p/880042) to multiple read replicas as required on demand with any changes in application code.

* Alternatively, you can also leverage Heimdall Data Proxy, a vendor-neutral proprietary proxy solution. It supports query caching and read/write split with replication lag detection. You can also refer to how to [accelerate MySQL Performance with the Heimdall proxy](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/accelerate-mysql-performance-with-the-heimdall-proxy/ba-p/1063349).  

* Persistent or Long-Lived Connection: If your application has short transactions/queries typically with execution time < 5-10 ms then replace short connections with persistent connections. Replace short connections with persistent connections requires only minor changes to the code, but it has a major effect in terms of improving performance in many typical application scenarios. By using this approach you can avoid opening a new request for each connection instead reuse the existing connection to send more requests. Please make sure to set the timeout or close connection when it is done.

* While operating with Azure Database for MySQL, you should use good connection management practices, such as connection pooling. This will help in better resource utilization while we operate under the connection limits of the database SKU you operate on.

* If you are using replica, use ProxySQL to balance off load between the primary server and the readable secondary replica server. Please see the setup steps [here](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/scaling-an-azure-database-for-mysql-workload-running-on/ba-p/1105847).

## Data Import configurations

* To import a large data set to Azure Database for MySQL, you can temporarily scale your instance to higher SKU size for improved performance and scale it back after import operation is over.

* You can perform MySQL migrations to Azure Database for MySQL with minimal downtime by using the newly introduced continuous sync capability for the Azure Database Migration Service (DMS).

## Azure Database for MySQL Memory Recommendations

An Azure Database for MySQL performance best practice is to allocate enough RAM so that you’re working set resides almost completely in memory. Check if the memory percentage being used in reaching the [limits](https://docs.microsoft.com/azure/mysql/concepts-pricing-tiers) using the [metrics for the MySQL server](https://docs.microsoft.com/azure/mysql/concepts-monitoring). You can set alerts on such numbers to ensure that as the servers reaches limits you can take prompt actions to fix it. Based on the limits defined, check if scaling up the database SKU — either to higher compute size or to better pricing tier which results in a dramatic increase in performance. You can continue to scale up until your performance numbers no longer drops dramatically after a scaling operation. For information on monitoring a DB instance's metrics, see [MySQL DB Metrics](https://docs.microsoft.com/azure/mysql/concepts-monitoring#metrics).

## Next steps

[Best practice for server operations using Azure Database for MySQL](concept-server-operational-best-practice.md)
[Best practice for monitoring your Azure Database for MySQL](concept-monitoring-best-practices.md)
[Troubleshooting your existing Azure Database for MySQL](howto-troubleshoot-mysql.md)
[Get started with Azure Database for MySQL](quickstart-create-mysql-server-database-using-azure-portal.md)