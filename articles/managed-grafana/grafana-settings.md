---
title: Learn about Grafana settings
titleSuffix: "Azure Managed Grafana"
description: Learn about Grafana settings in Azure Managed Grafana, including Viewers can Edit and External Enabled.
author: maud-lv
ms.author: malev
ms.service: azure-managed-grafana
ms.topic: concept-article
ms.date: 08/09/2024
#customer intent: In this document, learn about the custom Grafana options available in the Grafana settings tab, in Azure Managed Grafana.

---

# Grafana settings

This article introduces the Grafana settings available in Azure Managed Grafana. These settings are designed to enable Azure Managed Grafana customers to customize their Grafana instances by enabling or disabling the Grafana options listed below.

These settings are located in Azure Managed Grafana's **Settings** > **Configuration** menu, in the **Grafana Settings (Preview)** tab.

:::image type="content" source="media/grafana-settings/grafana-settings-tab.png" alt-text="Screenshot of the Azure platform showing the Grafana settings tab." lightbox="media/grafana-settings/grafana-settings-tab.png":::

They are also referenced in Grafana's documentation, under [Grafana configuration](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/). 

## Viewers Can Edit

The **Viewers Can Edit** setting allows users with the Grafana Viewer role to edit dashboards. This feature is designed to enable Grafana Viewers to run tests and interact with dashboards without making permanent changes. While they can edit dashboards, they can't save these edits.

This option also gives Grafana Viewers access to the **Explore** menu in the Grafana UI, where they can perform interactive queries and analyze data within Grafana. However, it's important to note that any changes made by Viewers won't be saved permanently unless they have the appropriate Editor permissions.

To enable or disable this option, open an Azure Managed Grafana instance in the Azure portal and go to **Settings** > **Configuration** > **Grafana Settings (Preview)** > **Viewers can edit**. This option is disabled by default.

## External Enabled

The **External Enabled** setting controls the public sharing of snapshots. This option is enabled by default, allowing users to publish snapshots of their dashboards. 

With this option enabled, users can publish a snapshot of a dashboard to an external URL by opening a dashboard, selecting **Share** > **Snapshot**, and then **Publish to snapshots.raintanks.io**.

You can disable the External Enabled option to restrict the public sharing of snapshots. To do this, open an Azure Managed Grafana instance in the Azure portal and go to **Settings** > **Configuration** > **Grafana Settings (Preview)** and toggle off the **External Enabled** setting.

## Related content

- [Grafana UI](grafana-app-ui.md)
- [Manage plugins](how-to-manage-plugins.md)
