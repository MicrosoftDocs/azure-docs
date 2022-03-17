---
title: How to configure data source plugins for Azure Managed Grafana Preview with Managed Identity
description: In this how-to guide, discover how you can configure data source plugins for Azure Managed Grafana using Managed Identity.
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: how-to
ms.date: 3/31/2022 
---

# How to configure data source plugins for Azure Managed Grafana Preview with Managed Identity

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- An Azure Managed Grafana workspace. If you don't have one yet, [create a workspace](/how-to-permissions.md).
- A resource including monitoring data with  Managed Grafana monitoring permissions. Read [how to configure permissions](how-to-permissions) for more information.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Supported data source plugins

Azure Managed Grafana Preview supports the main data source plugins requested by Azure customers. The Enterprise version of Managed Grafana also supports all data sources available in Grafana Enterprise.

Azure specific data source plugins supported:

- Azure Monitor
- Azure Data Explorer

You can find the all available Grafana data source plugins by going to your workspace endpoint and selecting this page from the left menu: **Configuration** > **Data sources** > **Add a data source**. Search for the data source you need from the available list. Fore more information about data source plugins, go to [Data sources](https://grafana.com/grafana/plugins/) on the Grafana Labs website.

   :::image type="content" source="media/how-to-source-plugins.png" alt-text="Screenshot of the Add data source page.":::

## Default data source plugins in Azure Grafana workspace

The Azure Monitor plugin is automatically added to all new Managed Grafana resources. To finalize its configuration, follow these steps in your workspace endpoint:

1. From the left menu, select **Configuration** > **Data Sources**.

   :::image type="content" source="media/how-to-source-configuration.png" alt-text="Screenshot of the Add data sources page.":::

1. Azure Monitor is already listed as an existing data source for your workspace. Select **Azure Monitor**.
1. In **Settings**, authenticate through **Managed Identity** and select your subscription from the dropdown list or enter your **App Registration** details

   :::image type="content" source="media/how-to-source-configuration-Azure-Monitor-settings.png" alt-text="Screenshot of the Azure Monitor page in data sources.":::

Authentication and authorization are made through Managed Identity. You can use the Azure portal or the Azure CLI to assign permissions for your Managed Grafana workspace to access Azure Monitor data, without having to manually manage service principals in Azure Active Directory (Azure AD).



## Manually assign permissions for Managed Grafana to access data in Azure

By default, Managed Grafana has a **Log Analytics Reader** access to all the resources in the subscription. To change this:

1. Go to the Log Analytics resource that contains the monitoring data you want to visualize.
2. Go to **Access Control (IAM)**.
3. Search for your Managed Grafana workspace and change the permission.

## Next steps

> [!div class="nextstepaction"]
> [Share an Azure Managed Grafana Preview workspace](./how-to-share-grafana-workspace.md)