---
# Mandatory fields.
title: View metrics with Azure Monitor
titleSuffix: Azure Digital Twins
description: See how to view Azure Digital Twins metrics in Azure Monitor.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/24/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# View and understand Azure Digital Twins metrics

These metrics give you information about the state of Azure Digital Twins resources in your Azure subscription. Azure Digital Twins metrics help you assess the overall health of Azure Digital Twins service and the resources connected to it. These user-facing statistics help you see what is going on with your Azure Digital Twins and help perform root-cause analysis on issues without needing to contact Azure support.

Metrics are enabled by default. You can view Azure Digital Twins metrics from the [Azure portal](https://portal.azure.com).

## How to view Azure Digital Twins metrics

1. Create an Azure Digital Twins instance. You can find instructions on how to set up an Azure Digital Twins instance in [*How-to: Set up an instance and authentication*](how-to-set-up-instance-scripted.md).

2. Find your Azure Digital Twins instance in the [Azure portal](https:/portal.azure.com) (you can open the page for it by typing its name into the portal search bar). 

    From the instance's menu, select **Metrics**.
   
    :::image type="content" source="media/how-to-view-metrics/azure-digital-twins-metrics.png" alt-text="Screenshot showing the metrics page for Azure Digital Twins":::

    This page displays the metrics for your Azure Digital Twins instance. You can also create custom views of your metrics by selecting the ones you want to see from the list.
    
3. You can choose to send your metrics data to an Event Hubs endpoint or an Azure Storage account by clicking **Diagnostics settings** from the menu, then **Add diagnostic setting**.

    :::image type="content" source="media/how-to-view-metrics/diagnostic-settings.png" alt-text="Screenshot showing the diagnostic settings page and button to add":::

    For more information about this process, see [*How-to: Set up diagnostics*](how-to-set-up-diagnostics.md).

## Azure Digital Twins metrics and how to use them

Azure Digital Twins provides several metrics to give you an overview of the health of your instance and its associated resources. You can also combine information from multiple metrics to paint a bigger picture of the state of your instance. 

The following tables describe the metrics tracked by each Azure Digital Twins instance, and how each metric relates to the overall status of your instance.

#### API request metrics

Metrics having to do with API requests:

| Metric | Metric display name | Unit | Aggregation type| Description | Dimensions |
| --- | --- | --- | --- | --- | --- |
| ApiRequests | API Requests (Preview) | Count | Total | The number of API Requests made for Digital Twins read, write, delete, and query operations. |  Authentication </br>Operation </br>Protocol </br>Status Code </br>Status Code Class </br>Status Text |
| ApiRequestsLatency | API Requests Latency (Preview) | Milliseconds | Average | The response time for API requests. This refers to the time from when the request is received by Azure Digital Twins until the service sends a success/fail result for Digital Twins read, write, delete, and query operations. | Authentication </br>Operation </br>Protocol |
| ApiRequestsFailureRate | API Requests Failure Rate (Preview) | Percent | Average | The percentage of API requests that the service receives for your instance that give an internal error (500) response code for Digital Twins read, write, delete, and query operations. | Authentication </br>Operation </br>Protocol </br>Status Code </br>Status Code Class </br>Status Text

#### Routing metrics

Metrics having to do with routing:

| Metric | Metric display name | Unit | Aggregation type| Description | Dimensions |
| --- | --- | --- | --- | --- | --- |
| Routing | Routing (Preview) | Count | Total | The number of messages routed to an endpoint Azure service such as Event Hub, Service Bus, or Event Grid. | Operation </br>Result |
| RoutingLatency | Routing Latency (Preview) | Milliseconds | Average | Time elapsed between an event getting routed from Azure Digital Twins to when it is posted to the endpoint Azure service such as Event Hub, Service Bus, or Event Grid. | Operation </br>Result |
| RoutingFailureRate | Routing Failure Rate (Preview) | Percent | Average | The percentage of events that result in an error as they are routed from Azure Digital Twins to an endpoint Azure service such as Event Hub, Service Bus, or Event Grid. | Operation </br>Result |

#### Billing metrics

Metrics having to do with billing:

>[!NOTE]
> During preview, **billing is zero cost**. While these metrics still show up in the selectable list, they do not apply during preview and will remain at zero until the service moves beyond preview.

| Metric | Metric display name | Unit | Aggregation type| Description | Dimensions |
| --- | --- | --- | --- | --- | --- |
| BillingApiOperations | Billing API Operations (Preview) | Count | Total | Billing metric for the count of all API requests made against the Azure Digital Twins service. | `MeterId` |
| BillingQueryUnits | Billing Query Units (Preview) | Count | Total | The number of Query Units, an internally computed measure of service resource usage, consumed to execute queries. There is also a helper API available for measuring Query Units: [QueryChargeHelper Class](https://docs.microsoft.com/dotnet/api/azure.digitaltwins.core.querychargehelper?view=azure-dotnet-preview) | `MeterId` |
| BillingMessagesProcessed | Billing Messages Processed (Preview) | Count | Total | Billing metric for the number of messages sent out from Azure Digital Twins to external endpoints. | `MeterId` |

## Dimensions

Dimensions help identify more details about the metrics. Some of the routing metrics provide information per endpoint. The table below lists possible values for these dimensions.

| Dimension | Values |
| --- | --- |
| Authentication | OAuth |
| Operation (for API Requests) | Microsoft.DigitalTwins/digitaltwins/delete</br>Microsoft.DigitalTwins/digitaltwins/write</br>Microsoft.DigitalTwins/digitaltwins/read </br>Microsoft.DigitalTwins/eventroutes/read </br>Microsoft.DigitalTwins/eventroutes/write </br>Microsoft.DigitalTwins/eventroutes/delete </br>Microsoft.DigitalTwins/models/read </br>Microsoft.DigitalTwins/models/write </br>Microsoft.DigitalTwins/models/delete </br>Microsoft.DigitalTwins/query/action |
Operation (for Routing) | Event Grid </br>Event Hub </br>Service Bus |
| Protocol | HTTPS |
| Result | Success </br>Failure |
| Status Code | 200, 404, 500, and so on. |
| Status Code Class | 2xx, 4xx, 5xx, and so on. |
| Status Text | Internal Server Error, Not Found, and so on. |

## Next steps

To learn more about managing recorded metrics for Azure Digital Twins, see [*How-to: Set up diagnostics*](how-to-set-up-diagnostics.md).

Or, now that you’ve seen an overview of Azure Digital Twins metrics, follow these links to learn more about managing Azure Digital Twins:

* [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md)
* [*How-to: Manage custom models*](how-to-manage-model.md)
* [*How-to: Manage digital twins*](how-to-manage-twin.md)
* [*How-to: Manage the twin graph with relationships*](how-to-manage-graph.md)
* [*How-to: Manage endpoints and routes*](how-to-manage-routes.md)