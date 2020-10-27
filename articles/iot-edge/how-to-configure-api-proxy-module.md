---
title: Configure API proxy module - Azure IoT Edge | Microsoft Docs
description: Learn how to customize the API proxy module for IoT Edge gateway hierarchies.
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 10/15/2020
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom:  [amqp, mqtt]
monikerRange: '>= iotedge-1.2'
---

# Configure the API proxy module for your gateway hierarchy scenario

The API proxy module enables IoT Edge devices to function behind gateways. This article walks through the configuration options so that you can customize the module to support your gateway hierarchy requirements.

IoT Edge devices behind gateways don't have direct access to the cloud. Any modules that attempt to connect to cloud services will fail. The API proxy module re-routes those connections to go through the layers of a gateway hierarchy, instead. It provides a secure way for clients to communicate to multiple services over HTTPS without tunneling, but by terminating the connections at each layer.

The API proxy module can enable many scenarios for gateway hierarchies, including allowing lower layer devices to pull container images or push blobs to storage. The configuration of the proxy rules defines how data is routed. This article discusses several common configuration options.

## Understand the proxy module

The API proxy module leverages an nginx reverse proxy to route data through network layers. A proxy is embedded in the module, which means that the module image needs to support the proxy configuration. For example, if the proxy is listening on a certain port then the module needs to have that port open.

The proxy starts with a default configuration file embedded in the module. You can pass a new configuration to the module from the cloud using its [module twin](../iot-hub/iot-hub-devguide-module-twins.md). Additionally, you can use environment variables to turn configuration settings on or off at deployment time.

This article focuses first on the default configuration file, and how to use environment variables to enable its settings. Then, we discuss customizing the configuration file at the end.