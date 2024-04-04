---
title: Get support for Modeling and Simulation Workbench
description: In this article, learn how to get support for Modeling and Simulation Workbench deployment.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 06/06/2023
# Customer intent: As a user of the Modeling and Simulation Workbench, I want to troubleshoot issues I may have encountered.
---

# Get support for Modeling and Simulation Workbench

The Azure Modeling and Simulation Workbench documentation and [troubleshooting](./resources-troubleshoot.md) information covers most of the commonly encountered scenarios. If you have a technical issue that isn't covered in the troubleshooting guide and recovery steps, reach out to get help and support.

## Get support

To get support directly from the product team, send an email to [azuremswb@microsoft.com.](mailto:azuremswb@microsoft.com)

Provide the following information:

- Problem category; for example, prerequisite steps, creation of resources, user management, remote desktop sign in, license management, data import, data export, or resource deletion.
- Problem description.
- Subscription ID.
- Environment: Gov Cloud/Commercial Cloud and which region.
- Date and time problem started.
- Details of problem, including helpful information such as:
  - Resource names, resource IDs, resource JSON for resources involved.
  - Steps to reproduce.
  - Screenshots of errors returned.
  - Any helpful information from [activity logs.](./resources-get-support.md#access-modeling-and-simulation-workbench-activity-logs)

## Access Modeling and Simulation Workbench activity logs

1. Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.
1. Search for Modeling and Simulation Workbench and choose the workbench you want to see logs for from the resource list.
1. In the menu for the workbench, select the **Activity log** blade on the left of the screen.

   :::image type="content" source="./media/resources-troubleshoot/workbench-activity-log.png" alt-text="Screenshot of the Azure portal in a web browser, showing the activity log for a workbench.":::

1. Select the **Timespan** filter to adjust the timespan for your logs search.
1. Select the **Add Filter** button to add filters to help find logs for your Modeling and Simulation Workbench. On screen, you find a link to **Learn more about Azure Activity log** and **Visit Log Analytics** which provides a [Log Analytics tutorial.](/azure/azure-monitor/logs/log-analytics-tutorial)

  > [!NOTE]
  > The log lifetime is 30 days. To access the logs longer than 30 days, select the **Export Activity Logs** option and select one of the available options that displays.
