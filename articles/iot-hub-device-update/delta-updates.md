---
title: Azure Device Update for IoT Hub delta updates | Microsoft Learn
description: Understand key concepts for using delta or differential updates with Azure Device Update for IoT Hub.
author: isabellaecr
ms.author: isabellaecr
ms.date: 04/22/2026
ms.topic: feature-guide
ms.service: azure-iot-hub
ms.subservice: device-update
---


# Delta updates

Deploying updates to IoT devices at scale can be constrained by bandwidth, connectivity, and the size of update content—especially for devices connected over cellular or metered networks.

Delta updates in Azure Device Update for IoT Hub help address this by allowing devices to download only the differences between two versions of an update instead of the full update. This is designed to reduce the bandwidth used to deliver updates, especially when there are only a few changes between the source and target versions.

A single deployment can include multiple delta updates to support fleets where devices are on different starting versions, including multi-version upgrades.

## When to use delta updates

Delta updates are most beneficial when the differences between the source and target versions represent a small portion of the full update. In these cases, the delta payload is significantly smaller than the full update, reducing bandwidth consumption.

When most of the update content has changed between versions, the delta may provide limited bandwidth savings. In those scenarios, using the full update directly may be simpler to generate and manage.

## How delta updates work

A delta update is a compact update artifact that contains only the differences between two versions of an update:

- The **source version** is the version currently installed on the device.  
- The **target version** is the version you want the device to run.

Instead of downloading the full target version, the device downloads the delta update and combines it with the source version already present on the device to reconstruct the full target update before installation.

Because a delta update depends on the source version, the corresponding source version must be available on the device. This is typically the case because the Device Update agent caches previously installed updates for future use. If needed, source versions can also be pre-staged on the device before deployment.

### Deployment contents

A deployment that uses delta updates must include:

- The full target update  
- One or more delta updates, each generated for a specific source-to-target version transition. To support multi-hop upgrades, the deployment must include a delta update for each transition in the chain (for example, **v1** → **v2** and **v2** → **v3** to upgrade a **v1** device to **v3**).

The full target update is always included so that devices without a compatible source version can still reach the target version. This also means that including delta updates in a deployment doesn't introduce additional risk—devices that can't use the delta path still install the full update.

### Per-device evaluation

When a deployment runs, the Device Update agent on each device evaluates which update path to apply based on the device's current state.

For each device:

1. The Device Update agent determines the device's current version and evaluates the available updates in the deployment.
   
3. If a compatible delta update is available:
   
   - The delta update is downloaded to the device.
     
   - The **delta processor** reconstructs the full target update by combining the delta update with the source version on the device.
     
   - The **update handler** installs the reconstructed update.
     
5. If a compatible delta update is not available, the device downloads and installs the full target update instead.

This evaluation happens independently for each device. As a result, devices in the same deployment might follow different update paths depending on their starting version and which delta updates are available.

## Components

Delta updates rely on several components on the device to reconstruct and install updates.

- **Device Update agent:** Orchestrates the update lifecycle on the device, including evaluating available updates, downloading content, coordinating installation, and reporting results to the service.

- **Delta processor:** An extension that reconstructs the full target update on the device by combining the downloaded delta update with the locally available source version.

- **Update handler:** Performs the installation of the update on the device. Different handlers support different update formats.

## Supported scenarios

Delta updates support a range of deployment scenarios, from simple single-version upgrades to more complex fleet rollouts where devices are on different starting versions. If a device cannot use the delta path, it installs the full target update instead, so every device in the deployment can reach the target version.

### Upgrading devices on the same version

All devices in the deployment are on the same source version. A single delta update is generated between the source version and the target version, and each device applies it to reach the target.

For example, all devices are on **v2**. The deployment includes a delta update for **v2 → v3** and the full **v3** update. Each device applies the delta to reach v3.

### Upgrading devices across multiple versions (multi-hop)

A device is more than one version behind the target. Multiple delta updates can be included in the deployment, and the device applies them in sequence to reach the target version.

For example, a device is on **v1** and the target is **v3**. The deployment includes deltas for **v1 → v2** and **v2 → v3**. The device applies both deltas in sequence to reach v3.

### Upgrading a mixed-version fleet

Devices in the fleet are on different starting versions. A single deployment can include multiple delta updates and the full target update, so each device uses the appropriate path based on its current version.

For example, a deployment targets **v3** and includes deltas for **v1 → v2**, **v2 → v3**, and the full **v3** update. Devices on v2 apply the v2 → v3 delta. Devices on v1 apply both deltas in sequence. Devices on any other version install the full v3 update.

## Considerations

**Device storage capacity:** Delta updates require a source version to be available on the device. The Device Update agent caches previously installed updates, so devices need enough storage capacity to retain these cached versions in addition to the space needed for new updates.
 
**Multiple update artifacts:** Deployments that support delta updates include both the full target update and one or more delta update files. To support multi-version (multi-hop) scenarios, the deployment must include all delta updates needed to bridge the version transitions from each source version to the target. Missing an intermediate delta prevents the chain from completing, and the affected device installs the full target update instead.
 
**Per-device path selection:** Within the same deployment, devices can follow different update paths depending on their current source version and the delta updates available. Some devices apply a delta update, others may apply multiple deltas in sequence, and others install the full update. This is expected behavior.


## Next steps

To generate and deploy delta updates, see:

- [Use delta updates](use-delta-updates.md)
