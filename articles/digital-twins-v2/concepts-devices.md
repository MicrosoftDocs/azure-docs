---
# Mandatory fields.
title: Representing real devices
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

# Real IoT Devices in the ADT Graph

As part of the Digital Twins graph, in addition to your business twins, you can also have twins that represent IoT devices placed in your environment. IoT device might be simple sensors such as thermostats, or complex machines. 
If you attach an IoT Hub to ADT, each device connected to IoT Hub can become visible as a node in the twin graph and can then be connected to other nodes to form a topology. Typically, incoming data from devices triggers event handler that are then used to drive properties on other twins.
ADT makes it easy to work with devices by automatically mapping devices from a connected IoT Hub into the ADT instance graph. 

> [!WARNING]
> Please see Working with Devices on page 50 for more information.

> [!NOTE]
> Add a section to describe ADT – IoT Hub integration

An ADT graph contains not just twins based on the models you create and instantiate. ADT also automatically creates nodes for every device registered on an IoT Hub attached to ADT. You can connect these twins to the twins you create using relationships.
Devices can be:
* Plug and Play devices that are represented by a DTDL model. Devices with a DTDL model have a well-defined interface, allowing you to reflect on the messages the device can be expect to set, and the properties, etc. exposed on its twin in ADT.
* Devices without PnP. For these devices, we have no information about the messages the device can send, or properties or commands available on it. 
Devices sent messages for telemetry, or whenever a property is changed. There are also messages for lifecycle events, such as device registration, connection, etc.

## Working with PnP devices

For PnP devices, you can get a description of the telemetry messages a device sends, as well as for properties you can read and write, and commands you can call. You use the same APIs for devices that you use for all other twins, as described in the sections above. For non-PnP devices, the message payload is unknown to the system. 
As described in the section on the JSON data format for messages and query results, each message also contains metadata. This metadata for devices contains information such as connection state, last update, and many other fields more.

### Device Model Updates for PnP

For PnP devices, it is possible that the DTDL description of the device changes without your direct input, for example if the device receives an over-the-air firmware update. Such changes may invalidate the twins graph.
For example:
* A Room twin declares an *isEquippedWith* relationship with a temperature sensor with a target type of `dtmi:example:ContosoTemperatureSensor;1`.
* During a firmware update, the manufacturer decided to change the urn to `dtmi:example:ContosoTemperatureSensor;1`.
* At this point, any existing relationship between instances of room and instances of Contoso temperature  sensors is not valid any longer.

ADT reacts to this event as follows:
* The relationship is places in an invalid state. You can query for this state to find such relationships 
* A lifecycle message is generated that indicates that a breaking change has occurred in a device. This message contains the affected relationships and relationship source nodes. You can react to this message by updating your relationships or models as required.
