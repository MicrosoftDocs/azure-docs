---
# Mandatory fields.
title: Device connectivity
titleSuffix: Azure Digital Twins
description: Understand how Azure Digital Twins deals with devices, both PnP and non-PnP.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/21/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Understand device connectivity in Azure Digital Twins

As part of the Azure Digital Twins graph, in addition to your business twins, you can also have twin that represent IoT devices placed in your environment. IoT devices might be simple sensors, such as thermostats, or complex machines. 
If you attach an IoT hub to Azure Digital Twins, each device connected to the hub can become visible as a node in the twin graph, which can then be connected to other nodes to form a topology. Typically, incoming data from devices triggers event handling functions that are then used to drive properties on other twins.
Azure Digital Twins makes it easy to work with devices by automatically mapping devices from a connected IoT hub into the Azure Digital Twins instance graph. 

## Working with real devices

An Azure Digital Twins graph contains more than twins based on the models you create and instantiate. Azure Digital Twins also automatically creates nodes for every device registered on an IoT hub attached to Azure Digital Twins. You can connect these twins to the modeled twins you create using relationships.
Devices can be:
* **[IoT Plug and Play (PnP)](../iot-pnp/overview-iot-plug-and-play.md) devices** — These are devices that are represented by a Digital Twin Definition Language (DTDL) [model](concepts-models.md). Devices with a DTDL model have a well-defined interface, allowing you to reflect on the messages the device can be expected to set, and the properties etc., exposed on its twin in Azure Digital Twins.
* **Devices without PnP** — For these devices, we have no information about the messages the device can send, or properties or commands available on it. 
Devices send messages for telemetry, or whenever a property is changed. There are also messages for life-cycle events, such as device registration, connection, etc.

### Working with PnP devices

For PnP devices, you can get a description of the telemetry messages a device sends, as well as for properties you can read and write, and commands you can call. You manage device twins using the same APIs and practices used to [manage all twins](how-to-manage-twin.md). For non-PnP devices, the message payload is unknown to the system. 
As described in the section on the JSON data format for messages and query results, each message also contains metadata. This metadata for devices contains information such as connection state, last update, and many other fields.

### Device model updates for PnP

For PnP devices, it is possible that the DTDL description of the device changes without your direct input. For example, a device may receive an over-the-air firmware update. Such a change may invalidate the twins graph.
Here is a possible scenario:
* A Room twin declares an *isEquippedWith* relationship with a temperature sensor with a target type of `dtmi:example:ContosoTemperatureSensor;1`.
* During a firmware update, the manufacturer decides to change the urn to `dtmi:example:ContosoTemperatureSensor;1`.
* At this point, any existing relationship between instances of room and instances of Contoso temperature sensors is not valid any longer.

Azure Digital Twins reacts to this event as follows:
* The relationship is places in an invalid state. You can query for this state to find such relationships.
* A life-cycle message is generated that indicates that a breaking change has occurred in a device. This message contains the affected relationships and relationship source nodes. You can react to this message by updating your relationships or models as required.

## Next steps

Learn more about interacting with a twin representation:
* [Represent objects with a twin](concepts-twins-graph.md)

