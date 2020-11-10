---
title: Monitoring best practices - Azure Database for MySQL
description: This article describes the best practices to monitor your Azure Database for MySQL.
author: manishku
ms.author: kummanish
ms.service: mysql
ms.topic: conceptual
ms.date: 04/13/2020
---

# Best Practices for Monitoring Azure Database for MySQL

Learn about the best practices that can be used to monitor your database operations and ensure that the performance is not compromised as data size grows. As we add new capabilities to the platform, we will continue refine the best practices detailed in this section.

## Layout of the current monitoring toolkit

Azure Database for MySQL provides tools and methods you can use to monitor usage easily, add, or remove resources (such as CPU, memory, or I/O), troubleshoot potential problems, and help improve the performance of a database. You should [monitor performance metrics](concepts-monitoring.md#metrics) on a regular basis to see the average, maximum, and minimum values for a variety of time ranges.

If you do so, you can identify when performance is degraded. You can also [set alerts](howto-alert-on-metric.md#create-an-alert-rule-on-a-metric-from-the-azure-portal) for a metric threshold, so you are alerted if they are reached those limits and take appropriate actions. Refer to the steps below for best practice to troubleshoot performance problems:  

To ensure that a database runs without problems, you should:

* Monitor database performance to make sure that the resources assigned to the database can handle the workload. If the database is hitting resource limits, consider:
    * Identifying and optimizing the top resource-consuming queries. 
    * Adding more resources by upgrading the service tier.
* Troubleshoot performance problems to identify why a potential problem occurred and to identify the root cause of the problem. After you identify the root cause, take steps to fix the problem. 

You should start measuring the baseline performance of your database system as you start operating on Azure. When you set up a new Azure Database for MySQL and get it running with your workload, you should capture the average, maximum, and minimum values of all of the [performance metrics](howto-alert-on-metric.md) at a number of different intervals (for example, 1 hour, 24 hours, one week, two weeks) to understand what is the baseline numbers. Using these numbers you can have an understanding of when the database performance is dropping below standard levels. Note that the level of performance metrics numbers which is acceptable is dependent on the baseline level defined by you and the type of application you are running against the database. The Azure Database for MySQL provides you tools and resources to help troubleshoot and fix potential performance problems. Advise about specific types of metrics follows: 

### CPU utilization
Check to see if the database is reaching 100 percent of CPU usage for an extended period of time. High CPU usage might indicate that you need to identify and tune queries that use the most compute power. High CPU usage might also indicate that the database or instance should be upgraded to a higher service tier. Make sure that the throughput or concurrency is as expected as you scale up/down the CPU. 

### Memory 
The amount of memory available for the database or instance is proportional to the [number of vCores](concepts-pricing-tiers.md). Make sure the memory is enough for the workload. For best database performance, one should ensure that the typical database working set fits into memory to minimize read and write operations. However, if your database memory consumption frequently grows beyond a defined threshold, this indicates that you should check your workload or upgrade your instance by increasing vCores or higher performance tier. Use Query Store, Query Performance Recommendation to identify queries with the longest duration, most executed. Explore opportunities to optimize. 

### Storage 
This refers to the [amount of storage](howto-create-manage-server-portal.md#scale-compute-and-storage) that is used or provisioned for the MySQL server. The storage used by the service may include the database files, transaction logs, and the server logs. Ensure that the consumed disk space does not constantly exceed above 85 percent of the total provisioned disk space. If that is the case, your database performance will be improved if you delete or archive data from the database instance to free up some space. 

### Network traffic 

**Network Receive Throughput, Network Transmit Throughput** – The rate of network traffic to and from the MySQL instance in megabytes per second. As an administrator you should evaluate the throughput requirement for your domain and constantly monitor the traffic if throughput is lower than expected. 

### Database connections 
**Database Connections** – The number of client sessions that are connected to the Azure Database for MySQL should be aligned with the [connection limits for the selected SKU](concepts-limits.md#maximum-connections) size. Based on the expected use connections to your database you can vary the instance class and size to ensure the best database performance level. 

Note that the level of performance metrics numbers which is acceptable is dependent on the baseline level defined by you and the type of application you are running against the database. The Azure Database for MySQL provides you tools and resources to help troubleshoot and fix potential performance problems described below.

## Next steps

[Best practice for performance of Azure Database for MySQL](concept-performance-best-practices.md)
[Best practice for server operations using Azure Database for MySQL](concept-server-operational-best-practice.md)
[Troubleshooting your existing Azure Database for MySQL](howto-troubleshoot-mysql.md)
[Get started with Azure Database for MySQL](quickstart-create-mysql-server-database-using-azure-portal.md)