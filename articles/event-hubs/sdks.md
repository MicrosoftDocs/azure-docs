---
title: Azure Event Hubs - Client SDKs | Microsoft Docs
description: This article provides information about client SDKs for Azure Event Hubs. 
services: event-hubs
documentationcenter: na
author: spelluru

ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.date: 05/26/2020
ms.author: spelluru

---

# Azure Event Hubs - Client SDKs
This article provides following information for the SDKs supported by Azure Event Hubs: 

- Location of package that you can use in your applications 
- GitHub location where you can find source code, samples, readme, change log, reported issues, and also raise new issues 
- Links to quickstart tutorials 

## Client SDKs
The following table describes all currently available Azure Event Hubs runtime clients. While some of these libraries also include limited management functionality, there are also specific libraries dedicated to management operations. The core focus of these libraries is to **send and receive messages** from an event hub.

| Language | Package | Reference | 
| -------- | ------- | --------------- | 
| . NET Standard (**latest** and supports both .NET Core and .NET Framework) | [Azure.Messaging.EventHubs](https://www.nuget.org/packages/Azure.Messaging.EventHubs/) |<ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs)</li><li>[Tutorial](get-started-dotnet-standard-send-v2.md)</li></ul> |
|       | [Azure.Messaging.EventHubs.Processor](https://www.nuget.org/packages/Azure.Messaging.EventHubs.Processor/) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor)</li><li>[Tutorial](get-started-dotnet-standard-send-v2.md)</li></ul> |
| . NET Standard (**legacy** and supports both .NET Core and .NET Framework) | [Microsoft.Azure.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.EventHubs/) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Microsoft.Azure.EventHubs)</li><li>[Tutorial](event-hubs-dotnet-standard-getstarted-send.md)</li></ul> | 
|       | [Microsoft.Azure.EventHubs.Processor](https://www.nuget.org/packages/Microsoft.Azure.EventHubs.Processor) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Microsoft.Azure.EventHubs.Processor)</li><li>[Tutorial](event-hubs-dotnet-standard-getstarted-send.md)</li></ul> |
| . NET Framework (**old**) | [WindowsAzure.Messaging](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) |<ul><li>[Tutorial](event-hubs-dotnet-framework-getstarted-send.md)</li></ul> |
| Java | [azure-messaging-eventhubs](https://search.maven.org/search?q=a:azure-messaging-eventhubs) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventhubs/azure-messaging-eventhubs)</li><li>[Tutorial](get-started-java-send-v2.md)</li></ul> |
|      | [azure-eventhubs](https://search.maven.org/search?q=a:azure-eventhubs) **(legacy)** | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventhubs/microsoft-azure-eventhubs)</li><li>[Tutorial](event-hubs-java-get-started-send.md)</li></ul> |
| Python |  [azure-eventhub](https://pypi.org/project/azure-eventhub/) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhub)</li><li>[Tutorial](get-started-python-send-v2.md)</li></ul> |
|        | [azure-eventhub-checkpointstoreblob-aio](https://pypi.org/project/azure-eventhub-checkpointstoreblob-aio/) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhub-checkpointstoreblob-aio)</li><li>[Tutorial](get-started-python-send-v2.md)</li></ul> |
| JavaScript | [azure/event-hubs](https://www.npmjs.com/package/@azure/event-hubs) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/eventhub/event-hubs)</li><li>[Tutorial](get-started-node-send-v2.md)</li></ul> |
|            | [azure/eventhubs-checkpointstore-blob](https://www.npmjs.com/package/@azure/eventhubs-checkpointstore-blob) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/eventhub/eventhubs-checkpointstore-blob)</li><li>[Tutorial](get-started-node-send-v2.md)</li></ul> |
| Go | [azure-event-hubs-go](https://github.com/Azure/azure-event-hubs-go) | <ul><li>[GitHub location](https://github.com/Azure/azure-event-hubs-go)</li><li>[Tutorial](event-hubs-go-get-started-send.md)</li></ul> |
| C | [azure-event-hubs-c](https://github.com/Azure/azure-event-hubs-c) | <ul><li>[GitHub location](https://github.com/Azure/azure-event-hubs-c)</li><li>[Tutorial](event-hubs-c-getstarted-send.md)</li></ul> |

## Management SDKs
The following table lists all currently available management-specific libraries. None of these libraries contain runtime operations, and are for the sole purpose of **managing Event Hubs entities**.

| Language | Package | Reference | 
| -------- | ------- | --------------- | 
| .NET Standard | [Microsoft.Azure.Management.EventHub](https://www.nuget.org/packages/Microsoft.Azure.Management.EventHub) |<ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Microsoft.Azure.Management.EventHub)</li><li>[Tutorial](get-started-dotnet-standard-send-v2.md)</li></ul> |


## Next steps

You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an Event Hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)
