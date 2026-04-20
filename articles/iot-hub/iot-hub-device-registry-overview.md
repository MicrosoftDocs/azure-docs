---
title: Integration with Azure Device Registry (preview)
titleSuffix: Azure IoT Hub
description: This article discusses the basic concepts of how Azure Device Registry helps users manage IoT devices.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
services: iot-hub
ms.topic: overview
ms.date: 10/20/2025
#Customer intent: As a developer new to IoT, i want to understand what Azure Device Registry is and how it can help me manage my IoT devices.
---

# Integration with Azure Device Registry (preview)

This article provides background on Azure Device Registry (ADR) integration with Azure IoT Hub (preview).

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

## What is Azure Device Registry?

Azure Device Registry (ADR) represents industrial assets and IoT devices as Azure Resource Manager (ARM) resources, extending the Azure management plane to IoT. It provides a consistent experience for deployment, policy enforcement, querying, and control plane operations. ADR is generally available for Azure IoT Operations scenarios, while integration with Azure IoT Hub is currently in *preview*.

In the IoT Hub context, ADR acts as a unified device registry for managing IoT Hub–connected devices. Each device is represented as an Azure resource, enabling management across multiple IoT Hub instances through ADR namespaces. When you [create a new IoT Hub instance](iot-hub-device-registry-setup.md), you can link it to an existing ADR namespace or create a new one. The IoT Hub instance uses the linked namespace as a registry for its devices. Multiple IoT Hub instances can share a namespace, supporting collective device management across IoT Hubs.

> [!NOTE]
> Azure Device Registry is already generally available (GA) with [Azure IoT Operations](/azure/iot-operations).

## ADR namespaces

ADR uses namespaces to organize IoT devices and other ADR resources. A namespace groups related devices, establishes a security boundary, and enables management at scale. You can apply policies, access controls, and manage device lifecycles within a namespace. Each IoT Hub instance links to a single namespace, but multiple hubs can share one namespace for broader management scenarios.

ADR provides a unified registry, allowing applications and services to interact with IoT devices through the Azure management plane. Devices registered in ADR can be managed using Azure Resource Manager features, including resource groups, tags, role-based access control (RBAC), policies, logging, and auditing.

Namespaces also help maintain separation between different environments, such as development, testing, and production, reducing the risk of accidental changes across boundaries.

The following diagram illustrates how multiple IoT Hub instances and devices link to a single ADR namespace for unified device management.

:::image type="content" source="media/device-registry/namespaces-iot-hub.svg" alt-text="Mermaid diagram showing two IoT Hub instances with multiple devices linked to a single ADR namespace.":::

## Representation and management of IoT Hub devices as ARM resources

ADR represents IoT Hub devices as ARM resources, assigning each device an ARM resource ID. This enables consistent governance through RBAC, tags, and resource groups. With ADR integration, devices appear in the Azure management plane, supporting cross-hub queries via Azure Resource Graph and streamlined operations such as metadata updates, auditing, and lifecycle management—all through a single, uniform at-scale interface.

## Built-in RBAC roles

Azure Device Registry offers three built-in roles designed to simplify and secure access management for hub resources: Azure Device Registry Contributor, Azure Device Registry Credentials Contributor, and Azure Device Registry Onboarding. For more information, see [Built-in RBAC roles for Azure IoT](/azure/role-based-access-control/built-in-roles/internet-of-things).


## Limits and quotas

See [IoT Hub preview resource limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-iot-hub-limits) for the latest information about limits and quotas for ADR with IoT Hub.

For Azure subscription and service limits for Azure Device Registry in GA, see [Azure Device Registry limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-device-registry-limits).

## Related content

- [FAQ: What is new in Azure IoT Hub?](iot-hub-faq.md)
- [Get started with ADR and certificate management in IoT Hub](iot-hub-device-registry-setup.md)
- [What is Microsoft-backed X.509 certificate management?](iot-hub-certificate-management-overview.md)
- [Key concepts for certificate management](iot-hub-certificate-management-concepts.md)
