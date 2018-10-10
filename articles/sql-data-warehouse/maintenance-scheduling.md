---
title: Azure maintenance schedules (preview) | Microsoft Docs
description: Maintenance scheduling enables customers to plan around the necessary scheduled maintenance events that the Azure SQL Data Warehouse service uses to roll out new features, upgrades, and patches.  
services: sql-data-warehouse
author: antvgski
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: design
ms.date: 09/20/2018
ms.author: anvang
ms.reviewer: igorstan
---

# Use maintenance schedules to manage service updates and maintenance

Azure SQL Data Warehouse maintenance scheduling is now in preview. This feature seamlessly integrates the Service Health Planned Maintenance Notifications, Resource Health Check Monitor, and the Azure SQL Data Warehouse maintenance scheduling service.

You use maintenance scheduling to choose a time window when it's convenient to receive new features, upgrades, and patches. You choose a primary and a secondary maintenance window within a 7-day period. An example is a primary window of Saturday 22:00 to Sunday 01:00 and a secondary window of Wednesday 19:00 to 22:00. If Data Warehouse can't perform maintenance during your primary maintenance window, it will try the maintenance again during your secondary maintenance window.

All newly created Azure SQL Data Warehouse instances will have a system-defined maintenance schedule applied during deployment. The schedule can be edited as soon as deployment is complete.

Each maintenance window can be 3 to 8 hours. Maintenance can occur at any time within the window. You should expect a brief loss of connectivity as the service deploys new code to your data warehouse. 

During the feature preview, you identify your primary and secondary windows within separate day ranges. All maintenance operations should finish within the scheduled maintenance windows. No maintenance will take place outside the specified maintenance windows without prior notification. If your data warehouse is paused during a scheduled maintenance, it will be updated during the resume operation.  


## Alerts and monitoring

Seamless integration with Service Health notifications and the Resource Health Check Monitor allows customers to stay informed of impending maintenance activity. The new automation takes advantage of Azure Monitor. You can decide how you want to be notified of impending maintenance events. You can also decide which automated flows should be triggered to manage downtime and minimize the impact to your operations.

A 24-hour advance notification precedes all  maintenance events. To minimize instance downtime, ensure that there are no long-running transactions on your data warehouse before the start of your chosen maintenance period. When maintenance starts, all active sessions will be canceled. Noncommitted transactions will be rolled back, and your data warehouse will experience a short loss of connectivity. You will be notified immediately after maintenance is finished on your data warehouse. 

If you received an advance notification that maintenance will take place, but Data Warehouse can't perform maintenance during that time, you'll receive a cancellation notification. Maintenance will then resume during the next scheduled maintenance period.
 
All active maintenance events are displayed in the **Service Health - Planned Maintenance** section. A full record of past events is retained as part of Service Health history. You can monitor maintenance via the Azure Service Health check portal dashboard during an active event.

### Maintenance schedule availability

Even if maintenance scheduling is not yet available in your selected region, you can still view and edit your maintenance schedule at any time. When maintenance scheduling becomes available in your region, the identified schedule will immediately become active on your data warehouse.


## Next steps

- [Learn more](viewing-maintenance-schedule.md) about viewing a maintenance schedule. 
- [Learn more](changing-maintenance-schedule.md) about changing a maintenance schedule.
- [Learn more](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitor-alerts-unified-usage) about creating, viewing, and managing alerts by using Azure Monitor.
- [Learn more](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitor-alerts-unified-log-webhook) about webhook actions for log alert rules.
- [Learn more](https://docs.microsoft.com/azure/service-health/service-health-overview) about Azure Service Health.







