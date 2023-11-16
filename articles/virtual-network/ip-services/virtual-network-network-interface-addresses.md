---
title: Configure IP addresses for an Azure network interface
description: Learn how to add, change, and remove private and public IP addresses for a network interface.
services: virtual-network
ms.date: 08/24/2023
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.workload: infrastructure-services
ms.custom: template-how-to, engagement-fy23, devx-track-azurecli, devx-track-azurepowershell
---

# Configure IP addresses for an Azure network interface

Both Private and Public IP addresses can be assigned to a virtual machine's network interface controller (NIC).  Private IP addresses assigned to a network interface enable a virtual machine to communicate with other resources in an Azure virtual network and connected networks. A private IP address also enables outbound communication to the Internet using an unpredictable IP address. A [Public IP address](virtual-network-public-ip-address.md) assigned to a network interface enables inbound communication to a virtual machine from the Internet and enables outbound communication from the virtual machine to the Internet using a predictable IP address. For details, see [Understanding outbound connections in Azure](../../load-balancer/load-balancer-outbound-connections.md).

If you need to create, change, or delete a network interface, read the [Manage a network interface](../../virtual-network/virtual-network-network-interface.md) article. If you need to add network interfaces to or remove network interfaces from a virtual machine, read the [Add or remove network interfaces](../../virtual-network/virtual-network-network-interface-vm.md) article.

## Prerequisites

If you don't have an Azure account with an active subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Complete one of these tasks before starting the remainder of this article:

- **Portal users**: Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

- **PowerShell users**: Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or run PowerShell locally from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. Select the Cloud Shell icon from the top navigation bar of the Azure portal and then select **PowerShell** from the drop-down list.

    If you're running PowerShell locally, use Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az.Network` to find the installed version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). Run `Connect-AzAccount` to sign in to Azure.

- **Azure CLI users**: Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash), or run Azure CLI locally from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. Select the Cloud Shell icon from the top navigation bar of the Azure portal and then select **Bash** from the drop-down list.

    If you're running Azure CLI locally, use Azure CLI version 2.0.31 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). Run `az login` to sign in to Azure.

