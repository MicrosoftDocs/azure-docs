---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 06/19/2026
ms.author: dobett
ms.service: azure-iot-operations
ms.custom:
  - include file
---

To use a user-assigned managed identity for authentication, you must first deploy Azure IoT Operations with secure settings enabled. Then you need to [set up a user-assigned managed identity for cloud connections](../secure-iot-ops/howto-enable-secure-settings.md#set-up-a-user-assigned-managed-identity-for-cloud-connections). To learn more, see [Enable secure settings in Azure IoT Operations deployment](../secure-iot-ops/howto-enable-secure-settings.md).

To grant the user-assigned managed identity access to your Microsoft Fabric workspace:

1. In Microsoft Fabric, go to your workspace and select **Manage access** > **Add people or groups**.
1. Search for your user-assigned managed identity.
1. Assign workspace permission of Contributor or higher to the identity.
