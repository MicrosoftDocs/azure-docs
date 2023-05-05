---
# Required metadata
		# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
		# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

		title:       # Add a title for the browser tab
description: # Add a meaningful description for search results
author:      fitzgeraldsteele # GitHub alias
ms.author:   fisteele # Microsoft alias
ms.topic: overview
ms.service: virtual-machine-scale-sets
ms.date:     05/05/2023
ms.reviewer: jushiman
---

# Attach VM to a scale set


> [!NOTE]
> You can only attach VMs to a scale set in **Flexible orchestration mode**.  Learn more about [Orchestration modes](./virtual-machine-scale-sets-orchestrationmodes.md).

You can attach a standalone virtual machine to a scale set. This can be useful if you want full control over the instance naming conventions or you want to place the instance in a specific availability zone or fault domain. 

- The VM must be in the same resource group as the scale set.
- If the scale set is regional (no availability zones specified), the virtual machine must also be regional. If the scale set is zonal or spans multiple zones (1 or more availability zones specified), the virtual machine must be created in one of the zones spanned by the scale set. For example, you cannot create a virtual machine in Zone 1, and place it in a scale set that spans Zones 2 and 3.


