---
title: Manage Split Experimentation Workspace
description: This article describes management of Split Experimentation Workspace on the Azure portal. How to configure some basic settings and delete the resource.
ms.topic: conceptual
ms.date: 04/30/2024
author: maud-lv
ms.author: malev
---

# Manage Split Experimentation Workspace

This article describes how to manage Split Experimentation Workspace using the Azure portal. It shows how to configure basic settings and delete the Split Experimentation Workspace resource.

## Update data access policy

To run experimentations, you must ensure that your Split Experimentation workspace is able to access data stored in your app. 

If you need your Slit Experimentation Workspace to access data from another application, head over to **Settings** > **Data Access Policy** from the left menu. Then remove the Microsoft Entra ID application selected for authentication by clicking on the trashcan icon next to the **Selected** Microsoft Entra ID application, select another app under **Split Experimentation Workspace Entra ID Application**, and **Save**.

   :::image type="content" source="media/manage/data-access-policy.png" alt-text="Screenshot of the Azure platform showing the data access policy menu.":::

## Configure experimentation metrics

Configure your experimentation metrics by opening **Configuration** > **Experimentation Metrics** from the left menu. Create a new metric by selecting the **Create** button.

For more information about the experimentation metrics, go to Create experimentation metrics<!--link to [Create experimentation metrics](:/howto-setup-experiments.md)-->.

:::image type="content" source="media/manage/experimentation-metrics.png" alt-text="Screenshot of the Azure platform showing experimentation metrics.":::

## Configure Data Source

Under **Configuration** > **Data Source**, configure the Log Analytics workspace and storage account for your Split Experimentation Workspace.

- Under **Log Analytics workspace**, you find a link to the Log Analytics workspace that provides Split with the impressions and events data.
- Under **Export Destination Details**, you find a link to the storage account where the information used by Split is stored.

The **Edit** button at the top enables you to select another storage account to store data for your Split Experimentation workspace.

:::image type="content" source="media/manage/data-source.png" alt-text="View monitored resources":::

## Next step

> [!div class="nextstepaction"]
> [Set up data access control](./split-experimentation\how-to-set-up-data-access.md)