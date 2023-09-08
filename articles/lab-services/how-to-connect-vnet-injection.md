---
title: Connect a lab plan to a virtual network
titleSuffix: Azure Lab Services
description: Learn how to connect a lab plan to a virtual network with Azure Lab Services advanced networking. Advanced networking uses VNET injection to add lab virtual machines in your virtual network.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 06/20/2023
---

# Connect a lab plan to a virtual network with advanced networking

This article describes how to connect a lab plan to a virtual network with Azure Lab Services advanced networking. With advanced networking, you have more control over the virtual network configuration of your labs. For example, to connect to on-premises resources such as licensing servers, or to use user-defined routes (UDRs). Learn more about the [supported networking scenarios and topologies for advanced networking](./concept-lab-services-supported-networking-scenarios.md).

Advanced networking for lab plans replaces [Azure Lab Services virtual network peering](how-to-connect-peer-virtual-network.md) that is used with lab accounts.

Follow these steps to configure advanced networking for your lab plan:

1. Delegate the virtual network subnet to Azure Lab Services lab plans. Delegation allows Azure Lab Services to create the lab template and lab virtual machines in the virtual network.
1. Configure the network security group to allow inbound RDP or SSH traffic to the lab template virtual machine and lab virtual machines.
1. Create a lab plan with advanced networking to associate it with the virtual network subnet.
1. (Optional) Configure your virtual network. 

Advanced networking can only be enabled when creating a lab plan.  Advanced networking is not a setting that can be updated later.

The following diagram shows an overview of the Azure Lab Services advanced networking configuration. The lab template and lab virtual machines are assigned an IP address in your subnet, and the network security group allows lab users to connect to the lab VMs by using RDP or SSH.

:::image type="content" source="./media/how-to-connect-vnet-injection/lab-services-advanced-networking-overview.png" alt-text="Diagram that shows an overview of the advanced networking configuration in Azure Lab Services.":::

