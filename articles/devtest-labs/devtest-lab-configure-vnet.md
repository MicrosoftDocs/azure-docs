---
title: Configure a virtual network
description: Learn how to configure an existing virtual network and subnet to use for creating virtual machines in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 02/15/2022
ms.custom: UpdateFrequency2
---

# Add a virtual network in Azure DevTest Labs

In this article, you learn how to add a virtual network to a lab, and configure it for creating lab virtual machines (VMs).

Azure DevTest Labs creates a new virtual network for each lab. If you have another virtual network, such as one configured with Azure ExpressRoute or site-to-site virtual private network (VPN), you can add it to your lab. You can then create lab VMs in that virtual network.

## Add a virtual network to a lab

To add a configured virtual network and subnet to a lab, take the following steps:

1. In the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040), on the **Overview** page for your lab, select **Configuration and policies** from the left navigation.

   :::image type="content" source="./media/devtest-lab-configure-vnet/policies-menu.png" alt-text="Screenshot that shows the Configuration and policies menu for a lab.":::

1. On the **Configuration and policies** page, in the left navigation under **External resources**, select **Virtual networks**.

1. The **Virtual networks** page shows the lab's current virtual networks. Select **Add**.
   
   :::image type="content" source="./media/devtest-lab-configure-vnet/lab-settings-vnet-add.png" alt-text="Screenshot that shows a lab's Virtual networks page with Add selected.":::

1. On the **Virtual network** page, select **Select virtual network**.

   :::image type="content" source="./media/devtest-lab-configure-vnet/lab-settings-vnets-vnet1.png" alt-text="Screenshot that shows Select virtual network selected on the Virtual network page.":::

1. The **Choose virtual network** page appears, showing all virtual networks in the subscription that are in the same region as the lab. Select the virtual network you want to add.

   :::image type="content" source="./media/devtest-lab-configure-vnet/choose-virtual-network.png" alt-text="Screenshot that shows the Choose virtual network page with a list of virtual networks.":::

1. The virtual network you chose shows on the **Virtual network** page. Select **Save**.

1. The virtual network appears in the list on the lab's **Virtual networks** page. When the **Status** shows as **Ready**, select the new virtual network.

   :::image type="content" source="./media/devtest-lab-configure-vnet/lab-subnet.png" alt-text="Screenshot that shows the added virtual network on the lab's Virtual networks page.":::

1. The **Virtual network** page shows the subnets for the virtual network. Select a subnet to configure.

1. On the **Lab Subnet** pane, select **Yes** or **No** under the following options:

   - **Use in virtual machine creation** to allow or disallow VM creation in the subnet.
   - **Enable shared public IP** to enable or disable a [shared public IP address](devtest-lab-shared-ip.md).
   - **Allow public IP creation** to allow or disallow creating public IP addresses in the subnet.

1. Under **Maximum virtual machines per user**, enter the maximum number of VMs each user can create in the subnet. If you don't want to restrict the number of VMs, leave this field blank.

1. Select **Save**.

   :::image type="content" source="./media/devtest-lab-configure-vnet/lab-settings-vnets-vnet2.png" alt-text="Screenshot that shows the settings for the Lab subnet pane.":::

1. On the **Virtual network** page, select **Save** again.

## Create VMs in a virtual network

If you allowed VM creation in one of the subnets, you can now create lab VMs in the added virtual network.

1. Follow the instructions at [Create and add virtual machines](devtest-lab-add-vm.md) to add a lab VM and select a VM base.
1. On the **Create lab resource** screen, select the **Advanced settings** tab.
1. Select the drop-down arrow in the **Virtual network** field, and select the virtual network you added.
1. If necessary, select the drop-down arrow in the **Subnet Selector** field, and select the subnet you want.
1. Proceed with VM creation.

## Next steps

- For more information about how to set up, use, and manage virtual networks, see the [Azure virtual network documentation](../virtual-network/index.yml).
- You can deploy [Azure Bastion](https://azure.microsoft.com/services/azure-bastion) in a new or existing virtual network to enable browser connection to your lab VMs. For more information, see [Enable browser connection to DevTest Labs VMs with Azure Bastion](enable-browser-connection-lab-virtual-machines.md).