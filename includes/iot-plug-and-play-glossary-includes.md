---
author: ChrisGMsft
ms.service: iot-pnp
ms.topic: include
ms.date: 06/28/2019	
ms.author: chrisgre
---

## IoT Plug and Play device

An IoT Plug and Play device is typically a small-scale, standalone computing device that may collect data or control other devices, and that runs software or firmware that implements the capabilities declared in a [device capability model](#device-capability-model).  For example, an IoT Plug and Play device might be an environmental monitoring device, or a controller for a smart-agrigulture irigation system. Cloud-hosted IoT solutions can be written to command, control, and receive data from IoT Plug and Play devices. IoT Plug and Play devices can be found through the [Azure Certified for IoT device catalog](https://catalog.azureiotsolutions.com/). Each IoT Plug and Play device in the catalog has been validated, and has a [device capability model](#device-capability-model).

## Digital twin

Digital twins are models of IoT Plug and Play devices.  Digital twins are modelled using the [Digital Twin Defintion Language](https://aka.ms/DTDL) and are represented in the Azure IoT API surface. 

## Digital Twin Definition Language

A language for describing models and interfaces for [IoT Plug and Play devices](#iot-plug-and-play-device).  Use the [Digital Twin Defintion Language](https://aka.ms/DTDL) to describe a [digital twin's](#digital-twin) capabilities and enable the IoT platform and IoT solutions to leverage the semantics of the entity.

## Device capability model

A device capability model describes a device and defines the set of interfaces implemented by the device. Create a device capability model to correpsond to a physical device, product, or SKU.

## Interface

An interface describes related capabilities that are implemented by a device or digital twin. Interfaces are reusable and can be reused across different capability models.

## Property

Properties are data fields that represent some state of a digital twin. Use properties to represent durable state. You can declare properties as read-only or writable. Read-only properties can only be set by code running in the context of the IoT Plug and Play device itself, such as serial number, while writable properties can be set by external entities as well, such as setting alert thresholds.

Properties are data fields that represent some state of a digital twin. Use properties to represent durable state. You can declare properties as read-only or writable. Read-only properties can only be set by code running in the context of the model itself, while writable properties can be set by external entities as well. 

## Telemetry

Telemetry fields represent measurements. Measurement are typically used for the equivalent of sensor readings.

## Command

Commands represent methods can be executed on the digital twin. An example would be a reset command. 
