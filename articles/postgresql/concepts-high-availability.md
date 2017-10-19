---
title: High availability concepts in Azure Database for PostgreSQL | Microsoft Docs
description: This topic provides information of high avaialbility when using Azure Database for PostgreSQL
services: postgresql
author: jasonwhowell
ms.author: jasonh
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql
ms.topic: article
ms.date: 10/18/2017
---
# High availability concepts in Azure Database for PostgreSQL
Azure Database for PostgreSQL provides a guaranteed high level of availability with a financially-backed SLA of 99.99% at general availability. There is virtually no application down time when using this service.

## High availability
The high availability (HA) model is based on built-in mechanisms to fail over a database to a replica in the case of a node-level interruption.  A node-level interruption could occur because of a hardware failure or in response to a service deployment, a patch to the OS, or a patch to the PostgreSQL engine.

At all times, changes made to a PostgreSQL occur in the context of a transaction and are recorded synchronously in secondary storage or another database replica before the transaction is committed. If a node-level interruption occurs the database server will automatically switch over to a replica running on a different node.  Any active connections are dropped and any inflight transactions will not commit. 

## Application retry logic is essential
It is important that PostgreSQL database applications are built to detect and retry dropped connections and failed transactions. When the application retries, the application's connection it is transparently redirected to the replica which takes over as the primary database. 

Internally in Azure, a gateway is used to redirect the connections to the active replica. Upon an interruption, the switch over to the new replica takes 45 seconds typically. The external connection string remains the same for the client applications, despite which replica is active. 

## Scaling up or down
When an Azure Database for PostgreSQL is scaled up or down, a new server instance with the desired size is created. The existing data storage is detached from the original instance, and attached to the new instance. 

During the scale operation, an interruption to the database connections occurs. The client applications will be disconnected, and open uncommitted transactions will be cancelled. Once the client application retries the connection, or makes a new connection, the gateway directs the connection newly sized instance. The switch over takes 15 seconds typically.

## Next steps
- For an overview of the service, see [Azure Database for PostgreSQL Overview](overview.md)
