<properties 
    pageTitle="Service Bus relay samples overview | Microsoft Azure"
    description="Categorizes and describes Service Bus relay samples with links to each."
    services="service-bus-relay"
    documentationCenter="na"
    authors="sethmanheim"
    manager="timlt"
    editor="" />
<tags 
    ms.service="service-bus-relay"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="na"
    ms.date="10/07/2016"
    ms.author="sethm" />

# Service Bus relay samples

The Service Bus relay samples demonstrate key features in [Service Bus relay](https://azure.microsoft.com/services/service-bus/). This article categorizes and describes the samples available, with links to each.

>[AZURE.NOTE] Service Bus samples are not installed with the SDK. To obtain the samples, visit the [Azure SDK samples page](https://code.msdn.microsoft.com/site/search?query=service%20bus&f%5B0%5D.Value=service%20bus&f%5B0%5D.Type=SearchText&ac=5).
>
>Additionally, there is an updated set of Service Bus relay samples [here](https://github.com/Azure-Samples/azure-servicebus-relay-samples) (as of this writing, they are not described in this article).  

For messaging samples, see [Service Bus messaging samples](../service-bus-messaging/service-bus-samples.md).

## Service Bus relay

The following samples illustrate how to write applications that use the Service Bus relay service.

Note that the relay samples require a connection string to access your Service Bus namespace.

### To obtain a connection string for Azure Service Bus

1. Log on to the [Azure portal](http://portal.azure.com).

1. In the left-hand column, click **Service Bus**.

1. Click the name of your namespace in the list.

3. In the namespace blade, click **Shared access policies**.

4. In the **Shared access policies** blade, click **RootManageSharedAccessKey**.

6. Copy the connection string to the clipboard.

### To obtain a connection string for Service Bus for Windows Server

1. Run the following PowerShell cmdlet:

	```
	get-sbClientConfiguration
	```

2. Paste the connection string into the App.config file for the sample.

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

## Next steps

See the following topics for conceptual overviews of Service Bus.

- [Service Bus relay overview](service-bus-relay-overview.md)
- [Service Bus architecture](../service-bus/service-bus-architecture.md)
- [Service Bus fundamentals](../service-bus/service-bus-fundamentals-hybrid-solutions.md)