---
title: Tutorial - Monitor published APIs in Azure API Management | Microsoft Docs
description: Follow the steps of this tutorial to learn how to use metrics, alerts, activity logs, and resource logs to monitor your APIs in Azure API Management.
services: api-management
author: vladvino

ms.service: api-management
ms.custom: mvc
ms.topic: tutorial
ms.date: 10/14/2020
ms.author: apimpm
---
# Tutorial: Monitor published APIs

With Azure Monitor, you can visualize, query, route, archive, and take actions on the metrics or logs coming from your Azure API Management service.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * View metrics of your API 
> * Set up an alert rule 
> * View activity logs
> * Enable and view resource logs

You can also use API Management's built-in [analytics](howto-use-analytics.md) to monitor the usage and performance of your APIs.

## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Also, complete the following tutorial: [Import and publish your first API](import-and-publish.md).

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## View metrics of your APIs

API Management emits [metrics](../azure-monitor/essentials/data-platform-metrics.md) every minute, giving you near real-time visibility into the state and health of your APIs. The following are the two most frequently used metrics. For a list of all available metrics, see [supported metrics](../azure-monitor/essentials/metrics-supported.md#microsoftapimanagementservice).

* **Capacity** - helps you make decisions about upgrading/downgrading your APIM services. The metric is emitted per minute and reflects the gateway capacity at the time of reporting. The metric ranges from 0-100 calculated based on gateway resources such as CPU and memory utilization.
* **Requests** - helps you analyze API traffic going through your API Management services. The metric is emitted per minute and reports the number of gateway requests with dimensions including response codes, location, hostname, and errors. 

> [!IMPORTANT]
> The following metrics have been deprecated as of May 2019 and will be retired in August 2023: Total Gateway Requests, Successful Gateway Requests, Unauthorized Gateway Requests, Failed Gateway Requests, Other Gateway Requests. Please migrate to the Requests metric which provides equivalent functionality.

:::image type="content" source="media/api-management-howto-use-azure-monitor/apim-monitor-metrics.png" alt-text="Screenshot of Metrics in API Management Overview":::

To access metrics:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance. On the **Overview** page, review key metrics for your APIs.
1. To investigate metrics in detail, select **Metrics** from the menu near the bottom of the page.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/api-management-metrics-blade.png" alt-text="Screenshot of Metrics item in Monitoring menu":::

1. From the drop-down, select metrics you are interested in. For example, **Requests**. 
1. The chart shows the total number of API calls.
1. The chart can be filtered using the dimensions of the **Requests** metric. For example, select **Add filter**, select **Backend Response Code Category**, enter 500 as the value. Now the chart shows the number of requests that were failed in the API backend.   

## Set up an alert rule 

You can receive [alerts](../azure-monitor/alerts/alerts-metric-overview.md) based on metrics and activity logs. Azure Monitor allows you to [configure an alert](../azure-monitor/alerts/alerts-metric.md) to do the following when it triggers:

* Send an email notification
* Call a webhook
* Invoke an Azure Logic App

To configure an example alert rule based on a request metric:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Select **Alerts** from the menu bar near the bottom of the page.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/alert-menu-item.png" alt-text="Screenshot of Alerts option in Monitoring menu":::

1. Select **+ New alert rule**.
1. In the **Create alert rule** window, **Select condition**.
1. In the **Configure signal logic** window:
    1. In **Signal type**, select **Metrics**.
    1. In **Signal name**, select **Requests**.
    1. In **Split by dimensions**, in **Dimension name**, select **Gateway Response Code Category**.
    1. In **Dimension values**, select **4xx**, for client errors such as unauthorized or invalid requests.
    1. In **Alert logic**, specify a threshold after which the alert should be triggered and select **Done**.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/threshold.png" alt-text="Screenshot of Configure Signal Logic windows":::

1. Select an existing action group or create a new one. In the following example, a new action group is created. A notification email will be sent to admin@contoso.com. 

    :::image type="content" source="media/api-management-howto-use-azure-monitor/action-details.png" alt-text="Screenshot of notifications for new action group":::

1. Enter a name and description of the alert rule and select the severity level. 
1. Select **Create alert rule**.
1. Now, test the alert rule by calling the Conference API without an API key. For example:

    ```bash
    curl GET https://apim-hello-world.azure-api.net/conference/speakers HTTP/1.1 
    ```

    An alert will be triggered based on the evaluation period, and email will be sent to admin@contoso.com. 

    Alerts also appear on the **Alerts** page for the API Management instance.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/portal-alerts.png" alt-text="Screenshot of alerts in portal":::

## Activity logs

Activity logs provide insight into the operations that were performed on your API Management services. Using activity logs, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) taken on your API Management services.

