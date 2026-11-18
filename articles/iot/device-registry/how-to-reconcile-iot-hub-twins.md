---
title: Reconcile IoT Hub device twin metadata with Azure Device Registry devices
titleSuffix: Azure Device Registry
description: Learn why to reconcile selected IoT Hub device twin metadata with Azure Device Registry device resources so you can use the metadata with supported Azure Device Registry capabilities.
author: jesusbar
ms.author: jesusbar
ms.service: azure-iot
ms.topic: how-to
ms.date: 11/15/2026
ai-usage: ai-assisted
---

# Reconcile IoT Hub device twin metadata with Azure Device Registry devices

Azure Device Registry (ADR) uses supported `RegistryDevice` properties and Azure resource tags as device metadata. If metadata that you want to use with an ADR capability exists only in an IoT Hub device twin, ensure the corresponding metadata is also available on the ADR `RegistryDevice` resource.

This article explains how to identify and reconcile that metadata. For example, you might map manufacturer, model, and firmware information reported through an IoT Hub device twin to the corresponding ADR device properties.

You can use the reconciled metadata with generally available ADR capabilities that consume these properties, such as [Firmware Analysis](../../firmware-analysis/firmware-analysis-integration-with-azure-device-registry.md). Other capabilities that can use `RegistryDevice` metadata, including [ADR groups](concept-groups.md) and [jobs](concept-jobs.md), are currently in preview.

> [!IMPORTANT]
> Some Azure Device Registry capabilities described in this article, including groups and jobs, are in preview. Using supported `RegistryDevice` properties and resource tags isn't limited to these preview capabilities.
>
> Preview functionality is provided without a service-level agreement and isn't recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Understand IoT Hub and ADR metadata

An IoT Hub device twin and its corresponding Azure Device Registry resource can contain metadata that represents the same physical device, but you shouldn't assume that values stored in arbitrary IoT Hub twin properties are automatically represented as ADR `RegistryDevice` properties or resource tags.

For example, a solution might report the following values through the IoT Hub device twin:

- Manufacturer
- Model
- Firmware version
- Solution-specific device classifications or other operational metadata

If an ADR capability requires equivalent metadata, check the corresponding ADR resource and populate the supported `RegistryDevice` properties or Azure resource tags that the capability uses.

For information about connecting IoT Hub with Azure Device Registry, see [Get started with Azure Device Registry for Azure IoT Hub](get-started-azure-device-registry.md).

## Map device twin metadata to ADR metadata

IoT Hub reported properties are application-defined. The device or solution can use any property names and structure under `properties.reported`; Azure Device Registry doesn't require specific IoT Hub reported-property names.

The exact mapping is therefore solution-specific. Identify the reported properties that contain the metadata you need, then map those values to the appropriate ADR properties or resource tags.

For example, a solution could use mappings like the following. The IoT Hub property names shown here are examples only:

| Example IoT Hub reported property | Azure Device Registry metadata | Considerations |
|---|---|---|
| `properties.reported.<manufacturer-property>` | `properties.manufacturer` | Map the reported property that your solution uses for the device manufacturer. |
| `properties.reported.<model-property>` | `properties.model` | Map the reported property that your solution uses for the device model. |
| `properties.reported.<firmware-version-property>` | `properties.softwareRevision` | Map the value only when your solution treats the reported firmware version as the ADR software revision. |
| Solution-specific classification | Azure resource tag, such as `tags.deviceType` | Use resource tags for metadata that doesn't correspond to a supported `RegistryDevice` property and is appropriate for Azure resource tagging. |

The IoT Hub property paths in this table are examples. Your device twin might use different property names, casing, or nesting. Define the mapping according to the twin schema and metadata contract used by your solution.

Similarly, mapping a firmware-version value to `softwareRevision` is an example and doesn't imply semantic equivalence for every solution.

`tags.deviceType` is an Azure resource tag. It isn't the separate **Device type** field displayed for a device in Azure Device Registry.

For the properties that you can update on a `RegistryDevice`, use the Azure portal directly or see [Registry Devices - Update](/rest/api/deviceregistry/registry-devices/update).

## Reconcile the metadata

You can reconcile metadata manually or automate the operation as part of your device-management workflow.

A reconciliation process typically performs the following steps:

1. Identify the IoT Hub device and its corresponding ADR `RegistryDevice`.
1. Read the IoT Hub device twin.
1. Read the corresponding ADR device metadata.
1. Apply your solution's mapping between twin properties and ADR properties or resource tags.
1. Compare the source and destination values.
1. Update only the ADR metadata that needs to change.
1. Verify the resulting `RegistryDevice` metadata before using it with dependent ADR capabilities.

When matching resources, use an explicit identifier that your solution controls. For example, if your ADR integration uses the IoT Hub device ID as the `RegistryDevice` external device ID, verify that relationship before updating the resource.

> [!IMPORTANT]
> Treat reconciliation as a deliberate data-management operation. Before performing fleet-scale updates, validate the source of truth for each field, permissions, matching logic, API version, service limits, concurrency behavior, and recovery process for your environment.

The ADR update API supports properties including `manufacturer`, `model`, and `softwareRevision`, along with Azure resource tags. For the complete request schema and currently supported API version, see [Registry Devices - Update](/rest/api/deviceregistry/registry-devices/update).

For information about reading IoT Hub device twins, see [Understand and use device twins in IoT Hub](../../iot-hub/iot-hub-devguide-device-twins.md).

## Choose when to reconcile

How often you reconcile depends on which system owns the metadata and how quickly changes need to become available to ADR capabilities.

Common approaches include:

