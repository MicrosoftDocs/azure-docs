---
title: Packet core and Azure Stack Edge compatibility
description: Discover which Azure Stack Edge versions are compatible with each packet core version
author: liumichelle
ms.author: limichel
ms.service: private-5g-core
ms.topic: conceptual
ms.date: 03/30/2023
---

# Packet core and Azure Stack Edge (ASE) compatibility

Each site in your deployment contains an Azure Stack Edge (ASE) Pro device that hosts a packet core instance. This article provides information on version compatibility between ASE and packet core that you can refer to when installing a packet core instance or performing an upgrade.

## Packet core and ASE compatibility table

The following table provides information on which versions of the ASE device are compatible with each packet core version.

| Packet core version  | Compatible ASE versions  |
|-----|-----|
| 2303 | 2301  |
| 2302 | 2301  |
| 2301 | 2210, 2301  |
| 2211 | 2210  |
| 2210 | 2209, 2210  |
| 2209 | 2209  |
| 2208 | 2207, 2209  |

## Next steps

- Refer to [Update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md) for the latest available version of ASE and for more information on how to upgrade your device.
- Refer to the packet core release notes for more information on the packet core version you're using or plan to use.