---
title: Migrate a self-hosted Grafana to Azure Managed Grafana
titlesuffix: Azure Managed Grafana
description: Learn how to migrate a self-hosted Grafana to Azure Managed Grafana and move your dashboards to Azure Managed Grafana.
ms.service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 12/06/2023
# CustomerIntent: As a developer or data analyst, I want know how I can migrate my Grafana to Azure Managed Grafana.
# self-managed, self-hosted, Grafana Cloud
--- 

# Migrate a self-hosted Grafana to Azure Managed Grafana

This guide shows how to migrate a self-managed Grafana to Azure Managed Grafana, by moving your data sources and dashboards to your new workspace.

This guide walks you through the process of exporting self-hosted Grafana dashboards, importing them into Azure Managed Grafana, adding data source plugins, and configuring your data sources in your new workspace.

> [!NOTE]
> Some of the instructions presented in this tutorial vary slightly depending on the version of Grafana used. This tutorial was created using Grafana 10.

## Prerequisites

* [An Azure Managed Grafana workspace](./how-to-permissions.md)
* Minimum permissions: Grafana Editor

## Export your Grafana dashboards

Start by exporting your local Grafana dashboards as JSON files.

1. Open your self-hosted Grafana user interface and go **Dashboards**.
1. Open one of your dashboards and select the **Share panel or dashboard** icon.
1. Go to the **Export** tab and select **Save to file**.

    :::image type="content" source="media/migration/export-dashboard.png" alt-text="Screenshot of the Grafana user interface showing the JSON data in the JSON Model tab.":::

1. Repeat this process for each dashboard you want to export.

## Import your self-hosted Grafana dashboards into Azure Managed Grafana

Create new dashboard in Azure Managed Grafana by importing the JSON files you exported.

1. In the **Overview** page of your Azure Managed Grafana workspace, open the **Endpoint** URL to open the Grafana portal.
1. Select **+** at the top of the page, then **Import dashboard**.

    :::image type="content" source="media/migration/import-dashboard.png" alt-text="Screenshot of the Grafana UI in the Azure Managed Grafana workspace. The image shows the + and Import dashboard buttons at the top of the page.":::

1. Select **Upload dashboard JSON file** and select the file on your local machine.
1. Select **Load** and review the dashboard settings. Optionally edit the dashboard name, folder, and unique identifier (UID).

1. Select **Import** to save the dashboard. Repeat this process for each dashboard you want to import.

    :::image type="content" source="media/migration/import-json.png" alt-text="Screenshot of the Grafana UI in the Azure Managed Grafana workspace. The image shows the import option.":::

For more information about how to create and edit dashboards, go to [Create a dashboard in Azure Managed Grafana](how-to-create-dashboard.md).

## Install data source plugins

Core data source plugins supported by your instance's pricing plan are installed by default. To install other optional plugins, follow the process below:

1. Open your workspace in the Azure portal and go to **Plugin management (Preview)**.
1. Choose a plugin to install by selecting its checkbox and select **Save**.
1. Repeat this process for each data source plugin you want to install.

Refer to [Add a plugin](how-to-manage-plugins.md#add-a-plugin) for more information.

## Configure your data sources

Configure your new data sources in Azure Managed Grafana.

1. In the **Overview** page of your Azure Managed Grafana workspace, open the **Endpoint** URL to open the Grafana portal.
1. In the Grafana user interface, go to **Connections** > **Data sources** > **Add new datasource**.
1. Select a data source from the list.
1. Fill out the required fields and select **Save & test** to save the configuration and verify that Grafana can connect to the data source.
1. Repeat this process for each data source.

## Related content

For more information about plugins, data sources, and dashboards, check the following content:

* [How to manage plugins](how-to-manage-plugins.md)
* [How to manage data sources](how-to-data-source-plugins-managed-identity.md)
* [Create a dashboard](how-to-create-dashboard.md)
