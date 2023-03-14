---
title: Azure IoT glossary of terms | Microsoft Docs
description: Developer guide - a glossary explaining some of the common terms used in the Azure IoT articles.
author: dominicbetts
ms.author: dobett
ms.service: iot
services: iot
ms.topic: conceptual
ms.date: 08/26/2022

# Generated from YAML source.
---

# Glossary of IoT terms

This article lists some of the common terms used in the IoT articles.

## A

### Advanced Message Queueing Protocol

One of the messaging protocols that [IoT Hub](#iot-hub) and IoT Central support for communicating with [devices](#device).

[Learn more](../iot-hub/iot-hub-devguide-protocols.md)

Casing rules: Always *Advanced Message Queueing Protocol*.

First and subsequent mentions: Depending on the context spell out in full. Otherwise use the abbreviation AMQP.

Abbreviation: AMQP

Applies to: Iot Hub, IoT Central, Device developer

### Allocation policy

In the [Device Provisioning Service](#device-provisioning-service), the allocation policy determines how the service assigns [devices](#device) to a [Linked IoT hub](#linked-iot-hub).

Casing rules: Always lowercase.

Applies to: Device Provisioning Service

### Attestation mechanism

In the [Device Provisioning Service](#device-provisioning-service), the attestation mechanism is the method used to confirm a [device](#device)'s identity. The attestation mechanism is configured on an [enrollment](#enrollment).

Attestation mechanisms include X.509 certificates, Trusted Platform [Modules](#module), and symmetric keys.

Casing rules: Always lowercase.

Applies to: Device Provisioning Service

### Automatic deployment

A feature in [IoT Edge](#iot-edge) that configures a target set of [IoT Edge devices](#iot-edge-device) to run a set of IoT Edge [modules](#module). Each deployment continuously ensures that all [devices](#device) that match its [target condition](#target-condition) are running the specified set of modules, even when new devices are created or are modified to match the target condition. Each IoT Edge device only receives the highest priority deployment whose target condition it meets.

[Learn more](../iot-edge/module-deployment-monitoring.md)

Casing rules: Always lowercase.

Applies to: IoT Edge

### Automatic device configuration

A feature of [IoT Hub](#iot-hub) that enables your [solution](#solution) back end to assign [desired properties](#desired-properties) to a set of [device twins](#device-twin) and report [device](#device) status using system and custom metrics.

[Learn more](../iot-hub/iot-hub-automatic-device-management.md)

Casing rules: Always lowercase.

Applies to: Iot Hub

### Automatic device management

A feature of [IoT Hub](#iot-hub) that automates many of the repetitive and complex tasks of managing large [device](#device) fleets over the entirety of their lifecycles. The feature lets you target a set of devices based on their [properties](#properties), define a [desired configuration](#desired-configuration), and let IoT Hub update devices whenever they come into scope.

Consists of [automatic device configurations](../iot-hub/iot-hub-automatic-device-management.md) and [IoT Edge automatic deployments](../iot-edge/how-to-deploy-at-scale.md).

Casing rules: Always lowercase.

Applies to: Iot Hub

### Azure Certified Device program

Azure Certified [Device](#device) is a free program that enables you to differentiate, certify, and promote your IoT devices built to run on Azure.

[Learn more](../certification/overview.md)

Casing rules: Always capitalize as *Azure Certified Device*.

Applies to: Iot Hub, IoT Central

### Azure Digital Twins

A platform as a service (PaaS) offering for creating digital representations of real-world things, places, business processes, and people. Build twin graphs that represent entire environments, and use them to gain insights to drive better products, optimize operations and costs, and create breakthrough customer experiences.

[Learn more](../digital-twins/overview.md)

Casing rules: Always capitalize when you're referring to the service.

First and subsequent mentions: When you're referring to the service, always spell out in full as *Azure Digital Twins*.

Example usage: The data in your *Azure Digital Twins* model can be routed to downstream Azure services for more analytics or storage.

Applies to: Digital Twins

### Azure Digital Twins instance

A single instance of the [Azure Digital Twins](#azure-digital-twins) service in a customer's subscription. While Azure [Digital Twins](#digital-twin) refers to the Azure service as a whole, your Azure Digital Twins *instance* is your individual Azure Digital Twins resource.

Casing rules: Always capitalize the service name.

First and subsequent mentions: Always spell out in full as *Azure Digital Twins instance*.

Applies to: Digital Twins

### Azure IoT Explorer

A tool you can use to view the [telemetry](#telemetry) the [device](#device) is sending, work with device [properties](#properties), and call [commands](#command). You can also use the explorer to interact with and test your devices, and to manage [IoT Plug and Play devices](#iot-plug-and-play-device).

[Learn more](https://github.com/Azure/azure-iot-explorer)

Casing rules: Always capitalize as *Azure IoT Explorer*.

Applies to: Iot Hub, Device developer

### Azure IoT Tools

A cross-platform, open-source, Visual Studio Code extension that helps you manage Azure [IoT Hub](#iot-hub) and [devices](#device) in VS Code. With Azure IoT Tools, IoT developers can easily develop an IoT project in VS Code

Casing rules: Always capitalize as *Azure IoT Tools*.

Applies to: Iot Hub, IoT Edge, IoT Central, Device developer

### Azure IoT device SDKs

These SDKS, available for multiple languages, enable you to create [device apps](#device-app) that interact with an [IoT hub](#iot-hub) or an IoT Central application.

[Learn more](../iot-develop/about-iot-sdks.md)

Casing rules: Always refer to as *Azure IoT device SDKs*.

First and subsequent mentions: On first mention, always use *Azure IoT device SDKs*. On subsequent mentions abbreviate to *device SDKs*.

Example usage: The *Azure IoT device SDKs* are a set of device client libraries, developer guides, samples, and documentation. The *device SDKs* help you to programmatically connect devices to Azure IoT services.

Applies to: Iot Hub, IoT Central, Device developer

### Azure IoT service SDKs

These SDKs, available for multiple languages, enable you to create [back-end apps](#back-end-app) that interact with an [IoT hub](#iot-hub).

[Learn more](../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-service-sdks)

Casing rules: Always refer to as *Azure IoT service SDKs*.

First and subsequent mentions: On first mention, always use *Azure IoT service SDKs*. On subsequent mentions abbreviate to *service SDKs*.

Applies to: Iot Hub

## B

### Back-end app

In the context of [IoT Hub](#iot-hub), an app that connects to one of the service-facing [endpoints](#endpoint) on an IoT hub. For example, a back-end app might retrieve [device-to-cloud](#device-to-cloud) messages or manage the [identity registry](#identity-registry). Typically, a back-end app runs in the cloud, but for simplicity many of the tutorials show back-end apps as console apps running on your local development machine.

Casing rules: Always lowercase.

Applies to: Iot Hub

### Built-in endpoints

[Endpoints](#endpoint) built into [IoT Hub](#iot-hub). For example, every IoT hub includes a built-in endpoint that is Event Hubs-compatible.

Casing rules: Always lowercase.

Applies to: Iot Hub

## C

### Cloud gateway

A cloud-hosted app that enables connectivity for [devices](#device) that cannot connect directly to [IoT Hub](#iot-hub) or IoT Central. A cloud [gateway](#gateway) is hosted in the cloud in contrast to a [field gateway](#field-gateway) that runs local to your devices. A common use case for a cloud gateway is to implement protocol translation for your devices.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central

### Cloud property

A feature in IoT Central that lets your store [device](#device) metadata in the IoT Central application. Cloud [properties](#properties) are defined in the [device template](#device-template), but aren't part of the [device model](#device-model). Cloud properties are never synchronized with a device.

Casing rules: Always lowercase.

Applies to: IoT Central

### Cloud-to-device

Messages sent from an [IoT hub](#iot-hub) to a connected [device](#device). Often, these messages are [commands](#command) that instruct the device to take an action.

Casing rules: Always lowercase.

Abbreviation: Do not use *C2D*.

Applies to: Iot Hub

### Command

A command is defined in an IoT Plug and Play [interface](#interface) to represent a method that can be called on the [digital twin](#digital-twin). For example, a command to reboot a [device](#device). In IoT Central, commands are defined in the [device template](#device-template).

Applies to: Iot Hub, IoT Central, Device developer

### Component

In IoT Plug and Play and [Azure Digital Twins](#azure-digital-twins), components let you build a [model](#model) [interface](#interface) as an assembly of other interfaces. A [device model](#device-model) can combine multiple interfaces as components. For example, a model might include a switch component and thermostat component. Multiple components in a model can also use the same interface type. For example, a model might include two thermostat components.

Casing rules: Always lowercase.

Applies to: Iot Hub, Digital Twins, Device developer

### Configuration

In the context of [automatic device configuration](#automatic-device-configuration) in [IoT Hub](#iot-hub), it defines the [desired configuration](#desired-configuration) for a set of [devices](#device) twins and provides a set of metrics to report status and progress.

Casing rules: Always lowercase.

Applies to: Iot Hub

### Connection string

Use in your app code to encapsulate the information required to connect to an [endpoint](#endpoint). A connection string typically includes the address of the endpoint and security information, but connection string formats vary across services. There are two types of connection string associated with the [IoT Hub](#iot-hub) service:

- *[Device](#device) connection strings* enable devices to connect to the device-facing endpoints on an IoT hub.
- *IoT Hub connection strings* enable [back-end apps](#back-end-app) to connect to the service-facing endpoints on an IoT hub.

Casing rules: Always lowercase.

Applies to: Iot Hub, Device developer

### Custom endpoints

User-defined [endpoints](#endpoint) on an [IoT hub](#iot-hub) that deliver messages dispatched by a [routing rule](#routing-rule). These endpoints connect directly to an event hub, a Service Bus queue, or a Service Bus topic.

Casing rules: Always lowercase.

Applies to: Iot Hub

### Custom gateway

Enables connectivity for [devices](#device) that cannot connect directly to [IoT Hub](#iot-hub) or IoT Central. You can use Azure [IoT Edge](#iot-edge) to build custom [gateways](#gateway) that implement custom logic to handle messages, custom protocol conversions, and other processing.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central

## D

### Default component

All [IoT Plug and Play device](#iot-plug-and-play-device) [models](#model) have a default [component](#component). A simple [device model](#device-model) only has a default component - such a model is also known as a no-component [device](#device). A more complex model has multiple components nested below the default component.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Device developer

### Deployment manifest

A JSON document in [IoT Edge](#iot-edge) that contains the [configuration](#configuration) data for one or more [IoT Edge device](#iot-edge-device) [module twins](#module-twin).

Casing rules: Always lowercase.

Applies to: IoT Edge, IoT Central

### Desired configuration

In the context of a [device twin](#device-twin), desired [configuration](#configuration) refers to the complete set of [properties](#properties) and metadata in the [device](#device) twin that should be synchronized with the device.

Casing rules: Always lowercase.

Applies to: Iot Hub

### Desired properties

In the context of a [device twin](#device-twin), desired [properties](#properties) is a subsection of the [device](#device) twin that is used with [reported properties](#reported-properties) to synchronize device [configuration](#configuration) or condition. Desired properties can only be set by a [back-end app](#back-end-app) and are observed by the [device app](#device-app). IoT Central uses the term writable properties.

Casing rules: Always lowercase.

Applies to: Iot Hub

### Device

In the context of IoT, a device is typically a small-scale, standalone computing device that may collect data or control other devices. For example, a device might be an environmental monitoring device, or a controller for the watering and ventilation systems in a greenhouse. The device catalog provides a list of certified devices.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, IoT Edge, Device Provisioning Service, Device developer

### Device Provisioning Service

A helper service for [IoT Hub](#iot-hub) and IoT Central that you use to configure zero-touch [device provisioning](#device-provisioning). With the DPS, you can provision millions of [devices](#device) in a secure and scalable manner.

Casing rules: Always capitalized as *Device Provisioning Service*.

First and subsequent mentions: IoT Hub Device Provisioning Service

Abbreviation: DPS

Applies to: Iot Hub, Device Provisioning Service, IoT Central

### Device REST API

A REST API you can use on a [device](#device) to send [device-to-cloud](#device-to-cloud) messages to an [IoT hub](#iot-hub), and receive [cloud-to-device](#cloud-to-device) messages from an IoT hub. Typically, you should use one of the higher-level [Azure IoT device SDKs](#azure-iot-device-sdks).

[Learn more](/rest/api/iothub/device)

Casing rules: Always *device REST API*.

Applies to: Iot Hub

### Device app

A [device](#device) app runs on your device and handles the communication with your [IoT hub](#iot-hub) or IoT Central application. Typically, you use one of the [Azure IoT device SDKs](#azure-iot-device-sdks) when you implement a device app.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Device developer

### Device builder

The person responsible for creating the code to run on your [devices](#device). Device builders typically use one of the [Azure IoT device SDKs](#azure-iot-device-sdks) to implement the device client. A device builder uses a [device model](#device-model) and [interfaces](#interface) when implementing code to run on an [IoT Plug and Play device](#iot-plug-and-play-device).

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, IoT Edge, Device developer

### Device identity

A unique identifier assigned to every [device](#device) registered in the [IoT Hub](#iot-hub) [identity registry](#identity-registry) or in an IoT Central application.

Casing rules: Always lowercase. If you're using the abbreviation, *ID* is all upper case.

Abbreviation: Device ID

Applies to: Iot Hub, IoT Central

### Device management

[Device](#device) management encompasses the full lifecycle associated with managing the devices in your IoT [solution](#solution) including planning, provisioning, configuring, monitoring, and retiring.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central

### Device model

A description, that uses the [Digital Twins Definition Language](#digital-twins-definition-language), of the capabilities of a [device](#device). Capabilities include [telemetry](#telemetry), [properties](#properties), and [commands](#command).

[Learn more](../iot-develop/concepts-modeling-guide.md)

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Device developer, Digital Twins

### Device provisioning

The process of adding the initial [device](#device) data to the stores in your [solution](#solution). To enable a new device to connect to your hub, you must add a device ID and keys to the [IoT Hub](#iot-hub) [identity registry](#identity-registry). The [Device Provisioning Service](#device-provisioning-service) can automatically provision devices in an IoT hub or IoT Central application.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Device Provisioning Service

### Device template

In IoT Central, a [device](#device) template is a blueprint that defines the characteristics and behaviors of a type of device that connects to your application.

For example, the device template can define the [telemetry](#telemetry) that a device sends so that IoT Central can create visualizations that use the correct units and data types. A [device model](#device-model) is part of the device template.

Casing rules: Always lowercase.

Abbreviation: Avoid abbreviating to *template* as IoT Central also has application templates.

Applies to: IoT Central

### Device twin

A [device](#device) twin is JSON document that stores device state information such as metadata, [configurations](#configuration), and conditions. [IoT Hub](#iot-hub) persists a device twin for each device that you provision in your IoT hub. Device twins enable you to synchronize device conditions and configurations between the device and the [solution](#solution) back end. You can query device twins to locate specific devices and for the status of long-running operations.

See also [Digital twin](#digital-twin)

Casing rules: Always lowercase.

Applies to: Iot Hub

### Device-to-cloud

Refers to messages sent from a connected [device](#device) to [IoT Hub](#iot-hub) or IoT Central.

Casing rules: Always lowercase.

Abbreviation: Do not use *D2C*.

Applies to: Iot Hub

### Digital Twins Definition Language

A JSON-LD language for describing [models](#model) and [interfaces](#interface) for [IoT Plug and Play devices](#iot-plug-and-play-device) and [Azure Digital Twins](#azure-digital-twins) entities. The language enables the IoT platform and IoT [solutions](#solution) to use the semantics of the entity.

[Learn more](https://github.com/Azure/opendigitaltwins-dtdl)

First and subsequent mentions: Spell out in full as *Digital Twins Definition Language*.

Abbreviation: DTDL

Applies to: Iot Hub, IoT Central, Digital Twins

### Digital twin

A digital twin is a collection of digital data that represents a physical object. Changes in the physical object are reflected in the digital twin. In some scenarios, you can use the digital twin to manipulate the physical object. The [Azure Digital Twins service](../digital-twins/index.yml) uses [models](#model) expressed in the [Digital Twins Definition Language](#digital-twins-definition-language) to represent digital twins of [physical devices](#physical-device) or higher-level abstract business concepts, enabling a wide range of cloud-based digital twin [solutions](#solution). An [IoT Plug and Play](../iot-develop/index.yml) [device](#device) has a digital twin, described by a Digital Twins Definition Language [device model](#device-model).

See also [Device twin](#device-twin)

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Digital Twins, Device developer

### Digital twin change events

When an [IoT Plug and Play device](#iot-plug-and-play-device) is connected to an [IoT hub](#iot-hub), the hub can use its routing capability to send notifications of [digital twin](#digital-twin) changes. The IoT Central data export feature can also forward digital twin change events to other services. For example, whenever a property value changes on a [device](#device), IoT Hub can send a notification to an [endpoint](#endpoint) such as an event hub.

Casing rules: Always lowercase.

Abbreviation: Always spell out in full to distinguish from other types of change event.

Applies to: Iot Hub, IoT Central

### Digital twin graph

In the [Azure Digital Twins](#azure-digital-twins) service, you can connect [digital twins](#digital-twin) with [relationships](#relationship) to create knowledge graphs that digitally represent your entire physical environment. A single [Azure Digital Twins instance](#azure-digital-twins-instance) can host many disconnected graphs, or one single interconnected graph.

Casing rules: Always lowercase.

First and subsequent mentions: Use *digital twin graph* on first mention, then use *twin graph*.

Applies to: Iot Hub

### Direct method

A way to trigger a method to execute on a [device](#device) by invoking an API on your [IoT hub](#iot-hub).

Casing rules: Always lowercase.

Applies to: Iot Hub

### Downstream service

A relative term describing services that receive data from the current context. For example, in the context of [Azure Digital Twins](#azure-digital-twins), Time Series Insights is a downstream service if you set up your data to flow from Azure [Digital Twins](#digital-twin) into Time Series Insights.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Digital Twins

## E

### Endpoint

A named representation of a data routing service that can receive data from other services.

An [IoT hub](#iot-hub) exposes multiple endpoints that enable your apps to connect to the IoT hub. There are [device](#device)-facing endpoints that enable devices to perform operations such as sending [device-to-cloud](#device-to-cloud) messages. There are service-facing management endpoints that enable [back-end apps](#back-end-app) to perform operations such as [device identity](#device-identity) management. There are service-facing [built-in endpoints](#built-in-endpoints) for reading device-to-cloud messages. You can create [custom endpoints](#custom-endpoints) to receive device-to-cloud messages dispatched by a [routing rule](#routing-rule).

Casing rules: Always lowercase.

Applies to: Iot Hub

### Enrollment

In the [Device Provisioning Service](#device-provisioning-service), an enrollment is the record of individual [devices](#device) or groups of devices that may register with a [linked IoT hub](#linked-iot-hub) through autoprovisioning.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Device Provisioning Service

### Enrollment group

In the [Device Provisioning Service](#device-provisioning-service) and IoT Central, an [enrollment](#enrollment) group identifies a group of [devices](#device) that share an X.509 or symmetric key [attestation mechanism](#attestation-mechanism).

Casing rules: Always lowercase.

Applies to: Iot Hub, Device Provisioning Service, IoT Central

### Event Hubs-compatible endpoint

An [IoT Hub](#iot-hub) [endpoint](#endpoint) that lets you use any Event Hubs-compatible method to read [device](#device) messages sent to the hub. Event Hubs-compatible methods include the [Event Hubs SDKs](../event-hubs/event-hubs-programming-guide.md) and [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md).

Casing rules: Always lowercase.

Applies to: Iot Hub

### Event handler

A process that's triggered by the arrival of an event. For example, you can create event handlers by adding event processing code to an Azure function, and sending data to it using [endpoints](#endpoint) and [event routing](#event-routing).

Casing rules: Always lowercase.

Applies to: Iot Hub

### Event routing

The process of sending events and their data from one [device](#device) or service to the [endpoint](#endpoint) of another.

In [Iot Hub](#iot-hub), you can define [routing rules](#routing-rule) to describe how messages should be sent. In [Azure Digital Twins](#azure-digital-twins), event routes are entities that are created for this purpose. Azure [Digital Twins](#digital-twin) event routes can contain filters to limit what types of events are sent to each endpoint.

Casing rules: Always lowercase.

Applies to: Iot Hub, Digital Twins

## F

### Field gateway

Enables connectivity for [devices](#device) that can't connect directly to [IoT Hub](#iot-hub) and is typically deployed locally with your devices.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central

## G

### Gateway

A gateway enables connectivity for [devices](#device) that cannot connect directly to [IoT Hub](#iot-hub). See also [field gateway](#field-gateway), [cloud gateway](#cloud-gateway), and [custom gateway](#custom-gateway).

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central

### Gateway device

An example of a [field gateway](#field-gateway). A [gateway](#gateway) [device](#device) can be standard IoT device or an [IoT Edge device](#iot-edge-device).

A gateway device enables connectivity for downstream devices that cannot connect directly to [IoT Hub](#iot-hub).

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, IoT Edge

## H

### Hardware security module

Used for secure, hardware-based storage of [device](#device) secrets. It's the most secure form of secret storage for a device. A hardware security [module](#module) can store both X.509 certificates and symmetric keys. In the [Device Provisioning Service](#device-provisioning-service), an [attestation mechanism](#attestation-mechanism) can use a hardware security module.

Casing rules: Always lowercase.

First and subsequent mentions: Spell out in full on first mention as *hardware security module*.

Abbreviation: HSM

Applies to: Iot Hub, Device developer, Device Provisioning Service

## I

### ID scope

A unique value assigned to a [Device Provisioning Service](#device-provisioning-service) instance when it's created.

IoT Central applications make use of DPS instances and make the ID scope available through the IoT Central UI.

Casing rules: Always use *ID scope*.

Applies to: Iot Hub, IoT Central, Device Provisioning Service

### Identity registry

A built-in [component](#component) of an [IoT hub](#iot-hub) that stores information about the individual [devices](#device) permitted to connect to the hub.

Casing rules: Always lowercase.

Applies to: Iot Hub

### Individual enrollment

Identifies a single [device](#device) that the [Device Provisioning Service](#device-provisioning-service) can provision to an [IoT hub](#iot-hub).

Casing rules: Always lowercase.

Applies to: Iot Hub, Device Provisioning Service

### Industry 4.0

Refers to the fourth revolution that's occurred in manufacturing. Companies can build connected [solutions](#solution) to manage the manufacturing facility and equipment more efficiently by enabling manufacturing equipment to be cloud connected, allowing remote access and management from the cloud, and enabling OT personnel to have a single pane view of their entire facility.

Applies to: Iot Hub, IoT Central

### Interface

In IoT Plug and Play, an interface describes related capabilities that are implemented by a [IoT Plug and Play device](#iot-plug-and-play-device) or [digital twin](#digital-twin). You can reuse interfaces across different [device models](#device-model). When an interface is used in a [device](#device) [model](#model), it defines a [component](#component) of the device. A simple device only contains a default interface.

In [Azure Digital Twins](#azure-digital-twins), *interface* may be used to refer to the top-level code item in a [Digital Twins Definition Language](#digital-twins-definition-language) model definition.

Casing rules: Always lowercase.

Applies to: Device developer, Digital Twins

### IoT Edge

A service and related client libraries and runtime that enables cloud-driven deployment of Azure services and [solution](#solution)-specific code to on-premises [devices](#device). [IoT Edge devices](#iot-edge-device) can aggregate data from other devices to perform computing and analytics before sending the data to the cloud.

[Learn more](../iot-edge/index.yml)

Casing rules: Always capitalize as *IoT Edge*.

First and subsequent mentions: Spell out as *Azure IoT Edge*.

Applies to: IoT Edge

### IoT Edge agent

The part of the [IoT Edge runtime](#iot-edge-runtime) responsible for deploying and monitoring [modules](#module).

Casing rules: Always capitalize as *IoT Edge agent*.

Applies to: IoT Edge

### IoT Edge device

A [device](#device) that uses containerized [IoT Edge](#iot-edge) [modules](#module) to run Azure services, third-party services, or your own code. On the device, the [IoT Edge runtime](#iot-edge-runtime) manages the modules. You can remotely monitor and manage an IoT Edge device from the cloud.

Casing rules: Always capitalize as *IoT Edge device*.

Applies to: IoT Edge

### IoT Edge hub

The part of the [IoT Edge runtime](#iot-edge-runtime) responsible for [module](#module) to module, upstream, and downstream communications.

Casing rules: Always capitalize as *IoT Edge hub*.

Applies to: IoT Edge

### IoT Edge runtime

Includes everything that Microsoft distributes to be installed on an [IoT Edge device](#iot-edge-device). It includes Edge agent, Edge hub, and the [IoT Edge](#iot-edge) security daemon.

Casing rules: Always capitalize as *IoT Edge runtime*.

Applies to: IoT Edge

### IoT Hub

A fully managed Azure service that enables reliable and secure bidirectional communications between millions of [devices](#device) and a [solution](#solution) back end. For more information, see [What is Azure IoT Hub?](../iot-hub/about-iot-hub.md). Using your Azure subscription, you can create IoT hubs to handle your IoT messaging workloads.

[Learn more](../iot-hub/about-iot-hub.md)

Casing rules: When referring to the service, capitalize as *IoT Hub*. When referring to an instance, capitalize as *IoT hub*.

First and subsequent mentions: Spell out in full as *Azure IoT Hub*. Subsequent mentions can be *IoT Hub*. If the context is clear, use *hub* to refer to an instance.

Example usage: The Azure IoT Hub service enables secure, bidirectional communication. The device sends data to your IoT hub.

Applies to: Iot Hub

### IoT Hub Resource REST API

An API you can use to manage the [IoT hubs](#iot-hub) in your Azure subscription with operations such as creating, updating, and deleting hubs.

Casing rules: Always capitalize as *IoT Hub Resource REST API*.

Applies to: Iot Hub

### IoT Hub metrics

A feature in the Azure portal that lets you monitor the state of your [IoT hubs](#iot-hub). IoT Hub metrics enable you to assess the overall health of an IoT hub and the [devices](#device) connected to it.

Casing rules: Always capitalize as *IoT Hub metrics*.

Applies to: Iot Hub

### IoT Hub query language

A SQL-like language for [IoT Hub](#iot-hub) that lets you query your [jobs](#job), [digital twins](#digital-twin), and [device twins](#device-twin).

Casing rules: Always capitalize as *IoT Hub query language*.

First and subsequent mentions: Spell out in full as *IoT Hub query language*, if the context is clear subsequent mentions can be *query language*.

Applies to: Iot Hub

### IoT Plug and Play bridge

An open-source application that enables existing sensors and peripherals attached to Windows or Linux [gateways](#gateway) to connect as [IoT Plug and Play devices](#iot-plug-and-play-device).

Casing rules: Always capitalize as *IoT Plug and Play bridge*.

First and subsequent mentions: Spell out in full as *IoT Plug and Play bridge*. If the context is clear, subsequent mentions can be *bridge*.

Applies to: Iot Hub, Device developer, IoT Central

### IoT Plug and Play conventions

A set of conventions that IoT [devices](#device) should follow when they exchange data with a [solution](#solution).

Casing rules: Always capitalize as *IoT Plug and Play conventions*.

Applies to: Iot Hub, IoT Central, Device developer

### IoT Plug and Play device

Typically a small-scale, standalone computing [device](#device) that collects data or controls other devices, and that runs software or firmware that implements a [device model](#device-model). For example, an IoT Plug and Play device might be an environmental monitoring device, or a controller for a smart-agriculture irrigation system. An IoT Plug and Play device might be implemented directly or as an [IoT Edge](#iot-edge) [module](#module).

Casing rules: Always capitalize as *IoT Plug and Play device*.

Applies to: Iot Hub, IoT Central, Device developer

### IoT extension for Azure CLI

An extension for the Azure CLI. The extension lets you complete tasks such as managing your [devices](#device) in the [identity registry](#identity-registry), sending and receiving device messages, and monitoring your [IoT hub](#iot-hub) operations.

[Learn more](/cli/azure/azure-cli-reference-for-IoT)

Casing rules: Always capitalize as *IoT extension for Azure CLI*.

Applies to: Iot Hub, IoT Central, IoT Edge, Device Provisioning Service, Device developer

## J

### Job

In the context of [IoT Hub](#iot-hub), jobs let you schedule and track activities on a set of [devices](#device) registered with your IoT hub. Activities include updating [device twin](#device-twin) [desired properties](#desired-properties), updating device twin [tags](#tag), and invoking [direct methods](#direct-method). IoT Hub also uses jobs to import to and export from the [identity registry](#identity-registry).

In the context of IoT Central, jobs let you manage your connected devices in bulk by setting [properties](#properties) and calling [commands](#command). IoT Central jobs also let you update cloud properties in bulk.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central

## L

### Leaf device

A [device](#device) with no downstream devices connected. Typically leaf devices are connected to a [gateway device](#gateway-device).

Casing rules: Always lowercase.

Applies to: IoT Edge, IoT Central, Device developer

### Lifecycle event

In [Azure Digital Twins](#azure-digital-twins), this type of event is fired when a data item—such as a [digital twin](#digital-twin), a [relationship](#relationship), or an [event handler](#event-handler) is created or deleted from your [Azure Digital Twins instance](#azure-digital-twins-instance).

Casing rules: Always lowercase.

Applies to: Digital Twins, Iot Hub, IoT Central

### Linked IoT hub

An [IoT hub](#iot-hub) that is linked to a [Device Provisioning Service](#device-provisioning-service) instance. A DPS instance can register a [device](#device) ID and set the initial [configuration](#configuration) in the [device twins](#device-twin) in linked IoT hubs.

Casing rules: Always capitalize as *linked IoT hub*.

Applies to: Iot Hub, Device Provisioning Service

## M

### MQTT

One of the messaging protocols that [IoT Hub](#iot-hub) and IoT Central support for communicating with [devices](#device). MQTT doesn't stand for anything.

[Learn more](../iot-hub/iot-hub-devguide-protocols.md)

First and subsequent mentions: MQTT

Abbreviation: MQTT

Applies to: Iot Hub, IoT Central, Device developer

### Model

A definition of a type of entity in your physical environment, including its [properties](#properties), telemetries, and [components](#component). Models are used to create [digital twins](#digital-twin) that represent specific physical objects of this type. Models are written in the [Digital Twins Definition Language](#digital-twins-definition-language).

In the [Azure Digital Twins](#azure-digital-twins) service, models define [devices](#device) or higher-level abstract business concepts. In IoT Plug and Play, [device models](#device-model) describe devices specifically.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Digital Twins, Device developer

### Model ID

When an [IoT Plug and Play device](#iot-plug-and-play-device) connects to an [IoT Hub](#iot-hub) or IoT Central application, it sends the [model](#model) ID of the [Digital Twins Definition Language](#digital-twins-definition-language) model it implements. Every model as a unique model ID. This model ID enables the [solution](#solution) to find the [device model](#device-model).

Casing rules: Always capitalize as *model ID*.

Applies to: Iot Hub, IoT Central, Device developer, Digital Twins

### Model repository

Stores [Digital Twins Definition Language](#digital-twins-definition-language) [models](#model) and [interfaces](#interface). A [solution](#solution) uses a [model ID](#model-id) to retrieve a model from a repository.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Digital Twins

### Model repository REST API

An API for managing and interacting with a [model repository](#model-repository). For example, you can use the API to add and search for [device models](#device-model).

Casing rules: Always capitalize as *model repository REST API*.

Applies to: Iot Hub, IoT Central, Digital Twins

### Module

The [IoT Hub](#iot-hub) [device](#device) SDKs let you instantiate modules where each one opens an independent connection to your IoT hub. This lets you use separate namespaces for different [components](#component) on your device.

[Module identity](#module-identity) and [module twin](#module-twin) provide the same capabilities as [device identity](#device-identity) and [device twin](#device-twin) but at a finer granularity.

In [IoT Edge](#iot-edge), a module is a Docker container that you can deploy to [IoT Edge devices](#iot-edge-device). It performs a specific task, such as ingesting a message from a device, transforming a message, or sending a message to an IoT hub. It communicates with other modules and sends data to the [IoT Edge runtime](#iot-edge-runtime).

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Edge, Device developer

### Module identity

A unique identifier assigned to every [module](#module) that belongs to a [device](#device). Module identities are also registered in the [identity registry](#identity-registry).

The module identity details the security credentials the module uses to authenticate with the [IoT Hub](#iot-hub) or, in the case of an [IoT Edge](#iot-edge) module to the [IoT Edge hub](#iot-edge-hub).

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Edge, Device developer

### Module image

The docker image the [IoT Edge runtime](#iot-edge-runtime) uses to instantiate [module](#module) instances.

Casing rules: Always lowercase.

Applies to: IoT Edge

### Module twin

Similar to [device twin](#device-twin), a [module](#module) twin is JSON document that stores module state information such as metadata, [configurations](#configuration), and conditions. [IoT Hub](#iot-hub) persists a module twin for each [module identity](#module-identity) that you provision under a [device identity](#device-identity) in your IoT hub. Module twins enable you to synchronize module conditions and configurations between the module and the [solution](#solution) back end. You can query module twins to locate specific modules and query the status of long-running operations.

Casing rules: Always lowercase.

Applies to: Iot Hub

## O

### Ontology

In the context of [Digital Twins](#digital-twin), a set of [models](#model) for a particular domain, such as real estate, smart cities, IoT systems, energy grids, and more. Ontologies are often used as schemas for knowledge graphs like the ones in [Azure Digital Twins](#azure-digital-twins), because they provide a starting point based on industry standards and best practices.

[Learn more](../digital-twins/concepts-ontologies.md)

Applies to: Digital Twins

### Operational technology

That hardware and software in an industrial facility that monitors and controls equipment, processes, and infrastructure.

Casing rules: Always lowercase.

Abbreviation: OT

Applies to: Iot Hub, IoT Central, IoT Edge

### Operations monitoring

A feature of [IoT Hub](#iot-hub) that lets you monitor the status of operations on your IoT hub in real time. IoT Hub tracks events across several categories of operations. You can opt into sending events from one or more categories to an IoT Hub [endpoint](#endpoint) for processing. You can monitor the data for errors or set up more complex processing based on data patterns.

Casing rules: Always lowercase.

Applies to: Iot Hub

## P

### Physical device

A real IoT [device](#device) that connects to an [IoT hub](#iot-hub). For convenience, many tutorials and quickstarts run IoT device code on a desktop machine rather than a physical device.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Device developer, IoT Edge

### Primary and secondary keys

When you connect to a [device](#device)-facing or service-facing [endpoint](#endpoint) on an [IoT hub](#iot-hub) or IoT Central application, your [connection string](#connection-string) includes key to grant you access. When you add a device to the [identity registry](#identity-registry) or add a [shared access policy](#shared-access-policy) to your hub, the service generates a primary and secondary key. Having two keys enables you to roll over from one key to another when you update a key without losing access to the IoT hub or IoT Central application.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central

### Properties

In the context of a [digital twin](#digital-twin), data fields defined in an [interface](#interface) that represent some persistent state of the digital twin. You can declare properties as read-only or writable. Read-only properties, such as serial number, are set by code running on the [IoT Plug and Play device](#iot-plug-and-play-device) itself. Writable properties, such as an alarm threshold, are typically set from the cloud-based IoT [solution](#solution).

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Digital Twins, Device developer

### Property change event

An event that results from a property change in a [digital twin](#digital-twin).

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Digital Twins

### Protocol gateway

A [gateway](#gateway) typically deployed in the cloud to provide protocol translation services for [devices](#device) connecting to an [IoT hub](#iot-hub) or IoT Central application.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central

## R

### Registration

A record of a [device](#device) in the [IoT Hub](#iot-hub) [identity registry](#identity-registry). You can register or device directly, or use the [Device Provisioning Service](#device-provisioning-service) to automate device registration.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Device Provisioning Service

### Registration ID

A unique [device identity](#device-identity) in the [Device Provisioning Service](#device-provisioning-service). The [registration](#registration) ID may be the same value as the [device](#device) identity.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Device Provisioning Service

### Relationship

Used in the [Azure Digital Twins](#azure-digital-twins) service to connect [digital twins](#digital-twin) into knowledge graphs that digitally represent your entire physical environment. The types of relationships that your twins can have are defined in the [Digital Twins Definition Language](#digital-twins-definition-language) [model](#model).

Casing rules: Always lowercase.

Applies to: Digital Twins

### Reported configuration

In the context of a [device twin](#device-twin), this refers to the complete set of [properties](#properties) and metadata in the [device](#device) twin that are reported to the [solution](#solution) back end.

Casing rules: Always lowercase.

Applies to: Iot Hub, Device developer

### Reported properties

In the context of a [device twin](#device-twin), reported [properties](#properties) is a subsection of the [device](#device) twin. Reported properties can only be set by the device but can be read and queried by a [back-end app](#back-end-app).

Casing rules: Always lowercase.

Applies to: Iot Hub, Device developer

### Retry policy

A way to handle transient errors when you connect to a cloud service.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Device developer

### Routing rule

A feature of [IoT Hub](#iot-hub) used to route [device-to-cloud](#device-to-cloud) messages to a built-in [endpoint](#endpoint) or to [custom endpoints](#custom-endpoints) for processing by your [solution](#solution) back end.

Casing rules: Always lowercase.

Applies to: Iot Hub

## S

### SASL/PLAIN

A protocol that [Advanced Message Queueing Protocol](#advanced-message-queueing-protocol) uses to transfer security tokens.

[Learn more](https://wikipedia.org/wiki/Simple_Authentication_and_Security_Layer)

Abbreviation: SASL/PLAIN

Applies to: Iot Hub

### Service REST API

A REST API you can use from the [solution](#solution) back end to manage your [devices](#device). For example, you can use the [Iot Hub](#iot-hub) service API to retrieve and update [device twin](#device-twin) [properties](#properties), invoke [direct methods](#direct-method), and schedule [jobs](#job). Typically, you should use one of the higher-level service SDKs.

Casing rules: Always *service REST API*.

Applies to: Iot Hub, IoT Central, Device Provisioning Service, IoT Edge

### Service operations endpoint

An [endpoint](#endpoint) that an administrator uses to manage service settings. For example, in the [Device Provisioning Service](#device-provisioning-service) you use the service endpoint to manage [enrollments](#enrollment).

Casing rules: Always lowercase.

Applies to: Iot Hub, Device Provisioning Service, IoT Edge, Digital Twins

### Shared access policy

A way to define the permissions granted to anyone who has a valid primary or secondary key associated with that policy. You can manage the shared access policies and keys for your hub in the portal.

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Edge, Device Provisioning Service

### Shared access signature

A shared access signature is a signed URI that points to one or more resources such as an [IoT hub](#iot-hub) [endpoint](#endpoint). The URI includes a token that indicates how the resources can be accessed by the client. One of the query parameters, the signature, is constructed from the SAS parameters and signed with the key that was used to create the SAS. This signature is used by Azure Storage to authorize access to the storage resource.

Casing rules: Always lowercase.

Abbreviation: SAS

Applies to: Iot Hub, Digital Twins, IoT Central, IoT Edge

### Simulated device

For convenience, many of the tutorials and quickstarts run [device](#device) code with simulated sensors on your local development machine. In contrast, a [physical device](#physical-device) such as an MXCHIP has real sensors and connects to an [IoT hub](#iot-hub).

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Device developer, IoT Edge, Digital Twins, Device Provisioning Service

### Solution

In the context of IoT, *solution* typically refers to an IoT solution that includes elements such as [devices](#device), [device apps](#device-app), an [IoT hub](#iot-hub), other Azure services, and [back-end apps](#back-end-app).

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Device Provisioning Service, IoT Edge, Digital Twins

### System properties

In the context of a [device twin](#device-twin), the read-only [properties](#properties) that include information regarding the [device](#device) usage such as last activity time and connection state.

Casing rules: Always lowercase.

Applies to: Iot Hub

## T

### Tag

In the context of a [device twin](#device-twin), tags are [device](#device) metadata stored and retrieved by the [solution](#solution) back end in the form of a JSON document. Tags are not visible to apps on a device.

Casing rules: Always lowercase.

Applies to: Iot Hub

### Target condition

In an [IoT Edge](#iot-edge) deployment, the target condition selects the target [devices](#device) of the deployment. The target condition is continuously evaluated to include any new devices that meet the requirements or remove devices that no longer do.

Casing rules: Always lowercase.

Applies to: IoT Edge

### Telemetry

The data, such as wind speed or temperature, sent to an [IoT hub](#iot-hub) that was collected by a [device](#device) from its sensors.

Unlike [properties](#properties), telemetry is not stored on a [digital twin](#digital-twin); it is a stream of time-bound data events that need to be handled as they occur.

In IoT Plug and Play and [Azure Digital Twins](#azure-digital-twins), telemetry fields defined in an [interface](#interface) represent measurements. These measurements are typically values such as sensor readings that are sent by devices, like [IoT Plug and Play devices](#iot-plug-and-play-device), as a stream of data.

Casing rules: Always lowercase.

Example usage: Don't use the word *telemetries*, telemetry refers to the collection of data a device sends. For example: When the device connects to your IoT hub, it starts sending telemetry. One of the telemetry values the device sends is the environmental temperature.


Applies to: Iot Hub, IoT Central, Digital Twins, IoT Edge, Device developer

### Telemetry event

An event in an [IoT hub](#iot-hub) that indicates the arrival of [telemetry](#telemetry) data.

Casing rules: Always lowercase.

Applies to: Iot Hub

### Twin queries

A feature of [IoT Hub](#iot-hub) that lets you use a SQL-like query language to retrieve information from your [device twins](#device-twin) or [module twins](#module-twin).

Casing rules: Always lowercase.

Applies to: Iot Hub

### Twin synchronization

The process in [IoT Hub](#iot-hub) that uses the [desired properties](#desired-properties) in your [device twins](#device-twin) or [module twins](#module-twin) to configure your [devices](#device) or [modules](#module) and retrieve [reported properties](#reported-properties) from them to store in the twin.

Casing rules: Always lowercase.

Applies to: Iot Hub

## U

### Upstream service

A relative term describing services that feed data into the current context. For instance, in the context of [Azure Digital Twins](#azure-digital-twins), [IoT Hub](#iot-hub) is considered an upstream service because data flows from IoT Hub into Azure [Digital Twins](#digital-twin).

Casing rules: Always lowercase.

Applies to: Iot Hub, IoT Central, Digital Twins

