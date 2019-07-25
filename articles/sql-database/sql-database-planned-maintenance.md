---
title: Planning for Azure maintenance events- Azure SQL Database | Microsoft Docs
description: Learn how to prepare for planned maintenance events to your Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: aamalvea
ms.author: aamalvea
ms.reviewer: carlrab
manager: craigg
ms.date: 01/30/2019
---

# Planning for Azure maintenance events in Azure SQL Database

Learn how to prepare for planned maintenance events on your Azure SQL database.

## What is a planned maintenance event

For each database, Azure SQL DB maintains a quorum of database replicas where one replica is the primary. At all times a primary replica must be online servicing, and at least one secondary replica must be healthy. During planned maintenance, members of the database quorum will go offline one at a time, with the intent that there is one responding primary replica and at least one secondary replica online to ensure no client downtime. When the primary replica needs to be brought offline, a reconfiguration/failover process will occur in which one secondary replica will become the new primary.  

## What to expect during a planned maintenance event

Reconfigurations/failovers generally complete within 30 seconds – the average is 8 seconds. If already connected, your application must reconnect to the healthy copy new primary replica of your database. If a new connection is attempted while the database is undergoing a reconfiguration before the new primary replica is online, you get error 40613 (Database Unavailable): “Database '{databasename}' on server '{servername}' is not currently available. Please retry the connection later.”. If your database has a long running query, this query will be interrupted during a reconfiguration and will need to be restarted.

## Retry Logic

Any client production application that connects to a cloud database service should implement a robust connection [retry logic](sql-database-connectivity-issues.md#retry-logic-for-transient-errors). This will help mitigate these situations and should generally make the errors transparent to the end user.

## Frequency

On average, 1.7 planned maintenance events occur each month.

## Resource Health

If your SQL database is experiencing login failures, check the [Resource Health](../service-health/resource-health-overview.md#get-started) window in the [Azure portal](https://portal.azure.com) for the current status. The Health History section contains the downtime reason for each event (when available).


## Next steps

- Learn more about [Resource Health](sql-database-resource-health.md) for SQL Database
- For more information about retry logic, see [Retry logic for transient errors](sql-database-connectivity-issues.md#retry-logic-for-transient-errors)
