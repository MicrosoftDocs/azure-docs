---
title: Connect to your virtual network in Azure Lab Services | Microsoft Docs
description: Learn how to connect a lab to one of your networks. 
ms.topic: how-to
ms.date: 2/11/2022
---

# Connect to your virtual network in Azure Lab Services

[!INCLUDE [preview focused article](./includes/lab-services-new-update-focused-article.md)]

This article provides information about connecting a [lab plan](tutorial-setup-lab-plan.md) to your virtual network.

Some organizations have advanced network requirements and configurations that they want to apply to labs. For example, network requirements can include a network traffic control, ports management, access to resources in an internal network, etc.

In the Azure Lab Services [April 2022 Update (preview)](lab-services-whats-new.md), customers may take control of the network for the labs using virtual network (VNet) injection. You can now tell us which virtual network to use, and we’ll inject the necessary resources into your network.  VNet injection replaces the [peering to your virtual network](how-to-connect-peer-virtual-network.md), as was done in previous versions.

With VNet injection, you can connect to on premise resources such as licensing servers and use user defined routes (UDRs).

## Overview

You can connect to your own virtual network to your lab plan when you create the lab plan.

> [!IMPORTANT]
> VNet injection must be configured when creating a lab plan.  It can't be added later.

Before you configure VNet injection for your lab plan:

- [Create a virtual network](/azure/virtual-network/quick-create-portal).  The virtual network must be in the same region as the lab plan.
- [Create a subnet](/azure/virtual-network/virtual-network-manage-subnet) for the virtual network.
- [Create a network security group (NSG)](/azure/virtual-network/manage-network-security-group) and apply it to the subnet.
- [Delegate the subnet](#delegate-the-virtual-network-subnet-for-use-with-a-lab-plan) to **Microsoft.LabServices/labplans**.

Certain on-premises networks are connected to Azure Virtual Network either through [ExpressRoute](../expressroute/expressroute-introduction.md) or [Virtual Network Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md). These services must be set up outside of Azure Lab Services. To learn more about connecting an on-premises network to Azure using ExpressRoute, see [ExpressRoute overview](../expressroute/expressroute-introduction.md). For on-premises connectivity using a Virtual Network Gateway, the gateway, specified virtual network, network security group, and the lab plan all must be in the same region.

> [!NOTE]
> If your school needs to perform content filtering, such as for compliance with the [Children's Internet Protection Act (CIPA)](https://www.fcc.gov/consumers/guides/childrens-internet-protection-act), you will need to use 3rd party software.  For more information, read guidance on [content filtering with Lab Services](./administrator-guide.md#content-filtering).

## Delegate the virtual network subnet for use with a lab plan

After you create a subnet for your virtual network, you must [delegate the subnet](/azure/virtual-network/subnet-delegation-overview) for use with Azure Lab Services.

Only one lab plan at a time can be delegated for use with one subnet.

1. Create a [virtual network](/azure/virtual-network/manage-virtual-network), [subnet](/azure/virtual-network/virtual-network-manage-subnet), and [network security group (NSG)](/azure/virtual-network/manage-network-security-group) if not done already.
1. Open the **Subnets** page for your virtual network.
1. Select the subnet you wish to delegate to Lab Services to open the property window for that subnet.
1. For the **Delegate subnet to a service** property, select **Microsoft.LabServices/labplans**. Select **Save**.

   :::image type="content" source="./media/how-to-connect-vnet-injection/delegate-subnet-for-azure-lab-services.png" alt-text="Screenshot of properties windows for subnet.  The Delegate subnet to a service property is highlighted and set to Microsoft dot Lab Services forward slash lab plans.":::
1. For the **Network security group** property, select the NSG you created earlier.

   > [!WARNING]
   > An NSG is required to allow access to the template and lab VMs. For more information about Lab Services architecture, see [Architecture Fundamentals in Azure Lab Services](classroom-labs-fundamentals.md).

   :::image type="content" source="./media/how-to-connect-vnet-injection/subnet-select-nsg.png" alt-text="Screenshot of properties windows for subnet.  The Network security group property is highlighted.":::

1. Verify  the lab plan service appears in the **Delegated to** column.  Verify the NSG appears in the **Security group** column.

   :::image type="content" source="./media/how-to-connect-vnet-injection/delegated-subnet.png" alt-text="Screenshot of list of subnets for a virtual network.  The Delegated to and Security group columns are highlighted." lightbox="./media/how-to-connect-vnet-injection/delegated-subnet.png":::

## Connect the virtual network during lab plan creation

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource** in the upper left-hand corner of the Azure portal.
1. Search for **lab plan**.  (**Lab plan (preview)** can also be found under the **DevOps** category.)
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
- Azure Firewall isn’t currently supported.

## Next steps

See the following articles:

- As an admin, [attach a compute gallery to a lab plan](how-to-attach-detach-shared-image-gallery.md).
- As an admin, [configure automatic shutdown settings for a lab plan](how-to-configure-auto-shutdown-lab-plans.md).
- As an admin, [add lab creators to a lab plan](add-lab-creator.md).
