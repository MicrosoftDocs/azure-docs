---
title: Set a dev box auto-stop schedule
titleSuffix: Microsoft Dev Box
description: Learn how to configure an auto-stop schedule to automatically shut down dev boxes in a pool at a specified time.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/25/2023
ms.topic: how-to
---

# Auto-stop your Dev Boxes on schedule
To save on costs, you can enable an Auto-stop schedule on a dev box pool. Microsoft Dev Box will attempt to shut down all dev boxes in that pool at the time specified in the schedule. You can configure one stop time in one timezone for each pool.

## Permissions
To manage a dev box schedule, you need the following permissions:

|Action|Permission required|
|-----|-----|
|Configure a schedule|Owner, Contributor, or DevCenter Project Admin.|

## Manage an auto-stop schedule in the Azure portal

You can enable, modify, and disable auto-stop schedules using the Azure portal.

### Create an auto-stop schedule
You can create an auto-stop schedule while creating a new dev box pool, or by modifying an already existing dev box pool. The following steps show you how to use the Azure portal to create and configure an auto-stop schedule.

### Add an auto-stop schedule to an existing pool

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Projects* and then select **Projects** from the list.

   :::image type="content" source="./media/how-to-manage-stop-schedule/discover-projects.png" alt-text="Screenshot showing a search for projects from the Azure portal search box.":::

1. Open the project associated with the pool you want to edit.
  
   :::image type="content" source="./media/how-to-manage-stop-schedule/projects-grid.png" alt-text="Screenshot of the list of existing projects.":::

1. Select the pool you wish to modify, and then select edit. You might need to scroll to locate edit.

   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-edit-pool.png" alt-text="Screenshot of the edit dev box pool button."::: 

1. In **Enable Auto-stop**, select **Yes**.

   |Name|Value|
   |----|----|
   |**Enable Auto-stop**|Select **Yes** to enable an Auto-stop schedule after the pool has been created.|
   |**Stop time**| Select a time to shutdown all the dev boxes in the pool. All Dev Boxes in this pool shutdown at this time every day.|
   |**Time zone**| Select the time zone that the stop time is in.|
   
   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-save-pool.png" alt-text="Screenshot of the edit dev box pool page showing the Auto-stop options."::: 

1. Select **Save**. 

### Add an Auto-stop schedule as you create a pool

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Projects* and then select **Projects** from the list.

   :::image type="content" source="./media/how-to-manage-stop-schedule/discover-projects.png" alt-text="Screenshot showing a search for projects from the Azure portal search box.":::

1. Open the project with which you want to associate the new dev box pool.
  
   :::image type="content" source="./media/how-to-manage-stop-schedule/projects-grid.png" alt-text="Screenshot of the list of existing projects.":::

1. Select **Dev box pools** and then select **+ Create**.
 
   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-pool-grid-empty.png" alt-text="Screenshot of the list of dev box pools within a project. The list is empty.":::

1. On the **Create a dev box pool** page, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes, and must be unique within a project.|
   |**Dev box definition**|Select an existing dev box definition. The definition determines the base image and size for the dev boxes created within this pool.|
   |**Network connection**|Select an existing network connection. The network connection determines the region of the dev boxes created within this pool.|
   |**Dev Box Creator Privileges**|Select Local Administrator or Standard User.|
   |**Enable Auto-stop**|Yes is the default. Select No to disable an Auto-stop schedule. You can configure an Auto-stop schedule after the pool has been created.|
   |**Stop time**| Select a time to shutdown all the dev boxes in the pool. All Dev Boxes in this pool shutdown at this time every day.|
   |**Time zone**| Select the time zone that the stop time is in.|
   |**Licensing**| Select this check box to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |


   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-pool-create.png" alt-text="Screenshot of the Create dev box pool dialog."::: 

1. Select **Add**.
 
1. Verify that the new dev box pool appears in the list. You may need to refresh the screen.


### Delete an auto-stop schedule

To delete an auto-stop schedule, first navigate to your pool:
1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Projects* and then select **Projects** from the list.

   :::image type="content" source="./media/how-to-manage-stop-schedule/discover-projects.png" alt-text="Screenshot showing a search for projects from the Azure portal search box.":::

1. Open the project associated with the pool you want to edit.
  
   :::image type="content" source="./media/how-to-manage-stop-schedule/projects-grid.png" alt-text="Screenshot of the list of existing projects.":::

1. Select the pool you wish to modify, and then select edit. You might need to scroll to locate edit.

   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-edit-pool.png" alt-text="Screenshot of the edit dev box pool button."::: 

1. In **Enable Auto-stop**, select **No**.
   
   :::image type="content" source="./media/how-to-manage-stop-schedule/dev-box-disable-stop.png" alt-text="Screenshot of the edit dev box pool page showing Auto-stop disabled."::: 

1. Select **Save**. Dev boxes in this pool won't automatically shut down.

## Manage an auto-stop schedule at the CLI

You can also manage auto-stop schedules using Azure CLI.

### Create an auto-stop schedule

```az devcenter admin schedule create -n default --pool {poolName} --project {projectName} --time 23:15 --time-zone "America/Los_Angeles" --schedule-type stopdevbox --frequency daily --state enabled```

|Parameter|Description|
|-----|-----|
|poolName|Name of your pool|
|project|Name of your Project|
|time| Local time when Dev Boxes should be shut down|
|time-zone|Standard timezone string to determine local time|

### Delete an auto-stop schedule

```az devcenter admin schedule delete -n default --pool {poolName} --project {projectName}```

|Parameter|Description|
|-----|-----|
|poolName|Name of your pool|
|project|Name of your Project|

## Next steps

- [Manage a dev box definition](./how-to-manage-dev-box-definitions.md)
- [Manage a dev box using the developer portal](./how-to-create-dev-boxes-developer-portal.md)
