---
title: Connect to your virtual network in Azure Lab Services | Microsoft Docs
description: Learn how to connect a lab to one of your networks. 
ms.topic: how-to
ms.date: 07/04/2022
ms.custom: devdivchpfy22
---

# Use advanced networking (virtual network injection) to connect to your virtual network in Azure Lab Services

[!INCLUDE [preview focused article](./includes/lab-services-new-update-focused-article.md)]

This article provides information about connecting a [lab plan](tutorial-setup-lab-plan.md) to your virtual network.

Some organizations have advanced network requirements and configurations that they want to apply to labs. For example, network requirements can include a network traffic control, ports management, access to resources in an internal network, etc.  Certain on-premises networks are connected to Azure Virtual Network either through [ExpressRoute](../expressroute/expressroute-introduction.md) or [Virtual Network Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md). These services must be set up outside of Azure Lab Services. To learn more about connecting an on-premises network to Azure using ExpressRoute, see [ExpressRoute overview](../expressroute/expressroute-introduction.md). For on-premises connectivity using a Virtual Network Gateway, the gateway, specified virtual network, network security group, and the lab plan all must be in the same region.

In the Azure Lab Services [August 2022 Update](lab-services-whats-new.md), customers may take control of the network for the labs using virtual network (VNet) injection. You can now tell Lab Services which virtual network to use, and we'll inject the necessary resources into your network.  With VNet injection, you can connect to on premise resources such as licensing servers and use user defined routes (UDRs).  VNet injection replaces the [peering to your virtual network](how-to-connect-peer-virtual-network.md), as was done in previous versions.

> [!IMPORTANT]
> Advanced networking (VNet injection) must be configured when creating a lab plan.  It can't be added later.

