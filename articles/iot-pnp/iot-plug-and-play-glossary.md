---
title: Glossary of terms - IoT Plug and Play Preview | Microsoft Docs
description: Concepts - a glossary of common terms relating to IoT Plug and Play Preview.
author: dominicbetts
ms.author: dobett
ms.date: 12/23/2019
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea
---

# Glossary of terms for IoT Plug and Play Preview

Definitions of common terms as used in the IoT Plug and Play articles.

## Azure IoT Tools extension

Azure IoT Tools is a a collection of extensions in [Visual Studio code](#visual-studio-code) that help you interact with IoT Hub and develop IoT devices. For IoT Plug and Play device development, it helps you to author [device models](#device-model) and [interfaces](#interface)..

## Azure IoT explorer tool

The Azure IoT explorer is a graphical tool you can use to interact with and test your [IoT Plug and Play devices](#iot-plug-and-play-device). After you install the tool on your local machine, you can use it to:

- View the devices connected to your [IoT hub](#azure-iot-hub).
- Connect to an IoT Plug and Play device.
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

## Common interface

All [IoT Plug and Play devices](#iot-plug-and-play-device) are expected to implement some common [interfaces](#interface). For example, the device information interface defines hardware and operating system information about the device. You can retrieve common interface definitions from the public model repository.

## Connection string

A connection string encapsulates the information required to connect to an endpoint. A connection string typically includes the address of the endpoint and security information, but connection string formats vary across services. There are two types of connection string associated with the IoT Hub service:

- Device connection strings enable [IoT Plug and Play devices](#iot-plug-and-play-device) to connect to the device-facing endpoints on an IoT hub. Client code on a device uses the connection string to establish a secure connection with an IoT hub.
- IoT Hub connection strings enable back-end solutions and tools to connect securely to the service-facing endpoints on an IoT hub. These solutions and tools manage the IoT hub and the devices connected to it.

## Device model

A device model describes an [IoT Plug and Play device](#iot-plug-and-play-device) and defines the set of [interfaces](#interface) implemented by the device. A device model typically corresponds to a physical device, product, or SKU. You use the [Digital Twin Definition Language](#digital-twin-definition-language) to define a device model.

## Device developer

A device developer uses a [device model](#device-model), [interfaces](#interface), and an [Azure IoT device SDK](#azure-iot-device-sdk) to implement code to run on an [IoT Plug and Play device](#iot-plug-and-play-device).

## Device modeling

A [device developer](#device-developer) uses the [Digital Twin Definition Language](#digital-twin-definition-language) to model the capabilities of an [IoT Plug and Play device](#iot-plug-and-play-device). The model can be shared using the model repository. A [solution developer](#solution-developer) can configure an IoT solution from the model.

## Device Provisioning Service

Azure IoT Central uses the Device Provisioning Service to manage all device registration and connection. For more information, see [Device connectivity in Azure IoT Central](../iot-central/core/concepts-get-connected.md). You can also use the Device Provisioning Service to manage device registration and connection to your IoT Hub-based IoT solution. For more information, see [Provisioning devices with Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md).

## Device registration

Before an [IoT Plug and Play device](#iot-plug-and-play-device) can connect to an IoT solution, it must be registered with the solution. Azure IoT Central uses the [Device Provisioning Service](#device-provisioning-service) to manage device registration. In a custom IoT solution, you can register devices with your IoT hub in the Azure portal or programmatically.

## Digital twin

A digital twin is a model of an [IoT Plug and Play device](#iot-plug-and-play-device). A digital twin is modeled using the [Digital Twin Definition Language](#digital-twin-definition-language). You can use the [Azure IoT device SDKs](#azure-iot-device-sdk) to interact with digital twins at run time. For example, you can set a property value in a digital twin on a device and the SDK communicates this change to your IoT solution in the cloud.

## Digital twin change events

When an [IoT Plug and Play device](#iot-plug-and-play-device) is connected to an [IoT hub](#azure-iot-hub), the hub can use its routing capability to send notifications of digital twin changes. For example, whenever a [property](#properties) value changes on a device, IoT Hub can send a notification to an endpoint such as a Service Bus queue.

## Digital Twin Definition Language

A language for describing models and interfaces for [IoT Plug and Play devices](#iot-plug-and-play-device). Use the [Digital Twin Definition Language](https://aka.ms/DTDL) to describe a [digital twin's](#digital-twin) capabilities and enable the IoT platform and IoT solutions to leverage the semantics of the entity.

## Digital twin route

A route set up in an [IoT hub](#azure-iot-hub) to deliver [digital twin change events](#digital-twin-change-events) to and endpoint such as a Service Bus queue.

## Interface

An interface describes related capabilities that are implemented by a [IoT Plug and Play device](#iot-plug-and-play-device) or [digital twin](#digital-twin). You can reuse interfaces across different [device models](#device-model).

## IoT Hub query language

The IoT Hub query language is used for multiple purposes. For example, you can use the language to search for [devices registered](#device-registration) with your IoT hub or refine the [digital twin routing](#digital-twin-route) behavior.

## IoT Plug and Play device

An IoT Plug and Play device is typically a small-scale, standalone computing device that collects data or controls other devices, and that runs software or firmware that implements a [device model](#device-model).  For example, an IoT Plug and Play device might be an environmental monitoring device, or a controller for a smart-agriculture irrigation system. You can write a cloud-hosted IoT solution to command, control, and receive data from IoT Plug and Play devices.

## Model discovery

When an [IoT Plug and Play device](#iot-plug-and-play-device) connects to an IoT solution, the solution can discover the capabilities of the device by finding the [device model](#device-model). A device can send its model to the solution, or the solution can find a device model in the [model repository](#model-repository).

## Model repository

The model repository stores [device models](#device-model) and [interfaces](#interface). Organizations can store their own models and interfaces in the repository and manage access with RBAC.

## Model repository REST API

An API for managing and interacting with the model repository. For example, you can use the API to add and search for [device models](#device-model).

## Properties

Properties are data fields defined in an [interface](#interface) that represent some state of a digital twin. You can declare properties as read-only or writable. Read-only properties, such as serial number, are set by code running on the [IoT Plug and Play device](#iot-plug-and-play-device) itself.  Writable properties, such as an alarm threshold, are typically set from the cloud-based IoT solution.

## Registration ID

A registration ID uniquely identifies a device in the [Device Provisioning Service](#device-provisioning-service). This ID isn't the same as the device ID that's a unique identifier for a device in an [IoT hub](#azure-iot-hub).

## Scope ID

The Scope ID scope uniquely identifies a [Device Provisioning Service](#device-provisioning-service) instance.

## Shared access signature

Shared access signatures are an authentication mechanism based on SHA-256 secure hashes or URIs. Shared access signature authentication has two components: a shared access policy and a shared access signature (often called a token). An [IoT Plug and Play device](#iot-plug-and-play-device) uses a shared access signature to authenticate with an [IoT hub](#azure-iot-hub).

## Solution developer

A solution developer creates the solution back end. A solution developer typically works with Azure resources such as [IoT Hub](#azure-iot-hub) and  [model repositories](#model-repository).

## Telemetry

Telemetry fields defined in an [interface](#interface) represent measurements. These measurements are typically values such as sensor readings that are sent by the [IoT Plug and Play device](#iot-plug-and-play-device) as a stream of data.

## Visual Studio code

Visual Studio code is a modern code editor available for multiple platforms. Extensions, such as those in the [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) pack, enable you to customize the editor to support a wide range of development scenarios.
