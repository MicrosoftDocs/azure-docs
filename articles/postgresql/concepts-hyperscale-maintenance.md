---
title: Scheduled maintenance - Azure Database for PostgreSQL - Hyperscale (Citus)
description: This article describes the scheduled maintenance feature in Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.topic: conceptual
ms.date: 03/22/2021
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

## Notification about upcoming maintenance

Notifications about upcoming scheduled maintenance are posted to Azure Service
Health and can be:

* Emailed to a specific address
* Emailed to an Azure Resource Manager Role
* Sent in a text message (SMS) to mobile devices
* Pushed as a notification to an Azure app
* Delivered as a voice message

> [!IMPORTANT]
> Normally there are at least 30 days between successful scheduled maintenance
> events for a server group.
>
> However, in case of a critical emergency update such as a severe
> vulnerability, the notification window could be shorter than five days. The
> critical update may be applied to your server even if a successful scheduled
> maintenance was performed in the last 30 days.

If maintenance fails or gets canceled, the system will create a notification.
It will try maintenance again according to current scheduling settings, and
notify you five days before the next maintenance event.

## Next steps

* Learn how to [get notifications about upcoming maintenance](../service-health/service-notifications.md) using Azure Service Health
* Learn how to [set up alerts about upcoming scheduled maintenance events](../service-health/resource-health-alert-monitor-guide.md)
