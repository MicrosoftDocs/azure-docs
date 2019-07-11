---
title: Build an IoT solution for Plug and Play devices | Microsoft Docs
description: As a solution developer, learn about how you can build an IoT Solution for Plug and Play devices.
author: tbhagwat3
ms.author: tanmayb
ms.date: 06/12/2019
ms.topic: Tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea
---


# Build an IoT solution for Plug and Play devices

This article describes how, as a solution developer, you can build an IoT Solution for Plug and Play devices.

## Before you begin

Before getting started:

1. Acquire a Plug and Play (PnP) device that's pre-configured to connect to your device provisioning service instance or IoT Hub.
1. Alternately you can use a simulated version of a sample device. Learn more [here](link).

Broadly speaking there are two categories of IoT solutions: purpose built solutions that'll work with a known set of PnP devices and model driven solutions that are built to work with any PnP device.

This article will show you how you can built both types of solutions and provide sample applications that you can use to get started.

## Plug and Play capability discovery

To build solutions for PnP devices it's important to understand what happens when PnP devices connect to the IoT Hub.

When a PnP device connects to the IoT Hub for the very first time, it'll broadcast it's ids for the interfaces it implements in a special discovery telemetry message. For a solution to understand how to work with that PnP device, it needs to resolve those ids and get full definitions for each interface.

Here are the steps a PnP device takes when connecting either through the Device Provisioning Service:

1. When the device is turned on, it connects to the global end-point for the Device Provisioning Service (DPS) and authenticates itself using one of the allowed methods.
1. DPS then authenticates the device, looks up the rule that'll tell it the hub to which the device should be assigned and register the device with that hub.
1. DPS returns an IoT Hub connection string to the device.
1. The device will then send a discovery telemetry message to the IoT Hub. The discovery telemetry message will contain the ids of the interfaces implemented by the device.
1. The Plug and Play device is now ready to use with a solution written against that hub and starts working as designed.

If the device connects directly to an IoT Hub it just connects using the connection string embedded in it's device code and starts with step 4.

See the [ModelInformation](link) interface to learn more about the discovery telemetry message.


## Build a purpose built IoT Solution that'll work with a known set of PnP devices

If the capability model and interfaces for devices that'll connect to your solution are known ahead of time, do the following to prepare your solution for devices that'll connect: 

1. Store JSON files for those interfaces in a location of your choice in Azure that'll allow you to efficiently read data.
1. Write logic in your IoT solution to handle each device type. See this [sample IoT application](link) to learn more.
1. Then, you can subscribe to the notifications for the IoT Hub against which your solution will work.

When you recieve a notification for a new device connecting, follow these steps:
1. Read the discovery telemetry message to retrieve ids for the capability model and interfaces implemented by the device that connected.
1. Compare the id of the capability model against the ids of the capability models you've stored ahead of time.
1. Now you know what type of device has connected. Use the logic you wrote earlier to enable users to interact with the device appropriately.


## Build a model driven IoT Solution capable of working with any PnP device

Building a model driven IoT Solution is a little more complicated but the benefit is that you'll only need to write a solution once for any devices that'll get added in the future.

To build a true model driven IoT Solution, you need to build logic against the primitive PnP capabilities: telemetry, properties and commands. Essentially the core of your IoT solution will be that logic and a way to represnt a device by combining multiple telemetry, property and command capabilities.

You will also need to subscribe to the notifications for the IoT Hub against which your solution will work.

When you recieve a notification for a new device connecting, follow these steps:
1. Read the discovery telemetry message to retrieve ids for the capability model and interfaces implemented by the device that connected.
1. Now for each id you'll need to find the full JSON file to find the capabilities of the device.
1. First, check to see if an interface with each id is present in any caches you've built for storing the JSON files retrieved earlier by your solution.
1. Then, check if an interface with that id is present in the Global model repository. Learn more about the [Global model repository](link).
<Code sample>
1. If the interface isn't present in the Global model repository, you can then try looking it up in any Private model repositories known to your solution. You'll need users to provide connection strings for private model repositories to enable this. Learn more about [Private model repositories(link).
<Code sample>
1. If you don't find the all the interfaces in either the Global model repository or the Private model repository, it's a good bet that they're not available on the cloud. In this case you can check to see if the device implements the [ModelDefinition](link) interface. The ModelDefinition interface provides a way to retrieve JSON files for interfaces through a command you can invoke on the device.
<Code sample>
1. If you were able to find JSON files for each interface implemented by the device, you will be able to enumerate the capabilities of the device that connected in terms of its telemetry, properties and commands. Use the logic you wrote earlier to enable users to interact with the device appropriately.


## Next steps

Now that you've built an IoT solution for Plug and Play devices, learn more about how the rest of the [Azure IoT Platform](link) to leverage other great capabilities for your solution.
