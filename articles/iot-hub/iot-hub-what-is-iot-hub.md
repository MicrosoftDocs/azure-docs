<properties
 pageTitle="What is Azure IoT Hub | Microsoft Azure"
 description="A overview of the Azure IoT Hub service including device connectivity, communication patterns and service assisted communication pattern"
 services="iot-hub"
 documentationCenter=".net"
 authors="fsautomata"
 manager="kevinmil"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="09/29/2015"
 ms.author="elioda"/>

# What is Azure IoT Hub?

 Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back end. Azure IoT Hub offers reliable device-to-cloud and cloud-to-device hyper-scale messaging, enables secure communications using per-device security credentials and access control, and includes device libraries for the most popular languages and platforms.

![IoT Hub as cloud gateway?][img-architecture]

## IoT device connectivity

One of the largest challenges facing IoT projects is how to reliably and securely connect devices to the application back end. IoT devices often have different characteristics compared to other clients such as browsers, other servers, and mobile apps:

-   They are often embedded systems with no human operator.

-   They can be located in remote locations, where physical access is very expensive.

-   Connectivity to the application back end can be the only way to access the device.

-   They may have limited power and/or processing resources.

-   Network connectivity may be intermittent, expensive, or scarce for the device.

-   You may need to use proprietary, custom, or industry specific application protocols.

-   There is a large set of popular hardware and software platforms for creating devices.

In addition to the requirements above, any IoT solution must also deliver scale, security, and reliability. All of these aspects combine in a set of connectivity requirements that are hard and time-consuming to implement using traditional technologies such as web containers and messaging brokers.

## Why use Azure IoT Hub

Azure IoT Hub addresses the device connectivity requirements in the following ways:

-   **Per-device authentication and secure connectivity**. Each device can use its own security key to connect to IoT Hub. The application back end is then able to individually whitelist and blacklist each device, enabling complete control over device access.

-   **An extensive set of device libraries**. Azure IoT device SDKs are available and supported for a variety of languages and platforms: C for many Linux distributions, Windows, and RTOS. Managed languages such as C#, Java, and JavaScript.

-   **IoT protocols and extensibility**. If your solution cannot make use of the device libraries, Azure IoT Hub exposes a public protocol that allows devices to use the HTTP 1.1 and AMQP 1.0 protocols natively. You can also extend Azure IoT Hub to provide support for MQTT v3.1.1 with the Azure IoT Protocol Gateway open source component. You can run Azure IoT Protocol Gateway in the cloud or on premise, and  extend it to support custom protocols.

-   **Scale**. Azure IoT Hub scales to millions of simultaneously connected devices, and millions of events per seconds.

In addition to these benefits, that are generic across many communication patterns, Azure IoT Hub currently enables you to implement the following communication patterns:

-   **Event-based device-to-cloud ingestion.** Devices can reliably send millions of events per second to be processed by your hot path event processor engine, or to be stored for cold path analytics. Azure IoT Hub retains the event data for up to 7 days in order to guarantee reliable processing and to absorb peaks in the load.

-   **Reliable cloud-to-device messaging (or *commands*).** The application back end can send reliable messages (i.e. with at-least-once delivery guarantee) to individual devices. Each message has an individual time-to-live, and the back end can request both delivery and expiration receipts to ensure full visibility of the lifecycle of a cloud-to-device message.

In addition to the above communication patterns, you can implement other popular patterns such as file upload and download by taking advantage of IoT specific features in Azure IoT Hub, such as consistent device identity management, connectivity monitoring, and scale.

## Service Assisted Communication Pattern
Azure IoT Hub mediates the interactions between your devices and your application back end in an implementation of the [Service Assisted Communication][lnk-service-assisted-pattern] pattern. The goal of service assisted communication is to establish trustworthy, bi-directional communication paths between control systems (such as IoT Hub) and special-purpose devices that are deployed in untrusted physical space. To that end, the pattern establishes the following principles:

- Security trumps all other capabilities.
- Devices do not accept unsolicited network information. All connections and routes are established from a device in an outbound-only fashion. For a device to receive a command from the back end, the device must regularly initiate a connection to check for any pending commands to process.
- Devices generally only connect to or establish routes to well-known services  they are peered with, such as an Azure IoT Hub service instance.
- The communication path between device and service or device and gateway is secured at the application protocol layer.
- System-level authorization and authentication must be based on per-device identities, and access credentials and permissions must be revocable near-instantly.
- Bi-directional communication for devices that are connected sporadically due to power or connectivity concerns may be facilitated through holding commands and notifications to the devices until they connect to pick those up. Azure IoT Hub maintains device specific queues for the commands it sends to devices.
- Application payload data may be separately secured for protected transit through gateways to a particular service.

The service assisted communication pattern has been used successfully in the mobile industry at enourmous scale to implement push notification services, such as [Windows Notifiation Service](https://msdn.microsoft.com/library/windows/apps/mt187203.aspx), [Google cloud Messaging](https://developers.google.com/cloud-messaging/), and [Apple Push Notification service](http://go.microsoft.com/fwlink/p/?linkid=272584&clcid=0x409).

## Next steps

To learn more about Azure IoT Hub see:

* [IoT Hub Developer Guide]
* [IoT Hub Guidance]
* [Supported device platforms and languages]
* [Azure IoT Developer Center]
* [Get started with IoT Hub]

[IoT Hub Overview]: iot-hub-what-is-iot-hub.md
[IoT Hub Guidance]: iot-hub-guidance.md
[IoT Hub Developer Guide]: iot-hub-devguide.md
[IoT Hub Supported Devices]: iot-hub-supported-devices.md
[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[Supported devices]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/tested_configurations.md
[Azure IoT Developer Center]: http://www.azure.com/iotdev

[img-why-use]: media/iot-hub-what-is-iot-hub/image1.png
[img-architecture]: media/iot-hub-what-is-iot-hub/hubarchitecture.png

[lnk-service-assisted-pattern]: http://blogs.msdn.com/b/clemensv/archive/2014/02/10/service-assisted-communication-for-connected-devices.aspx "Service Assisted Communication, blog post by Clemens Vasters"
