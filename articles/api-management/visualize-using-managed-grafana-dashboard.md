---
title: Visualize Azure API Management monitoring data with Azure Managed Grafana
description: Learn how to use an Azure Managed Grafana dashboard to visualize monitoring data from Azure API Management.
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 10/17/2022
ms.author: danlep
ms.custom: 
---

# Visualize API Management monitoring data using a Managed Grafana dashboard

You can use [Azure Managed Grafana](../managed-grafana/index.yml) to visualize API Management monitoring data that is collected into a Log Analytics workspace. Use a prebuilt [API Management dashboard](https://grafana.com/grafana/dashboards/16604-azure-api-management) for real-time visualization of logs and metrics collected from your API Management instance.

* [Learn more about Azure Managed Grafana](../managed-grafana/overview.md)
* [Learn more about observability in Azure API Management](observability.md)

## Prerequisites

* API Management instance

    * To visualize resource logs and metrics for API Management, configure [diagnostic settings](api-management-howto-use-azure-monitor.md#resource-logs) to collect resource logs and send them to a Log Analytics workspace
    
    * To visualize detailed data about requests to the API Management gateway, [integrate](api-management-howto-app-insights.md) your API Management instance with Application Insights.

    > [!NOTE]
    > To visualize data in a single dashboard, configure the Log Analytics workspace for the diagnostic settings and the Application Insights instance in the same resource group as your API Management instance.

* Managed Grafana workspace

    * To create a Managed Grafana instance and workspace, see the quickstart for the [portal](../managed-grafana/quickstart-managed-grafana-portal.md) or the [Azure CLI](../managed-grafana/quickstart-managed-grafana-cli.md).

    * The Managed Grafana instance must be in the same subscription as the API Management instance.
    
    * When created, the Grafana workspace is automatically assigned a Microsoft Entra managed identity, which is assigned the Monitor Reader role on the subscription. This gives you immediate access to Azure Monitor from the new Grafana workspace without needing to set permissions manually. Learn more about [configuring data sources](../managed-grafana/how-to-data-source-plugins-managed-identity.md) for Managed Grafana.

    
## Import API Management dashboard

First import the [API Management dashboard](https://grafana.com/grafana/dashboards/16604-azure-api-management) to your Management Grafana workspace.

To import the dashboard:

1. Go to your Azure Managed Grafana workspace. In the portal, on the **Overview** page of your Managed Grafana instance, select the **Endpoint** link. 
1. In the Managed Grafana workspace, go to **Dashboards** > **Browse** > **Import**.
1. On the **Import** page, under **Import via grafana.com**, enter *16604* and select **Load**. 
1. Select an **Azure Monitor data source**, review or update the other options, and select **Import**.

## Use API Management dashboard

1. In the Managed Grafana workspace, go to **Dashboards** > **Browse** and select your API Management dashboard.
1. In the dropdowns at the top, make selections for your API Management instance. If configured, select an Application Insights instance and a Log Analytics workspace.  

Review the default visualizations on the dashboard, which will appear similar to the following screenshot:

:::image type="content" source="media/visualize-using-managed-grafana-dashboard/api-management-dashboard.png" alt-text="Screenshot of API Management dashboard in Managed Grafana workspace." lightbox="media/visualize-using-managed-grafana-dashboard/api-management-dashboard.png":::

## Next steps

* For more information about managing your Grafana dashboard, see the [Grafana docs](https://grafana.com/docs/grafana/v9.0/dashboards/).
* Easily pin log queries and charts from the Azure portal to your Managed Grafana dashboard. For more information, see [Monitor your Azure services in Grafana](../azure-monitor/visualize/grafana-plugin.md#pin-charts-from-the-azure-portal-to-azure-managed-grafana).
