---
title: Azure Database for MySQL - Flexible Server - Scheduled maintenance - Azure portal
description: Learn how to configure scheduled maintenance settings for an Azure Database for MySQL - Flexible server from the Azure portal.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
author: xboxeer
ms.author: yuzheng1
ms.reviewer: sunaray
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

## Reschedule Maintenance (Public Preview)

1. In the Maintenance window, you'll notice a new button labeled Reschedule.
2. Upon clicking **Reschedule**, a "Maintenance Reschedule" window appears where you can select a new date and time for the scheduled maintenance activity.
3. After selecting your preferred date and time, select **Reschedule** to confirm your choice.
4. You also have an option for on-demand maintenance by clicking **Reschedule to Now**. A confirmation dialog appears to verify that you understand the potential effect, including possible server downtime.

Rescheduling maintenance also triggers email notifications to keep you informed.

The availability of the rescheduling window isn't fixed, it often depends on the size of the overall maintenance window for the region in which your server resides. This means the reschedule options can vary based on regional operations and workload.

> [!NOTE]  
> Maintenance Reschedule is only available for General Purpose and Business Critical service tiers.

### Considerations and limitations

Be aware of the following when using this feature:

- **Demand Constraints:** Your rescheduled maintenance might be canceled due to a high number of maintenance activities occurring simultaneously in the same region.
- **Lock-in Period:** Rescheduling is unavailable 15 minutes prior to the initially scheduled maintenance time to maintain the reliability of the service.

## Notifications about scheduled maintenance events

You can use Azure Service Health to [view notifications](../../service-health/service-notifications.md) about upcoming and performed scheduled maintenance on your Flexible server. You can also [set up](../../service-health/resource-health-alert-monitor-guide.md) alerts in Azure Service Health to get notifications about maintenance events.

## Next steps

* Learn about [scheduled maintenance in Azure Database for MySQL – Flexible server](concepts-maintenance.md)
* Lean about [Azure Service Health](../../service-health/overview.md)
