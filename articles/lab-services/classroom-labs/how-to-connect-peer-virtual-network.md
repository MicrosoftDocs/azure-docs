---
title: Connect to a peer network in Azure Lab Services | Microsoft Docs
description: Learn how to connect your lab network with another network as a peer. For example, connect your on-premises school/university network with Lab's virtual network in Azure.  
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/31/2020
ms.author: spelluru

---

# Connect your lab's network with a peer virtual network in Azure Lab Services 
This article provides information about peering your labs network with another network. 

## Overview
Virtual network peering enables you to seamlessly connect Azure virtual networks. Once peered, the virtual networks appear as one, for connectivity purposes. The traffic between virtual machines in the peered virtual networks is routed through the Microsoft backbone infrastructure, much like traffic is routed between virtual machines in the same virtual network, through private IP addresses only. For more information, see [Virtual network peering](../../virtual-network/virtual-network-peering-overview.md).

You may need to connect your lab's network with a peer virtual network in some scenarios including the following ones:

- The virtual machines in the lab have software that connects to on-premises license servers to acquire license
- The virtual machines in the lab need access to data sets (or any other files) on university's network shares. 

Certain on-premises networks are connected to Azure Virtual Network either through [ExpressRoute](../../expressroute/expressroute-introduction.md) or [Virtual Network Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md). These services must be set up outside of Azure Lab Services. To learn more about connecting an on-premises network to Azure using ExpressRoute, see [ExpressRoute overview](../../expressroute/expressroute-introduction.md). For on-premises connectivity using a Virtual Network Gateway, the gateway, specified virtual network, and the lab account must all be in the same region.

> [!NOTE]
> When creating a Azure Virtual Network that will be peered with a lab account, it's important to understand how the virtual network's region impacts where classroom labs are created.  For further information, refer to the administrator guide's section on [regions\locations](https://docs.microsoft.com/azure/lab-services/classroom-labs/administrator-guide#regionslocations).

## Configure at the time of lab account creation
During the new lab account creation, you can pick an existing virtual network that shows in the **Peer virtual network** dropdown list on the **Advanced** tab. The selected virtual network is connected(peered) to labs created under the lab account. All the virtual machines in labs that are created after the making this change would have access to the resources on the peered virtual network. 

There is also a provision to provide **Address range** of virtual machines for the labs. If the address range is provided, all the virtual machines in the labs under the lab account will be created in that address range. The address range should be in CIDR notation (e.g. 10.20.0.0/20) and not overlap with any existing address ranges. When providing an address range, it is important to think about the number of virtual machines that will be created in the labs and provide an address range to accommodate that. For a given range, the number of labs it can accomodate will be shown.

![Select VNet to peer](../media/how-to-connect-peer-virtual-network/select-vnet-to-peer.png)

> [!NOTE]
> For detailed step-by-step instructions for creating a lab account, see [Set up a lab account](tutorial-setup-lab-account.md)


## Configure after the lab is created
The same property can be enabled from the **Labs configuration** tab of the **Lab Account** page if you didn't set up a peer network at the time of lab account creation. Change made to this setting applies only to the labs that are created after the change. As you can see in the image, you can enable or disable **Peer virtual network** for labs in the lab account. 

![Enable or disable VNet peering after the lab is created](../media/how-to-connect-peer-virtual-network/select-vnet-to-peer-existing-lab.png) 

When you select a virtual network for the **Peer virtual network** field, the **Allow lab creator to pick lab location** option is disabled. It's because labs in the lab account must be in the same region as the lab account for them to connect with resources in the peer virtual network. 

> [!IMPORTANT]
> This setting change applies only to labs that are created after the change is made, not to the existing labs. 


## Next steps
See the following articles:

- [Allow lab creator to pick lab location](allow-lab-creator-pick-lab-location.md)
- [Attach a shared image gallery to a lab](how-to-attach-detach-shared-image-gallery.md)
- [Add a user as a lab owner](how-to-add-user-lab-owner.md)
- [View firewall settings for a lab](how-to-configure-firewall-settings.md)
- [Configure other settings for a lab](how-to-configure-lab-accounts.md)
