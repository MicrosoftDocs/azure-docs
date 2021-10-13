---
title: Troubleshoot Event Grid issues
description: This article provides different ways of troubleshooting Azure Event Grid issues
ms.topic: conceptual
ms.date: 06/10/2021
---

# Troubleshoot Azure Event Grid issues
This article provides information that helps you with troubleshooting Azure Event Grid issues. 

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

### .NET
The Event Grid .NET library supports distributing tracing. To adhere to the [CloudEvents specification's guidance](https://github.com/cloudevents/spec/blob/master/extensions/distributed-tracing.md) on distributing tracing, the library sets the `traceparent` and `tracestate` on the [ExtensionAttributes](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventgrid/Azure.Messaging.EventGrid/src/Customization#L126) of a `CloudEvent` when distributed tracing is enabled. To learn more about how to enable distributed tracing in your application, take a look at the Azure SDK [distributed tracing documentation](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/core/Azure.Core/samples/Diagnostics.md#Distributed-tracing).

### Java
The Event Grid Java library supports distributing tracing out of the box. In order to adhere to the CloudEvents specification's [guidance](https://github.com/cloudevents/spec/blob/master/extensions/distributed-tracing.md) on distributing tracing, the library will set the `traceparent` and `tracestate` on the `extensionAttributes` of a `CloudEvent` when distributed tracing is enabled. To learn more about how to enable distributed tracing in your application, take a look at the Azure SDK Java [distributed tracing documentation](/azure/developer/java/sdk/tracing).

### Sample
See the [Line Counter sample](/samples/azure/azure-sdk-for-net/line-counter/). This sample app illustrates using Storage, Event Hubs, and Event Grid clients along with ASP.NET Core integration, distributed tracing, and hosted services. It allows users to upload a file to a blob, which triggers an Event Hubs event containing the file name. The Event Hubs Processor receives the event, and then the app downloads the blob and counts the number of lines in the file. The app displays a link to a page containing the line count. When the link is clicked, a CloudEvent containing the name of the file is published using Event Grid.

## Next steps
If you need more help, post your issue in the [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-eventgrid) or open a [support ticket](https://azure.microsoft.com/support/options/). 
