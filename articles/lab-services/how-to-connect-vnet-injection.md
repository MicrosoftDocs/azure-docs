---
title: Connect a lab plan to a virtual network
titleSuffix: Azure Lab Services
description: Learn how to connect a lab plan to a virtual network with Azure Lab Services advanced networking. Advanced networking uses VNET injection to add lab virtual machines in your virtual network.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 06/13/2023
---

# Connect a lab plan to a virtual network with advanced networking

This article describes how to connect a lab plan to a virtual network with Azure Lab Services advanced networking. With advanced networking, you have more control over the virtual network configuration of your labs. For example, to connect to on-premises resources such as licensing servers, or to use user-defined routes (UDRs). Advanced networking for lab plans replaces [Azure Lab Services virtual network peering](how-to-connect-peer-virtual-network.md) that is used with lab accounts.

Learn more about the [supported networking scenarios and topologies for advanced networking](https://techcommunity.microsoft.com/t5/azure-lab-services-blog/network-architectures-and-topologies-with-lab-plans/ba-p/3781597#M130).

When you create a new lab plan, you can configure advanced networking settings to connect the lab plan to a virtual network. You can't configure advanced networking after the lab plan is created.

Follow these steps to configure advanced networking for your lab plan:

1. Delegate the virtual network subnet to Azure Lab Services lab plans. Delegation allows Azure Lab Services to create the lab template and lab virtual machines in the virtual network.
1. Configure the network security group to allow inbound RDP or SSH traffic to the lab template virtual machine and lab virtual machines.
1. Create a lab plan with advance networking and associate it with the virtual network subnet.
1. (Optional) Configure your virtual network.

The following diagram shows an overview of the Azure Lab Services advanced networking configuration.

:::image type="content" source="./media/how-to-connect-vnet-injection/lab-services-advanced-networking-overview.png" alt-text="Diagram that shows an overview of the advanced networking configuration in Azure Lab Services.":::

> [!NOTE]
> If your organization needs to perform content filtering, such as for compliance with the [Children's Internet Protection Act (CIPA)](https://www.fcc.gov/consumers/guides/childrens-internet-protection-act), you will need to use 3rd party software.  For more information, read guidance on [content filtering with Lab Services](./administrator-guide.md#content-filtering).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your Azure account has the [network contributor](/azure/role-based-access-control/built-in-roles#network-contributor) role assigned.
- An existing Azure virtual network and subnet in the same Azure region as the lab plan. Learn how to create a [virtual network](/azure/virtual-network/manage-virtual-network) and [subnet](/azure/virtual-network/virtual-network-manage-subnet).
- For on-premises connectivity using a [Virtual Network Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways), the gateway, virtual network, network security group, and the lab plan must all be in the same Azure region.

## Delegate the virtual network subnet to lab plans

To use your virtual network subnet for advanced networking in Azure Lab Services, you need to [delegate the subnet](/azure/virtual-network/subnet-delegation-overview) to Azure Lab Services lab plans. Subnet delegation gives explicit permissions to Azure Lab Services to create service-specific resources, such as lab virtual machines, in the subnet.

You can delegate only one lab plan at a time for use with one subnet.

Follow these steps to delegate your subnet for use with a lab plan:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your virtual network, and select **Subnets**.

1. Select the subnet you wish to delegate to Azure Lab Services.

    > [!IMPORTANT]
    > You can't use a VNET Gateway subnet with Azure Lab Services.

1. In **Delegate subnet to a service**, select *Microsoft.LabServices/labplans*, and then select **Save**.

   :::image type="content" source="./media/how-to-connect-vnet-injection/delegate-subnet-for-azure-lab-services.png" alt-text="Screenshot of the subnet properties page in the Azure portal, highlighting the Delegate subnet to a service setting.":::

1. Verify that *Microsoft.LabServices/labplans* appears in the **Delegated to** column for your subnet.

   :::image type="content" source="./media/how-to-connect-vnet-injection/delegated-subnet.png" alt-text="Screenshot of list of subnets for a virtual network in the Azure portal, highlighting the Delegated to columns." lightbox="./media/how-to-connect-vnet-injection/delegated-subnet.png":::

## Configure a network security group

When you connect your lab plan to a virtual network, you need to configure a network security group (NSG) to allow inbound RDP/SSH traffic from the user's computer to the template virtual machine and the lab virtual machines.

The network security group configuration for advanced networking consists of two steps:

1. Create a network security group that allows RDP/SSH traffic
1. Associate the network security group with the virtual network subnet

[!INCLUDE [nsg intro](../../includes/virtual-networks-create-nsg-intro-include.md)]

### Create a network security group to allow traffic

Follow these steps to create an NSG and allow inbound RDP or SSH traffic:

1. If you don't have a network security group yet, follow these steps to [create a network security group (NSG)](/azure/virtual-network/manage-network-security-group).

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
 
	1. Select **Add** to add the inbound security rule to the NSG.

### Associate the subnet with the network security group

Next, associate the NSG with the virtual network subnet to apply the traffic rules to the virtual network traffic.

1. Go to your network security group, and select **Subnets**.

1. Select **+ Associate** from the top menu bar.

1. For **Virtual network**, select your virtual network.

1. For **Subnet**, select your virtual network subnet.

	:::image type="content" source="media/how-to-connect-vnet-injection/associate-nsg-with-subnet.png" lightbox="media/how-to-connect-vnet-injection/associate-nsg-with-subnet.png" alt-text="Screenshot of the Associate subnet page in the Azure portal.":::

1. Select **OK** to associate the virtual network subnet with the network security group.

    Lab users and lab managers can now connect to their lab virtual machines or lab template virtual machine by using RDP or SSH.

## Connect the virtual network during lab plan creation

Now that you've configured the subnet and network security group, you can create the lab plan with advanced networking. When you create a new lab on the lab plan, Azure Lab Services creates the lab template and lab virtual machines in the virtual network subnet.

> [!IMPORTANT]
> You must configure advanced networking when you create a lab plan. You can't enable advanced networking at a later stage.

To create a lab plan with advanced networking in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Create a resource** in the upper left-hand corner of the Azure portal, and search for **lab plan**.

1. Enter the information on the **Basics** tab of the **Create a lab plan** page.

    For more information, see [Create a lab plan with Azure Lab Services](quick-create-resources.md).

1. In the **Networking** tab, select **Enable advanced networking** to configure the virtual network subnet.

1. For **Virtual network**, select your virtual network. For **Subnet**, select your virtual network subnet.

    If your virtual network doesn't appear in the list, verify that the lab plan is in the same Azure region as the virtual network.

	:::image type="content" source="./media/how-to-connect-vnet-injection/create-lab-plan-advanced-networking.png" alt-text="Screenshot of the Networking tab of the Create a lab plan wizard.":::

1. Select **Review + Create** to create the lab plan with advanced networking.

    When you create a new lab, all virtual machines are created in the virtual network and assigned an IP address within the subnet range.

## (Optional) Configure your virtual network

## Known issues

- Deleting your virtual network or subnet causes the lab to stop working
- Changing the DNS label on the public IP causes the **Connect** button for lab VMs to stop working.
- Azure Firewall isn't currently supported.

## Next steps

- [Attach a compute gallery to a lab plan](how-to-attach-detach-shared-image-gallery.md).
- [Configure automatic shutdown settings for a lab plan](how-to-configure-auto-shutdown-lab-plans.md).
- [Add lab creators to a lab plan](add-lab-creator.md).
