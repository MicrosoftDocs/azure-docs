---
title: Scheduled maintenance - Azure Database for MySQL - Flexible server
description: This article describes the scheduled maintenance feature in Azure Database for MySQL - Flexible server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: code-sidd
ms.author: sisawant
ms.custom: event-tier1-build-2022
ms.date: 05/24/2022
---

# Scheduled maintenance in Azure Database for MySQL – Flexible server

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL - Flexible server performs periodic maintenance to keep your managed database secure, stable, and up-to-date. During maintenance, the server gets new features, updates, and patches.
> [!IMPORTANT]
> Please avoid all server operations (modifications, configuration changes, starting/stopping server) during Azure Database for MySQL Flexible Server maintenance. Engaging in these activities can lead to unpredictable outcomes, possibly affecting server performance and stability. Wait until maintenance concludes before conducting server operations.

## Select a maintenance window

You can schedule maintenance during a specific day of the week and a time window within that day. Or you can let the system pick a day and a time window time for you automatically. Either way, the system will alert you five days before running any maintenance. The system will also let you know when maintenance is started, and when it is successfully completed.

Notifications about upcoming scheduled maintenance can be:

* Emailed to a specific address
* Emailed to an Azure Resource Manager Role
* Sent in a text message (SMS) to mobile devices
* Pushed as a notification to an Azure app
* Delivered as a voice message

When specifying preferences for the maintenance schedule, you can pick a day of the week and a time window. If you don't specify, the system will pick times between 11pm and 7am in your server's region time. You can define different schedules for each flexible server in your Azure subscription.

> [!IMPORTANT]
> Normally there are at least 30 days between successful scheduled maintenance events for a server.
>
> However, in case of a critical emergency update such as a severe vulnerability, the notification window could be shorter than five days. The critical update may be applied to your server even if a successful scheduled maintenance was performed in the last 30 days.

You can update scheduling settings at any time. If there is a maintenance scheduled for your Flexible server and you update scheduling preferences, the current rollout will proceed as scheduled and the scheduling settings change will become effective upon its successful completion for the next scheduled maintenance.

You can define system-managed schedule or custom schedule for each flexible server in your Azure subscription.
* With custom schedule, you can specify your maintenance window for the server by choosing the day of the week and a one-hour time window.
* With system-managed schedule, the system will pick any one-hour window between 11pm and 7am in your server's region time.

As part of rolling out changes, we apply the updates to the servers configured with system-managed schedule first followed by servers with custom schedule after a minimum gap of 7-days within a given region. If you intend to receive early updates on fleet of development and test environment servers, we recommend you configure system-managed schedule for servers used in development and test environment. This will allow you to receive the latest update first in your Dev/Test environment for testing and evaluation for validation. If you encounter any behavior or breaking changes, you will have time to address them before the same update is rolled out to production servers with custom-managed schedule. The update starts to roll out on custom-schedule flexible servers after 7 days and is applied to your server at the defined maintenance window. At this time, there is no option to defer the update after the notification has been sent. Custom-schedule is recommended for production environments only.

In rare cases, maintenance event can be canceled by the system or may fail to complete successfully. If the update fails, the update will be reverted, and the previous version of the binaries is restored. In such failed update scenarios, you may still experience restart of the server during the maintenance window. If the update is canceled or failed, the system will create a notification about canceled or failed maintenance event respectively notifying you. The next attempt to perform maintenance will be scheduled as per your current scheduling settings and you will receive notification about it five days in advance.

## Next steps

* Learn how to [change the maintenance schedule](how-to-maintenance-portal.md)
* Learn how to [get notifications about upcoming maintenance](../../service-health/service-notifications.md) using Azure Service Health
* Learn how to [set up alerts about upcoming scheduled maintenance events](../../service-health/resource-health-alert-monitor-guide.md)
