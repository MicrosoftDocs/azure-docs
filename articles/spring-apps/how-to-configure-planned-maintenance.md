---
title: How to configure Planned Maintenance
description: Describes how to configure planned maintenance for Azure Spring Apps
author: KarlErickson
ms.author: haochuang
ms.service: spring-apps
ms.topic: how-to
ms.date: 10/24/2023
ms.custom: 
---

# Configure Planned Maintenance

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ✔️ Enterprise

Routine maintenance is performed to keep the Azure Spring Apps platform up-to-date and secure. This maintenance can include performance improvements, bug fixes, new features, or security updates. Maintenance can be performed on Azure Spring Apps itself or the underlying operating system. A breaking change or deprecation of functionality is not a part of routine maintenance. Our service quality and uptime guarantees continue to apply during maintenance periods. Maintenance periods are mentioned to help customers get visibility into platform changes. With Planned Mainteanance, it allowes you to specify a fixed day of the week and fixed time window for maintenance.

## Maintenance of Azure Spring Apps

Using following steps to configure planned maintenance in Azure Spring Apps:

### [Azure portal](#tab/Azure-portal)

1. Go to the service **Overview** page and select **Planned Maintenance**.

    :::image type="content" source="media/how-to-configure-planned-maintenance/maintenance-blade.png" alt-text="Screenshot of Azure portal showing the Azure Spring Apps balde page with Planned Maintenance highlighted.":::

1. Select **Choose your preferred time** checkbox to configure detailed configuration for maintenance window.

    :::image type="content" source="media/how-to-configure-planned-maintenance/maintenance-toggle.png" alt-text="Screenshot of Azure portal showing the toggle of planned maintenance highlighted.":::

1. Select the day of the week you want to execute the maintenance job.

    :::image type="content" source="media/how-to-configure-planned-maintenance/maintenance-week.png" alt-text="Screenshot of Azure portal showing the day of week of planned maintenance highlighted.":::

1. Select start time of upgrade.

    :::image type="content" source="media/how-to-configure-planned-maintenance/maintenance-time.png" alt-text="Screenshot of Azure portal showing the start time of upgrade of planned maintenance highlighted.":::

1. Click **Apply** to submit your configuration for planned maintenance.

Updating the configuration can take a few minutes. You should get a notification when the configuration is complete.

## Maintenance Notification

There will be some notificaions and messages sent before and during the maintenance. Following table describe the details:

| Sequence No | Message Type                | Channel             | Time to Send the Message                                 |
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

### Rules

- Maintenance should start from Monday to Sunday. If two clusters are in the same region, cluster A is set to Monday and cluster B is set to Sunday, then cluster A will be maintenanced earlier than cluster B.
- Time window for the planned maintenance is 8 hours. E.g. customer sets the start time to 10:00, then maintenance job will be executed at any time between 10:00 - 18:00.

### Limitations

- Customers cannot pin the version to prevent the maitenance job to be executed. If customer has any import event during maintenance window, please contact Azure Spring Apps CSS for help.
