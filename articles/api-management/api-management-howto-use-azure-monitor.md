---
title: Tutorial - Monitor published APIs in Azure API Management | Microsoft Docs
description: Follow the steps of this tutorial to learn how to monitor your API in Azure API Management.
services: api-management
author: vladvino

ms.service: api-management
ms.custom: mvc
ms.topic: tutorial
ms.date: 10/12/2020
ms.author: apimpm
---
# Tutorial: Monitor published APIs

With Azure Monitor, you can visualize, query, route, archive, and take actions on the metrics or logs coming from Azure API Management resources.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * View metrics of your API 
> * Set up an alert rule when your API gets unauthorized calls
> * View activity logs
> * View resource logs

## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Also, complete the following tutorial: [Import and publish your first API](import-and-publish.md).

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## View metrics of your APIs

API Management emits [metrics](../azure-monitor/platform/data-platform-metrics.md) every minute, giving you near real-time visibility into the state and health of your APIs. The following are the two most frequently used metrics. For a list of all available metrics, see [supported metrics](../azure-monitor/platform/metrics-supported.md#microsoftapimanagementservice).

* **Capacity** - helps you make decisions about upgrading/downgrading your APIM services. The metric is emitted per minute and reflects the gateway capacity at the time of reporting. The metric ranges from 0-100 calculated based on gateway resources such as CPU and memory utilization.
* **Requests** - helps you analyze API traffic going through your API Management services. The metric is emitted per minute and reports the number of gateway requests with dimensions including response codes, location, hostname, and errors. 

> [!IMPORTANT]
> The following metrics have been depr    ecated as of May 2019 and will be retired in August 2023: Total Gateway Requests, Successful Gateway Requests, Unauthorized Gateway Requests, Failed Gateway Requests, Other Gateway Requests. Please migrate to the Requests metric which provides equivalent functionality.

:::image type="content" source="media/api-management-azure-monitor/apim-monitor-metrics.png" alt-text="Metrics in API Management":::

To access metrics:

1. In the Azure portal, navigate to your API Management instance.
1. Select **Metrics** from the menu near the bottom of the page.

    :::image type="content" source="media/api-management-azure-monitor/api-management-metrics-blade.png" alt-text="Metrics in Monitoring menu":::

1. From the drop-down, select metrics you are interested in. For example, **Requests**. 
1. The chart shows the total number of API calls.
1. The chart can be filtered using the dimensions of the **Requests** metric. For example, select **Add filter**, select **Backend Response Code Catgory**, enter 500 as the value. Now the chart shows the number of requests that were failed in the API backend.   

## Set up an alert rule for unauthorized request

You can receive [alerts](../azure-monitor/platform/alerts-metric-overview.md) based on metrics and activity logs. Azure Monitor allows you to [configure an alert](../azure-monitor/platform/alerts-metric.md) to do the following when it triggers:

* Send an email notification
* Call a webhook
* Invoke an Azure Logic App

To configure an alert based on a metric:

1. In the Azure portal, navigate to your API Management instance.
1. Select **Alerts** from the menu bar near the bottom of the page.

    :::image type="content" source="media/api-management-azure-monitor/alert-menu-item.png" alt-text="Alerts in Monitoring menu":::

1. Select **+ New alert rule**.
1. In the **Create alert rule** window, select **Select condition**.
1. In the **Configure signal logic** window:
    1. In **Signal type**, select **Metrics**.
    1. In **Signal name**, select **Requests**.
1. In the **Configure signal logic** window:
    1. In **Split by dimensions**, in **Dimension**, select **Backend response category**.
    1. In **Add custom value**, enter *401* for unauthorized access
    1. In **Dimenstion values**, select 401.
    1. In **Alert logic**, specify a threshold after which the alert should be triggered and select **Done**.

    :::image type="content" source="media/api-management-azure-monitor/threshold.png" alt-text="Configure signal logic":::

7. Select an existing action group or create a new one. In the following example, a notification email will be sent to the admins. 

    :::image type="content" source="media/api-management-azure-monitor/action-details.png" alt-text="Notification for action":::

8. Enter a name and description of the alert rule and select the severity level. 
9. Select **Create alert rule**.
10. Now, try to call the Conference API without an API key. The alert will be triggered and email will be sent to the admins. 

## Activity logs

Activity logs provide insight into the operations that were performed on your API Management services. Using activity logs, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) taken on your API Management services.

> [!NOTE]
> Activity logs do not include read (GET) operations or operations performed in the Azure portal or using the original Management APIs.

You can access activity logs in your API Management service, or access logs of all your Azure resources in Azure Monitor. 

:::image type="content" source="media/api-management-azure-monitor/api-management-activity-logs.png" alt-text="Activity logs":::

To view the activity log:

1. In the Azure portal, navigate to your API Management instance.

1. Select **Activity log**.

    :::image type="content" source="media/api-management-azure-monitor/api-management-activity-logs-blade.png" alt-text="Activity log menu":::
3. Select desired filtering scope and then **Apply**.

## Resource logs

Resource logs provide rich information about operations and errors that are important for auditing as well as troubleshooting purposes. Resource logs differ from activity logs. The activity log provides insights into the operations that were performed on your Azure resources. Resource logs provide insight into operations that your resource performed.

To configure resource logs:

1. In the Azure portal, navigate to your API Management instance.
2. Select **Diagnostic settings**.

    :::image type="content" source="media/api-management-azure-monitor/api-management-diagnostic-logs-blade.png" alt-text="Diagnostic settings menu":::


