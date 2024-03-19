---
title: Use API analytics in Azure API Management | Microsoft Docs
description: Use analytics in Azure API Management to understand and categorize the usage of your APIs and API performance. Analytics is provided using an Azure workbook.
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 03/18/2024
ms.author: danlep
---

# Get API analytics in Azure API Management

[!INCLUDE [premium-dev-standard-basic-standardv2-basicv2.md](../../includes/api-management-availability-premium-dev-standard-basic-standardv2-basicv2.md)]

Azure API Management provides built-in analytics for your APIs so that you can analyze their usage and performance. Use analytics for high-level monitoring and troubleshooting of your APIs. For other monitoring features, including near real-time metrics and resource logs for diagnostics and auditing, see [Tutorial: Monitor published APIs](api-management-howto-use-azure-monitor.md).

:::image type="content" source="media/howto-use-analytics/analytics-report-portal.png" alt-text="Screenshot of API analytics in the portal." lightbox="media/howto-use-analytics/analytics-report-portal.png":::


## About API analytics

* API Management provides analytics using an [Azure workbook](../azure-monitor/visualize/workbooks-overview.md) based on data in an Azure Log Analytics workspace. 

* In the classic service tiers, your API Management instance also includes a legacy *analytics dashboard* in the Azure portal, and analytics data can be accessed using the API Management REST API. Equivalent data is shown in the analytics workbook and dashboard.

> [!IMPORTANT]
> * The Azure workbook is the recommended way to access analytics data.
> * The legacy analytics dashboard isn't provided in the v2 tiers. 

With API analytics, analyze the usage and performance of the APIs in your API Management instance across several dimensions, including:

* Time
* Geography
* APIs
* API operations
* Products
* Subscriptions
* Users
* Requests

> [!NOTE]
> * API analytics provides data on requests, including failed and unauthorized requests.
> * Geography values are approximate based on IP address mapping.
> * There may be a delay of 15 minutes or more in the availability of analytics data.

## Analytics workbook

To use the Azure API Management Analytics workbook, you need to configure a Log Analytics workspace as a data source for API Management gateway logs. 

If you need to configure one, the following are brief steps to send gateway logs to a Log Analytics workspace. For more information, see [Tutorial: Monitor published APIs](api-management-howto-use-azure-monitor.md#resource-logs). This is a one-time setup.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left-hand menu, under **Monitoring**, select **Diagnostic settings** > **+ Add diagnostic setting**.
1. Enter a descriptive name for the diagnostic setting.
1. In **Logs**, select **Logs related to ApiManagement Gateway**.
1. In **Destination details**, select **Send to Log Analytics** and select a Log Analytics workspace in the same or a different subscription. If you need to create a workspace, see [Create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md).
1. Accept defaults for other settings, or customize as needed. Select **Save**.

### Access the workbook

After a Log Analytics workspace is configured, access the Azure API Management Analytics workbook to analyze the usage and performance of your APIs.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left-hand menu, under **Monitoring**, select **Insights**. The workbook with analytics data opens.
1. Select a time range for data.
1. Select a report category for analytics data, such as **Timeline**, **Geography**, and so on.

> [!TIP]
> Azure workbooks are customizable and can be shared with others. You can also create your own workbooks based on the Azure API Management Analytics workbook. [Learn more](../azure-monitor/visualize/workbooks-manage.md).

## Analytics dashboard

A legacy analytics dashboard is also available in the Azure portal, and analytics data can be accessed using the API Management REST API. 

### Analytics dashboard - portal

To access the analytics dashboard in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance. 
1. In the left-hand menu, under **Monitoring**, select **Analytics**. 
1. Select a time range for data, or enter a custom time range.
1. Select a report category for analytics data, such as **Timeline**, **Geography**, and so on.
1. Optionally, filter the report by one or more additional categories.

### Analytics - REST API

Use [Reports](/rest/api/apimanagement/reports) operations in the API Management REST API to retrieve and filter analytics data for your API Management instance.

Available operations return report records by API, geography, API operations, product, request, subscription, time, or user.

## Related content

* For an introduction to Azure Monitor features in API Management, see [Tutorial: Monitor published APIs](api-management-howto-use-azure-monitor.md)
* For detailed HTTP logging and monitoring, see [Monitor your APIs with Azure API Management, Event Hubs, and Moesif](api-management-log-to-eventhub-sample.md).
* Learn about integrating [Azure API Management with Azure Application Insights](api-management-howto-app-insights.md).
* Learn about [Azure workbook templates](../azure-monitor/visualize/workbooks-templates.md).
