---
title: Azure Database for PostgreSQL - Flexible Server - Scheduled maintenance - Azure portal
description: Learn how to configure scheduled maintenance settings for an Azure Database for PostgreSQL - Flexible Server from the Azure portal.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.author: gennadyk
author: GennadNY
ms.reviewer: 
ms.date: 11/30/2021
---

# Manage scheduled maintenance settings for Azure Database for PostgreSQL – Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
 
You can specify maintenance options for each flexible server in your Azure subscription. Options include the maintenance schedule and notification settings for upcoming and finished maintenance events.

## Prerequisites

To complete this how-to guide, you need:
- An [Azure Database for PostgreSQL - Flexible Server](quickstart-create-server-portal.md)
 
## Specify maintenance schedule options
 
1. On the PostgreSQL server page, under the **Settings** heading, choose **Maintenance** to open scheduled maintenance options.
2. The default (system-managed) schedule is a random day of the week, and 60-minute window for maintenance start between 11pm and 7am local server time. If you want to customize this schedule, choose **Custom schedule**. You can then select a preferred day of the week, and a 60-minute window for maintenance start time.
 
## Notifications about scheduled maintenance events
 
You can use Azure Service Health to [view notifications](../../service-health/service-notifications.md) about upcoming and performed scheduled maintenance on your flexible server. You can also [set up](../../service-health/resource-health-alert-monitor-guide.md) alerts in Azure Service Health to get notifications about maintenance events.
 
## Next steps  
 
* Learn about [scheduled maintenance in Azure Database for PostgreSQL – Flexible Server](concepts-maintenance.md)
* Lean about [Azure Service Health](../../service-health/overview.md)
