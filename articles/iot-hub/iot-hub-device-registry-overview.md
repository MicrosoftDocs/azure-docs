---
title: Integration with Azure Device Registry (preview)
titleSuffix: Azure IoT Hub
description: This article discusses the basic concepts of how Azure Device Registry helps users manage IoT devices.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
services: iot-hub
ms.topic: overview
ms.date: 09/22/2026
#Customer intent: As a developer new to IoT, i want to understand what Azure Device Registry is and how it can help me manage my IoT devices.
---

# Integration with Azure Device Registry (preview)

This article provides background on Azure Device Registry integration with Azure IoT Hub (preview).

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

## What is Azure Device Registry?

Azure Device Registry represents industrial assets and IoT devices as Azure Resource Manager resources, extending the Azure management plane to IoT. It provides a consistent experience for deployment, policy enforcement, querying, and control plane operations. Azure Device Registry is generally available for Azure IoT Operations scenarios, while integration with Azure IoT Hub is currently in *preview*.

In the IoT Hub context, Azure Device Registry acts as a unified device registry for managing IoT Hub–connected devices. Each device is represented as an Azure resource, enabling management across multiple IoT Hub instances through Azure Device Registry namespaces. When you [create a new IoT Hub instance](iot-hub-device-registry-setup.md), you can link it to an existing Azure Device Registry namespace or create a new one. The IoT Hub instance uses the linked namespace as a registry for its devices. Multiple IoT Hub instances can share a namespace, supporting collective device management across IoT Hubs.

> [!NOTE]
> Azure Device Registry is already generally available (GA) with [Azure IoT Operations](/azure/iot-operations).

## Azure Device Registry namespaces

Azure Device Registry uses namespaces to organize IoT devices and other resources. A namespace groups related devices, establishes a security boundary, and enables management at scale. For a full explanation of what namespaces are, what they're used for, and how they work across Azure IoT services, see [What is an Azure Device Registry namespace?](../iot/device-registry/concept-namespaces.md).

For Azure IoT Hub, each IoT Hub instance links to a single namespace, but multiple hubs can share one namespace for broader management scenarios.

The following diagram illustrates how multiple IoT Hub instances and devices link to a single Azure Device Registry namespace for unified device management.

:::image type="content" source="media/device-registry/namespaces-iot-hub.svg" alt-text="Mermaid diagram showing two IoT Hub instances with multiple devices linked to a single Azure Device Registry namespace.":::

## Representation and management of IoT Hub devices as Azure Resource Manager resources

Azure Device Registry represents IoT Hub devices as Resource Manager resources, assigning each device a Resource Manager resource ID. This enables consistent governance through RBAC, tags, and resource groups. With Azure Device Registry integration, devices appear in the Azure management plane, supporting cross-hub queries via Azure Resource Graph and streamlined operations such as metadata updates, auditing, and lifecycle management - all through a single, uniform at-scale interface.

## Built-in RBAC roles

Azure Device Registry offers three built-in roles designed to simplify and secure access management for hub resources: Azure Device Registry Contributor, Azure Device Registry Credentials Contributor, and Azure Device Registry Onboarding. For more information, see [Built-in RBAC roles for Azure IoT](/azure/role-based-access-control/built-in-roles/internet-of-things).


## Limits and quotas

For the latest information about limits and quotas for Azure Device Registry with IoT Hub, see [IoT Hub preview resource limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-iot-hub-limits).

For Azure subscription and service limits for Azure Device Registry in GA, see [Azure Device Registry limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-device-registry-limits).

## Related content

- [FAQ: What is new in Azure IoT Hub?](iot-hub-faq.md)
- [Get started with Azure Device Registry and certificate management in IoT Hub](iot-hub-device-registry-setup.md)
- [What is Microsoft-backed X.509 certificate management?](../iot/iot-certificate-management-overview.md)
- [Key concepts for certificate management](../iot/iot-certificate-management-concepts.md)
- [Unified Azure IoT SDKs (preview) for IoT Hub and Azure Device Registry](../iot/device-registry/concept-unified-iot-sdks.md)
