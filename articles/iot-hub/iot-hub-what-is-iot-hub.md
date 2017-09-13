---
title: Azure IoT Hub overview | Microsoft Docs
description: 'Overview of the Azure IoT Hub service: what is IoT Hub, device connectivity, internet of things communication patterns, gateways, and the service-assisted communication pattern'
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 24376318-5344-4a81-a1e6-0003ed587d53
ms.service: iot-hub
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/16/2017
ms.author: dobett
ms.custom: H1Hack27Feb2017

---
# Overview of the Azure IoT Hub service

Welcome to Azure IoT Hub. This article provides an overview of Azure IoT Hub and describes why you should use this service to implement an Internet of Things (IoT) solution. Azure IoT Hub is a fully managed service that enables reliable and secure bidirectional communications between millions of IoT devices and a solution back end. Azure IoT Hub:

* Provides multiple device-to-cloud and cloud-to-device communication options, including one-way messaging, file transfer, and request-reply methods.
* Provides built-in declarative message routing to other Azure services.
* Provides a queryable store for device metadata and synchronized state information.
* Enables secure communications and access control using per-device security keys or X.509 certificates.
* Provides extensive monitoring for device connectivity and device identity management events.
* Includes device libraries for the most popular languages and platforms.

The article [Comparison of IoT Hub and Event Hubs][lnk-compare] describes the key differences between these two services and highlights the advantages of using IoT Hub in your IoT solutions.

For more information on how Azure and IoT Hub help secure your IoT solution, see [Internet of Things security from the ground up][lnk-security-ground-up].

![Azure IoT Hub as cloud gateway in internet of things solution][img-architecture]

> [!NOTE]
> For an in-depth discussion of IoT architecture, see the [Microsoft Azure IoT Reference Architecture][lnk-refarch].

## IoT device-connectivity challenges

IoT Hub and the device libraries help you to meet the challenges of how to reliably and securely connect devices to the solution back end. IoT devices:

* Are often embedded systems with no human operator.
* Can be in remote locations, where physical access is expensive.
* May only be reachable through the solution back end.
* May have limited power and processing resources.
* May have intermittent, slow, or expensive network connectivity.
* May need to use proprietary, custom, or industry-specific application protocols.
* Can be created using a large set of popular hardware and software platforms.

In addition to the requirements above, any IoT solution must also deliver scale, security, and reliability. The resulting set of connectivity requirements is hard and time-consuming to implement when you use traditional technologies, such as web containers and messaging brokers.

## Why use Azure IoT Hub?

In addition to a rich set of [device-to-cloud][lnk-d2c-guidance] and [cloud-to-device][lnk-c2d-guidance] communication options, including messaging, file transfers, and request-reply methods, Azure IoT Hub addresses the device-connectivity challenges in the following ways:

* **Device twins**. Using [Device twins][lnk-twins], you can store, synchronize, and query device metadata and state information. Device twins are JSON documents that store device state information (metadata, configurations, and conditions). IoT Hub persists a device twin for each device that you connect to IoT Hub.

* **Per-device authentication and secure connectivity**. You can provision each device with its own [security key][lnk-devguide-security] to enable it to connect to IoT Hub. The [IoT Hub identity registry][lnk-devguide-identityregistry] stores device identities and keys in a solution. A solution back end can add individual devices to allow or deny lists to enable complete control over device access.

* **Route device-to-cloud messages to Azure services based on declarative rules**. IoT Hub enables you to define message routes based on routing rules to control where your hub sends device-to-cloud messages. Routing rules do not require you to write any code, and can take the place of custom post-ingestion message dispatchers.

* **Monitoring of device connectivity operations**. You can receive detailed operation logs about device identity management operations and device connectivity events. This monitoring capability enables your IoT solution to identify connectivity issues, such as devices that try to connect with wrong credentials, send messages too frequently, or reject all cloud-to-device messages.

* **An extensive set of device libraries**. [Azure IoT device SDKs][lnk-device-sdks] are available and supported for various languages and platforms--C for many Linux distributions, Windows, and real-time operating systems. Azure IoT device SDKs also support managed languages, such as C#, Java, and JavaScript.

* **IoT protocols and extensibility**. If your solution cannot use the device libraries, IoT Hub exposes a public protocol that enables devices to natively use the MQTT v3.1.1, HTTP 1.1, or AMQP 1.0 protocols. You can also extend IoT Hub to support for custom protocols by:

  * Creating a field gateway with [Azure IoT Edge][lnk-iot-edge] that converts your custom protocol to one of the three protocols understood by IoT Hub.
  * Customizing the [Azure IoT protocol gateway][protocol-gateway], an open source component that runs in the cloud.

* **Scale**. Azure IoT Hub scales to millions of simultaneously connected devices and millions of events per second.

