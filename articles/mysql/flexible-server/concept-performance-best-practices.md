---
title: Performance best practices - Azure Database for MySQL - Flexible Server
description: This article describes some recommendations to monitor and tune performance for Azure Database for MySQL flexible server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: code-sidd 
ms.author: sisawant
ms.date: 07/22/2022
---

# Best practices for optimal performance of Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Learn how to get best performance while working with Azure Database for MySQL flexible server. As we add new capabilities to the platform, we'll continue refining our recommendations in this section.

## Physical proximity

 Make sure you deploy an application and the database in the same region. A quick check before starting any performance benchmarking run is to determine the network latency between the client and database using a simple SELECT 1 query.

When resources such as a web application and its associated database are running in different regions, there might be increased latency in the communication between those resources. Another side possible effect of having the application and database in separate regions relates to [outbound data transfer costs](https://azure.microsoft.com/pricing/details/data-transfers).

To improve the performance and reliability of an application in a cost optimized deployment, it's highly recommended that the web application service and the Azure Database for MySQL flexible server resource reside in the same region and availability zone. This colocation is best for applications that are latency sensitive, and it also provides the best throughput, as resources are closely paired.

## Accelerated networking

Use accelerated networking for the application server if you're using Azure virtual machine, Azure Kubernetes, or App Services. Accelerated Networking enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the datapath, reducing latency, jitter, and CPU utilization, for use with the most demanding network workloads on supported VM types.

## Connection efficiency

Establishing a new connection is always an expensive and time-consuming task. When an application requests a database connection, it prioritizes the allocation of existing idle database connections rather than creating a new one.  Here are some options for good connection practices:

- **ProxySQL**: Use [ProxySQL](https://proxysql.com/), which provides built-in connection pooling and [load balance your workload](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/load-balance-read-replicas-using-proxysql-in-azure-database-for/ba-p/880042) to multiple read replicas as required on demand with any changes in application code.

- **Heimdall Data Proxy**: Alternatively, you can also use Heimdall Data Proxy, a vendor-neutral proprietary proxy solution. It supports query caching and read/write split with replication lag detection. You can also refer to how to [accelerate MySQL Performance with the Heimdall proxy](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/accelerate-mysql-performance-with-the-heimdall-proxy/ba-p/1063349).  

- **Persistent or Long-Lived Connection**: If your application has short transactions or queries typically with execution time < 5-10 ms, then replace short connections with persistent connections. Replace short connections with persistent connections requires only minor changes to the code, but it has a major effect in terms of improving performance in many typical application scenarios. Make sure to set the timeout or close connection when the transaction is complete.

- **Replica**: If you're using replica, use [ProxySQL](https://proxysql.com/) to balance off load between the primary server and the readable secondary replica server. Learn [how to set up ProxySQL](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/scaling-an-azure-database-for-mysql-workload-running-on/ba-p/1105847).

### Connection pooling

Connection pooling is a mechanism that manages the creation and allocation of database connections and protects a database against connection surges. Consider connection pooling if your application opens many connections in a relatively short time and the connections are short lived. These types of connections might occur, for example, over a magnitude of hundreds or thousands per second, and the time it takes to establish and close them is significant compared to the total connection lifetime.

If your application’s development framework doesn’t support connection pooling, instead use a connection proxy, such as ProxySQL or Heimdall proxy, between the application and database server.

### Handling connection scaling

A common approach for scaling web applications to meet fluctuating demand is to add and remove application servers. Each application server can use a connection pool with the database.
This approach causes the total number of connections on a database server to grow in relation to the number of application servers. For example, if a database server has 10 application servers and each is configured for 100 database connections, that would provide for 1,000 database connections. If the application workload scales because of higher user activity or during peak hours and if an additional 50 application servers are added, the database connections would total 6,000. Typically, most of these connections will be idle, after being spawned by the application servers. Because idle connections consume resources (memory and CPU) to remain open, database scalability might be impacted.

Additional potential challenges involve handling the total number of connections to the database server. This is dictated by the number of application servers connected to the database server, each creating its own set of connections. In these scenarios, consider tweaking the connection pools on the application servers. Try to reduce the number of connections in each pool to an acceptable minimum to ensure that there’s no bloat in connections on the database server side. Consider this as a short-term remedy to counter the effects of application server scaling rather than a permanent solution to address the growth of the application.

As a long-term solution, introduce a connection proxy, such as ProxySQL or Heimdall proxy, between the database server and the application server. This helps because the proxy will:

- Establish a connection to the database server with a fixed number of connections.
- Accept application connections and act as a buffer for potential connection storms.

Proxies can provide other features such as query caching, connection buffering, query rewriting/routing, and load balancing. For even greater scalability, consider using multiple proxy instances.

### Connection handling for fault tolerance and faster recovery

When designing your applications and environment for fault tolerance and faster recovery, consider that in a database environment, you’re likely to experience connection interruptions or hardware failures. Also remember the need for operational actions such as scaling instance sizes, patching, and performing manual failover.

For example, consider a scenario in which your database server completes failover within a minute, but your application is down for several minutes longer because of things such as DNS TTL being too long on the application side. In these cases, simply reducing the TTL value will provide quicker recovery, or integrating a connection proxy between application and database server can help handle such failures.

## Partitioning

When your production workload uses extremely large tables, partitioning is a great method to improve database performance and ease maintenance. Partitioning makes it easier to manage large tables, this approach allows you to add and drop partitions to manage large tables effectively.   Partitioning can also help scale the engine by alleviating internal structure contention such as internal locks per table or per index (e.g., consider the btr_search_latch in InnoDB).

By adding five partitions, for example, you essentially break a large table with a lot of activity into five smaller, more efficient tables. This would primarily help for cases in which the main operation is primary key lookups on the table, such that the queries can take advantage of “partition pruning”. But partitioning can also help in terms of table scan.

Note that while partitioning has its benefits, it also has some limitations, such as the lack of support for foreign keys in partitioned tables, the lack of query cache, etc. For a full list of these limitations, in the MySQL reference manual, see the chapter [Restrictions and Limitations on Partitioning](https://dev.mysql.com/doc/refman/5.7/en/partitioning-limitations.html).

## Segregating reads and writes

Most applications primarily read from the database, with only a small percentage of the interactions involving writes. The number of active connections on the primary database we calculated for the connection pools likely includes read traffic. Offloading as many queries to read replicas as possible and conserving access to the primary writable instance increases the amount of overall database activity performed by the application servers without increasing the load on the primary database. If you aren’t already accessing read replicas at least for longer running queries such as reports, you should consider immediately moving reporting or analytics to read replicas.

Wider scale use of read replicas may require more careful consideration, as replicas lag slightly behind the primary because of the asynchronous nature of replication. Find as many areas of the application as possible that can be served with reads from the replicas with minor code changes. You should also apply this method at higher levels concerning caching - serve more of the read only or slowly changing content from a dedicated caching tier such as [Azure Cache for Redis](https://azure.microsoft.com/services/cache/).

## Write scaling and sharding

Over time, applications evolve, and new functionality is added. Out of convenience or general practice, the tables get added to the primary database. To handle growing traffic loads on a database, identify areas of the application that can be easily moved to separate databases and consider horizontally sharding or vertically splitting the database.

Horizontally sharding a database works by creating multiple copies of the application schema in separate databases and segregating customers and all associated data based on customer ID, geography, or some other per-customer or tenant attribute. This works very well for SaaS or B2C applications in which individual customers are small and the load on the application is from aggregate usage of millions of customers. However, it's more difficult with B2B applications in which customers are different sizes and individual large customers may dominate the traffic load for a particular shard.

Vertically split load by functionally sharding the database - moving separate application domains (or micro services) to their own databases. This distributes load from the primary database to separate per-service databases. Simple examples include a logging table or site configuration information that doesn't need to be in the same database as the heavily loaded orders table. More complicated examples include breaking customer and account domains apart from orders or fulfillment domains. In some cases, this may require application changes, for example to modify email or background job queues to be self-contained and not rely on joins back to a customer or order table. Moving existing tables and data to a new primary database can be performed with Azure Database for MySQL flexible server read replicas and promoting the replica and pointing parts of the application to the newly created writable database. The newly created database needs to limit access with connection pools, tune queries, and spread load with its own replicas just like the original primary.

## Data import configurations

- You can temporarily scale your instance to higher SKU size before starting a data import operation and then scale it down when the import is successful.
- You can import your data with minimal downtime by using [Azure Database Migration Service (DMS)](../migrate/mysql-on-premises-azure-db/01-mysql-migration-guide-intro.md) for online or offline migrations.

## Azure Database for MySQL flexible server memory recommendations

An Azure Database for MySQL flexible server performance best practice is to allocate enough RAM so that your working set resides almost completely in memory.

- Check if the memory percentage being used in reaching the [limits](../single-server/concepts-pricing-tiers.md) using the [metrics for Azure Database for MySQL flexible server](./concepts-monitoring.md).
- Set up alerts on such numbers to ensure that as the server reaches limits, you can take prompt actions to fix it. Based on the limits defined, check if scaling up the database SKU—either to higher compute size or to better pricing tier, which results in a dramatic increase in performance. 
- Scale up until your performance numbers no longer drops dramatically after a scaling operation. For information on monitoring a DB instance's metrics, see [Azure Database for MySQL flexible server DB Metrics](./concepts-monitoring.md#metrics).

## Use InnoDB buffer pool Warmup

After the Azure Database for MySQL flexible server instance restarts, the data pages residing in storage are loaded as the tables are queried which leads to increased latency and slower performance for the first execution of the queries. This may not be acceptable for latency sensitive workloads. 

Utilizing InnoDB buffer pool warmup shortens the warmup period by reloading disk pages that were in the buffer pool before the restart rather than waiting for DML or SELECT operations to access corresponding rows.

You can reduce the warmup period after restarting your Azure Database for MySQL flexible server instance, which represents a performance advantage by configuring [InnoDB buffer pool server parameters](https://dev.mysql.com/doc/refman/8.0/en/innodb-preload-buffer-pool.html). InnoDB saves a percentage of the most recently used pages for each buffer pool at server shutdown and restores these pages at server startup.

It's also important to note that improved performance comes at the expense of longer start-up time for the server. When this parameter is enabled, server startup and restart time is expected to increase depending on the IOPS provisioned on the server.

We recommend testing and monitor the restart time to ensure the start-up/restart performance is acceptable as the server is unavailable during that time. It isn't recommended to use this parameter with less than 1000 provisioned IOPS (or in other words, when storage provisioned is less than 335 GB).

To save the state of the buffer pool at server shutdown, set server parameter `innodb_buffer_pool_dump_at_shutdown` to `ON`. Similarly, set server parameter `innodb_buffer_pool_load_at_startup` to `ON` to restore the buffer pool state at server startup. You can control the effect on start-up/restart time by lowering and fine-tuning the value of server parameter `innodb_buffer_pool_dump_pct`. By default, this parameter is set to `25`.

> [!NOTE]
> InnoDB buffer pool warmup parameters are only supported in general purpose storage servers with up to 16-TB storage. For more information, see [Azure Database for MySQL flexible server storage options](../single-server/concepts-pricing-tiers.md#storage).

## Next steps

- [Best practice for server operations using Azure Database for MySQL flexible server](concept-operation-excellence-best-practices.md)
- [Best practice for monitoring Azure Database for MySQL flexible server](concept-monitoring-best-practices.md)
- [Get started with Azure Database for MySQL flexible server](../single-server/quickstart-create-mysql-server-database-using-azure-portal.md)
