---
title: Use legacy WindowsAzure.ServiceBus .NET framework library with AMQP 1.0 | Microsoft Docs
description: This article describes how to use the legacy WindowsAzure.ServiceBus .NET framework library with AMQP (Advanced Messaging Queuing Protocol).
ms.topic: article
ms.date: 04/30/2021
ms.devlang: csharp
ms.custom: devx-track-dotnet
---

# Use legacy WindowsAzure.ServiceBus .NET framework library with AMQP 1.0

> [!NOTE]
> This article is for existing users of the WindowsAzure.ServiceBus package looking to switch to using AMQP within the same package. While this package will continue to receive critical bug fixes, we strongly encourage to upgrade to the new [Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus) package instead which is available as of November 2020 and which support AMQP by default.

By default, the WindowsAzure.ServiceBus package communicates with the Service Bus service using a dedicated SOAP-based protocol called Service Bus Messaging Protocol (SBMP). In version 2.1 support for AMQP 1.0 was added which we recommend using rather than the default protocol.

To use AMQP 1.0 instead of the default protocol requires explicit configuration on the Service Bus connection string, or in the client constructors via the [TransportType](/dotnet/api/microsoft.servicebus.messaging.transporttype) option. Other than this change, application code remains unchanged when using AMQP 1.0.

There are a few API features that are not supported when using AMQP. These unsupported features are listed in the section [Behavioral differences](#behavioral-differences). Some of the advanced configuration settings also have a different meaning when using AMQP.

## Configure connection string to use AMQP 1.0

Append your connection string with `;TransportType=Amqp` to instruct the client to make its connection to Service Bus using AMQP 1.0.
For example, 

`Endpoint=sb://[namespace].servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=[SAS key];TransportType=Amqp`

Where `namespace` and `SAS key` are obtained from the [Azure portal] when you create a Service Bus namespace. For more information, see [Create a Service Bus namespace using the Azure portal][Create a Service Bus namespace using the Azure portal].

### AMQP over WebSockets
To use AMQP over WebSockets, set `TransportType` in the connection string to `AmqpWebSockets`. For example: `Endpoint=sb://[namespace].servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=[SAS key];TransportType=AmqpWebSockets`. 

## Message serialization

When using the default protocol, the default serialization behavior of the .NET client library is to use the [DataContractSerializer][DataContractSerializer] type to serialize a [BrokeredMessage][BrokeredMessage] instance for transport between the client library and the Service Bus service. When using the AMQP transport mode, the client library uses the AMQP type system for serialization of the [brokered message][BrokeredMessage] into an AMQP message. This serialization enables the message to be received and interpreted by a receiving application that is potentially running on a different platform, for example, a Java application that uses the JMS API to access Service Bus.

When you construct a [BrokeredMessage][BrokeredMessage] instance, you can provide a .NET object as a parameter to the constructor to serve as the body of the message. For objects that can be mapped to AMQP primitive types, the body is serialized into AMQP data types. If the object cannot be directly mapped into an AMQP primitive type; that is, a custom type defined by the application, then the object is serialized using the [DataContractSerializer][DataContractSerializer], and the serialized bytes are sent in an AMQP data message.

To facilitate interoperability with non-.NET clients, use only .NET types that can be serialized directly into AMQP types for the body of the message. The following table details those types and the corresponding mapping to the AMQP type system.

| .NET Body Object Type | Mapped AMQP Type | AMQP Body Section Type |
| --- | --- | --- |
| bool |boolean |AMQP Value |
| byte |ubyte |AMQP Value |
| ushort |ushort |AMQP Value |
| uint |uint |AMQP Value |
| ulong |ulong |AMQP Value |
| sbyte |byte |AMQP Value |
| short |short |AMQP Value |
| int |int |AMQP Value |
| long |long |AMQP Value |
| float |float |AMQP Value |
| double |double |AMQP Value |
| decimal |decimal128 |AMQP Value |
| char |char |AMQP Value |
| DateTime |timestamp |AMQP Value |
| Guid |uuid |AMQP Value |
| byte[] |binary |AMQP Value |
| string |string |AMQP Value |
| System.Collections.IList |list |AMQP Value: items contained in the collection can only be those that are defined in this table. |
| System.Array |array |AMQP Value: items contained in the collection can only be those that are defined in this table. |
| System.Collections.IDictionary |map |AMQP Value: items contained in the collection can only be those that are defined in this table.Note: only String keys are supported. |
| Uri |Described string(see the following table) |AMQP Value |
| DateTimeOffset |Described long(see the following table) |AMQP Value |
| TimeSpan |Described long(see the following) |AMQP Value |
| Stream |binary |AMQP Data (may be multiple). The Data sections contain the raw bytes read from the Stream object. |
| Other Object |binary |AMQP Data (may be multiple). Contains the serialized binary of the object that uses the DataContractSerializer or a serializer supplied by the application. |

| .NET Type | Mapped AMQP Described Type | Notes |
| --- | --- | --- |
| Uri |`<type name=”uri” class=restricted source=”string”> <descriptor name=”com.microsoft:uri” /></type>` |Uri.AbsoluteUri |
| DateTimeOffset |`<type name=”datetime-offset” class=restricted source=”long”> <descriptor name=”com.microsoft:datetime-offset” /></type>` |DateTimeOffset.UtcTicks |
| TimeSpan |`<type name=”timespan” class=restricted source=”long”> <descriptor name=”com.microsoft:timespan” /></type>` |TimeSpan.Ticks |

## Behavioral differences

There are some small differences in the behavior of the WindowsAzure.ServiceBus API when using AMQP, compared to the default protocol:

* The [OperationTimeout][OperationTimeout] property is ignored.
* `MessageReceiver.Receive(TimeSpan.Zero)` is implemented as `MessageReceiver.Receive(TimeSpan.FromSeconds(10))`.
* Completing messages by lock tokens can only be done by the message receivers that initially received the messages.

## Control AMQP protocol settings

The [.NET APIs](/dotnet/api/) expose several settings to control the behavior of the AMQP protocol:

* **[MessageReceiver.PrefetchCount](/dotnet/api/microsoft.servicebus.messaging.messagereceiver.prefetchcount#Microsoft_ServiceBus_Messaging_MessageReceiver_PrefetchCount)**: Controls the initial credit applied to a link. The default is 0.
* **[MessagingFactorySettings.AmqpTransportSettings.MaxFrameSize](/dotnet/api/microsoft.servicebus.messaging.amqp.amqptransportsettings.maxframesize#Microsoft_ServiceBus_Messaging_Amqp_AmqpTransportSettings_MaxFrameSize)**: Controls the maximum AMQP frame size offered during the negotiation at connection open time. The default is 65,536 bytes.
* **[MessagingFactorySettings.AmqpTransportSettings.BatchFlushInterval](/dotnet/api/microsoft.servicebus.messaging.amqp.amqptransportsettings.batchflushinterval#Microsoft_ServiceBus_Messaging_Amqp_AmqpTransportSettings_BatchFlushInterval)**: If transfers are batchable, this value determines the maximum delay for sending dispositions. Inherited by senders/receivers by default. Individual sender/receiver can override the default, which is 20 milliseconds.
* **[MessagingFactorySettings.AmqpTransportSettings.UseSslStreamSecurity](/dotnet/api/microsoft.servicebus.messaging.amqp.amqptransportsettings.usesslstreamsecurity#Microsoft_ServiceBus_Messaging_Amqp_AmqpTransportSettings_UseSslStreamSecurity)**: Controls whether AMQP connections are established over a TLS connection. The default is **true**.

## Next steps

Ready to learn more? Visit the following links:

* [Service Bus AMQP overview]
* [AMQP 1.0 protocol guide]

[Create a Service Bus namespace using the Azure portal]: service-bus-create-namespace-portal.md
[DataContractSerializer]: /dotnet/api/system.runtime.serialization.datacontractserializer
[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage
[Microsoft.ServiceBus.Messaging.MessagingFactory.AcceptMessageSession]: /dotnet/api/microsoft.servicebus.messaging.messagingfactory.acceptmessagesession#Microsoft_ServiceBus_Messaging_MessagingFactory_AcceptMessageSession
[OperationTimeout]: /dotnet/api/microsoft.servicebus.messaging.messagingfactorysettings.operationtimeout#Microsoft_ServiceBus_Messaging_MessagingFactorySettings_OperationTimeout
[Azure portal]: https://portal.azure.com
[Service Bus AMQP overview]: service-bus-amqp-overview.md
[AMQP 1.0 protocol guide]: service-bus-amqp-protocol-guide.md
