<properties 
	pageTitle="How to log events to Azure Event Hubs in Azure API Management | Microsoft Azure" 
	description="Learn how to log events to Azure Event Hubs in Azure API Management." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/25/2016" 
	ms.author="sdanie"/>

# How to log events to Azure Event Hubs in Azure API Management

Azure Event Hubs is a highly scalable data ingress service that can ingest millions of events per second so that you can process and analyze the massive amounts of data produced by your connected devices and applications. Event Hubs acts as the "front door" for an event pipeline, and once data is collected into an event hub, it can be transformed and stored using any real-time analytics provider or batching/storage adapters. Event Hubs decouples the production of a stream of events from the consumption of those events, so that event consumers can access the events on their own schedule.

This article is a companion to the [Integrate Azure API Management with Event Hubs](https://azure.microsoft.com/documentation/videos/integrate-azure-api-management-with-event-hubs/) video and describes how to log API Management events using Azure Event Hubs.

## Create an Azure Event Hub

To create a new Event Hub, sign-in to the [Azure classic portal](https://manage.windowsazure.com) and click **New**->**App Services**->**Service Bus**->**Event Hub**->**Quick Create**. Enter an Event Hub name, region, select a subscription, and select a namespace. If you haven't previously created a namespace you can create one by typing a name in the **Namespace** textbox. Once all properties are configured, click **Create a new Event Hub** to create the Event Hub.

![Create event hub][create-event-hub]

Next, navigate to the **Configure** tab for your new Event Hub and create two **shared access policies**. Name the first one **Sending** and give it **Send** permissions.

![Sending policy][sending-policy]

Name the second one **Receiving**, give it **Listen** permissions, and click **Save**.

![Receiving policy][receiving-policy]

Each shared access policy allows applications to send and receive events to and from the Event Hub. To access the connection strings for these policies, navigate to the **Dashboard** tab of the Event Hub and click **Connection information**.

![Connection string][event-hub-dashboard]

The **Sending** connection string is used when logging events, and the **Receiving** connection string is used when downloading events from the Event Hub.

![Connection string][event-hub-connection-string]

## Create an API Management logger

Now that you have an Event Hub, the next step is to configure a [Logger](https://msdn.microsoft.com/library/azure/mt592020.aspx) in your API Management service so that it can log events to the Event Hub.

API Management loggers are configured using the [API Management REST API](http://aka.ms/smapi). Before using the REST API for the first time, review the [prerequisites](https://msdn.microsoft.com/library/azure/dn776326.aspx#Prerequisites) and ensure that you have [enabled access to the REST API](https://msdn.microsoft.com/library/azure/dn776326.aspx#EnableRESTAPI).

To create a logger, make an HTTP PUT request using the following URL template.

    https://{your service}.management.azure-api.net/loggers/{new logger name}?api-version=2014-02-14-preview

-	Replace `{your service}` with the name of your API Management service instance.
-	Replace `{new logger name}` with the desired name for your new logger. You will reference this name when you configure the [log-to-eventhub](https://msdn.microsoft.com/library/azure/dn894085.aspx#log-to-eventhub) policy

Add the following headers to the request.

-	Content-Type : application/json
-	Authorization : SharedAccessSignature uid=...
	-	For instructions on generating the `SharedAccessSignature` see [Azure API Management REST API Authentication](https://msdn.microsoft.com/library/azure/dn798668.aspx).

Specify the request body using the following template.

    {
      "type" : "AzureEventHub",
      "description" : "Sample logger description",
      "credentials" : {
        "name" : "Name of the Event Hub from the Azure Classic Portal",
        "connectionString" : "Endpoint=Event Hub Sender connection string"
        }
    }

-	`type` must be set to `AzureEventHub`.
-	`description` provides an optional description of the logger and can be a zero length string if desired.
-	`credentials` contains the `name` and `connectionString` of your Azure Event Hub.

When you make the request, if the logger is created a status code of `201 Created` is returned. 

>[AZURE.NOTE] For other possible return codes and their reasons, see [Create a Logger](https://msdn.microsoft.com/library/azure/mt592020.aspx#PUT). To see how perform other operations such as list, update, and delete, see the [Logger](https://msdn.microsoft.com/library/azure/mt592020.aspx) entity documentation.

## Configure log-to-eventhubs policies

Once your logger is configured in API Management, you can configure your log-to-eventhubs policies to log the desired events. The log-to-eventhubs policy can be used in either the inbound policy section or the outbound policy section.

To configure policies, sign-in to the [Azure classic portal](https://manage.windowsazure.com), navigate your API Management service, and click either **publisher portal** or **Manage** to access the publisher portal.

![Publisher portal][publisher-portal]

Click **Policies** in the API Management menu on the left, select the desired product and API, and click **Add policy**. In this example we're adding a policy to the **Echo API** in the **Unlimited** product.

![Add policy][add-policy]

Position your cursor in the `inbound` policy section and click the **Log to EventHub** policy to insert the `log-to-eventhub` policy statement template.

![Policy editor][event-hub-policy]

    <log-to-eventhub logger-id ='logger-id'>
      @( string.Join(",", DateTime.UtcNow, context.Deployment.ServiceName, context.RequestId, context.Request.IpAddress, context.Operation.Name))
    </log-to-eventhub>

Replace `logger-id` with the name of the API Management logger you configured in the previous step.

You can use any expression that returns a string as the value for the `log-to-eventhub` element. In this example a string containing the date and time, service name, request id, request ip address, and operation name is logged.

Click **Save** to save the updated policy configuration. As soon as it is saved the policy is active and events are logged to the designated Event Hub.

## Next steps

-	Learn more about Azure Event Hubs
	-	[Get started with Azure Event Hubs](../event-hubs/event-hubs-csharp-ephcs-getstarted.md)
	-	[Receive messages with EventProcessorHost](../event-hubs/event-hubs-csharp-ephcs-getstarted.md#receive-messages-with-eventprocessorhost)
	-	[Event Hubs programming guide](../event-hubs/event-hubs-programming-guide.md)
-	Learn more about API Management and Event Hubs integration
	-	[Logger entity reference](https://msdn.microsoft.com/library/azure/mt592020.aspx)
	-	[log-to-eventhub policy reference](https://msdn.microsoft.com/library/azure/dn894085.aspx#log-to-eventhub)
	-	[Monitor your APIs with Azure API Management, Event Hubs and Runscope](api-management-log-to-eventhub-sample.md)	

## Watch a video walkthrough

> [AZURE.VIDEO integrate-azure-api-management-with-event-hubs]


[publisher-portal]: ./media/api-management-howto-log-event-hubs/publisher-portal.png
[create-event-hub]: ./media/api-management-howto-log-event-hubs/create-event-hub.png
[event-hub-connection-string]: ./media/api-management-howto-log-event-hubs/event-hub-connection-string.png
[event-hub-dashboard]: ./media/api-management-howto-log-event-hubs/event-hub-dashboard.png
[receiving-policy]: ./media/api-management-howto-log-event-hubs/receiving-policy.png
[sending-policy]: ./media/api-management-howto-log-event-hubs/sending-policy.png
[event-hub-policy]: ./media/api-management-howto-log-event-hubs/event-hub-policy.png
[add-policy]: ./media/api-management-howto-log-event-hubs/add-policy.png






