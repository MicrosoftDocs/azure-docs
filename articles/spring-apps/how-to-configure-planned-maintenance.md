---
title: How to configure planned maintenance for Azure Spring Apps
description: Describes how to configure planned maintenance for Azure Spring Apps.
author: KarlErickson
ms.author: haochuang
ms.service: spring-apps
ms.topic: how-to
ms.date: 11/07/2023
ms.custom: 
---

# How to configure planned maintenance

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ✔️ Enterprise

This article describes how to configure planned maintenance in Azure Spring Apps. 

Routine maintenance is necessary to keep the Azure Spring Apps platform up-to-date and secure. The maintenance, also called auto patching, includes security updates, bug fixes, new features, or performance improvements. Auto patching can be performed on components managed by Azure Spring Apps to support your Java applications, including JDK, APM, base OS image, managed middleware, and runtime infrastructure. For the maintenance to take effect, your applications restart within the maintenance window you specify, but the service quality and uptime guarantees continue to apply during this time. 

## Configure maintenance for Azure Spring Apps

### [Azure portal](#tab/Azure-portal)

Use the following steps to configure planned maintenance in Azure Spring Apps:

1. Go to the service **Overview** page and select **Planned Maintenance**.

   :::image type="content" source="media/how-to-configure-planned-maintenance/maintenance-section.png" alt-text="Screenshot of Azure portal that shows the Azure Spring Apps sidebar with Planned Maintenance highlighted.":::

1. Select **Choose your preferred time** to specify detailed configuration for the maintenance window.

   :::image type="content" source="media/how-to-configure-planned-maintenance/maintenance-checkbox.png" alt-text="Screenshot of the Azure portal that shows the Planned maintenance page with the Choose your preferred time checkbox highlighted.":::

1. Select **Day of the week** to schedule the maintenance.

   :::image type="content" source="media/how-to-configure-planned-maintenance/maintenance-week.png" alt-text="Screenshot of Azure portal that shows the Planned maintenance page with the Day of week option highlighted.":::

1. Select **Start time of upgrade**.

   :::image type="content" source="media/how-to-configure-planned-maintenance/maintenance-time.png" alt-text="Screenshot of Azure portal that shows the Planned maintenance page with the Start time of upgrade option highlighted.":::

1. Select **Apply** to submit your configuration for planned maintenance.

### [Azure CLI](#tab/azure-cli)

Use the following command to configure planned maintenance:

```azurecli
az spring update \
    --resource-group <resource-group-name> \
    --name <Azure-Spring-Apps-instance-name> \
    --enable-planned-maintenance \
    --planned-maintenance-day $DAY_OF_WEEK \
    --planned-maintenance-start-hour $START_HOUR
```

---

Updating the configuration can take a few minutes. You get a notification when the configuration is complete.

> [!NOTE]
> If you don't configure planned maintenance, the maintenance takes place at a time chosen by the service team, with the best effort to minimize business risks for most customers.

## Manage maintenance notification

Notifications and messages are sent out before and during the maintenance. The following table describes the message types and time details:

| Sequence number | Message type                | Channel             | Time the message is sent out                              |
|-----------------|-----------------------------|---------------------|-----------------------------------------------------------|
| 1               | Release note                | Activity Log        | At the end of the release rollout.                        |
| 2               | Maintenance announcement    | Planned Maintenance | Two weeks before the first available maintenance window.  |
| 3               | Start of maintenance window | Activity Log        | At the start of the execution of the entire maintenance.  |
| 4               | Changelog of components     | Activity Log        | At the end of upgrade for each managed component.         |
| 5               | End of maintenance window   | Activity Log        | At the end of the execution of the entire maintenance.    |
| 6               | Feature update              | What's New article  | After the new feature becomes available to the customers. |

## Manage maintenance frequency

Currently, Azure Spring Apps performs one regular planned maintenance to upgrade the underlying infrastructure every three months. For a detailed maintenance timeline, check the notifications on the [Azure Service Health](https://azure.microsoft.com/get-started/azure-portal/service-health) page.

## Best practices

- When you configure planned maintenance for multiple service instances in the same region, the maintenance takes place within the same week. For example, if maintenance for cluster A is set on Monday and cluster B on Sunday, then cluster A is maintained before cluster B, in the same week.
- If you have two service instances that span across [Azure paired regions](../availability-zones/cross-region-replication-azure.md#azure-paired-regions), the maintenance takes place in different weeks for such service instances, but there's no guarantee which region is maintained first. Follow each maintenance announcement for the exact information.
- The length of the time window for the planned maintenance is fixed to 8 hours. For example, if the start time is set to 10:00, then the maintenance job is executed at any time between 10:00 and 18:00. The service team tries its best to finish the maintenance within this time window, but sometimes it might take longer.
- You can't exempt a maintenance job regardless of how or whether planned maintenance is configured. If you have special requests for a maintenance time that can't be met with this feature, open a support ticket.

## Next steps

- [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md)