---
title: Overview of Azure IoT Hub | Microsoft Docs
description: Learn about Azure IoT Hub. This scalable IoT service is built for scalable data ingestion, device management, and security.
services: iot-hub
keywords: 
author: nberdy
ms.author: nberdy
ms.date: 03/30/2018
ms.topic: overview
ms.custom: mvc
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc

---

# What is Azure IoT Hub?
Azure IoT Hub is a highly scalable managed service to provide IoT solution builders with reliable and secure bidirectional communications between millions of IoT devices and a solution backend. You can connect virtually any device to IoT Hub. IoT Hub provides multiple messaging options, including device-to-cloud telemetry, file upload from devices, and request-reply methods. It enables secure communications and access control using per-device security keys or X.509 certificates. It provides extensive monitoring for device connectivity and device identity management events.

## What's in the box?
Azure IoT Hub offers a rich set of features to make it easy to build scalable, full-featured IoT applications:

* **IoT-level scale**
    * Azure IoT Hub scales to millions of simultaneously connected devices and millions of events per second to support your IoT workloads.

* **Secure connections between devices and the cloud**
    * Per-device authentication allows each device to securely connect to IoT Hub, enabling each device to be managed securely.
	* Complete control over device access at a per-device granularity.
	* Automatically provision devices to the right IoT hub using the [IoT Hub Device Provisioning Service](https://docs.microsoft.com/azure/iot-dps/).
	* Multiple authentication types to support a variety of device capabilities.
	    * SAS token based authentication to quickly get started with your solution
	    * Individual X.509 certificate authentication for secure, standards-based auth
	    * X.509 CA authentication for simple, standards-based onboarding

* **Send device data where it needs to go**
    * Control where your hub sends device telemetry with message routing.
	* No additional cost to route messages to multiple endpoints
	* No-code routing rules take the place of message dispatchers, letting you get to your data faster.

* **Integrate events with your existing business applications**
    * Integration with Azure Event Grid enables you to react quickly to critical events in a reliable, scalable, and secure manner.
	
* **Support for all your IoT devices**
   * [Azure IoT device SDKs][lnk-device-sdks] are available and supported for many languages and platforms, including several Linux distributions, Windows, and real-time operating systems. Azure IoT device SDKs are available in C, C#, Java, Python, and Node.js.
   
   * If your solution cannot use the device libraries, IoT Hub exposes a public protocol that enables devices to natively use the MQTT v3.1.1, HTTPS 1.1, or AMQP 1.0 protocols.
   
   * You can also extend IoT Hub to support custom protocols by:

       * Creating a field gateway with [Azure IoT Edge][lnk-iot-edge] that converts your custom protocol to a protocol understood by IoT Hub.
       * Customizing the [Azure IoT protocol gateway][protocol-gateway] for your protocol.

* **Device configuration and control**
    * Store, synchronize, and query device metadata and state information for all your devices.
	* Set device state either per-device or based on common characteristics of devices.
	* Automatically respond to a device-reported state change with message routing integration.

## What devices can connect to IoT Hub?
IoT Hub, like all Azure IoT services, works cross-platform with a variety of operating systems. Azure offers open source SDKs in a variety of [languages](https://github.com/Azure/azure-iot-sdks) to facilitate connecting devices and managing the service. IoT Hub supports the following protocols for connecting devices:

* HTTPS
* AMQP
* AMQP over websockets
* MQTT
* MQTT over websockets

## Availability
We maintain a 99.9% Service Level Agreement for IoT Hub, and you can [read the SLA](https://azure.microsoft.com/support/legal/sla/iot-hub/). The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/) explains the guaranteed availability of Azure as a whole.

## IoT Hub in your subscription
Each Azure subscription has default quota limits in place to prevent service abuse, and these could impact the scope of your IoT solution. The current limit on a per-subscription basis is 10 IoT hubs per subscription, which you can raise by contacting support. For more details on quota limits:

* [Azure Subscription Service Limits](../azure-subscription-service-limits.md)
* [IoT Hub throttling and you](https://azure.microsoft.com/en-us/blog/iot-hub-throttling-and-you/)

## Next steps
Check out one of the IoT Hub quickstarts to try out an end-to-end IoT scenario.
> [!div class="nextstepaction"]
> [todo once created](todo once created)
