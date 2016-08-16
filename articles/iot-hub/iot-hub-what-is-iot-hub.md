<properties
 pageTitle="Azure IoT Hub overview | Microsoft Azure"
 description="Overview of Azure IoT Hub service: what is iot hub, device connectivity, internet of things communication patterns, and service-assisted communication pattern"
 services="iot-hub"
 documentationCenter=""
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="get-started-article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="06/06/2016"
 ms.author="dobett"/>

# What is Azure IoT Hub?

Welcome to Azure IoT Hub. This article provides an overview of Azure IoT Hub and describes why you should use this service when you implement an Internet of Things (IoT) solution.

Azure IoT Hub is a fully managed service that enables reliable and secure bidirectional communications between millions of IoT devices and a solution back end. Azure IoT Hub:

- Provides reliable device-to-cloud and cloud-to-device messaging at scale.
- Enables secure communications using per-device security credentials and access control.
- Provides extensive monitoring for device connectivity and device identity management events.
- Includes device libraries for the most popular languages and platforms.

The article [Comparison of IoT Hub and Event Hubs][lnk-compare] describes the key differences between these two services and highlights the advantages of using IoT Hub in your IoT solutions.

![Azure IoT Hub as cloud gateway in internet of things solution][img-architecture]

> [AZURE.NOTE] For an in-depth discussion of IoT architecture see the [Microsoft Azure IoT Reference Architecture][lnk-refarch].

## IoT device-connectivity challenges

IoT Hub and the device libraries help you to meet the challenges of how to reliably and securely connect devices to the solution back end. IoT devices:

- Are often embedded systems with no human operator.
- Can be in remote locations, where physical access is very expensive.
- May only be reachable through the solution back end.
- May have limited power and processing resources.
- May have intermittent, slow, or expensive network connectivity.
- May need to use proprietary, custom, or industry-specific application protocols.
- Can be created using a large set of popular hardware and software platforms.

In addition to the requirements above, any IoT solution must also deliver scale, security, and reliability. The resulting set of connectivity requirements is hard and time-consuming to implement when you use traditional technologies, such as web containers and messaging brokers.

## Why use Azure IoT Hub

Azure IoT Hub addresses the device-connectivity challenges in the following ways:

-   **Per-device authentication and secure connectivity**. You can provision each device with its own [security key][lnk-devguide-security] to enable it to connect to IoT Hub. The [IoT Hub identity registry][lnk-devguide-identityregistry] stores device identities and keys in a solution. A solution back end can whitelist and blacklist individual devices, which enables complete control over device access.

-   **Monitoring of device connectivity operations**. You can receive detailed operation logs about device identity management operations and device connectivity events. This enables your IoT solution to easily identify connectivity issues, such as devices that try to connect with wrong credentials, send messages too frequently, or reject all cloud-to-device messages.

-   **An extensive set of device libraries**. [Azure IoT device SDKs][lnk-device-sdks] are available and supported for a variety of languages and platforms--C for many Linux distributions, Windows, and real-time operating systems. Azure IoT device SDKs also support managed languages, such as C#, Java, and JavaScript.

-   **IoT protocols and extensibility**. If your solution cannot use the device libraries, IoT Hub exposes a public protocol that enables devices to natively use the MQTT v3.1.1, HTTP 1.1, or AMQP 1.0 protocols. You can also extend IoT Hub to provide support for custom protocols by:

    - Creating a field gateway with the [Azure IoT Gateway SDK][lnk-gateway-sdk] that converts your custom protocol to one of the three protocols understood by IoT Hub. 
    - Customizing the [Azure IoT protocol gateway][protocol-gateway], an open source component that runs in the cloud.

-   **Scale**. Azure IoT Hub scales to millions of simultaneously connected devices and millions of events per second.

These benefits are generic to many communication patterns. IoT Hub currently enables you to implement the following specific communication patterns:

-   **Event-based device-to-cloud ingestion.** IoT Hub can reliably receive millions of events per second from your devices. It can then process them on your hot path by using an event processor engine. It can also store them on your cold path for analysis. IoT Hub retains the event data for up to seven days to guarantee reliable processing and to absorb peaks in the load.

