---
title: How to log events to Azure Event Hubs in Azure API Management | Microsoft Docs
description: Learn how to log events to Azure Event Hubs in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.assetid: 88f6507d-7460-4eb2-bffd-76025b73f8c4
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 01/29/2018
ms.author: apimpm

---
# How to log events to Azure Event Hubs in Azure API Management
Azure Event Hubs is a highly scalable data ingress service that can ingest millions of events per second so that you can process and analyze the massive amounts of data produced by your connected devices and applications. Event Hubs acts as the "front door" for an event pipeline, and once data is collected into an event hub, it can be transformed and stored using any real-time analytics provider or batching/storage adapters. Event Hubs decouples the production of a stream of events from the consumption of those events, so that event consumers can access the events on their own schedule.

This article is a companion to the [Integrate Azure API Management with Event Hubs](https://azure.microsoft.com/documentation/videos/integrate-azure-api-management-with-event-hubs/) video and describes how to log API Management events using Azure Event Hubs.

## Create an Azure Event Hub

For detailed steps on how to create an event hub and get connection strings that you need to send and receive events to and from the Event Hub, see [Create an Event Hubs namespace and an event hub using the Azure portal](https://docs.microsoft.com/azure/event-hubs/event-hubs-create).

## Create an API Management logger
Now that you have an Event Hub, the next step is to configure a [Logger](https://docs.microsoft.com/rest/api/apimanagement/2019-12-01/logger) in your API Management service so that it can log events to the Event Hub.

API Management loggers are configured using the [API Management REST API](https://aka.ms/apimapi). For detailed request examples, see [how to create Loggers](https://docs.microsoft.com/rest/api/apimanagement/2019-12-01/logger/createorupdate).

## Configure log-to-eventhub policies

Once your logger is configured in API Management, you can configure your log-to-eventhub policy to log the desired events. The log-to-eventhub policy can be used in either the inbound policy section or the outbound policy section.

1. Browse to your APIM instance.
2. Select the API tab.
3. Select the API to which you want to add the policy. In this example, we're adding a policy to the **Echo API** in the **Unlimited** product.
4. Select **All operations**.
5. On the top of the screen, select the Design tab.
6. In the Inbound or Outbound processing window, click the triangle (next to the pencil).
7. Select the Code editor. For more information, see [How to set or edit policies](set-edit-policies.md).
8. Position your cursor in the `inbound` or `outbound` policy section.
9. In the window on the right, select **Advanced policies** > **Log to EventHub**. This inserts the `log-to-eventhub` policy statement template.

```xml
<log-to-eventhub logger-id="logger-id">
    @{
        return new JObject(
            new JProperty("EventTime", DateTime.UtcNow.ToString()),
            new JProperty("ServiceName", context.Deployment.ServiceName),
            new JProperty("RequestId", context.RequestId),
            new JProperty("RequestIp", context.Request.IpAddress),
            new JProperty("OperationName", context.Operation.Name)
        ).ToString();
    }
</log-to-eventhub>
```
Replace `logger-id` with the value you used for `{loggerId}` in the request URL to create the logger in the previous step.

You can use any expression that returns a string as the value for the `log-to-eventhub` element. In this example, a string in JSON format containing the date and time, service name, request id, request ip address, and operation name is logged.

Click **Save** to save the updated policy configuration. As soon as it is saved the policy is active and events are logged to the designated Event Hub.

## Preview the log in Event Hubs by using Azure Stream Analytics

You can preview the log in Event Hubs by using [Azure Stream Analytics queries](https://docs.microsoft.com/azure/event-hubs/process-data-azure-stream-analytics). 

1. In the Azure portal, browse to the event hub that the logger sends events to. 
2. Under **Features**, select the **Process data** tab.
3. On the **Enable real time insights from events** card, select **Explore**.
4. You should be able to preview the log on the **Input preview** tab. If the data shown isn't current, select **Refresh** to see the latest events.

## Next steps
* Learn more about Azure Event Hubs
  * [Get started with Azure Event Hubs](../event-hubs/event-hubs-c-getstarted-send.md)
  * [Receive messages with EventProcessorHost](../event-hubs/event-hubs-dotnet-standard-getstarted-receive-eph.md)
  * [Event Hubs programming guide](../event-hubs/event-hubs-programming-guide.md)
* Learn more about API Management and Event Hubs integration
  * [Logger entity reference](https://docs.microsoft.com/rest/api/apimanagement/2019-12-01/logger)
  * [log-to-eventhub policy reference](https://docs.microsoft.com/azure/api-management/api-management-advanced-policies#log-to-eventhub)
  * [Monitor your APIs with Azure API Management, Event Hubs, and Moesif](api-management-log-to-eventhub-sample.md)  
* Learn more about [integration with Azure Application Insights](api-management-howto-app-insights.md)

[publisher-portal]: ./media/api-management-howto-log-event-hubs/publisher-portal.png
[create-event-hub]: ./media/api-management-howto-log-event-hubs/create-event-hub.png
[event-hub-connection-string]: ./media/api-management-howto-log-event-hubs/event-hub-connection-string.png
[event-hub-dashboard]: ./media/api-management-howto-log-event-hubs/event-hub-dashboard.png
[receiving-policy]: ./media/api-management-howto-log-event-hubs/receiving-policy.png
[sending-policy]: ./media/api-management-howto-log-event-hubs/sending-policy.png
[event-hub-policy]: ./media/api-management-howto-log-event-hubs/event-hub-policy.png
[add-policy]: ./media/api-management-howto-log-event-hubs/add-policy.png
