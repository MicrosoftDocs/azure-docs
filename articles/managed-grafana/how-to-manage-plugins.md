---
title: How to manage plugins in Azure Managed Grafana
description: In this how-to guide, discover how you can add a Grafana plugin or remove a Grafana plugin you no longer need.
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: how-to
ms.date: 10/26/2023
---

# How to manage Grafana plugins (Preview)

Grafana supports data source, panel, and app plugins. When you create a new Grafana instance, some plugins, such as Azure Monitor, are installed by default. In the following guide, learn how you can add or remove optional plugins.

> [!NOTE]
> Installing and removing plugins isn't available from the Grafana UI or the Azure CLI at this stage. Plugin management is done from the Azure Managed Grafana workspace in the Azure portal.

> [!IMPORTANT]
> Plugin management is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

[An Azure Managed Grafana instance](./how-to-permissions.md)

## Add a plugin

To install Grafana plugins, follow the process below.

1. Open your Azure Managed Grafana instance in the Azure portal.
1. Select **Plugin management (Preview)**. This page shows a table with three columns containing checkboxes, plugin names, and plugin IDs. Review the checkboxes. A checked box indicates that the corresponding plugin is already installed and can be removed, an unchecked box indicates that the corresponding plugin isn't installed and can be added.

   > [!NOTE]
   > This page only shows optional plugins. Core Grafana plugins that are included in your pricing plan by default aren't listed here.

1. Select a plugin to add to your Grafana instance by checking its checkbox. A refresh icon appears in the table next to the plugin you selected, indicating that a change is pending.

   :::image type="content" source="media/plugin-management/add-plugin.png" alt-text="Screenshot of the Plugin management feature data source page.":::

1. Select **Save**. Azure displays a message stating which plugins will be added or removed. Select **Yes** to confirm.
1. An **Updating** status bar indicates that the update is in progress. The update might take a while.
1. A notification appears, indicating if the update operation has been successful.
1. Select **Refresh** above the table to get an updated list of installed plugins.

## Remove a plugin

To remove a plugin that isn't part of the Grafana built-in core plugins, follow the steps below:

1. Open your Azure Managed Grafana instance in the Azure portal.
1. Select **Plugin management (Preview)**. This page displays a table with data source plugins. It contains three columns including checkboxes, plugin names, and plugin IDs. Review the checkboxes. A checked box indicates that the corresponding plugin is already installed and can be removed, an unchecked box indicates that the corresponding plugin can be added.
1. Select a plugin to remove from your Grafana instance by unchecking its checkbox. A refresh icon appears in the table next to the plugin you selected, indicating that a change is pending.

   :::image type="content" source="media/plugin-management/remove-plugin.png" alt-text="Screenshot of the Plugin management feature data source page. Remove plugin.":::

1. Select **Save**. Azure displays a message stating which plugins will be added or removed. Select **Yes** to confirm.
1. An **Updating** status bar indicates that the update is in progress. The update might take a while.
1. A notification appears, indicating if the update operation has been successful.
1. Select **Refresh** above the table to get an updated list of installed plugins.

> [!IMPORTANT]
> Plugin management is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!CAUTION]
> Removing a data source that is used in a dashboard will make the dashboard unable to collect the corresponding data and will trigger an error or result in no data being shown in the panel.

## Next steps

Now that you know how to add and remove plugins, learn how to manage data sources.

> [!div class="nextstepaction"]
> [Configure a data source](./how-to-data-source-plugins-managed-identity.md)
