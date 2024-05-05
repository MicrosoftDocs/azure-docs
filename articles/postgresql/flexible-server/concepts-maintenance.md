---
title: Scheduled maintenance in Azure Database for PostgreSQL - Flexible Server
description: This article describes the scheduled maintenance feature in Azure Database for PostgreSQL - Flexible Server.
author: varun-dhawan
ms.author: varundhawan
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Scheduled maintenance in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL flexible server performs periodic maintenance to help keep your managed database secure, stable, and up to date. During maintenance, the server gets new features, updates, and patches.

> [!IMPORTANT]
> Avoid all server operations (modifications, configuration changes, starting/stopping the server) during Azure Database for PostgreSQL flexible server maintenance. Engaging in these activities can lead to unpredictable outcomes and possibly affect server performance and stability. Wait until maintenance concludes before you conduct server operations.

## Select a maintenance window

You can schedule maintenance during a specific day of the week and a time window within that day. Or you can let the system choose a day and a time window for you automatically.

The system sends maintenance notifications 5 days in advance so that you have ample time to prepare. The system also lets you know when maintenance starts and when it successfully finishes.

Notifications about upcoming scheduled maintenance can be:

* Emailed to a specific address.
* Emailed to an Azure Resource Manager role.
* Sent in a text message to mobile devices.
* Pushed as a notification to an Azure app.
* Delivered as a voice message.

When you're specifying preferences for the maintenance schedule, you can choose a day of the week and a time window. If you don't specify a time window, the system chooses times between 11:00 PM and 7:00 AM in your server region's time. You can define different schedules for each Azure Database for PostgreSQL flexible server instance in your Azure subscription.

> [!IMPORTANT]
> Normally, the interval between successful scheduled maintenance events for a server is at least 30 days. But for a critical emergency update such as a severe vulnerability, the notification window could be shorter than 5 days or be omitted. The critical update might be applied to your server even if the system successfully performed scheduled maintenance in the last 30 days.

You can update schedule settings at any time. If maintenance is scheduled for your Azure Database for PostgreSQL flexible server instance and you update schedule preferences, the current rollout proceeds as scheduled. The changes to schedule settings become effective upon successful completion of the next scheduled maintenance.

## System-managed vs. custom maintenance schedules

You can define a system-managed schedule or a custom schedule for each Azure Database for PostgreSQL flexible server instance in your Azure subscription:  

* With a system-managed schedule, the system chooses any 1-hour window between 11:00 PM and 7:00 AM in your server region's time.
* With a custom schedule, you can specify your maintenance window for the server by choosing the day of the week and a 1-hour time window.

Updates are first applied to servers with system-managed schedules, followed by servers with custom schedules after at least 7 days within a region. To receive early updates for development and test servers, use a system-managed schedule. This choice allows early testing and issue resolution before updates reach production servers with custom schedules.

Updates for custom-schedule servers begin 7 days later, during a defined maintenance window. After you're notified, you can't defer updates. We advise that you use custom schedules for production environments only.

In rare cases, maintenance events can be canceled by the system or fail to finish successfully. If an update fails, it's reverted, and the previous version of the binaries is restored. The server might still restart during the maintenance window.

If an update is canceled or failed, the system creates a notification about the canceled or failed maintenance event. The next attempt to perform maintenance is scheduled according to your current schedule settings, and you receive a notification about it 5 days in advance.

## Next steps

* Learn how to [change the maintenance schedule](how-to-maintenance-portal.md).
* Learn how to [get notifications about upcoming maintenance](../../service-health/service-notifications.md) by using Azure Service Health.
* Learn how to [set up alerts for upcoming scheduled maintenance events](../../service-health/resource-health-alert-monitor-guide.md).
