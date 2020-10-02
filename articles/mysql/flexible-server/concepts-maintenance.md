---
title: Scheduled maintenance - Azure Database for MySQL - Flexible server
description: This article describes the scheduled maintenance feature in Azure Database for MySQL - Flexible server.
author: niklarin
ms.author: nlarin
ms.service: mysql
ms.topic: conceptual
ms.date: 09/21/2020
---

# Scheduled maintenance in Azure Database for MySQL – Flexible server

Azure Database for MySQL - Flexible server performs periodic maintenance to keep your managed database secure, stable, and up-to-date. During maintenance, the server gets new features, updates, and patches.

> [!IMPORTANT]
> Azure Database for MySQL - Flexible server is in preview.

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

You can update scheduling settings at any time. If there is a maintenance scheduled for your Flexible server and you update scheduling preferences, the current event will proceed as scheduled and the scheduling settings change will become effective upon its successful completion.

In rare cases, maintenance event can be canceled by the system or may fail to complete successfully. In this case, the system will create a notification about canceled or failed maintenance event respectively. The next attempt to perform maintenance will be scheduled as per current scheduling settings and you will receive notification about it five days in advance.

## Next steps

* Learn how to [change the maintenance schedule](how-to-maintenance-portal.md)
* Learn how to [get notifications about upcoming maintenance](../../service-health/service-notifications.md) using Azure Service Health
* Learn how to [set up alerts about upcoming scheduled maintenance events](../../service-health/resource-health-alert-monitor-guide.md)
