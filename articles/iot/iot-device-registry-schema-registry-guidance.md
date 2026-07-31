---
title: Best practices for Azure Device Registry schema registries
titleSuffix: Azure Device Registry
description: Learn how to design Azure Device Registry schema registries for your Azure IoT Operations solution, including when to create new registries and when to reuse existing ones.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: best-practice
ms.date: 04/15/2026
ai-usage: ai-assisted
#Customer intent: As an IoT solution architect, I want to understand how to design my schema registry structure so that I can manage message schemas effectively and avoid unnecessary duplication.
---

# Best practices for Azure Device Registry schema registries

The [schema registry](../iot-operations/connect-to-cloud/concept-schema-registry.md), a feature of [Azure Device Registry](../iot-operations/discover-manage-assets/overview-manage-assets.md), is a synchronized repository that's accessible both in the cloud and at the edge. It stores definitions of messages coming from edge assets and exposes an API to access those schemas from either location.

This article helps you decide:

- When to create a new schema registry or reuse an existing one.
- Best practices for schema registry sharing.

## Service applicability

Schema registries are currently used only in Azure IoT Operations scenarios, where data flows use schemas to describe, transform, and serialize messages. The schema registry is accessible both at the edge and in the cloud, enabling consistent schema management across your solution.

| Feature | Azure IoT Operations | Azure IoT Hub |
|---|---|---|
| Schema registries | GA | Not applicable |

For more information about schema registries, see [Understand message schemas](../iot-operations/connect-to-cloud/concept-schema-registry.md).

## Cardinality rules

- Each Azure IoT Operations instance maps to exactly one schema registry.
- Multiple Azure IoT Operations instances can share the same schema registry.
- A schema registry is scoped to an Azure resource group and backed by an Azure Storage account.

Sharing a schema registry within organizational or site boundaries is the recommended default. Create a separate registry only when schemas are genuinely independent or when different storage accounts are required.

## When to create a new schema registry

Create a new schema registry only when the schemas are genuinely independent, for example:

- **Completely separate sites** with no shared asset types or message formats.
- **Different storage accounts** are required for schema storage at different sites.

## When to reuse an existing schema registry

In most cases, reuse an existing schema registry:

- **Multiple Azure IoT Operations instances at the same site** should share one schema registry. Message schemas logically originate from the assets and devices at a site, so there's no meaningful benefit to creating a separate registry for each instance.
- **Sites with overlapping asset types** benefit from sharing schemas rather than duplicating them across registries.

## Best practices for schema registry sharing

| Best practice | Why | How |
|---|---|---|
| Share a common schema registry within organizational or site boundaries | Avoids unnecessary duplication and reduces management overhead. Schemas logically belong to the assets and devices at a site, not to individual instances. | When you deploy multiple Azure IoT Operations instances at the same site, point them all to the same schema registry. |
| Review deployment defaults before accepting them | Azure IoT Operations deployment scripts prompt you to create a new schema registry, which can lead to unintended proliferation. | During deployment, specify an existing schema registry if one already exists for your site or organizational boundary. |

## Planning constraints and limits

The following limit affects schema registry design. For the full list, see [Azure Device Registry limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-device-registry-limits).

| Resource | Limit |
|---|---|
| Schema registries per subscription | 100 |

## Related content

- [Best practices for Azure Device Registry namespaces](iot-device-registry-namespace-guidance.md)
- [Understand message schemas](../iot-operations/connect-to-cloud/concept-schema-registry.md)
- [What is asset and device management in Azure IoT Operations?](../iot-operations/discover-manage-assets/overview-manage-assets.md)
- [What is Azure IoT Operations?](../iot-operations/overview-iot-operations.md)
