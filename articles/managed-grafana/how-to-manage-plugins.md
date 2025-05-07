---
title: How to manage plugins in Azure Managed Grafana
description: In this how-to guide, discover how you can add a Grafana plugin or remove a Grafana plugin you no longer need.
author: maud-lv 
ms.author: malev 
ms.service: azure-managed-grafana
ms.topic: how-to
ms.date: 12/19/2024
---

# How to manage Grafana plugins

Grafana supports data source, panel, and app plugins. When you create a new Grafana instance, some plugins, such as Azure Monitor, are installed by default. In the following guide, learn how you can add or remove optional plugins.

> [!NOTE]
> Installing and removing plugins isn't available from the Grafana UI or the Azure CLI at this stage. Plugin management is done from the Azure Managed Grafana workspace in the Azure portal.

## Prerequisites

[An Azure Managed Grafana instance](./how-to-permissions.md)

## Add a plugin

To install Grafana plugins, follow the process below.

> [!IMPORTANT]
> Before adding plugins to your Grafana instance, we recommend that you evaluate these plugins to ensure that they meet your organizational standards for quality, compliance, and security. Third-party plugins have their own release frequency, security implications, testing and update processes that are outside of Microsoft control. Ultimately, it is up to you to determine which plugins meet your requirements and security needs.

1. Open your Azure Managed Grafana instance in the Azure portal.
1. Select **Plugin management**. This page shows a table with three columns containing checkboxes, plugin names, and plugin IDs. Review the checkboxes. A checked box indicates that the corresponding plugin is already installed and can be removed, an unchecked box indicates that the corresponding plugin isn't installed and can be added.

   > [!NOTE]
   > This page only shows optional plugins. Core Grafana plugins that are included in your pricing plan by default aren't listed here.

1. Select a plugin to add to your Grafana instance by checking its checkbox.

   :::image type="content" source="media/plugin-management/add-plugin.png" alt-text="Screenshot of the Plugin management feature data source page."lightbox="media/plugin-management/add-plugin.png":::

1. Select **Save**. Azure displays a message stating which plugins will be added or removed. Select **Yes** to confirm. Once the update is complete, a success message is displayed and the list of plugins is updated.

## Remove a plugin

To remove a plugin that isn't part of the Grafana built-in core plugins, follow the steps below.

> [!CAUTION]
> Removing a data source that is used in a dashboard will make the dashboard unable to collect the corresponding data and will trigger an error or result in no data being shown in the panel.

1. Open your Azure Managed Grafana instance in the Azure portal.
1. Select **Plugin management**. This page displays a table with data source plugins. It contains three columns including checkboxes, plugin names, and plugin IDs. Installed plugins are displayed at the top of the list and have an **Installed** tag.
1. Select a plugin to remove from your Grafana instance by checking its checkbox.

   :::image type="content" source="media/plugin-management/remove-plugin.png" alt-text="Screenshot of the Plugin management feature data source page. Remove plugin."lightbox="media/plugin-management/remove-plugin.png":::

1. Select **Save**. Azure displays a message stating which plugins will be added or removed. Select **Yes** to confirm. Once the update is complete, a success message is displayed and the list of plugins is updated.

## Next steps

Now that you know how to add and remove plugins, learn how to manage data sources.

> [!div class="nextstepaction"]
> [Configure a data source](./how-to-data-source-plugins-managed-identity.md)
