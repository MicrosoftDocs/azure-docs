---
title: Scheduled maintenance
description: This article describes the scheduled maintenance feature in Azure Database for MySQL - Flexible Server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: xboxeer
ms.author: yuzheng1
ms.date: 05/24/2022
---

# Scheduled maintenance in Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL flexible server performs periodic maintenance to keep your managed database secure, stable, and up-to-date. During maintenance, the server gets new features, updates, and patches.
> [!IMPORTANT]
> Please avoid all server operations (modifications, configuration changes, starting/stopping server) during Azure Database for MySQL flexible server maintenance. Engaging in these activities can lead to unpredictable outcomes, possibly affecting server performance and stability. Wait until maintenance concludes before conducting server operations.

## Maintenance Cycle

### Routine Maintenance
Our standard maintenance cycle is scheduled no less frequently than every 30 days. This period allows us to ensure system stability and performance while minimizing disruption to your services.

### Critical Maintenance
In certain scenarios, such as the need to deploy urgent security fixes or updates critical to maintaining availability and data integrity, maintenance may be conducted more frequently. These exceptions are made to safeguard your data and ensure the continuous operation of your services.

### Locating Maintenance Details
For specific details about what each maintenance update entails, please refer to our release notes. These notes provide comprehensive information about the updates applied during maintenance, allowing you to understand and prepare for any changes impacting your environment.

>[!NOTE]
> Not all servers will necessarily undergo maintenance during scheduled updates, whether routine or Critical. The Azure MySQL team employs specific criteria to determine which servers require maintenance. This selective approach ensures that maintenance is both efficient and essential, tailored to the unique needs of each server environment, and minimize the downtime of your production. 

## Select a maintenance window

You can schedule maintenance during a specific day of the week and a time window within that day. Or you can let the system pick a day and a time window time for you automatically. Either way, the system will alert you seven days before running any maintenance. The system will also let you know when maintenance is started, and when it is successfully completed.

Notifications about upcoming scheduled maintenance can be:

* Emailed to a specific address
* Emailed to an Azure Resource Manager Role
* Sent in a text message (SMS) to mobile devices
* Pushed as a notification to an Azure app
* Delivered as a voice message

When specifying preferences for the maintenance schedule, you can pick a day of the week and a time window. If you don't specify, the system will pick times between 11pm and 7am in your server's region time. You can define different schedules for each flexible server in your Azure subscription.

You can update scheduling settings at any time. If there is a maintenance scheduled for your Flexible server and you update scheduling preferences, the current rollout will proceed as scheduled and the scheduling settings change will become effective upon its successful completion for the next scheduled maintenance.

You can define system-managed schedule or custom schedule for each flexible server in your Azure subscription.
* With custom schedule, you can specify your maintenance window for the server by choosing the day of the week and a one-hour time window.
* With system-managed schedule, the system will pick any one-hour window between 11pm and 7am in your server's region time.

> [!IMPORTANT]
> Previously, a 7-day deployment gap between system-managed and custom-managed schedules was maintained. Due to evolving maintenance demands and the introduction of the [maintenance reschedule feature (Public preview)](#maintenance-reschedule-public-preview), we can no longer guarantee this 7-day gap.


In rare cases, maintenance event can be canceled by the system or may fail to complete successfully. If the update fails, the update is reverted, and the previous version of the binaries is restored. In such failed update scenarios, you may still experience restart of the server during the maintenance window. If the update is canceled or failed, the system will create a notification about canceled or failed maintenance event respectively notifying you. The next attempt to perform maintenance will be scheduled as per your current scheduling settings and you will receive notification about it 5 days in advance.

## Near zero downtime maintenance (Public preview) ##

Azure Database for MySQL Flexible Server's "Near Zero Downtime Maintenance" feature is a groundbreaking development for **HA (High Availability) enabled servers**. This feature is designed to substantially reduce maintenance downtime, ensuring that in most cases, maintenance downtime is expected to be between 40 to 60 seconds. This capability is pivotal for businesses that demand high availability and minimal interruption in their database operations.

### Precise Downtime Expectations ###
 - **Downtime Duration:** In most cases, the downtime during maintenance ranges from 10 to 30 seconds.
 - **Additional Considerations:** After a failover event, there's an inherent DNS Time-To-Live (TTL) period of approximately 30 seconds. This period isn't directly controlled by the maintenance process but is a standard part of DNS behavior. So, from a customer's perspective, the total downtime experienced during maintenance could be in the range of 40 to 60 seconds.

### Limitations and Prerequisites ###
To achieve the optimal performance promised by this feature, certain conditions and limitations should be noted:

 - **Primary Keys in All Tables:** Ensuring that every table has a primary key is critical. Lack of primary keys can significantly increase replication lag, impacting the downtime.
 - **Low Workload During Maintenance Times:** Maintenance periods should coincide with times of low workload on the server to ensure the downtime remains minimal. We encourage you to use the [custom maintenance window](how-to-maintenance-portal.md#specify-maintenance-schedule-options) feature to schedule maintenance during off-peak hours.

## Maintenance reschedule (Public preview)

> [!IMPORTANT]
> The maintenance reschedule feature is currently in preview. It is subject to limitations and ongoing development. We value your feedback to help enhance this feature. Please note that this feature is not available for servers using the burstable SKU.

The **maintenance reschedule** feature grants you greater control over the timing of maintenance activities on your Azure Database for MySQL flexible server instance. After receiving a maintenance notification, you can reschedule it to a more convenient time, irrespective of whether it was system or custom managed.

### Reschedule parameters and notifications

Rescheduling isn't confined to fixed time slots; it depends on the earliest and latest permissible times in the current maintenance cycle. Upon rescheduling, a notification will be sent out to confirm the changes, following the standard notification policies.

### Considerations and limitations

Be aware of the following when using this feature:

- **Demand Constraints:** Your rescheduled maintenance might be canceled due to a high number of maintenance activities occurring simultaneously in the same region.
- **Lock-in Period:** Rescheduling is unavailable 15 minutes prior to the initially scheduled maintenance time to maintain the reliability of the service.

There's no limitation on how many times a maintenance can be rescheduled, as long as the maintenance hasn't entered into the "In preparation" state, you can always reschedule your maintenance to another time.

> [!NOTE]
> We recommend monitoring notifications closely during the preview stage to accommodate potential adjustments.

Use this feature to avoid disruptions during critical database operations. We encourage your feedback as we continue to develop this functionality.


## Next steps

* Learn how to [change the maintenance schedule](how-to-maintenance-portal.md)
* Learn how to [get notifications about upcoming maintenance](../../service-health/service-notifications.md) using Azure Service Health
* Learn how to [set up alerts about upcoming scheduled maintenance events](../../service-health/resource-health-alert-monitor-guide.md)
