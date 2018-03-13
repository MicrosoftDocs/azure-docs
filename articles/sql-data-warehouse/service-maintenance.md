---
title: 'Planned maintenance for Azure SQL Data Warehouse | Microsoft Docs'
description: Learn how to prepare for planned maintenance events to your Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: ''
author: antvgski
manager: jhubbard
editor: ''

ms.service: sql-data-warehouse
ms.custom: mvc,DBs & servers
ms.workload: "Active"
ms.tgt_pltfrm: portal
ms.devlang: na
ms.topic: concepts
ms.date: 03/12/2018
ms.author: anvang

---
# Planning for maintenance on your Azure SQL data warehouse

Learn how to prepare for planned maintenance events on your Azure SQL data warehouse.

## What is a planned maintenance event?
A planned maintenance event is a window of time when your data warehouse needs to be offline for a maintenance operation. This event is an opportunity for applying service upgrades, new features, or patches. 

## Frequency
On average, at least one planned maintenance event occurs each month. 

## Notifications and downtime
You will receive a notification before each planned maintenance event. The maintenance event cancels all running queries and takes your data warehouse offline. The expected downtime for each data warehouse is approximately 30 minutes. You can expect a notification when maintenance is complete. 

## Setting up alerts

We recommend using [Azure Monitor](../monitoring-and-diagnostics/monitoring-activity-log-alerts-on-service-notifications.md) to set up planned maintenance log alerts. The alerts can help you plan for the required maintenance to minimize the impact to your business. 

To set up notifications, use these [log alert instructions](../monitoring-and-diagnostics/monitoring-activity-log-alerts-on-service-notifications.md). 

## Next steps
For more information about monitoring, see [Monitor your workload](sql-data-warehouse-manage-monitor.md).