> [!NOTE]
> If your organization needs to perform content filtering, such as for compliance with the [Children's Internet Protection Act (CIPA)](https://www.fcc.gov/consumers/guides/childrens-internet-protection-act), you will need to use 3rd party software. For more information, read guidance on [content filtering in the supported networking scenarios](./concept-lab-services-supported-networking-scenarios.md).

## Prerequisites
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your Azure account has the [Network Contributor](/azure/role-based-access-control/built-in-roles#network-contributor) role, or a parent of this role, on the virtual network.
- An Azure virtual network and subnet in the same Azure region as where you create the lab plan. Learn how to create a [virtual network](/azure/virtual-network/manage-virtual-network) and [subnet](/azure/virtual-network/virtual-network-manage-subnet).
- The subnet has enough free IP addresses for the template VMs and lab VMs for all labs (each lab uses 512 IP addresses) in the lab plan.

## 1. Delegate the virtual network subnet

To use your virtual network subnet for advanced networking in Azure Lab Services, you need to [delegate the subnet](/azure/virtual-network/subnet-delegation-overview) to Azure Lab Services lab plans. Subnet delegation gives explicit permissions to Azure Lab Services to create service-specific resources, such as lab virtual machines, in the subnet.

You can delegate only one lab plan at a time for use with one subnet.

Follow these steps to delegate your subnet for use with a lab plan:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your virtual network, and select **Subnets**.

1. Select a dedicated subnet you wish to delegate to Azure Lab Services.

    > [!IMPORTANT]
    > The subnet you use for Azure Lab Services should not already be used for a VNET gateway or Azure Bastion.

1. In **Delegate subnet to a service**, select *Microsoft.LabServices/labplans*, and then select **Save**.

   :::image type="content" source="./media/how-to-connect-vnet-injection/delegate-subnet-for-azure-lab-services.png" alt-text="Screenshot of the subnet properties page in the Azure portal, highlighting the Delegate subnet to a service setting.":::

1. Verify that *Microsoft.LabServices/labplans* appears in the **Delegated to** column for your subnet.

   :::image type="content" source="./media/how-to-connect-vnet-injection/delegated-subnet.png" alt-text="Screenshot of list of subnets for a virtual network in the Azure portal, highlighting the Delegated to columns." lightbox="./media/how-to-connect-vnet-injection/delegated-subnet.png":::

## 2. Configure a network security group

When you connect your lab plan to a virtual network, you need to configure a network security group (NSG) to allow inbound RDP/SSH traffic from the user's computer to the template virtual machine and the lab virtual machines. An NSG contains access control rules that allow or deny traffic based on traffic direction, protocol, source address and port, and destination address and port. 

The rules of an NSG can be changed at any time, and changes are applied to all associated instances. It might take up to 10 minutes for the NSG changes to be effective.

> [!IMPORTANT]
> If you don't configure a network security group, you won't be able to access the lab template VM and lab VMs via RDP or SSH.

The network security group configuration for advanced networking consists of two steps:

1. Create a network security group that allows RDP/SSH traffic
1. Associate the network security group with the virtual network subnet

[!INCLUDE [nsg intro](../../includes/virtual-networks-create-nsg-intro-include.md)]

You can use an NSG to control traffic to one or more virtual machines (VMs), role instances, network adapters (NICs), or subnets in your virtual network. An NSG contains access control rules that allow or deny traffic based on traffic direction, protocol, source address and port, and destination address and port. The rules of an NSG can be changed at any time, and changes are applied to all associated instances.

For more information about NSGs, visit [what is an NSG](/azure/virtual-network/network-security-groups-overview).

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

## 3. Create a lab plan with advanced networking

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

    If your virtual network doesn't appear in the list, verify that the lab plan is in the same Azure region as the virtual network, that you've [delegated the subnet to Azure Lab Services](#1-delegate-the-virtual-network-subnet), and that your [Azure account has the necessary permissions](#prerequisites).

	:::image type="content" source="./media/how-to-connect-vnet-injection/create-lab-plan-advanced-networking.png" alt-text="Screenshot of the Networking tab of the Create a lab plan wizard.":::

1. Select **Review + Create** to create the lab plan with advanced networking.

    Lab users and lab managers can now connect to their lab virtual machines or lab template virtual machine by using RDP or SSH.

    When you create a new lab, all virtual machines are created in the virtual network and assigned an IP address within the subnet range.

## 4. (Optional) Update the networking configuration settings

It's recommended that you use the default configuration settings for the virtual network and subnet when you use advanced networking in Azure Lab Services.

For specific networking scenarios, you might need to update the networking configuration. Learn more about the [supported networking architectures and topologies in Azure Lab Services](./concept-lab-services-supported-networking-scenarios.md) and the corresponding network configuration.

You can modify the virtual network settings after you create the lab plan with advanced networking. However, when you change the [DNS settings on the virtual network](/azure/virtual-network/manage-virtual-network#change-dns-servers), you need to restart any running lab virtual machines. If the lab VMs are stopped, they'll automatically receive the updated DNS settings when they start.

> [!CAUTION]
> The following networking configuration changes are not supported after you've configured advanced networking :
>
> - Delete the virtual network or subnet associated with the lab plan. This causes the labs to stop working.
> - Change the subnet address range when there are virtual machines created (template VM or lab VMs).
> - Change the DNS label on the public IP address. This causes the **Connect** button for lab VMs to stop working.
> - Change the [frontend IP configuration](/azure/load-balancer/manage#add-frontend-ip-configuration) on the Azure load balancer. This causes the **Connect** button for lab VMs to stop working.
> - Change the FQDN on the public IP address.
> - Use a route table with a default route for the subnet (forced-tunneling). This causes users to lose connectivity to their lab.
> - The use of Azure Firewall or Azure Bastion is not supported.

## Next steps

- [Attach a compute gallery to a lab plan](how-to-attach-detach-shared-image-gallery.md).
- [Configure automatic shutdown settings for a lab plan](how-to-configure-auto-shutdown-lab-plans.md).
- [Add lab creators to a lab plan](add-lab-creator.md).
