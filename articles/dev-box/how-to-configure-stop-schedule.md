---
title: Set Dev Box Autostop Schedule
titleSuffix: Microsoft Dev Box
description: Learn how to configure an autostop schedule to automatically shut down dev boxes in a pool at a specified time and save on costs.
services: dev-box
ms.service: dev-box
ms.custom: devx-track-azurecli
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/23/2024
ms.topic: how-to

#Customer intent: As a Dev Box administrator, I want to configure an autostop schedule on a pool, so I can automatically shut down dev boxes in the pool at a specified time and save on costs.
---

# Autostop your dev boxes on schedule

To save on costs, you can enable an autostop schedule on a dev box pool. Microsoft Dev Box attempts to stop or hibernate all dev boxes in the pool at the time specified in the schedule. You can configure one stop time in one timezone for each pool.

## Prerequisites

To manage a dev box schedule, you need the following permissions:

| Action | Permission required |
|---|---|
| _Configure a schedule_ | Owner, Contributor, or DevCenter Project Admin. |

## Manage an autostop schedule in the Azure portal

You can enable, modify, and disable autostop schedules by using the Azure portal.

> [!NOTE]
> When you define an autostop schedule for a dev box, the stop behavior depends on the applied dev box definition.
> - A dev box created with a hibernation-enabled dev box definition hibernates at the scheduled autostop time.
> - A dev box created with a dev box definition that doesn't support hibernation shuts downs at the scheduled autostop time.
>
> To learn more about enabling hibernation on your dev box definitions, see [How to configure dev box hibernation](./how-to-configure-dev-box-hibernation.md).

### Create an autostop schedule

You can create an autostop schedule while configuring a new dev box pool, or by modifying an already existing dev box pool. The following steps show you how to use the Azure portal to create and configure an autostop schedule.

### Add an autostop schedule to an existing pool

Follow these steps to add an autostop schedule to an existing dev box pool:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter _projects_. In the list of results, select **Projects**:

   :::image type="content" source="./media/how-to-manage-stop-schedule/discover-projects.png" alt-text="Screenshot showing a search for projects from the Azure portal search box." lightbox="./media/how-to-manage-stop-schedule/discover-projects.png":::

1. Open the project associated with the pool that you want to edit, and then select **Dev box pools**:
  
   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-pool-grid-populated.png" alt-text="Screenshot of the list of existing dev box pools for the project." lightbox="./media/how-to-manage-stop-schedule/dev-box-pool-grid-populated.png":::

1. Determine the pool you want to modify and scroll right. Select **More options** (**...**) > **Edit**:

   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-edit-pool.png" alt-text="Screenshot of the more options menu for a dev box pool and the Edit option selected." lightbox="./media/how-to-manage-stop-schedule/dev-box-edit-pool.png":::

1. In the **Edit \<dev box pool>** pane, select the **Management** section.

1. Under **Cost controls**, configure the following settings:

   | Setting | Value |
   |---|---|
   | **Auto-stop on schedule** | Select the checkbox to enable an autostop schedule after the pool is created. |
   | **Stop time** | Select a time to shutdown all the dev boxes in the pool. All dev boxes in this pool shutdown at this time every day. |
   | **Time zone** | Select the time zone that the stop time is in. |
   
   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-enable-stop.png" alt-text="Screenshot of the edit dev box pool page showing the Cost controls section and the autostop option selected." lightbox="./media/how-to-manage-stop-schedule/dev-box-enable-stop.png"::: 

1. Select **Save**. 

### Add an autostop schedule when you create a pool

Follow these steps to add an autostop schedule when you create a dev box pool:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter _projects_. In the list of results, select **Projects**.

1. Open the project for which you want to create a pool, select **Dev box pools**, and then select **Create**:
 
   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-pool-grid-empty.png" alt-text="Screenshot of the list of dev box pools within a project. The list is empty. The Create option is selected." lightbox="./media/how-to-manage-stop-schedule/dev-box-pool-grid-empty.png":::

1. In the **Create a dev box pool** pane, select the **Management** section.

1. Under **Cost controls**, configure the following settings:

   | Setting | Value |
   |---|---|
   | **Auto-stop on schedule** | Select the checkbox to enable an autostop schedule after the pool is created. |
   | **Stop time** | Select a time to shutdown all the dev boxes in the pool. All dev boxes in this pool shutdown at this time every day. |
   | **Time zone** | Select the time zone that the stop time is in. |

   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-pool-create.png" alt-text="Screenshot of the Create dev box pool dialog." lightbox="./media/how-to-manage-stop-schedule/dev-box-pool-create.png"::: 

   To configure the other pool settings, see [Manage a dev box pool in Microsoft Dev Box](./how-to-manage-dev-box-pools.md).

1. Select **Create**.
 
1. Verify the new dev box pool appears in the list. You might need to refresh the screen.

### Delete an autostop schedule

Follow these steps to delete an autostop schedule associated with a dev box pool:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter _projects_. In the list of results, select **Projects**.

1. Open the project associated with the pool you want to modify, and then select **Dev box pools**.

1. Locate the pool you want to modify and scroll right. Select **More options** (**...**) > **Edit**.

1. In the **Edit \<dev box pool>** pane, select the **Management** section.

1. Under **Cost controls**, unselect the **Auto-stop on schedule** checkbox:

   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-disable-stop.png" alt-text="Screenshot of the edit dev box pool page showing the autostop on schedule option unselected."::: 

1. Select **Save**. 

After you change the setting, dev boxes in this pool don't automatically shut down.

## Manage an autostop schedule with the Azure CLI

You can also manage autostop schedules by using the Azure CLI.

### Create an autostop schedule

The following Azure CLI command creates an autostop schedule:

```azurecli
az devcenter admin schedule create --pool-name {poolName} --project {projectName} --resource-group {resourceGroupName} --time {hh:mm} --time-zone {"timeZone"} --state Enabled
```

| Parameter | Value |
|---|---|
| `pool-name` | Name of your dev box pool. |
| `project` | Name of your dev box project. |
| `resource-group` | Name of the resource group for your dev box pool. |
| `time` | Local time when dev boxes should be shut down, such as `23:15` for 11:15 PM. |
| `time-zone` | Standard timezone string to determine the local time, such as `"America/Los_Angeles"`. |
| `state` | Indicates whether the schedule is in use. The options include `Enabled` or `Disabled`. |

### Delete an autostop schedule

The following Azure CLI command deletes an autostop schedule:

```azurecli
az devcenter admin schedule delete --pool-name {poolName} --project-name {projectName}
```

| Parameter | Value |
|---|---|
| `pool-name` | Name of your dev box pool. |
| `project-name` | Name of your dev box project. |

## Related content

- [Manage a dev box definition](./how-to-manage-dev-box-definitions.md)
- [Manage a dev box pool in Microsoft Dev Box](./how-to-manage-dev-box-pools.md)
- [Manage a dev box by using the developer portal](./how-to-create-dev-boxes-developer-portal.md)
