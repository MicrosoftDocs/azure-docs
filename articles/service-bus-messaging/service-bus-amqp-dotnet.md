---
title: AMQP compatibility for the retired WindowsAzure.ServiceBus library
description: Review AMQP configuration and serialization differences when migrating existing WindowsAzure.ServiceBus applications to Azure.Messaging.ServiceBus.
ms.topic: article
ms.date: 10/06/2026
ms.devlang: csharp
ms.custom: devx-track-dotnet
---

# AMQP compatibility for the retired WindowsAzure.ServiceBus library

> [!NOTE]
> This article provides AMQP configuration and serialization details for existing `WindowsAzure.ServiceBus` applications during migration. Use the [migration guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/MigrationGuide_WindowsAzureServiceBus.md) to move to the supported `Azure.Messaging.ServiceBus` library.

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)]

`WindowsAzure.ServiceBus` defaults to the retired Service Bus Messaging Protocol (SBMP). Versions 2.1 and later also provide AMQP 1.0. Existing applications that continue to use this library must select AMQP explicitly.

To use AMQP 1.0 instead of the default protocol requires explicit configuration on the Service Bus connection string, or in the client constructors via the [TransportType](/dotnet/api/microsoft.servicebus.messaging.transporttype) option. Other than this change, application code remains unchanged when using AMQP 1.0.

There are a few API features that are not supported when using AMQP. These unsupported features are listed in the section [Behavioral differences](#behavioral-differences). Some of the advanced configuration settings also have a different meaning when using AMQP.

## Configure connection string to use AMQP 1.0

Append your connection string with `;TransportType=Amqp` to instruct the client to make its connection to Service Bus using AMQP 1.0. For example,

`Endpoint=sb://[namespace].servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=[SAS key];TransportType=Amqp`

Where `namespace` and `SAS key` are obtained from the [Azure portal] when you create a Service Bus namespace. For more information, see [Create a Service Bus namespace using the Azure portal][Create a Service Bus namespace using the Azure portal].

### AMQP over WebSockets
To use AMQP over WebSockets, set `TransportType` in the connection string to `AmqpWebSockets`. For example: `Endpoint=sb://[namespace].servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=[SAS key];TransportType=AmqpWebSockets`.

## Message serialization

When using SBMP, `WindowsAzure.ServiceBus` used [DataContractSerializer][DataContractSerializer] for the body of a [BrokeredMessage][BrokeredMessage]. With AMQP, the library uses the AMQP type system to represent the message body. This representation allows an application on another platform, such as a Java application using JMS, to interpret supported body types.

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

When migrating an existing `WindowsAzure.ServiceBus` application from SBMP to AMQP, account for these differences:

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
* [Migrate from WindowsAzure.ServiceBus to Azure.Messaging.ServiceBus](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/MigrationGuide_WindowsAzureServiceBus.md)

[Create a Service Bus namespace using the Azure portal]: service-bus-create-namespace-portal.md
[DataContractSerializer]: /dotnet/api/system.runtime.serialization.datacontractserializer
[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage
[Microsoft.ServiceBus.Messaging.MessagingFactory.AcceptMessageSession]: /dotnet/api/microsoft.servicebus.messaging.messagingfactory.acceptmessagesession#Microsoft_ServiceBus_Messaging_MessagingFactory_AcceptMessageSession
[OperationTimeout]: /dotnet/api/microsoft.servicebus.messaging.messagingfactorysettings.operationtimeout#Microsoft_ServiceBus_Messaging_MessagingFactorySettings_OperationTimeout
[Azure portal]: https://portal.azure.com
[Service Bus AMQP overview]: service-bus-amqp-overview.md
[AMQP 1.0 protocol guide]: service-bus-amqp-protocol-guide.md
