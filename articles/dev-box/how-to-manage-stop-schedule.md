---
title: How to manage a dev box
titleSuffix: Microsoft Dev Box
description: This article describes how to create and delete Dev Box Schedules.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/18/2022
ms.topic: how-to
---

# Auto-stop your Dev Boxes on schedule
To save on costs, you can configure a daily shutdown schedule on a dev box pool, and Microsoft Dev Box will attempt to shut down all dev boxes in that pool at that time.

## Permissions
To manage a dev box schedule, you need the following permissions:

|Action|Permission required|
|-----|-----|
|Configure a schedule|Owner, Contributor, or DevCenter Project Admin.|

## Manage a stop schedule in the Azure Portal

The following steps show you how to create and configure a stop schedule in dev box.

### Create a stop schedule
You can create a stop schedule while creating a new Dev Box pool, or by modifying an already existing Dev Box pool. 

To add it to a new pool:
1.Sign in to the Azure portal.
2.Configure a pool using the steps outlined (https://learn.microsoft.com/en-us/azure/dev-box/how-to-manage-dev-box-pools)[here.]
3.To turn on auto-stop, choose yes on the Enable Auto-stop option control.
4. Specify a time of day, and a time-zone, and click on the save button. All Dev Boxes in this pool will be shutdown at this time, everyday. 



To add it to an existing pool, first navigate to your pool:
1. In the Azure portal, in the search box, type Projects and then select Projects from the list.
2. Click on the Project containing the pool to which you would like to add a stop schedule.
3. Navigate to the Dev Box Pools blade from the sidebar menu
4. Click on the edit icon on the pool you wish to modify.
5. To turn on auto-stop, choose yes on the Enable Auto-stop option control.
6. Specify a time of day, and a time-zone, and click on the save button. All Dev Boxes in this pool will be shutdown at this time, everyday. 

### Delete a stop schedule
To delete an auto-stop schedule, first navigate to your pool:
1. In the Azure portal, in the search box, type Projects and then select Projects from the list.
2. Click on the Project containing the pool to which you would like to add a stop schedule.
3. Navigate to the Dev Box Pools blade from the sidebar menu
4. Click on the edit icon on the pool you wish to modify.
5. To turn on auto-stop, choose No on the Enable Auto-stop option control, and click on the save button. Dev Boxes in this pool will not automatically shutdown.
  

## Manage a stop schedule at the CLI

You can also manage stop schedules using Azure CLI.

### Create a stop schedule

```az devcenter admin schedule create -n {scheduleName} --pool {poolName} --project {projectName} --time 23:15 --time-zone "America/Los_Angeles" --schedule-type stopdevbox --frequency daily --state enabled```
|Parameter|Description|
|-----|-----|
|scheduleName|a name for your schedule|
|poolName|Name of your pool|
|project|Name of your Project|
|time| Local time when Dev Boxes should be shut down|
|time-zone|Standard timezone string to determine local time|



### Delete a stop schedule

```az devcenter admin schedule delete -n {scheduleName} --pool {poolName} --project {projectName}```
|Parameter|Description|
|-----|-----|
|scheduleName|a name for your schedule|
|poolName|Name of your pool|
|project|Name of your Project|
|time| Local time when Dev Boxes should be shut down|
|time-zone|Standard timezone string to determine local time|


## Next steps

- [Provide access to projects for project admins](./how-to-project-admin.md)
- [Create dev box definitions](./quickstart-configure-dev-box-service.md#create-a-dev-box-definition)
- [Configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)