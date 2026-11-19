---
title: Software Updates Concepts (Preview)
titleSuffix: Azure Device Registry
description: Learn how software updates in Azure Device Registry let you import updates and deploy them over the air to your devices by using groups and jobs in a namespace.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: concept-article
ms.date: 11/11/2026
ai-usage: ai-assisted
#Customer intent: As an IoT solution architect, I want to understand the Azure Device Registry software updates capability so that I can plan how to prepare, deploy, and monitor updates across my device fleet.
---

# Software updates concepts (preview)

Use *Software updates*, a capability of Azure Device Registry, to deliver over-the-air updates to your devices at scale. Import updates into an Azure Device Registry namespace, and then use [jobs](concept-jobs.md) and [groups](concept-groups.md) in that namespace to deploy them to devices.

[!INCLUDE [Relationships between groups, jobs, and software updates](includes/groups-jobs-software-updates.md)]

> [!IMPORTANT]
> Azure Device Registry software updates is currently in preview. The current preview is scoped to IoT Hub-connected devices. Don't use preview features for production workloads. For production workloads, continue to use [Device Update for IoT Hub](../../iot-hub-device-update/understand-device-update.md), which remains generally available.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Service applicability

| Feature | Azure IoT Operations | Azure IoT Hub |
|---|---|---|
| Software updates | Not applicable | Preview |

## Choose between software updates and Device Update for IoT Hub

Software updates uses the same import manifest format as [Device Update for IoT Hub](../../iot-hub-device-update/understand-device-update.md), but you manage updates in an Azure Device Registry namespace instead of in a Device Update account. Use the following table to choose the right option:

| If you... | Use |
|---|---|
| Need over-the-air updates for production workloads | [Device Update for IoT Hub](../../iot-hub-device-update/understand-device-update.md), which remains generally available and supported. |
| Want to evaluate managing updates through Azure Device Registry namespaces, groups, and jobs | Software updates (preview), described in this article. |

Keep the following considerations in mind if you already use Device Update for IoT Hub:

- **You can't use both on the same IoT hub.** In this preview, you can't use software updates with an IoT hub that has a Device Update for IoT Hub instance. Connect a new or existing IoT hub that doesn't have one. To use an IoT hub that already has a Device Update for IoT Hub instance, delete that instance first.
- **Devices use a different client.** Devices that run the [Device Update agent](../../iot-hub-device-update/device-update-agent-overview.md) can't receive updates from software updates. To receive software updates, a device uses the software updates client in the [unified Azure IoT SDKs (preview)](concept-unified-iot-sdks.md).

## How software updates work

You enable software updates on an Azure Device Registry namespace, either when you set up the namespace or later. To learn how, see [Get started with Azure Device Registry for Azure IoT Hub](get-started-azure-device-registry.md). The capability introduces the following components:

- **Software update.** An update that you import into a namespace. A software update consists of one or more update files and an import manifest. After you import a software update, it's available to software update jobs and onboarding update jobs in that namespace.
- **Software update job.** Applies a software update to the compatible devices in a target group.
- **Onboarding update job.** Applies a software update to compatible devices when they check for updates during onboarding, before they register and start operating.
- **Software updates client.** The part of the [unified Azure IoT SDKs (preview)](concept-unified-iot-sdks.md) that your device application uses to check for, download, and install software updates, and to report the results.

A typical update flow looks like this:

1. You upload the update files and the import manifest to an Azure Storage container.
1. You [import the software update](how-to-import-software-update.md) into your namespace.
1. You create a job that targets a [group](how-to-deploy-software-update-group.md) or, for onboarding, the [namespace](how-to-deploy-onboarding-update-namespace.md).
1. Each device checks for updates and reports its compatibility properties. If the device is compatible, it receives the update.
1. The device downloads and installs the update, and then reports the result. You monitor progress and device-level results in the job run.

## Software updates

A software update consists of two components that you upload together:

