<properties
 pageTitle="Developer guide - IoT Hub endpoints | Microsoft Azure"
 description="Azure IoT Hub developer guide - reference information about IoT Hub endpoints"
 services="iot-hub"
 documentationCenter=".net"
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/30/2016" 
 ms.author="dobett"/>

# Reference - IoT Hub endpoints

## List of IoT Hub endpoints

Azure IoT Hub is a multi-tenant service that exposes its functionality to various actors. The following diagram shows the various endpoints that IoT Hub exposes.

![IoT Hub endpoints][img-endpoints]

The following is a description of the endpoints:

* **Resource provider**. The IoT Hub resource provider exposes an [Azure Resource Manager][lnk-arm] interface that enables Azure subscription owners to create and delete IoT hubs, and update IoT hub properties. IoT Hub properties govern [hub-level security policies][lnk-accesscontrol], as opposed to device-level access control, and functional options for cloud-to-device and device-to-cloud messaging. The resource provider also enables you to [export device identities][lnk-importexport].
* **Device identity management**. Each IoT hub exposes a set of HTTP REST endpoints to manage device identities (create, retrieve, update, and delete). [Device identities][lnk-device-identities] are used for device authentication and access control.
* **Device endpoints**. For each device provisioned in the device identity registry, IoT Hub exposes a set of endpoints that a device can use to send and receive messages:
    - *Send device-to-cloud messages*. Use this endpoint to [send device-to-cloud messages][lnk-d2c].
    - *Receive cloud-to-device messages*. A device uses this endpoint to receive targeted [cloud-to-device messages][lnk-c2d].
    - *Initiate file uploads*. A device uses this endpoint to receive an Azure Storage SAS URI from IoT Hub to [upload a file][lnk-upload].

    These endpoints are exposed using [MQTT v3.1.1][lnk-mqtt], HTTP 1.1, and [AMQP 1.0][lnk-amqp] protocols. Note that AMQP is also available over [WebSockets][lnk-websockets] on port 443.
* **Service endpoints**. Each IoT hub exposes a set of endpoints your application back end can use to communicate with your devices. These endpoints are currently only exposed using the [AMQP][lnk-amqp] protocol.
    - *Receive device-to-cloud messages*. This endpoint is compatible with [Azure Event Hubs][lnk-event-hubs]. A back-end service can use it to read all the [device-to-cloud messages][lnk-d2c] sent by your devices.
    - *Send cloud-to-device messages and receive delivery acknowledgments*. These endpoints enable your application back end to send reliable [cloud-to-device messages][lnk-c2d], and to receive the corresponding delivery or expiration acknowledgments.
    - *Receive file notifications*. This messaging endpoint allows you to receive notifications of when your devices successfully upload a file. 

The [IoT Hub APIs and SDKs][lnk-sdks] article describes the various ways to access these endpoints.

Finally, it is important to note that all IoT Hub endpoints use the [TLS][lnk-tls] protocol, and no endpoint is ever exposed on unencrypted/unsecured channels.

## How to read from Event Hubs-compatible endpoints

When you use the [Azure Service Bus SDK for .NET][lnk-servicebus-sdk] or the [Event Hubs - Event Processor Host][lnk-eventprocessorhost], you can use any IoT Hub connection strings with the correct permissions. Then use **messages/events** as the Event Hub name.

When you use SDKs (or product integrations) that are unaware of IoT Hub, you must retrieve an Event Hubs-compatible endpoint and Event Hub name from the IoT Hub settings in the [Azure portal][lnk-management-portal]:

1. In the IoT hub blade, click **Messaging**.
2. In the **Device-to-cloud settings** section, you find the following values: **Event Hub-compatible endpoint**, **Event Hub-compatible name**, and **Partitions**.

    ![Device-to-cloud settings][img-eventhubcompatible]

> [AZURE.NOTE] If the SDK requires a **Hostname** or **Namespace** value, remove the scheme from the **Event Hub-compatible endpoint**. For example, if your Event Hub-compatible endpoint is **sb://iothub-ns-myiothub-1234.servicebus.windows.net/**, the **Hostname** would be **iothub-ns-myiothub-1234.servicebus.windows.net**, and the **Namespace** would be **iothub-ns-myiothub-1234**.

You can then use any shared access security policy that has the **ServiceConnect** permissions to connect to the specified Event Hub.

If you need to build an Event Hub connection string by using the previous information, use the following pattern:

```
Endpoint={Event Hub-compatible endpoint};SharedAccessKeyName={iot hub policy name};SharedAccessKey={iot hub policy key}
```

The following is a list of SDKs and integrations that you can use with Event Hub-compatible endpoints that IoT Hub exposes:

* [Java Event Hubs client](https://github.com/hdinsight/eventhubs-client)
* [Apache Storm spout](../hdinsight/hdinsight-storm-develop-csharp-event-hub-topology.md). You can view the [spout source](https://github.com/apache/storm/tree/master/external/storm-eventhubs) on GitHub.
* [Apache Spark integration](../hdinsight/hdinsight-apache-spark-eventhub-streaming.md)

[lnk-eventprocessorhost]: http://blogs.msdn.com/b/servicebus/archive/2015/01/16/event-processor-host-best-practices-part-1.aspx

[img-endpoints]: ./media/iot-hub-devguide-endpoints/endpoints.png
[img-eventhubcompatible]: ./media/iot-hub-devguide-endpoints/eventhubcompatible.png
[lnk-amqp]: https://www.amqp.org/
[lnk-mqtt]: http://mqtt.org/
[lnk-websockets]: https://tools.ietf.org/html/rfc6455
[lnk-arm]: ../resource-group-overview.md
[lnk-event-hubs]: http://azure.microsoft.com/documentation/services/event-hubs/
[lnk-management-portal]: https://portal.azure.com

[lnk-tls]: https://tools.ietf.org/html/rfc5246

[lnk-servicebus-sdk]: https://www.nuget.org/packages/WindowsAzure.ServiceBus

[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-accesscontrol]: iot-hub-devguide-security.md#access-control-and-permissions
[lnk-importexport]: iot-hub-devguide-identity-registry.md#import-and-export-device-identities
[lnk-d2c]: iot-hub-devguide-messaging.md#device-to-cloud-messages
[lnk-device-identities]: iot-hub-devguide-identity-registry.md
[lnk-upload]: iot-hub-devguide-file-upload.md
[lnk-c2d]: iot-hub-devguide-messaging.md#cloud-to-device-messages