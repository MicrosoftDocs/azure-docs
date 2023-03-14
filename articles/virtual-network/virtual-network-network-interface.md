---
title: Create, change, or delete an Azure network interface
titlesuffix: Azure Virtual Network
description: Learn what a network interface is and how to create, change settings for, and delete one.
author: asudbring
ms.service: virtual-network
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: how-to
ms.date: 03/13/2023
ms.author: allensu
---

# Create, change, or delete a network interface

A network interface enables an Azure virtual machine (VM) to communicate with internet, Azure, and on-premises resources. This article explains how to create, change settings for, and delete a network interface.

A VM you create in the Azure portal has one network interface with default settings. You can create network interfaces with custom settings instead, and add one or more network interfaces to a VM when or after you create it. You can also change network interface settings for an existing network interface.

To add, change, or remove IP addresses for a network interface, see [Manage IP addresses](./ip-services/virtual-network-network-interface-addresses.md). To add or remove network interfaces for VMs, see [Add or remove network interfaces](virtual-network-network-interface-vm.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

# [Portal](#tab/azure-portal)

- An existing Azure virtual network. To create one, see [Quickstart: Create a virtual network by using the Azure portal](quick-create-portal.md).

- To run the procedures, sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

# [Azure CLI](#tab/azure-cli)

- An existing Azure virtual network. To create one, see [Quickstart: Create a virtual network by using Azure CLI](quick-create-cli.md).

### Cloud Shell or Azure CLI

You can run the commands either in the [Azure Cloud Shell](/azure/cloud-shell/overview) or from Azure CLI on your computer.

- Azure Cloud Shell is a free interactive shell that has common Azure tools preinstalled and configured to use with your account. To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of the code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

- If you [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands, you need Azure CLI version 2.31.0 or later. Run [az version](/cli/azure/reference-index?#az-version) to find your installed version, and run [az upgrade](/cli/azure/reference-index?#az-upgrade) to upgrade.
  
  If you're prompted, install the Azure CLI extension on first use. For more information, [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

  Then run [az login](/cli/azure/reference-index#az-login) to connect to Azure.

# [PowerShell](#tab/azure-powershell)

- An existing Azure virtual network. To create one, see [Quickstart: Create a virtual network by using Azure PowerShell](quick-create-powershell.md).

### Cloud Shell or Azure PowerShell

You can run the commands either in the [Azure Cloud Shell](/azure/cloud-shell/overview) or from PowerShell on your computer.

- Azure Cloud Shell is a free interactive shell that has common Azure tools preinstalled and configured to use with your account. To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

- If you [install Azure PowerShell locally](/powershell/azure/install-Az-ps) to run the commands, you need Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

  Also make sure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use `Get-InstalledModule -Name "Az.Network"`. To update, use the command `Update-Module -Name Az.Network`.

  Then run `Connect-AzAccount` to connect to Azure. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

---

### Permissions

To work with network interfaces, your account must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the appropriate actions from the following list:

| Action                                                                     | Name                                                      |
| ---------                                                                  | -------------                                             |
| Microsoft.Network/networkInterfaces/read                                   | Get network interface                                     |
| Microsoft.Network/networkInterfaces/write                                  | Create or update network interface                        |
| Microsoft.Network/networkInterfaces/join/action                            | Attach a network interface to a virtual machine           |
| Microsoft.Network/networkInterfaces/delete                                 | Delete network interface                                  |
| Microsoft.Network/networkInterfaces/joinViaPrivateIp/action                | Join a resource to a network interface via private ip     |
| Microsoft.Network/networkInterfaces/effectiveRouteTable/action             | Get network interface effective route table               |
| Microsoft.Network/networkInterfaces/effectiveNetworkSecurityGroups/action  | Get network interface effective security groups           |
| Microsoft.Network/networkInterfaces/loadBalancers/read                     | Get network interface load balancers                      |
| Microsoft.Network/networkInterfaces/serviceAssociations/read               | Get service association                                   |
| Microsoft.Network/networkInterfaces/serviceAssociations/write              | Create or update a service association                    |
| Microsoft.Network/networkInterfaces/serviceAssociations/delete             | Delete service association                                |
| Microsoft.Network/networkInterfaces/serviceAssociations/validate/action    | Validate service association                              |
| Microsoft.Network/networkInterfaces/ipconfigurations/read                  | Get network interface IP configuration                    |

In the following procedures, you can replace the example names with your own values.

## Create a network interface

A VM you create in the Azure portal has one network interface with default settings. To create a network interface with custom settings and attach it to a VM, use PowerShell or Azure CLI. You can also create and add a network interface to an existing VM by using PowerShell or Azure CLI.

# [Portal](#tab/network-interface-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Network interfaces**.
1. On the **Network interfaces** page, select **Create**.
1. On the **Create network interface** page, enter or select the settings.

:::image type="content" source="./media/virtual-network-network-interface/create-network-interface.png" alt-text="Screenshot of the Create network interface screen in the Azure portal.":::

| Setting | Value | Details |
| ------- | --------- | ------- |
| Subscription | Select your subscription. |  You can assign a network interface only to a virtual network in the same subscription and location.|
| Resource group | Select your resource group or create a new one. | A resource group is a logical container for grouping Azure resources. A network interface can exist in the same or a different resource group from the VM you attach it to or the virtual network you connect it to.|
| Name | Enter a name. | The name must be unique within the resource group. For information about creating a naming convention to make managing several network interfaces easier, see [Naming conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging#resource-naming). You can't change the name after you create the network interface. |
| Region | Select your region.| The Azure region where you create the network interface. |
| Virtual network | Select your virtual network. | You can assign a network interface only to a virtual network in the same subscription and location as the network interface. Once you create a network interface, you can't change the virtual network it's assigned to. The VM you add the network interface to must also be in the same location and subscription as the network interface. |
| Subnet | Select a subnet within the virtual virtual network you selected. | You can change the subnet the network interface is assigned to after you create the network interface. |
| IP Version | Select **IPv4** or **IPv4 and IPv6**. | You can choose to create the network interface with an IPv4 address or IPv4 and IPv6 addresses. To assign an IPv6 address, the network and subnet you use for the interface must also have an IPv6 address space. An IPv6 configuration is assigned to a secondary IP configuration for the network interface.|
| Private IP address assignment | Select **Dynamic** or **Static**. | If you select **Dynamic**, Azure automatically assigns the next available address from the address space of the subnet you selected. <br><br>If you select **Static**, you must manually assign an available IP address from within the address space of the subnet you selected.<br><br>Static and dynamic addresses don't change until you change them or the network interface is deleted. You can change the assignment method after the network interface is created. The Azure DHCP server assigns this address to the network interface in the VM's operating system. |

1. Select **Review + create**.
1. Select **Create**.

The portal doesn't provide the option to assign a public IP address to the network interface when you create it. The portal does create a public IP address and assign it to a network interface when you create a VM. To add a public IP address to the network interface after you create it, see [Manage IP addresses](./ip-services/virtual-network-network-interface-addresses.md). If you want to create a network interface with a public IP address, use Azure CLI or PowerShell.

The portal doesn't provide the option to assign the network interface to application security groups when you create a network interface, but Azure CLI and PowerShell do. However, you can assign an existing network interface to an application security group by using the portal if the network interface is attached to a VM. For more information, see [Add to or remove from application security groups](#add-or-remove-from-application-security-groups).


# [Azure CLI](#tab/network-interface-cli)

The following example creates an Azure public IP address and associates it with the network interface. 

1. Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a primary public IP address.

   ```azurecli-interactive
     az network public-ip create \
       --resource-group myResourceGroup \
       --name myPublicIP \
       --sku Standard \
       --version IPv4 \
       --zone 1 2 3
```

1. Use [az network nic create](/cli/azure/network/nic#az-network-nic-create) to create the network interface. To create a network interface without the public IP address, omit the `--public-ip-address` parameter for `az network nic create`.

```azurecli-interactive
  az network nic create \
    --resource-group myResourceGroup \
    --name myNIC \
    --private-ip-address-version IPv4 \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --public-ip-address myPublicIP
```

# [PowerShell](#tab/network-interface-powershell)

The following example creates an Azure public IP address and associates it with the network interface. 

1. Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a primary public IP address.

   ```azurepowershell-interactive
   $ip = @{
       Name = 'myPublicIP'
       ResourceGroupName = 'myResourceGroup'
       Location = 'eastus2'
       Sku = 'Standard'
       AllocationMethod = 'Static'
       IpAddressVersion = 'IPv4'
       Zone = 1,2,3
   }
   New-AzPublicIpAddress @ip
   ```

1. Use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) and [New-AzNetworkInterfaceIpConfig](/powershell/module/az.network/new-aznetworkinterfaceipconfig) to create the network interface for the VM. To create a network interface without the public IP address, omit the `-PublicIpAddress` parameter for `New-AzNetworkInterfaceIPConfig`.

   ```azurepowershell-interactive
   ## Place the virtual network into a variable. ##
   $net = @{
       Name = 'myVNet'
       ResourceGroupName = 'myResourceGroup'
   }
   $vnet = Get-AzVirtualNetwork @net
   
   ## Place the primary public IP address into a variable. ##
   $pub = @{
       Name = 'myPublicIP'
       ResourceGroupName = 'myResourceGroup'
   }
   $pubIP = Get-AzPublicIPAddress @pub
   
   ## Create primary configuration for NIC. ##
   $IP1 = @{
       Name = 'ipconfig1'
       Subnet = $vnet.Subnets[0]
       PrivateIpAddressVersion = 'IPv4'
       PublicIPAddress = $pubIP
   }
   $IP1Config = New-AzNetworkInterfaceIpConfig @IP1 -Primary
   
   ## Command to create network interface for VM ##
   $nic = @{
       Name = 'myNIC'
       ResourceGroupName = 'myResourceGroup'
       Location = 'eastus2'
       IpConfiguration = $IP1Config
   }
   New-AzNetworkInterface @nic
   ```

---

>[!NOTE]
> Azure assigns a MAC address to the network interface only after the network interface is attached to a VM and the VM starts for the first time. You can't specify the MAC address that Azure assigns to the network interface. The MAC address remains assigned to the network interface until the network interface is deleted or the private IP address assigned to the primary IP configuration of the primary network interface changes. For more information, see [Manage IP addresses](./ip-services/virtual-network-network-interface-addresses.md)

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## View network interface settings

You can view most settings for a network interface after you create it. The portal doesn't display the DNS suffix or application security group membership for the network interface. You can use Azure PowerShell or Azure CLI to view the DNS suffix and application security group membership.

# [Portal](#tab/network-interface-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Network interfaces**.
1. On the **Network interfaces** page, select the network interface you want to view from the list.
1. View the following items for the network interface you selected:

   - The **Overview** page provides essential information about the network interface, such as IP addresses for IPv4 and IPv6 and network security group membership. You can set accelerated networking for network interfaces on the **Overview** page. For more information about accelerated networking, see [What is Accelerated Networking?](accelerated-networking-overview.md)

     :::image type="content" source="./media/virtual-network-network-interface/nic-overview.png" alt-text="Screenshot of network interface Overview.":::

   - **IP configurations:** Public and private IPv4 and IPv6 address assigned to IP configurations are listed. To learn more about IP configurations and how to add and remove IP addresses, see [Configure IP addresses for an Azure network interface](./ip-services/virtual-network-network-interface-addresses.md). IP forwarding and subnet assignment are also configured in this section. To learn more about these settings, see [Enable or disable IP forwarding](#enable-or-disable-ip-forwarding) and [Change subnet assignment](#change-subnet-assignment).

    :::image type="content" source="./media/virtual-network-network-interface/ip-configurations.png" alt-text="Screenshot of network interface IP configurations.":::    

    - **DNS servers:** You can specify which DNS server a network interface is assigned by the Azure DHCP servers. The network interface can inherit the setting from the virtual network or have a custom setting that overrides the setting for the virtual network it's assigned to. To modify what's displayed, see [Change DNS servers](#change-dns-servers).
   
    :::image type="content" source="./media/virtual-network-network-interface/dns-servers.png" alt-text="Screenshot of DNS server configuration."::: 

    - **Network security group (NSG):** Displays which NSG is associated to the network interface. An NSG contains inbound and outbound rules to filter network traffic for the network interface. If an NSG is associated to the network interface, the name of the associated NSG is displayed. To modify what's displayed, see [Associate or dissociate a network security group](#associate-or-dissociate-a-network-security-group).
   
    :::image type="content" source="./media/virtual-network-network-interface/network-security-group.png" alt-text="Screenshot of network security group configuration.":::

    - **Properties:** Displays settings about the network interface, MAC address, and the subscription it exists in. The MAC address is blank if the network interface isn't attached to a virtual machine.
   
    :::image type="content" source="./media/virtual-network-network-interface/nic-properties.png" alt-text="Screenshot of network interface properties.":::

    - **Effective security rules:**  Security rules are listed if the network interface is attached to a running virtual machine and associated with a network security group. The network security group can be assigned to the subnet the network interface is assigned to, or both. To learn more about what's displayed, see [View effective security rules](#view-effective-security-rules). To learn more about NSGs, see [Network security groups](./network-security-groups-overview.md).
   
    :::image type="content" source="./media/virtual-network-network-interface/effective-security-rules.png" alt-text="Screenshot of effective security rules.":::

    - **Effective routes:** Routes are listed if the network interface is attached to a running virtual machine. The routes are a combination of the Azure default routes, any user-defined routes, and any BGP routes that may exist for the subnet the network interface is assigned to. To learn more about what's displayed, see [View effective routes](#view-effective-routes). To learn more about Azure default routes and user-defined routes, see [Routing overview](virtual-networks-udr-overview.md).
    
    :::image type="content" source="./media/virtual-network-network-interface/effective-routes.png" alt-text="Screenshot of effective routes.":::

# [PowerShell](#tab/network-interface-powershell)

Use [Get-AzNetworkInterface](/powershell/module/az.network/get-aznetworkinterface) to view network interfaces in the subscription or view settings for a network interface.

>[!NOTE]
> Remove the  `-Name` and `-ResourceGroupName` parameters to return all the network interfaces in the subscription.

```azurepowershell
Get-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup
```

# [Azure CLI](#tab/network-interface-cli)

Use [az network nic list](/cli/azure/network/nic#az-network-nic-list) to view network interfaces in the subscription.

```azurecli
az network nic list 
```

Use [az network nic show](/cli/azure/network/nic#az-network-nic-show) to view the settings for a network interface.

```azurecli
az network nic show --name myNIC --resource-group myResourceGroup
```

---

## Change network interface settings

You can change most settings for a network interface after you create it.

### Change DNS servers

The DNS server is assigned by the Azure DHCP server to the network interface within the VM operating system. For more information about name resolution settings for a network interface, see [Name resolution for virtual machines](virtual-networks-name-resolution-for-vms-and-role-instances.md). The network interface can inherit the settings from the virtual network, or use its own unique settings that override the setting for the virtual network.

# [Portal](#tab/network-interface-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Network interfaces**.
1. On the **Network interfaces** page, select the network interface you want to change from the list.
1. In **Settings**, select **DNS servers**.

1. Select either:
   
   - **Inherit from virtual network**: Choose this option to inherit the DNS server setting defined for the virtual network the network interface is assigned to. At the virtual network level, either a custom DNS server or the Azure-provided DNS server is defined. The Azure-provided DNS server can resolve hostnames for resources assigned to the same virtual network. FQDN must be used to resolve for resources assigned to different virtual networks.

   - **Custom**: You can configure your own DNS server to resolve names across multiple virtual networks. Enter the IP address of the server you want to use as a DNS server. The DNS server address you specify is assigned only to this network interface and overrides any DNS setting for the virtual network the network interface is assigned to.

   >[!NOTE]
   >If the VM uses a NIC that's part of an availability set, all the DNS servers that are specified for each of the VMs from all NICs that are part of the availability set are inherited.

1. Select **Save**.

# [Azure CLI](#tab/network-interface-cli)

Use [az network nic update](/cli/azure/network/nic#az-network-nic-update) to change the DNS server setting from inherited to a custom setting. Replace the DNS server IP addresses with your custom IP addresses.

```azurecli
az network nic update \
    --name myNIC \
    --resource-group myResourceGroup \
    --dns-servers 192.168.1.100 192.168.1.101
```

To remove the DNS servers and change the setting to virtual network setting inheritance, use the following command.

```azurecli
az network nic update \
    --name myNIC \
    --resource-group myResourceGroup \
    --dns-servers ""
```

# [PowerShell](#tab/network-interface-powershell)

Use [Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface) to change the DNS server setting from inherited to a custom setting. Replace the DNS server IP addresses with your custom IP addresses.

```azurepowershell
## Place the network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup

## Add the DNS servers to the configuration. ##
$nic.DnsSettings.DnsServers.Add("192.168.1.100")

## Add a secondary DNS server if needed, otherwise set the configuration. ##
$nic.DnsSettings.DnsServers.Add("192.168.1.101")

## Apply the new configuration to the network interface. ##
$nic | Set-AzNetworkInterface
```

To remove the DNS servers and change the setting to inherit from the virtual network, use the following command. Replace the DNS server IP addresses with your custom IP addresses.

```azurepowershell
## Place the network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup

## Add the DNS servers to the configuration. ##
$nic.DnsSettings.DnsServers.Remove("192.168.1.100")

## Add a secondary DNS server if needed, otherwise set the configuration. ##
$nic.DnsSettings.DnsServers.Remove("192.168.1.101")

## Apply the new configuration to the network interface. ##
$nic | Set-AzNetworkInterface
```

---

### Enable or disable IP forwarding

IP forwarding enables the VM network interface to:

- Receive network traffic not destined for one of the IP addresses assigned to any of the IP configurations assigned to the network interface.
- Send network traffic with a different source IP address than the one assigned to one of a network interface's IP configurations.

You must enable the setting for every network interface that's attached to the VM that receives traffic that the VM needs to forward. A VM can forward traffic whether it has multiple network interfaces or a single network interface attached to it. While IP forwarding is an Azure setting, the VM must also run an application able to forward the traffic, such as firewall, WAN optimization, or load balancing applications. 

When a VM is running network applications, the VM is often called a network virtual appliance (NVA). You can view a list of ready-to-deploy NVAs in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?page=1&subcategories=appliances). IP forwarding is typically used with user-defined routes. For more information, see [User-defined routes](virtual-networks-udr-overview.md).

# [Portal](#tab/network-interface-portal)

1. In **Settings** for your network interface, select **IP configurations**.
1. Select **Enabled** or **Disabled**, the default, to change the setting.
1. Select **Save**.

# [PowerShell](#tab/network-interface-powershell)

Use [Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface) to enable or disable the IP forwarding setting.

To enable IP forwarding, use the following command:

```azurepowershell
## Place the network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup

## Set the IP forwarding setting to enabled. ##
$nic.EnableIPForwarding = 1

## Apply the new configuration to the network interface. ##
$nic | Set-AzNetworkInterface

```

To disable IP forwarding, use the following command:

```azurepowershell
## Place the network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup

## Set the IP forwarding setting to disabled. ##
$nic.EnableIPForwarding = 0

## Apply the new configuration to the network interface. ##
$nic | Set-AzNetworkInterface

```

# [Azure CLI](#tab/network-interface-cli)

Use [az network nic update](/cli/azure/network/nic#az-network-nic-update) to enable or disable the IP forwarding setting.

To enable IP forwarding, use the following command:

```azurecli
az network nic update \
    --name myNIC \
    --resource-group myResourceGroup \
    --ip-forwarding true
```

To disable IP forwarding, use the following command:

```azurecli
az network nic update \
    --name myNIC \
    --resource-group myResourceGroup \
    --ip-forwarding false
```

---

### Change subnet assignment

You can change the subnet, but not the virtual network, that a network interface is assigned to.

# [Portal](#tab/network-interface-portal)

1. In the **Settings** for your network interface, select **IP configurations**.
1. If any private IP addresses for any IP configurations listed have **(Static)** next to them, you must change the IP address assignment method to dynamic. All private IP addresses must be assigned with the dynamic assignment method to change the subnet assignment for the network interface. To change the assignment method to dynamic:

   1. Select the IP configuration you want to change the IPv4 address assignment method for from the list of IP configurations.
   1. Select **Dynamic** for the private IP address in **Assignment**.
   1. Select **Save**.

1. When all private IP addresses are set to **Dynamic**, select the subnet you want to move the network interface to from the **Subnet** drop-down list.
1. Select **Save**. 

New dynamic addresses are assigned from the new subnet's address range. After assigning the network interface to a new subnet, you can assign a static IPv4 address from the new subnet address range if you choose. For more information about adding, changing, and removing IP addresses for a network interface, see [Manage IP addresses](./ip-services/virtual-network-network-interface-addresses.md).

# [Azure CLI](#tab/network-interface-cli)

Use [az network nic ip-config update](/cli/azure/network/nic#az-network-nic-ip-config-update) to change the subnet of the network interface.

```azurecli
az network nic ip-config update \
    --name ipv4config \
    --nic-name myNIC \
    --resource-group myResourceGroup \
    --subnet mySubnet \
    --vnet-name myVNet
```

# [PowerShell](#tab/network-interface-powershell)

Use [Set-AzNetworkInterfaceIpConfig](/powershell/module/az.network/set-aznetworkinterfaceipconfig) to change the subnet of the network interface.

```azurepowershell
## Place the virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Place the network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup

## Change the subnet in the IP configuration. Replace the subnet number with number of your subnet in your VNet. Your first listed subnet in your VNet is 0, next is 1, and so on. ##
$IP = @{
    Name = 'ipv4config'
    Subnet = $vnet.Subnets[1]
}
$nic | Set-AzNetworkInterfaceIpConfig @IP

## Apply the new configuration to the network interface. ##
$nic | Set-AzNetworkInterface

```

---

### Add or remove from application security groups

You can use the portal add or remove a network interface for an application security group only if the network interface is attached to a VM. You can use PowerShell or Azure CLI to add or remove a network interface from an application security group regardless of VM configuration. For more information, see [Application security groups](./network-security-groups-overview.md#application-security-groups) and [How to create an application security group](manage-network-security-group.md).

# [Portal](#tab/network-interface-portal)

1. In the **Settings** for your network interface, select **Networking**.
1. Select the **Application security groups** tab.
1. Select **Configure the application security groups**.

   :::image type="content" source="./media/virtual-network-network-interface/application-security-group.png" alt-text="Screenshot of application security group configuration.":::

1. Select the application security groups you want to add the network interface to, or deselect the application security groups you want to remove the network interface from.
1. Select **Save**.

# [Azure CLI](#tab/network-interface-cli)

Use [az network nic ip-config update](/cli/azure/network/nic#az-network-nic-ip-config-update) to set the application security group.

```azurecli
az network nic ip-config update \
    --name ipv4config \
    --nic-name myNIC \
    --resource-group myResourceGroup \
    --application-security-groups myASG
```

# [PowerShell](#tab/network-interface-powershell)

Use [Set-AzNetworkInterfaceIpConfig](/powershell/module/az.network/set-aznetworkinterfaceipconfig) to set the application security group.

```azurepowershell
## Place the virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Place the subnet configuration into a variable. ##
$subnet = Get-AzVirtualNetworkSubnetConfig -Name mySubnet -VirtualNetwork $vnet

## Place the network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup

## Place the application security group configuration into a variable. ##
$asg = Get-AzApplicationSecurityGroup -Name myASG -ResourceGroupName myResourceGroup

## Add the application security group to the IP configuration. ##
$IP = @{
    Name = 'ipv4config'
    Subnet = $subnet
    ApplicationSecurityGroup = $asg
}
$nic | Set-AzNetworkInterfaceIpConfig @IP

## Save the configuration to the network interface. ##
$nic | Set-AzNetworkInterface
```

---

You can only add network interfaces that exist in the same virtual network to an application security group. The application security group must exist in the same location as the network interface.

### Associate or dissociate a network security group

# [Portal](#tab/network-interface-portal)

1. In the **Settings** for your network interface, select **Network security group**.
1. Select the network security group from the dropdown list.
1. Select **Save**.

# [Azure CLI](#tab/network-interface-cli)

Use [az network nic update](/cli/azure/network/nic#az-network-nic-update) to set the network security group for the network interface.

```azurecli
az network nic update \
    --name myNIC \
    --resource-group myResourceGroup \
    --network-security-group myNSG
```

# [PowerShell](#tab/network-interface-powershell)

Use [Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface) to set the network security group for the network interface.

```azurepowershell
## Place the network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup

## Place the network security group configuration into a variable. ##
$nsg = Get-AzNetworkSecurityGroup -Name myNSG -ResourceGroupName myResourceGroup

## Add the NSG to the NIC configuration. ##
$nic.NetworkSecurityGroup = $nsg

## Save the configuration to the network interface. ##
$nic | Set-AzNetworkInterface
```

---

## Delete a network interface

You can delete a network interface if it's not attached to a VM. If the network interface is attached to a VM, you must first stop and deallocate the VM, then detach the network interface from the VM. 

To detach the network interface from the VM, complete the steps in [Remove a network interface from a VM](virtual-network-network-interface-vm.md#remove-a-network-interface-from-a-vm). You can't detach a network interface from a VM if it's the only network interface attached to the VM. A VM must always have at least one network interface attached to it. 

# [Portal](#tab/network-interface-portal)

On the **Overview** page for the network interface you want to delete, select **Delete**.

# [Azure CLI](#tab/network-interface-cli)

Use [az network nic delete](/cli/azure/network/nic#az-network-nic-delete) to delete the network interface.

```azurecli
az network nic delete --name myNIC --resource-group myResourceGroup
```

# [PowerShell](#tab/network-interface-powershell)

Use [Remove-AzNetworkInterface](/powershell/module/az.network/remove-aznetworkinterface) to delete the network interface.

```azurepowershell
Remove-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup
```

---

## Resolve connectivity issues

If you have communication problems with a VM, network security group rules or effective routes might be causing the problems. Use the following options to help resolve the issue:

### View effective security rules

The effective security rules for each network interface attached to a VM are a combination of the rules you created in a network security group and [default security rules](./network-security-groups-overview.md#default-security-rules). Understanding the effective security rules for a network interface might help you determine why you're unable to communicate to or from a VM. You can view the effective rules for any network interface that's attached to a running VM.

# [Portal](#tab/network-interface-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **virtual machines**.
1. On the **Virtual machines** page, select the VM you want to view settings for.
1. Under **Settings**, select **Networking**.
1. Select the network interface.
1. On the network interface page, select **Effective security rules**.
1. Review the list of effective security rules to determine if the rules are correct for your required inbound and outbound communication. For more information about security rules, see [Network security group overview](network-security-groups-overview.md).

# [Azure CLI](#tab/network-interface-cli)

Use [az network nic list-effective-nsg](/cli/azure/network/nic#az-network-nic-list-effective-nsg) to view the list of effective security rules.

```azurecli
az network nic list-effective-nsg --name myNIC --resource-group myResourceGroup
```

# [PowerShell](#tab/network-interface-powershell)

Use [Get-AzEffectiveNetworkSecurityGroup](/powershell/module/az.network/get-azeffectivenetworksecuritygroup) to view the list of effective security rules.

```azurepowershell
Get-AzEffectiveNetworkSecurityGroup -NetworkInterfaceName myNIC -ResourceGroupName myResourceGroup
```

---

### View effective routes

The effective routes for the network interface or interfaces attached to a VM are a combination of:

- Default routes
- User-defined routes
- Routes propagated from on-premises networks via Border Gateway Protocol (BGP) through an Azure virtual network gateway. 

Understanding the effective routes for a network interface might help you determine why you can't communicate with a VM. You can view the effective routes for any network interface that's attached to a running VM.

# [Portal](#tab/network-interface-portal)

1. On the **Overview** page for your network interface, under **Help**, select **Effective routes**.
1. Review the list of effective routes to see if the routes are correct for your required inbound and outbound communications. For more information about routing, see [Routing overview](virtual-networks-udr-overview.md).

# [Azure CLI](#tab/network-interface-cli)

Use [az network nic show-effective-route-table](/cli/azure/network/nic#az-network-nic-show-effective-route-table) to view a list of the effective routes.

```azurecli
az network nic show-effective-route-table --name myNIC --resource-group myResourceGroup
```

# [PowerShell](#tab/network-interface-powershell)

Use [Get-AzEffectiveRouteTable](/powershell/module/az.network/get-azeffectiveroutetable) to view a list of the effective routes.

```azurepowershell
Get-AzEffectiveRouteTable -NetworkInterfaceName myNIC -ResourceGroupName myResourceGroup
```

---

The next hop feature of Azure Network Watcher can also help you determine if routes are preventing communication between a VM and an endpoint. For more information, see [Next hop](/azure/network-watcher/diagnose-vm-network-routing-problem.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Next steps

- Create a VM with multiple NICs by using [Azure CLI](/azure/virtual-machines/linux/multiple-nics?toc=%2fazure%2fvirtual-network%2ftoc.json) or [PowerShell](/azure/virtual-machines/windows/multiple-nics?toc=%2fazure%2fvirtual-network%2ftoc.json).

- Create a single NIC VM with multiple IPv4 addresses by using [Azure CLI](./ip-services/virtual-network-multiple-ip-addresses-cli.md) or [PowerShell](./ip-services/virtual-network-multiple-ip-addresses-powershell.md).

- Create a single NIC VM with a private IPv6 address behind Azure Load Balancer by using [Azure CLI](/azure/load-balancer/load-balancer-ipv6-internet-cli?toc=%2fazure%2fvirtual-network%2ftoc.json), [PowerShell](/azure/load-balancer/load-balancer-ipv6-internet-ps?toc=%2fazure%2fvirtual-network%2ftoc.json), or an [Azure Resource Manager template](/azure/load-balancer/load-balancer-ipv6-internet-template?toc=%2fazure%2fvirtual-network%2ftoc.json).
