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

Learn about Device Update for IoT Hub root key rotation, and what you may need to do to prepare.

## Understand Device Update for IoT Hub security and how root keys are used

Before learning about the Device Update root key rotation process, learn about root keys by visiting the [Device Update security model](device-update-security.md) page.

## Upcoming root key rotation in August 2025

On **August 26, 2025**, the Device Update for IoT Hub service will rotate ADU.200702.R, the root key currently being used for validating signing keys associated with update manifests. The rotation of that key means that the Device Update service will stop signing imported content with a key that chains up to ADU.200702.R, and begin signing using a key that chains up to ADU.200703.R.

### Potential impact

After August 26, any content that you've imported into your Device Update instance _before_ August 26 will remain signed with ADU.200702.R, and nothing will change about deploying it to your devices.

Any content imported _after_ August 26 will be signed with ADU.200703.R. By default, all supported versions of the reference Device Update Agent have both ADU.200702.R and ADU.200703.R. This means that if you haven't modified the Device Update Agent code, any content signed with ADU.200703.R can be deployed to your devices, and no action is required.

If ADU.200703.R _isn't_ on your devices for some reason - such as if you created your own Device Update Agent and didn't include both keys - **content that you import after August 26 will not be able to be deployed to those devices**. In that case, you can choose one of the following options to do before August 26:
- Update your devices to [Device Update Agent version 1.1.0 or later](https://github.com/Azure/iot-hub-device-update/releases/tag/1.1.0). Agent versions 1.1.0 and later include the capability to _automatically_ retrieve the latest root key, meaning rotation events including the one on August 26 won't require any action from you.
- Update your devices to just add ADU.200703.R, without updating to a different Device Update Agent version.

>[!NOTE] 
>If you want to use Device Update for IoT Hub to perform either option 1 or option 2, **you must import those updates before August 26**. Otherwise you'll need to update your devices using another process so that they will have ADU.200703.R and be able to get new content from the Device Update service again.

## How to validate if your devices are impacted

The Device Update team created a test mechanism to validate if your devices can receive content signed with ADU.200703.R. You can use this at any time before the August 26 rotation. Instructions:
1. Download a [special test file](https://a.b.nlu.dl.adu.microsoft.com/swedencentral/testfiles/root-key-test-update.txt). This exact file _must_ be used, because the Device Update service will look for the file hash at import time. The matching file hash in your import manifest should be: **KGyJ9tM6JSLHQq0gdKUmsVvB6Y4z0pMKdQNAd8jTGH0=**

2. [Create an update](create-update.md) to test with. You can use any file(s) you'd like, but you must also include the special test file in your import manifest. It's recommended that your update change the devices in a way that's easy to verify later (such as changing the version number on a file, or adding a new file that wasn't on the device).
3. Import and deploy the update to your devices just like you normally would.
4. Verify that the update succeeded on your devices. If it did, your devices can receive updates signed with ADU.200703.R and are ready for the August 26 rotation.

## Take action now for future root key rotations or revocations

By policy, Device Update for IoT Hub will rotate root keys every 2.5 years. However, if a security breach were to occur, it might be necessary to _revoke_ a root key at an unscheduled time and with little advance warning. To prepare for future rotations as well as the possibility of a revocation, a new root key will soon be made available. An announcement will be made on this page and via e-mail to Azure subscription owners with instructions once the key is available. 

>[!NOTE] 
>It's strongly recommended to adopt Device Update Agent version 1.1.0 or later, which will automatically obtain all future root keys for your devices as needed, including during a revocation event. If you are unable to adopt Device Update Agent version 1.1.0 or later, plan to update your devices to add the new root key once available as quickly as possible before August 26, 2025, so two valid root keys will be available on your devices after the August 26 rotation.

## More information

[Device Update security model](device-update-security.md)