> [!NOTE]
> Activity logs do not include read (GET) operations or operations performed in the Azure portal or using the original Management APIs.

You can access activity logs in your API Management service, or access logs of all your Azure resources in Azure Monitor. 

:::image type="content" source="media/api-management-howto-use-azure-monitor/api-management-activity-logs.png" alt-text="Screenshot of activity log in portal":::

To view the activity log:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.

1. Select **Activity log**.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/api-management-activity-logs-blade.png" alt-text="Screenshot of Activity log item in Monitoring menu":::
1. Select the desired filtering scope and then **Apply**.

## Resource logs

Resource logs provide rich information about operations and errors that are important for auditing as well as troubleshooting purposes. Resource logs differ from activity logs. The activity log provides insights into the operations that were performed on your Azure resources. Resource logs provide insight into operations that your resource performed.

To configure resource logs:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
2. Select **Diagnostic settings**.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/api-management-diagnostic-logs-blade.png" alt-text="Screenshot of Diagnostic settings item in Monitoring menu":::

1. Select **+ Add diagnostic setting**.
1. Select the logs or metrics that you want to collect.

   You can archive resource logs along with metrics to a storage account, stream them to an Event Hub, or send them to a Log Analytics workspace. 

For more information, see [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md).

## View diagnostic data in Azure Monitor

If you enable collection of GatewayLogs or metrics in a Log Analytics workspace, it can take a few minutes for data to appear in Azure Monitor. To view the data:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Select **Logs** from the menu near the bottom of the page.

    :::image type="content" source="media/api-management-howto-use-azure-monitor/logs-menu-item.png" alt-text="Screenshot of Logs item in Monitoring menu":::

Run queries to view the data. Several [sample queries](../azure-monitor/logs/example-queries.md) are provided, or run your own. For example, the following query retrieves the most recent 24 hours of data from the GatewayLogs table:

```kusto
ApiManagementGatewayLogs
| where TimeGenerated > ago(1d) 
```

For more information about using resource logs for API Management, see:

* [Get started with Azure Monitor Log Analytics](../azure-monitor/logs/log-analytics-tutorial.md), or try the [Log Analytics Demo environment](https://portal.loganalytics.io/demo).

* [Overview of log queries in Azure Monitor](../azure-monitor/logs/log-query-overview.md).

The following JSON indicates a sample entry in GatewayLogs for a successful API request. For details, see the [schema reference](gateway-log-schema-reference.md). 

```json
{
    "Level": 4,
    "isRequestSuccess": true,
    "time": "2020-10-14T17:xx:xx.xx",
    "operationName": "Microsoft.ApiManagement/GatewayLogs",
    "category": "GatewayLogs",
    "durationMs": 152,
    "callerIpAddress": "xx.xx.xxx.xx",
    "correlationId": "3f06647e-xxxx-xxxx-xxxx-530eb9f15261",
    "location": "East US",
    "properties": {
        "method": "GET",
        "url": "https://apim-hello-world.azure-api.net/conference/speakers",
        "backendResponseCode": 200,
        "responseCode": 200,
        "responseSize": 41583,
        "cache": "none",
        "backendTime": 87,
        "requestSize": 526,
        "apiId": "demo-conference-api",
        "operationId": "GetSpeakers",
        "apimSubscriptionId": "master",
        "clientTime": 65,
        "clientProtocol": "HTTP/1.1",
        "backendProtocol": "HTTP/1.1",
        "apiRevision": "1",
        "clientTlsVersion": "1.2",
        "backendMethod": "GET",
        "backendUrl": "https://conferenceapi.azurewebsites.net/speakers"
    },
    "resourceId": "/SUBSCRIPTIONS/<subscription ID>/RESOURCEGROUPS/<resource group>/PROVIDERS/MICROSOFT.APIMANAGEMENT/SERVICE/APIM-HELLO-WORLD"
}
```

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