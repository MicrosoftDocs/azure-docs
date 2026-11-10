---
title: Integration with Azure Device Registry
titleSuffix: Azure IoT Hub
description: This article discusses the basic concepts of how Azure Device Registry helps users manage IoT devices.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
services: iot-hub
ms.topic: overview
ms.date: 11/07/2026
#Customer intent: As a developer new to IoT, i want to understand what Azure Device Registry is and how it can help me manage my IoT devices.
---

# Integration with Azure Device Registry

This article provides background on generally available Azure Device Registry linking for Standard IoT hubs. Linking is supported for new and eligible existing Standard hubs.

## What is Azure Device Registry?

Azure Device Registry represents industrial assets and IoT devices as Azure Resource Manager resources, extending the Azure management plane to IoT. It provides a consistent experience for deployment, policy enforcement, querying, and control plane operations.

In the IoT Hub context, Azure Device Registry provides a management foundation for IoT Hub-connected devices across linked services. You can [link a new or existing eligible Standard hub](iot-hub-device-registry-setup.md) to a new or existing namespace. Multiple IoT Hub instances can share a namespace, supporting collective device management across hubs.

> [!NOTE]
> ADR linking doesn't change a hub's connection profile or automatically migrate device credentials. The MQTT v5 connection profile remains in preview. Certificate management through Standard IoT Hub is generally available except for MQTT v5-profile hubs; those devices continue to use DPS for supported operational certificate issuance and renewal.

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

For hub limits and capacity planning, see [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md). Hub identity capacity, namespace resource limits, and provisioning rates are separate constraints.

For Azure subscription and service limits for Azure Device Registry in GA, see [Azure Device Registry limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-device-registry-limits).

## Related content

- [FAQ: What is new in Azure IoT Hub?](iot-hub-faq.md)
- [Get started with Azure Device Registry and certificate management in IoT Hub](iot-hub-device-registry-setup.md)
- [Certificate management in Azure Device Registry](../iot/iot-certificate-management-overview.md)
- [Key concepts for certificate management](../iot/iot-certificate-management-concepts.md)
- [Unified Azure IoT SDKs (preview) for IoT Hub and Azure Device Registry](../iot/device-registry/concept-unified-iot-sdks.md)
