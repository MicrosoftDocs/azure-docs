---
title: Adding or removing address space on peered virtual networks without a downtime
description: #Required; article description that is displayed in search results. 
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.topic: conceptual 
ms.date: 07/08/2022
ms.custom: template-concept 
#Customer Intent: 
---

# Adding or removing address space on peered virtual networks without a downtime 

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes what the article covers. Answer the 
fundamental “why would I want to know this?” question. Keep it short.
-->

[add your introductory paragraph]

<!-- 3. H2s
Required. Give each H2 a heading that sets expectations for the content that follows. 
Follow the H2 headings with a sentence about how the section contributes to the whole.
-->

## [Section 1 heading]
You can update (add or remove) address space on a virtual network that is peered with another virtual network in the same region or across regions. Address space update on virtual networks also works if the virtual network has peered with another virtual network across subscriptions. This feature introduces two new properties on the virtualNetworkPeerings object of the virtual network: 

- **remoteVirtualNetworkAddressSpace**: Contains the most current address space of the peered virtual network. This address may or may not be the same as the peered address contained in the remoteAddressSpace property. 

- **peeringSyncLevel**: Indicates if the address contained in the remoteVirtualNetworkAddressSpace property is the same as the address that is actually peered with the virtual network. 

When the address space on a virtual network (1) is updated, the corresponding peering links on the remote virtual networks towards this virtual network (1) need to be synced with the new address space. The status of the peering links between the two virtual networks indicates which side of the peering link needs to be synced with the new address space. 

LocalNotInSync: When you update the address space on the first virtual network (1), the peering status of the link from the second virtual network (2) to the first virtual network (1) is LocalNotInSync. At this stage, while the peering is active across the old address space of the virtual network, the new address space has not peered with the remote virtual network. 

RemoteNotInSync: When you update address space on the first virtual network (1), the peering status of the link from the first virtual network to the second virtual network (2) is RemoteNotInSync. A sync operation on the peering link from the virtual network (2) to the virtual network (1) will synchronize the address space across the peering. 

## Unsupported scenarios
This feature does not support the following scenarios if the virtual network to be updated is peered with:  

* A classic virtual network
* A managed virtual network such as the Azure VWAN hub 

## [Section n heading]
<!-- add your content here -->

<!-- 4. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Write concepts](contribute-how-to-write-concept.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
