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

Routine maintenance is performed to keep the Azure Spring Apps platform up-to-date and secure. The maintenance, also called auto patching, can include security updates, bug fixes, new features, or performance improvements. Auto patching can be performed on components managed by Azure Spring Apps to support your Java applications, including JDK, APM, base OS image, managed middleware and runtime infrastructure. For the maintenance to take effect, your applications will be restarted within the maintenance window you specify, but our service quality and uptime guarantees continue to apply during maintenance windows. With planned maintenance, you can specify such maintenance window with a day of week and an 8-hour time window for maintenance, to minimize any risks that you may concern.

## Maintenance of Azure Spring Apps

Using following steps to configure planned maintenance in Azure Spring Apps:

### [Azure portal](#tab/Azure-portal)

1. Go to the service **Overview** page and select **Planned Maintenance**.

    :::image type="content" source="media/how-to-configure-planned-maintenance/maintenance-blade.png" alt-text="Screenshot of Azure portal showing the Azure Spring Apps blade page with Planned Maintenance highlighted.":::

1. Select **Choose your preferred time** checkbox to configure detailed configuration for maintenance window.

    :::image type="content" source="media/how-to-configure-planned-maintenance/maintenance-toggle.png" alt-text="Screenshot of Azure portal showing the toggle of planned maintenance highlighted.":::

1. Select the day of the week you want to execute the maintenance job.

    :::image type="content" source="media/how-to-configure-planned-maintenance/maintenance-week.png" alt-text="Screenshot of Azure portal showing the day of week of planned maintenance highlighted.":::

1. Select start time of upgrade.

    :::image type="content" source="media/how-to-configure-planned-maintenance/maintenance-time.png" alt-text="Screenshot of Azure portal showing the start time of upgrade of planned maintenance highlighted.":::

1. Click **Apply** to submit your configuration for planned maintenance.

### [Azure CLI](#tab/azure-cli)

Use the following command to configure planned maintenance:

```azurecli
az spring update -g $RG -n $NAME \
    --enable-planned-maintenance \
    --planned-maintenance-day $DAY_OF_WEEK \
    --planned-maintenance-start-hour $START_HOUR
```

Updating the configuration can take a few minutes. You should get a notification when the configuration is complete.

>>> Note: If planned maintenance is not configured, the maintenance will happen at a time chosen by our service team, with the best effort to minimize business risks for most customers.

## Maintenance Notification

There will be some notifications and messages sent before and during the maintenance. Following table describe the details:

| Sequence No | Message Type                | Channel             | Time to Send the Message                                 |
| :--------: | --------------------------- | ------------------- | -------------------------------------------------------- |
| 1          | Release Note                | Activity Log        | At the end of release rollout                            |
| 2          | Maintenance Announcement    | Planned Maintenance | Two weeks before the first available maintenance window  |
| 3          | Start of Maintenance Window | Activity Log        | At the start of the execution of the entire maintenance  |
| 4          | Changelog of Components     | Activity Log        | At the end of upgrade for each managed component         |
| 5          | End of Maintenance Window   | Activity Log        | At the end of the execution of the entire maintenance    |
| 6          | Feature Update              | Doc - What's New    | After the new feature becomes available to the customers |

## Maintenance Frequency

Currently, Azure Spring Apps performs one regular planned maintenance to upgrade the underlying infrastructure every three months. For a detailed maintenance timeline, check the notifications on the Azure Service Health page.

## Rules and Limitation of Maintenance

### Rules

- When you configure planned maintenance for multiple service instances in the same region, it is guaranteed that the maintenance events happen within the same week, in the order of Monday, Tuesday, ..., Sunday. For example, if cluster A is set to be maintained on Monday and cluster B Sunday, then cluster A will be maintained before cluster B, in the same week.
- If you have two service instances span across a pair of [Azure paired regions](https://learn.microsoft.com/en-us/azure/reliability/cross-region-replication-azure#azure-paired-regions), it is guaranteed that the maintenance will happen in different weeks for such service instances, but there is no guarantee on which region will be maintained first. You may follow each maintenance announcement for the exact information.
- Length of time window for the planned maintenance is fixed to 8 hours. For example, if the start time is set to 10:00, then the maintenance job will be executed at any time between 10:00 - 18:00. The service team will try its best to finish the maintenance within this time window, but it could be possible to finish after the end of such 8-hour windows.

### Limitations

- Maintenance job cannot be exempted regardless of how planned maintenance is configured or unconfigured. If you have special requests for maintenance time that cannot be met with this feature, let us know with a support ticket.
