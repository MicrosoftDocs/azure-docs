---
title: Azure Maintenance schedules (Preview) | Microsoft Docs
description: Maintenance scheduling allows customers to plan around the necessary scheduled maintenance events the Azure SQL Data warehouse service uses to roll out new features, upgrades and patches.  
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

# Using maintenance schedules to manage service updates and maintenance

Azure SQL Data Warehouse Maintenance Scheduling is now in preview. This new feature seamlessly integrates the Service Health Planned Maintenance Notifications, Resource Health Check Monitor, and the Azure SQL Data Warehouse maintenance scheduling service.

Maintenance scheduling lets you schedule a time window when it is convenient to receive new features, upgrades, and patches. Customers will select a Primary and a Secondary maintenance window within a 7-day period, i.e. Saturday 22:00 – Sunday 01:00 (Primary) and Wednesday 19:00 – 22:00 (Secondary). If we are unable to perform maintenance during your Primary maintenance window, we will attempt it again during your Secondary maintenance window.

All newly created Azure SQL Data Warehouse instances will have a system-defined maintenance schedule applied during deployment. The schedule can be edited as soon as deployment is complete.

Each maintenance window can be between 3 and 8 hours each, with 3hrs currently being the shortest available option. Maintenance can occur at any time within the window and you should expect a brief loss of connectivity as the service deploys new code to your data warehouse. 

During the feature preview, we are asking customers to identify their Primary and Secondary windows within separate day ranges.   
All maintenance operations should be completed within the scheduled maintenance windows and no maintenance will take place outside of the specified maintenance windows without prior notification. If your data warehouse is paused during a scheduled maintenance, it will be updated during the resume operation.  


## Alerts and monitoring

Seamless integration with Service health notifications and the Resource health check monitor allows customers to stay informed of impending maintenance activity. The new automation takes advantage of the Azure Monitor and allows customers to determine how they wish to be notified of impending maintenance events and which automated flows should be triggered to manage downtime and minimize the impact to their operations.

All maintenance events are preceded by a 24 hr advance notification. To minimize instance downtime, you should ensure there are no long-running transactions on your data warehouse prior to the start of your chosen maintenance period. When maintenance starts all active sessions will be canceled, non-committed transactions will be rolled back, and your data warehouse will experience a short loss of connectivity. You will be notified immediately after maintenance has been completed on your data warehouse. 

If you received an advance notification that maintenance will take place, but we are unable to perform maintenance during that time, you will receive a cancellation notification. Maintenance will then resume during the next scheduled maintenance period.
 
All active maintenance events will be displayed in the 'Service Health - Planned Maintenance' section. A full record of past events will be retained as part of Service Health history. Maintenance can be monitored via the Azure Service Health check portal dashboard during an active event.

### Maintenance Schedule availability

Even if Maintenance Scheduling is not yet available in your selected region, you can still view and edit your maintenance schedule at any time. When Maintenance Scheduling becomes available in your region, the Schedule identified will immediately become active on your data warehouse.


## Next steps

- [Learn more](viewing-maintenance-schedule.md) about viewing a maintenance Schedule 
- [Learn more](changing-maintenance-schedule.md) about changing a maintenance schedule
- [Learn more](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitor-alerts-unified-usage) about creating, viewing, and managing alerts using Azure Monitor
- [Learn more](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitor-alerts-unified-log-webhook) about Webhook actions for log alert rules
- [Learn more](https://docs.microsoft.com/azure/service-health/service-health-overview) about Azure Service Health







