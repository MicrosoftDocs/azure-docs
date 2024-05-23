---
title: Manage Split Experimentation Workspace (preview)
description: This article describes management of Split Experimentation Workspace (preview) in the Azure portal. How to configure some basic settings and delete the resource.
ms.topic: conceptual
ms.custom:
  - build-2024
ms.date: 04/30/2024
author: maud-lv
ms.author: malev
---

# Manage Split Experimentation Workspace (preview)

This article describes how to manage Split Experimentation Workspace (preview) using the Azure portal. It shows how to configure basic settings and delete the Split Experimentation Workspace resource.

## Update data access policy

To run experimentations, you must ensure that your Split Experimentation workspace is able to access data stored in your app. 

If you need your Slit Experimentation Workspace to access data from another application, head over to **Settings** > **Data Access Policy** from the left menu. Then remove the Microsoft Entra ID application selected for authentication by clicking on the trashcan icon next to the **Selected** Microsoft Entra ID application, select another app under **Split Experimentation Workspace Entra ID Application**, and **Save**.

   :::image type="content" source="media/manage/data-access-policy.png" alt-text="Screenshot of the Azure platform showing the data access policy menu.":::

## Configure experimentation metrics

Configure your experimentation metrics by opening **Configuration** > **Experimentation Metrics** from the left menu. Create a new metric by selecting the **Create** button.

For more information about the experimentation metrics, go to [Create experimentation metrics](../../azure-app-configuration/run-experiments-aspnet-core.md#create-metrics-for-your-experiment)

:::image type="content" source="media/manage/experimentation-metrics.png" alt-text="Screenshot of the Azure platform showing experimentation metrics.":::

## Configure data source

Under **Configuration** > **Data Source**, configure the Log Analytics workspace and storage account for your Split Experimentation Workspace.

  > [!NOTE]
  > When creating a new storage account for your experimentation, you must use the same region as your Log Analytics workspace.

- Under **Log Analytics workspace**, you find a link to the Log Analytics workspace that provides Split with the impressions and events data.
- Under **Export Destination Details**, you find a link to the storage account where the information used by Split is stored.

The **Edit** button at the top enables you to select another storage account to store data for your Split Experimentation workspace.

:::image type="content" source="media/manage/data-source.png" alt-text="Screenshot of the Azure portal showing the data source used for the experimentation.":::

## Next step

> [!div class="nextstepaction"]
> [Set up data access control](how-to-set-up-data-access.md)
