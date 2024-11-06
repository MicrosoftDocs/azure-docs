---
title: Assign private IP address prefixes to VMs - Azure portal
description: Learn how to assign private IP address prefixes to a virtual machine using the Azure portal.
services: virtual-network
ms.date: 11/05/2024
ms.author: ramandhillon84
author: mbender-ms
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.custom: template-how-to, engagement-fy23
---
# Assign private IP address prefixes to virtual machines using the Azure portal (**Preview**)

An Azure Virtual Machine (VM) has one or more network interfaces (NIC) attached to it. All the NICs have one primary IP configuration and zero or more secondary IP configurations assigned to them. 

The primary IP configurations has a private IP Address assigned to it and can optionally have a public IP address assignment as well. Each secondary IP configuration can have 

* A private IP address assignment and optionally a public IP address assignment, OR

* A CIDR block of private IP addresses (IP address prefix)

All the IP addresses can be statically or dynamically assigned from the available IP address ranges. To learn more about IP addresses in Azure, see [IP addresses in Azure](../../virtual-network/ip-services/public-ip-addresses.md).

> [!NOTE]
> All IP configurations on a single NIC must be associated to the same subnet.  If multiple IPs on different subnets are desired, multiple NICs on a VM can be used. To learn more about multiple NICs on a VM in Azure, see [Create VM with Multiple NICs](/azure/virtual-machines/windows/multiple-nics).

There's a limit to how many IP configurations can be assigned to a NIC. See the [Azure limits](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article for details.

This article explains how to add secondary IP configurations on a virtual machine NIC with a CIDR block of private IP addresses using the Azure portal. 

> [!NOTE]
> Powershell and CLI support for adding CIDR blocks of private IP addresses to a NIC is planned and will be available shortly.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure virtual machine. For more information about creating a virtual machine, see [Create a Windows VM](/azure/virtual-machines/windows/quick-create-portal) or [Create a Linux VM](/azure/virtual-machines/linux/quick-create-portal). 
    
    - The example used in this article is named **myVM**. Replace this value with your virtual machine name.

- Registration for the managed preview for this capability, by filling the onboarding form [available here](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_xLgBUz_2ZBtJfUwMlxYKJUN1BPNVhMRzhPTk9DSjBIT1FPRFEzRkZEWi4u).


:::image type="content" source="./media/virtual-network-private-ip-addresses-blocks-portal/block-ipconfigs.png" alt-text="Diagram of network configuration resources created in How-to article.":::

  *Figure: Diagram of network configuration resources created in this How-to article.*

## Add a dynamic private IP address prefix to a VM

You can add a dynamic private IP address prefix to an Azure network interface by completing the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

3. In **Virtual machines**, select **myVM** or the name of your virtual machine.

4. Select **Networking** in **Settings**.

5. Select the name of the network interface of the virtual machine. In this example, it's named **myvm237_z1**.

:::image type="content" source="./media/virtual-network-private-ip-addresses-blocks-portal/select-nic.png" alt-text="Screenshot of myVM networking and network interface selection.":::

6. In the network interface, select **IP configurations** in **Settings**.

7. The existing IP configuration is displayed. This configuration is created when the virtual machine is created. To add a private and public IP address to the virtual machine, select **+ Add**.

8. In **Add IP configuration**, enter or select the following information.

| Setting | Value |
| ------- | ----- |
| Name | Enter **ipconfig2**. |
| **Private IP address settings** |   |
| Private IP Address Type | IP address prefix |
| Allocation | Select **Dynamic** |

9. Select **OK**.

:::image type="content" source="./media/virtual-network-private-ip-addresses-blocks-portal/add-dynamic-ip-prefix-config.png" alt-text="Screenshot of Add IP configuration.":::

> [!NOTE]
> Public IP address association is not available for configuration when IP address prefix option is selected

> [!IMPORTANT]
> After you change the IP address configuration, you must restart the VM for the changes to take effect in the VM.

## Add a static private IP address prefix to a VM

You can add a static private IP address prefix to a virtual machine by completing the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

3. In **Virtual machines**, select **myVM** or the name of your virtual machine.

4. Select **Networking** in **Settings**.

5. Select the name of the network interface of the virtual machine. In this example, it's named **myvm237_z1**.

:::image type="content" source="./media/virtual-network-private-ip-addresses-blocks-portal/select-nic.png" alt-text="Screenshot of myVM networking and network interface selection.":::

6. In the network interface, select **IP configurations** in **Settings**.

7. The existing IP configuration is displayed. This configuration is created when the virtual machine is created. To add a private and public IP address to the virtual machine, select **+ Add**.

8. In **Add IP configuration**, enter or select the following information.

| Setting | Value |
| ------- | ----- |
| Name | Enter **ipconfig2**. |
| **Private IP address settings** |   |
| Private IP Address Type | IP address prefix |
| Allocation | Select **Static**. |
| IP address | Enter an unused CIDR of size /28 from the subnet for your virtual machine. </br> For the 10.0.0.0/14 subnet in the example, an IP would be **10.0.0.0/80**. |

9. Select **OK**.

:::image type="content" source="./media/virtual-network-private-ip-addresses-blocks-portal/add-static-ip-prefix-config-config.png" alt-text="Screenshot of Add static IP configuration for a private IP address block.":::

> [!NOTE]
> When adding a static IP address, you must specify an unused, valid private IP address CIDR from the subnet the NIC is connected to.

> [!IMPORTANT]
> After you change the IP address configuration, you must restart the VM for the changes to take effect in the VM.

[!INCLUDE [virtual-network-multiple-ip-addresses-os-config.md](../../../includes/virtual-network-multiple-ip-addresses-os-config.md)]

## Next steps

- Learn more about [public IP addresses](public-ip-addresses.md) in Azure.
- Learn more about [private IP addresses](private-ip-addresses.md) in Azure.
- Learn how to [Configure IP addresses for an Azure network interface](virtual-network-network-interface-addresses.md).
