---
title: Troubleshoot Event Grid issues
description: This article provides different ways of troubleshooting Azure Event Grid issues
ms.topic: conceptual
ms.date: 07/18/2022
---

# Troubleshoot Azure Event Grid issues
This article provides information that helps you with troubleshooting Azure Event Grid issues. 

## Azure Event Grid status in a region
You can view status of Event Grid in a particular region using the [Azure status dashboard](https://status.azure.com/en-us/status).

## Diagnostic logs
Enable diagnostic settings for Event Grid topics or domains to capture and view publish and delivery failure logs. For more information, see [Diagnostic logs](enable-diagnostic-logs-topic.md).

## Metrics
You can view metrics for Event Grid topics and subscriptions, and create alerts on them. For more information, see [Event Grid metrics](monitor-event-delivery.md).

## Alerts
Create alerts on Azure Event Grid metrics and activity log operations. For more information, see [Alerts on Event Grid metrics and activity logs](set-alerts.md).

## Subscription validation issues
During event subscription creation, you may receive an error message that says the validation of the provided endpoint failed. For troubleshooting subscription validation issues, see [Troubleshoot Event Grid subscription validations](troubleshoot-subscription-validation.md). 

## Network connectivity issues
There are various reasons for client applications not able to connect to an Event Grid topic/domain. The connectivity issues that you experience may be permanent or transient. To learn how to resolve these issues, see [Troubleshoot connectivity issues](troubleshoot-network-connectivity.md).

## Error codes
If you receive error messages with error codes like 400, 409, and 403, see [Troubleshoot Event Grid errors](troubleshoot-errors.md). 

## Distributed tracing
The Event Grid libraries in .NET, Java, Python, and JavaScript support distributing tracing. To adhere to the [CloudEvents specification's guidance](https://github.com/cloudevents/spec/blob/v1.0.1/extensions/distributed-tracing.md) on distributing tracing, the library sets the `traceparent` and `tracestate` attributes of a `CloudEvent` extension when distributed tracing is enabled.

To learn more about how to enable distributed tracing in your application, see the Azure SDK distributed tracing documentation:

- [.NET](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/core/Azure.Core/samples/Diagnostics.md#Distributed-tracing)
- [Java](/azure/developer/java/sdk/tracing)
- [Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/core/azure-core-tracing-opentelemetry)
- [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/core/README.md#tracing)

To enable end-to-end tracing for an [Azure Event Hubs](handler-event-hubs.md) or [Azure Service Bus](handler-service-bus.md) Event Grid subscription, configure [custom delivery properties](delivery-properties.md) to forward the `traceparent` CloudEvent extension attribute to the `Diagnostic-Id` AMQP application property. 

Here's an example of a subscription that has tracing delivery properties configured for Event Hubs:

```azurecli
az eventgrid event-subscription create --name <event-grid-subscription-name> \
    --source-resource-id <event-grid-resource-id>
    --endpoint-type eventhub \
    --endpoint <event-hubs-endpoint> \
    --delivery-attribute-mapping Diagnostic-Id dynamic traceparent
```

Azure Functions supports [distributed tracing with Azure Monitor](../azure-monitor/app/azure-functions-supported-features.md), which includes built-in tracing of executions and bindings, performance monitoring, and more.

[Microsoft.Azure.WebJobs.Extensions.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid/) package version 3.1.0 or later enables correlation for CloudEvents between producer calls and Functions Event Grid trigger executions. For more information, see [Distributed tracing with Azure Functions and Event Grid triggers](https://devblogs.microsoft.com/azure-sdk/distributed-tracing-with-azure-functions-event-grid-triggers/).

### Sample
See the [Line Counter sample](/samples/azure/azure-sdk-for-net/line-counter/). This sample app illustrates using Storage, Event Hubs, and Event Grid clients along with ASP.NET Core integration, distributed tracing, and hosted services. It allows users to upload a file to a blob, which triggers an Event Hubs event containing the file name. The Event Hubs Processor receives the event, and then the app downloads the blob and counts the number of lines in the file. The app displays a link to a page containing the line count. When the link is clicked, a CloudEvent containing the name of the file is published using Event Grid.

## Next steps
If you need more help, post your issue in the [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-eventgrid) or open a [support ticket](https://azure.microsoft.com/support/options/). 