## Gateways

A gateway in an IoT solution is typically either a [protocol gateway][lnk-iotedge] that is deployed in the cloud or a [field gateway][lnk-field-gateway] that is deployed locally with your devices. A protocol gateway performs protocol translation, for example MQTT to AMQP. A field gateway can run analytics on the edge, make time-sensitive decisions to reduce latency, provide device management services, enforce security and privacy constraints, and also perform protocol translation. Both gateway types act as intermediaries between your devices and your IoT hub.

A field gateway differs from a simple traffic routing device (such as a network address translation device or firewall) because it typically performs an active role in managing access and information flow in your solution.

A solution may include both protocol and field gateways.

## How does IoT Hub work?

Azure IoT Hub implements the [service-assisted communication][lnk-service-assisted-pattern] pattern to mediate the interactions between your devices and your solution back end. The goal of service-assisted communication is to establish trustworthy, bidirectional communication paths between a control system, such as IoT Hub, and special-purpose devices that are deployed in untrusted physical space. The pattern establishes the following principles:

* Security takes precedence over all other capabilities.

* Devices do not accept unsolicited network information. A device establishes all connections and routes in an outbound-only fashion. For a device to receive a command from the solution back end, the device must regularly initiate a connection to check for any pending commands to process.

* Devices should only connect to or establish routes to well-known services they are peered with, such as IoT Hub.

* The communication path between device and service or between device and gateway is secured at the application protocol layer.

* System-level authorization and authentication are based on per-device identities. They make access credentials and permissions nearly instantly revocable.

* Bidirectional communication for devices that connect sporadically due to power or connectivity concerns is facilitated by holding commands and device notifications until a device connects to receive them. IoT Hub maintains device-specific queues for the commands it sends.

* Application payload data is secured separately for protected transit through gateways to a particular service.

The mobile industry has used the service-assisted communication pattern at enormous scale to implement push notification services such as [Windows Push Notification Services][lnk-wns], [Google Cloud Messaging][lnk-google-messaging], and [Apple Push Notification Service][lnk-apple-push].

IoT Hub is supported over ExpressRoute's public peering path.

## Next steps

To learn how to send messages from a device and receive them from IoT Hub, as well as how to configure message routes, see [Send and receive messages with IoT Hub][lnk-send-messages].

To learn how IoT Hub enables standards-based device management for you to remotely manage, configure, and update your devices, see [Overview of device management with IoT Hub][lnk-device-management].

To implement client applications on a wide variety of device hardware platforms and operating systems, you can use the Azure IoT device SDKs. The device SDKs include libraries that facilitate sending telemetry to an IoT hub and receiving cloud-to-device messages. When you use the device SDKs, you can choose from various network protocols to communicate with IoT Hub. To learn more, see the [information about device SDKs][lnk-device-sdks].

To get started writing some code and running some samples, see the [Get started with IoT Hub][lnk-get-started] tutorial.

[img-architecture]: media/iot-hub-what-is-iot-hub/hubarchitecture.png

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[protocol-gateway]: https://github.com/Azure/azure-iot-protocol-gateway/blob/master/README.md
[lnk-service-assisted-pattern]: http://blogs.msdn.com/b/clemensv/archive/2014/02/10/service-assisted-communication-for-connected-devices.aspx "Service Assisted Communication, blog post by Clemens Vasters"
[lnk-compare]: iot-hub-compare-event-hubs.md
[lnk-iotedge]: iot-hub-protocol-gateway.md
[lnk-field-gateway]: iot-hub-devguide-endpoints.md#field-gateways
[lnk-devguide-identityregistry]: iot-hub-devguide-identity-registry.md
[lnk-devguide-security]: iot-hub-devguide-security.md
[lnk-wns]: https://msdn.microsoft.com/library/windows/apps/mt187203.aspx
[lnk-google-messaging]: https://developers.google.com/cloud-messaging/
[lnk-apple-push]: https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW9
[lnk-device-sdks]: https://github.com/Azure/azure-iot-sdks
[lnk-refarch]: http://download.microsoft.com/download/A/4/D/A4DAD253-BC21-41D3-B9D9-87D2AE6F0719/Microsoft_Azure_IoT_Reference_Architecture.pdf
[lnk-iot-edge]: https://github.com/Azure/iot-edge
[lnk-send-messages]: iot-hub-devguide-messaging.md
[lnk-device-management]: iot-hub-device-management-overview.md

[lnk-twins]: iot-hub-devguide-device-twins.md
[lnk-c2d-guidance]: iot-hub-devguide-c2d-guidance.md
[lnk-d2c-guidance]: iot-hub-devguide-d2c-guidance.md

[lnk-security-ground-up]: iot-hub-security-ground-up.md
