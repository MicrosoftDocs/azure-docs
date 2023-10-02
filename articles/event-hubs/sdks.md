---
title: Azure Event Hubs - Client SDKs | Microsoft Docs
description: This article provides information about client SDKs for Azure Event Hubs. 
ms.topic: article
ms.custom: devx-track-dotnet
ms.date: 05/05/2023
---

# Azure Event Hubs - Client SDKs
This article provides following information for the SDKs supported by Azure Event Hubs: 

- Location of package that you can use in your applications 
- GitHub location where you can find source code, samples, readme, change log, reported issues, and also raise new issues 
- Links to quickstart tutorials 

## Client SDKs
The following table describes all the latest available Azure Event Hubs runtime clients. The core focus of these libraries is to **send and receive messages** from an event hub.

| Language | Package | Reference | 
| -------- | ------- | --------------- | 
| . NET Standard | [Azure.Messaging.EventHubs](https://www.nuget.org/packages/Azure.Messaging.EventHubs/) |<ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs)</li><li>[Tutorial](event-hubs-dotnet-standard-getstarted-send.md)</li></ul> |
|       | [Azure.Messaging.EventHubs.Processor](https://www.nuget.org/packages/Azure.Messaging.EventHubs.Processor/) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor)</li><li>[Tutorial](event-hubs-dotnet-standard-getstarted-send.md)</li></ul> |
| Java | [azure-messaging-eventhubs](https://search.maven.org/search?q=a:azure-messaging-eventhubs) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventhubs/azure-messaging-eventhubs)</li><li>[Tutorial](event-hubs-java-get-started-send.md)</li></ul> |
|      | [azure-messaging-eventhubs-checkpointstore-blob](https://search.maven.org/search?q=a:azure-messaging-eventhubs-checkpointstore-blob) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventhubs/azure-messaging-eventhubs-checkpointstore-blob)</li><li>[Tutorial](event-hubs-java-get-started-send.md)</li></ul> |
| Python |  [azure-eventhub](https://pypi.org/project/azure-eventhub/) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhub)</li><li>[Tutorial](event-hubs-python-get-started-send.md)</li></ul> |
|        | [azure-eventhub-checkpointstoreblob-aio](https://pypi.org/project/azure-eventhub-checkpointstoreblob-aio/) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhub-checkpointstoreblob-aio)</li><li>[Tutorial](event-hubs-python-get-started-send.md)</li></ul> |
| JavaScript | [azure/event-hubs](https://www.npmjs.com/package/@azure/event-hubs) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/eventhub/event-hubs)</li><li>[Tutorial](event-hubs-node-get-started-send.md)</li></ul> |
|            | [azure/eventhubs-checkpointstore-blob](https://www.npmjs.com/package/@azure/eventhubs-checkpointstore-blob) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/eventhub/eventhubs-checkpointstore-blob)</li><li>[Tutorial](event-hubs-node-get-started-send.md)</li></ul> |
| Go | [azure-event-hubs-go](https://github.com/Azure/azure-event-hubs-go) | <ul><li>[GitHub location](https://github.com/Azure/azure-event-hubs-go)</li><li>[Tutorial](event-hubs-go-get-started-send.md)</li></ul> |
| C | [azure-event-hubs-c](https://github.com/Azure/azure-event-hubs-c) | <ul><li>[GitHub location](https://github.com/Azure/azure-event-hubs-c)</li><li>[Tutorial](event-hubs-c-getstarted-send.md)</li></ul> |

The following table lists older Azure Event Hubs runtime clients. While these packages may receive critical bug fixes, they aren't in active development. We recommend using the latest SDKs listed in the above table instead.

| Language | Package | Reference | 
| -------- | ------- | --------------- | 
| . NET Standard  | [Microsoft.Azure.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.EventHubs/) (**legacy**) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Microsoft.Azure.EventHubs)</li><li>[Tutorial](event-hubs-dotnet-standard-getstarted-send.md)</li></ul> | 
|       | [Microsoft.Azure.EventHubs.Processor](https://www.nuget.org/packages/Microsoft.Azure.EventHubs.Processor) (**legacy**) | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Microsoft.Azure.EventHubs.Processor)</li><li>[Tutorial](event-hubs-dotnet-standard-getstarted-send.md)</li></ul> |
| . NET Framework | [WindowsAzure.Messaging](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) (**legacy**) | |
|   Java   | [azure-eventhubs](https://search.maven.org/search?q=a:azure-eventhubs) **(legacy)** | <ul><li>[GitHub location](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventhubs/microsoft-azure-eventhubs)</li><li>[Tutorial](event-hubs-java-get-started-send.md)</li></ul> |

## Management SDKs
Here's a list of currently available management-specific libraries. None of these libraries contain runtime operations, and are for the sole purpose of **managing Event Hubs entities**.

- [.NET Standard](/dotnet/api/microsoft.azure.management.eventhub)
- [Java](/java/api/com.microsoft.azure.management.eventhub)
- [Python](/python/api/azure-mgmt-eventhub)
- [JavaScript](/javascript/api/@azure/arm-eventhub/)

## .NET packages

### Client libraries

- **Azure.Messaging.EventHubs**: It's the current version of the library, conforming to the unified Azure SDK design guidelines and under active development for new features. It supports the .NET Standard platform, allowing it to be used by both the full .NET Framework and .NET Core.  There's feature parity at a high level with Microsoft.Azure.EventHubs, with details and the client hierarchy taking a different form. This library is the one that we recommend you to use.
- **Microsoft.Azure.EventHubs**: It was the initial library to break out Event Hubs into a dedicated client that isn’t bundled with Service Bus. It supports the .NET Standard 2.0 platform, allowing it to be used by both the full .NET Framework and .NET Core. It's still the dominant version of the library with respect to usage and third-party blog entries, extensions, and such. The baseline functionality is the same as the current library, though there are some minor bits that one offers and the other doesn’t. It's currently receiving bug fixes and critical updates but is no longer receiving new features.
- **Windows.Azure.ServiceBus**: It was the original library, back when Event Hubs was still more entangled with Service Bus. It supports only the full .NET Framework, because it predates .NET Core. This library offers some corollary functionality that isn’t supported by the newer libraries.   

### Management libraries

- **Microsoft.Azure.Management.EventHub**:  It's the current GA version of the management library for Event Hubs. It supports the .NET Standard 2.0 platform, allowing it to be used by both the full .NET Framework and .NET Core.


## Next steps

You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](./event-hubs-about.md)
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.yml)
