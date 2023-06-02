---
title: Intelligent tuning - Azure Database for PostgreSQL - Flexible Server
description: This article describes the intelligent tuning feature in Azure Database for PostgreSQL - Flexible Server.
author: nathan-wisner-ms
ms.author: nathanwisner
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/30/2021
---

# Perform intelligent tuning in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The Intelligent Tuning feature of Azure Database for PostgreSQL - Flexible Server is designed to enhance overall performance automatically and help prevent possible issues. It continuously monitors the database instance's overall status and performance and automatically optimizes the workload's performance.

The Azure Database for PostgreSQL - Flexible Server is equipped with an inherent intelligence mechanism that can dynamically adapt the database to your workload, thereby automatically enhancing performance. This feature comprises two automatic tuning functionalities:

* **Autovacuum tuning**: This function diligently tracks the bloat ratio and adjusts autovacuum settings accordingly. It factors in both current and predicted resource usage to ensure your workload isn't disrupted.
* **Writes tuning**: This feature persistently monitors the volume and patterns of write operations, modifying parameters that affect write performance. These parameters include bgwriter_delay, checkpoint_completion_target, max_wal_size, and min_wal_size. The primary aim of these adjustments is to enhance both system performance and reliability, thereby proactively averting potential complications.

## Why intelligent tuning?

The autovacuum process is a critical part of maintaining the health and performance of a PostgreSQL database. It helps to reclaim storage occupied by "dead" rows, freeing up space and ensuring the database continues to run smoothly. Equally important is the tuning of write operations within the database, a task that typically falls to database administrators (DBAs).

However, constantly monitoring a database and fine-tuning write operations can be challenging and time-consuming. This becomes increasingly complex when dealing with multiple databases, and might even become an impossible task when managing a large number of them.

This is where Intelligent Tuning steps in. Rather than manually overseeing and tuning your database, the Intelligent Tuning feature can effectively shoulder some of the load. It helps in the automatic monitoring and tuning of the database, allowing you to focus on other important tasks.

The Intelligent Tuning feature offers an autovacuum tuning functionality that diligently keeps track of the bloat ratio and adjusts settings accordingly, ensuring optimal use of resources. Furthermore, the Writes Tuning feature monitors the volume and transactional patterns of write operations, adjusting parameters such as bgwriter_delay, checkpoint_completion_target, max_wal_size, and min_wal_size to enhance both system performance and reliability.

In summary, Intelligent Tuning provides an efficient solution for database monitoring and tuning, taking the hard and tedious tasks off your plate. By using this automatic tuning feature, you can rely on the Azure Database for PostgreSQL - Flexible Server to maintain the optimal performance of your databases, saving you valuable time and resources.

### How does intelligent tuning work?
Intelligent Tuning is an ongoing monitoring and analysis process that not only learns about the characteristics of your workload but also tracks your current load and resource usage such as CPU or IOPS. By doing so, it makes sure not to disturb the normal operations of your application workload.

:::image type="content" source="./media/concepts-intelligent-tuning/tuning-process.png" alt-text="Automatic tuning process.":::

The process allows the database to dynamically adjust to your workload by discerning the current bloat ratio, write performance, and checkpoint efficiency on your instance. Armed with these insights, Intelligent Tuning deploys tuning actions designed to not only enhance your workload's performance but also to circumvent potential pitfalls.

Moreover, Intelligent Tuning continuously keeps track of the database's performance post-change to ensure that the modifications are indeed bolstering your workload's performance. Any action that doesn't result in a performance improvement is automatically reversed.

This continual verification process is a cornerstone of Intelligent Tuning. It guarantees that any changes made contribute positively to your workload's performance and avoid disruptions, thereby maintaining an unwavering commitment to optimizing performance and preempting potential issues.

## Autovacuum tuning


## Writes tuning
details needed!

## Limitations and known issues

* Intelligent tuning makes optimizations only in specific ranges. It's possible that the feature won't make any changes.
* Deleted databases in the query can cause slight delays in the feature's execution of improvements.

## Next Steps

* [Troubleshooting guides for Azure Database for PostgreSQL - Flexible Server](concepts-troubleshooting-guides.md)
* [Autovacuum Tuning in Azure Database for PostgreSQL - Flexible Server](how-to-autovacuum-tuning.md)
* [Troubleshoot high IOPS utilization for Azure Database for PostgreSQL - Flexible Server](how-to-high-io-utilization.md)
* [Best practices for uploading data in bulk in Azure Database for PostgreSQL - Flexible Server](how-to-bulk-load-data.md)
* [Troubleshoot high CPU utilization in Azure Database for PostgreSQL - Flexible Server](how-to-high-cpu-utilization.md)
* [Query Performance Insight for Azure Database for PostgreSQL - Flexible Server](concepts-query-performance-insight.md)
