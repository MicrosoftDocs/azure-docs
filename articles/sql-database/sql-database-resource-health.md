---
title: Use Azure Resource Health to monitor SQL Database health | Microsoft Docs
description: Use the Azure portal to create SQL Database alerts, which can trigger notifications or automation when the conditions you specify are met.
services: sql-database
ms.service: sql-database
ms.subservice: monitoring
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: aamalvea
ms.author: aamalvea
ms.reviewer: carlrab
manager: craigg
ms.date: 11/05/2018
---
# Use Azure portal to create alerts for Azure SQL Database and Data Warehouse

## Overview
Resource health for SQL Database helps you diagnose and get support when an Azure issue impacts your SQL resources. It informs you about the current and past health of your resources and helps you mitigate issues. Resource health provides technical support when you need help with Azure service issues.

![Overview](../media/sql-database-resource-health/sql-resource-health-overview.jpg)

## Health Checks
SQL Database determines the health of your resource by examining the success and failure of logins to the resource. Currently, Resource Health for your SQL DB resource only examines failures caused by SQL (or the system) and not by the user.

## Health States

### Available
A status of Available means that Resource Health has not detected logins failures to the database.

![Available](../media/sql-database-resource-health/sql-resource-health-available.jpg)

### Degraded
A status of Degraded means that Resource Health has detected a majority of successful logins, but some failures as well. These are most likely transient login errors. To reduce the impact of connection issues caused by future reconfigurations, please implement retry logic in your code

### Unavailable
A status of Unavailable means that Resource Health has detected consistent login failures on your SQL Resource.

### Unknown
The health status of Unknown indicates that Resource Health hasn't received information about this resource for more than 10 minutes. Although this status isn't a definitive indication of the state of the resource, it is an important data point in the troubleshooting process.
If the resource is running as expected, the status of the resource will change to Available after a few minutes.
If you're experiencing problems with the resource, the Unknown health status might suggest that an event in the platform is affecting the resource.

## Historical Information
You can access up to 14 days of health history in the Health history section of Resource Health.

### Downtime Reasons
When your SQL Database experiences downtime, analysis is performed to determine an reason. When available, the downtime reason is reported in the Health History section of Resource Health.

#### Planned Maintenance
The Azure infrastructure periodically performs planned maintenance – upgrade of hardware or software components in the datacenter. While the database undergoes maintenance, SQL may terminate some existing connections and refuse new ones.

#### Planned Reconfiguration
Due to changes in the datacenter, we needed to move your database.

#### Unplanned Failure
Azure SQL DB encountered a failure and needed to failover your database to recover.

## Resource Health Alerts

## Next Steps
