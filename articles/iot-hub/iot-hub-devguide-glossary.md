---
title: Azure IoT Hub glossary of terms | Microsoft Docs
description: Developer guide - a glossary of common terms relating to Azure IoT Hub.
author: dominicbetts
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/29/2018
ms.author: dobett
---

# Glossary of IoT Hub terms
This article lists some of the common terms used in the IoT Hub articles.

## Advanced Message Queueing Protocol
[Advanced Message Queueing Protocol (AMQP)](https://www.amqp.org/) is one of the messaging protocols that [IoT Hub](#iot-hub) supports for communicating with devices. For more information about the messaging protocols that IoT Hub supports, see [Send and receive messages with IoT Hub](iot-hub-devguide-messaging.md).

## Automatic Device Management
Automatic Device Management in Azure IoT Hub automates many of the repetitive and complex tasks of managing large device fleets over the entirety of their lifecycles. With Automatic Device Management, you can target a set of devices based on their properties, define a desired configuration, and let IoT Hub update devices whenever they come into scope.  Consists of [automatic device configurations](iot-hub-auto-device-config.md) and [IoT Edge automatic deployments](../iot-edge/how-to-deploy-monitor.md).

## Automatic device configuration
Your solution back end can use [automatic device configurations](iot-hub-auto-device-config.md) to assign desired properties to a set of [device twins](#device-twin) and report status using system metrics and custom metrics. 

## Azure classic CLI
The [Azure classic CLI](../cli-install-nodejs.md) is a cross-platform, open-source, shell-based, command tool for creating and managing resources in Microsoft Azure. This version of the CLI should be used for classic deployments only.

## Azure CLI
The [Azure CLI](https://docs.microsoft.com/cli/azure/install-az-cli2) is a cross-platform, open-source, shell-based, command tool for creating and managing resources in Microsoft Azure.


## Azure IoT device SDKs
There are _device SDKs_ available for multiple languages that enable you to create [device apps](#device-app) that interact with an IoT hub. The IoT Hub tutorials show you how to use these device SDKs. You can find the source code and further information about the device SDKs in this GitHub [repository](https://github.com/Azure/azure-iot-sdks).

## Azure IoT service SDKs
There are _service SDKs_ available for multiple languages that enable you to create [back-end apps](#back-end-app) that interact with an IoT hub. The IoT Hub tutorials show you how to use these service SDKs. You can find the source code and further information about the service SDKs in this GitHub [repository](https://github.com/Azure/azure-iot-sdks).

## Azure IoT Toolkit
The [Azure IoT Toolkit](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) is a cross-platform, open-source Visual Studio Code extension that helps you manage Azure IoT Hub and devices in VS Code. With Azure IoT Toolkit, IoT developers could develop IoT project in VS Code with ease.

## Azure portal
The [Microsoft Azure portal](https://portal.azure.com) is a central place where you can provision and manage your Azure resources. It organizes its content using _blades_.

## Azure PowerShell
[Azure PowerShell](/powershell/azure/overview) is a collection of cmdlets you can use to manage Azure with Windows PowerShell. You can use the cmdlets to create, test, deploy, and manage solutions and services delivered through the Azure platform.

## Azure Resource Manager
[Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) enables you to work with the resources in your solution as a group. You can deploy, update, or delete the resources for your solution in a single, coordinated operation.

## Azure Service Bus
[Service Bus](../service-bus/index.md) provides cloud-enabled communication with enterprise messaging and relayed communication that helps you connect on-premises solutions with the cloud. Some IoT Hub tutorials make use Service Bus [queues](../service-bus-messaging/service-bus-messaging-overview.md).

## Azure Storage
[Azure Storage](../storage/common/storage-introduction.md) is a cloud storage solution. It includes the Blob Storage service that you can use to store unstructured object data. Some IoT Hub tutorials use blob storage.

## Back-end app
In the context of [IoT Hub](#iot-hub), a back-end app is an app that connects to one of the service-facing endpoints on an IoT hub. For example, a back-end app might retrieve [device-to-cloud](#device-to-cloud)messages or manage the [identity registry](#identity-registry). Typically, a back-end app runs in the cloud, but in many of the tutorials the back-end apps are console apps running on your local development machine.

## Built-in endpoints
Every IoT hub includes a built-in [endpoint](iot-hub-devguide-endpoints.md) that is Event Hub-compatible. You can use any mechanism that works with Event Hubs to read device-to-cloud messages from this endpoint.

## Cloud gateway
A cloud gateway enables connectivity for devices that cannot connect directly to [IoT Hub](#iot-hub). A cloud gateway is hosted in the cloud in contrast to a [field gateway](#field-gateway) that runs local to your devices. A typical use case for a cloud gateway is to implement protocol translation for your devices.

## Cloud-to-device
Refers to messages sent from an IoT hub to a connected device. Often, these messages are commands that instruct the device to take an action. For more information, see [Send and receive messages with IoT Hub](iot-hub-devguide-messaging.md).

## Configuration
In the context of [automatic device configuration](iot-hub-auto-device-config.md), a configuration within IoT Hub defines the desired configuration for a set of devices twins and provides a set of metrics to report status and progress.

## Connection string
You use connection strings in your app code to encapsulate the information required to connect to an endpoint. A connection string typically includes the address of the endpoint and security information, but connection string formats vary across services. There are two types of connection string associated with the IoT Hub service:
- *Device connection strings* enable devices to connect to the device-facing endpoints on an IoT hub.
- *IoT Hub connection strings* enable back-end apps to connect to the service-facing endpoints on an IoT hub.

## Custom endpoints
You can create custom [endpoints](iot-hub-devguide-endpoints.md) on an IoT hub to deliver messages dispatched by a [routing rule](#routing-rules). Custom endpoints connect directly to an Event hub, a Service Bus queue, or a Service Bus topic.

## Custom gateway
A gateway enables connectivity for devices that cannot connect directly to [IoT Hub](#iot-hub). You can use [Azure IoT Edge](#azure-iot-edge) to build custom gateways that implement custom logic to handle messages, custom protocol conversions, and other processing on the edge.

## Data-point message
A data-point message is a [device-to-cloud](#device-to-cloud) message that contains [telemetry](#telemetry) data such as wind speed or temperature.

## Desired configuration
In the context of a [device twin](iot-hub-devguide-device-twins.md), desired configuration refers to the complete set of properties and metadata in the device twin that should be synchronized with the device.

## Desired properties
In the context of a [device twin](iot-hub-devguide-device-twins.md), desired properties is a subsection of the device twin that is used with [reported properties](#reported-properties) to synchronize device configuration or condition. Desired properties can only be set by a [back-end app](#back-end-app) and are observed by the [device app](#device-app).

## Device-to-cloud
Refers to messages sent from a connected device to [IoT Hub](#iot-hub). These messages may be [data-point](#data-point-message) or [interactive](#interactive-message) messages. For more information, see [Send and receive messages with IoT Hub](iot-hub-devguide-messaging.md).

## Device
In the context of IoT, a device is typically a small-scale, standalone computing device that may collect data or control other devices. For example, a device might be an environmental monitoring device, or a controller for the watering and ventilation systems in a greenhouse. The [device catalog](https://catalog.azureiotsuite.com/) provides a list of hardware devices certified to work with [IoT Hub](#iot-hub).

## Device app
A device app runs on your [device](#device) and handles the communication with your [IoT hub](#iot-hub). Typically, you use one of the [Azure IoT device SDKs](#azure-iot-device-sdks) when you implement a device app. In many of the IoT tutorials, you use a [simulated device](#simulated-device) for convenience.

## Device condition
Refers to device state information, such as the connectivity method currently in use, as reported by a [device app](#device-app). [Device apps](#device-app) can also report their capabilities. You can query for condition and capability information using device twins.

## Device data
Device data refers to the per-device data stored in the IoT Hub [identity registry](#identity-registry). It is possible to import and export this data.

## Device explorer
The [device explorer](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/tools/DeviceExplorer) is a tool that runs on Windows and enables you to manage your devices in the [identity registry](#identity-registry).The tool can also send and receive messages to your devices.

## Device identity
The device identity is the unique identifier assigned to every device registered in the [identity registry](#identity-registry).

## Module identity
The module identity is the unique identifier assigned to every module that belong to a device. Module identity is also registered in the [identity registry](#identity-registry).

## Device management
Device management encompasses the full lifecycle associated with managing the devices in your IoT solution including planning, provisioning, configuring, monitoring, and retiring.

## Device management patterns
[IoT hub](#iot-hub) enables common device management patterns including rebooting, performing factory resets, and performing firmware updates on your devices.

## Device REST API
You can use the [Device REST API](https://docs.microsoft.com/rest/api/iothub/device) from a device to send device-to-cloud messages to an IoT hub, and receive [cloud-to-device](#cloud-to-device) messages from an IoT hub. Typically, you should use one of the higher-level [device SDKs](#azure-iot-device-sdks) as shown in the IoT Hub tutorials.

## Device provisioning
Device provisioning is the process of adding the initial [device data](#device-data) to the stores in your solution. To enable a new device to connect to your hub, you must add a device ID and keys to the IoT Hub [identity registry](#identity-registry). As part of the provisioning process, you might need to initialize device-specific data in other solution stores.

## Device twin
A [device twin](iot-hub-devguide-device-twins.md) is JSON document that stores device state information such as metadata, configurations, and conditions. [IoT Hub](#iot-hub) persists a device twin for each device that you provision in your IoT hub. Device twins enable you to synchronize [device conditions](#device-condition) and configurations between the device and the solution back end. You can query device twins to locate specific devices and query the status of long-running operations.

## Module twin
Similar to device twin, a module twin is JSON document that stores module state information such as metadata, configurations, and conditions. IoT Hub persists a module twin for each module identity that you provision under a device identity in your IoT hub. Module twins enable you to synchronize module conditions and configurations between the module and the solution back end. You can query module twins to locate specific modules and query the status of long-running operations.

## Twin queries
[Device and module twin queries](iot-hub-devguide-query-language.md) use the SQL-like IoT Hub query language to retrieve information from your device twins or module twins. You can use the same IoT Hub query language to retrieve information about [](#job) running in your IoT hub.

## Twin synchronization
Twin synchronization uses the [desired properties](#desired-properties) in your device twins or module twins to configure your devices or modules and retrieve [reported properties](#reported-properties) from them to store in the twin.

## Direct method
A [direct method](iot-hub-devguide-direct-methods.md) is a way for you to trigger a method to execute on a device by invoking an API on your IoT hub.

## Endpoint
An IoT hub exposes multiple [endpoints](iot-hub-devguide-endpoints.md) that enable your apps to connect to the IoT hub. There are device-facing endpoints that enable devices to perform operations such as sending [device-to-cloud](#device-to-cloud) messages and receiving [cloud-to-device](#cloud-to-device) messages. There are service-facing management endpoints that enable [back-end apps](#back-end-app) to perform operations such as [device identity](#device-identity) management and device twin management. There are service-facing [built-in endpoints](#built-in-endpoints) for reading device-to-cloud messages. You can create [custom endpoints](#custom-endpoints) to receive device-to-cloud messages dispatched by a [routing rule](#routing-rules).

## Event Hubs service
[Event Hubs](../event-hubs/event-hubs-what-is-event-hubs.md) is a highly scalable data ingress service that can ingest millions of events per second. The service enables you to process and analyze the massive amounts of data produced by your connected devices and applications. For a comparison with the IoT Hub service, see [Comparison of Azure IoT Hub and Azure Event Hubs](iot-hub-compare-event-hubs.md).

## Event Hub-compatible endpoint
To read [device-to-cloud](#device-to-cloud) messages sent to your IoT hub, you can connect to an endpoint on your hub and use any Event Hub-compatible method to read those messages. Event Hub-compatible methods include using the [Event Hubs SDKs](../event-hubs/event-hubs-programming-guide.md) and [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md).

## Field gateway
A field gateway enables connectivity for devices that cannot connect directly to [IoT Hub](#iot-hub) and is typically deployed locally with your devices. For more information, see [What is Azure IoT Hub?](about-iot-hub.md)

## Free account
You can create a [free Azure account](https://azure.microsoft.com/pricing/free-trial/) to complete the IoT Hub tutorials and experiment with the IoT Hub service (and other Azure services).

## Gateway
A gateway enables connectivity for devices that cannot connect directly to [IoT Hub](#iot-hub). See also [Field Gateway](#field-gateway), [Cloud Gateway](#cloud-gateway), and [Custom Gateway](#custom-gateway).

## Identity registry
The [identity registry](iot-hub-devguide-identity-registry.md) is the built-in component of an IoT hub that stores information about the individual devices permitted to connect to an IoT hub.

## Interactive message
An interactive message is a [cloud-to-device](#cloud-to-device) message that triggers an immediate action in the solution back end. For example, a device might send an alarm about a failure that should be automatically logged in to a CRM system.

[!INCLUDE [azure-iot-hub-edge-glossary-includes](../../includes/azure-iot-hub-edge-glossary-includes.md)]

## IoT Hub
IoT Hub is a fully managed Azure service that enables reliable and secure bidirectional communications between millions of devices and a solution back end. For more information, see [What is Azure IoT Hub?](about-iot-hub.md) Using your [Azure subscription](#subscription), you can create IoT hubs to handle your IoT messaging workloads.

## IoT Hub metrics
[IoT Hub metrics](iot-hub-metrics.md) give you data about the state of the IoT hubs in your [Azure subscription](#subscription). IoT Hub metrics enable you to assess the overall health of the service and the devices connected to it. IoT Hub metrics can help you see what is going on with your IoT hub and investigate root-cause issues without needing to contact Azure support.

## IoT Hub query language
The [IoT Hub query language](iot-hub-devguide-query-language.md) is a SQL-like language that enables you to query your [](#job) and device twins.

## IoT Hub Resource REST API
You can use the [IoT Hub Resource REST API](https://docs.microsoft.com/rest/api/iothub/iothubresource) to manage the IoT hubs in your [Azure subscription](#subscription) performing operations such as creating, updating, and deleting hubs.

## IoT solution accelerators
Azure IoT solution accelerators package together multiple Azure services into solutions. These solutions enable you to get started quickly with end-to-end implementations of common IoT scenarios. For more information, see [What are Azure IoT solution accelerators?](../iot-accelerators/about-iot-accelerators.md)

## The IoT extension for Azure CLI 
[The IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) is a cross-platform, command-line tool. The tool enables you to manage your devices in the [identity registry](#identity-registry), send and receive messages and files from your devices, and monitor your IoT hub operations.

## Job
Your solution back end can use [jobs](iot-hub-devguide-jobs.md) to schedule and track activities on a set of devices registered with your IoT hub. Activities include updating device twin [desired properties](#desired-properties), updating device twin [tags](#tags), and invoking [direct methods](#direct-method). [IoT Hub](#iot-hub) also uses  to [import to and export](iot-hub-devguide-identity-registry.md#import-and-export-device-identities) from the [identity registry](#identity-registry).

## MQTT
[MQTT](http://mqtt.org/) is one of the messaging protocols that [IoT Hub](#iot-hub) supports for communicating with devices. For more information about the messaging protocols that IoT Hub supports, see [Send and receive messages with IoT Hub](iot-hub-devguide-messaging.md).

## Operations monitoring
IoT Hub [operations monitoring](iot-hub-operations-monitoring.md) enables you to monitor the status of operations on your IoT hub in real time. [IoT Hub](#iot-hub) tracks events across several categories of operations. You can opt into sending events from one or more categories to an IoT Hub endpoint for processing. You can monitor the data for errors or set up more complex processing based on data patterns.

## Physical device
A physical device is a real device such as a Raspberry Pi that connects to an IoT hub. For convenience, many of the IoT Hub tutorials use [simulated devices](#simulated-device) to enable you to run samples on your local machine.

## Primary and secondary keys
When you connect to a device-facing or service-facing endpoint on an IoT hub, your [connection string](#connection-string) includes key to grant you access. When you add a device to the [identity registry](#identity-registry) or add a [shared access policy](#shared-access-policy) to your hub, the service generates a primary and secondary key. Having two keys enables you to roll over from one key to another when you update a key without losing access to the IoT hub.

## Protocol gateway
A protocol gateway is typically deployed in the cloud and provides protocol translation services for devices connecting to [IoT Hub](#iot-hub). For more information, see [What is Azure IoT Hub?](about-iot-hub.md)

## Quotas and throttling
There are various [quotas](iot-hub-devguide-quotas-throttling.md) that apply to your use of [IoT Hub](#iot-hub), many of the quotas vary based on the tier of the IoT hub. [IoT Hub](#iot-hub) also applies [throttles](iot-hub-devguide-quotas-throttling.md) to your use of the service at run time.

## Reported configuration
In the context of a [device twin](iot-hub-devguide-device-twins.md), reported configuration refers to the complete set of properties and metadata in the device twin that should be reported to the solution back end.

## Reported properties
In the context of a [device twin](iot-hub-devguide-device-twins.md), reported properties is a subsection of the device twin used with [desired properties](#desired-properties) to synchronize device configuration or condition. Reported properties can only be set by the [device app](#device-app) and can be read and queried by a [back-end app](#back-end-app).

## Resource group
[Azure Resource Manager](#azure-resource-manager) uses resource groups to group related resources together. You can use a resource group to perform operations on all the resources on the group simultaneously.

## Retry policy
You use a retry policy to handle [transient errors](/azure/architecture/best-practices/transient-faults) when you connect to a cloud service.

## Routing rules
You configure [routing rules](iot-hub-devguide-messages-read-custom.md) in your IoT hub to route device-to-cloud messages to a [built-in endpoint](#built-in-endpoints) or to [custom endpoints](#custom-endpoints) for processing by your solution back end.

## SASL PLAIN
SASL PLAIN is a protocol that the [AMQP](#advanced-message-queue-protocol) protocol uses to transfer security tokens.

## Service REST API
You can use the [Service REST API](https://docs.microsoft.com/rest/api/iothub/service) from the solution back end to manage your devices. The API enables you to retrieve and update [device twin](#device-twin) properties, invoke [direct methods](#direct-method), and schedule [jobs](#job). Typically, you should use one of the higher-level [service SDKs](#azure-iot-service-sdks) as shown in the IoT Hub tutorials.

## Shared access signature
Shared Access Signatures (SAS) are an authentication mechanism based on SHA-256 secure hashes or URIs. SAS authentication has two components: a _Shared Access Policy_ and a _Shared Access Signature_ (often called a token). A device uses SAS to authenticate with an IoT hub. [Back-end apps](#back-end-app) also use SAS to authenticate with the service-facing endpoints on an IoT hub. Typically, you include the SAS token in the [connection string](#connection-string) that an app uses to establish a connection to an IoT hub.

## Shared access policy
A shared access policy defines the permissions granted to anyone who has a valid [primary or secondary key](#primary-and-secondary-keys) associated with that policy. You can manage the shared access policies and keys for your hub in the [portal](#azure-portal).

## Simulated device
For convenience, many of the IoT Hub tutorials use simulated devices to enable you to run samples on your local machine. In contrast, a [physical device](#physical-device) is a real device such as a Raspberry Pi that connects to an IoT hub.

## Solution
A _solution_ can refer to a Visual Studio solution that includes one or more projects. A _solution_ might also refer to an IoT solution that includes elements such as devices, [device apps](#device-app), an IoT hub, other Azure services, and [back-end apps](#back-end-app).

## Subscription
An Azure subscription is where billing takes place. Each Azure resource you create or Azure service you use is associated with a single subscription. Many quotas also apply at the level of a subscription.

## System properties
In the context of a [device twin](iot-hub-devguide-device-twins.md), system properties are read-only and include information regarding the device usage such as last activity time and connection state.

## Tags
In the context of a [device twin](iot-hub-devguide-device-twins.md), tags are device metadata stored and retrieved by the solution back end in the form of a JSON document. Tags are not visible to apps on a device.

## Telemetry
Devices collect telemetry data, such as wind speed or temperature, and use [data-point messages](#data-point-messages) to send the telemetry to an IoT hub.

## Token service
You can use a token service to implement an authentication mechanism for your devices. It uses an IoT Hub [shared access policy](#shared-access-policy) with **DeviceConnect** permissions to create *device-scoped* tokens. These tokens enable a device to connect to your IoT hub. A device uses a custom authentication mechanism to authenticate with the token service. IF the device authenticates successfully, the token service issues a SAS token for the device to use to access your IoT hub.

## X.509 client certificate
A device can use an X.509 certificate to authenticate with [IoT Hub](#iot-hub). Using an X.509 certificate is an alternative to using a [SAS token](#shared-access-signature).
