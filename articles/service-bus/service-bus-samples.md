<properties 
    pageTitle="Service Bus samples overview | Microsoft Azure"
    description="Categorizes and describes Service Bus samples with links to each."
    services="service-bus"
    documentationCenter="na"
    authors="sethmanheim"
    manager="timlt"
    editor="" />
<tags 
    ms.service="service-bus"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="na"
    ms.date="05/06/2016"
    ms.author="sethm" />

# Service Bus samples

The Service Bus samples demonstrate key features in [Service Bus](https://azure.microsoft.com/services/service-bus/) (cloud service) and [Service Bus for Windows Server](https://msdn.microsoft.com/library/dn282144.aspx). This article categorizes and describes the samples available, with links to each.

>[AZURE.NOTE] Service Bus samples are not installed with the SDK. To obtain the samples, visit the [Azure SDK samples page](https://code.msdn.microsoft.com/site/search?query=service%20bus&f%5B0%5D.Value=service%20bus&f%5B0%5D.Type=SearchText&ac=5).
>
>Additionally, there is an updated set of Service Bus messaging samples [here](https://github.com/Azure-Samples/azure-servicebus-messaging-samples) (as of this writing, they are not described in this article). Relay samples are [here](https://github.com/Azure-Samples/azure-servicebus-relay-samples). 

## Service Bus brokered messaging

The following samples illustrate how to write applications that use Service Bus.

Note that the brokered messaging samples require a connection string to access your Service Bus service namespace.

### To obtain a connection string for Azure Service Bus

1. Log on to the [Azure classic portal](http://manage.windowsazure.com).

1. In the left-hand column, click **Service Bus**.

1. Click the name of your service namespace in the list.

1. Click **Connection Information**. In the **Access connection information** dialog, copy the connection string to your clipboard.

1. Paste the connection string into the App.config file for the sample.

### To obtain a connection string for Service Bus for Windows Server

1. Run the following PowerShell cmdlet:

	```
	get-sbClientConfiguration
	```

2. Paste the connection string into the App.config file for the sample.

### Getting started samples

These samples describe basic messaging and relay functionality.

|Sample Name|Description|Minimum SDK Version|Availability|
|---|---|---|---|
|[Getting Started: Messaging with Queues](http://code.msdn.microsoft.com/Getting-Started-Brokered-aa7a0ac3)|Demonstrates how to use Microsoft Azure Service Bus to send and receive messages from a queue.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Getting Started: Messaging With Topics](http://code.msdn.microsoft.com/Getting-Started-Brokered-614d42e5)|Demonstrates how to use Microsoft Azure Service Bus to send and receive messages from a topic with multiple subscriptions.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Getting Started with Event Hubs](http://code.msdn.microsoft.com/Service-Bus-Event-Hub-286fd097)|Demonstrates the basic capabilities of Event Hubs, such as creating an Event Hub, sending events to an Event Hub, consuming events using the Event Processor.|2.4|Microsoft Azure Service Bus|

### Exploring features

The following samples demonstrate various features of Service Bus.

|Sample Name|Description|Minimum SDK Version|Availability|
|---|---|---|---|
|[HTTP Token Providers](http://code.msdn.microsoft.com/Service-Bus-HTTP-Token-38f2cfc5)|Demonstrates the different ways of authenticating an HTTP/REST client with Service Bus.|2.1|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Service Bus HTTP Client](http://code.msdn.microsoft.com/Service-Bus-HTTP-client-fe7da74a)|Demonstrates how to send messages to and receive messages from Service Bus via HTTP/REST.|2.3|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Service Bus Autoforwarding](http://code.msdn.microsoft.com/Service-Bus-Autoforwarding-b9df470b)|Demonstrates how to automatically forward messages from a queue, subscription, or deadletter queue into another queue or topic. It also demonstrates how to send a message into a queue or topic via a transfer queue.|2.3|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: WCF Channel Session Sample](http://code.msdn.microsoft.com/Brokered-Messaging-WCF-0a526451)|Demonstrates how to use Microsoft Azure Service Bus using Windows Communication Foundation (WCF) channels. The sample shows the use of WCF channels to send and receive messages via a Service Bus queue. The sample shows both session and non-session communication over the Service Bus.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: Transactions](http://code.msdn.microsoft.com/Brokered-Messaging-8cd41d1e)|Demonstrates how to use the Microsoft Azure Service Bus messaging features within a transaction scope in order to ensure batches of messaging operations are committed atomically.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: Management Operations Using REST](http://code.msdn.microsoft.com/Brokered-Messaging-569cff88)|Demonstrates how to perform management operations on Service Bus using REST.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Resource Provider REST APIs](http://code.msdn.microsoft.com/Service-Bus-Resource-5d887203)|Demonstrates how to use the new Service Bus RDFE REST APIs to manage namespaces and messaging entities.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: WCF Service Session Sample](http://code.msdn.microsoft.com/Brokered-Messaging-WCF-db4262c2)|Demonstrates how to use Microsoft Azure Service Bus using the WCF service model. The sample shows the use of the WCF service model to accomplish session-based communication via a Service Bus queue.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: Request Response](http://code.msdn.microsoft.com/Brokered-Messaging-Request-2b4ff5d8)|Demonstrates how to use the Microsoft Azure Service Bus and the request/response functionality. The sample shows simple clients and servers communicating via a Service Bus queue.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: Dead Letter Queue](http://code.msdn.microsoft.com/Brokered-Messaging-Dead-22536dd8)|Demonstrates how to use Microsoft Azure Service Bus and the messaging "dead letter queue" functionality. The sample shows a simple sender and receiver communicating via a Service Bus queue.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: Deferred Messages](http://code.msdn.microsoft.com/Brokered-Messaging-ccc4f879)|Demonstrates how to use the message deferral feature of Microsoft Azure Service Bus. The sample shows a simple sender and receiver communicating via a Service Bus queue.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: Session Messages](http://code.msdn.microsoft.com/Brokered-Messaging-Session-41c43fb4)|Demonstrates how to use Microsoft Azure Service Bus and the Messaging Session functionality. The sample shows simple senders and receivers communicating via a Service Bus queue.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: Request Response Topic](http://code.msdn.microsoft.com/Brokered-Messaging-Request-6759a36e)|Demonstrates how to implement the request/response pattern using Microsoft Azure Service Bus topics and subscriptions. The sample shows simple clients and servers communicating via a Service Bus topic.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: Request Response Queue](http://code.msdn.microsoft.com/Brokered-Messaging-Request-0ce8fcaf)|Demonstrates how to use Microsoft Azure Service Bus and the request/response functionality. The sample shows simple clients and servers communicating via two Service Bus queues.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: Duplicate Detection](http://code.msdn.microsoft.com/Brokered-Messaging-c0acea25)|Demonstrates how to use Microsoft Azure Service Bus duplicate message detection with queues. It creates two queues, one with duplicate detection enabled and other one without duplicate detection.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: Async Messaging](http://code.msdn.microsoft.com/Brokered-Messaging-Async-211c1e74)|Demonstrates how to use Microsoft Azure Service Bus to send and receive messages asynchronously from a queue. The queue provides decoupled, asynchronous communication between a sender and any number of receivers (here, a single receiver).|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: Advanced Filters](http://code.msdn.microsoft.com/Brokered-Messaging-6b0d2749)|Demonstrates how to use Microsoft Azure Service Bus publish/subscribe advanced filters. It creates a topic and 3 subscriptions with different filter definitions, sends messages to the topic, and receives all messages from subscriptions.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Brokered Messaging: Messages Prefetch](http://code.msdn.microsoft.com/Brokered-Messaging-be2dac1d)|Demonstrates how to use the Microsoft Azure Service Bus messages prefetch feature. It demonstrates how to use the messages prefetch feature upon receive.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|

## Service Bus relay

Samples that demonstrate the Service Bus relay.

### Getting started

|Sample Name|Description|Minimum SDK Version|Availability|
|---|---|---|---|
|[Relayed Messaging: Azure](http://code.msdn.microsoft.com/Relayed-Messaging-Windows-0d2cede3)|Demonstrates how to run a Service Bus client and service on Azure. This sample configures Service Bus programmatically. Only environment and security information is stored in the configuration files.|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging Authentication: Shared Secret](http://code.msdn.microsoft.com/Relayed-Messaging-92b04c02)|Demonstrates how to use an issuer name and issuer secret to authenticate with Service Bus.|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging Authentication: WebNoAuth](http://code.msdn.microsoft.com/Relayed-Messaging-a4f0b831)|Demonstrates how to expose an HTTP service that does not require client user authentication.|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging Bindings: WebHttp](http://code.msdn.microsoft.com/Relayed-Messaging-Bindings-a6477ba0)|Demonstrates how to use the **WebHttpRelayBinding** binding to return binary data using the Web programming model.|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging Bindings: NetTcp Relayed](http://code.msdn.microsoft.com/Relayed-Messaging-Bindings-2dec7692)|Demonstrates how to use the **NetTcpRelayBinding** binding.|1.8|Microsoft Azure Service Bus|

### Exploring features

Samples that demonstrate various Service Bus relay features.

|Sample Name|Description|Minimum SDK Version|Availability|
|---|---|---|---|
|[Relayed Messaging Authentication: Simple WebToken](http://code.msdn.microsoft.com/Relayed-Messaging-32c74392)|Demonstrates how to use a simple web token credential to authenticate with Service Bus. The sample is similar to the Echo sample, with a few changes. Specifically, this sample adds a behavior in the ServiceHost (service) and ChannelFactory (client) applications.|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging: Load Balance](http://code.msdn.microsoft.com/Relayed-Messaging-Load-bd76a9f8)|Demonstrates how to use Microsoft Azure Service Bus to route messages to multiple receivers. It shows multiple instances of a simple service communicating with a client via the **NetTcpRelayBinding** binding|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging Bindings: Net Event](http://code.msdn.microsoft.com/Relayed-Messaging-Bindings-c0176977)|Demonstrates using the **NetEventRelayBinding** binding on Microsoft Azure Service Bus.|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging Bindings: WS2007Http Session](http://code.msdn.microsoft.com/Relayed-Messaging-Bindings-ef1f1fcb)|Demonstrates using the **WS2007HttpRelayBinding** binding with reliable sessions enabled. It also shows how to specify Service Bus credentials in the configuration file instead of programmatically.|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging Bindings: WS2007Http MsgSecCertificate](http://code.msdn.microsoft.com/Relayed-Messaging-Bindings-f29c9da5)|Demonstrates how to use the **WS2007HttpRelayBinding** binding with message security to secure end-to-end messages while still requiring clients to authenticate with Service Bus.|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging: Metadata Exchange](http://code.msdn.microsoft.com/Relayed-Messaging-Metadata-f122312e)|Demonstrates how to expose a metadata endpoint that uses the relay binding. **MetadataExchange** is supported in the following relay bindings: **NetTcpRelayBinding**, **NetOnewayRelayBinding**, **BasicHttpRelayBinding**, and **WS2007HttpRelayBinding**.|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging Bindings: NetTcp Direct](http://code.msdn.microsoft.com/Relayed-Messaging-Bindings-ca039161)|Demonstrates how to configure the **NetTcpRelayBinding** binding to support the **Hybrid** connection mode which first establishes a relayed connection, and if possible, switches automatically to a direct connection between a client and a service.|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging Bindings: NetTcp MsgSec UserName](http://code.msdn.microsoft.com/Relayed-Messaging-Bindings-30542392)|Demonstrates how to use the **NetTcpRelayBinding** binding with message security.|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging Bindings: Net Oneway](http://code.msdn.microsoft.com/Relayed-Messaging-Bindings-bb5b813a)|Demonstrates how to expose and consume a service endpoint using the **NetOnewayRelayBinding** binding.|1.8|Microsoft Azure Service Bus|
|[Relayed Messaging Bindings: WS2007Http Simple](http://code.msdn.microsoft.com/Relayed-Messaging-Bindings-aa4b793a)|Demonstrates using the **WS2007HttpRelayBinding** binding. It demonstrates a simple service that uses no security options and does not require clients to authenticate.|1.8|Microsoft Azure Service Bus|

## Service Bus reference tools

The following samples demonstrate various other features of the service.

|Sample Name|Description|Minimum SDK Version|Availability|
|---|---|---|---|
|[Service Bus Explorer](http://code.msdn.microsoft.com/Service-Bus-Explorer-f2abca5a)|The Service Bus Explorer allows users to connect to a Service Bus service namespace and manage messaging entities in an easy manner. The tool provides advanced features such as import/export functionality, and the ability to test messaging entities and relay services.|1.8|Microsoft Azure Service Bus; Service Bus for Windows Server|
|[Authorization: SBAzTool](http://code.msdn.microsoft.com/Authorization-SBAzTool-6fd76d93)|This sample demonstrates how to create and manage service identities in Microsoft Azure Active Directory Access Control (also known as Access Control Service or ACS) for use with Service Bus.|N/A|Microsoft Azure Service Bus|

## Next steps

See the following topics for conceptual overviews of Service Bus.

- [Service Bus messaging overview](service-bus-messaging-overview.md)
- [Service Bus architecture](service-bus-architecture.md)
- [Service Bus fundamentals](service-bus-fundamentals-hybrid-solutions.md)