3. Select **+ Add diagnostic setting**. Select the logs or metrics that you want to collect.

You can archive resource logs along with metrics to a storage account, stream them to an Event Hub, or send them to Azure Monitor logs. 

For more information, see [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/platform/diagnostic-settings.md).

## View data in Azure Monitor

If you enable collection of diagnostic logs in Log Analytics, it can take a few minutes for data to appear in Azure Monitor. To view the data:

1. In the Azure portal, navigate to your API Management instance.
1. Select **Logs** from the menu near the bottom of the page.

Run queries to view the data. Several [sample queries](../azure-monitor/log-query/saved-queries.md) are provided, or run your own. For example, the following query retrieves the most recent 24 hours of data from the ApiManagementGatewayLogs table:

```kusto
ApiManagementGatewayLogs
| where TimeGenerated > ago(1d) 
```

For more information about using resource logs for API Management, see:

* [Schema reference](gateway-logs-schema-reference) for the ApiManagementGatewaylogs table. 

* [Get started with Azure Monitor Log Analytics](../azure-monitor/log-query/get-started-portal.md), or try the [Log Analytics Demo environment](https://portal.loganalytics.io/demo).

* [Overview of log queries in Azure Monitor](../azure-monitor/log-query/log-query-overview.md).


```json
{  
    "isRequestSuccess" : "",
    "time": "",
    "operationName": "",
    "category": "",
    "durationMs": ,
    "callerIpAddress": "",
    "correlationId": "",
    "location": "",
    "httpStatusCodeCategory": "",
    "resourceId": "",
    "properties": {   
        "method": "", 
        "url": "", 
        "clientProtocol": "", 
        "responseCode": , 
        "backendMethod": "", 
        "backendUrl": "", 
        "backendResponseCode": ,
        "backendProtocol": "",  
        "requestSize": , 
        "responseSize": , 
        "cache": "", 
        "cacheTime": "", 
        "backendTime": , 
        "clientTime": , 
        "apiId": "",
        "operationId": "", 
        "productId": "", 
        "userId": "", 
        "apimSubscriptionId": "", 
        "backendId": "",
        "lastError": { 
            "elapsed" : "", 
            "source" : "", 
            "scope" : "", 
            "section" : "" ,
            "reason" : "", 
            "message" : ""
        } 
    }      
}  
```

| Property  | Type | Description |
| ------------- | ------------- | ------------- |
| isRequestSuccess | boolean | True if the HTTP request completed with response status code within 2xx or 3xx range |
| time | date-time | Timestamp of when the gateway starts process the request |
| operationName | string | Constant value 'Microsoft.ApiManagement/GatewayLogs' |
| category | string | Constant value 'GatewayLogs' |
| durationMs | integer | Number of milliseconds from the moment gateway received request until the moment response sent in full. It includes clienTime, cacheTime, and backendTime. |
| callerIpAddress | string | IP address of immediate Gateway caller (can be an intermediary) |
| correlationId | string | Unique http request identifier assigned by API Management |
| location | string | Name of the Azure region where the Gateway that processed the request was located |
| httpStatusCodeCategory | string | Category of http response status code: Successful (301 or less or 304 or 307), Unauthorized (401, 403, 429), Erroneous (400, between 500 and 600), Other |
| resourceId | string | ID of the API Management resource /SUBSCRIPTIONS/\<subscription>/RESOURCEGROUPS/\<resource-group>/PROVIDERS/MICROSOFT.APIMANAGEMENT/SERVICE/\<name> |
| properties | object | Properties of the current request |
| method | string | HTTP method of the incoming request |
| url | string | URL of the incoming request |
| clientProtocol | string | HTTP protocol version of the incoming request |
| responseCode | integer | Status code of the HTTP response sent to a client |
| backendMethod | string | HTTP method of the request sent to a backend |
| backendUrl | string | URL of the request sent to a backend |
| backendResponseCode | integer | Code of the HTTP response received from a backend |
| backendProtocol | string | HTTP protocol version of the request sent to a backend | 
| requestSize | integer | Number of bytes received from a client during request processing | 
| responseSize | integer | Number of bytes sent to a client during request processing | 
| cache | string | Status of API Management cache involvement in request processing (i.e., hit, miss, none) | 
| cacheTime | integer | Number of milliseconds spent on overall API Management cache IO (connecting, sending, and receiving bytes) | 
| backendTime | integer | Number of milliseconds spent on overall backend IO (connecting, sending and receiving bytes) | 
| clientTime | integer | Number of milliseconds spent on overall client IO (connecting, sending and receiving bytes) | 
| apiId | string | API entity identifier for current request | 
| operationId | string | Operation entity identifier for current request | 
| productId | string | Product entity identifier for current request | 
| userId | string | User entity identifier for current request | 
| apimSubscriptionId | string | Subscription entity identifier for current request | 
| backendId | string | Backend entity identifier for current request | 
| LastError | object | Last request processing error | 
| elapsed | integer | Number of milliseconds elapsed between when the gateway received the request  and the moment the error occurred | 
| source | string | Name of the policy or processing internal handler caused the error | 
| scope | string | Scope of the policy document containing the policy that caused the error | 
| section | string | Section of the policy document containing the policy that caused the error | 
| reason | string | Error reason | 
| message | string | Error message | 

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * View activity logs
> * View resource logs
> * View metrics of your API
> * Set up an alert rule when your API gets unauthorized calls

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Trace calls](api-management-howto-api-inspector.md)
