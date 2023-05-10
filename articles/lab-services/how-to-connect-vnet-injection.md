---
title: Connect to a virtual network
titleSuffix: Azure Lab Services
description: Learn how to connect a lab plan in Azure Lab Services to a virtual network with advanced networking. Advanced networking uses VNET injection.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 04/25/2023
---

# Connect a virtual network to a lab plan with advanced networking in Azure Lab Services

[!INCLUDE [preview focused article](./includes/lab-services-new-update-focused-article.md)]

This article describes how to connect a lab plan to a virtual network in Azure Lab Services. With lab plans, you have more control over the virtual network for labs by using advanced networking. You can connect to on premise resources such as licensing servers and use user defined routes (UDRs).

Some organizations have advanced network requirements and configurations that they want to apply to labs. For example, network requirements can include a network traffic control, ports management, access to resources in an internal network, and more.  Certain on-premises networks are connected to Azure Virtual Network either through [ExpressRoute](../expressroute/expressroute-introduction.md) or [Virtual Network Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md). These services must be set up outside of Azure Lab Services. To learn more about connecting an on-premises network to Azure using ExpressRoute, see [ExpressRoute overview](../expressroute/expressroute-introduction.md). For on-premises connectivity using a Virtual Network Gateway, the gateway, specified virtual network, network security group, and the lab plan all must be in the same region.

Azure Lab Services advanced networking uses virtual network (VNET) injection to connect a lab plan to your virtual network. VNET injection replaces the [Azure Lab Services virtual network peering](how-to-connect-peer-virtual-network.md) that was used with lab accounts.

> [!IMPORTANT]
> You must configure advanced networking when you create a lab plan. You can't enable advanced networking at a later stage.

