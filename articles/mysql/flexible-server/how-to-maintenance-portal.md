---
title: Azure Database for MySQL - Flexible Server - Scheduled maintenance - Azure portal
description: Learn how to configure scheduled maintenance settings for an Azure Database for MySQL - Flexible server from the Azure portal.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
author: code-sidd
ms.author: sisawant
ms.date: 9/21/2020
---

# Manage scheduled maintenance settings for Azure Database for MySQL – Flexible server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]


You can specify maintenance options for each Flexible server in your Azure subscription. Options include the maintenance schedule and notification settings for upcoming and finished maintenance events.

## Prerequisites

To complete this how-to guide, you need:

- An [Azure Database for MySQL - Flexible server](quickstart-create-server-portal.md)

## Specify maintenance schedule options

1. On the MySQL server page, under the **Settings** heading, choose **Maintenance** to open scheduled maintenance options.
2. The default (system-managed) schedule is a random day of the week, and 60-minute window for maintenance start between 11pm and 7am local server time. If you want to customize this schedule, choose **Custom schedule**. You can then select a preferred day of the week, and a 60-minute window for maintenance start time.

## Notifications about scheduled maintenance events

You can use Azure Service Health to [view notifications](../../service-health/service-notifications.md) about upcoming and performed scheduled maintenance on your Flexible server. You can also [set up](../../service-health/resource-health-alert-monitor-guide.md) alerts in Azure Service Health to get notifications about maintenance events.

## Next steps

* Learn about [scheduled maintenance in Azure Database for MySQL – Flexible server](concepts-maintenance.md)
* Lean about [Azure Service Health](../../service-health/overview.md)
