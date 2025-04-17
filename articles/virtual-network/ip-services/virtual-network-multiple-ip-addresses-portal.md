---
title: Assign multiple IP addresses to virtual machines - Azure portal
description: Learn how to assign multiple IP addresses to a virtual machine using the Azure portal.
services: virtual-network
ms.date: 02/06/2024
ms.author: mbender
author: mbender-ms
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.custom: template-how-to, engagement-fy23
---
# Assign multiple IP addresses to virtual machines using the Azure portal

An Azure Virtual Machine (VM) has one or more network interfaces (NIC) attached to it. Any NIC can have one or more static or dynamic public and private IP addresses assigned to it. 

Assigning multiple IP addresses to a VM enables the following capabilities:

- Hosting multiple websites or services with different IP addresses and TLS/SSL certificates on a single server.
- Serve as a network virtual appliance, such as a firewall or load balancer.
- The ability to add any (primary or secondary) private IP addresses of the NICs to an Azure Load Balancer backend pool. For more information about load balancing multiple IP configurations, see [Load balancing multiple IP configurations](../../load-balancer/load-balancer-multiple-ip.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Outbound rules](../../load-balancer/outbound-rules.md#limitations).

Every NIC attached to a VM has one or more IP configurations associated to it. Each configuration is assigned one static or dynamic private IP address. Each configuration may also have one public IP address resource associated to it. To learn more about IP addresses in Azure, see [IP addresses in Azure](../../virtual-network/ip-services/public-ip-addresses.md).

> [!NOTE]
> All IP configurations on a single NIC must be associated to the same subnet.  If multiple IPs on different subnets are desired, multiple NICs on a VM can be used. To learn more about multiple NICs on a VM in Azure, see [Create VM with Multiple NICs](/azure/virtual-machines/windows/multiple-nics).

There's a limit to how many private IP addresses can be assigned to a NIC. There's also a limit to how many public IP addresses that can be used in an Azure subscription. See the [Azure limits](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article for details.

This article explains how to add multiple IP addresses to a virtual machine using the Azure portal. 

> [!NOTE]
> If you want to create a virtual machine with multiple IP addresses, or a static private IP address, you must create it using [PowerShell](virtual-network-multiple-ip-addresses-powershell.md) or the [Azure CLI](virtual-network-multiple-ip-addresses-cli.md). 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure virtual machine with a Public IP. For more information about creating a virtual machine, see [Create a Windows VM](/azure/virtual-machines/windows/quick-create-portal) or [Create a Linux VM](/azure/virtual-machines/linux/quick-create-portal). 
    - The example used in this article is named **myVM**. Replace this value with your virtual machine name.
    - Windows Server virtual machines require port **3389** to be open for Remote Desktop Protocol (RDP) connections. Linux virtual machines require port **22** to be open for Secure Shell (SSH) connections.
- An Azure Bastion instance deployed for VM management in the same subnet as your virtual machine. For more information, see [Deploy Azure Bastion automatically](../../bastion/quickstart-host-portal.md)

> [!NOTE]
> Though the steps in this article assign all IP configurations to a single NIC, you can also assign multiple IP configurations to any NIC in a multi-NIC VM. To learn how to create a VM with multiple NICs, see [Create a VM with multiple NICs](/azure/virtual-machines/windows/multiple-nics).

:::image type="content" source="./media/virtual-network-multiple-ip-addresses-portal/multiple-ipconfigs.png" alt-text="Diagram of network configuration resources created in How-to article.":::

  *Figure: Diagram of network configuration resources created in this How-to article.*

## Add public and private IP address to a VM

You can add a private and public IP address to an Azure network interface by completing the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

3. In **Virtual machines**, select **myVM** or the name of your virtual machine.

4. Select **Network settings** under **Networking**.

5. In **Network settings**, Select the name of the network interface and IP configuration of the virtual machine in the **Network interface / IP configuration** dropdown menu. The existing IP configuration is displayed. In this example, it's named **myvm138_z1 (primary) / ipconfig1 (primary)**.

    :::image type="content" source="./media/virtual-network-multiple-ip-addresses-portal/select-nic.png" alt-text="Screenshot of myVM networking and network interface selection.":::

6. In **IP Configurations** To add a private and public IP address to the virtual machine, select **+ Add**.

8. In **Add IP configuration**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **ipconfig2**. |
    | **Private IP address settings** |   |
    | Allocation | Select **Static**. |
    | Private IP address | Enter an unused address in the network for your virtual machine. </br> For the 10.1.0.0/24 subnet in the example, an IP would be **10.1.0.5**. |
    | **Public IP address** | Select **Associate public IP address** |
    | Public IP address | Select **Create a public IP address**. </br> Enter **public-ip-02** in **Name**. </br> Select **Standard** in **SKU**. </br> Select **OK**. |

9. Select **OK**.

> [!NOTE]
> When adding a static IP address, you must specify an unused, valid address on the subnet the NIC is connected to.

> [!IMPORTANT]
> After you change the IP address configuration, you must restart the VM for the changes to take effect in the VM.

## Add private IP address to a VM

You can add a private IP address to a virtual machine by completing the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

3. In **Virtual machines**, select **myVM** or the name of your virtual machine.

4. Select **Networking** in **Settings**.

5. Select the name of the network interface of the virtual machine. In this example, it's named **myvm889_z1**.

    :::image type="content" source="./media/virtual-network-multiple-ip-addresses-portal/select-nic.png" alt-text="Screenshot of myVM networking and network interface selection.":::

6. In the network interface, select **IP configurations** in **Settings**.

7. The existing IP configuration is displayed. This configuration is created when the virtual machine is created. To add a private and public IP address to the virtual machine, select **+ Add**.

8. In **Add IP configuration**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **ipconfig3**. |
    | **Private IP address settings** |   |
    | Allocation | Select **Static**. |
    | IP address | Enter an unused address in the network for your virtual machine. </br> For the 10.1.0.0/24 subnet in the example, an IP would be **10.1.0.6**. |

9. Select **OK**.

> [!NOTE]
> When adding a static IP address, you must specify an unused, valid address on the subnet the NIC is connected to.

> [!IMPORTANT]
> After you change the IP address configuration, you must restart the VM for the changes to take effect in the VM.

[!INCLUDE [virtual-network-multiple-ip-addresses-os-config.md](../../../includes/virtual-network-multiple-ip-addresses-os-config.md)]

## Next steps

- Learn more about [public IP addresses](public-ip-addresses.md) in Azure.
- Learn more about [private IP addresses](private-ip-addresses.md) in Azure.
- Learn how to [Configure IP addresses for an Azure network interface](virtual-network-network-interface-addresses.md).
