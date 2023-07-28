---
title: Understand Device Update for Azure IoT Hub compliance
description: Understand how Device Update for Azure IoT Hub measure device update compliance.
author: vimeht
ms.author: vimeht
ms.date: 2/11/2021
ms.topic: concept-article
ms.service: iot-hub-device-update
---

# Device Update compliance

In Device Update for IoT Hub, compliance measures how many devices are running the latest available version. A device is compliant if it has installed the highest available version update that is compatible for it.

For example, consider an instance of Device Update with the following updates:

| Update name | Update version | Compatible device model |
|-------------|----------------|-------------------------|
| Update1     | 1.0            | Model1                  |
| Update2     | 1.0            | Model2                  |
| Update3     | 2.0            | Model1                  |

Let’s say the following deployments have been created:

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

Compliance doesn't consider whether an update is deployed to a device’s group or not; it looks at any updates published to Device Update. So in the example above, even though Device1 has installed the update deployed to it, it's considered non-compliant. Device1 will continue being considered non-compliant until it successfully installs Update3. The compliance status can help you identify whether new deployments are needed.

As shown above, there are three compliance states in Device Update for IoT Hub:

* **On latest update** – the device has installed the highest compatible version update published to Device Update.
* **Update in progress** – an active deployment is in the process of delivering the highest compatible version update to the device.
* **New updates available** – a device hasn't yet installed the highest compatible version update and isn't in an active deployment for that update.
