---
title: What is Azure IoT Hub?
titleSuffix: Azure IoT Hub
description: This article discusses the basic concepts of how Azure IoT Hub helps users connect IoT applications and their attached devices.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: overview
ms.date: 02/22/2024
#Customer intent: As a developer new to IoT Hub, learn the basic concepts.
---

# What is Azure IoT Hub?

The Internet of Things (IoT) is a network of physical devices that connect to and exchange data with other devices and services over the Internet or other network. There are currently over ten billion connected devices in the world and more are added every year. Anything that can be embedded with the necessary sensors and software can be connected over the internet.

Azure IoT Hub is a managed service hosted in the cloud that acts as a central message hub for communication between an IoT application and its attached devices. You can connect millions of devices and their backend solutions reliably and securely. Almost any device can be connected to an IoT hub.

Several messaging patterns are supported, including device-to-cloud messages, uploading files from devices, and request-reply methods to control your devices from the cloud. IoT Hub also supports monitoring to help you track device creation, device connections, and device failures.

IoT Hub scales to millions of simultaneously connected devices and millions of events per second to support your IoT workloads.

You can integrate IoT Hub with other Azure services to build complete, end-to-end solutions. For example, use:

- [Azure Event Grid](../event-grid/index.yml) to enable your business to react quickly to critical events in a reliable, scalable, and secure manner.

- [Azure Logic Apps](../logic-apps/index.yml) to automate business processes.

- [Azure Machine Learning](../machine-learning/index.yml) to add machine learning and AI models to your solution.

- [Azure Stream Analytics](../stream-analytics/index.yml) to run real-time analytic computations on the data streaming from your devices.

## IoT devices

IoT devices differ from other clients such as browsers and mobile apps. Specifically, IoT devices:

- Are often embedded systems with no human operator.
- Can be deployed in remote locations where physical access is expensive.
- Might only be reachable through the solution back end.
- Might have limited power and processing resources.
- Might have intermittent, slow, or expensive network connectivity.
- Might need to use proprietary, custom, or industry-specific application protocols.

## Device identity and authentication

Every IoT hub has an identity registry that stores information about the devices and modules permitted to connect to it. Before a device or module can connect, there must be an entry for that device or module in the IoT hub's identity registry. A device or module authenticates with the IoT hub based on credentials stored in the identity registry.

We support two methods of authentication between the device and the IoT hub. You can use SAS token-based authentication or X.509 certificate authentication.

The SAS token method provides authentication for each call made by the device to IoT Hub by associating the symmetric key to each call. X.509 authentication allows authentication of an IoT device at the physical layer as part of the Transport Layer Security (TLS) standard connection establishment. The choice between the two methods depends on how secure the device authentication needs to be, and ability to store the private key securely on the device.

You can set up and provision many devices at a time using the [IoT Hub Device Provisioning Service](../iot-dps/index.yml).

For more information, see [Device management and control](../iot/iot-overview-device-management.md).

## Device communication

The internet connection between the IoT device and IoT Hub is secured using the Transport Layer Security (TLS) standard. Azure IoT supports TLS 1.2, TLS 1.1, and TLS 1.0, in that order. Support for TLS 1.0 is provided for backward compatibility only. Check TLS support in IoT Hub to see how to configure your hub to use TLS 1.2, which provides the most security.

Typically, IoT devices send data from the sensors to back-end services in the cloud. However, other types of communication are possible, such as a back-end service sending commands to your devices. For example:

- A refrigeration truck sending temperature every 5 minutes to an IoT hub.
- A back-end service sending a command to a device to change the frequency at which it sends data to help diagnose a problem.
- A device monitoring a batch reactor in a chemical plant, sending an alert when the temperature exceeds a certain value.

For more information, see [Device infrastructure and connectivity](../iot/iot-overview-device-connectivity.md).

## Device telemetry

Examples of telemetry received from a device can include sensor data such as speed or temperature, an error message such as missed event, or an information message to indicate the device is in good health. IoT devices send events to an application to gain insights. Applications might require specific subsets of events for processing or storage at different endpoints.

## Device properties

Properties can be read or set from the IoT hub and can be used to send notifications when an action has completed. An example of a specific property on a device is temperature. Temperature can be a writable property that can be updated on the device or read from a temperature sensor attached to the device.

You can enable properties in IoT Hub using [Device twins](iot-hub-devguide-device-twins.md) or [Plug and Play](../iot/overview-iot-plug-and-play.md).

## Device commands

An example of a command is rebooting a device. IoT Hub implements commands by allowing you to invoke direct methods on devices. [Direct methods](iot-hub-devguide-direct-methods.md) represent a request-reply interaction with a device similar to an HTTP call in that they succeed or fail immediately (after a user-specified timeout). This approach is useful for scenarios where the course of immediate action is different depending on whether the device was able to respond.

## Act on device data

IoT Hub gives you the ability to unlock the value of your device data with other Azure services so you can shift to predictive problem-solving rather than reactive management. Connect your IoT hub with other Azure services to do machine learning, analytics, and AI to act on real-time data, optimize processing, and gain deeper insights.

>[!NOTE]
>Azure IoT Hub doesn't store or process customer data outside of the geography where you deploy the service instance. For more information, see [Cross-region replication in Azure](../availability-zones/cross-region-replication-azure.md).

### Built-in endpoint collects device data by default

A built-in endpoint collects data from your device by default. The data is collected using a request-response pattern over dedicated IoT device endpoints, is available for a maximum duration of seven days, and can be used to take actions on a device. Data accepted by the device endpoint includes:

- Send device-to-cloud messages.
- Receive cloud-to-device messages.
- Initiate file uploads.
- Retrieve and update device twin properties.
- Receive direct method requests.

For more information about IoT Hub endpoints, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

### Message routing sends data to other endpoints

Data can also be routed to different services for further processing. As the IoT solution scales out, the number of devices, volume of events, variety of events, and different services also varies. A flexible, scalable, consistent, and reliable method to route events is necessary to serve this pattern. For a tutorial showing multiple uses of message routing, see  [Tutorial: Send device data to Azure Storage using IoT Hub message routing](tutorial-routing.md).

IoT Hub supports setting up custom endpoints for Azure services including Storage containers, Event Hubs, Service Bus queues, Service Bus topics, and Cosmos DB. Once the endpoint has been set up, you can route your IoT data to any of these endpoints to perform downstream data operations.

IoT Hub also integrates with Event Grid, which enables you to fan out data to multiple subscribers. Event Grid is a fully managed event service that enables you to easily manage events across many different Azure services and applications. Event Grid simplifies building event-driven applications and serverless architectures.

For more information, see [Compare message routing and Event Grid for IoT Hub](iot-hub-event-grid-routing-comparison.md).

## Next steps

To try out an end-to-end IoT solution, check out the IoT Hub quickstarts:

- [Send telemetry from a device to IoT Hub](quickstart-send-telemetry-cli.md)
- [Send telemetry from an IoT Plug and Play device to IoT Hub](../iot/tutorial-send-telemetry-iot-hub.md?toc=/azure/iot-hub/toc.json&bc=/azure/iot-hub/breadcrumb/toc.json)
- [Quickstart: Control a device connected to an IoT hub](quickstart-control-device.md)

To learn more about the ways you can build and deploy IoT solutions with Azure IoT, visit:

- [What is Azure Internet of Things?](../iot/iot-introduction.md)
- [What is Azure IoT device and application development?](../iot/concepts-iot-device-development.md)
