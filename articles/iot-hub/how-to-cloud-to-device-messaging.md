---
title: Send cloud-to-device messages
titleSuffix: Azure IoT Hub
description: How to send cloud-to-device messages from a back-end app and receive them on a device app using the Azure IoT SDKs for C#, Python, Java, Node.js, and C.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.topic: how-to
ms.date: 06/20/2024
zone_pivot_groups: iot-hub-howto-c2d-1
ms.custom: [amqp, mqtt, "Role: Cloud Development", "Role: IoT Device"]
---

# Send and receive cloud-to-device messages

Azure IoT Hub is a fully managed service that enables bi-directional communications, including cloud-to-device (C2D) messages from solution back ends to millions of devices.

This article describes how to use the Azure IoT SDKs to build the following types of applications:

* Device applications that receive and handle cloud-to-device messages from an IoT Hub messaging queue.

* Back end applications that send cloud-to-device messages to a single device through an IoT Hub messaging queue.

This article is meant to complement runnable SDK samples that are referenced from within this article.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

## Overview

For a device application to receive cloud-to-device messages, it must connect to IoT Hub and then set up a message handler to process incoming messages. The [Azure IoT Hub device SDKs](./iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks) provide classes and methods that a device can use to receive and handle messages from the service. This article discusses key elements of any device application that receives messages, including:

* Declare a device client object
* Connect to IoT Hub
* Retrieve messages from the IoT Hub message queue
* Process the message and send an acknowledgment back to IoT Hub
* Configure a receive message retry policy

For a back end application to send cloud-to-device messages, it must connect to an IoT Hub and send messages through an IoT Hub message queue. The [Azure IoT Hub service SDKs](./iot-hub-devguide-sdks.md#azure-iot-hub-service-sdks) provide classes and methods that an application can use to send messages to devices. This article discusses key elements of any application that sends messages to devices, including:

* Declare a service client object
* Connect to IoT Hub
* Build and send the message
* Receive delivery feedback
* Configure a send message retry policy

## Understand the message queue

To understand cloud-to-device messaging, it's important to understand some fundamentals about how IoT Hub device message queues work.

Cloud-to-device messages sent from a solution backend application to an IoT device are routed through IoT Hub. There's no direct peer-to-peer messaging communication between the solution backend application and the target device. IoT Hub places incoming messages into its message queue, ready to be downloaded by target IoT devices.

To guarantee at-least-once message delivery, IoT hub persists cloud-to-device messages in per-device queues. Devices must explicitly acknowledge completion of a message before IoT Hub removes the message from the queue. This approach guarantees resiliency against connectivity and device failures.

When IoT Hub puts a message in a device message queue, it sets the message state to *Enqueued*. When a device thread takes a message from the queue, IoT Hub locks the message by setting the message state to *Invisible*. This state prevents other threads on the device from processing the same message. When a device thread successfully completes the processing of a message, it notifies IoT Hub and then IoT Hub sets the message state to *Completed*.

A device application that successfully receives and processes a message is said to *Complete* the message. However, if necessary a device can also:

* *Reject* the message, which causes IoT Hub to set it to the Dead lettered state. Devices that connect over the Message Queuing Telemetry Transport (MQTT) protocol can't reject cloud-to-device messages.
* *Abandon* the message, which causes IoT Hub to put the message back in the queue, with the message state set to *Enqueued*. Devices that connect over the MQTT protocol can't abandon cloud-to-device messages.

For more information about the cloud-to-device message lifecycle and how IoT Hub processes cloud-to-device messages, see [Send cloud-to-device messages from an IoT hub](iot-hub-devguide-messages-c2d.md).

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-hub-howto-c2d-messaging-dotnet](../../includes/iot-hub-howto-cloud-to-device-messaging-dotnet.md)]

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-hub-howto-c2d-messaging-java](../../includes/iot-hub-howto-cloud-to-device-messaging-java.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-hub-howto-c2d-messaging-python](../../includes/iot-hub-howto-cloud-to-device-messaging-python.md)]

:::zone-end

:::zone pivot="programming-language-node"

[!INCLUDE [iot-hub-howto-c2d-messaging-node](../../includes/iot-hub-howto-cloud-to-device-messaging-node.md)]

:::zone-end

## Connection reconnection policy

This article doesn't demonstrate a message retry policy for the device to IoT Hub connection or external application to IoT Hub connection. In production code, you should implement connection retry policies as described in [Manage device reconnections to create resilient applications](/azure/iot/concepts-manage-device-reconnections).

## Message retention time, retry attempts, and max delivery count

As described in [Send cloud-to-device messages from IoT Hub](/azure/iot-hub/iot-hub-devguide-messages-c2d#cloud-to-device-configuration-options), you can view and configure defaults for the following message values using portal IoT Hub configuration options or the Azure CLI. These configuration options can affect message delivery and feedback.

* Default TTL (time to live) - The amount of time a message is available for a device to consume before it's expired by IoT Hub.
* Feedback retention time - The amount of time IoT Hub retains the feedback for expiration or delivery of cloud-to-device messages.
* The number of times IoT Hub attempts to deliver a cloud-to-device message to a device.
