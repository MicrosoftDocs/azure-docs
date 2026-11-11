---
title: Manage IoT Devices and Assets as Azure Resources
titleSuffix: Azure Device Registry
description: Learn how Azure Device Registry represents assets and devices as Azure resources, manages them across your digital estate, and provides device management features.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: overview
ms.date: 11/09/2026
ai-usage: ai-assisted
#Customer intent: As an IoT solution architect, I want to understand what Azure Device Registry is and how it works across Azure IoT services so that I can manage my devices and assets through the Azure control plane.
---

# What is Azure Device Registry?

Azure Device Registry (ADR) helps you manage assets and devices across your digital estate. It works with Azure IoT Hub and Azure IoT Operations to provide three capabilities:

- **Represent assets and devices as Azure resources.** Use familiar Azure tools to organize resources, control access, and audit changes.
- **Manage across your digital estate.** Query and manage assets and devices across linked IoT hubs and Azure IoT Operations instances, rather than managing each instance separately.
- **Manage devices throughout their lifecycle.** Use [certificate management](../iot-certificate-management-overview.md), [groups (preview)](concept-groups.md), [jobs (preview)](concept-jobs.md), and [software updates (preview)](concept-software-updates.md) for IoT Hub-connected devices.

ADR is generally available for Azure IoT Operations. ADR integration with IoT Hub, including these device management features, is in preview.

## Assets and devices as Azure resources

ADR represents each registered asset and device as an Azure Resource Manager resource with its own resource ID. Use role-based access control (RBAC) to manage access, tags to organize resources, Azure Policy to govern supported resource properties, and Azure Activity Log to audit management operations.

Devices and assets describe different parts of your solution:

- **Devices** identify devices registered through linked IoT hubs. In Azure IoT Operations, a device resource defines connection information, such as the endpoint of an OPC UA server.
- **Assets** define the data and interactions associated with physical equipment or logical entities in Azure IoT Operations, such as an oven's temperature measurements and management actions.

ADR provides the management plane. Azure IoT Hub and Azure IoT Operations handle device connectivity and messaging. In Azure IoT Operations, registered device and asset configuration is synchronized between ADR and Kubernetes custom resources. See [Asset and device management](../../iot-operations/discover-manage-assets/overview-manage-assets.md).

## Management across your digital estate

ADR brings assets and devices from multiple service instances into a shared inventory. Use Azure Resource Graph to find resources across namespaces, subscriptions, and regions. Use Azure Resource Manager APIs and tools to deploy and update them.

### Namespaces

A namespace is the management and access-control boundary for related devices and assets. Each Azure IoT Operations instance or linked IoT hub uses one namespace. Multiple instances or hubs can share a namespace for common management.

Each device and asset belongs to one namespace, and you can't move it directly to another. Plan this boundary before creating resources. See [Namespace concepts](concept-namespaces.md) and [Namespace best practices](best-practices-namespaces.md).

### Schema registries

A schema registry stores message definitions. In Azure IoT Operations, data flows use schemas to describe messages and configure transformations and serialization. Schema registries are also in preview for IoT Hub. For Azure IoT Operations planning guidance, see [Schema registry best practices](best-practices-schema-registries.md).

## Device management features

ADR provides [certificate management](../iot-certificate-management-overview.md) and fleet-scale update capabilities for IoT Hub-connected devices, and management actions for Azure IoT Operations assets. Availability differs by service, as shown in [Service applicability](#service-applicability).

### Certificate management

[Certificate management](../iot-certificate-management-overview.md) for IoT Hub-connected devices is in preview. Manage certificate authorities (CAs), certificate policies, and revocation through ADR. Device Provisioning Service (DPS) and IoT Hub device workflows handle issuance and renewal of operational X.509 certificates.

ADR manages operational certificates, not the onboarding credentials that establish a device's initial identity. An ADR-managed intermediate CA can chain to a Microsoft-managed namespace root or your organization's external root CA. Learn more in [Certificate management concepts](../iot-certificate-management-overview.md).

### Groups (preview), jobs (preview), and software updates (preview)

[Groups (preview)](concept-groups.md), [jobs (preview)](concept-jobs.md), and [software updates (preview)](concept-software-updates.md) let you target IoT Hub-connected devices across linked hubs in the same namespace:

- **[Groups (preview)](concept-groups.md)** define sets of devices by a query filter. Membership is cached and updated when refreshed.
- **[Jobs (preview)](concept-jobs.md)** define and schedule update operations. Software update jobs (preview) target a group; onboarding update jobs (preview) target the namespace.
- **[Software updates (preview)](concept-software-updates.md)** let you import updates and deliver them over the air to compatible devices through these operations. Devices use the update client in the unified Azure IoT SDKs.

For production software update workloads, use [Device Update for IoT Hub](../../iot-hub-device-update/understand-device-update.md), which is generally available.

### Management actions

Management actions let you call methods or read and write values on Azure IoT Operations assets through supported connectors. Invoke actions through Azure Resource Manager APIs or locally through MQTT. Requests initiated through Azure Resource Manager use Azure Event Grid for routing. See [Enable and run management actions](../../iot-operations/discover-manage-assets/howto-use-management-actions.md).

## Service applicability

Availability depends on the connected service:

| Feature | Azure IoT Operations | Azure IoT Hub |
|---|---|---|
| Namespaces and devices | Generally available | Preview |
| Assets | Generally available | Not applicable |
| Schema registries | Generally available | Preview |
| Management actions | Generally available | Not applicable |
| [Certificate management](../iot-certificate-management-overview.md) | Not applicable | Preview |
| [Groups (preview)](concept-groups.md) | Not applicable | Preview |
| [Jobs (preview)](concept-jobs.md) | Not applicable | Preview |
| [Software updates (preview)](concept-software-updates.md) | Not applicable | Preview |

Azure Device Registry integration with IoT Hub is available in preview in these regions:

- Australia East
- Central US
- Japan East
- UK South

> [!IMPORTANT]
> Azure Device Registry integration with Azure IoT Hub is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Related content

- [Get started with Azure Device Registry for IoT Hub (preview)](get-started-azure-device-registry.md)
- [Deploy Azure IoT Operations](../../iot-operations/deploy-iot-ops/howto-deploy-iot-operations.md)
- [Integration with Azure Device Registry (preview) - Azure IoT Hub](../../iot-hub/iot-hub-device-registry-overview.md)
- [Azure Device Registry limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-device-registry-limits)
