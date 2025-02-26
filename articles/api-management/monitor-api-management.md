---
title: Monitor Azure API Management
description: Learn how to monitor Azure API Management using Azure Monitor, including data collection, analysis, and alerting.
ms.date: 01/06/2025
ms.custom: horz-monitor
ms.topic: conceptual
author: dlepow
ms.author: danlep
ms.service: azure-api-management
---

# Monitor API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)] 

[!INCLUDE [azmon-horz-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-intro.md)]

## Collect data with Azure Monitor

This table describes how you can collect data to monitor your service, and what you can do with the data once collected:

|Data to collect|Description|How to collect and route the data|Where to view the data|Supported data|
|---------|---------|---------|---------|---------|
|Metric data|Metrics are numerical values that describe an aspect of a system at a particular point in time. Metrics can be aggregated using algorithms, compared to other metrics, and analyzed for trends over time.|- Collected automatically at regular intervals.</br> - You can route some platform metrics to a Log Analytics workspace to query with other data. Check the **DS export** setting for each metric to see if you can use a diagnostic setting to route the metric data.|[Metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started)| [Azure API Management metrics supported by Azure Monitor](monitor-api-management-reference.md#metrics)|
|Resource log data|Logs are recorded system events with a timestamp. Logs can contain different types of data, and be structured or free-form text. You can route resource log data to Log Analytics workspaces for querying and analysis.|[Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to collect and route resource log data.| [Log Analytics](/azure/azure-monitor/learn/quick-create-workspace)|[Azure API Management resource log data supported by Azure Monitor](monitor-api-management-reference.md#resource-logs)  |
|Activity log data|The Azure Monitor activity log provides insight into subscription-level events. The activity log includes information like when a resource is modified or a virtual machine is started.|- Collected automatically.</br> - [Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to a Log Analytics workspace at no charge.|[Activity log](/azure/azure-monitor/essentials/activity-log)|  |

[!INCLUDE [azmon-horz-supported-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-supported-data.md)]

## Built in monitoring for API Management

Azure API management has the following built in monitoring features.

### Get API analytics in Azure API Management

Azure API Management provides analytics for your APIs so that you can analyze their usage and performance. Use analytics for high-level monitoring and troubleshooting of your APIs. For other monitoring features, including near real-time metrics and resource logs for diagnostics and auditing, see [Tutorial: Monitor published APIs](api-management-howto-use-azure-monitor.md).

:::image type="content" source="media/howto-use-analytics/analytics-report-portal.png" alt-text="Screenshot of API analytics in the portal." lightbox="media/howto-use-analytics/analytics-report-portal.png":::

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

- API Management provides analytics using an [Azure Monitor-based dashboard](/azure/azure-monitor/visualize/workbooks-overview). The dashboard aggregates data in an Azure Log Analytics workspace.
- In the classic API Management service tiers, your API Management instance also includes *legacy built-in analytics* in the Azure portal, and analytics data can be accessed using the API Management REST API. Closely similar data is shown in the Azure Monitor-based dashboard and built-in analytics.

> [!IMPORTANT]
> The Azure Monitor-based dashboard is the recommended way to access analytics data. Built-in (classic) analytics isn't available in the v2 tiers.

With API analytics, analyze the usage and performance of the APIs in your API Management instance across several dimensions, including:

- Time
- Geography
- APIs
- API operations
- Products
- Subscriptions
- Users
- Requests

API analytics provides data on requests, including failed and unauthorized requests. Geography values are based on IP address mapping. There can be a delay in the availability of analytics data.

#### Azure Monitor-based dashboard

To use the Azure Monitor-based dashboard, you need a Log Analytics workspace as a data source for API Management gateway logs.

If you need to configure one, the following are brief steps to send gateway logs to a Log Analytics workspace. For more information, see [Tutorial: Monitor published APIs](api-management-howto-use-azure-monitor.md#resource-logs). This procedure is a one-time setup.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left-hand menu, under **Monitoring**, select **Diagnostic settings** > **+ Add diagnostic setting**.
1. Enter a descriptive name for the diagnostic setting.
1. In **Logs**, select **Logs related to ApiManagement Gateway**.
1. In **Destination details**, select **Send to Log Analytics** and select a Log Analytics workspace in the same or a different subscription. If you need to create a workspace, see [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace).
1. Make sure **Resource specific** is selected as the destination table.
1. Select **Save**.

> [!IMPORTANT]
> A new Log Analytics workspace can take up to 2 hours to start receiving data. An existing workspace should start receiving data within approximately 15 minutes.

#### Access the dashboard

After a Log Analytics workspace is configured, access the Azure Monitor-based dashboard to analyze the usage and performance of your APIs.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left-hand menu, under **Monitoring**, select **Analytics**. The analytics dashboard opens.
1. Select a time range for data.
1. Select a report category for analytics data, such as **Timeline**, **Geography**, and so on.

### Legacy built-in analytics

In certain API Management service tiers, built-in analytics (also called *legacy analytics* or *classic analytics*) is also available in the Azure portal, and analytics data can be accessed using the API Management REST API. 

To access the built-in (classic) analytics in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left-hand menu, under **Monitoring**, select **Analytics (classic)**.
1. Select a time range for data, or enter a custom time range.
1. Select a report category for analytics data, such as **Timeline**, **Geography**, and so on.
1. Optionally, filter the report by one or more other categories.

Use [Reports](/rest/api/apimanagement/reports) operations in the API Management REST API to retrieve and filter analytics data for your API Management instance.

Available operations return report records by API, geography, API operations, product, request, subscription, time, or user.

### Enable logging of developer portal usage in Azure API Management

This section shows you how to enable Azure Monitor logs for auditing and troubleshooting usage of the API Management [developer portal](developer-portal-overview.md). When enabled through a diagnostic setting, the logs collect information about the requests that are received and processed by the developer portal.

Developer portal usage logs include data about activity in the developer portal, including:

- User authentication actions, such as sign-in and sign-out
- Views of API details, API operation details, and products
- API testing in the interactive test console

#### Enable diagnostic setting for developer portal logs

To configure a diagnostic setting for developer portal usage logs:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Monitoring**, select **Diagnostic settings** > **+ Add diagnostic setting**.

   :::image type="content" source="media/developer-portal-enable-usage-logs/monitoring-menu.png" alt-text="Screenshot of adding a diagnostic setting in the portal.":::

1. On the **Diagnostic setting** page, enter or select details for the setting:

    1. **Diagnostic setting name**: Enter a descriptive name.
    1. **Category groups**: Optionally make a selection for your scenario.
    1. Under **Categories**: Select **Logs related to Developer Portal usage**. Optionally select other categories as needed.
    1. Under **Destination details**, select one or more options and specify details for the destination. For example, archive logs to a storage account or stream them to an event hub. For more information, see [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings).
    1. Select **Save**.

#### View diagnostic log data

Depending on the log destination you choose, it can take a few minutes for data to appear.

If you send logs to a storage account, you can access the data in the Azure portal and download it for analysis.

1. In the [Azure portal](https://portal.azure.com), navigate to the storage account destination.
1. In the left menu, select **Storage Browser**.
1. Under **Blob containers**, select **insights-logs-developerportalauditlogs**.
1. Navigate to the container for the logs in your API Management instance. The logs are partitioned in intervals of 1 hour.
1. To retrieve the data for further analysis, select **Download**.

[!INCLUDE [azmon-horz-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-tools.md)]

### Visualize API Management monitoring data using a Managed Grafana dashboard

You can use [Azure Managed Grafana](../managed-grafana/index.yml) to visualize API Management monitoring data that is collected into a Log Analytics workspace. Use a prebuilt [API Management dashboard](https://grafana.com/grafana/dashboards/16604-azure-api-management) for real-time visualization of logs and metrics collected from your API Management instance.

- [Learn more about Azure Managed Grafana](../managed-grafana/overview.md)
- [Learn more about observability in Azure API Management](observability.md)

On your API Management instance:

- To visualize resource logs and metrics for API Management, configure [diagnostic settings](api-management-howto-use-azure-monitor.md#resource-logs) to collect resource logs and send them to a Log Analytics workspace.
- To visualize detailed data about requests to the API Management gateway, [integrate](api-management-howto-app-insights.md) your API Management instance with Application Insights.

  > [!NOTE]
  > To visualize data in a single dashboard, configure the Log Analytics workspace for the diagnostic settings and the Application Insights instance in the same resource group as your API Management instance.

On your Managed Grafana workspace:

- To create a Managed Grafana instance and workspace, see the quickstart for the [portal](../managed-grafana/quickstart-managed-grafana-portal.md) or the [Azure CLI](../managed-grafana/quickstart-managed-grafana-cli.md).
- The Managed Grafana instance must be in the same subscription as the API Management instance.
- When created, the Grafana workspace is automatically assigned a Microsoft Entra managed identity, which is assigned the Monitor Reader role on the subscription. This approach gives you immediate access to Azure Monitor from the new Grafana workspace without needing to set permissions manually. Learn more about [configuring data sources](../managed-grafana/how-to-data-source-plugins-managed-identity.md) for Managed Grafana.

First import the [API Management dashboard](https://grafana.com/grafana/dashboards/16604-azure-api-management) to your Management Grafana workspace.

To import the dashboard:

1. Go to your Azure Managed Grafana workspace. In the portal, on the **Overview** page of your Managed Grafana instance, select the **Endpoint** link. 
1. In the Managed Grafana workspace, go to **Dashboards** > **Browse** > **Import**.
1. On the **Import** page, under **Import via grafana.com**, enter *16604* and select **Load**. 
1. Select an **Azure Monitor data source**, review or update the other options, and select **Import**.

To use the API Management dashboard:

1. In the Managed Grafana workspace, go to **Dashboards** > **Browse** and select your API Management dashboard.
1. In the dropdowns at the top, make selections for your API Management instance. If configured, select an Application Insights instance and a Log Analytics workspace.  

Review the default visualizations on the dashboard, which appears similar to the following screenshot:

:::image type="content" source="media/visualize-using-managed-grafana-dashboard/api-management-dashboard.png" alt-text="Screenshot of API Management dashboard in Managed Grafana workspace." lightbox="media/visualize-using-managed-grafana-dashboard/api-management-dashboard.png":::

[!INCLUDE [azmon-horz-export-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-export-data.md)]

[!INCLUDE [azmon-horz-kusto](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-kusto.md)]

[!INCLUDE [azmon-horz-alerts-part-one](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-one.md)]

To see how to set up an alert rule in Azure API Management, see [Set up an alert rule](api-management-howto-use-azure-monitor.md#set-up-an-alert-rule).

[!INCLUDE [azmon-horz-alerts-part-two](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-two.md)]

[!INCLUDE [azmon-horz-advisor](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-advisor.md)]

## Related content

- [API Management monitoring data reference](monitor-api-management-reference.md)
- [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)
