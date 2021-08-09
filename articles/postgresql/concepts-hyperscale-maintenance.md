---
title: Scheduled maintenance - Azure Database for PostgreSQL - Hyperscale (Citus)
description: This article describes the scheduled maintenance feature in Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 04/07/2021
---

# Scheduled maintenance in Azure Database for PostgreSQL – Hyperscale (Citus)

Azure Database for PostgreSQL - Hyperscale (Citus) does periodic maintenance to
keep your managed database secure, stable, and up-to-date.  During maintenance,
all nodes in the server group get new features, updates, and patches.

The key features of scheduled maintenance for Hyperscale (Citus) are:

* Updates are applied at the same time on all nodes in the server group
* Notifications about upcoming maintenance are posted to Azure Service Health
  five days in advance
* Usually there are at least 30 days between successful maintenance events for
  a server group
* Preferred day of the week and time window within that day for maintenance
  start can be defined for each server group individually

## Selecting a maintenance window and notification about upcoming maintenance

You can schedule maintenance during a specific day of the week and a time
window within that day. Or you can let the system pick a day and a time window
for you automatically. Either way, the system will alert you five days before
running any maintenance. The system will also let you know when maintenance is
started, and when it's successfully completed.

Notifications about upcoming scheduled maintenance are posted to Azure Service
Health and can be:

* Emailed to a specific address
* Emailed to an Azure Resource Manager Role
* Sent in a text message (SMS) to mobile devices
* Pushed as a notification to an Azure app
* Delivered as a voice message

When specifying preferences for the maintenance schedule, you can pick a day of
the week and a time window. If you don't specify, the system will pick times
between 11pm and 7am in your server group's region time. You can define
different schedules for each Hyperscale (Citus) server group in your Azure
subscription.

> [!IMPORTANT]
> Normally there are at least 30 days between successful scheduled maintenance
> events for a server group.
>
> However, in case of a critical emergency update such as a severe
> vulnerability, the notification window could be shorter than five days. The
> critical update may be applied to your server even if a successful scheduled
> maintenance was performed in the last 30 days.

You can update scheduling settings at any time. If there's maintenance
scheduled for your Hyperscale (Citus) server group and you update the schedule,
existing events will continue as originally scheduled. The settings change will
take effect after successful completion of existing events.

If maintenance fails or gets canceled, the system will create a notification.
It will try maintenance again according to current scheduling settings, and
notify you five days before the next maintenance event.

## Next steps

* Learn how to [change the maintenance schedule](howto-hyperscale-maintenance.md)
* Learn how to [get notifications about upcoming maintenance](../service-health/service-notifications.md) using Azure Service Health
* Learn how to [set up alerts about upcoming scheduled maintenance events](../service-health/resource-health-alert-monitor-guide.md)
