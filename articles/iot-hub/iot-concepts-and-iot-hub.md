---
title: What is Azure IoT Hub?
titleSuffix: Azure IoT Hub
description: This article discusses the basic concepts of how Azure IoT Hub helps users connect IoT applications and their attached devices.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
services: iot-hub
ms.topic: overview
ms.date: 10/20/2025
#Customer intent: As a developer new to IoT Hub, learn the basic concepts.
---

# What is Azure IoT Hub?

The Internet of Things (IoT) connects physical devices to exchange data over the internet. With over 10 billion connected devices worldwide, anything embedded with sensors and software can join this network.

Azure IoT Hub is a managed service that acts as a central message hub in a cloud-based IoT solution. It enables reliable and secure communication at scale between an IoT application and its attached devices. Almost any device can be connected to an IoT hub.

Several messaging patterns are supported, including device-to-cloud messages, uploading files from devices, and request-reply methods to control your devices. IoT Hub also supports monitoring to help you track device creation, device connections, and device failures.

IoT Hub scales to millions of simultaneously connected devices and millions of events per second to support your IoT workloads.

## Understand IoT devices

IoT devices differ from other clients such as browsers and mobile apps in several ways:

- They are often embedded systems with no human operator, such as a sensor or an actuator.
- They can be deployed in remote locations where physical access is expensive, difficult, or impossible. For example, sensors in a wind farm or an oil rig.
- They might only be reachable through the solution back end, not directly from the internet. For example, a device behind a firewall or on a private network.
- They might have limited power and processing resources, such as a battery-powered asset tracker.
- They might have intermittent, slow, or expensive network connectivity, such as a device connected over a cellular network.
- They might need to use proprietary, custom, or industry-specific application protocols, such as MQTT or AMQP.

## Connect and authenticate devices

Every IoT hub has an identity registry that stores information about the devices and modules permitted to connect to it. Before a device or module can connect, there must be an entry for that device or module in the IoT hub's identity registry. A device or module authenticates with the IoT hub based on credentials stored in the identity registry.

IoT Hub supports two methods of authentication between the device and the IoT hub. You can use SAS token-based authentication or X.509 certificate authentication.

- SAS tokens authenticate each device call to IoT Hub using a symmetric key. This method is simple to implement and works well for devices that can securely store the symmetric key.
- X.509 certificates authenticate devices during Transport Layer Security (TLS) connections. This method is more secure and scalable, choose this method for devices that require a higher level of security and can manage certificates.

You can set up and provision many devices at a time using the [IoT Hub Device Provisioning Service](../iot-dps/index.yml).

For more information, see [Device management and control](../iot/iot-overview-device-management.md).

## Device communication patterns

The internet connection between the IoT device and IoT Hub is secured using the Transport Layer Security (TLS) standard. Azure IoT supports TLS 1.2, 1.1, and 1.0 (for backward compatibility). Check [TLS support in IoT Hub](iot-hub-tls-support.md) to see how to configure your hub to use TLS 1.2, which provides the most security.

With IoT Hub, you can send information both from the device app to the solution back end and from the back end to the device app. IoT Hub provides reliable messaging and ensures that messages are delivered even in the presence of network interruptions. For more information, see [Device-to-cloud communication](iot-hub-devguide-d2c-guidance.md) and [Cloud-to-device communication](iot-hub-devguide-c2d-guidance.md).

Examples of device communication include:

- A refrigeration truck sending temperature every 5 minutes to an IoT hub. 
- A back-end service sending a command to a device to change the frequency at which it sends data to help diagnose a problem.
- A device monitoring a batch reactor in a chemical plant sending an alert when the temperature exceeds a certain value.

### Send telemetry from devices

IoT hubs can receive telemetry from devices and route it to the appropriate back-end services. Examples of telemetry received from a device can include sensor data such as speed or temperature, an error message such as missed event, or an information message to indicate the device is in good health. IoT devices send events to an application to gain insights. Applications might require specific subsets of events for processing or storage at different endpoints.

