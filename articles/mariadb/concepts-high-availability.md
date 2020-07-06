---
title: High availability - Azure Database for MariaDB
description: This topic provides information of high availability when using Azure Database for MariaDB
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 3/18/2020
---
# High availability concepts in Azure Database for MariaDB
The Azure Database for MariaDB service provides a guaranteed high level of availability. The financially backed service level agreement (SLA) is 99.99% upon general availability. There is virtually no application down time when using this service.

## High availability
The high availability (HA) model is based on built-in fail-over mechanisms when a node-level interruption occurs. A node-level interruption could occur because of a hardware failure or in response to a service deployment.

At all times, changes made to an Azure Database for MariaDB database server occur in the context of a transaction. Changes are recorded synchronously in Azure storage when the transaction is committed. If a node-level interruption occurs, the database server automatically creates a new node and attaches data storage to the new node. Any active connections are dropped and any inflight transactions are not committed.

## Application retry logic is essential
It is important that MariaDB database applications are built to detect and retry dropped connections and failed transactions. When the application retries, the application's connection is transparently redirected to the newly created instance, which takes over for the failed instance.

Internally in Azure, a gateway is used to redirect the connections to the new instance. Upon an interruption, the entire fail-over process typically takes tens of seconds. Since the redirect is handled internally by the gateway, the external connection string remains the same for the client applications.

## Scaling up or down
Similar to the HA model, when an Azure Database for MariaDB is scaled up or down, a new server instance with the specified size is created. The existing data storage is detached from the original instance, and attached to the new instance.

During the scale operation, an interruption to the database connections occurs. The client applications are disconnected, and open uncommitted transactions are canceled. Once the client application retries the connection, or makes a new connection, the gateway directs the connection to the newly sized instance.

## Next steps
- For an overview of the service, see [Azure Database for MariaDB Overview](overview.md)