The account you log into, or connect to Azure with, must be assigned to the [network contributor](../../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the appropriate actions listed in [Network interface permissions](../../virtual-network/virtual-network-network-interface.md#permissions).

## Add IP addresses

You can add as many [private](#private) and [public](#public) [IPv4](#ipv4) addresses as necessary to a network interface, within the limits listed in the [Azure limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits) article. You can add a private IPv6 address to one [secondary IP configuration](#secondary) (as long as there are no existing secondary IP configurations) for an existing network interface. Each network interface may have at most one IPv6 private address. You can optionally add a public IPv6 address to an IPv6 network interface configuration. See [IPv6](#ipv6) for details about using IPv6 addresses.

# [**Portal**](#tab/nic-address-portal)

1. In the search box at the top of the portal, enter *network interfaces*. Select **Network interfaces** in the search results.

2. From the list of network interfaces, select the network interface that you want to add an IP address to.

3. Under **Settings**, select **IP configurations** and then select **+ Add**.

   :::image type="content" source="./media/virtual-network-network-interface-addresses/ip-configurations.png" alt-text="Screenshot of I P configurations page in Azure portal.":::

4. Specify the following, then select **OK**:

   | Setting | Value | Details |
   | --- | --- | --- |
   | Name | Enter a name. | The name of IP configuration must be unique within the network interface. |
   | IP version | Select [**IPv4**](#ipv4) or [**IPv6**](#ipv6). | The IP version defines the version of both the private and public IPs in the IP configuration. See [IPv6](#ipv6) to learn more about IPv6 limitations. |
   | Type | Select [**Secondary**](#secondary). | [**Secondary**](#secondary) is the only available option when adding an IP configuration to an existing network interface. A network interface can't have more than one [**Primary**](#primary) IP configuration. |
   | **Private IP address settings** |  |  |
   | Allocation | Select [**Dynamic**](#dynamic) or [**Static**](#static). | [**Dynamic**](#dynamic): Azure automatically assigns the next available address from the address space of the subnet that the network interface is deployed in. <br> [**Static**](#static): You manually assign an unused private IP address from the address space of the subnet that the network interface is deployed in. |
   | IP address | Enter a static IP address. | This option is available if you select **Static** for the private address allocation. |
   | **Public IP address settings** |  |  |
   | Public IP address | Select **Disassociate** or **Associate**. | **Disassociate**: No public IP address with this IP configuration. <br> **Associate**: When selecting this option, a new or existing Public IP address can be added to the IP configuration. To learn more, see [Create a public IP address](virtual-network-public-ip-address.md#create-a-public-ip-address).|
   | Public IP address | Select a public IP address or create a new one. | This option is available if you select **Associate** for the public address. |

   :::image type="content" source="./media/virtual-network-network-interface-addresses/add-ip-configuration.png" alt-text="Screenshot of Add I P configuration page in Azure portal.":::

# [**PowerShell**](#tab/nic-address-powershell)

Use [Add-AzNetworkInterfaceIpConfig](/powershell/module/az.network/add-aznetworkinterfaceipconfig) to create an IP configuration.

```azurepowershell-interactive
## Place the network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -Name myNic -ResourceGroupName myResourceGroup
## Place the virtual network configuration into a variable. ##
$vnet = Get-AzVirtualNetwork -Name myVirtualNetwork -ResourceGroupName myResourceGroup
## Place the subnet configuration into a variable. ##
$subnet = Get-AzVirtualNetworkSubnetConfig -Name mySubnet -VirtualNetwork $vnet
## Create an IP configuration. ##
Add-AzNetworkInterfaceIpConfig -Name myIpConfig -NetworkInterface $nic -Subnet $subnet
## Update the network interface with new changes. ##
Set-AzNetworkInterface -NetworkInterface $nic
```

# [**Azure CLI**](#tab/nic-address-cli)

Use [az network nic ip-config create](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-create) to create an IP configuration

```azurecli-interactive
az network nic ip-config create --resource-group myResourceGroup --name myIpConfig --nic-name myNic
```

---

> [!NOTE]
> After adding a private IP address by creating a secondary IP configuration, manually add the private IP address to the virtual machine operating system by completing the instructions in [Assign multiple IP addresses to virtual machine operating systems](virtual-network-multiple-ip-addresses-portal.md#os-config). See [private](#private) IP addresses for special considerations before manually adding IP addresses to a virtual machine operating system. Do not add any public IP addresses to the virtual machine operating system.

## Change IP address settings

You may need to change the allocation method of an IPv4 address, change the static IPv4 address, or change the public IP address associated with a network interface. Place a virtual machine into the stopped (deallocated) state before changing the private IPv4 address of a secondary IP configuration associated with the secondary network interface. To learn more, see [primary and secondary network interfaces](../../virtual-network/virtual-network-network-interface-vm.md)).

# [**Portal**](#tab/nic-address-portal)

1. In the search box at the top of the portal, enter *network interfaces*. Select **Network interfaces** in the search results.

2. From the list of network interfaces, select the network interface that you want to view or change IP address settings for.

3. Under **Settings**, select **IP configurations** and then select the IP configuration you want to modify.

   :::image type="content" source="./media/virtual-network-network-interface-addresses/change-ip-configuration.png" alt-text="Screenshot of change I P configuration page in Azure portal.":::

4. Change the settings, as desired, using the information about the settings in step 4 of [Add an IP configuration](#add-ip-addresses).

5. Select **Save**.

# [**PowerShell**](#tab/nic-address-powershell)

Use [Set-AzNetworkInterfaceIpConfig](/powershell/module/az.network/set-aznetworkinterfaceipconfig) to update an IP configuration of a network interface.

```azurepowershell-interactive
## Place the network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -Name myNic -ResourceGroupName myResourceGroup
## Place the virtual network configuration into a variable. ##
$vnet = Get-AzVirtualNetwork -Name myVirtualNetwork -ResourceGroupName myResourceGroup
## Place the subnet configuration into a variable. ##
$subnet = Get-AzVirtualNetworkSubnetConfig -Name mySubnet -VirtualNetwork $vnet
## Change the private IP address to 10.0.0.10 and its allocation method to Static. ##
Set-AzNetworkInterfaceIpConfig -Name myIpConfig -NetworkInterface $nic -Subnet $subnet -PrivateIpAddress 10.0.0.10
## Update the network interface with new changes. ##
Set-AzNetworkInterface -NetworkInterface $nic
```

# [**Azure CLI**](#tab/nic-address-cli)

Use [az network nic ip-config update](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-update) to update an IP configuration of a network interface.

```azurecli-interactive
## Change the private IP address to 10.0.0.10 and its allocation method to Static. ##
az network nic ip-config update --resource-group myResourceGroup --nic-name myNic --name myIpConfig --private-ip-address 10.0.0.10
```

---

>[!NOTE]
>If the primary network interface has multiple IP configurations and you change the private IP address of the primary IP configuration, you must manually reassign the primary and secondary IP addresses to the network interface within Windows (not required for Linux). To manually assign IP addresses to a network interface within an operating system, see [Assign multiple IP addresses to virtual machines](virtual-network-multiple-ip-addresses-portal.md#os-config). For special considerations before manually adding IP addresses to a virtual machine operating system, see [private](#private) IP addresses. Do not add any public IP addresses to the virtual machine operating system.

## Remove IP addresses

You can remove [private](#private) and [public](#public) IP addresses from a network interface, but a network interface must always have at least one private IPv4 address assigned to it.

# [**Portal**](#tab/nic-address-portal)

1. In the search box at the top of the portal, enter *network interfaces*. Select **Network interfaces** in the search results.

2. From the list of network interfaces, select the network interface that you want to remove an IP address from.

3. Under **Settings**, select **IP configurations** and then select the **...** of the [secondary](#secondary) IP configuration that you want to delete (you can't delete the [primary](#primary) IP configuration using the Azure portal).

   :::image type="content" source="./media/virtual-network-network-interface-addresses/delete-ip-configuration.png" alt-text="Screenshot of delete an I P configuration in Azure portal.":::

4. Select **Delete**, then select **Yes**, to confirm the deletion. If the configuration had a public IP address resource associated to it, the resource is dissociated from the IP configuration, but the resource isn't deleted.

# [**PowerShell**](#tab/nic-address-powershell)

Use [Remove-AzNetworkInterfaceIpConfig](/powershell/module/az.network/remove-aznetworkinterfaceipconfig) to delete an IP configuration.

```azurepowershell-interactive
## Place the network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -Name myNic -ResourceGroupName myResourceGroup
## Delete myIpConfig2 IP configuration. ##
Remove-AzNetworkInterfaceIpConfig -Name myIpConfig2 -NetworkInterface $nic
## Update the network interface with new changes. ##
Set-AzNetworkInterface -NetworkInterface $nic
```

# [**Azure CLI**](#tab/nic-address-cli)

Use [az network nic ip-config delete](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-delete) to delete an IP configuration.

```azurecli-interactive
az network nic ip-config delete --resource-group myResourceGroup --name myIpConfig2 --nic-name myNic
```

---

## IP configurations

[Private](#private) and (optionally) [public](#public) IP addresses are assigned to one or more IP configurations assigned to a network interface. There are two types of IP configurations:

### Primary

Each network interface is assigned one primary IP configuration. A primary IP configuration:

- Has a [private](#private) [IPv4](#ipv4) address assigned to it. You can't assign a private [IPv6](#ipv6) address to a primary IP configuration.
- May also have a [public](#public) IPv4 address assigned to it. You can't assign a public IPv6 address to a primary (IPv4) IP configuration. 

### Secondary

In addition to a primary IP configuration, a network interface may have zero or more secondary IP configurations assigned to it. A secondary IP configuration:

- Must have a private IPv4 or IPv6 address assigned to it. If the address is IPv6, the network interface can only have one secondary IP configuration. If the address is IPv4, the network interface may have multiple secondary IP configurations assigned to it. To learn more about how many private and public IPv4 addresses can be assigned to a network interface, see the [Azure limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits).
- May also have a public IPv4 or IPv6 address assigned to it. Assigning multiple IPv4 addresses to a network interface is helpful in scenarios such as:
  - Hosting multiple websites or services with different IP addresses and TLS/SSL certificates on a single server.
  - A virtual machine serving as a network virtual appliance, such as a firewall or load balancer.
  - The ability to add any of the private IPv4 addresses for any of the network interfaces to an Azure Load Balancer back-end pool. In the past, only the primary IPv4 address for the primary network interface could be added to a back-end pool. To learn more about how to load balance multiple IPv4 configurations, see [Load balancing multiple IP configurations](../../load-balancer/load-balancer-multiple-ip.md). 
  - The ability to load balance one IPv6 address assigned to a network interface. To learn more about how to load balance to a private IPv6 address, see [Load balance IPv6 addresses](../../load-balancer/load-balancer-ipv6-overview.md).

## Address types

You can assign the following types of IP addresses to an [IP configuration](#ip-configurations):

### Private

Private [IPv4](#ipv4) or IPv6 addresses enable a virtual machine to communicate with other resources in a virtual network or other connected networks. 

By default, the Azure DHCP servers assign the private IPv4 address for the [primary IP configuration](#primary) of the Azure network interface to the network interface within the virtual machine operating system. Unless necessary, you should never manually set the IP address of a network interface within the virtual machine's operating system.

There are scenarios where it's necessary to manually set the IP address of a network interface within the virtual machine's operating system. For example, you must manually set the primary and secondary IP addresses of a Windows operating system when adding multiple IP addresses to an Azure virtual machine. For a Linux virtual machine, you must only need to manually set the secondary IP addresses. See [Add IP addresses to a VM operating system](virtual-network-multiple-ip-addresses-portal.md#os-config) for details. If you ever need to change the address assigned to an IP configuration, it's recommended that you:

1. Ensure that the virtual machine is receiving a primary IP address from the Azure DHCP servers. Don't set this address in the operating system if running a Linux VM.
2. Delete the IP configuration to be changed.
3. Create a new IP configuration with the new address you would like to set.
4. [Manually configure](virtual-network-multiple-ip-addresses-portal.md#os-config) the secondary IP addresses within the operating system (and also the primary IP address within Windows) to match what you set within Azure. Don't manually set the primary IP address in the OS network configuration on Linux, or it may not be able to connect to the Internet when the configuration is re-loaded.
5. Re-load the network configuration on the guest operating system. This can be done by rebooting the system, or by running 'nmcli con down "System eth0 && nmcli con up "System eth0"' in Linux systems running NetworkManager.
6. Verify the networking set-up is as desired. Test connectivity for all IP addresses of the system.

By following the previous steps, the private IP address assigned to the network interface within Azure, and within a virtual machine's operating system, remain the same. To keep track of which virtual machines within your subscription that you've manually set IP addresses within an operating system for, consider adding an Azure [tag](../../azure-resource-manager/management/tag-resources.md) to the virtual machines. You might use "IP address allocation: Static", for example. This way, you can easily find the virtual machines within your subscription that you've manually set the IP address for within the operating system.

In addition to enabling a virtual machine to communicate with other resources within the same, or connected virtual networks, a private IP address also enables a virtual machine to communicate outbound to the Internet. Outbound connections are source network address translated by Azure to an unpredictable public IP address. To learn more about Azure outbound Internet connectivity, see [Azure outbound Internet connectivity](../../load-balancer/load-balancer-outbound-connections.md). You can't communicate inbound to a virtual machine's private IP address from the Internet. If your outbound connections require a predictable public IP address, associate a public IP address resource to a network interface.

### Public

Public IP addresses assigned through a public IP address resource enable inbound connectivity to a virtual machine from the Internet. Outbound connections to the Internet use a predictable IP address. See [Azure outbound Internet connectivity](../../load-balancer/load-balancer-outbound-connections.md) for details. You may assign a public IP address to an IP configuration, but aren't required to. If you don't assign a public IP address to a virtual machine by associating a public IP address resource, the virtual machine can still communicate outbound to the Internet. In this case, the private IP address is source network address translated by Azure to an unpredictable public IP address. To learn more about public IP address resources, see [Manage an Azure public IP address](virtual-network-public-ip-address.md).

There are limits to the number of private and public IP addresses that you can assign to a network interface. For details, read the [Azure limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits) article.

> [!NOTE]
> Azure translates a virtual machine's private IP address to a public IP address. As a result, a virtual machine's operating system is unaware of any public IP address assigned to it, so there is no need to ever manually assign a public IP address within the operating system.

## Allocation methods

Public and private IP addresses are assigned using one of the following allocation methods:

### Dynamic

Dynamic private IPv4 and IPv6 (optionally) addresses are assigned by default.

- **Public only**: Azure assigns the address from a range unique to each Azure region. You can download the list of ranges (prefixes) for the Azure [Public](https://www.microsoft.com/download/details.aspx?id=56519), [US government](https://www.microsoft.com/download/details.aspx?id=57063), [China](https://www.microsoft.com/download/details.aspx?id=57062), and [Germany](https://www.microsoft.com/download/details.aspx?id=57064) clouds. The address can change when a virtual machine is stopped (deallocated), then started again. You can't assign a public IPv6 address to an IP configuration using either allocation method.
- **Private only**: Azure reserves the first four addresses in each subnet address range, and doesn't assign the addresses. Azure assigns the next available address to a resource from the subnet address range. For example, if the subnet's address range is 10.0.0.0/16, and addresses 10.0.0.4-10.0.0.14 are already assigned (.0-.3 are reserved), Azure assigns 10.0.0.15 to the resource. Dynamic is the default allocation method. Once assigned, dynamic IP addresses are only released if a network interface is deleted, assigned to a different subnet within the same virtual network, or the allocation method is changed to static, and a different IP address is specified. By default, Azure assigns the previous dynamically assigned address as the static address when you change the allocation method from dynamic to static. 

### Static

You can (optionally) assign a public or private static IPv4 or IPv6 address to an IP configuration. To learn more about how Azure assigns static public IPv4 addresses, see [Manage an Azure public IP address](virtual-network-public-ip-address.md).

- **Public only**: Azure assigns the address from a range unique to each Azure region. You can download the list of ranges (prefixes) for the Azure [Public](https://www.microsoft.com/download/details.aspx?id=56519), [US government](https://www.microsoft.com/download/details.aspx?id=57063), [China](https://www.microsoft.com/download/details.aspx?id=57062), and [Germany](https://www.microsoft.com/download/details.aspx?id=57064) clouds. The address doesn't change until the public IP address resource it's assigned to is deleted, or the allocation method is changed to dynamic. If the public IP address resource is associated to an IP configuration, it must be disassociated from the IP configuration before changing its allocation method.
- **Private only**: You select and assign an address from the subnet's address range. The address you assign can be any address within the subnet address range that isn't one of the first four addresses in the subnet's address range and isn't currently assigned to any other resource in the subnet. Static addresses are only released if a network interface is deleted. If you change the allocation method to static, Azure dynamically assigns the previously assigned dynamic IP address as the static address, even if the address isn't the next available address in the subnet's address range. The address also changes if the network interface is assigned to a different subnet within the same virtual network, but to assign the network interface to a different subnet, you must first change the allocation method from static to dynamic. Once you've assigned the network interface to a different subnet, you can change the allocation method back to static, and assign an IP address from the new subnet's address range.

## IP address versions

You can specify the following versions when assigning addresses:

### IPv4

Each network interface must have one [primary](#primary) IP configuration with an assigned [private](#private) [IPv4](#ipv4) address. You can add one or more [secondary](#secondary) IP configurations that each have an IPv4 private and (optionally) an IPv4 [public](#public) IP address.

### IPv6

You can assign zero or one private [IPv6](#ipv6) address to one secondary IP configuration of a network interface. The network interface can't have any existing secondary IP configurations. Each network interface may have at most one IPv6 private address. You can optionally add a public IPv6 address to an IPv6 network interface configuration.

> [!NOTE]
> Though you can create a network interface with an IPv6 address using the portal, you can't attach the network interface when creating a virtual machine using the portal. Use PowerShell or the Azure CLI to create a network interface with a private IPv6 address, then attach the network interface when creating a virtual machine. You can't add a private IPv6 address to an IP configuration for any network interface attached to a virtual machine using any tools (portal, CLI, or PowerShell).

## SKUs

A public IP address is created with the basic or standard SKU. For more information about SKU differences, see [Manage public IP addresses](virtual-network-public-ip-address.md).

> [!NOTE]
> When you assign a standard SKU public IP address to a virtual machine’s network interface, you must explicitly allow the intended traffic with a [network security group](../../virtual-network/network-security-groups-overview.md#network-security-groups). Communication with the resource fails until you create and associate a network security group and explicitly allow the desired traffic.

## Next steps
To create a virtual machine with different IP configurations, read the following articles:

|Task|Tool|
|---|---|
|Create a VM with multiple network interfaces|[CLI](../../virtual-machines/linux/multiple-nics.md), [PowerShell](../../virtual-machines/windows/multiple-nics.md)|
|Create a single NIC VM with multiple IPv4 addresses|[CLI](virtual-network-multiple-ip-addresses-cli.md), [PowerShell](virtual-network-multiple-ip-addresses-powershell.md)|
|Create a single NIC VM with a private IPv6 address (behind an Azure Load Balancer)|[CLI](../../load-balancer/load-balancer-ipv6-internet-cli.md), [PowerShell](../../load-balancer/load-balancer-ipv6-internet-ps.md), [Azure Resource Manager template](../../load-balancer/load-balancer-ipv6-internet-template.md)|