For more information, see [Device infrastructure and connectivity](../iot/iot-overview-device-connectivity.md).

### Add device properties

Properties can be read or set from the IoT hub and can be used to send notifications when an action has completed. An example of a specific property on a device is temperature. Temperature can be a writable property that can be updated on the device or read from a temperature sensor attached to the device.

You can enable properties in IoT Hub using [Device twins](iot-hub-devguide-device-twins.md) or [Plug and Play](../iot/overview-iot-plug-and-play.md).

### Issue commands to devices

IoT Hub implements commands by allowing you to invoke direct methods on devices. An example of a command is rebooting a device. [Direct methods](iot-hub-devguide-direct-methods.md) represent a request-reply interaction with a device similar to an HTTP call in that they succeed or fail immediately (after a user-specified time-out). This approach is useful for scenarios where the course of immediate action is different depending on whether the device was able to respond.

## Handle device data

Devices send data to IoT Hub, which acts as a central message hub for bi-directional communication between your IoT application and the devices it manages. Once the data reaches IoT Hub, it can be processed and routed to other services for further analysis and action.

IoT Hub gives you the ability to unlock the value of your device data with other Azure services so you can shift to predictive problem-solving rather than reactive management. Connect your IoT hub with other Azure services to do machine learning, analytics, and AI to act on real-time data, optimize processing, and gain deeper insights.

> [!NOTE]
> Azure IoT Hub doesn't store or process customer data outside of the geography where you deploy the service instance. For more information, see [Cross-region replication in Azure](../reliability/cross-region-replication-azure.md).

### Built-in endpoint collects device data by default

A built-in endpoint collects data from your device by default. The data is collected using a request-response pattern over dedicated IoT device endpoints, retained for up to seven days, and used to take actions on a device. Data accepted by the device endpoint includes:

- Send device-to-cloud messages.
- Receive cloud-to-device messages.
- Initiate file uploads.
- Retrieve and update device twin properties.
- Receive direct method requests.

For more information about IoT Hub endpoints, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

### Message routing sends data to other endpoints

Data can also be routed to different services for further processing. As the IoT solution scales out, the number of devices, volume of events, variety of events, and different services also varies. A flexible, scalable, consistent, and reliable method to route events is necessary to serve this pattern. For a tutorial showing multiple uses of message routing, see  [Tutorial: Send device data to Azure Storage using IoT Hub message routing](tutorial-routing.md).

IoT Hub supports setting up custom endpoints for Azure services including Storage containers, Event Hubs, Service Bus queues, Service Bus topics, and Cosmos DB. Once the endpoint is set up, you can route your IoT data to any of these endpoints to perform downstream data operations.

IoT Hub also integrates with Event Grid, which enables you to fan out data to multiple subscribers. Event Grid is a fully managed event service that enables you to easily manage events across many different Azure services and applications. Event Grid simplifies building event-driven applications and serverless architectures. For more information, see [Compare message routing and Event Grid for IoT Hub](iot-hub-event-grid-routing-comparison.md).

## Integrate with other Azure services

You can integrate IoT Hub with other Azure services to build complete, end-to-end solutions. For example, use:

- [Azure Event Grid](../event-grid/index.yml) to enable your business to react quickly to critical events.
- [Azure Logic Apps](../logic-apps/index.yml) to automate business processes.
- [Azure Machine Learning](/azure/machine-learning/) to add machine learning and AI models to your solution.
- [Azure Stream Analytics](../stream-analytics/index.yml) to run real-time analytic computations on the data streaming from your devices.

## Next steps

To try out an end-to-end IoT solution, check out the IoT Hub quickstarts:

- [Send telemetry from a device to IoT Hub](quickstart-send-telemetry-cli.md)
- [Control a device connected to an IoT hub](quickstart-control-device.md)

To learn more about the ways you can build and deploy IoT solutions with Azure IoT, visit:

- [What is Azure Internet of Things?](../iot/iot-introduction.md)
