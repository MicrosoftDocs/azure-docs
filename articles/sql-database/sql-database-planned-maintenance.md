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
ms.date: 12/12/2018
---

# Planning for Azure maintenance events in Azure SQL Database

Learn how to prepare for planned maintenance events on your Azure SQL database.

## What is a planned maintenance event

The Azure infrastructure periodically performs planned maintenance – upgrade of hardware or software components in the data center. While the database undergoes maintenance, SQL may terminate some existing connections and refuse new ones. The login failures experienced during planned maintenance are typically transient and [retry logic](sql-database-connectivity-issues.md#retry-logic-for-transient-errors) helps reduce the impact. If you continue to experience login errors, please contact support.

## Frequency

On average, at least one planned maintenance event occurs each month. Please note maintenance events will be paused during regular business hours from 8am - 5pm local time to minimize impact.

## Resource Health

If your SQL database is experiencing login failures, check the Resource Health blade in the [Azure portal](https://portal.azure.com) for the current status of your database. The Health History section contains the downtime reason for each event (when available).

## Retry logic

Any client production application that connects to a cloud database service should implement a robust connection [retry logic](sql-database-connectivity-issues.md#retry-logic-for-transient-errors), as it would help mitigate these situations and should generally make the errors transparent to the end user.

## Next steps

- Learn more about [Resource Health](sql-database-resource-health.md) for SQL Database
- For more information about retry logic, see [Retry logic for transient errors](sql-database-connectivity-issues.md#retry-logic-for-transient-errors)