-   **Reliable cloud-to-device messaging (or *commands*).** The solution back end can use IoT Hub to send messages with an at-least-once delivery guarantee to individual devices. Each message has an individual time-to-live setting, and the back end can request both delivery and expiration receipts. This ensures full visibility into the life cycle of a cloud-to-device message. You can then implement business logic that includes operations that run on devices.

-   **Upload files and cached sensor data to the cloud.** Your devices can upload files to Azure Storage using SAS URIs managed for you by IoT Hub. IoT Hub can generate notifications when files arrive in the cloud to enable the back end to process them.

## Gateways

A gateway in an IoT solution is typically either a [protocol gateway][lnk-gateway] that is deployed in the cloud or a [field gateway][lnk-field-gateway] that is deployed locally with your devices. A protocol gateway performs protocol translation, for example MQTT to AMQP. A field gateway can run analytics on the edge, make time-sensitive decisions that can reduce latency, provide device management services, enforce security and privacy constraints, and can also perform protocol translation. Both gateway types act as intermediaries between your devices and your IoT hub.

A field gateway differs from a simple traffic routing device (such as a network address translation (NAT) device or firewall) because it typically performs an active role in managing access and information flow in your solution.

A solution may include both protocol and field gateways.

## How does IoT Hub work?

Azure IoT Hub implements the [service-assisted communication][lnk-service-assisted-pattern] pattern to mediate the interactions between your devices and your solution back end. The goal of service-assisted communication is to establish trustworthy, bidirectional communication paths between a control system, such as IoT Hub, and special-purpose devices that are deployed in untrusted physical space. The pattern establishes the following principles:

- Security takes precedence over all other capabilities.
- Devices do not accept unsolicited network information. A device establishes all connections and routes in an outbound-only fashion. For a device to receive a command from the back end, the device must regularly initiate a connection to check for any pending commands to process.
- Devices should only connect to or establish routes to well-known services they are peered with, such as IoT Hub.
- The communication path between device and service or between device and gateway is secured at the application protocol layer.
- System-level authorization and authentication are based on per-device identities. They make access credentials and permissions nearly instantly revocable.
- Bidirectional communication for devices that connect sporadically due to power or connectivity concerns is facilitated by holding commands and device notifications until a device connects to receive them. IoT Hub maintains device specific queues for the commands it sends.
- Application payload data is secured separately for protected transit through gateways to a particular service.

The mobile industry has successfully used the service-assisted communication pattern at enormous scale to implement push notification services such as [Windows Push Notification Services][lnk-wns], [Google Cloud Messaging][lnk-google-messaging], and [Apple Push Notification Service][lnk-apple-push].

## Next steps

To learn how Azure IoT Hub enables standards-based IoT device management for you to remotely manage, configure, and update your devices, see [Overview of Azure IoT Hub device management][lnk-device-management].

To implement client applications on a wide variety of device hardware platforms and operating systems, you can use the IoT device SDKs. The IoT device SDKs include libraries that facilitate sending telemetry to an IoT hub and receiving cloud-to-device commands. When you use the SDKs, you can choose from a number of network protocols to communicate with IoT Hub. To learn more, see the [information about device SDKs][lnk-device-sdks].

To get started writing some code and running some samples, see the [Get started with IoT Hub][lnk-get-started] tutorial.

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
[lnk-devguide-security]: iot-hub-devguide.md#security
[lnk-wns]: https://msdn.microsoft.com/library/windows/apps/mt187203.aspx
[lnk-google-messaging]: https://developers.google.com/cloud-messaging/
[lnk-apple-push]: https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW9
[lnk-device-sdks]: https://github.com/Azure/azure-iot-sdks
[lnk-refarch]: http://download.microsoft.com/download/A/4/D/A4DAD253-BC21-41D3-B9D9-87D2AE6F0719/Microsoft_Azure_IoT_Reference_Architecture.pdf
[lnk-gateway-sdk]: https://github.com/Azure/azure-iot-gateway-sdk
[lnk-device-management]: iot-hub-device-management-overview.md