- **Update files.** The payload that the device installs. The payload can be a firmware image, a software package, a script, or multiple related files.
- **Import manifest.** A JSON file with the `.importmanifest.json` extension that describes the update. The import manifest declares:
  - **Update identity.** The provider, name, and version that uniquely identify the update. The provider and name together identify an *update family*, such as all versions of the firmware for one device model.
  - **Compatibility properties.** The device properties that determine which devices can install the update. For more information, see [Device compatibility](#device-compatibility).
  - **Installation instructions.** The installation steps, their order, and the *handler* for each step. The handler tells the device how to apply that step, such as by installing a package, running a script, or writing an image.
  - **File metadata.** The name, size, and hash of each update file. The service uses the hashes to verify file integrity at import, and the device can use them to verify each file before installation.

Every software update requires an import manifest. If you try to import update files without an import manifest, the import fails. When you import, you can optionally scan the update files for malware. Malware scanning is available in select regions. For step-by-step instructions, see [Import a software update](how-to-import-software-update.md).

The following example shows an import manifest for an image-based update:

```json
{
  "updateId": {
    "provider": "Contoso",
    "name": "IrrigationControllerV2-Image",
    "version": "1.3.0"
  },
  "isDeployable": true,
  "compatibility": [
    {
      "manufacturer": "Contoso",
      "model": "IrrigationControllerV2"
    }
  ],
  "instructions": {
    "steps": [
      {
        "type": "inline",
        "description": "Update the device image to version 1.3.0",
        "handler": "microsoft/swupdate:1",
        "files": [
          "contoso-irrigation-controller-v2-1.3.0.swu"
        ],
        "handlerProperties": {
          "installedCriteria": "1.3.0"
        }
      }
    ]
  },
  "files": [
    {
      "filename": "contoso-irrigation-controller-v2-1.3.0.swu",
      "sizeInBytes": 112738816,
      "hashes": {
        "sha256": "wPdNKUSmWTZkR6Pum9oR/EIzdn5AvON4dsXME+/gHVw="
      }
    }
  ],
  "createdDateTime": "2026-10-01T06:56:51.2002204Z",
  "manifestVersion": "5.0"
}
```

To learn how to author an import manifest, see:

- [Import manifest schema](../../iot-hub-device-update/import-schema.md)
- [Multistep ordered execution](../../iot-hub-device-update/device-update-multi-step-updates.md)

## Device compatibility

The compatibility properties in an import manifest determine which devices can install a software update. When a device checks for updates, it reports its own compatibility properties. Azure Device Registry compares those properties with the compatibility properties declared in the software update.

You define compatibility properties as name-value pairs. Every software update must declare at least one compatibility property. `manufacturer` and `model` are common choices, but they're not required. Use any properties that fit your fleet, such as `region` or `environment`.

The `compatibility` section of the import manifest is an array of property sets. For example:

```json
"compatibility": [
  {
    "manufacturer": "Contoso",
    "model": "IrrigationControllerV2"
  }
]
```

Matching works as follows:

- **A device must match every property in a set.** The preceding update applies only to devices that report both `manufacturer` as `Contoso` and `model` as `IrrigationControllerV2`. It doesn't apply to a Contoso `SoilSensorV1` device, or to an `IrrigationControllerV2` device that reports a different manufacturer.
- **A device needs to match only one set.** If you declare more than one property set, a single software update can apply to multiple device types.
- **Each property set belongs to one update family.** You can't use the exact same set of compatibility properties with more than one provider and name combination. Plan your update families and compatibility properties together. For more information, see [Import concepts](../../iot-hub-device-update/import-concepts.md).

A group can contain devices with different compatibility properties. A software update job applies the update only to the compatible devices in the target group. For example, if a group contains 18 `IrrigationControllerV2` devices and six `SoilSensorV1` devices, an update for `IrrigationControllerV2` devices is applied to the 18 compatible devices. The six `SoilSensorV1` devices aren't affected.

## Deploy software updates

To deploy an imported software update, create a [job](concept-jobs.md) in the namespace. A [group](concept-groups.md) defines *which devices* to target, and a job defines *what to do and when*. Create one of the following jobs:

- **Software update job.** Targets a group of registered devices. For steps, see [Deploy a software update to a group](how-to-deploy-software-update-group.md).
- **Onboarding update job.** Targets the namespace instead of a group, and updates devices while they onboard. For steps, see [Deploy an onboarding update to a namespace](how-to-deploy-onboarding-update-namespace.md).

### Which devices receive the update

**Software update job.** When a run starts, it delivers the update to the compatible devices in the target group that are online. While the run is active, it also delivers the update to:

- **Devices that reconnect.** Compatible devices in the target group that were offline when the run started, after they reconnect and check for updates.
- **Devices that join the group.** Compatible devices that join the target group after the run starts. Group membership isn't updated automatically, so new devices join the group only after you refresh its membership. For more information, see [Cached membership and refresh](concept-groups.md#cached-membership-and-refresh).
- **Devices that become compatible.** Devices in the target group that become compatible after the run starts, for example, because their reported compatibility properties change.

**Onboarding update job.** The run remains active until you end it, so compatible devices continue to receive the update as they onboard.

For job states, scheduling, retries, and monitoring, see [Jobs concepts (preview)](concept-jobs.md).

## Access control

Access to software updates is split between two resources:

- **Namespace.** Roles on the namespace control access to the namespace and its jobs.
- **Software update instance.** Roles on the software update instance that's linked to the namespace control access to imported software updates. Azure Resource Manager roles such as Owner and Contributor don't include this access, even if you created the namespace.

Assign the following roles to each user or Microsoft Entra group, based on the tasks they perform. A user who imports updates and deploys them needs roles on both resources. To find the linked software update instance, open the namespace and select the **Linked services** tab.

The following table lists the minimum built-in role for each task. Roles with more permissions on the same resource also work. For example, Contributor on the namespace includes everything that Reader allows.

| Task | Minimum built-in role | Assign the role on |
|---|---|---|
| View the namespace, its jobs, and job run results | [Reader](../../role-based-access-control/built-in-roles/general.md#reader) | Namespace |
| Create, run, update, and delete software update jobs and onboarding update jobs | [Contributor](../../role-based-access-control/built-in-roles/privileged.md#contributor) | Namespace |
| View imported software updates | [Device Update Content Reader](../../role-based-access-control/built-in-roles/internet-of-things.md#device-update-content-reader) | Software update instance linked to the namespace |
| Import and delete software updates | [Device Update Content Administrator](../../role-based-access-control/built-in-roles/internet-of-things.md#device-update-content-administrator) | Software update instance linked to the namespace |

Keep the following points in mind:

- **Import also needs storage access.** For details, see the prerequisites in [Import a software update](how-to-import-software-update.md#prerequisites).
- **User roles are separate from service roles.** The namespace and the software update instance communicate by using managed identities. Connecting the software update instance to the namespace creates those role assignments. For details, see [Role assignments created during setup](get-started-azure-device-registry.md#role-assignments-created-during-setup).

If you open **Software updates (preview)** in a namespace and see the message "Contact your administrator to request access to view and manage software updates for this namespace," you don't have a role on the software update instance that lets you view imported software updates, such as Device Update Content Reader. The **Imports** page might also show **No updates to display**, with **Import** and **Delete** unavailable.

To request access, ask someone who can assign roles on the namespace or the software update instance, such as an Owner or User Access Administrator, to assign you the role that you need. For steps, see [Assign Azure roles by using the Azure portal](../../role-based-access-control/role-assignments-portal.md). A new role assignment can take a few minutes to take effect.

## Device SDK considerations

Devices receive software updates through the software updates client in the [unified Azure IoT SDKs (preview)](concept-unified-iot-sdks.md). Keep the following considerations in mind when you plan your device software:

- **Supported devices.** In this preview, the software updates client is primarily intended for Linux-based devices with more than 32 MB of available memory.
- **Integration.** The SDK is a library, not a ready-to-run agent. You integrate the software updates client into your device application and provide the logic that downloads, installs, and applies updates on your hardware. Microsoft provides samples to help you get started.
- **Two ways to check for updates.** A device that's being onboarded checks for onboarding updates before it registers. A registered device checks for software updates from a software update job. Your device application decides when to check for updates.
- **Connectivity.** The device checks for updates and reports results over its Device Provisioning Service connection. It doesn't need a separate endpoint or credential to receive updates.
- **Security.** Before it downloads any update files, the software updates client verifies the signature of the update information that it receives from the service. Devices download update files only over HTTPS, so update content is always encrypted in transit. Ensure that your devices can make outbound HTTPS connections to download update files.
- **Status reporting.** After an installation attempt, the device reports the result, including error codes if the installation failed. The result appears in the device-level results of the job run.
- **Your responsibility.** You're responsible for validating the integration in your own environment, including recovery behavior if an installation fails or the device restarts during an update.

## Preview limitations

The current preview has the following limitations:

- Software updates supports IoT Hub-connected devices. Azure IoT Operations devices and assets aren't supported in this preview.
- You can't use software updates with an IoT hub that has a Device Update for IoT Hub instance. For more information, see [Choose between software updates and Device Update for IoT Hub](#choose-between-software-updates-and-device-update-for-iot-hub).
- Software updates isn't supported for the **MQTT v5 (preview)** connection profile.
- Setting up software updates for a namespace can take up to 30 minutes.
- You can't create an import manifest in the Azure portal.
- The software updates client doesn't currently support proxy updates or updates that use reference steps (parent and child updates).

For limits that apply to imported updates, such as the maximum update size, see [Device Update for IoT Hub limits](../../iot-hub-device-update/device-update-limits.md). For limits that apply to groups and jobs, see [Groups concepts (preview)](concept-groups.md#limits-and-preview-restrictions) and [Jobs concepts (preview)](concept-jobs.md#limits).

## Related content

- [Get started with Azure Device Registry (preview)](get-started-azure-device-registry.md)
- [Import a software update](how-to-import-software-update.md)
- [Deploy a software update to a group](how-to-deploy-software-update-group.md)
- [Deploy an onboarding update to a namespace](how-to-deploy-onboarding-update-namespace.md)
- [Groups concepts (preview)](concept-groups.md)
- [Jobs concepts (preview)](concept-jobs.md)
- [Unified Azure IoT SDKs (preview)](concept-unified-iot-sdks.md)
