---
title: Add and configure virtual network
titleSuffix: Azure DevTest Labs
description: Learn how to add and configure an existing virtual network and subnet to use for creating virtual machines in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/02/2024
ms.custom: UpdateFrequency2

#customer intent: As a developer, I want to add and configure virtual networks and subnets in Azure DevTest Labs so I can use them to create virtual machines.
---

# Add virtual network in Azure DevTest Labs

In this article, you learn how to add a virtual network to a lab, and configure it for creating lab virtual machines (VMs).

Azure DevTest Labs creates a new virtual network for each lab. If you have an existing virtual network, such as one configured with Azure ExpressRoute or site-to-site virtual private network (VPN), you can add this network to your lab. You can then create lab VMs in that virtual network.

## Add a virtual network to a lab

To add a configured virtual network and subnet to a lab, follow these steps:

1. In the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040), go to your lab resource.

1. On the **Overview** page, expand the **Settings** section on the left menu, and select **Configuration and policies**:

   :::image type="content" source="./media/devtest-lab-configure-vnet/policies-menu.png" alt-text="Screenshot that shows how to select the Configuration and policies option for a lab in the Azure portal." border="false" lightbox="./media/devtest-lab-configure-vnet/policies-menu.png":::

   The **Activity log** view opens for the lab where you can review configuration and policies settings.

1. On the left menu, expand the **External resources** section, and select **Virtual networks** to view the lab's current virtual networks.

1. On the **Virtual networks** page, select **Add**:
   
   :::image type="content" source="./media/devtest-lab-configure-vnet/lab-settings-vnet-add.png" alt-text="Screenshot that shows how to add a new virtual network for a lab in the Azure portal." lightbox="./media/devtest-lab-configure-vnet/lab-settings-vnet-add.png":::

1. On the **Virtual network** page, choose the **Select virtual network** option:

   :::image type="content" source="./media/devtest-lab-configure-vnet/lab-settings-vnet-select.png" alt-text="Screenshot that shows to choose the Select virtual network option on the Virtual network page." lightbox="./media/devtest-lab-configure-vnet/lab-settings-vnet-select.png":::

1. The **Choose virtual network** page shows all virtual networks in the subscription that are in the same region as the lab. Select the virtual network that you want to add to your lab:

   :::image type="content" source="./media/devtest-lab-configure-vnet/choose-virtual-network.png" alt-text="Screenshot that shows the Choose virtual network page with a list of available virtual networks for the lab." lightbox="./media/devtest-lab-configure-vnet/choose-virtual-network.png":::

1. The virtual network that you select appears on the **Virtual network** page. Select **Save** to add the virtual network to your lab:

   :::image type="content" source="./media/devtest-lab-configure-vnet/lab-settings-vnet-save.png" alt-text="Screenshot that shows how to save the selected virtual network to your lab in the Azure portal." lightbox="./media/devtest-lab-configure-vnet/lab-settings-vnet-save.png":::

1. The added virtual network appears in the list for the lab on the **Virtual networks** page. When the **Status** for the new virtual network shows as **Ready**, select the network:

   :::image type="content" source="./media/devtest-lab-configure-vnet/lab-settings-vnet-ready.png" alt-text="Screenshot that shows how to select the added virtual network on the lab's Virtual networks page when the statue is ready." lightbox="./media/devtest-lab-configure-vnet/lab-settings-vnet-ready.png":::

1. The **Virtual network** page shows the subnets for the new virtual network. Select a subnet to configure:

   :::image type="content" source="./media/devtest-lab-configure-vnet/lab-settings-vnet-subnet.png" alt-text="Screenshot that shows how to select the subnet for the new virtual network for the lab." lightbox="./media/devtest-lab-configure-vnet/lab-settings-vnet-subnet.png":::

1. On the **Lab Subnet** pane, configure the following options:

   - **Use in virtual machine creation**: Allow or disallow virtual machine (VM) creation in the subnet.
   - **Enable shared public IP**: Enable or disable a [shared public IP address](devtest-lab-shared-ip.md).
   - **Allow public IP creation**: Allow or disallow creating public IP addresses in the subnet.
   - **Maximum virtual machines per user**: Specify the maximum number of VMs each user can create in the subnet. If you don't want to restrict the number of VMs, leave this field blank.

1. On the **Lab Subnet** pane, select **Save**. The **Virtual network** page refreshes to show the configured subnet for the virtual network.

1. On the **Virtual network** page, select **Save** to apply the virtual network subnet changes to your lab.

## Create VMs in a virtual network

When you allow VM creation in a subnet, you can create lab VMs in the added virtual network with these steps:

1. Add a lab VM and select a VM base by following the instructions in [Create and add virtual machines](devtest-lab-add-vm.md).

1. On the **Create lab resource** screen, select the **Advanced settings** tab.

1. Expand the **Virtual network** dropdown list and select the virtual network you added.

1. As necessary, expand the **Subnet Selector** dropdown list and select the desired subnet.

1. Continue with creating the VM.

## Related content

- [Azure virtual network documentation](../virtual-network/index.yml)
- [Enable browser connection to DevTest Labs VMs with Azure Bastion](enable-browser-connection-lab-virtual-machines.md)
