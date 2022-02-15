---
title: Add and configure a virtual network for a lab
description: Learn how to configure an existing virtual network and subnet to use for creating virtual machines in Azure DevTest Labs.
ms.topic: how-to
ms.date: 02/15/2022
---

# Add a virtual network in Azure DevTest Labs

Azure DevTest Labs creates a new virtual network for each lab. If you have another virtual network configured with Azure ExpressRoute or site-to-site VPN, you can add it to your lab. You can then create lab virtual machines (VMs) in that virtual network. This article explains how to add a virtual network to a lab and configure it for creating lab VMs.

## Add a virtual network to a lab

To add a configured virtual network and subnet to a lab, take the following steps:

1. In the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040), on the **Overview** page for your lab, select **Configuration and policies** from the left navigation.

   :::image type="content" source="./media/devtest-lab-configure-vnet/policies-menu.png" alt-text="Screenshot that shows the Configuration and policies menu for a lab.":::

1. On the **Configuration and policies** page, in the left navigation under **External resources**, select **Virtual networks**.

1. The **Virtual networks** page shows the lab's current virtual networks. Select **Add**.
   
   :::image type="content" source="./media/devtest-lab-configure-vnet/lab-settings-vnet-add.png" alt-text="Screenshot that shows a lab's Virtual networks page with Add selected.":::

1. On the **Virtual network** page, select **Select virtual network**.

   :::image type="content" source="./media/devtest-lab-configure-vnet/lab-settings-vnets-vnet1.png" alt-text="Screenshot that shows Select virtual network selected on the Virtual network page.":::

1. The **Choose virtual network** page shows all the virtual networks in the subscription that are in the same region as the lab. Select the virtual network you want to add.

   :::image type="content" source="./media/devtest-lab-configure-vnet/choose-virtual-network.png" alt-text="Screenshot that shows the Choose virtual network page with a list of virtual networks.":::

1. The **Virtual network** page shows the virtual network name you chose. Select **Save**.

1. The chosen virtual network now appears in the list on the lab's **Virtual networks** page. Select the new network name.

1. The **Virtual network** page shows the subnets for the virtual network. Select a subnet to configure.

1. On the **Lab Subnet** pane, select **Yes** or **No** under the following options:

   - **Use in virtual machine creation** to allow VM creation in the subnet.
   - **Enable shared public IP** to enable a [shared public IP address](devtest-lab-shared-ip.md).
   - **Allow public IP creation** to allow public IP addresses in the subnet

1. Under **Maximum virtual machines per user**, enter the maximum number of VMs each user can create in the subnet. If you don't want to restrict the number of VMs, leave this field blank.

1. Select **Save**.

   :::image type="content" source="./media/devtest-lab-configure-vnet/lab-settings-vnets-vnet2.png" alt-text="Screenshot that shows the settings for the Lab subnet pane.":::

If you chose to allow VM creation in one of the subnets, you can now use the configured virtual network to [create lab VMs](devtest-lab-add-vm.md).

## Add a virtual network during VM creation

You can also specify a configured virtual network to use at the time you create a VM in a lab. For complete details and instructions, see [Create and add virtual machines](devtest-lab-add-vm.md).

## Next steps

For information about how to set up, use, and manage virtual networks, see the [Azure virtual network documentation](/azure/virtual-network/index.yml).
