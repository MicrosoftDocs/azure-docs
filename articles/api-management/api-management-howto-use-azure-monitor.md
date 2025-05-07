---
title: Tutorial - Monitor published APIs in Azure API Management | Microsoft Docs
description: Learn how to use metrics, alerts, activity logs, and resource logs to monitor your APIs in Azure API Management.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.custom: engagement-fy23, devdivchpfy22
ms.topic: tutorial
ms.date: 11/01/2024
ms.author: danlep
---
# Tutorial: Monitor published APIs

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

With Azure Monitor, you can visualize, query, route, archive, and take actions on the metrics or logs coming from your Azure API Management service. For an overview of Azure Monitor for API Management, see [Monitor API Management](monitor-api-management.md).

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

In this tutorial, you learn how to:

> [!div class="checklist"]
> * View metrics of your API
> * Set up an alert rule
> * View activity logs
> * Enable and view resource logs

> [!NOTE]
> API Management supports a range of additional tools to observe APIs, including [built-in analytics](howto-use-analytics.md) and integration with [Application Insights](api-management-howto-app-insights.md). [Learn more](observability.md)
> 
## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Also, complete the following tutorial: [Import and publish your first API](import-and-publish.md).

## View metrics of your APIs

API Management emits [metrics](/azure/azure-monitor/essentials/data-platform-metrics) every minute, giving you near real-time visibility into the state and health of your APIs. The following are the most frequently used metrics. For a list of all available metrics, see [Metrics](monitor-api-management-reference.md#metrics).

* **Capacity** - helps you make decisions about upgrading/downgrading your API Management services. The metric is emitted per minute and reflects the estimated gateway capacity at the time of reporting. The metric ranges from 0-100 calculated based on gateway resources such as CPU and memory utilization and other factors.

    > [!TIP]
    > In the [v2 service tiers](v2-service-tiers-overview.md), API Management has replaced the capacity metric with separate CPU and memory utilization metrics. These metrics can also be used for scaling decisions and troubleshooting. [Learn more](api-management-capacity.md)

* **Requests** - helps you analyze API traffic going through your API Management services. The metric is emitted per minute and reports the number of gateway requests with dimensions. Filter requests by response codes, location, hostname, and errors.

> [!IMPORTANT]
> The following metrics have been retired: Total Gateway Requests, Successful Gateway Requests, Unauthorized Gateway Requests, Failed Gateway Requests, Other Gateway Requests. Please migrate to the Requests metric which provides closely similar functionality.

:::image type="content" source="media/api-management-howto-use-azure-monitor/apim-monitor-metrics-1.png" alt-text="Screenshot of Metrics in API Management Overview":::

To access metrics:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance. On the **Overview** page, on the **Monitor** tab, review key metrics for your APIs.
1. To investigate metrics in detail, select **Monitoring** > **Metrics** from the left menu.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/api-management-metrics-blade.png" alt-text="Screenshot of Metrics item in Monitoring menu in the portal.":::

1. From the drop-down, select metrics you're interested in. For example, **Requests**.
1. The chart shows the total number of API calls. Adjust the time range to focus on periods of interest.
1. You can filter the chart using the dimensions of the **Requests** metric. For example, select **Add filter**, select **Backend Response Code Category**, enter `500` as the value. The chart shows the number of requests failed in the API backend.

## Set up an alert rule

You can receive [alerts](/azure/azure-monitor/alerts/alerts-metric-overview) based on metrics and activity logs. In Azure Monitor, [configure an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule) to perform an action when it triggers. Common actions include:

* Send an email notification
* Call a webhook
* Invoke an Azure Logic App

To configure an example alert rule based on a request metric:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Select **Monitoring** > **Alerts** from the left menu.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/alert-menu-item.png" alt-text="Screenshot of Alerts option in Monitoring menu in the portal.":::

1. Select **+ Create** > **Alert rule**.
1. On the **Condition** tab:
    1. In **Signal name**, select **Requests**.
    1. In **Alert logic**, review or modify the default values for the alert. For example, update the static **Threshold**, which is the number of occurrences after which the alert should be triggered.
    1. In **Split by dimensions**, in **Dimension name**, select **Gateway Response Code Category**.
    1. In **Dimension values**, select **4xx**, for client errors such as unauthorized or invalid requests. If the dimension value doesn't appear, select **Add custom value** and enter **4xx**.
    1. In **When to evaluate**, accept the default settings, or select other settings to configure how often the rule runs. Select **Next**.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/threshold-1.png" alt-text="Screenshot of configuring alert logic in the portal.":::

1. On the **Actions** tab, select or create one or more *action groups* to notify users about the alert and take an action. For example, create a new action group to send a notification email to `admin@contoso.com`. For detailed steps, see [Create and manage action groups in the Azure portal](/azure/azure-monitor/alerts/action-groups).

    :::image type="content" source="media/api-management-howto-use-azure-monitor/action-details.png" alt-text="Screenshot of configuring notifications for new action group in the portal.":::

1. On the **Details** tab of **Create an alert rule**, enter a name and description of the alert rule and select the severity level.
1. Optionally configure the remaining settings. Then, on the **Review + create** tab, select **Create**.
1. Optionally test the alert rule by using an HTTP client to simulate a request that triggers the alert. For example, run the following command in a terminal, substituting the API Management hostname with the hostname of your API Management instance:

    ```bash
    curl GET https://contoso.azure-api.net/non-existent-endpoint HTTP/1.1 
    ```

    An alert triggers based on the evaluation period, and it will send email to admin@contoso.com. 

    Alerts also appear on the **Alerts** page for the API Management instance.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/portal-alerts.png" alt-text="Screenshot of alerts in portal.":::

## Activity logs

Activity logs provide insight into the operations on your API Management services. Using activity logs, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) taken on your API Management services.

