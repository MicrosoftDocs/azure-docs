<properties
 pageTitle="Developer guide - glossary | Microsoft Azure"
 description="A glossary of common terms relating to IoT Hub"
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

# Glossary of IoT Hub terms

This article lists some of the common terms associated with IoT Hub.

## Advanced Message Queueing Protocol (AMQP)

[AMQP](https://www.amqp.org/) is one of the messaging protocols that IoT Hub supports for communicating with devices. For more information about the messaging protocols that IoT Hub supports, see [Send and receive messages with IoT Hub](iot-hub-devguide-messaging.md).

## Cloud-to-device (C2D)

Usually used to refer to messages sent from IoT Hub to a connected device. Often, these messages are commands that instruct the device to take some action. For more information, see [Send and receive messages with IoT Hub](iot-hub-devguide-messaging.md).

## Condition

Refers to device state information, such as the connectivity method currently in use, as reported by a device app. Devices can also report their capabilities. You can query condition and capability using the device twin.

## Data-point message

A data-point message is a cloud-to-device message that contains telemetry data such as wind speed or temperature.

## Desired properties

In the context of device twins, desired properties are used in conjunction with *reported properties* to synchronize device configuration or condition. Desired properties can only be set by the application back end and are observed by the device app. 

## Device-to-cloud (D2C)

Usually used to refer to messages sent from a connected device to IoT Hub. These messages may be [data point](#data-point-message) or [interactive](#interactive-message) messages. For more information, see [Send and receive messages with IoT Hub](iot-hub-devguide-messaging.md).

## Device identity registry

The [device identity registry](iot-hub-devguide-identity-registry.md) is the built-in component of an IoT hub that stores information about the individual devices permitted to connect to a hub.

## Device

In the context of IoT, a device is typically a small-scale, standalone computing device that may collect data or control other devices. For example a device might be, an environmental monitoring device, or a controller for the watering and ventilation systems in a greenhouse.

## Device twin

A [device twin](iot-hub-devguide-device-twins.md) is a copy in  IoT Hub of the condition and configuration settings of a physical device. You can use a device twin to manage the configuration of the physical device.

## Direct method

A [direct method](iot-hub-devguide-direct-methods.md) is a way for you to trigger a method to execute on a device by invoking an API on your IoT hub.

## Event hub-compatible endpoint

To read device-to-cloud messages sent to your IoT hub, you can connect to an endpoint on your hub and use any Event hub-compatible method to read those messages. Event Hub-compatible methods include using the Event Hubs SDKs and Azure Stream Analytics.

## Field gateway

A field gateway enables connectivity for devices that cannot connect directly to IoT Hub and is typically deployed locally with your devices. For more information, see [What is Azure IoT Hub?](iot-hub-what-is-iot-hub.md).

## Job

Your solution back end can use jobs to schedule and track activities on a set of devices registered with your IoT hub. Activities include updating device twin desired properties, updating device twin tags, and invoking direct methods.

## Protocol gateway

A protocol gateway is typically deployed in the cloud and provides protocol translation services for devices connecting to IoT Hub. For more information, see [What is Azure IoT Hub?](iot-hub-what-is-iot-hub.md).

## Interactive message

An interactive message is a cloud-to-device message that triggers an immediate action in the application back end. For example, a device might send an alarm about a failure that should be logged automatically into a CRM system.

## IoT Hub

IoT Hub is a fully managed Azure service that enables reliable and secure bidirectional communications between millions of IoT devices and a solution back end. For more information, see [What is Azure IoT Hub?](iot-hub-what-is-iot-hub.md).

## IoT Suite

Azure IoT Suite packages together multiple Azure services with preconfigured solutions. These preconfigured solutions enable you to get started quickly with end-to-end implementations of common IoT scenarios. For more information, see [What is Azure IoT Suite?](../iot-suite/iot-suite-overview.md).

## Job

A [job](iot-hub-devguide-jobs.md) in IoT Hub enables you to perform operations such as a firmware upgrade across multiple devices connected to your hub.

## MQTT

[MQTT](http://mqtt.org/) is one of the messaging protocols that IoT Hub supports for communicating with devices. For more information about the messaging protocols that IoT Hub supports, see [Send and receive messages with IoT Hub](iot-hub-devguide-messaging.md).

## Reported properties

In the context of device twins, reported properties are used in conjunction with *desired properties* to synchronize device configuration or condition. Reported properties can only be set by the device app and can be read and queried by the application back end.

## Tags

In the context of devcie twins, tags are device meta-data stored and retrieved by the application back end in the form of a JSON document. Tags are not visible to apps on a device.

## System properties

In the context of device twins, system properties are read-only and include information regarding the device usage such as last activity time and connection state.