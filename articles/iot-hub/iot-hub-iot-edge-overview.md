---
title: Overview of Azure IoT Edge | Microsoft Docs
description: Describes the key architectural concepts in Azure IoT Edge such as gateways, modules, and brokers.
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/02/2017
ms.author: dobett

---
# Azure IoT Edge architectural concepts

Before you examine any sample code or create your own field gateway using IoT Edge, you should understand the key concepts that underpin the architecture of IoT Edge.

## IoT Edge modules

You build a gateway with Azure IoT Edge by creating and assembling *IoT Edge modules*. Modules use *messages* to exchange data with each other. A module receives a message, performs some action on it, optionally transforms it into a new message, and then publishes it for other modules to process. Some modules might only produce new messages and never process incoming messages. A chain of modules creates a data processing pipeline with each module performing a transformation on the data at one point in that pipeline.

![A chain of modules in gateway built with Azure IoT Edge][1]

IoT Edge contains the following components:

* Pre-written modules that perform common gateway functions.
* The interfaces a developer can use to write custom modules.
* The infrastructure necessary to deploy and run a set of modules.

The SDK provides an abstraction layer that enables you to build gateways to run on various operating systems and platforms.

![Azure IoT Edge abstraction layer][2]

## Messages

Although thinking about modules passing messages to each other is a convenient way to conceptualize how a gateway functions, it does not accurately reflect what happens. IoT Edge modules use a broker to communicate with each other. Modules publish messages to the broker (using messaging patterns such as bus, or publish/subscribe) and then let the broker route the message to the modules connected to it.

A module uses the **Broker_Publish** function to publish a message to the broker. The broker delivers messages to a module by invoking a callback function. A message consists of a set of key/value properties and content passed as a block of memory.

![The role of the Broker in Azure IoT Edge][3]

## Message routing and filtering

There are two ways to direct messages to the correct IoT Edge modules:

* You can pass a set of links can be passed to the broker so the broker knows the source and sink for each module.
* A module can filter on the properties of the message.

A module should only act upon a message if the message is intended for it. Links and message filtering effectively create a message pipeline.

## Next steps

To see these concepts applied in a sample you can run, see [Explore Azure IoT Edge architecture][lnk-hello-world].

<!-- Images -->
[1]: media/iot-hub-iot-edge-overview/modules.png
[2]: media/iot-hub-iot-edge-overview/modules_2.png
[3]: media/iot-hub-iot-edge-overview/messages_1.png

<!-- Links -->
[lnk-hello-world]: ./iot-hub-linux-iot-edge-get-started.md