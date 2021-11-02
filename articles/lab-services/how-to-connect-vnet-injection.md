---
title: Connect to your virtual network in Azure Lab Services | Microsoft Docs
description: Learn how to connect your virtual network with another network. For example, connect your on-premises organization/university network with Lab's virtual network in Azure.  
ms.topic: how-to
ms.date: 06/26/2020
---

# Connect to your virtual network in Azure Lab Services

This article provides information about connecting a lab to your virtual network.

## Overview

You can bring your own virtual network to your lab plan when you create the lab plan.

Before you configure a virtual network for your lab plan:

- You must create the virtual network
- The virtual network must be in the same region as the lab plan
- After you create the virtual network, you must the delegate the subnet for use with Azure Lab Services
  Only one lab plan at a time can be delegated for use with one subnet

Certain on-premises networks are connected to Azure Virtual Network either through [ExpressRoute](../expressroute/expressroute-introduction.md) or [Virtual Network Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md). These services must be set up outside of Azure Lab Services. To learn more about connecting an on-premises network to Azure using ExpressRoute, see [ExpressRoute overview](../expressroute/expressroute-introduction.md). For on-premises connectivity using a Virtual Network Gateway, the gateway, specified virtual network, and the lab plan must all be in the same region.

> [!NOTE]
> When creating a Azure Virtual Network that will be peered with a lab account, it's important to understand how the virtual network's region impacts where labs are created.  For more information, see the administrator guide's section on [regions\locations](./administrator-guide.md#regionslocations).

> [!NOTE]
> If your school needs to perform content filtering, such as for compliance with the [Children's Internet Protection Act (CIPA)](https://www.fcc.gov/consumers/guides/childrens-internet-protection-act), you will need to use 3rd party software.  For more information, read guidance on [content filtering with Lab Services](./administrator-guide.md#content-filtering).

## Configure at the time of lab plan creation

1. From the **Basics** tab of the **Create a lab plan** page, select **Next: Networking** at the bottom of the page.
2. To host on a virtual network, select **Enable advanced networking**.

    1. For **Virtual network**, select an existing virtual network for the lab network. For a virtual network to appear in this list, it must be in the same region as the lab plan. For more information, see [Connect to your virtual network](how-to-connect-vnet-injection.md).
    2. Specify an existing **subnet** for VMs in the lab. For a subnet to appear in this list, it must be delegated for use with lab plans when you configure the subnet for the virtual network. For more information, see [Add a virtual network subnet](/azure/virtual-network/virtual-network-manage-subnet).  

        :::image type="content" source="./media/how-to-manage-lab-plans/create-lab-plan-advanced-networking.png" alt-text="Create lab plan -> Networking":::

## Configure after the lab plan is created

Once you delegate a subnet for use with Azure Lab Services, the subnet is locked and you can't configure it's settings.

So, if you need to make changes, first delete the lab, then delete the subnet. Create a new subnet with the desired properties.

## Next steps

See the following articles:

- [Allow lab creator to pick lab location](allow-lab-creator-pick-lab-location.md)
- [Attach a shared image gallery to a lab](how-to-attach-detach-shared-image-gallery.md)
- [Add a user as a lab owner](how-to-add-user-lab-owner.md)
- [View firewall settings for a lab](how-to-configure-firewall-settings.md)
- [Configure other settings for a lab](how-to-configure-lab-accounts.md)