---
# Mandatory fields.
title: Integrate IoT Hub devices
titleSuffix: Azure Digital Twins
description: Understand how Azure Digital Twins can integrate Azure IoT Hub devices.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/27/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# IoT Hub devices in Azure Digital Twins

In addition to your [model-based](concepts-models.md) business twins in the Azure Digital Twins graph, you can also have twins that represent IoT devices placed in your environment. IoT devices might be simple sensors, such as thermostats, or more complex machines. These devices are typically managed in an [Azure IoT hub](../iot-hub/about-iot-hub.md).

Azure Digital Twins makes it easy to work with devices by allowing you to integrate an IoT hub into your Azure Digital Twins solution.

Once you attach a hub to Azure Digital Twins, each device connected to the hub can become visible as a node in the twin graph. These nodes are known as **proxy twins**.

As with model-based twins, proxy twins can be connected with relationships to any other twin node in the graph to build the topology. It is typical for proxy twins to drive the live graph, as incoming data from devices triggers event handling functions that drive properties on other twins.

## Working with real devices in preview

Azure Digital Twins (preview) has a limited set of capabilities around proxy twins. You are able to:
* Create proxy twins representing IoT Hub devices
* Allow model-based twins to form relationships with the proxy twins
* Query proxy twins in the graph

In preview, Azure Digital Twins is unable to receive information about device capabilities, including their properties, commands, or the messages they can send. The message payload is therefore unknown to the system. 

To manage proxy twins, you use the same APIs and practices used to [manage all twins](how-to-manage-twin.md).

## Next steps

Learn more about twin representations and the graph:
* [Create twins and the Azure Digital Twins graph](concepts-twins-graph.md)

