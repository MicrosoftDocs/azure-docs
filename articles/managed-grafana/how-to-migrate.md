---
title: Migrate to Azure Managed Grafana
titlesuffix: Azure Managed Grafana
description: Learn how to migrate content from a self-hosted or a cloud-managed Grafana to Azure Managed Grafana using the Grafana UI or the Azure CLI.
ms.service: azure-managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 10/07/2024
zone_pivot_groups: grafana-cli-portal
# CustomerIntent: As a developer or data analyst, I want know how I can migrate my Grafana instance to Azure Managed Grafana.
# self-managed, self-hosted, Grafana Cloud
--- 

# Migrate to Azure Managed Grafana

::: zone pivot="experience-azcli"

This guide shows how to migrate content from a local or a cloud-managed Grafana instance to Azure Managed Grafana using the Azure CLI. The following elements can be migrated automatically:

* data sources
* folders
* library panels
* dashboards
* snapshots
* annotations

## Prerequisites

* A Grafana instance to migrate over to Azure Managed Grafana
* [An Azure Managed Grafana workspace](./quickstart-managed-grafana-cli.md)
* Minimum access required in both instances: Grafana Admin
[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

::: zone-end

::: zone pivot="experience-gui"

The following instructions show how to migrate content from a Grafana instance to Azure Managed Grafana using the Azure platform.

> [!TIP]
> Consider migrating content [using the Azure CLI](how-to-migrate.md?pivots=experience-azcli), which is the quickest method.

> [!NOTE]
> Some of the instructions presented in this tutorial vary slightly depending on the version of Grafana used. This tutorial was created using Grafana 10.

## Prerequisites

* A Grafana instance to migrate over to Azure Managed Grafana
* [An Azure Managed Grafana workspace](./quickstart-managed-grafana-cli.md)
* Minimum access required in both instances: Grafana Admin

::: zone-end

::: zone pivot="experience-azcli"

## Create a service account token

Start by creating a service account token to grant the necessary permissions to access and export content from your Grafana instance.

1. In the Grafana you want to collect content from (source), create a new service account with Admin permissions by going to **Administration** > **Users and access** > **Service accounts** > **Add service account**.

    :::image type="content" source="media/migration/add-service-account.png" alt-text="Screenshot of the Grafana UI  showing the Add service account action." lightbox="media/migration/add-service-account.png":::

    > [!TIP] 
    > This step requires using Grafana service accounts. If you're migrating from an Azure Managed Grafana instance, [enable service accounts in Azure Managed Grafana](./how-to-service-accounts.md#enable-service-accounts).

1. Enter a display name for the new service account, select the **Admin** role, **Apply**, and **Create**.
1. Once the service account has been created, select **Add token**, optionally set an expiration date, and select **Generate token**. Remember to copy the token now as you won't be able to see it again once you leave this page.

## Run the Grafana migrate command

In the Azure CLI, run the [az grafana migrate](/cli/azure/grafana#az-grafana-migrate) command. When running the command below, replace the placeholders `<target-grafana>` `<target-grafana-resource-group>` `<--src-endpoint>`, `<source-grafana-endpoint>`and `<source-token>` with the name and resource group of the Azure Managed Grafana instance you want to migrate to (target), the endpoint of the Grafana you're collecting content from (source), and the service account token you created earlier.

```azurecli
az grafana migrate --name <target-grafana> --resource-group <target-grafana-resource-group> --src-endpoint <source-grafana-endpoint> --src-token-or-key <source-token>
```
The Azure CLI output lists all the elements that were migrated over to your Azure Managed Grafana instance. 

Optional parameters for this command include:

* `--dry-run`: Preview changes without committing.
* `--folders-to-exclude`: Folders to exclude in backup or sync.
* `--folders-to-include`: Folders to include in backup or sync.
* `--overwrite`: If you try to migrate a dashboard that already exists in your target Grafana instance, by default, Azure Managed Grafana skips the creation of the new data source to avoid creating a duplicate. The overwrite option lets you overwrite previous dashboards, library panels, and folders with the same uid or title.

## Finalize Grafana migration

Go to your target instance and check that you can find everything you migrated from your Grafana instance.

> [!IMPORTANT]
> If your data sources are set up using secrets, you need to manually reconfigure these secrets in your target instance to successfully configure your data sources.

::: zone-end

::: zone pivot="experience-gui"

## Export your Grafana dashboards

Start by exporting your Grafana dashboards as JSON files.

1. Open your Grafana user interface and go **Dashboards**.
1. Open one of your dashboards and select the **Share panel or dashboard** icon.
1. Go to the **Export** tab and select **Save to file**.

    :::image type="content" source="media/migration/export-dashboard.png" alt-text="Screenshot of the Grafana user interface showing the JSON data in the JSON Model tab.":::

1. Repeat this process for each dashboard you want to export.

## Import your Grafana dashboards into Azure Managed Grafana

Create a new dashboard in Azure Managed Grafana by importing the JSON files you exported.

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
