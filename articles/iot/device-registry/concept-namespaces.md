---
title: What is an Azure Device Registry namespace?
titleSuffix: Azure Device Registry
description: Learn what Azure Device Registry namespaces are, what they're used for, and the role they play for both Azure IoT Operations and Azure IoT Hub.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: concept-article
ms.date: 09/16/2026
ai-usage: ai-assisted
#Customer intent: As an IoT solution architect, operator, or developer, I want to understand what an Azure Device Registry namespace is and how it works across Azure IoT services so that I can organize and govern my devices and assets effectively.
---

# What is an Azure Device Registry namespace?

A *namespace* is the management and organizational boundary for devices and assets in [Azure Device Registry](overview-device-registry.md). Every device and asset belongs to exactly one namespace. A namespace groups related devices and assets, establishes a security boundary, and supports management at scale through role-based access control (RBAC), tags, and policies.

Namespaces are the shared foundation that Azure Device Registry uses to organize your IoT estate across services. They work with both Azure IoT Operations and Azure IoT Hub, so you can manage edge-connected and cloud-connected devices through a single, uniform interface.

> [!IMPORTANT]
> Azure Device Registry integration with Azure IoT Hub, including namespace support for IoT Hub-connected devices, is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## What namespaces are used for

A namespace organizes devices and assets and gives you a consistent way to govern them through the Azure control plane. Because Azure Device Registry represents each device and asset as an Azure Resource Manager resource, the namespace becomes the boundary where you apply standard Azure management capabilities.

Namespaces provide the following benefits:

- **Organizational grouping.** A namespace groups related devices and assets so that you can manage them as a set. You typically align namespace boundaries with organizational, operational, or governance requirements, such as a site, a business unit, or an environment.
- **Security boundary.** You apply RBAC at the namespace level, which gives you a clear boundary for controlling who can access a set of devices and assets. Namespaces also help maintain separation between environments, such as development, testing, and production, which reduces the risk of accidental changes across boundaries.
- **Management at scale.** Because devices and assets are Azure Resource Manager resources within a namespace, you can use resource groups, tags, Azure Policy, logging, and auditing to manage them the same way you manage other Azure resources. You can also use Azure Resource Graph to query devices and assets across namespaces, subscriptions, and regions.
- **Service-specific configuration.** Certain platform capabilities, such as certificate management policies, are enabled or configured at the namespace level. A namespace acts like a parent resource with its own managed identity and service-specific settings.

## How namespaces relate to service instances

A namespace is a long-lived boundary, so it's important to understand how namespaces map to Azure IoT Operations instances and Azure IoT Hub instances before you deploy:

- Each Azure IoT Operations instance or Azure IoT Hub maps to exactly one namespace.
- Multiple Azure IoT Operations instances or Azure IoT Hub instances can share the same namespace for broader management scenarios.

Sharing a namespace across instances gives you unified visibility. For example, devices and assets connected through different instances at the same site can appear in a single registry.

> [!IMPORTANT]
> Namespace assignment is immutable. A device or asset can't be moved between namespaces after creation. You can recreate a resource in another namespace by using Azure Resource Manager or Bicep templates, but there's no direct move operation. Plan your namespace boundaries carefully before you deploy.

For guidance on when to create a new namespace and when to reuse an existing one, see [Best practices for Azure Device Registry namespaces](best-practices-namespaces.md).

## Namespaces for Azure IoT Operations

For Azure IoT Operations, namespaces are generally available. A namespace organizes the devices and assets that connect at the edge, such as the assets discovered and onboarded through Azure IoT Operations. When you represent these edge devices and assets as Azure Resource Manager resources within a namespace, you can govern, tag, and audit them alongside your other Azure resources.

Each Azure Device Registry namespace can map to an Azure Event Grid instance, which provides consistent routing for capabilities such as [management actions](../../iot-operations/discover-manage-assets/howto-use-management-actions.md). In Azure IoT Operations, namespaces support scenarios where data flows use schemas to describe, transform, and serialize messages from edge assets.

For more information about managing edge devices and assets, see [What is asset and device management in Azure IoT Operations?](../../iot-operations/discover-manage-assets/overview-manage-assets.md).

## Namespaces for Azure IoT Hub

For Azure IoT Hub, namespace support is in preview as part of Azure Device Registry integration. A namespace acts as a unified registry for IoT Hub-connected devices. Azure Device Registry represents each IoT Hub device as an Azure Resource Manager resource, which enables management across multiple Azure IoT Hub instances through a shared namespace.

When you create a new Azure IoT Hub instance, you can link it to an existing namespace or create a new one. The IoT Hub instance uses the linked namespace as a registry for its devices, and multiple IoT Hub instances can share a namespace to support collective device management. Within a namespace, you can use Azure Resource Manager features such as resource groups, tags, RBAC, policies, logging, and auditing, and you can run cross-hub queries with Azure Resource Graph.

Namespaces are also the boundary for preview capabilities that operate on IoT Hub-connected devices at fleet scale, including certificate management, [groups](concept-groups.md), [jobs](concept-jobs.md), and [software updates](concept-software-updates.md).

For more information, see [Integration with Azure Device Registry (preview)](../../iot-hub/iot-hub-device-registry-overview.md).

## Planning constraints and limits

The following limits affect namespace design. For the full list, see [Azure Device Registry limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-device-registry-limits).

| Resource | Limit |
|---|---|
| Namespaces per subscription | 100 |
| Devices per namespace | 10,000 |
| Assets per namespace | 10,000 |

## Related content

- [What is Azure Device Registry?](overview-device-registry.md)
- [Best practices for Azure Device Registry namespaces](best-practices-namespaces.md)
- [Integration with Azure Device Registry (preview) - Azure IoT Hub](../../iot-hub/iot-hub-device-registry-overview.md)
- [What is asset and device management in Azure IoT Operations?](../../iot-operations/discover-manage-assets/overview-manage-assets.md)
- [Best practices for Azure Device Registry schema registries](best-practices-schema-registries.md)
