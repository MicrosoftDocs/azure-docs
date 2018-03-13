---
title: 'Planned maintenance for Azure SQL Data Warehouse | Microsoft Docs'
description: Learn how to prepare for planned maintenance events to your Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: ''
author: barbkess
manager: jhubbard
editor: ''

ms.service: sql-data-warehouse
ms.custom: mvc,DBs & servers
ms.workload: "Active"
ms.tgt_pltfrm: portal
ms.devlang: na
ms.topic: concepts
ms.date: 03/12/2018
ms.author: barbkess

---
# Planning for maintenance on your Azure SQL data warehouse

Learn how to prepare for planned maintenance events on your Azure SQL data warehouse.

## What is a planned maintenance event?
A planned maintenance event is a window of time when we need to take your data warehouse offline to perform a maintenance operation. We use this opportunity to apply service upgrades, new features, or patches. 

## Frequency
On average, at least one planned maintenance event occurs each month. 

## Notifications
We send you a notification before each planned maintenance event. When the maintenance occurs, we cancel all running queries and take your data warehouse offline. The expected downtime for each data warehouse is approximately 30 minutes. You can expect a notification when maintenance is complete. 

## Setting up alerts

We recommend using [Azure Monitor](../monitoring-and-diagnostics/monitoring-activity-log-alerts-on-service-notifications.md) to set up planned maintenance log alerts. The alerts can help you plan for the required maintenance to minimize the impact to your business. 

To set up notifications, use these [log alert instructions](../monitoring-and-diagnostics/monitoring-activity-log-alerts-on-service-notifications.md). 

## Next steps
To learn more about monitoring your data warehouse, see [Monitor your workload](sql-data-warehouse-manage-monitor.md).
