---
title: Scheduled maintenance
description: This article describes the scheduled maintenance feature in Azure Database for PostgreSQL - Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
author: varun-dhawan
ms.author: varundhawan
ms.date: 1/4/2024
---

# Scheduled maintenance in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
 
Azure Database for PostgreSQL flexible server performs periodic maintenance to keep your managed database secure, stable, and up-to-date. During maintenance, the server gets new features, updates, and patches.

> [!IMPORTANT]
> Please avoid all server operations (modifications, configuration changes, starting/stopping server) during Azure Database for PostgreSQL flexible server maintenance. Engaging in these activities can lead to unpredictable outcomes, possibly affecting server performance and stability. Wait until maintenance concludes before conducting server operations.

## Select a maintenance window

You can schedule maintenance during a specific day of the week and a time window within that day. Or you can let the system pick a day and a time window time for you automatically. **Maintenance Notifications are sent 5 days in advance**. This ensures ample time to prepare for the scheduled maintenance. The system also lets you know when maintenance is started, and when it's successfully completed.
 
Notifications about upcoming scheduled maintenance can be:
 
* Emailed to a specific address
* Emailed to an Azure Resource Manager Role
* Sent in a text message (SMS) to mobile devices
* Pushed as a notification to an Azure app
* Delivered as a voice message
 
When specifying preferences for the maintenance schedule, you can pick a day of the week and a time window. If you don't specify, the system will pick times between 11pm and 7am in your server's region time. You can define different schedules for each Azure Database for PostgreSQL flexible server instance in your Azure subscription. 
 
> [!IMPORTANT]
> Normally there are at least 30 days between successful scheduled maintenance events for a server.
>
> However, in case of a critical emergency update such as a severe vulnerability, the notification window could be shorter than five days or be omitted. The critical update may be applied to your server even if a successful scheduled maintenance was performed in the last 30 days.

You can update scheduling settings at any time. If there's maintenance scheduled for your Azure Database for PostgreSQL flexible server instance and you update scheduling preferences, the current rollout proceeds as scheduled and the scheduling settings change will become effective upon its successful completion for the next scheduled maintenance.

## System vs custom managed maintenance schedules

You can define system-managed schedule or custom schedule for each Azure Database for PostgreSQL flexible server instance in your Azure subscription.  

* With custom schedule, you can specify your maintenance window for the server by choosing the day of the week and a one-hour time window.  
* With system-managed schedule, the system will pick any one-hour window between 11pm and 7am in your server's region time.  

Updates are first applied to servers with system-managed schedules, followed by those with custom schedules after at least 7 days within a region. To receive early updates for development and test servers, use a system-managed schedule. This allows early testing and issue resolution before updates reach production servers with custom schedules. Updates for custom-schedule servers begin 7 days later during a defined maintenance window. Once notified, updates can't be deferred. Custom schedules are advised for production environments only.

In rare cases, maintenance event can be canceled by the system or may fail to complete successfully. If the update fails, the update is reverted, and the previous version of the binaries is restored. In such failed update scenarios, you may still experience restart of the server during the maintenance window. If the update is canceled or failed, the system creates a notification about canceled or failed maintenance event respectively notifying you. The next attempt to perform maintenance will be scheduled as per your current scheduling settings and you'll receive notification about it 5 days in advance. 

 
## Next steps
 
* Learn how to [change the maintenance schedule](how-to-maintenance-portal.md)
* Learn how to [get notifications about upcoming maintenance](../../service-health/service-notifications.md) using Azure Service Health
* Learn how to [set up alerts about upcoming scheduled maintenance events](../../service-health/resource-health-alert-monitor-guide.md)
