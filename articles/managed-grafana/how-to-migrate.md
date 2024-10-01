---
title: Migrate a self-hosted Grafana to Azure Managed Grafana
titlesuffix: Azure Managed Grafana
description: Learn how to migrate a self-hosted Grafana to Azure Managed Grafana and move your dashboards to Azure Managed Grafana.
ms.service: azure-managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 12/06/2023
zone_pivot_groups: app-service-cli-portal
# CustomerIntent: As a developer or data analyst, I want know how I can migrate my Grafana instance to Azure Managed Grafana.
# self-managed, self-hosted, Grafana Cloud
--- 

# Migrate a self-hosted Grafana to Azure Managed Grafana

This guide shows how to migrate a self-managed Grafana to Azure Managed Grafana, by moving your data sources and dashboards to your new workspace.

When reading this guide, choose one of the two methods below to complete your Grafana migration:

* Using the Azure CLI: this is the fastest method. Run an Azure CLI command and reconfigure the data source secrets.
* Using the Azure portal: export Grafana dashboards, import them into Azure Managed Grafana, add and reconfigure your data source plugins.

::: zone pivot="experience-azcli"

## Prerequisites

* A Grafana instance to migrate over to Azure Managed Grafana
* [An Azure Managed Grafana workspace](./quickstart-managed-grafana-cli.md)
* Minimum access required in both instances: Grafana Editor
[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

::: zone-end

::: zone pivot="experience-azp"

> [!NOTE]
> Some of the instructions presented in this tutorial vary slightly depending on the version of Grafana used. This tutorial was created using Grafana 10.

## Prerequisites

* A Grafana instance to migrate over to Azure Managed Grafana
* [An Azure Managed Grafana workspace](./quickstart-managed-grafana-cli.md)
* Minimum access required in both instances: Grafana Editor

::: zone-end

::: zone pivot="experience-azcli"

In the guide below, we leverage the Azure CLI to copy data from one Grafana instance to an Azure Managed Grafana instance.  The following elements can be migrated automatically using the command:
*  data sources
* folders
* library panels
* dashboards
* snapshots
* annotations

## Create a service account token

1. In your existing Grafana workspace, create a new service account with Admin permissions by going to **Administration** > **Users and access** > **Service accounts** > **Add service account**.

    :::image type="content" source="media/migration/add-service-account.png" alt-text="Screenshot of the Grafana UI  showing the Add service account action." lightbox="media/migration/add-service-account.png":::

    > [!TIP] 
    > This step requires using Grafana service accounts. If you're migrating from an Azure Managed Grafana instance, [enable service accounts in Azure Managed Grafana](./how-to-service-accounts.md#enable-service-accounts).

1. Enter a display name for the new service account, select the **Admin** role, **Apply** and **Create**.
1. Once the service account has been created, select **Add token**, optionally set an expiration date and select **Generate token**. Remember to copy the token now as you will not be able to see it again once you leave this page.

## Finalize Grafana data migration

Go to your destination Grafana instance and check that that you can find everything you migrated from your Grafana instance.

> [!IMPORTANT]
> If your data sources are set up using secrets, you need to manually reconfigure these secrets in your destination Grafana instance to successfully configure your data sources in Grafana.

::: zone-end

::: zone pivot="experience-azp"

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

::: zone-end

## Related content

For more information about plugins, data sources, and dashboards, check the following content:

* [How to manage plugins](how-to-manage-plugins.md)
* [How to manage data sources](how-to-data-source-plugins-managed-identity.md)
* [Create a dashboard](how-to-create-dashboard.md)
