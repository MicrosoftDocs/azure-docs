---
title: Azure IoT services and technologies
description: Describes the collection of services and technologies you can use to build Azure IoT cloud-based and edge-based solutions.
author: asergaz
ms.service: azure-iot
services: iot
ms.topic: product-comparison
ms.date: 03/26/2025
ms.author: sergaz
#Customer intent: As a newcomer to IoT, I want to understand what Azure IoT services are available, and which one to select based on my IoT solution.
---

# Azure IoT services and technologies

Azure IoT services and technologies provide you with options to create a wide variety of IoT solutions that enable digital transformation for your organization. This article describes Azure IoT services and technologies such as:

- Azure IoT Operations
- Azure Device Registry
- Azure IoT Hub
- Azure IoT Hub Device Provisioning Service
- Azure IoT Central
- Azure Digital Twins
- Azure IoT Edge
- Azure IoT SDKs
- Azure IoT Plug and Play

<!-- Later we can add things like the AIO SDK, Zero Touch Provisioning service, Chances Plain, etc-->

## Solution types

The [What is Azure IoT?](iot-introduction.md) article describes two broad categories of IoT solutions:

- In a *cloud-based IoT solution*, your IoT devices connect directly to the cloud where their messages are processed and analyzed.
- In an *edge-based IoT solution*, your IoT assets connect to an edge environment that processes their messages before forwarding them to the cloud for storage and analysis.

Hybrid solutions are also possible that combine both cloud and edge components.

Your choice of solution type determines which Azure IoT services and technologies you can use. For example, to build an edge-based solution you typically use Azure IoT Operations, for a cloud-based solution you typically use Azure IoT Hub.

The later sections describe the role of the various Azure IoT services and technologies in cloud-based, edge-based, and hybrid solutions.

## Adaptive cloud approach

Another way to categorize IoT solutions is by whether they adopt the [adaptive cloud](/azure/adaptive-cloud/) approach. The adaptive cloud approach unifies siloed teams, distributed sites, and disparate systems into a single operations, security, application, and data model. This approach enables you to use the same cloud and AI technologies to manage and monitor edge-based, cloud-based, and hybrid IoT solutions.

An example of how Azure IoT operations uses the adaptive cloud approach is its use of Azure Arc-enabled services to manage and monitor edge-based resources such as assets and data flows. These edge-based resources are exposed in your Azure portal as individual cloud-based resources that you can manage and monitor with standard Azure tools.

In contrast, the devices and routing definitions in IoT Hub aren't exposed as individual resources in your Azure portal but are part of the IoT Hub resource. The only way to manage and monitor these resources is through IoT Hub.

## Azure IoT Operations

Use Azure IoT Operations to build an edge-based IoT solution that follows the adaptive cloud approach.

### Azure Device Registry

Azure Device Registry is part of Azure IoT Operations.

## Azure IoT Hub

Use Azure IoT Hub to build a cloud-based IoT solution. IoT Hub does not follow the adaptive cloud approach.

### Azure IoT Hub Device Provisioning Service

The Azure IoT Hub Device Provisioning Service (DPS) is typically part of a cloud-based IoT solution based on IoT Hub or IoT Central.

### Azure IoT Edge

Azure IoT Edge is typically part of a hybrid IoT solution based on IoT Hub or IoT Central.

## Azure IoT Device Update

## Azure Digital Twins

The Azure Digital Twins service is typically part of a cloud-based IoT solution based on IoT Hub.

## Azure IoT Central

Use Azure IoT Central to build a cloud-based IoT solution. IoT Central does not follow the adaptive cloud approach.

## Azure IoT SDKs

The Azure IoT SDKs enable you to build custom cloud-based IoT solutions that use IoT Hub and IoT Central.

## Azure IoT Plug and Play

Azure IoT Plug and Play is a programming model that enables you to build cloud-based IoT solutions that use IoT Hub and IoT Central.

## Defender for IoT

## Azure Event Grid

Azure Event Grid can be a part of both cloud-based and edge-based IoT solutions.

## Data and analytics

See existing article, but include Fabric.

## Actions and notifications

See existing article.

## Next steps

For a hands-on experience, try one of the quickstarts:

- [Quickstart: Run Azure IoT Operations in GitHub Codespaces with K3s](../iot-operations/get-started-end-to-end-sample/quickstart-deploy.md)
- [Quickstart: Send telemetry from a device to an IoT hub and monitor it with the Azure CLI](../iot-hub/quickstart-send-telemetry-cli.md)
- [Quickstart: Use your smartphone as a device to send telemetry to an IoT Central application](../iot-central/core/quick-deploy-iot-central.md)

