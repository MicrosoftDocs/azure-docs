---
title: Azure IoT glossary of terms | Microsoft Docs
description: Developer guide - a glossary explaining some of the common terms used in the Azure IoT articles.
author: dominicbetts
ms.author: dobett
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 03/08/2021
---

# Glossary of IoT terms

This article lists some of the common terms used in the IoT articles.

## A

### Advanced Message Queueing Protocol

[Advanced Message Queueing Protocol (AMQP)](https://www.amqp.org/) is one of the messaging protocols that [IoT Hub](#iot-hub) supports for communicating with devices. For more information about the messaging protocols that IoT Hub supports, see [Send and receive messages with IoT Hub](../iot-hub/iot-hub-devguide-messaging.md).

### Allocation policy

In the [Device Provisioning Service](#device-provisioning-service), the allocation policy determines how the service assigns devices to [Linked IoT hubs](#linked-iot-hub).

### Attestation mechanism

In the [Device Provisioning Service](#device-provisioning-service), the attestation mechanism is the method used for confirming a device's identity. The attestation mechanism is configured on an [enrollment](#enrollment).

Attestation mechanisms include X.509 certificates, Trusted Platform Modules, and symmetric keys.

### Automatic deployment

In IoT Edge, an automatic deployment configures a target set of IoT Edge devices to run a set of IoT Edge modules. Each deployment continuously ensures that all devices that match its target condition are running the specified set of modules, even when new devices are created or are modified to match the target condition. Each IoT Edge device only receives the highest priority deployment whose target condition it meets. Learn more about [IoT Edge automatic deployment](../iot-edge/module-deployment-monitoring.md).

### Automatic device configuration

Your solution back end can use [automatic device configurations](../iot-hub/iot-hub-automatic-device-management.md) to assign desired properties to a set of [device twins](#device-twin) and report status using system metrics and custom metrics.

### Automatic device management

Automatic device management in Azure IoT Hub automates many of the repetitive and complex tasks of managing large device fleets over the entirety of their lifecycles. With Automatic Device Management, you can target a set of devices based on their properties, define a desired configuration, and let IoT Hub update devices whenever they come into scope.  Consists of [automatic device configurations](../iot-hub/iot-hub-automatic-device-management.md) and [IoT Edge automatic deployments](../iot-edge/how-to-deploy-at-scale.md).

### Azure Digital Twins

Azure Digital Twins is a platform as a service (PaaS) offering for creating digital representations of real-world things, places, business processes, and people. Build knowledge graphs that represent entire environments, and use them to gain insights to drive better products, optimize operations and costs, and create breakthrough customer experiences. To learn more, see [Azure Digital Twins](../digital-twins/index.yml).

### Azure Digital Twins instance

A single instance of the Azure Digital Twins service in a customer's subscription. While [Azure Digital Twins](#azure-digital-twins) refers to the Azure service as a whole, your Azure Digital Twins **instance** is your individual Azure Digital Twins resource.

### Azure IoT device SDKs

There are _device SDKs_ available for multiple languages that enable you to create [device apps](#device-app) that interact with an IoT hub. The IoT Hub tutorials show you how to use these device SDKs. You can find the source code and further information about the device SDKs in this GitHub [repository](https://github.com/Azure/azure-iot-sdks).

### Azure IoT Explorer

The [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer) is used to view the telemetry the device is sending, work with device properties, and call commands. You can also use the explorer to interact with and test your devices, and to manage [IoT Plug and Play devices](#iot-plug-and-play-device).

### Azure IoT service SDKs

There are _service SDKs_ available for multiple languages that enable you to create [back-end apps](#back-end-app) that interact with an IoT hub. The IoT Hub tutorials show you how to use these service SDKs. You can find the source code and further information about the service SDKs in this GitHub [repository](https://github.com/Azure/azure-iot-sdks).

### Azure IoT Tools

The [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) is a cross-platform, open-source Visual Studio Code extension that helps you manage Azure IoT Hub and devices in VS Code. With Azure IoT Tools, IoT developers could develop IoT project in VS Code with ease.

## B

### Back-end app

In the context of [IoT Hub](#iot-hub), a back-end app is an app that connects to one of the service-facing endpoints on an IoT hub. For example, a back-end app might retrieve [device-to-cloud](#device-to-cloud) messages or manage the [identity registry](#identity-registry). Typically, a back-end app runs in the cloud, but in many of the tutorials the back-end apps are console apps running on your local development machine.

### Built-in endpoints

A type of [endpoint](#endpoint) that is built into IoT Hub. Every IoT hub includes a built-in [endpoint](../iot-hub/iot-hub-devguide-endpoints.md) that is Event Hub-compatible. You can use any mechanism that works with Event Hubs to read device-to-cloud messages from this endpoint.

## C

### Cloud gateway

A cloud gateway enables connectivity for devices that cannot connect directly to [IoT Hub](#iot-hub). A cloud gateway is hosted in the cloud in contrast to a [field gateway](#field-gateway) that runs local to your devices. A typical use case for a cloud gateway is to implement protocol translation for your devices.

### Cloud-to-device

Refers to messages sent from an IoT hub to a connected device. Often, these messages are commands that instruct the device to take an action. For more information, see [Send and receive messages with IoT Hub](../iot-hub/iot-hub-devguide-messaging.md).

### Commands

In IoT Plug and Play, commands defined in an [interface](#interface) represent methods that can be executed on the [digital twin](#digital-twin). For example, a command to reboot a device.

### Component

In IoT Plug and Play and Azure Digital Twins, components let you build a model [interface](#interface) as an assembly of other interfaces. A [device model](#device-model) can combine multiple interfaces as components. For example, a model might include a switch component and thermostat component. Multiple components in a model can also use the same interface type. For example, a model might include two thermostat components.

### Configuration

In the context of [automatic device configuration](../iot-hub/iot-hub-automatic-device-management.md), a configuration within IoT Hub defines the desired configuration for a set of devices twins and provides a set of metrics to report status and progress.

### Connection string

You use connection strings in your app code to encapsulate the information required to connect to an endpoint. A connection string typically includes the address of the endpoint and security information, but connection string formats vary across services. There are two types of connection string associated with the IoT Hub service:

- *Device connection strings* enable devices to connect to the device-facing endpoints on an IoT hub.

- *IoT Hub connection strings* enable back-end apps to connect to the service-facing endpoints on an IoT hub.

### Custom endpoints

You can create custom [endpoints](../iot-hub/iot-hub-devguide-endpoints.md) on an IoT hub to deliver messages dispatched by a [routing rule](#routing-rules). Custom endpoints connect directly to an Event hub, a Service Bus queue, or a Service Bus topic.

### Custom gateway

A gateway enables connectivity for devices that cannot connect directly to [IoT Hub](#iot-hub). You can use Azure IoT Edge to build custom gateways that implement custom logic to handle messages, custom protocol conversions, and other processing on the edge.

## D

### Data-point message

A data-point message is a [device-to-cloud](#device-to-cloud) message that contains [telemetry](#telemetry) data such as wind speed or temperature.

### Default component

In IoT Plug and Play, all [device models](#device-model) have a default component. A simple device model only has a default component - such a model is also known as a no component device. A more complex model has multiple components nested underneath the default component.

### Deployment manifest

In [IoT Edge](#iot-edge), the deployment manifest is a JSON document containing the information to be copied in one or more IoT Edge devices' module twin(s) to deploy a set of modules, routes, and associated module desired properties.

### Desired configuration

In the context of a [device twin](../iot-hub/iot-hub-devguide-device-twins.md), desired configuration refers to the complete set of properties and metadata in the device twin that should be synchronized with the device.

### Desired properties

In the context of a [device twin](../iot-hub/iot-hub-devguide-device-twins.md), desired properties is a subsection of the device twin that is used with [reported properties](#reported-properties) to synchronize device configuration or condition. Desired properties can only be set by a [back-end app](#back-end-app) and are observed by the [device app](#device-app).

### Device

In the context of IoT, a device is typically a small-scale, standalone computing device that may collect data or control other devices. For example, a device might be an environmental monitoring device, or a controller for the watering and ventilation systems in a greenhouse. The [device catalog](https://catalog.azureiotsolutions.com/) provides a list of hardware devices certified to work with [IoT Hub](#iot-hub).

### Device app

A device app runs on your [device](#device) and handles the communication with your [IoT hub](#iot-hub). Typically, you use one of the [Azure IoT device SDKs](#azure-iot-device-sdks) when you implement a device app. In many of the IoT tutorials, you use a [simulated device](#simulated-device) for convenience.

### Device builder

A device builder uses a [device model](#device-model) and [interfaces](#interface) when implementing code to run on an [IoT Plug and Play device](#iot-plug-and-play-device). Device builders typically use one of the [Azure IoT device SDKs](#azure-iot-device-sdks) to implement the device client.

### Device certification

The IoT Plug and Play device certification program verifies that a device meets the IoT Plug and Play certification requirements. You can add a certified device to the public [Certified for Azure IoT device catalog](https://aka.ms/devicecatalog).

### Device condition

Refers to device state information, such as the connectivity method currently in use, as reported by a [device app](#device-app). [Device apps](#device-app) can also report their capabilities. You can query for condition and capability information using device twins.

### Device data

Device data refers to the per-device data stored in the IoT Hub [identity registry](#identity-registry). It is possible to import and export this data.

### Device identity

The device identity (or device ID) is the unique identifier assigned to every device registered in the IoT Hub [identity registry](#identity-registry).

### Device management

Device management encompasses the full lifecycle associated with managing the devices in your IoT solution including planning, provisioning, configuring, monitoring, and retiring.

### Device management patterns

[IoT hub](#iot-hub) enables common device management patterns including rebooting, performing factory resets, and performing firmware updates on your devices.

### Device model

A device model is a type of [model](#model) that uses the [Digital Twins Definition Language](#digital-twins-definition-language-dtdl) to describe the capabilities of an IoT Plug and Play device. A simple device model uses a single interface to describe the device capabilities. A more complex device model includes multiple components, each of which describe a set of capabilities. To learn more, see [IoT Plug and Play components in models](../iot-pnp/concepts-components.md).

### Device modeling

A [device builder](#device-builder) or [module builder](#module-builder)uses the [Digital Twins Definition Language](#digital-twins-definition-language-dtdl) to model the capabilities of an [IoT Plug and Play device](#iot-plug-and-play-device). A [solution builder](#solution-builder) can configure an IoT solution from the model.

### Device provisioning

Device provisioning is the process of adding the initial [device data](#device-data) to the stores in your solution. To enable a new device to connect to your hub, you must add a device ID and keys to the IoT Hub [identity registry](#identity-registry). As part of the provisioning process, you might need to initialize device-specific data in other solution stores.

### Device Provisioning Service

IoT Hub Device Provisioning Service (DPS) is a helper service for [IoT Hub](#iot-hub) that you use to configure zero-touch device provisioning to a specified IoT hub. With the DPS, you can provision millions of devices in a secure and scalable manner.

### Device REST API

You can use the [Device REST API](/rest/api/iothub/device) from a device to send device-to-cloud messages to an IoT hub, and receive [cloud-to-device](#cloud-to-device) messages from an IoT hub. Typically, you should use one of the higher-level [device SDKs](#azure-iot-device-sdks) as shown in the IoT Hub tutorials.

### Device twin

A device twin is JSON document that stores device state information such as metadata, configurations, and conditions. IoT Hub persists a device twin for each device that you provision in your IoT hub. Device twins enable you to synchronize device conditions and configurations between the device and the solution back end. You can query device twins to locate specific devices and for the status of long-running operations.

### Device-to-cloud

Refers to messages sent from a connected device to [IoT Hub](#iot-hub). These messages may be [data-point](#data-point-message) or [interactive](#interactive-message) messages. For more information, see [Send and receive messages with IoT Hub](../iot-hub/iot-hub-devguide-messaging.md).

### Digital twin

A digital twin is a collection of digital data that represents a physical object. Changes in the physical object are reflected in the digital twin. In some scenarios, you can use the digital twin to manipulate the physical object. The [Azure Digital Twins service](../digital-twins/index.yml) uses [models](#model) expressed in the [Digital Twins Definition Language (DTDL)](#digital-twins-definition-language-dtdl) to represent digital twins of physical devices or higher-level abstract business concepts, enabling a wide range of cloud-based digital twin solutions. An [IoT Plug and Play](../iot-pnp/index.yml) device has a digital twin, described by a DTDL [device model](#device-model).

### Digital twin change events

When an [IoT Plug and Play device](#iot-plug-and-play-device) is connected to an IoT hub, the hub can use its routing capability to send notifications of digital twin changes. For example, whenever a [property](#properties) value changes on a device, IoT Hub can send a notification to an endpoint such as an Event hub.

### Digital twin route

A route set up in an IoT hub to deliver [digital twin change events](#digital-twin-change-events) to an endpoint such as an Event hub.

### Digital Twins Definition Language (DTDL)

A JSON-LD language for describing [models](#model) and [interfaces](#interface) for [IoT Plug and Play devices](#iot-plug-and-play-device) and [Azure Digital Twins](../digital-twins/index.yml) entities. Use the [Digital Twins Definition Language version 2](https://github.com/Azure/opendigitaltwins-dtdl) to describe a [digital twin's](#digital-twin) capabilities and enable the IoT platform and IoT solutions to use the semantics of the entity. Digital Twins Definition Language is often abbreviated as DTDL.

### Direct method

A [direct method](../iot-hub/iot-hub-devguide-direct-methods.md) is a way for you to trigger a method to execute on a device by invoking an API on your IoT hub.

### Downstream services

A relative term describing services that receive data from the current context. For instance, if you're thinking in the context of Azure Digital Twins, [Time Series Insights](../time-series-insights/index.yml) would be considered a downstream service if you set up your data to flow from Azure Digital Twins into Time Series Insights.

## E

### Endpoint

A named representation of a data routing service that can receive data from other services.

An IoT hub exposes multiple [endpoints](../iot-hub/iot-hub-devguide-endpoints.md) that enable your apps to connect to the IoT hub. There are device-facing endpoints that enable devices to perform operations such as sending [device-to-cloud](#device-to-cloud) messages and receiving [cloud-to-device](#cloud-to-device) messages. There are service-facing management endpoints that enable [back-end apps](#back-end-app) to perform operations such as [device identity](#device-identity) management and device twin management. There are service-facing [built-in endpoints](#built-in-endpoints) for reading device-to-cloud messages. You can create [custom endpoints](#custom-endpoints) to receive device-to-cloud messages dispatched by a [routing rule](#routing-rules).

### Enrollment

In the [Device Provisioning Service](#device-provisioning-service), an enrollment is the record of individual devices or groups of devices that may register with a [Linked IoT hub](#linked-iot-hub) through autoprovisioning.

### Enrollment group

In the [Device Provisioning Service](#device-provisioning-service), an enrollment group identifies a group of devices that share an X.509 or symmetric key [attestation mechanism](#attestation-mechanism).

### Event handlers

This can refer to any process that is triggered by the arrival of an event and does some processing action. One way to create event handlers is by adding event processing code to an Azure function, and sending data through it using [endpoints](#endpoint) and [event routing](#event-routing).

### Event Hub-compatible endpoint

To read [device-to-cloud](#device-to-cloud) messages sent to your IoT hub, you can connect to an endpoint on your hub and use any Event Hub-compatible method to read those messages. Event Hub-compatible methods include using the [Event Hubs SDKs](../event-hubs/event-hubs-programming-guide.md) and [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md).

### Event routing

The process of sending events and their data from one device or service to the [endpoint](#endpoint) of another. 

In Iot Hub, you can define [routing rules](#routing-rules) to describe how messages should be sent. In Azure Digital Twins, event routes are entities that are created for this purpose. Azure Digital Twins event routes can contain filters to limit what types of events are sent to each endpoint.

## F

### Field gateway

A field gateway enables connectivity for devices that cannot connect directly to [IoT Hub](#iot-hub) and is typically deployed locally with your devices. For more information, see [What is Azure IoT Hub?](../iot-hub/about-iot-hub.md).

## G

### Gateway

A gateway enables connectivity for devices that cannot connect directly to [IoT Hub](#iot-hub). See also [Field Gateway](#field-gateway), [Cloud Gateway](#cloud-gateway), and [Custom Gateway](#custom-gateway).

### Gateway device

A device is an example of a [field Gateway](#field-gateway). A gateway device could be standard IoT [device](#device) or an [IoT Edge device](#iot-edge-device).

A gateway device enables connectivity for downstream devices that cannot connect directly to [IoT Hub](#iot-hub).

## H

### Hardware security module

A hardware security module (HSM) is used for secure, hardware-based storage of device secrets. It is the most secure form of secret storage for a device. Both X.509 certificates and symmetric keys can be stored in an HSM. In the [Device Provisioning Service](#device-provisioning-service), an [attestation mechanism](#attestation-mechanism) can use an HSM.

## I

### ID scope

The ID scope is unique value assigned to a [Device Provisioning Service (DPS)](#device-provisioning-service) instance when it's created.

IoT Central applications make use of DPS instances and make the ID Scope available through the IoT Central UI.

### Identity registry

The [identity registry](../iot-hub/iot-hub-devguide-identity-registry.md) is the built-in component of an IoT hub that stores information about the individual devices permitted to connect to an IoT hub.

### Individual enrollment

In the [Device Provisioning Service](#device-provisioning-service), an individual enrollment identifies a single device that uses an X.509 leaf certificate or symmetric key as an [attestation mechanism](#attestation-mechanism).

### Interactive message

An interactive message is a [cloud-to-device](#cloud-to-device) message that triggers an immediate action in the solution back end. For example, a device might send an alarm about a failure that should be automatically logged in to a CRM system.

### Interface

In IoT Plug and Play, an interface describes related capabilities that are implemented by a [IoT Plug and Play device](#iot-plug-and-play-device) or [digital twin](#digital-twin). You can reuse interfaces across different [device models](#device-model). When an interface is used in a device model, it defines a [component](#component) of the device. A simple device only contains a default interface.

In Azure Digital Twins, *interface* may be used to refer to the top-level code item in a [DTDL](#digital-twins-definition-language-dtdl) model definition.

### IoT Edge

Azure IoT Edge enables cloud-driven deployment of Azure services and solution-specific code to on-premises devices. [IoT Edge devices](#iot-edge-device) can aggregate data from other devices to perform computing and analytics before sending the data to the cloud. To learn more, see [Azure IoT Edge](../iot-edge/index.yml).

### IoT Edge agent

The part of the IoT Edge runtime responsible for deploying and monitoring modules.

### IoT Edge device

An IoT Edge device uses containerized IoT Edge [modules](#modules) to run Azure services, third-party services, or your own code. On the IoT Edge device, the [IoT Edge runtime](#iot-edge-runtime) manages the modules. You can remotely monitor and manage an IoT Edge device from the cloud.

### IoT Edge hub

The part of the IoT Edge runtime responsible for module to module communications, upstream (toward IoT Hub) and downstream (away from IoT Hub) communications.

### IoT Edge runtime

IoT Edge runtime includes everything that Microsoft distributes to be installed on an IoT Edge device. It includes Edge agent, Edge hub, and the IoT Edge security daemon.

### IoT extension for Azure CLI

[The IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) is a cross-platform, command-line tool. The tool enables you to manage your devices in the [identity registry](#identity-registry), send and receive messages and files from your devices, and monitor your IoT hub operations.

### IoT Hub

IoT Hub is a fully managed Azure service that enables reliable and secure bidirectional communications between millions of devices and a solution back end. For more information, see [What is Azure IoT Hub?](../iot-hub/about-iot-hub.md). Using your Azure subscription, you can create IoT hubs to handle your IoT messaging workloads.

### IoT Hub metrics

IoT Hub metrics give you data about the state of the IoT hubs in your Azure subscription. IoT Hub metrics enable you to assess the overall health of the service and the devices connected to it. IoT Hub metrics can help you see what is going on with your IoT hub and investigate root-cause issues without needing to contact Azure support. To learn more, see [Monitor IoT Hub](../iot-hub/monitor-iot-hub.md).

### IoT Hub query language

The [IoT Hub query language](../iot-hub/iot-hub-devguide-query-language.md) is a SQL-like language that enables you to query your [Job](#job), digital twins, and device twins.

### IoT Hub Resource REST API

You can use the [IoT Hub Resource REST API](/rest/api/iothub/iothubresource) to manage the IoT hubs in your Azure subscription performing operations such as creating, updating, and deleting hubs.

### IoT Plug and Play bridge

IoT Plug and Play bridge is an open-source application that enables existing sensors and peripherals attached to Windows or Linux gateways to connect as [IoT Plug and Play devices](#iot-plug-and-play-device).

### IoT Plug and Play conventions

IoT Plug and Play [devices](#iot-plug-and-play-device) are expected to follow a set of conventions when they exchange data with a solution.

### IoT Plug and Play device

An IoT Plug and Play device is typically a small-scale, standalone computing device that collects data or controls other devices, and that runs software or firmware that implements a [device model](#device-model).  For example, an IoT Plug and Play device might be an environmental monitoring device, or a controller for a smart-agriculture irrigation system. An IoT Plug and Play device might be implemented directly or as an IoT Edge module. You can write a cloud-hosted IoT solution to command, control, and receive data from IoT Plug and Play devices.

### IoT solution accelerators

Azure IoT solution accelerators package together multiple Azure services into solutions. These solutions enable you to get started quickly with end-to-end implementations of common IoT scenarios. For more information, see [What are Azure IoT solution accelerators?](../iot-accelerators/about-iot-accelerators.md)

## J

### Job

Your solution back end can use [jobs](../iot-hub/iot-hub-devguide-jobs.md) to schedule and track activities on a set of devices registered with your IoT hub. Activities include updating device twin [desired properties](#desired-properties), updating device twin [tags](#tags), and invoking [direct methods](#direct-method). [IoT Hub](#iot-hub) also uses  to [import to and export](../iot-hub/iot-hub-devguide-identity-registry.md#import-and-export-device-identities) from the [identity registry](#identity-registry).

## L

### Leaf device

In [IoT Edge](#iot-edge), a leaf device is a device with no downstream device.

### Lifecycle event

In Azure Digital Twins, this type of event is fired when a data item—such as a digital twin, a relationship, or an event handler—is created or deleted from your Azure Digital Twins instance.

### Linked IoT hub

The [Device Provisioning Service (DPS)](#device-provisioning-service), can provision devices to IoT hubs that have been linked to it. Linking an IoT hub to a DPS instance lets the service register a device ID and set the initial configuration in the device twin.

## M

### Model

A model defines a type of entity in your physical environment, including its properties, telemetries, components, and sometimes other information. Models are used to create [digital twins](#digital-twin) that represent specific physical objects of this type. Models are written in the [Digital Twins Definition Language](#digital-twins-definition-language-dtdl).

In the [Azure Digital Twins service](../digital-twins/index.yml), models can define devices or higher-level abstract business concepts. In [IoT Plug and Play](../iot-pnp/index.yml), [device models](#device-model) are used to describe devices specifically.

### Model ID

When an IoT Plug and Play device connects to an IoT Hub, it sends the **Model ID** of the [DTDL](#digital-twins-definition-language-dtdl) model it implements. This ID enables the solution to find the device model.

### Model repository

A model repository stores [device models](#device-model) and [interfaces](#interface).

### Model repository REST API

An API for managing and interacting with the model repository. For example, you can use the API to add and search for [device models](#device-model).

### Module builder

A module builder uses a [device model](#device-model) and [interfaces](#interface) when implementing code to run on an [IoT Plug and Play device](#iot-plug-and-play-device). Module builders implement the code as a module or an IoT Edge module to deploy to the IoT Edge runtime on a device.

### Module identity

The module identity is the unique identifier assigned to every module that belongs to a device. Module identity is also registered in the [identity registry](#identity-registry).

The module identify details the security credentials the module uses to authenticate with the [IoT Hub](#iot-hub) or, in the case of an IoT Edge module to the [IoT Edge hub](#iot-edge-hub).

### Module image

The docker image that the [IoT Edge runtime](#iot-edge-runtime) uses to instantiate module instances.

### Module twin

Similar to device twin, a module twin is JSON document that stores module state information such as metadata, configurations, and conditions. IoT Hub persists a module twin for each module identity that you provision under a device identity in your IoT hub. Module twins enable you to synchronize module conditions and configurations between the module and the solution back end. You can query module twins to locate specific modules and query the status of long-running operations.

### Modules

On the device side, the IoT Hub device SDKs enable you to create [modules](../iot-hub/iot-hub-devguide-module-twins.md) where each one opens an independent connection to IoT Hub. This functionality enables you to use separate namespaces for different components on your device.

Module identity and module twin provide the same capabilities as [device identity](#device-identity) and [device twin](#device-twin) but at a finer granularity. This finer granularity enables capable devices, such as operating system-based devices or firmware devices managing multiple components, to isolate configuration and conditions for each of those components.

In [IoT Edge](#iot-edge), a module is a Docker container that you can deploy to IoT Edge devices. It performs a specific task, such as ingesting a message from a device, transforming a message, or sending a message to an IoT hub. It communicates with other modules and sends data to the [IoT Edge runtime](#iot-edge-runtime).

### MQTT

[MQTT](https://mqtt.org/) is one of the messaging protocols that [IoT Hub](#iot-hub) supports for communicating with devices. For more information about the messaging protocols that IoT Hub supports, see [Send and receive messages with IoT Hub](../iot-hub/iot-hub-devguide-messaging.md).

## O

### Operations monitoring

IoT Hub [operations monitoring](../iot-hub/iot-hub-operations-monitoring.md) enables you to monitor the status of operations on your IoT hub in real time. [IoT Hub](#iot-hub) tracks events across several categories of operations. You can opt into sending events from one or more categories to an IoT Hub endpoint for processing. You can monitor the data for errors or set up more complex processing based on data patterns.

## P

### Physical device

A physical device is a real device such as a Raspberry Pi that connects to an IoT hub. For convenience, many of the IoT Hub tutorials use [simulated devices](#simulated-device) to enable you to run samples on your local machine.

### Primary and secondary keys

When you connect to a device-facing or service-facing endpoint on an IoT hub, your [connection string](#connection-string) includes key to grant you access. When you add a device to the [identity registry](#identity-registry) or add a [shared access policy](#shared-access-policy) to your hub, the service generates a primary and secondary key. Having two keys enables you to roll over from one key to another when you update a key without losing access to the IoT hub.

### Properties

Properties are data fields defined in an [interface](#interface) that represent some persistent state of a [digital twin](#digital-twin). You can declare properties as read-only or writable. Read-only properties, such as serial number, are set by code running on the [IoT Plug and Play device](#iot-plug-and-play-device) itself. Writable properties, such as an alarm threshold, are typically set from the cloud-based IoT solution.

### Property change event

An event that results from a property change in a [digital twin](#digital-twin).

### Protocol gateway

A protocol gateway is typically deployed in the cloud and provides protocol translation services for devices connecting to [IoT Hub](#iot-hub). For more information, see [What is Azure IoT Hub?](../iot-hub/about-iot-hub.md).

## R

### Registration

A registration is the record of a device in the IoT Hub [Identity registry](#identity-registry). You can register or device directly, or use the [Device Provisioning Service](#device-provisioning-service) to automate device registration.

### Registration ID

The registration ID is used to uniquely identify a device [registration](#registration) with the [Device Provisioning Service](#device-provisioning-service). The registration ID may be the same value as the [Device identity](#device-identity).

### Relationship

In the [Azure Digital Twins](../digital-twins/index.yml) service, relationships are used to connect [digital twins](#digital-twin) into knowledge graphs that digitally represent your entire physical environment. The types of relationships that your twins can have are defined as part of the twins' [model](#model) definitions—the [DTDL](#digital-twins-definition-language-dtdl) model for a certain type of twin includes information about what relationships it can have to other twins.

### Reported configuration

In the context of a [device twin](../iot-hub/iot-hub-devguide-device-twins.md), reported configuration refers to the complete set of properties and metadata in the device twin that should be reported to the solution back end.

### Reported properties

In the context of a [device twin](../iot-hub/iot-hub-devguide-device-twins.md), reported properties is a subsection of the device twin used with [desired properties](#desired-properties) to synchronize device configuration or condition. Reported properties can only be set by the [device app](#device-app) and can be read and queried by a [back-end app](#back-end-app).

### Retry policy

You use a retry policy to handle [transient errors](/azure/architecture/best-practices/transient-faults) when you connect to a cloud service.

### Routing rules

You configure [routing rules](../iot-hub/iot-hub-devguide-messages-read-custom.md) in your IoT hub to route device-to-cloud messages to a [built-in endpoint](#built-in-endpoints) or to [custom endpoints](#custom-endpoints) for processing by your solution back end.

## S

### SASL PLAIN

SASL PLAIN is a protocol that the AMQP protocol uses to transfer security tokens.

### Service operations endpoint

An [endpoint](#endpoint) for managing service settings used by a service administrator. For example, in the [Device Provisioning Service](#device-provisioning-service) you use the service endpoint to manage enrollments.

### Service REST API

You can use the [Service REST API](/rest/api/iothub/service/configuration) from the solution back end to manage your devices. The API enables you to retrieve and update [device twin](#device-twin) properties, invoke [direct methods](#direct-method), and schedule [jobs](#job). Typically, you should use one of the higher-level [service SDKs](#azure-iot-service-sdks) as shown in the IoT Hub tutorials.

### Shared access policy

A shared access policy defines the permissions granted to anyone who has a valid [primary or secondary key](#primary-and-secondary-keys) associated with that policy. You can manage the shared access policies and keys for your hub in the portal.

### Shared access signature

Shared Access Signatures (SAS) are an authentication mechanism based on SHA-256 secure hashes or URIs. SAS authentication has two components: a _Shared Access Policy_ and a _Shared Access Signature_ (often called a token). A device uses SAS to authenticate with an IoT hub. [Back-end apps](#back-end-app) also use SAS to authenticate with the service-facing endpoints on an IoT hub. Typically, you include the SAS token in the [connection string](#connection-string) that an app uses to establish a connection to an IoT hub.

### Simulated device

For convenience, many of the IoT Hub tutorials use simulated devices to enable you to run samples on your local machine. In contrast, a [physical device](#physical-device) is a real device such as a Raspberry Pi that connects to an IoT hub.

### Solution

A _solution_ can refer to a Visual Studio solution that includes one or more projects. A _solution_ might also refer to an IoT solution that includes elements such as devices, [device apps](#device-app), an IoT hub, other Azure services, and [back-end apps](#back-end-app).

### Solution builder

A solution builder creates the solution back end. A solution builder typically works with Azure resources such as IoT Hub and [model repositories](#model-repository).

### System properties

In the context of a [device twin](../iot-hub/iot-hub-devguide-device-twins.md), system properties are read-only and include information regarding the device usage such as last activity time and connection state.

## T

### Tags

In the context of a [device twin](../iot-hub/iot-hub-devguide-device-twins.md), tags are device metadata stored and retrieved by the solution back end in the form of a JSON document. Tags are not visible to apps on a device.

### Target condition

In an IoT Edge deployment, the target condition selects the target devices of the deployment, for example **tag.environment = prod**. The target condition is continuously evaluated to include any new devices that meet the requirements or remove devices that no longer do.

### Telemetry

Devices collect telemetry data, such as wind speed or temperature, and use data-point messages to send the telemetry to an IoT hub.

In IoT Plug and Play and Azure Digital Twins, telemetry fields defined in an [interface](#interface) represent measurements. These measurements are typically values such as sensor readings that are sent by devices, like [IoT Plug and Play devices](#iot-plug-and-play-device), as a stream of data.

Unlike [properties](#properties), telemetry is not stored on a [digital twin](#digital-twin); it is a stream of time-bound data events that need to be handled as they occur.

### Telemetry event

An event that indicates the arrival of telemetry data.

### Token service

You can use a token service to implement an authentication mechanism for your devices. It uses an IoT Hub [shared access policy](#shared-access-policy) with **DeviceConnect** permissions to create *device-scoped* tokens. These tokens enable a device to connect to your IoT hub. A device uses a custom authentication mechanism to authenticate with the token service. IF the device authenticates successfully, the token service issues a SAS token for the device to use to access your IoT hub.

### Twin graph (or digital twin graph)

In the [Azure Digital Twins](../digital-twins/index.yml) service, you can connect [digital twins](#digital-twin) with [relationships](#relationship) to create knowledge graphs that digitally represent your entire physical environment. A single [Azure Digital Twins instance](#azure-digital-twins-instance) can host many disconnected graphs, or one single interconnected graph.

### Twin queries

[Device and module twin queries](../iot-hub/iot-hub-devguide-query-language.md) use the SQL-like IoT Hub query language to retrieve information from your device twins or module twins. You can use the same IoT Hub query language to retrieve information about a [Job](#job) running in your IoT hub.

### Twin synchronization

Twin synchronization uses the [desired properties](#desired-properties) in your device twins or module twins to configure your devices or modules and retrieve [reported properties](#reported-properties) from them to store in the twin.

## U

### Upstream services

A relative term describing services that feed data into the current context. For instance, if you're thinking in the context of Azure Digital Twins, IoT Hub is considered an upstream service because data flows from IoT Hub into Azure Digital Twins.

## X

### X.509 client certificate

A device can use an X.509 certificate to authenticate with [IoT Hub](#iot-hub). Using an X.509 certificate is an alternative to using a [SAS token](#shared-access-signature).
