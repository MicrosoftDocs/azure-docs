---
title: Root Key Rotation for Azure Device Update for IoT Hub | Microsoft Docs
description: Information about the rotation of Azure Device Update for IoT Hub root keys.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 2/21/2025
ms.topic: how-to
ms.service: azure-iot-hub
ms.subservice: device-update
---

# How to prepare for the rotation of a Device Update for IoT Hub root key

Learn about Device Update for IoT Hub root key rotations, and what you need to do to prepare.

## Understand Device Update for IoT Hub security and how root keys are used

Before learning about the Device Update root key rotation process, learn about root keys by visiting the [Device Update security model](device-update-security.md) page.

## Root key rotation schedule change

The Device Update for IoT Hub team was previously planning to rotate ADU.200702.R, the root key currently being used for validating signing keys associated with update manifests, on August 26, 2025. The rotation of that key would have meant that the Device Update service would stop signing imported content with a key that chains up to ADU.200702.R. Then, the service would have started signing using a key that chains up to ADU.200703.R.

Based on feedback from our customers on the impact of this change, the Device Update for IoT Hub team is postponing the August 2025 rotation. This will give customers more time to be ready for the rotation. Once a new date is available for this rotation event, it will be announced at least one year in advance.

## How to validate if your devices are ready for a future rotation or revocation

If you haven’t tested the ADU.200703.R root key that will be used after the eventual rotation, doing so as soon as possible is recommended. In the unlikely case of a malicious actor being able to exploit the current ADU.200702.R root key before a scheduled rotation, the Device Update team would immediately revoke the ADU.200702.R root key and begin signing with ADU.200703.R root key. Confirming via testing that your devices currently support the ADU.200703.R root key means the impact of this scenario is minimized.

The Device Update team created a test mechanism to validate if your devices can receive content signed with ADU.200703.R. Instructions:

1. Download a [special test file](https://a.b.nlu.dl.adu.microsoft.com/swedencentral/testfiles/root-key-test-update.txt). This exact file _must_ be used, because the Device Update service looks for the file hash at import time. The matching file hash in your import manifest should be: **KGyJ9tM6JSLHQq0gdKUmsVvB6Y4z0pMKdQNAd8jTGH0=**

1. [Create an update](create-update.md) for your testing. You can use any files you'd like, but you must also include the special test file in your import manifest. A best practice is for your update to change the device in a way that's easy to verify, like changing the version number of a file or adding a new file.

3. Import and deploy the update to your devices just like you normally would.
1. Verify that the update succeeded on your devices. If it did, your devices can receive updates signed with ADU.200703.R and are ready for the next rotation (or possible revocation).

> [!NOTE]
> Adopting [Device Update Agent version 1.1.0 or later](https://github.com/Azure/iot-hub-device-update/releases) is strongly recommended, which will automatically obtain all future root keys for your devices as needed, including during a revocation event.

## More information

[Device Update security model](device-update-security.md)