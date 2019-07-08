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
ms.devlang: na
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
Now that you have an Event Hub, the next step is to configure a [Logger](https://docs.microsoft.com/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-logger-entity) in your API Management service so that it can log events to the Event Hub.

API Management loggers are configured using the [API Management REST API](https://aka.ms/smapi). Before using the REST API for the first time, review the [prerequisites](https://docs.microsoft.com/rest/api/apimanagement/apimanagementrest/api-management-rest) and ensure that you have [enabled access to the REST API](https://docs.microsoft.com/rest/api/apimanagement/apimanagementrest/api-management-rest#EnableRESTAPI).

To create a logger, make an HTTP PUT request using the following URL template:

`https://{your service}.management.azure-api.net/loggers/{new logger name}?api-version=2017-03-01`

* Replace `{your service}` with the name of your API Management service instance.
* Replace `{new logger name}` with the desired name for your new logger. You reference this name when you configure the [log-to-eventhub](/azure/api-management/api-management-advanced-policies#log-to-eventhub) policy

Add the following headers to the request:

* Content-Type : application/json
* Authorization : SharedAccessSignature 58...
  * For instructions on generating the `SharedAccessSignature` see [Azure API Management REST API Authentication](https://docs.microsoft.com/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-authentication).

Specify the request body using the following template:

```json
{
  "loggerType" : "AzureEventHub",
  "description" : "Sample logger description",
  "credentials" : {
    "name" : "Name of the Event Hub from the portal",
    "connectionString" : "Endpoint=Event Hub Sender connection string"
    }
}
```

* `loggerType` must be set to `AzureEventHub`.
* `description` provides an optional description of the logger and can be a zero length string if desired.
* `credentials` contains the `name` and `connectionString` of your Azure Event Hub.

When you make the request, if the logger is created, a status code of `201 Created` is returned. A sample response based on the above sample request is shown below.

```json
{
    "id": "/loggers/{new logger name}",
    "loggerType": "azureEventHub",
    "description": "Sample logger description",
    "credentials": {
        "name": "Name of the Event Hub from the Portal",
        "connectionString": "{{Logger-Credentials-xxxxxxxxxxxxxxx}}"
    },
    "isBuffered": true,
    "resourceId": null
}
```

> [!NOTE]
> For other possible return codes and their reasons, see [Create a Logger](https://docs.microsoft.com/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-logger-entity#PUT). To see how to perform other operations such as list, update, and delete, see the [Logger](https://docs.microsoft.com/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-logger-entity) entity documentation.
>
>

## Configure log-to-eventhubs policies

Once your logger is configured in API Management, you can configure your log-to-eventhubs policies to log the desired events. The log-to-eventhubs policy can be used in either the inbound policy section or the outbound policy section.

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
<log-to-eventhub logger-id ='logger-id'>
  @( string.Join(",", DateTime.UtcNow, context.Deployment.ServiceName, context.RequestId, context.Request.IpAddress, context.Operation.Name))
</log-to-eventhub>
```
Replace `logger-id` with the value you used for `{new logger name}` in the URL to create the logger in the previous step.

You can use any expression that returns a string as the value for the `log-to-eventhub` element. In this example, a string containing the date and time, service name, request id, request ip address, and operation name is logged.

Click **Save** to save the updated policy configuration. As soon as it is saved the policy is active and events are logged to the designated Event Hub.

## Next steps
* Learn more about Azure Event Hubs
  * [Get started with Azure Event Hubs](../event-hubs/event-hubs-c-getstarted-send.md)
  * [Receive messages with EventProcessorHost](../event-hubs/event-hubs-dotnet-standard-getstarted-receive-eph.md)
  * [Event Hubs programming guide](../event-hubs/event-hubs-programming-guide.md)
* Learn more about API Management and Event Hubs integration
  * [Logger entity reference](https://docs.microsoft.com/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-logger-entity)
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
