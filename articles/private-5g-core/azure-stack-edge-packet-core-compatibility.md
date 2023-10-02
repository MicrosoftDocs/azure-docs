---
title: Packet core and Azure Stack Edge compatibility
description: Discover which Azure Stack Edge models and versions are compatible with each packet core version
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: conceptual
ms.date: 09/07/2023
---

# Packet core and Azure Stack Edge (ASE) compatibility

Each site in your deployment contains an Azure Stack Edge (ASE) Pro device that hosts a single packet core instance. This article provides information on version compatibility between ASE and packet core that you can refer to when installing a packet core instance or performing an upgrade.

## Supported Azure Stack Edge Pro models

The following Azure Stack Edge Pro models are supported:

- Azure Stack Edge Pro with GPU
- Azure Stack Edge Pro 2
  - Model 64G2T
  - Model 128G4T1GPU
  - Model 256G6T2GPU

All features, and all [packet core service plans](modify-service-plan.md), are supported on all supported models of Azure Stack Edge.

## Packet core and Azure Stack Edge version compatibility table

The following table provides information on which versions of the ASE device are compatible with each packet core version.

| Packet core version  | ASE Pro GPU compatible versions  | ASE Pro 2 compatible versions |
|-----|-----|-----|
| 2308 | 2303, 2309 | 2303, 2309 |
| 2307 | 2303 | 2303 |
| 2306 | 2303 | 2303 |
| 2305 | 2303 | 2303 |
| 2303 | 2301, 2303  | 2301, 2303 |
| 2302 | 2301  | N/A |
| 2301 | 2210, 2301  | N/A |
| 2211 | 2210  | N/A |
| 2210 | 2209, 2210  | N/A |
| 2209 | 2209  | N/A |
| 2208 | 2207, 2209  | N/A |

## Next steps

- Refer to [Update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md) for the latest available version of ASE and for more information on how to upgrade your device.
- Refer to the packet core release notes for more information on the packet core version you're using or plan to use.
