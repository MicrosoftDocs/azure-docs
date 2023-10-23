---
title: How to configure Planned Maintenance
description: Describes how to start or stop an Azure Spring Apps service instance
author: KarlErickson
ms.author: haochuang
ms.service: spring-apps
ms.topic: how-to
ms.date: 10/24/2023
ms.custom: 
---

# Configure Planned Maintenance
Routine maintenance is performed to keep the Azure Spring Apps platform up-to-date and secure. This maintenance can include performance improvements, bug fixes, new features, or security updates. Maintenance can be performed on Azure Spring Apps itself or the underlying operating system. A breaking change or deprecation of functionality is not a part of routine maintenance. Our service quality and uptime guarantees continue to apply during maintenance periods. Maintenance periods are mentioned to help customers get visibility into platform changes. With Planned Mainteanance, it allowes you to specify a fixed day of the week and fixed time window for maintenance.
 
## Maintenance of Azure Spring Apps
Using following steps to configure planned maintenance in Azure Spring Apps:

#### [Azure portal](#tab/Azure-portal)

1. Go to the service **Overview** page and select **Planned Maintenance**.

1. Select **Choose your preferred time** checkbox to configure detailed configuration for maintenance window.

1. Select the day of the week you want to execute the maintenance job.

1. Select start time of upgrade. Maintenance job will be executed during the 8 hour time window.

1. Click **Apply** to submit your configuration for planned maintenance.

Updating the configuration can take a few minutes. You should get a notification when the configuration is complete.

 
## Maintenance Notification

There will be some notificaions and messages sent before and during the maintenance. Following table describe the details:

| Sequence # | Message Type                | Channel             | Time to Send the Message                                 |
| :--------: | --------------------------- | ------------------- | -------------------------------------------------------- |
| 1          | Release Note                | Activity Log        | At the end of release rollout                            |
| 2          | Maintenance Announcement    | Planned Maintenance | Two weeks before the first available maintenance window  |
| 3          | Start of Maintenance Window | Activity Log        | At the start of the execution of the entire maintenance  |
| 4          | Changelog of Components     | Activity Log        | At the end of upgrade for each managed component         |
| 5          | End of Maintenance Window   | Activity Log        | At the end of the execution of the entire maintenance    |
| 6          | Feature Update              | Doc - What's New    | After the new feature becomes available to the customers |
 
## Maintenance Frequency
Currently, Azure Spring Apps performs one regular planned maintenance to upgrade the underlying infrastructure every 3 months. For a detailed maintenance timeline, check the notifications on the Azure Service Health page.
 
## Rules and Limitation of Maintenance
Maintenance operations are optimized to start in given 8 hour maintenance window as statistically that is a better timing for any interruptions and restarts of workloads as there is less stress on the system (in customer applications and transitively also on the platform itself). Maintenance should start from Monday to Sunday, and customers cannot pin the version.
