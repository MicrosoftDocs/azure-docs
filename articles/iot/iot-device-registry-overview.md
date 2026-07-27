---
title: Manage IoT Devices and Assets as Azure Resources
titleSuffix: Azure Device Registry
description: Learn how Azure Device Registry provides a unified control plane that represents your IoT devices and assets as Azure resources across Azure IoT services.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: overview
ms.date: 07/14/2026
ai-usage: ai-assisted
#Customer intent: As an IoT solution architect, I want to understand what Azure Device Registry is and how it works across Azure IoT services so that I can manage my devices and assets through the Azure control plane.
---

# What is Azure Device Registry?

Azure Device Registry is a unified registry that represents your IoT devices and assets as Azure Resource Manager resources. By projecting devices and assets into the Azure control plane, Azure Device Registry gives you a consistent way to deploy, govern, query, and secure them by using the same tools you already use for other Azure resources.

Azure Device Registry works with both Azure IoT Operations and Azure IoT Hub (integration with Azure IoT Hub is currently in preview), so you can manage devices and assets across your edge and cloud solutions through a single, uniform interface.

## Azure Device Registry as the control plane

Traditionally, you manage IoT devices through service-specific data planes that are separate from the Azure management plane. Azure Device Registry closes that gap by representing each device and asset as an Azure Resource Manager resource with its own resource ID. This approach extends the Azure control plane to your IoT estate and provides:

- **Unified governance**: Apply role-based access control (RBAC), tags, resource groups, and Azure Policy to devices and assets the same way you do for other Azure resources.
- **At-scale querying**: Use Azure Resource Graph to query devices and assets across services, subscriptions, and regions.
- **Consistent operations**: Perform metadata updates, auditing, and lifecycle management through a single interface instead of per-service tools.

Because devices and assets are Azure Resource Manager resources, they participate in the standard Azure deployment, policy enforcement, and logging experiences.

## Key capabilities: namespaces, devices, assets, schema registries, and certificate management

Azure Device Registry organizes and manages your IoT estate through the following capabilities.

### Namespaces

A *namespace* is a management and organizational boundary for devices and assets in Azure Device Registry. Every device and asset belongs to exactly one namespace. A namespace groups related devices and assets, establishes a security boundary, and supports management at scale through RBAC, tags, and policies.

Each Azure IoT Operations instance or Azure IoT Hub maps to a single namespace, and multiple instances or hubs can share one namespace for broader management scenarios. For guidance on planning namespaces, see [Best practices for Azure Device Registry namespaces](iot-device-registry-namespace-guidance.md).

### Devices and assets

Azure Device Registry represents both *devices* and *assets* as Azure Resource Manager resources:

- **Devices** are the IoT devices connected to your solution, such as the devices that Azure IoT Hub manages or the devices connected through Azure IoT Operations.
- **Assets** are the physical or logical items in your environment, such as OPC UA servers or industrial equipment connected through Azure IoT Operations.

When you represent devices and assets as Azure Resource Manager resources, you can govern, tag, and audit them consistently through the Azure control plane.

### Schema registries

A *schema registry* is a feature of Azure Device Registry that stores the definitions of messages coming from edge assets. Schema registries support Azure IoT Operations scenarios, where data flows use schemas to describe, transform, and serialize messages. For guidance on planning schema registries, see [Best practices for Azure Device Registry schema registries](iot-device-registry-schema-registry-guidance.md).

### Certificate management

Certificate management is a feature of Azure Device Registry that enables you to issue, renew, and revoke X.509 certificates for your IoT Hub devices through a Microsoft-backed certificate authority. By managing certificates through Azure Device Registry, you can handle the full certificate lifecycle for Hub-connected devices from the Azure control plane. Certificate management for Hub-connected devices is currently in preview. For more information, see [What is certificate management in Azure Device Registry?](../iot-hub/iot-hub-certificate-management-overview.md).

## Service applicability

Azure Device Registry is generally available (GA) for Azure IoT Operations scenarios. Integration with Azure IoT Hub is currently in preview. The following table summarizes the current applicability:

| Feature | Azure IoT Operations | Azure IoT Hub |
|---|---|---|
| Azure Device Registry | GA | Preview |
| Namespaces | GA | Preview |
| Schema registries | GA | Not applicable |
| Certificate management | Not applicable | Preview |

> [!IMPORTANT]
> Azure Device Registry integration with Azure IoT Hub is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## How Azure Device Registry works with Azure IoT services

Azure Device Registry provides a common control plane that spans multiple Azure IoT services. The following diagram shows how Azure Device Registry sits between the Azure management plane and the underlying IoT services.

<!-- Mermaid source (render with mmdc to regenerate the SVG):
graph TB
    MP["Azure management plane\n(RBAC, Azure Policy, Resource Graph)"]
    ADR["Azure Device Registry\nunified control plane"]
    AIO["Azure IoT Operations\nedge devices and assets (GA)"]
    Hub["Azure IoT Hub\ncloud-connected devices (preview)"]
    MP --\> ADR
    ADR --\> AIO
    ADR --\> Hub
-->

:::image type="content" source="./media/iot-device-registry-overview/azure-device-registry-architecture.svg" alt-text="Diagram showing Azure Device Registry as the unified control plane between the Azure management plane and Azure IoT Operations and Azure IoT Hub.":::

### Azure IoT Operations

In Azure IoT Operations, Azure Device Registry is generally available and manages the devices and assets connected at the edge. Azure Device Registry represents assets discovered and onboarded through Azure IoT Operations, where you can manage them alongside your other Azure resources. For more information, see [What is asset and device management in Azure IoT Operations?](../iot-operations/discover-manage-assets/overview-manage-assets.md).

### Azure IoT Hub

In Azure IoT Hub, Azure Device Registry integration is in preview. Azure Device Registry represents each Azure IoT Hub device as an Azure Resource Manager resource, which enables management across multiple Azure IoT Hub instances through shared namespaces. Azure Device Registry also provides certificate management for Hub-connected devices, enabling you to issue, renew, and revoke X.509 device certificates from the Azure control plane. For more information, see [Integration with Azure Device Registry (preview)](../iot-hub/iot-hub-device-registry-overview.md) and [What is certificate management in Azure Device Registry?](../iot-hub/iot-hub-certificate-management-overview.md).

## Related content

- [Best practices for Azure Device Registry namespaces](iot-device-registry-namespace-guidance.md)
- [Best practices for Azure Device Registry schema registries](iot-device-registry-schema-registry-guidance.md)
- [Integration with Azure Device Registry (preview) - Azure IoT Hub](../iot-hub/iot-hub-device-registry-overview.md)
- [What is certificate management in Azure Device Registry?](../iot-hub/iot-hub-certificate-management-overview.md)
- [What is asset and device management in Azure IoT Operations?](../iot-operations/discover-manage-assets/overview-manage-assets.md)
