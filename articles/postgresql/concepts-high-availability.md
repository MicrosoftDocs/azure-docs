---
title: High availability concepts in Azure Database for PostgreSQL
description: This article provides information of high availability when using Azure Database for PostgreSQL.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 02/01/2019
---
# High availability concepts in Azure Database for PostgreSQL
The Azure Database for PostgreSQL service provides a guaranteed high level of availability. The financially backed service level agreement (SLA) is 99.99% upon general availability. There is virtually no application down time when using this service.

## High availability
The high availability (HA) model is based on built-in failover mechanisms when a node-level interruption occurs. A node-level interruption could occur because of a hardware failure or in response to a service deployment.

At all times, changes made to an Azure Database for PostgreSQL database server occur in the context of a transaction. Changes are recorded synchronously in Azure storage when the transaction is committed. If a node-level interruption occurs, the database server automatically creates a new node and attaches data storage to the new node. Any active connections are dropped and any inflight transactions are not committed.

## Application retry logic is essential
It is important that PostgreSQL database applications are built to detect and retry dropped connections and failed transactions. When the application retries, the application's connection is transparently redirected to the newly created instance, which takes over for the failed instance.

Internally in Azure, a gateway is used to redirect the connections to the new instance. Upon an interruption, the entire fail-over process typically takes tens of seconds. Since the redirect is handled internally by the gateway, the external connection string remains the same for the client applications.

## Scaling up or down
Similar to the HA model, when an Azure Database for PostgreSQL is scaled up or down, a new server instance with the specified size is created. The existing data storage is detached from the original instance, and attached to the new instance.

During the scale operation, an interruption to the database connections occurs. The client applications are disconnected, and open uncommitted transactions are canceled. Once the client application retries the connection, or makes a new connection, the gateway directs the connection to the newly sized instance. 

The duration of failover or scaling is greatly relied on the size of transaction log that needed to be recovered. We normally suggest the transaction log size is smaller than max_wal_size of your server. Please try below steps to monitor the metrics:
a.	Run the query 
[show max_wal_size;] 
first to check the size based your current tier ( should be 1G for Basic tier, 5G for both General Purpose and Memory Optimized) . 
b.	And then compare the transaction log size with the value max_wal_size. You can use 
[select sum(size/1024.0/1024.0/1024.0) as xlog_size_gb from pg_ls_waldir();] 
to check the size of transaction log.
c.	If max_wal_size is larger, the time used for recovery from a failover or scaling should be within 1 minutes, or longer unavailability  is possible.

## Next steps
- Learn about [handling transient connectivity errors](concepts-connectivity.md)
- Learn how to [replicate your data with read replicas](howto-read-replicas-portal.md)
