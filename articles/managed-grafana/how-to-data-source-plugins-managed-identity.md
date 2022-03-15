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

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Supported data source plugins

Azure Managed Grafana Preview supports the main data source plugins requested by our customers. If upgraded to Enterprise SKU, it will support everything currently available in Grafana Enterprise.

Azure specific data source plugins supported are:

- Azure Monitor
- Azure Data Explorer

The full list of available Grafana data source plugins can be found from the left menu in **Configuration** > **Data sources** > **Add a data source**. Search for the data source you need from the available list. Fore more information about data source plugins, go to [Data sources](https://grafana.com/grafana/plugins/) on the Grafana Labs website's plugins page.

   :::image type="content" source="media/how-to-source-plugins.png" alt-text="Screenshot of the Add data source page.":::

## Default data source plugins in Azure Grafana workspace

The Azure Monitor plugin is automatically added to your Managed Grafana workspace, whenever you create a new workspace. To finalize the configuration of the plugin, follow these steps:

1. From the left menu, select **Configuration** > **Data Sources**. You can see that Azure Monitor is already listed as an existing data source for your workspace. 
1. Select **Azure Monitor** and select a subscription to finish configuring this plugin.

As you can see, the authentication and authorization is using Managed Identity - you can go to Azure portal or use Azure CLI to assign permissions for the Azure Grafana workspace to be able to access Monitor data, without having to manually manage service principals in Azure Active Directory (AAD).

## Manually assign permissions for Managed Grafana to access data in Azure

The default permission assignment upon creating is Log Analytics Reader role for the subscription. It may not be applicable in your specific scenario. In this case, go to the Log Analytics resource that contains monitoring data you want to visualization, go to Access Control (IAM), search for Grafana workspace name and give it Reader permissions on the Log Analytics resource.

By default, Managed Grafana grants a Log Analytics Reader access role for all resources within a subscription. To learn how to manually edit permissions for specific resources, go to [Configure permissions for Azure Managed Grafana Preview](how-to-permissions.md).