> [!NOTE]
> Activity logs do not include read (GET) operations or operations performed in the Azure portal.

You can access activity logs in your API Management service, or access logs of all your Azure resources in Azure Monitor. 

:::image type="content" source="media/api-management-howto-use-azure-monitor/api-management-activity-logs.png" alt-text="Screenshot of activity log in portal.":::

To view the activity log:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.

1. Select **Activity log**.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/api-management-activity-logs-blade.png" alt-text="Screenshot of Activity log item in Monitoring menu in the portal.":::
1. Select the desired filtering scope and then **Apply**.

## Resource logs

Resource logs (Azure Monitor logs) provide rich information about API Management operations and errors that are important for auditing and troubleshooting purposes. When enabled through a diagnostic setting, the logs collect information about the API requests that are received and processed by the API Management gateway.

> [!NOTE]
> The Consumption tier doesn't support the collection of resource logs.

To configure resource logs:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
2. Select **Monitoring** > **Diagnostic settings**.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/api-management-diagnostic-logs-blade.png" alt-text="Screenshot of Diagnostic settings item in Monitoring menu in the portal.":::

1. Select **+ Add diagnostic setting**.
1. Select the logs or metrics that you want to collect.

   You have several options about where to send the logs and metrics. For example, archive resource logs along with metrics to a storage account, stream them to an event hub, or send them to a Log Analytics workspace.

   > [!TIP]
   > If you select a Log Analytics workspace, you can choose to store the data in the resource-specific ApiManagementGatewayLogs table or store in the general AzureDiagnostics table. We recommend using the resource-specific table for log destinations that support it. [Learn more](/azure/azure-monitor/essentials/resource-logs#send-to-log-analytics-workspace)

1. After configuring details for the log destination or destinations, select **Save**. 

> [!NOTE]
> Adding a diagnostic setting object might result in a failure if the [MinApiVersion property](/dotnet/api/microsoft.azure.management.apimanagement.models.apiversionconstraint.minapiversion) of your API Management service is set to any API version higher than 2022-09-01-preview. 

For more information, see [Create diagnostic settings to send platform logs and metrics to different destinations](/azure/azure-monitor/essentials/diagnostic-settings).
 
## View logs and metrics in Azure Monitor

If you enable collection of logs or metrics in a Log Analytics workspace, it can take a few minutes for data to appear in Azure Monitor. 

To view the data:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Select **Logs** from the left menu.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/logs-menu-item.png" alt-text="Screenshot of Logs item in Monitoring menu in the portal.":::

1. Run queries to view the data. Several [sample queries](/azure/azure-monitor/logs/queries) are provided, or run your own. For example, the following query retrieves the most recent 24 hours of data from the ApiManagementGatewayLogs table:

    ```kusto
    ApiManagementGatewayLogs
    | where TimeGenerated > ago(1d) 
    ```

    :::image type="content" source="media/api-management-howto-use-azure-monitor/query-resource-logs.png" alt-text="Screenshot of querying ApiManagementGatewayLogs table in the portal." lightbox="media/api-management-howto-use-azure-monitor/query-resource-logs.png":::

For more information about using resource logs for API Management, see:

* [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).

* [Overview of log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview).

* [API Management resource log schema reference](gateway-log-schema-reference.md). 

## Modify API logging settings

By default, when you create a diagnostic setting to enable collection of resource logs, logging is enabled for all APIs, with default settings. You can adjust the logging settings for all APIs, or override them for individual APIs. For example, adjust the sampling rate or the verbosity of the data, enable logging of headers or request or response payloads, or disable logging for some APIs.

For details about the logging settings, see [Diagnostic logging settings reference](diagnostic-logs-reference.md).

To configure logging settings for all APIs:

1. In the left menu of your API Management instance, select **APIs** > **APIs** > **All APIs**.
1. Select the **Settings** tab from the top bar.
1. Scroll down to the **Diagnostic Logs** section, and select the **Azure Monitor** tab.
1. Review the settings and make changes if needed. Select **Save**. 

To configure logging settings for a specific API:

1. In the left menu of your API Management instance, select **APIs** > **APIs** and then the name of the API.
1. Select the **Settings** tab from the top bar.
1. Scroll down to the **Diagnostic Logs** section, and select the **Azure Monitor** tab.
1. Review the settings and make changes if needed. Select **Save**. 

[!INCLUDE [api-management-log-entry-size-limit](../../includes/api-management-log-entry-size-limit.md)]

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * View metrics of your API
> * Set up an alert rule
> * View activity logs
> * Enable and view resource logs


Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Trace calls](api-management-howto-api-inspector.md)