> [!NOTE]
> If your organization needs to perform content filtering, such as for compliance with the [Children's Internet Protection Act (CIPA)](https://www.fcc.gov/consumers/guides/childrens-internet-protection-act), you will need to use 3rd party software.  For more information, read guidance on [content filtering with Lab Services](./administrator-guide.md#content-filtering).

## Prerequisites

- An Azure virtual network and subnet. If you don't have this resource, learn how to create a [virtual network](/azure/virtual-network/manage-virtual-network) and [subnet](/azure/virtual-network/virtual-network-manage-subnet).

    > [!IMPORTANT]
    > The virtual network and the lab plan must be in the same Azure region.

## Delegate the virtual network subnet to lab plans

To use your virtual network subnet for advanced networking in Azure Lab Services, you need to [delegate the subnet](../virtual-network/subnet-delegation-overview.md) to Azure Lab Services lab plans.

You can delegate only one lab plan at a time for use with one subnet.

Follow these steps to delegate your subnet for use with a lab plan:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your virtual network, and select **Subnets**.

1. Select the subnet you wish to delegate to Azure Lab Services.

1. In **Delegate subnet to a service**, select **Microsoft.LabServices/labplans**, and then select **Save**.

   :::image type="content" source="./media/how-to-connect-vnet-injection/delegate-subnet-for-azure-lab-services.png" alt-text="Screenshot of the subnet properties page in the Azure portal, highlighting the Delegate subnet to a service setting.":::

1. Verify  the lab plan service appears in the **Delegated to** column.

   :::image type="content" source="./media/how-to-connect-vnet-injection/delegated-subnet.png" alt-text="Screenshot of list of subnets for a virtual network in the Azure portal, highlighting the Delegated to columns." lightbox="./media/how-to-connect-vnet-injection/delegated-subnet.png":::

## Configure a network security group

[!INCLUDE [nsg intro](../../includes/virtual-networks-create-nsg-intro-include.md)]

An NSG is required when you connect your virtual network to Azure Lab Services. Specifically, configure the NSG to allow:

- inbound RDP/SSH traffic from lab users' computer to the lab virtual machines
- inbound RDP/SSH traffic to the template virtual machine

After creating the NSG, you associate the NSG with the virtual network subnet.

### Create a network security group to allow traffic

Follow these steps to create an NSG and allow inbound RDP or SSH traffic:

1. If you don't have a network security group already, follow these steps to [create a network security group (NSG)](/azure/virtual-network/manage-network-security-group).

    Make sure to create the network security group in the same Azure region as the virtual network and lab plan.

1. Create an inbound security rule to allow RDP and SSH traffic.

    1. Go to your network security group in the [Azure portal](https://portal.azure.com).

	1. Select **Inbound security rules**, and then select **+ Add**.

    1. Enter the details for the new inbound security rule:

        | Setting  | Value |
        | -------- | ----- |
        | **Source** | Select *Any*. | 
        | **Source port ranges** | Enter *\**. | 
        | **Destination** | Select *IP Addresses*. | 
        | **Destination IP addresses/CIDR ranges** | Select the range of your virtual network subnet. |
        | **Service** | Select *Custom*. | 
        | **Destination port ranges** | Enter *22, 3389*. Port 22 is for Secure Shell protocol (SSH). Port 3389 is for Remote Desktop Protocol (RDP). | 
        | **Protocol** | Select *Any*. | 
        | **Action** | Select *Allow*. | 
        | **Priority** | Enter *1000*. The priority must be higher than other *Deny* rules for RDP or SSH. | 
        | **Name** | Enter *AllowRdpSshForLabs*. |
 
    	:::image type="content" source="media/how-to-connect-vnet-injection/nsg-add-inbound-rule.png" lightbox="media/how-to-connect-vnet-injection/nsg-add-inbound-rule.png" alt-text="Screenshot of Add inbound rule window for network security group in the Azure portal.":::

	1. Select **Add** to add the inbound security rule to the NSG.

    1. Select **Refresh**. The new rule should show in the list of rules.

### Associate the subnet with the network security group

To apply the network security group rules to traffic in the virtual network subnet, associate the NSG with the subnet.

1. Go to your network security group, and select **Subnets**.

1. Select **+ Associate** from the top menu bar.

1. For **Virtual network**, select your virtual network.

1. For **Subnet**, select your virtual network subnet.

	:::image type="content" source="media/how-to-connect-vnet-injection/associate-nsg-with-subnet.png" lightbox="media/how-to-connect-vnet-injection/associate-nsg-with-subnet.png" alt-text="Screenshot of the Associate subnet page in the Azure portal.":::

1. Select **OK** to associate the virtual network subnet with the network security group.

Lab users and lab managers can now connect to their lab virtual machines or lab template by using RDP or SSH.

## Connect the virtual network during lab plan creation

You can now create the lab plan and connect it to the virtual network. As a result, the template VM and lab VMs are injected in your virtual network.

> [!IMPORTANT]
> You must configure advanced networking when you create a lab plan. You can't enable advanced networking at a later stage.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Create a resource** in the upper left-hand corner of the Azure portal.

1. Search for **lab plan**.  (**Lab plan** can also be found under the **DevOps** category.)

1. Enter the information on the **Basics** tab of the **Create a lab plan** page.

    For more information, see [Create a lab plan with Azure Lab Services](quick-create-resources.md).

1. Select the **Networking** tab, and then select **Enable advanced networking**.

1. For **Virtual network**, select your virtual network. For **Subnet**, select your virtual network subnet.

    If your virtual network doesn't appear in the list, verify that the lab plan is in the same Azure region as the virtual network.

	:::image type="content" source="./media/how-to-connect-vnet-injection/create-lab-plan-advanced-networking.png" alt-text="Screenshot of the Networking tab of the Create a lab plan wizard.":::

1. Select **Review + Create** to create the lab plan with advanced networking.

All labs you create for this lab plan can now use the specified subnet.

## Known issues

- Deleting your virtual network or subnet causes the lab to stop working
- Changing the DNS label on the public IP causes the **Connect** button for lab VMs to stop working.
- Azure Firewall isn't currently supported.

## Next steps

- As an admin, [attach a compute gallery to a lab plan](how-to-attach-detach-shared-image-gallery.md).
- As an admin, [configure automatic shutdown settings for a lab plan](how-to-configure-auto-shutdown-lab-plans.md).
- As an admin, [add lab creators to a lab plan](add-lab-creator.md).
