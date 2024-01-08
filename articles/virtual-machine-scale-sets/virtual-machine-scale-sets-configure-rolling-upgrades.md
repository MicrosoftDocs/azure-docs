---
title: Configure Rolling Upgrades on Virtual Machine Scale Sets
description: Learn about to configure Rolling Upgrades on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 01/04/2024
ms.reviewer: ju-shim
ms.custom: maxsurge, upgradepolicy, devx-track-azurecli, devx-track-azurepowershell
---
# Configure Rolling Upgrades on Virtual Machine Scale Sets

-  **Rolling Upgrades with MaxSurge disabled**
    
    With MaxSurge disabled, the existing instances in a scale set are brought down in batches to be upgraded. Once the upgraded batch is complete, the instances will begin taking traffic again, and the next batch will begin. This continues until all instances brought up-to-date. 

-  **Rolling Upgrades with MaxSurge enabled**

    > [!IMPORTANT]
    > Rolling Upgrades with MaxSurge is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 
        
    With MaxSurge enabled, new instances are created in the scale set using the latest scale model in batches. Once the batch of new instances is successfully created and marked as healthy, instances matching the old scale set model are deleted. This continues until all instances are brought up-to-date. Rolling Upgrades with MaxSurge can help improve service uptime during upgrade events. 