- **On demand** - Reconcile metadata before using an ADR capability that depends on the values.
- **As part of device onboarding** - Populate ADR metadata when a device is registered or provisioned.
- **After relevant metadata changes** - Update ADR when your solution detects a change to a source value, such as a firmware version.
- **Periodic reconciliation** - Compare the source and ADR values on a schedule when immediate consistency isn't required.

If IoT Hub reported properties are the source, remember that they're device-reported state. Consider when the device last reported the value and whether that value is sufficiently current for the ADR operation you're about to perform.

For fleet-wide discovery through IoT Hub queries, also account for the query behavior of IoT Hub. For more information, see [IoT Hub query language for device and module twins, jobs, and message routing](../../iot-hub/iot-hub-devguide-query-language.md).

## Use the metadata with ADR groups (preview)

ADR groups can use supported `RegistryDevice` properties and resource tags when defining group membership.

For example:

```text
WHERE tags.deviceType = 'truck'
WHERE tags.deviceType = 'bin'
WHERE manufacturer = 'Contoso' AND model = 'WT-3000'
```

These filters are examples. They don't automatically create groups.

A group is evaluated against devices represented in the ADR namespace, so ensure the metadata is reconciled before you create or refresh a group that depends on it.

Group membership is cached rather than continuously reevaluated. After changing device metadata, refresh the group membership when appropriate and wait until the group returns to the `Ready` state before depending on the updated membership.

For supported properties, query operators, refresh behavior, and current preview limitations, see [Groups concepts (preview)](concept-groups.md).

## Use the metadata with Firmware Analysis

Firmware Analysis can associate firmware images and analysis results with Azure Device Registry resources by using shared metadata.

The following example mappings are relevant when firmware information originates in IoT Hub:

| IoT Hub reported property | Azure Device Registry property | Firmware Analysis metadata |
|---|---|---|
|  `properties.reported.<manufacturer-property>`  | `manufacturer` | Vendor |
| `properties.reported.<model-property>` | `model` | Model |
| `properties.reported.<firmware-version-property>` | `softwareRevision` | Firmware version |

When the applicable metadata values match, Firmware Analysis can associate firmware images and their analysis results with the corresponding Azure Device Registry resources.

For the required metadata and association behavior, see [Firmware analysis integration with Azure Device Registry](../../firmware-analysis/firmware-analysis-integration-with-azure-device-registry.md).

## Design considerations

Consider the following points when you implement metadata reconciliation:

- **Define the source of truth.** Decide whether IoT Hub reported properties, another service, or ADR owns each metadata value. Don't overwrite ADR metadata simply because a different value exists in the twin unless that twin property is authoritative for your solution.
- **Use explicit mappings.** Don't assume that similarly named fields have identical semantics. For example, a solution-specific firmware version might map to `softwareRevision`, but that relationship should be defined by your device model.
- **Preserve unrelated metadata.** An update shouldn't unintentionally remove existing resource tags or ADR properties that aren't part of the reconciliation operation.
- **Handle missing values deliberately.** Decide whether a missing or empty twin value means "leave the ADR value unchanged" or "clear the ADR value." Don't make this decision implicitly.
- **Validate device matching.** Ensure that the IoT Hub identity maps to the expected ADR resource before writing changes. Avoid updating a resource when the mapping is missing or ambiguous.
- **Plan for concurrent updates.** If another application can update the same ADR metadata, account for concurrency and avoid overwriting unrelated changes.
- **Use least-privilege access.** The identity performing reconciliation needs only the permissions required to read the source metadata and update the applicable ADR resources.
- **Test before fleet-scale updates.** Validate mappings and resulting ADR behavior with a small set of devices before applying the workflow across a fleet.
- **Reconcile before dependent operations.** If a group, firmware workflow, job, or other capability depends on the metadata, make sure the required ADR values are current before you use that capability.

## Possible reconciliation implementation

How you implement reconciliation depends on your device twin schema, device identity model, and operational requirements.

One possible implementation could:

- Read the relevant reported properties from IoT Hub device twins.
- Match each IoT Hub device to the corresponding ADR `RegistryDevice`.
- Map the solution-defined twin properties to the appropriate ADR properties or resource tags.
- Compare the current values and identify differences.
- Preview proposed changes before applying them.
- Update only the ADR metadata that needs to change.
- Record updated, unchanged, unmatched, and failed devices for review.

For fleet-scale reconciliation, consider authentication and authorization, API versions, pagination, throttling, concurrency, retries, error handling, and service limits for your environment.

For the relevant APIs and concepts, see:

- [Registry Devices - Update](/rest/api/deviceregistry/registry-devices/update)
- [Understand and use device twins in IoT Hub](../../iot-hub/iot-hub-devguide-device-twins.md)
- [IoT Hub query language for device and module twins, jobs, and message routing](../../iot-hub/iot-hub-devguide-query-language.md)
- [Groups concepts (preview)](concept-groups.md)
- [Firmware analysis integration with Azure Device Registry](../../firmware-analysis/firmware-analysis-integration-with-azure-device-registry.md)

## Related content

- [Get started with Azure Device Registry for Azure IoT Hub](get-started-azure-device-registry.md)
- [Groups concepts (preview)](concept-groups.md)
- [Registry Devices - Update REST API](/rest/api/deviceregistry/registry-devices/update)
- [Understand and use device twins in IoT Hub](../../iot-hub/iot-hub-devguide-device-twins.md)
- [IoT Hub query language for device and module twins, jobs, and message routing](../../iot-hub/iot-hub-devguide-query-language.md)
- [Firmware analysis integration with Azure Device Registry](../../firmware-analysis/firmware-analysis-integration-with-azure-device-registry.md)
