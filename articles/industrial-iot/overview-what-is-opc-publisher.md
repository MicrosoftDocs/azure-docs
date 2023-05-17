---
title: Microsoft OPC Publisher
description: This article provides an overview of the OPC Publisher Edge module.
author: hansgschossmann
ms.author: johanng
ms.service: industrial-iot
ms.topic: conceptual
ms.date: 3/22/2021
---

# What is the OPC Publisher?

OPC Publisher is a fully supported Microsoft product that bridges the gap between industrial assets and the Microsoft Azure cloud. It does so by connecting OPC UA-enabled assets or industrial connectivity software to your Microsoft Azure cloud. It publishes the telemetry data it gathers to Azure IoT Hub in various formats, including IEC62541 OPC UA PubSub standard format (from version 2.6 onwards). OPC Publisher runs on Azure IoT Edge as a Module or on plain Docker as a container. Because it uses the .NET cross-platform runtime, it runs natively on both Linux and Windows 10.

OPC Publisher is a reference implementation that demonstrates how to:

- Connect to existing OPC UA servers.
- Publish JSON-encoded telemetry data from OPC UA servers in OPC UA Pub/Sub format, using a JSON payload, to an Azure IoT Hub.

You can use any of the transport protocols that the Azure IoT Hub client SDK supports, such as HTTPS, AMQP, and MQTT.

The reference implementation includes the following.

- An OPC UA *client* for connecting to existing OPC UA servers you have on your network.
- An OPC UA *server* on port 62222 that you can use to manage what's published and offers IoT Hub direct methods to do the same.
> [!NOTE]
> The build-in OPC UA Server is only available in version 2.5 or below.


You can download the [OPC Publisher reference implementation](https://github.com/Azure/iot-edge-opc-publisher) from GitHub.

The application is implemented using .NET Core technology and can run on any platform supported by .NET Core.

## What does the OPC Publisher do?

OPC Publisher implements retry logic to establish connections to endpoints that don't respond to a certain number of keep alive requests. For example, if an OPC UA server stops responding because of a power outage.

For each distinct publishing interval to an OPC UA server, the application creates a separate subscription over which all nodes with this publishing interval are updated.

OPC Publisher supports batching of the data sent to IoT Hub to reduce network load. This batching sends a packet to IoT Hub only if the configured packet size is reached.

This application uses the OPC Foundation OPC UA reference stack as NuGet packages. See [https://opcfoundation.org/license/redistributables/1.3/](https://opcfoundation.org/license/redistributables/1.3/) for the licensing terms.

## Next steps
Now that you've learned what the OPC Publisher is, you can get started by deploying it:

> [!div class="nextstepaction"]
> [Deploy OPC Publisher in standalone mode](tutorial-publisher-deploy-opc-publisher-standalone.md)
