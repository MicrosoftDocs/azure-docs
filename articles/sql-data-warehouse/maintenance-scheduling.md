---
title: Azure maintenance schedules (preview) | Microsoft Docs
description: Maintenance scheduling enables customers to plan around the necessary scheduled maintenance events that the Azure SQL Data Warehouse service uses to roll out new features, upgrades, and patches.  
services: sql-data-warehouse
author: antvgski
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: design
ms.date: 03/13/2019
ms.author: anvang
ms.reviewer: jrasnick
---

# Use maintenance schedules to manage service updates and maintenance

Maintenance schedules are now available in all Azure SQL Data Warehouse regions. This feature integrates the Service Health Planned Maintenance Notifications, Resource Health Check Monitor, and the Azure SQL Data Warehouse maintenance scheduling service.

You use maintenance scheduling to choose a time window when it's convenient to receive new features, upgrades, and patches. You choose a primary and a secondary maintenance window within a seven-day period. An example is a primary window of Saturday 22:00 to Sunday 01:00 and a secondary window of Wednesday 19:00 to 22:00. If SQL Data Warehouse can't perform maintenance during your primary maintenance window, it will try the maintenance again during your secondary maintenance window. Service maintenance could occur during both the Primary and the Secondary windows. To ensure rapid completion of all maintenance operations, DW400(c) and lower data warehouse tiers could complete maintenance outside of a designated maintenance window.

All newly created Azure SQL Data Warehouse instances will have a system-defined maintenance schedule applied during deployment. The schedule can be edited as soon as deployment is complete.

Each maintenance window can be three to eight hours. Maintenance can occur at any time within the window. You should expect a brief loss of connectivity as the service deploys new code to your data warehouse.

To use this feature you will need to identify a primary and secondary window within separate day ranges. All maintenance operations should finish within the scheduled maintenance windows. No maintenance will take place outside the specified maintenance windows without prior notification. If your data warehouse is paused during a scheduled maintenance, it will be updated during the resume operation.  

## Alerts and monitoring

Integration with Service Health notifications and the Resource Health Check Monitor allows customers to stay informed of impending maintenance activity. The new automation takes advantage of Azure Monitor. You can decide how you want to be notified of impending maintenance events. Also decide which automated flows can help you manage downtime and minimize the impact to your operations.

A 24-hour advance notification precedes all  maintenance events, with the current exception of DW400c and lower tiers. To minimize instance downtime, make sure that your data warehouse has no long-running transactions before your chosen maintenance period. When maintenance starts, all active sessions will be canceled. Non-committed transactions will be rolled back, and your data warehouse will experience a short loss of connectivity. You'll be notified immediately after maintenance is finished on your data warehouse.

> [!NOTE]
> In the event we are required to deploy a time critical update, advanced notification times may be significantly reduced.

If you received an advance notification that maintenance will take place, but SQL Data Warehouse can't perform maintenance during that time, you'll receive a cancellation notification. Maintenance will then resume during the next scheduled maintenance period.

All active maintenance events appear in the **Service Health - Planned Maintenance** section. The Service Health history includes a full record of past events. You can monitor maintenance via the Azure Service Health check portal dashboard during an active event.

### Maintenance schedule availability

Even if maintenance scheduling isn't available in your selected region, you can view and edit your maintenance schedule at any time. When maintenance scheduling becomes available in your region, the identified schedule will immediately become active on your data warehouse.

## Next steps

- [Learn more](viewing-maintenance-schedule.md) about viewing a maintenance schedule.
- [Learn more](changing-maintenance-schedule.md) about changing a maintenance schedule.
- [Learn more](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitor-alerts-unified-usage) about creating, viewing, and managing alerts by using Azure Monitor.
- [Learn more](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitor-alerts-unified-log-webhook) about webhook actions for log alert rules.
- [Learn more](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-action-groups) Creating and managing Action Groups.
- [Learn more](https://docs.microsoft.com/azure/service-health/service-health-overview) about Azure Service Health.
