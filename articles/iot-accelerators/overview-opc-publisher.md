---
title: What is OPC Publisher - Azure | Microsoft Docs
description: This article provides an overview of the features of OPC Publisher. It allows you to publish encoded JSON telemetry data using a JSON payload, to Azure IoT Hub.
author: dominicbetts
ms.author: dobett
ms.date: 06/10/2019
ms.topic: overview
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
ms.custom:  [amqp, mqtt]
---

# What is OPC Publisher?

OPC Publisher is a reference implementation that demonstrates how to:

- Connect to existing OPC UA servers.
- Publish JSON encoded telemetry data from OPC UA servers in OPC UA Pub/Sub format, using a JSON payload, to Azure IoT Hub.

You can use any of the transport protocols that the Azure IoT Hub client SDK supports: HTTPS, AMQP, and MQTT.

The reference implementation includes:

- An OPC UA *client* for connecting to existing OPC UA servers you have on your network.
- An OPC UA *server* on port 62222 that you can use to manage what's published and offers IoT Hub direct methods to do the same.

You can download the [OPC Publisher reference implementation](https://github.com/Azure/iot-edge-opc-publisher) from GitHub.

The application is implemented using .NET Core technology and can run on any platform supported by .NET Core.

OPC Publisher implements retry logic to establish connections to endpoints that don't respond to a certain number of keep alive requests. For example, if an OPC UA server stops responding because of a power outage.

For each distinct publishing interval to an OPC UA server, the application creates a separate subscription over which all nodes with this publishing interval are updated.

OPC Publisher supports batching of the data sent to IoT Hub to reduce network load. This batching sends a packet to IoT Hub only if the configured packet size is reached.

This application uses the OPC Foundation OPC UA reference stack as NuGet packages. See [https://opcfoundation.org/license/redistributables/1.3/](https://opcfoundation.org/license/redistributables/1.3/) for the licensing terms.

### Next steps

Now you've learned what OPC Publisher is, the suggested next step is to learn how to [Configure OPC Publisher](howto-opc-publisher-configure.md).
