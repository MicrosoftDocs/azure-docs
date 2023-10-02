---
title: 'Tutorial: Migrate a virtual machine public IP address to NAT gateway'
titleSuffix: Azure NAT Gateway
description: Learn how to migrate your virtual machine public IP to a NAT gateway.
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: tutorial
ms.date: 5/25/2022
ms.custom: template-tutorial 
---

# Tutorial: Migrate a virtual machine public IP address to Azure NAT Gateway

In this article, you'll learn how to migrate your virtual machine's public IP address to a NAT gateway. You'll learn how to remove the IP address from the virtual machine. You'll reuse the IP address from the virtual machine for the NAT gateway.

Azure NAT Gateway is the recommended method for outbound connectivity. Azure NAT Gateway is a fully managed and highly resilient Network Address Translation (NAT) service. A NAT gateway doesn't have the same limitations of SNAT port exhaustion as default outbound access. A NAT gateway replaces the need for a virtual machine to have a public IP address to have outbound connectivity.

For more information about Azure NAT Gateway, see [What is Azure NAT Gateway](nat-overview.md)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Remove the public IP address from the virtual machine.
> * Associate the public IP address from the virtual machine with a NAT gateway.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An Azure Virtual Machine with a public IP address assigned to its network interface. For more information on creating a virtual machine with a public IP, see [Quickstart: Create a Windows virtual machine in the Azure portal](../virtual-machines/windows/quick-create-portal.md).
    
    * For the purposes of this article, the example virtual machine is named **myVM**. The example public IP address is named **myPublicIP**.

> [!NOTE]
> Removal of the public IP address prevents direct connections to the virtual machine from the internet. RDP or SSH access won't function to the virtual machine after you complete this migration. To securely manage virtual machines in your subscription, use Azure Bastion. For more information on Azure Bastion, see [What is Azure Bastion?](../bastion/bastion-overview.md).

## Remove public IP from virtual machine

In this section, you'll learn how to remove the public IP address from the virtual machine.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines**.

3. In **Virtual machines**, select **myVM** or your virtual machine.

4. In the **Overview** of **myVM**, select **Public IP address**.
    
    :::image type="content" source="./media/tutorial-migrate-ilip-nat/select-public-ip.png" alt-text="Screenshot of virtual machines public IP address.":::

5. In **myPublicIP**, select the **Overview** page in the left-hand column.

6. In **Overview**, select **Dissociate**.

    :::image type="content" source="./media/tutorial-migrate-ilip-nat/remove-public-ip.png" alt-text="Screenshot of virtual machines public IP address overview and removal of IP address.":::

7. Select **Yes** in **Dissociate public IP address**.

### (Optional) Upgrade IP address

The NAT gateway resource requires a standard SKU public IP address. In this section, you'll upgrade the IP you removed from the virtual machine in the previous section. If the IP address you removed is already a standard SKU public IP, you can proceed to the next section.

1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses**.

2. In **Public IP addresses**, select **myPublicIP** or your basic SKU IP address.

3. In the **Overview** of **myPublicIP**, select the IP address upgrade banner.

    :::image type="content" source="./media/tutorial-migrate-ilip-nat/select-upgrade-banner.png" alt-text="Screenshot of public IP address upgrade banner.":::

4. In **Upgrade to Standard SKU**, select the box next to **I acknowledge**. Select the **Upgrade** button.

    :::image type="content" source="./media/tutorial-migrate-ilip-nat/upgrade-public-ip.png" alt-text="Screenshot of upgrade public IP address selection.":::

5. When the upgrade is complete, proceed to the next section.
## Create NAT gateway

In this section, you’ll create a NAT gateway with the IP address you previously removed from the virtual machine. You'll assign the NAT gateway to your pre-created subnet within your virtual network. The subnet name for this example is **default**.

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways**.

2. In **NAT gateways**, select **+ Create**.

3. In **Create network address translation (NAT) gateway**, enter or select the following information in the **Basics** tab.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroup**. </br> Select **OK**. |
    | **Instance details** |   |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select the region of your virtual network. In this example, it's **West US 2**. |
    | Availability zone | Leave the default of **None**. |
    | Idle timeout (minutes) | Enter **10**. |

4. Select the **Outbound IP** tab, or select **Next: Outbound IP** at the bottom of the page.

5. In **Public IP addresses** in the **Outbound IP** tab, select the IP address from the previous section in **Public IP addresses**. In this example, it's **myPublicIP**.

6. Select the **Subnet** tab, or select **Next: Subnet** at the bottom of the page.

7. In the pull-down box for **Virtual network**, select your virtual network.

8. In **Subnet name**, select the checkbox for your subnet. In this example, it's **default**.

9. Select the **Review + create** tab, or select **Review + create** at the bottom of the page.

10. Select **Create**.

## Clean up resources

If you're not going to continue to use this application, delete the NAT gateway with the following steps:

1. From the left-hand menu, select **Resource groups**.

2. Select the **myResourceGroup** resource group.

3. Select **Delete resource group**.

4. Enter **myResourceGroup** and select **Delete**.

## Next steps

In this article, you learned how to:

* Remove a public IP address from a virtual machine.

* Create a NAT gateway and use the public IP address from the virtual machine for the NAT gateway resource.

Any virtual machine created within this subnet won't require a public IP address and will automatically have outbound connectivity. For more information about NAT gateway and the connectivity benefits it provides, see [Design virtual networks with NAT gateway](nat-gateway-resource.md). 

Advance to the next article to learn how to migrate default outbound access to Azure NAT Gateway:
> [!div class="nextstepaction"]
> [Migrate outbound access to NAT gateway](tutorial-migrate-outbound-nat.md)
