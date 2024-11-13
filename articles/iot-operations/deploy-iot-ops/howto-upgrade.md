---
title: Upgrade or rollback
description: Upgrade an Azure IoT Operations instance or rollback to a previous version.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 11/11/2024

#CustomerIntent: As an OT professional, I want to manage Azure IoT Operations instances.
---

# Upgrade or rollback between versions

Upgrade an Azure IoT Operations instance to a newer version or rollback to a previous version. Azure IoT Operations supports upgrade and rollback from version 1.0.x onwards. There is no support for upgrading from any preview version of Azure IoT Operations to any generally available (GA) version.

>[!NOTE]
>Currently, Azure IoT Operations has only one generally available version. Upgrade and rollback will be available once there are additional versions to upgrade or rollback between.

## Understand upgrade support

Upgrade and rollback are supported between N+2 or N-2 minor versions of Azure IoT Operations, or between any patch versions of the same minor version. The following table provides examples:

| Current version | Upgrade range | Rollback range |
| --------------- | ------------- | -------------- |
| 1.0.0           | 1.0.1 through 1.2.x | None     |
| 1.1.0           | 1.1.1 through 1.3.x | 1.0.x    |

## Upgrade

Azure IoT Operations supports upgrading instances to new GA versions as they're released.

You can't upgrade from a preview installation to a GA version. To move to version 1.0.x, [uninstall Azure IoT Operations](howto-manage-update-uninstall.md#uninstall) and reinstall the new version.
