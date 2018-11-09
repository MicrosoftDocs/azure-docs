---
title: Planned maintenance - Azure SQL Database | Microsoft Docs
description: Learn how to prepare for planned maintenance events to your Azure SQL Database.
services: sql-database
author: aamalvea
manager: craigg
ms.service: sql-database
ms.topic: conceptual
ms.component: manage
ms.date: 11/12/2018
ms.author: aamalvea
ms.reviewer: carlrab
---

# Planning for maintenance on your Azure SQL Database

Learn how to prepare for planned maintenance events on your Azure SQL Database.

## What is a planned maintenance event?
A planned maintenance event is a window of time when your SQL Database experiences a reconfiguration for a maintenance operation. These events are opportunities for applying service upgrades, new features, or patches. 

## Frequency
On average, at least one planned maintenance event occurs each month. Please note maintenance events will be paused during regular business hours from 8am - 5pm local time to minimize impact.

## Resource Health
If your SQL database is experiencing login failures, check the Resource Health blade in the Azure Portal for the current status of your database. The Health History section will contain the downtime reason for each event (when available).

## Retry Logic
Any client production application that connects to a cloud database service should implement a robust connection retry logic with backoff logic, as it would help mitigate these situations and should generally make the errors transparent to the end user.

## Next steps
* Learn more about [Resource Health](sql-database-resource-health.md) for SQL Database
* For more information about retry logic, see [Retry logic for transient errors](sql-database-connectivity-issues.md#retry-logic-for-transient-errors)
