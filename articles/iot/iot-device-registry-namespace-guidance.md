---
title: Best practices for Azure Device Registry namespaces
titleSuffix: Azure Device Registry
description: Learn how to design Azure Device Registry namespaces for your IoT solution, including when to create new namespaces and when to reuse existing ones.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: best-practice
ms.date: 04/15/2026
ai-usage: ai-assisted
#Customer intent: As an IoT solution architect, I want to understand how to design my namespace structure so that I can organize devices and assets effectively and avoid rework later.
---

# Best practices for Azure Device Registry namespaces

[Azure Device Registry](../iot-operations/discover-manage-assets/overview-manage-assets.md) uses *namespaces* to organize devices and assets. Because namespaces act as long-lived organizational boundaries, it's important to plan them before you deploy.

This article helps you decide:

- When to create a new namespace or reuse an existing one.
- How to plan namespace boundaries for your solution.

## Service applicability

Namespaces are a feature of Azure Device Registry, which works with both Azure IoT Operations and Azure IoT Hub. The following table summarizes the current applicability:

| Feature | Azure IoT Operations | Azure IoT Hub |
|---|---|---|
| Namespaces | GA | Preview |

## Namespace planning

A namespace is a management and organizational boundary for devices and assets in Azure Device Registry. Every device and asset must belong to exactly one namespace—namespace membership is mandatory and can't be deferred.

### Cardinality rules

- Each Azure IoT Operations instance or IoT Hub maps to exactly one namespace.
- Multiple Azure IoT Operations instances or IoT Hubs can share the same namespace.

Think of a namespace like an Azure Storage account or an Event Grid namespace: it's a parent resource within a resource group that has its own managed identity and service-specific configuration. Multiple child resources belong to one parent, and you plan parent boundaries around organizational, operational, or governance requirements. Apply the same principle to Azure Device Registry namespaces.

> [!IMPORTANT]
> Namespace assignment is immutable. A device or asset can't be moved between namespaces after creation. You can recreate a resource in another namespace by using ARM or Bicep templates, but there's no direct move operation. Plan your namespace boundaries carefully before you deploy.

### When to create a new namespace

Create a new namespace when you need a distinct organizational or governance boundary, for example:

- **Separate operational sites.** A manufacturing company with factories in different cities creates one namespace per factory so that each site has its own device and asset scope.
- **Different business units.** An enterprise with independent divisions (energy, logistics, manufacturing) uses separate namespaces so that each division manages its own assets.
- **Access control isolation.** You need different role-based access control (RBAC) policies for different sets of devices. Because RBAC can be managed at the namespace level, separate namespaces give you a clear security boundary.
- **Service-level separation.** Certain platform capabilities, such as certificate management policies, are enabled or disabled at the namespace level. If you need different settings for different groups of devices, use separate namespaces.

### When to reuse an existing namespace

Reuse an existing namespace when the devices and assets logically belong together, for example:

- **Multiple Azure IoT Operations instances at the same site.** If you run two Azure IoT Operations instances in the same factory, those instances can share a single namespace. Devices and assets are visible across both instances.
- **Mixed connectivity patterns.** A site that uses both Azure IoT Operations (edge-connected) and IoT Hub (cloud-connected) can share a namespace so that all devices appear in a unified registry.
- **Scaling out within one business boundary.** Adding more devices or instances within an existing organizational boundary doesn't require a new namespace.

### Namespace design examples

| Scenario | Recommended design | Rationale |
|---|---|---|
| Single factory, one Azure IoT Operations instance | One namespace | All assets belong to the same site and team. |
| Single factory, two Azure IoT Operations instances | One shared namespace | Both instances serve the same site; sharing gives unified visibility. |
| Three factories in different regions | One namespace per factory | Each site has distinct teams, assets, and access control requirements. |
| Enterprise with separate divisions | One namespace per division | Each division manages its own devices and policies independently. |

## Planning constraints and limits

The following limits affect namespace design. For the full list, see [Azure Device Registry limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-device-registry-limits).

| Resource | Limit |
|---|---|
| Namespaces per subscription | 100 |
| Devices per namespace | 10,000 |
| Assets per namespace | 10,000 |

If your solution approaches these limits, consider whether your namespace design is too fine-grained (too many namespaces, each with few devices) or too coarse (one namespace that exceeds the device limit).

## Related content

- [Best practices for Azure Device Registry schema registries](iot-device-registry-schema-registry-guidance.md)
- [What is asset and device management in Azure IoT Operations?](../iot-operations/discover-manage-assets/overview-manage-assets.md)
- [What is Azure IoT Hub?](../iot-hub/iot-concepts-and-iot-hub.md)
- [What is Azure IoT Operations?](../iot-operations/overview-iot-operations.md)