> [!NOTE]
> If your school needs to perform content filtering, such as for compliance with the [Children's Internet Protection Act (CIPA)](https://www.fcc.gov/consumers/guides/childrens-internet-protection-act), you will need to use 3rd party software.  For more information, read guidance on [content filtering with Lab Services](./administrator-guide.md#content-filtering).

## Prerequisites

Before you configure advanced networking for your lab plan, complete the following tasks:

1. [Create a virtual network](../virtual-network/quick-create-portal.md).  The virtual network must be in the same region as the lab plan.
1. [Create a subnet](../virtual-network/virtual-network-manage-subnet.md) for the virtual network.
1. [Delegate the subnet](#delegate-the-virtual-network-subnet-for-use-with-a-lab-plan) to **Microsoft.LabServices/labplans**.
1. [Create a network security group (NSG)](../virtual-network/manage-network-security-group.md).
1. [Create an inbound rule to allow traffic from SSH and RDP ports](../virtual-network/manage-network-security-group.md).
1. [Associate the NSG to the delegated subnet](#associate-delegated-subnet-with-nsg).

Now that the prerequisites have been completed, you can [use advanced networking to connect your virtual network during lab plan creation](#connect-the-virtual-network-during-lab-plan-creation).

## Delegate the virtual network subnet for use with a lab plan

After you create a subnet for your virtual network, you must [delegate the subnet](../virtual-network/subnet-delegation-overview.md) for use with Azure Lab Services.

Only one lab plan at a time can be delegated for use with one subnet.

1. Create a [virtual network](../virtual-network/manage-virtual-network.md) and [subnet](../virtual-network/virtual-network-manage-subnet.md).
2. Open the **Subnets** page for your virtual network.
3. Select the subnet you wish to delegate to Lab Services and open the property window for that subnet.
4. For the **Delegate subnet to a service** property, select **Microsoft.LabServices/labplans**. Select **Save**.

   :::image type="content" source="./media/how-to-connect-vnet-injection/delegate-subnet-for-azure-lab-services.png" alt-text="Screenshot of properties windows for subnet.  The Delegate subnet to a service property is highlighted and set to Microsoft dot Lab Services forward slash lab plans.":::
5. Verify  the lab plan service appears in the **Delegated to** column.

   :::image type="content" source="./media/how-to-connect-vnet-injection/delegated-subnet.png" alt-text="Screenshot of list of subnets for a virtual network.  The Delegated to and Security group columns are highlighted." lightbox="./media/how-to-connect-vnet-injection/delegated-subnet.png":::

## Associate delegated subnet with NSG

> [!WARNING]
> An NSG with inbound rules for RDP and/or SSH is required to allow access to the template and lab VMs.

For connectivity to lab VMs, it's required to associate an NSG with the subnet delegated to Lab Services.  We'll create an NSG, add an inbound rule to allow both SSH and RDP traffic, and then associate the NSG with the delegated subnet.  

1. [Create a network security group (NSG)](../virtual-network/manage-network-security-group.md), if not done already.
2. Create an inbound security rule allowing RDP and SSH traffic.
   1. Select **Inbound security rules** on the left menu.
   2. Select **+ Add** from the top menu bar.  Fill in the details for adding the inbound security rule as follows:
       1. For **Source**, select **Any**.
       2. For **Source port ranges**, select **\***.
       3. For **Destination**, select **IP Addresses**.
       4. For **Destination IP addresses/CIDR ranges**, select subnet range previously created subnet.
       5. For **Service**, select **Custom**.
       6. For **Destination port ranges**, enter **22, 3389**.  Port 22 is for Secure Shell protocol (SSH). Port 3389 is for Remote Desktop Protocol (RDP).
       7. For **Protocol**, select **Any**.
       8. For **Action**, select **Allow**.
       9. For **Priority**, select **1000**.  Priority must be higher than other **Deny** rules for RDP and/or SSH.
       10. For **Name**, enter **AllowRdpSshForLabs**.
       11. Select **Add**.

      :::image type="content" source="media/how-to-connect-vnet-injection/nsg-add-inbound-rule.png" lightbox="media/how-to-connect-vnet-injection/nsg-add-inbound-rule.png" alt-text="Screenshot of Add inbound rule window for Network security group.":::
   3. Wait for the rule to be created.
   4. Select **Refresh** on the menu bar.  Our new rule will now show in the list of rules.
3. Associate the NSG with the delegated subnet.
   1. Select **Subnets** on the left menu.
   1. Select **+ Associate** from the top menu bar.
   1. On the **Associate subnet** page, do the following actions:
       1. For **Virtual network**, select previously created virtual network.
       2. For **Subnet**, select previously created subnet.
       3. Select **OK**.

      :::image type="content" source="media/how-to-connect-vnet-injection/associate-nsg-with-subnet.png" lightbox="media/how-to-connect-vnet-injection/associate-nsg-with-subnet.png" alt-text="Screenshot of Associate subnet page in the Azure portal.":::

## Connect the virtual network during lab plan creation

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource** in the upper left-hand corner of the Azure portal.
1. Search for **lab plan**.  (**Lab plan** can also be found under the **DevOps** category.)
1. Enter required information on the **Basics** tab of the **Create a lab plan** page.  For more information, see [Tutorial: Create a lab plan with Azure Lab Services](tutorial-setup-lab-plan.md).
1. From the **Basics** tab of the **Create a lab plan** page, select **Next: Networking** at the bottom of the page.
1. Select **Enable advanced networking**.

    1. For **Virtual network**, select an existing virtual network for the lab network. For a virtual network to appear in this list, it must be in the same region as the lab plan.
    2. Specify an existing **subnet** for VMs in the lab. For subnet requirements, see [Delegate the virtual network subnet for use with a lab plan](#delegate-the-virtual-network-subnet-for-use-with-a-lab-plan).

        :::image type="content" source="./media/how-to-connect-vnet-injection/create-lab-plan-advanced-networking.png" alt-text="Screenshot of the Networking tab of the Create a lab plan wizard.":::

Once you have a lab plan configured with advanced networking, all labs created with this lab plan use the specified subnet.

## Known issues

- Deleting your virtual network or subnet will cause the lab to stop working
- Changing the DNS label on the public IP will cause the **Connect** button for lab VMs to stop working.
- Azure Firewall isn't currently supported.

## Next steps

See the following articles:

- As an admin, [attach a compute gallery to a lab plan](how-to-attach-detach-shared-image-gallery.md).
- As an admin, [configure automatic shutdown settings for a lab plan](how-to-configure-auto-shutdown-lab-plans.md).
- As an admin, [add lab creators to a lab plan](add-lab-creator.md).