---
title: Plan for Azure maintenance events
description: Learn how to prepare for planned maintenance events in Azure SQL Database and Azure SQL Managed Instance.
services: sql-database
ms.service: sql-db-mi
ms.subservice: service
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: aamalvea
ms.author: aamalvea
ms.reviewer: carlrab
ms.date: 08/25/2020
---

# Plan for Azure maintenance events in Azure SQL Database and Azure SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

Learn how to prepare for planned maintenance events on your database in Azure SQL Database and Azure SQL Managed Instance.

## What is a planned maintenance event?

To keep Azure SQL Database and Azure SQL Managed Instance services secure, compliant, stable, and performant, updates are being performed through the service components almost continuously. Thanks to the modern and robust service architecture and innovative technologies like [hot patching](https://aka.ms/azuresqlhotpatching), majority of updates are fully transparent and non-impactful in terms of service availability. Still, few types of updates cause short service interrupts and require special treatment. 

For each database, Azure SQL Database and Azure SQL Managed Instance maintain a quorum of database replicas where one replica is the primary. At all times, a primary replica must be online servicing, and at least one secondary replica must be healthy. During planned maintenance, members of the database quorum will go offline one at a time, with the intent that there is one responding primary replica and at least one secondary replica online to ensure no client downtime. When the primary replica needs to be brought offline, a reconfiguration/failover process will occur in which one secondary replica will become the new primary.  

## What to expect during a planned maintenance event

Maintenance event can produce single or multiple failovers, depending on the constellation of the primary and secondary replicas at the beginning of the maintenance event. On average, 1.7 failovers occur per planned maintenance event. Reconfigurations/failovers generally finish within 30 seconds. The average is 8 seconds. If already connected, your application must reconnect to the new primary replica of your database. If a new connection is attempted while the database is undergoing a reconfiguration before the new primary replica is online, you get error 40613 (Database Unavailable): *"Database '{databasename}' on server '{servername}' is not currently available. Please retry the connection later."* If your database has a long-running query, this query will be interrupted during a reconfiguration and will need to be restarted.

## How to simulate a planned maintenance event

Ensuring that your client application is resilient to maintenance events prior to deploying to production will help mitigate the risk of application faults and will contribute to application availability for your end users. You can test behavior of your client application during planned maintenance events by [initiating manual failover](https://aka.ms/mifailover-techblog) via PowerShell, CLI, or REST API. It will produce identical behavior as maintenance event bringing primary replica offline.

## Retry logic

Any client production application that connects to a cloud database service should implement a robust connection [retry logic](troubleshoot-common-connectivity-issues.md#retry-logic-for-transient-errors). This will help make failovers transparent to the end users, or at least minimize negative effects.

## Resource health

If your database is experiencing log-on failures, check the [Resource Health](../../service-health/resource-health-overview.md#get-started) window in the [Azure portal](https://portal.azure.com) for the current status. The Health History section contains the downtime reason for each event (when available).

## Next steps

- Learn more about [Resource Health](resource-health-to-troubleshoot-connectivity.md) for Azure SQL Database and Azure SQL Managed Instance.
- For more information about retry logic, see [Retry logic for transient errors](troubleshoot-common-connectivity-issues.md#retry-logic-for-transient-errors).
