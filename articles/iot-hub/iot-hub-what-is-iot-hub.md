<properties
 pageTitle="Overview of Azure IoT Hub | Microsoft Azure"
 description="A overview of the Azure IoT Hub service including device connectivity, communication patterns, and service assisted communication pattern"
 services="iot-hub"
 documentationCenter=""
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="11/09/2015"
 ms.author="dobett"/>

# What is Azure IoT Hub?

Welcome to Azure IoT Hub. This article provides an overview of Azure IoT Hub and describes why you should use this service when you implement an IoT solution. 

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and a solution back end. Azure IoT Hub: 

- Provides reliable device-to-cloud and cloud-to-device messaging at scale.
- Enables secure communications using per-device security credentials and access control.
- Includes device libraries for the most popular languages and platforms.

![IoT Hub as cloud gateway][img-architecture]

## IoT device connectivity challenges

IoT Hub and the device libraries help you to meet the challenges of how to reliably and securely connect devices to the solution back end. IoT devices:

- Are often embedded systems with no human operator.
- Can be in remote locations, where physical access is very expensive.
- May only be reachable through the solution back end.
- May have limited power and processing resources.
- May have intermittent, slow, or expensive network connectivity.
- May need to use proprietary, custom, or industry specific application protocols.
- Can be created using a large set of popular hardware and software platforms.

In addition to the requirements above, any IoT solution must also deliver scale, security, and reliability. The resulting set of connectivity requirements is hard and time-consuming to implement using traditional technologies such as web containers and messaging brokers.

## Why use Azure IoT Hub

Azure IoT Hub addresses the device connectivity challenges in the following ways:

-   **Per-device authentication and secure connectivity**. You can provision each device with its own security key to enable it to connect to IoT Hub. The [IoT Hub identity registry][lnk-devguide-identityregistry] stores device identities and keys in a solution.  A solution back end can whitelist and blacklist individual devices, enabling complete control over device access.

-   **An extensive set of device libraries**. Azure IoT device SDKs are available and supported for a variety of languages and platforms: C for many Linux distributions, Windows, and RTOS. Azure IoT device SDKs also support managed languages such as C#, Java, and JavaScript.

-   **IoT protocols and extensibility**. If your solution cannot use the device libraries, IoT Hub exposes a public protocol that enables devices to natively use the HTTP 1.1 and AMQP 1.0 protocols. You can also extend IoT Hub to provide support for MQTT v3.1.1 with the [Azure IoT Protocol Gateway][protocol-gateway] open source component. You can run Azure IoT Protocol Gateway in the cloud or on-premises and extend it to support custom protocols.

-   **Scale**. Azure IoT Hub scales to millions of simultaneously connected devices, and millions of events per seconds.

These benefits are generic to many communication patterns. IoT Hub currently enables you to implement the following specific communication patterns:

-   **Event-based device-to-cloud ingestion.** IoT Hub can reliably receive  millions of events per second from your devices and process them on your hot path using an event processor engine, or store them on your cold path for analysis. IoT Hub retains the event data for up to 7 days to guarantee reliable processing and to absorb peaks in the load.

-   **Reliable cloud-to-device messaging (or *commands*).** The solution back end can use IoT Hub to send messages with an at-least-once delivery guarantee to individual devices. Each message has an individual time-to-live setting, and the back end can request both delivery and expiration receipts to ensure full visibility into the life cycle of a cloud-to-device message. This enables you to implement business logic that includes operations that run on devices.

You can also implement other common patterns, such as file upload and download, by taking advantage of IoT-specific features in IoT Hub, such as consistent device identity management, connectivity monitoring, and scale.

The article [Comparison of IoT Hub and Event Hubs][lnk-compare] describes the key differences between these two services and highlights the advantages of using IoT Hub in your IoT solutions.

## Gateways

A gateway in an IoT solution is typically either a [protocol gateway][lnk-gateway] deployed in the cloud or a [field gateway][lnk-field-gateway] deployed locally with your devices. A protocol gateway performs protocol translation, for example MQTT to AMQP. A field gateway provides local management services for your devices and can be a specialized device or software running on an existing piece of hardware. Both types of gateway act as an intermediary between your devices and your IoT Hub.

A field gateway differs from a simple traffic routing device (such as a NAT device or firewall) because it typically performs an active role in managing access and information flow in your solution.

A solution may include both protocol and field gateways.

## How does IoT Hub work?

Azure IoT Hub implements the [Service Assisted Communication][lnk-service-assisted-pattern] pattern to mediate the interactions between your devices and your solution back end. The goal of service assisted communication is to establish trustworthy, bi-directional communication paths between a control system such as IoT Hub and special-purpose devices deployed in untrusted physical space. The pattern establishes the following principles:

- Security takes precedence over all other capabilities.
- Devices do not accept unsolicited network information. A device establishes all connections and routes in an outbound-only fashion. For a device to receive a command from the back end, the device must regularly initiate a connection to check for any pending commands to process.
- Devices should only connect to or establish routes to well-known services, such as an IoT hub, with which they are peered.
- The communication path between device and service or device and gateway is secured at the application protocol layer.
- System-level authorization and authentication is based on per-device identities and makes access credentials and permissions near-instantly revocable.
- Bi-directional communication for devices that connect sporadically due to power or connectivity concerns is facilitated by holding commands and device notifications until a device connects to receive them. IoT Hub maintains device specific queues for the commands it sends.
- Application payload data is secured separately for protected transit through gateways to a particular service.

The mobile industry has successfully used the service assisted communication pattern at enormous scale to implement push notification services such as [Windows Notification Service][lnk-wns], [Google Cloud Messaging][lnk-google-messaging], and [Apple Push Notification Service][lnk-apple-push].

## Next steps

To learn more about Azure IoT Hub, see these links:

* [Get started with IoT Hub][lnk-get-started]
* [Connect your device][lnk-connect-device]
* [Process device-to-cloud messages][lnk-d2c]

[img-architecture]: media/iot-hub-what-is-iot-hub/hubarchitecture.png

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[lnk-connect-device]: https://azure.microsoft.com/develop/iot/
[lnk-d2c]: iot-hub-csharp-csharp-process-d2c.md
[protocol-gateway]: https://github.com/Azure/azure-iot-protocol-gateway/blob/master/README.md
[lnk-service-assisted-pattern]: http://blogs.msdn.com/b/clemensv/archive/2014/02/10/service-assisted-communication-for-connected-devices.aspx "Service Assisted Communication, blog post by Clemens Vasters"
[lnk-compare]: iot-hub-compare-event-hubs.md
[lnk-gateway]: iot-hub-protocol-gateway.md
[lnk-field-gateway]: iot-hub-guidance.md#field-gateways
[lnk-devguide-identityregistry]: iot-hub-devguide.md#identityregistry
[lnk-wns]: https://msdn.microsoft.com/library/windows/apps/mt187203.aspx
[lnk-google-messaging]: https://developers.google.com/cloud-messaging/
[lnk-apple-push]: https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW9
