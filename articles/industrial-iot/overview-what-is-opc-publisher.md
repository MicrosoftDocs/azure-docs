---
title: Microsoft OPC Publisher
description: This article provides an overview of the OPC Publisher Edge module.
author: jehona-m
ms.author: jemorina
ms.service: industrial-iot
ms.topic: overview
ms.date: 3/22/2021
---

# What is the OPC Publisher?

OPC Publisher is a fully supported Microsoft product, developed in the open, that bridges the gap between industrial assets and the Microsoft Azure cloud. It does so by connecting to OPC UA-enabled assets or industrial connectivity software and publishes telemetry data to Azure IoT Hub in various formats, including IEC62541 OPC UA PubSub standard format (from version 2.6 onwards).

It runs on Azure IoT Edge as a Module or on plain Docker as a container. Since it leverages the .NET cross-platform runtime, it also runs natively on Linux and Windows 10.

OPC Publisher is a reference implementation that demonstrates how to:

- Connect to existing OPC UA servers.
- Publish JSON encoded telemetry data from OPC UA servers in OPC UA Pub/Sub format, using a JSON payload, to Azure IoT Hub.

You can use any of the transport protocols that the Azure IoT Hub client SDK supports: HTTPS, AMQP, and MQTT.

The reference implementation includes:

- An OPC UA *client* for connecting to existing OPC UA servers you have on your network.
- An OPC UA *server* on port 62222 that you can use to manage what's published and offers IoT Hub direct methods to do the same.

You can download the [OPC Publisher reference implementation](https://github.com/Azure/iot-edge-opc-publisher) from GitHub.

The application is implemented using .NET Core technology and can run on any platform supported by .NET Core.

## What does the OPC Publisher do?

OPC Publisher implements retry logic to establish connections to endpoints that don't respond to a certain number of keep alive requests. For example, if an OPC UA server stops responding because of a power outage.

For each distinct publishing interval to an OPC UA server, the application creates a separate subscription over which all nodes with this publishing interval are updated.

OPC Publisher supports batching of the data sent to IoT Hub to reduce network load. This batching sends a packet to IoT Hub only if the configured packet size is reached.

This application uses the OPC Foundation OPC UA reference stack as NuGet packages. See [https://opcfoundation.org/license/redistributables/1.3/](https://opcfoundation.org/license/redistributables/1.3/) for the licensing terms.

## Next steps
Now that you have learned what the OPC Publisher is, you can get started by deploying it:

> [!div class="nextstepaction"]
> [Deploy OPC Publisher in standalone mode](tutorial-publisher-deploy-opc-publisher-standalone.md)
