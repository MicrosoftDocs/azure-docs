---
# Mandatory fields.
title: Device connectivity
titleSuffix: Azure Digital Twins
description: Understand how Azure Digital Twins deals with devices, both PnP and non-PnP.
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

# Understand device connectivity in Azure Digital Twins

In addition to your [model-based](concepts-models.md) business twins in the Azure Digital Twins graph, you can also have twins that represent IoT devices placed in your environment. IoT devices might be simple sensors, such as thermostats, or more complex machines. These devices are typically managed in an [Azure IoT hub](../iot-hub/about-iot-hub.md).

Azure Digital Twins makes it easy to work with devices by allowing you to integrate an IoT hub into your Azure Digital Twins solution.

Once you attach a hub to Azure Digital Twins, each device connected to the hub can become visible as a node in the twin graph. These nodes are known as **device twins**.

As with model-based twins, device twins can be connected with relationships to any other twin node in the graph to build the topology. It is typical for device twins to drive the live graph, as incoming data from devices triggers event handling functions that drive properties on other twins.

## Working with real devices

There are many reasons that a device may send messages: telemetry, changing properties, life-cycle events like device registration, and more. The information about these messages that is available to Azure Digital Twins can vary according to the type of the device.

Devices may be classified as either:
* **[IoT Plug and Play (PnP)](../iot-pnp/overview-iot-plug-and-play.md) devices** — These are devices that are represented by Digital Twin Definition Language (DTDL) [models](concepts-models.md). A device with a DTDL model has a well-defined interface, allowing you visibility into the commands, properties, etc. that will be exposed on its twin in Azure Digital Twins. It also gives information about the types of messages the device is expected to send. 
* **Devices without PnP** — These devices offer no information about the properties or commands they have available, or the messages they can send. The message payload is unknown to the system. 

Each device message also contains metadata. This metadata for devices contains information such as connection state, last update, and many other fields. See [How to: route event data](how-to-route-events.md) for more details.

To manage device twins, you use the same APIs and practices used to [manage all twins](how-to-manage-twin.md). 

### PnP device model updates

With PnP devices, it is possible for the DTDL descriptions to change without your direct input. This change may invalidate the twins graph, as the graph could now reference models or properties that no longer exist.

For example, consider the following scenario in which a device receives an over-the-air firmware update.
1. First, a *room* twin declares an *isEquippedWith* relationship with a temperature sensor. The relationship has a target type of `dtmi:example:ContosoSensor;1`.
2. During a firmware update, the manufacturer decides to change the sensor's urn to `dtmi:example:ContosoTemperatureSensor;1`.
3. As a result, any existing relationships between instances of *room* and instances of *ContosoSensor* are not valid any longer.

Azure Digital Twins reacts to this event as follows:
* The relationship is placed in an invalid state. You can find such relationships by [querying the graph](concepts-query-graph.md) for this state.
* A life-cycle message is generated that indicates that a breaking change has occurred in a device. The message data contains the affected relationships and relationship source nodes. You can react to this message by updating your relationships or models as required.

## Next steps

Learn more about twin representations and the graph:
* [Create twins and the Azure Digital Twins graph](concepts-twins-graph.md)

