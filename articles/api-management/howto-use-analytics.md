---
title: Use API analytics in Azure API Management | Microsoft Docs
description: Use analytics in Azure API Management to help you understand and categorize the usage of your APIs and API performance.
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 02/23/2022
ms.author: danlep
---
# Get API analytics in Azure API Management

Azure API Management provides built-in analytics for your APIs. Analyze the usage and performance of the APIs in your API Management instance across several dimensions, including:

* Time
* Geography
* APIs
* API operations
* Products
* Subscriptions
* Users
* Requests

> [!NOTE]
> * API analytics provides data on requests (including failed and unauthorized requests) that are matched with an API and operation. Other calls aren't reported.
> * Geography values are approximate based on IP address mapping.

:::image type="content" source="media/howto-use-analytics/analytics-report-portal.png" alt-text="Timeline analytics in portal":::

Use analytics for high-level monitoring and troubleshooting of your APIs. For additional monitoring features, including near real-time metrics and resource logs for diagnostics and auditing, see [Tutorial: Monitor published APIs](api-management-howto-use-azure-monitor.md).

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Analytics - portal

Use the Azure portal to review analytics data at a glance for your API Management instance.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance. 
1. In the left-hand menu, under **Monitoring**, select **Analytics**.

    :::image type="content" source="media/howto-use-analytics/monitoring-menu-analytics.png" alt-text="Select analytics for API Management instance in portal":::  
1. Select a time range for data, or enter a custom time range.
1. Select a report category for analytics data, such as **Timeline**, **Geography**, and so on.
1. Optionally, filter the report by one or more additional categories.

## Analytics - REST API

Use [Reports](/rest/api/apimanagement/current-ga/reports) operations in the API Management REST API to retrieve and filter analytics data for your API Management instance.

Available operations return report records by API, geography, API operations, product, request, subscription, time, or user.

## Next steps

* For an introduction to Azure Monitor features in API Management, see [Tutorial: Monitor published APIs](api-management-howto-use-azure-monitor.md)
* For detailed HTTP logging and monitoring, see [Monitor your APIs with Azure API Management, Event Hubs, and Moesif](api-management-log-to-eventhub-sample.md).
* Learn about integrating [Azure API Management with Azure Application Insights](api-management-howto-app-insights.md).
