<properties 
   pageTitle="Service Bus bindings | Microsoft Azure"
   description="List of Service Bus WCF bindings and the standard WCF bindings to which they correspond."
   services="service-bus"
   documentationCenter="na"
   authors="sethmanheim"
   manager="timlt"
   editor="tysonn" />
<tags 
   ms.service="service-bus"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/11/2015"
   ms.author="sethm" />

# Service Bus bindings

The SDK includes a set of WCF bindings that automate the integration between your WCF services and clients with the relay service offered by Service Bus. In most cases, you only have to replace the current WCF binding that you are using with one of the Service Bus "relay" bindings.

The following table lists all of the Service Bus WCF bindings and the standard WCF bindings to which they correspond. The most frequently used WCF bindings, such as [System.ServiceModel.BasicHttpBinding](https://msdn.microsoft.com/en-us/library/azure/system.servicemodel.basichttpbinding.aspx), [WebHttpBinding](https://msdn.microsoft.com/en-us/library/azure/system.servicemodel.webhttpbinding.aspx), [System.ServiceModel.WS2007HttpBinding](https://msdn.microsoft.com/en-us/library/azure/system.servicemodel.ws2007httpbinding.aspx), and [System.ServiceModel.NetTcpBinding](https://msdn.microsoft.com/en-us/library/azure/system.servicemodel.nettcpbinding.aspx), all have a corresponding Service Bus binding with a very similar name (just insert “Relay” before “Binding”). There are only a few relay bindings, such as [Microsoft.ServiceBus.NetOnewayRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.netonewayrelaybinding.aspx) and [Microsoft.ServiceBus.NetEventRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.neteventrelaybinding.aspx), that do not have a corresponding WCF binding.

|Standard WCF Binding|Equivalent Relay Binding|
|---|---|
|System.ServiceModel.BasicHttpBinding|Microsoft.ServiceBus.BasicHttpRelayBinding|
|System.ServiceModel.WebHttpBinding|Microsoft.ServiceBus.WebHttpRelayBinding|
|System.ServiceModel.WS2007HttpBinding|Microsoft.ServiceBus.WS2007HttpRelayBinding|
|System.ServiceModel.NetTcpBinding|Microsoft.ServiceBus.NetTcpRelayBinding|
|N/A|Microsoft.ServiceBus.NetOnewayRelayBinding|
|N/A|Microsoft.ServiceBus.NetEventRelayBinding|

The relay bindings work in a similar way to the standard WCF bindings. For example, they support the different WCF message versions (SOAP 1.1, SOAP 1.2, and None), the various WS-* security scenarios, reliable messaging, streaming, metadata exchange, the Web programming model (for example, [WebGet] and [WebInvoke]), and many more standard WCF features. There are only a few WCF features that are not supported, such as atomic transaction flow and transport level authentication.

If you are familiar with how WCF works, you might be interested to know how the relay bindings (shown earlier in this topic) map to the underlying WCF transport binding elements. The following table specifies the transport binding element for each relay binding. As you can see, the SDK includes several WCF transport binding elements including [Microsoft.ServiceBus.HttpRelayTransportBindingElement](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.httprelaytransportbindingelement.aspx), [Microsoft.ServiceBus.HttpsRelayTransportBindingElement](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.httpsrelaytransportbindingelement.aspx), [Microsoft.ServiceBus.TcpRelayTransportBindingElement](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.tcprelaytransportbindingelement.aspx), and [Microsoft.ServiceBus.RelayedOnewayTransportBindingElement](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.relayedonewaytransportbindingelement.aspx).

|Relay Binding|Transport Binding Element|
|---|---|
|Microsoft.ServiceBus.BasicHttpRelayBinding|Microsoft.ServiceBus.HttpRelayTransportBindingElementMicrosoft.ServiceBus.HttpsRelayTransportBindingElement|
|Microsoft.ServiceBus.WebHttpRelayBinding|Microsoft.ServiceBus.HttpRelayTransportBindingElementMicrosoft.ServiceBus.HttpsRelayTransportBindingElement|
|Microsoft.ServiceBus.WS2007HttpRelayBinding|Microsoft.ServiceBus.HttpRelayTransportBindingElementMicrosoft.ServiceBus.HttpsRelayTransportBindingElement|
|Microsoft.ServiceBus.NetTcpRelayBinding|Microsoft.ServiceBus.TcpRelayTransportBindingElement|
|Microsoft.ServiceBus.NetOnewayRelayBinding|Microsoft.ServiceBus.RelayedOnewayTransportBindingElement|
|Microsoft.ServiceBus.NetEventRelayBinding|Microsoft.ServiceBus.RelayedOnewayTransportBindingElement|

These WCF primitives are ultimately what provide the low-level channel integration with the relay service behind the scenes, but those details are hidden from view behind the binding. The following sections discuss the details of the main WCF relay bindings and show how to use them.

## NetMessagingBinding

The [NetMessagingBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.messaging.netmessagingbinding.aspx) binding can be used by WCF-enabled applications to send and receive messages through queues, topics and subscriptions. For more information, see [[NetMessagingBinding](https://msdn.microsoft.com/library/hh532034(VS.103).aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.messaging.netmessagingbinding.aspx).

## NetOnewayRelayBinding

NetOnewayRelayBinding is the most constrained of the all the relay bindings, because it only supports one-way messages. However, it is also specifically optimized for that scenario. By default, the [[NetOnewayRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.netonewayrelaybinding.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.netonewayrelaybinding.aspx) binding uses SOAP 1.2 over TCP together with a binary encoding of the messages, although these communication settings are configurable through standard binding configuration techniques. Services that use this binding must always use the “sb” protocol scheme.

When using this binding in the default configuration, the on-premises WCF service attempts to establish an outbound connection with the relay service in order to create a bidirectional socket. In this case, it always creates a secure TCP/SSL connection through outbound port 9351. During the connection process the WCF service authenticates (by supplying a token acquired from Access Control), specifies a name on which to listen in the relay service, and tells the relay service what type of listener to create. When a WCF client uses this binding in the default configuration, it creates a TCP connection with the relay via port 9350 (TCP) or 9351 (TCP/SSL), depending on the binding configuration. During the connection process it must authenticate with the relay by supplying a token acquired from Access Control. Once the client has successfully connected, it can start to send one-way messages to Service Bus to be “relayed” to the on-premises service through its TCP connection

If you set the [NetOnewayRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.netonewayrelaybinding.aspx) binding security mode property to Transport, the channel will require SSL protection. In this case, all traffic sent to and from the relay service will be protected via SSL; however, it is important to realize that the message will pass through the relay service in the clear. If you want to ensure full privacy, you should use the Message security mode, in which case you can encrypt everything except the addressing information in the message passing through the relay service.

The [NetOnewayRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.netonewayrelaybinding.aspx) binding requires all operations on the service contract to be marked as one-way operations (IsOneWay=true). Assuming that’s the case, to use this WCF binding, specify it on your endpoint definitions and supply the necessary credentials.

### System Connectivity Mode

When using the [NetOnewayRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.netonewayrelaybinding.aspx), the on-premises WCF service connects to the relay service over TCP by default. If you are operating in a network environment that does not enable any outbound TCP connections beyond HTTP(s), you can configure the various relay bindings to use a more aggressive connection mode to work around those constraints. This is made possible by configuring the on-premises WCF service to establish an HTTP connection with the relay service (instead of a TCP connection). Service Bus provides a system-wide ConnectivityMode setting that you can configure with one of three values: Tcp, Http, and AutoDetect (see the following table). If you want to make sure that your services connect over HTTP, set this property to Http.

|ConnectivityMode|Description|
|---|---|
|Tcp|Services create TCP connections with the relay service through port 9351 (SSL).|
|Http|Services create an HTTP connection with the relay service making it easier to work around TCP port constraints.|
|AutoDetect (Default)|This mode automatically selects between the Tcp and Http modes based on an auto-detection mechanism that probes whether either connectivity option is available for the current network environment and prefers Tcp.|

AutoDetect is the default mode, which means the relay bindings will automatically determine whether to use TCP or HTTP for connecting the on-premises service to the relay service. If TCP is possible on the given network configuration, it will use that mode by default (that is, it attempts to use TCP by sending a ping message to a connection-detecting URL). If the TCP connection fails, it automatically switches to the HTTP mode. Hence, most of the time, you do not have to set this property explicitly because the default “auto detect” behavior determines the behavior for you. The only time that you have to set this property explicitly is when you want to force either TCP or HTTP.

You can set the connectivity mode at the AppDomain-level through the static [ServiceBusEnvironment](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.servicebusenvironment.aspx) class. It provides a [SystemConnectivity](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.servicebusenvironment.systemconnectivity.aspx) property in which you can specify one of the three ConnectivityMode values shown earlier in this section. The following code illustrates how to modify an application to use the HTTP connectivity mode:

[Copy](javascript:if (window.epx.codeSnippet)window.epx.codeSnippet.copyCode('CodeSnippetContainerCode_582d00bc-989a-48f8-8f35-ee6ace027940');)

The system connectivity mode setting takes effect on all of the relay bindings.

## NetEventRelayBinding

NetEventRelayBinding is very similar to the NetOnewayRelayBinding binding, in the way it is implemented. The binding defaults and security options are identical to those for [NetOnewayRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.netonewayrelaybinding.aspx). In addition, the mechanics around how clients/services interact with the relay service are basically the same. In fact, the [[NetEventRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.neteventrelaybinding.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.neteventrelaybinding.aspx) class actually derives from the [[[NetOnewayRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.netonewayrelaybinding.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.netonewayrelaybinding.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.netonewayrelaybinding.aspx) class.

The main difference in the [NetEventRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.neteventrelaybinding.aspx) binding is that it lets you register multiple WCF services with the same Service Bus address. When a client sends a message to such an address, the relay service multicasts the message to all on-premises WCF services currently subscribed to that address.

The [NetEventRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.neteventrelaybinding.aspx) binding supports the same SystemConnectivity options as [NetEventRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.neteventrelaybinding.aspx). When you configure the [SystemConnectivity](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.servicebusenvironment.systemconnectivity.aspx) property on the ServiceBusEnvironment class, it takes effect for all endpoints. Hence, you can use the aggressive HTTP connectivity mode for all your on-premises [[NetEventRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.neteventrelaybinding.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.neteventrelaybinding.aspx) endpoints if they are hosted in a locked-down network environment that blocks outbound TCP connections.

[SystemConnectivity](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.servicebusenvironment.systemconnectivity.aspx)

[ServiceBusEnvironment](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.servicebusenvironment.aspx)

[NetEventRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.neteventrelaybinding.aspx)

## NetTcpRelayBinding

The [NetTcpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.nettcprelaybinding.aspx) binding supports two-way messaging semantics and is very closely aligned with the standard WCF NetTcpBinding – the key difference is that [[NetTcpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.nettcprelaybinding.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.nettcprelaybinding.aspx) creates a publicly-reachable TCP endpoint in the relay service.

By default, the [NetTcpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.nettcprelaybinding.aspx) binding supports SOAP 1.2 over TCP and it uses binary serialization for efficiency. Although its configuration is very similar to that of the NetTcpBinding, their underlying TCP socket layers are different and are therefore not directly compatible with each other. This means that client applications will also have to be configured to use [[NetTcpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.nettcprelaybinding.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.nettcprelaybinding.aspx) in order to integrate.

First, the on-premises WCF service establishes a secure outbound TCP connection with the relay service. During the process, it must authenticate, specify an address to listen on, and specify what type of listener to create in the relay. Up to this point, it is very similar to the [NetOnewayRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.netonewayrelaybinding.aspx) binding. When an incoming message arrives on one of the front nodes, a control message is then routed down to the on-premises WCF service indicating how to create a rendezvous connection back with the client front-end node. This establishes a direct socket-to-socket forwarder for relaying TCP messages.

The [NetTcpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.nettcprelaybinding.aspx) binding supports two connection modes (see [TcpRelayConnectionMode](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.tcprelayconnectionmode.aspx)) that control how the client and service communicate with each other through the relay service (see the following table).

|TcpConnectionMode|Description|
|---|---|
|Relayed (default)|All communication is relayed through the relay service. The SSL-protected control connection is used to negotiate a relayed end-to-end socket connection that all communication flows through. Once the connection is established the relay service behaves as a socket forwarder proxy relaying a bi-directional byte stream.|
|Hybrid|The initial communication is relayed through the relay service infrastructure while the client/service negotiate a direct socket connection to each other. The coordination of this direct connection is governed by the relay service. The direct socket connection algorithm can establish direct connections between two parties that sit behind opposing firewalls and NAT devices. The algorithm uses only outbound connections for firewall traversal and relies on a mutual port prediction algorithm for NAT traversal. Once a direct connection can be established the relayed connection is automatically upgraded to a direct connection without message or data loss. If the direct connection cannot be established, data will continue to flow through the relay service as usual.|

Relayed mode is the default, while Hybrid mode instructs the relay service to establish a direct connection between the client and service applications. Therefore, no data has to pass through the relay. It is considered a “hybrid” mode because it starts by relaying information through the relay while it attempts to upgrade to a direct connection. If successful, it will switch over to a direct connection without any data loss. If it cannot establish a direct connection, it will continue to use the relay service. The [NetTcpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.nettcprelaybinding.aspx) binding also supports the [[SystemConnectivity](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.servicebusenvironment.systemconnectivity.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.servicebusenvironment.systemconnectivity.aspx) feature when you must configure the on-premises service to connect to the relay service over HTTP. When you configure the [[SystemConnectivity](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.servicebusenvironment.systemconnectivity.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.servicebusenvironment.systemconnectivity.aspx) property, it takes effect for all endpoints. Hence, you can use the aggressive HTTP connectivity mode for all your on-premises [[NetTcpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.nettcprelaybinding.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.nettcprelaybinding.aspx) endpoints if they are being hosted in a locked-down network environment that blocks outbound TCP connections.

## HTTP Relay Bindings

All of the bindings discussed to this point require clients to use WCF on the client side of the interaction. When you need non-WCF clients to integrate with your Service Bus endpoints, you can support relaying HTTP-based messages by selecting one of the various HTTP relay bindings.

The Service Bus includes several HTTP bindings –[WebHttpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.webhttprelaybinding.aspx), BasicHttpRelayBinding, and WS2007HttpRelayBinding. These HTTP bindings offer wider reach and more interoperability because they can support any client that knows how to use the standard protocols supported by each of these bindings. [WebHttpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.webhttprelaybinding.aspx) and [BasicHttpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.basichttprelaybinding.aspx) provide the greatest reach because they are based on HTTP/REST and basic SOAP, respectively. The [[WS2007HttpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.ws2007httprelaybinding.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.ws2007httprelaybinding.aspx) binding can provide additional layers of functionality through the WS-* protocols. When using the [[[WS2007HttpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.ws2007httprelaybinding.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.ws2007httprelaybinding.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.ws2007httprelaybinding.aspx) binding, clients will have to support the same suite of WS-* protocols enabled on the endpoint.

[WebHttpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.webhttprelaybinding.aspx)

[BasicHttpRelayBinding](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.basichttprelaybinding.aspx)

Regardless of which HTTP relay binding you use, the mechanics of what occurs in the relay service is largely the same. The on-premises WCF service first establishes either a TCP or HTTP connection with the relay service depending on the [[ConnectivityMode](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.connectivitymode.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.connectivitymode.aspx) setting that is being used. The [[ConnectivityMode](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.connectivitymode.aspx)](https://msdn.microsoft.com/en-us/library/azure/microsoft.servicebus.connectivitymode.aspx) functionality works the same on all HTTP relay bindings. Clients then start to send messages to the HTTP endpoint exposed by the relay service. This means WCF is no longer necessary on the client – any HTTP/SOAP compatible library will do. When an incoming message arrives on one of the front nodes, a control message is then routed to the service indicating how to create a rendezvous connection back with the front-end node of the client. This establishes a direct HTTP-to-socket forwarder for relaying the HTTP messages.

The relay service knows how to route SOAP 1.1, SOAP 1.2, and plain HTTP (REST) messages transparently. You control the messaging style and the various WS-* protocols you want to use by configuring one of the HTTP relay bindings as you would any other WCF binding.

