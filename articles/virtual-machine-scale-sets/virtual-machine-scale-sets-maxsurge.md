---
title: Rolling upgrades with MaxSurge for Virtual Machine Scale Sets (Preview)
description: Learn about how to utilize rolling upgrades with MaxSurge on Virtual Machine Scale Sets.
author: mimckitt
ms.author: mimckitt
ms.topic: overview
ms.service: virtual-machine-scale-sets
ms.date: 7/19/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy
---
# Rolling upgrades with MaxSurge on Virtual Machine Scale Sets (Preview)

> [!NOTE]
> Rolling upgrades with MaxSurge for Virtual Machine Scale sets with Uniform Orchestration is in general availability (GA). 
>
> **Rolling upgrades with MaxSurge for Virtual Machine scale Sets with Flexible Orchestration is currently in preview.** 
>
> Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA). 

Rolling upgrades with MaxSurge can help improve service uptime during upgrade events. 

With MaxSurge enabled, new instances are created  in batches using the latest scale model. Once the batch of new instances are successfully created and marked as healthy, they begin taking traffic. The scale set then deletes instances in batches matching the old scale set model. This continues until all instances are brought up-to-date. 


## How it works

## Configure rolling upgrades with MaxSurge

## Frequently asked questions 

## Next steps
Learn how to [set the upgrade policy](virtual-machine-scale-sets-set-upgrade-policy.md) of your Virtual Machine Scale Set.

