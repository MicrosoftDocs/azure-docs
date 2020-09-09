---
title: Glossary of terms - IoT Plug and Play Preview | Microsoft Docs
description: Concepts - a glossary of common terms relating to IoT Plug and Play Preview.
author: dominicbetts
ms.author: dobett
ms.date: 07/22/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Glossary of terms for IoT Plug and Play Preview

Definitions of common terms as used in the IoT Plug and Play articles.

## Azure IoT explorer tool

The Azure IoT explorer is a graphical tool you can use to interact with and test your [IoT Plug and Play devices](#iot-plug-and-play-device). After you install the tool on your local machine, you can use it to:

- View the devices connected to your [IoT hub](#azure-iot-hub).
- Connect to an IoT Plug and Play device.
- View the device [components](#component).
- View the [telemetry](#telemetry) the device sends.
- Work with device [properties](#properties).
- Call device [commands](#commands).

## Azure IoT Hub

IoT Hub is a managed service, hosted in the cloud, that acts as a central message hub for bi-directional communication between your IoT application and the devices it manages. [IoT Plug and Play devices](#iot-plug-and-play-device) can connect to an IoT hub. An IoT solution uses an IoT hub to enable:

- Devices to send telemetry to a cloud-based solution.
- A cloud-based solution to manage connected devices.

## Azure IoT device SDK

There are device SDKs for multiple languages that you can use to build IoT Plug and Play device client applications.

## Commands

Commands defined in an [interface](#interface) represent methods that can be executed on the [digital twin](#digital-twin). For example, a command to reboot a device.

## Component

Components let you build a model [interface](#interface) as an assembly of other interfaces. A [device model](#device-model) can combine multiple interfaces as components. For example, a model might include a switch component and thermostat component. Multiple components in a model can also use the same interface type. For example a model might include two thermostat components.

## Connection string

A connection string encapsulates the information required to connect to an endpoint. A connection string typically includes the address of the endpoint and security information, but connection string formats vary across services. There are two types of connection string associated with the IoT Hub service:

- Device connection strings enable [IoT Plug and Play devices](#iot-plug-and-play-device) to connect to the device-facing endpoints on an IoT hub. Client code on a device uses the connection string to establish a secure connection with an IoT hub.
- IoT Hub connection strings enable back-end solutions and tools to connect securely to the service-facing endpoints on an IoT hub. These solutions and tools manage the IoT hub and the devices connected to it.

## Device certification

The IoT Plug and Play device certification program verifies that a device meets the IoT Plug and Play certification requirements. You can add a certified device to the public [Certified for Azure IoT device catalog](https://aka.ms/devicecatalog).

## Device model

A device model describes an [IoT Plug and Play device](#iot-plug-and-play-device) and defines the [components](#component) that make up the device. A simple device model has no separate components and contains a definition for a single root-level interface. A more complex device model includes multiple components. A device model typically corresponds to a physical device, product, or SKU. You use the [Digital Twins Definition Language version 2](#digital-twins-definition-language) to define a device model.

## Device builder

A device builder uses a [device model](#device-model) and [interfaces](#interface) when implementing code to run on an [IoT Plug and Play device](#iot-plug-and-play-device). Device builders typically use one of the [Azure IoT device SDKs](#azure-iot-device-sdk) to implement  the device client but this is not required.

## Device modeling

A [device builder](#device-builder) uses the [Digital Twins Definition Language](#digital-twins-definition-language) to model the capabilities of an [IoT Plug and Play device](#iot-plug-and-play-device). A [solution builder](#solution-builder) can configure an IoT solution from the model.

## Digital twin

A digital twin is a model of an [IoT Plug and Play device](#iot-plug-and-play-device). A digital twin is modeled using the [Digital Twins Definition Language](#digital-twins-definition-language). You can use the [Azure IoT device SDKs](#azure-iot-device-sdk) to interact with digital twins at run time. For example, you can set a property value in a digital twin on a device and the SDK communicates this change to your IoT solution in the cloud.

## Digital twin change events

When an [IoT Plug and Play device](#iot-plug-and-play-device) is connected to an [IoT hub](#azure-iot-hub), the hub can use its routing capability to send notifications of digital twin changes. For example, whenever a [property](#properties) value changes on a device, IoT Hub can send a notification to an endpoint such as a Event hub.

## Digital Twins Definition Language

A language for describing models and interfaces for [IoT Plug and Play devices](#iot-plug-and-play-device). Use the [Digital Twins Definition Language version 2](https://github.com/Azure/opendigitaltwins-dtdl) to describe a [digital twin's](#digital-twin) capabilities and enable the IoT platform and IoT solutions to leverage the semantics of the entity.

## Digital twin route

A route set up in an [IoT hub](#azure-iot-hub) to deliver [digital twin change events](#digital-twin-change-events) to and endpoint such as a Event hub.

## Interface

An interface describes related capabilities that are implemented by a [IoT Plug and Play device](#iot-plug-and-play-device) or [digital twin](#digital-twin). You can reuse interfaces across different [device models](#device-model). When an interface is used in a device model, it defines a [component](#component) of the device.

## IoT Hub query language

The IoT Hub query language is used for multiple purposes. For example, you can use the language to search for devices registered with your IoT hub or refine the [digital twin routing](#digital-twin-route) behavior.

## IoT Plug and Play device

An IoT Plug and Play device is typically a small-scale, standalone computing device that collects data or controls other devices, and that runs software or firmware that implements a [device model](#device-model).  For example, an IoT Plug and Play device might be an environmental monitoring device, or a controller for a smart-agriculture irrigation system. You can write a cloud-hosted IoT solution to command, control, and receive data from IoT Plug and Play devices.

## IoT Plug and Play conventions

IoT Plug and Play [devices](#iot-plug-and-play-device) are expected to follow a set of [conventions](concepts-convention.md) when they exchange data with a solution.

## Model ID

When an IoT Plug and Play device connects to an IoT Hub it sends the **Model ID** of the [DTDL](#digital-twins-definition-language) model it implements. This enables the solution to find the device model.

## Model repository

A [model repository](concepts-model-repository.md) stores [device models](#device-model) and [interfaces](#interface).

## Model repository REST API

An API for managing and interacting with the model repository. For example, you can use the API to add and search for [device models](#device-model).

## Properties

Properties are data fields defined in an [interface](#interface) that represent some state of a digital twin. You can declare properties as read-only or writable. Read-only properties, such as serial number, are set by code running on the [IoT Plug and Play device](#iot-plug-and-play-device) itself.  Writable properties, such as an alarm threshold, are typically set from the cloud-based IoT solution.

## Shared access signature

Shared access signatures are an authentication mechanism based on SHA-256 secure hashes or URIs. Shared access signature authentication has two components: a shared access policy and a shared access signature (often called a token). An [IoT Plug and Play device](#iot-plug-and-play-device) uses a shared access signature to authenticate with an [IoT hub](#azure-iot-hub).

## Solution builder

A solution builder creates the solution back end. A solution builder typically works with Azure resources such as [IoT Hub](#azure-iot-hub) and [model repositories](#model-repository).

## Telemetry

Telemetry fields defined in an [interface](#interface) represent measurements. These measurements are typically values such as sensor readings that are sent by the [IoT Plug and Play device](#iot-plug-and-play-device) as a stream of data.
