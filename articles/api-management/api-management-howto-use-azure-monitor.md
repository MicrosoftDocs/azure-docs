---
title: Monitor API Management with Azure Monitor | Microsoft Docs
description: Learn how to monitor Azure API Management service using Azure Monitor.
services: api-management
documentationcenter: ''
author: miaojiang
manager: erikre
editor: ''

ms.assetid: 2fa193cd-ea71-4b33-a5ca-1f55e5351e23
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2017
ms.author: apimpm
---
# Monitor API Management with Azure Monitor
Azure Monitor is an Azure service that provides a single source for monitoring all your Azure resources. With Azure Monitor, you can visualize, query, route, archive, and take actions on the metrics and logs coming from Azure resources such as API Management. 

The following video shows how to monitor API Management using Azure Monitor. For more information about Azure Monitor, see [Get Started with Azure Monitor]. 


> [!VIDEO https://channel9.msdn.com/Blogs/AzureApiMgmt/Monitor-API-Management-with-Azure-Monitor/player]
>
>
 
## Metrics
API Management currently emits five metrics and we plan to add more in the future. These metrics are emitted every minute, giving you near real-time visibility into the state and health of your APIs. Following is a summary of the metrics:
* Total Gateway Requests: the number of API requests in the period. 
* Successful Gateway Requests: the number of API requests that received successful HTTP response codes including 304, 307 and anything smaller than 301 (for example, 200). 
* Failed Gateway Requests: the number of API requests that received erroneous HTTP response codes including 400 and anything larger than 500.
* Unauthorized Gateway Requests: the number of API requests that received HTTP response codes including 401, 403, and 429. 
* Other Gateway Requests: the number of API requests that received HTTP response codes that do not belong to any of the preceding categories (for example, 418).

You can access metrics in your API Management service, or access metrics of all your Azure resources in Azure Monitor. To view metrics in your API Management service:
1. Open the Azure portal.
2. Go to your API Management service.
3. Click **Metrics**.

![Metrics blade][metrics-blade]

For more information about how to use Metrics, see [Overview of Metrics].

## Activity Logs
Activity logs provide insight into the operations that were performed on your API Management services. It was previously known as "audit logs" or "operational logs". Using activity logs, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) taken on your API Management services. 

> [!NOTE]
> Activity logs do not include read (GET) operations or operations performed in the classic Publisher Portal or using the original Management APIs.

You can access activity logs in your API Management service, or access logs of all your Azure resources in Azure Monitor. To view activity logs in your API Management service:
1. Open the Azure portal.
2. Go to your API Management service.
3. Click **Activity log**.

![Activity logs blade][activity-logs-blade]

For more information about how to use Metrics, see [Overview of Activity Logs].

## Alerts
You can configure to receive alerts based on metrics and activity logs. Azure Monitor allows you to configure an alert to do the following when it triggers:

* Send an email notification
* Call a webhook
* Invoke an Azure Logic App

You can configure alert rules in your API Management service, or in Azure Monitor. To configure them in API Management: 
1. Open the Azure portal.
2. Go to your API Management service.
3. Click **Alert rules**.

![Alert rules blade][alert-rules-blade]

For more information about using Alerts, see [Overview of Alerts].

## Diagnostic Logs
Diagnostic logs provide rich information about operations and errors that are important for auditing as well as troubleshooting purposes. Diagnostics logs differ from activity logs. Activity logs provide insights into the operations that were performed on your Azure resources. Diagnostics logs provide insight into operations that your resource performed itself.

API Management currently provides diagnostics logs (batched hourly) about individual API request with each entry having the following structure:

```
{
    "Tenant": "",
      "DeploymentName": "",
      "time": "",
      "resourceId": "",
      "category": "GatewayLogs",
      "operationName": "Microsoft.ApiManagement/GatewayLogs",
      "durationMs": ,
      "Level": ,
      "properties": "{
          "ApiId": "",
          "OperationId": "",
          "ProductId": "",
          "SubscriptionId": "",
          "Method": "",
          "Url": "",
          "RequestSize": ,
          "ServiceTime": "",
          "BackendMethod": "",
          "BackendUrl": "",
          "BackendResponseCode": ,
          "ResponseCode": ,
          "ResponseSize": ,
          "Cache": "",
          "UserId"
      }"
 }
```

You can access diagnostic logs in your API Management service, or access logs of all your Azure resources in Azure Monitor. To view diagnostic logs in your API Management service:
1. Open the Azure portal.
2. Go to your API Management service.
3. Click **Diagnostic log**.

![Diagnostic logs blade][diagnostic-logs-blade]

For more information about how to use Metrics, see [Overview of Diagnostic Logs].

## Next Step

* [Get Started with Azure Monitor]
* [Overview of Metrics]
* [Overview of Activity Logs]
* [Overview of Diagnostic Logs]
* [Overview of Alerts]

[Get Started with Azure Monitor]: ../monitoring-and-diagnostics/monitoring-get-started.md
[Overview of Metrics]: ../monitoring-and-diagnostics/monitoring-overview-metrics.md
[Overview of Activity Logs]: ../monitoring-and-diagnostics/monitoring-overview-activity-logs.md
[Overview of Diagnostic Logs]: ../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md
[Overview of Alerts]: ../monitoring-and-diagnostics/insights-alerts-portal.md



[metrics-blade]: ./media/api-management-azure-monitor/api-management-metrics-blade.png
[activity-logs-blade]: ./media/api-management-azure-monitor/api-management-activity-logs-blade.png
[alert-rules-blade]: ./media/api-management-azure-monitor/api-management-alert-rules-blade.png
[diagnostic-logs-blade]: ./media/api-management-azure-monitor/api-management-diagnostic-logs-blade.png
