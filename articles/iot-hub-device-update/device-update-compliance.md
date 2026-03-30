---
title: Understand Device Update for Azure IoT Hub compliance
description: Understand how Device Update for Azure IoT Hub measure device update compliance.
author: cwatson-cat
ms.author: cwatson
ms.date: 2/11/2021
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Device Update compliance

In Device Update for IoT Hub, compliance measures the number of devices running the latest available version. A device is compliant when it runs the highest available version update compatible with its model.

For example, consider an instance of Device Update with the following updates:

| Update name | Update version | Compatible device model |
|-------------|----------------|-------------------------|
| Update1     | 1.0            | Model1                  |
| Update2     | 1.0            | Model2                  |
| Update3     | 2.0            | Model1                  |

Let’s say the following deployments are created:

| Deployment name | Update name | Targeted group |
|-----------------|-------------|----------------|
| Deployment1     | Update1     | Group1         |
| Deployment2     | Update2     | Group2         |
| Deployment3     | Update3     | Group3         |

Now, consider the following devices, with their group memberships and installed versions:

| DeviceId | Device model | Installed update version | Group | Compliance |
|----------|--------------|--------------------------|-------|------------|
| Device1  | Model1       | 1.0 | Group1 | New updates available |
| Device2  | Model1       | 2.0 | Group3 | On latest update |
| Device3  | Model2       | 1.0 | Group2 | On latest update |
| Device4  | Model1       | 1.0 | Group3 | Update in progress |

Device1 and Device4 aren't compliant because they have version 1.0 installed even though there’s a higher version update, Update3, compatible for their model in the Device Update instance. Device2 and Device3 are both compliant because they have the highest version updates compatible for their models installed.

Compliance doesn't depend on whether an update has been deployed to a device’s group; it considers any updates published to Device Update. In the example, Device1 installs the update deployed to it, but it remains non-compliant. Device1 stays non-compliant until it installs Update3. The compliance status helps identify when new deployments are necessary.

There are three compliance states in Device Update for IoT Hub:

* **On latest update** – the device runs the highest compatible version update published to Device Update.
* **Update in progress** – an active deployment is delivering the highest compatible version update to the device.
* **New updates available** – the device does not run the highest compatible version update and is not in an active deployment for that update.
