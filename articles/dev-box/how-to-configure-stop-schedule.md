---
title: Set Dev Box Autostop Schedule
description: Learn how to configure an autostop schedule to automatically shut down dev boxes in a pool at a specified time and save on costs.
services: dev-box
ms.service: dev-box
ms.custom: devx-track-azurecli
author: RoseHJM
ms.author: rosemalcolm
ms.date: 11/30/2025
ms.topic: how-to

#Customer intent: As a Dev Box administrator, I want to configure an autostop schedule on a pool, so I can automatically shut down dev boxes in the pool at a specified time and save on costs.
---

# Autostop dev boxes on schedule

This article explains how to enable an autostop schedule on a dev box pool to save on costs. Microsoft Dev Box then attempts to stop or hibernate all dev boxes in the pool daily at the time specified in the schedule.

Project administrators can manage autostop schedules by using the Azure portal or the Azure CLI. You can configure one stop time in one timezone for each pool.

> [!NOTE]
> Autostop behavior depends on whether the applied dev box definition supports hibernation. Hibernation-enabled dev boxes hibernate at the scheduled autostop time. Dev boxes that don't support hibernation shut down at the scheduled time. For more information, see [How to configure dev box hibernation](how-to-configure-dev-box-hibernation.md).

## Prerequisites

| Category | Requirement |
|---|---|
| Permissions | **Owner**, **Contributor**, or **DevCenter Project Admin** role or permissions on a dev box project. |

## Create an autostop schedule

You can create an autostop schedule while configuring a new dev box pool, or by modifying an already existing dev box pool.

# [Azure portal](#tab/portal)

The following procedures describe how to use the Azure portal to create and configure autostop schedules for existing or new dev box pools.

### Add an autostop schedule to an existing pool

Follow these steps to add an autostop schedule to an existing dev box pool:

1. In the [Azure portal](https://portal.azure.com), open the project associated with the pool that you want to edit and select **Dev box pools** in the left navigation menu.

1. On the **Dev box pools** page, select the checkbox for the pool you want to modify, select the **More actions** icon at right, and then select **Edit**.

   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-pool-grid-populated.png" alt-text="Screenshot of the list of existing dev box pools for the project." lightbox="./media/how-to-manage-stop-schedule/dev-box-pool-grid-populated.png":::

1. In the **Edit** pane, select the **Management** tab.
1. Under **Cost controls** on the **Management** screen, select the checkbox for **Auto-stop on schedule**.
1. For **Stop time**, select a time to shut down or hibernate all the dev boxes in the pool daily.
1. For **Time zone**, select the time zone that the stop time is in.
1. Select **Save**. 

   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-enable-stop.png" alt-text="Screenshot of the edit dev box pool page showing the Cost controls section and the autostop option selected."::: 


### Add an autostop schedule when you create a pool

Follow these steps to add an autostop schedule when you create a dev box pool.

1. In the [Azure portal](https://portal.azure.com), open the project you want to add the pool to and select **Dev box pools** in the left navigation menu.

1. On the **Dev box pools** page, select **Create**, and start to create a dev box pool by following the instructions at [Create a dev box pool](how-to-manage-dev-box-pools.md#create-a-dev-box-pool).

   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-pool-grid-empty.png" alt-text="Screenshot of the list of dev box pools within a project. The list is empty. The Create option is selected." lightbox="./media/how-to-manage-stop-schedule/dev-box-pool-grid-empty.png":::

1. Under **Cost controls** on the **Management** tab of the **Create a dev box pool** form, select the checkbox for **Auto-stop on schedule**.
1. For **Stop time**, select a time to shut down or hibernate all the dev boxes in the pool daily.
1. For **Time zone**, select the time zone that the stop time is in.
1. Finish configuring the other pool settings, and then select **Create**.

   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-pool-create.png" alt-text="Screenshot of the Create dev box pool dialog."::: 

Verify that the new dev box pool appears in the dev pool list. You might need to refresh the screen.

# [Azure CLI](#tab/cli)

Run the following Azure CLI command to create or modify an autostop schedule. Replace the `<poolName>`, `<projectName>`, and `<resourceGroupName>` placeholders with the names of your dev box pool, project, and resource group.

In the command, set the following parameters:
- `<hh:mm>`: The local time when dev boxes should be shut down, such as `23:15` for 11:15 PM.
- `time-zone`: The standard timezone string to determine the local time, such as `America/Los_Angeles`.
- `state`: `Enabled` or `Disabled` to indicate whether or not to use the schedule.

```azurecli
az devcenter admin schedule create --pool-name <poolName> --project <projectName> --resource-group <resourceGroupName> --time <hh:mm> --time-zone "<timeZone>" --state <Enabled or Disabled>
```

---

## Delete an autostop schedule

The following steps delete the autostop schedule associated with a dev box pool.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), open the project associated with the pool that you want to edit and select **Dev box pools** in the left navigation menu.

1. On the **Dev box pools** page, select the checkbox for the pool you want to modify, select the **More actions** icon next to the entry, and then select **Edit**.

1. In the **Edit** pane, select the **Management** tab.
1. Under **Cost controls** on the **Management** tab, deselect the checkbox for **Auto-stop on schedule**.

   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-disable-stop.png" alt-text="Screenshot of the edit dev box pool page showing the autostop on schedule option unselected."::: 

1. Select **Save**. 

After you deselect the setting, dev boxes in this pool no longer stop automatically.

# [Azure CLI](#tab/cli)

The following Azure CLI command deletes an autostop schedule. Replace the `<poolName>` and `<projectName>` placeholders with the names of your dev box pool and project.

```azurecli
az devcenter admin schedule delete --pool-name <poolName> --project-name <projectName>
```

After you run the command, dev boxes in this pool no longer stop automatically.

---

## Related content

- [Manage a dev box definition](how-to-manage-dev-box-definitions.md)
- [Manage a dev box pool](how-to-manage-dev-box-pools.md)
- [Manage a dev box by using the developer portal](how-to-create-dev-boxes-developer-portal.md)
