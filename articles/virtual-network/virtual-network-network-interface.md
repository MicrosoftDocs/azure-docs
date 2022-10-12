---
title: Create, change, or delete an Azure network interface
titlesuffix: Azure Virtual Network
description: Learn what a network interface is and how to create, change settings for, and delete one.
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 09/15/2022
ms.author: allensu
---

# Create, change, or delete a network interface

Learn how to create, change settings for, and delete a network interface. A network interface enables an Azure Virtual Machine to communicate with internet, Azure, and on-premises resources. A virtual machine created with the Azure portal, has one network interface with default settings. You may instead choose to create network interfaces with custom settings and add one or more network interfaces to a virtual machine when you create it. You may also want to change default network interface settings for an existing network interface. 

This article explains how to create a network interface with custom settings and change the following existing settings:

* [DNS server settings](#change-dns-servers)

* [IP Forwarding](#enable-or-disable-ip-forwarding)

* [Subnet assignment](#change-subnet-assignment)

* [Application security group](#add-or-remove-from-application-security-groups)

* [Network security group](#associate-or-dissociate-a-network-security-group)

* [Network interface deletion](#delete-a-network-interface)

If you need to add, change, or remove IP addresses for a network interface, see [Manage IP addresses](./ip-services/virtual-network-network-interface-addresses.md). If you need to add network interfaces to, or remove network interfaces from virtual machines, see [Add or remove network interfaces](virtual-network-network-interface-vm.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure Virtual Network. For information about creating an Azure Virtual Network, see [Quickstart: Create a virtual network using the Azure portal](/azure/virtual-network/quick-create-portal).
    
    - The example virtual network used in this article is named **myVNet**. Replace the example value with the name of your virtual network. 
    
    - The example subnet used in this article is named **myBackendSubnet**. Replace the example value with the name of your subnet.    

    - The example network interface name used in this article is **myNIC**. Replace the example value with the name of your network interface.
    
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

- This how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command Get-InstalledModule -Name "Az.Network". If the module requires an update, use the command `Update-Module -Name Az.Network` if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

Your account must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the appropriate actions listed in [Permissions](#permissions).

## Create a network interface

A virtual machine created with the Azure portal is created with a network interface with default settings. To create a network interface with custom settings and attach to a virtual machine, use PowerShell or the Azure CLI. You can also create a network interface and add it to an existing virtual machine with PowerShell or the Azure CLI.

For more information on how to create a virtual machine with an existing network interface or how to add or remove from an existing virtual machine, see [Add or remove network interfaces](virtual-network-network-interface-vm.md).

# [**Portal**](#tab/network-interface-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Network interface**. Select **Network interfaces** in the search results.

3. Select **+ Create**.

4. Enter or select the following information in **Create network interface**.

| Setting | Value | Details |
| ------- | --------- | ------- |
| **Project details** |   |   |
| Subscription | Select your subscription. |  You can only assign a network interface to a virtual network that exists in the same subscription and location as the network interface. |
| Resource group | Select your resource group or create a new one. The example used in this article is **myResourceGroup**. | A resource group is a logical container for grouping Azure resources. A network interface can exist in the same, or different resource group, than the virtual machine you attach it to, or the virtual network you connect it to.|
| **Instance details** |    |    |
| Name | Enter **myNIC**. | The name must be unique within the resource group you select. Over time, you'll likely have several network interfaces in your Azure subscription. For suggestions when creating a naming convention to make managing several network interfaces easier, see [Naming conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging#resource-naming). The name can't be changed after the network interface is created. |
| Region | Select your region. The example used in this article is **East US 2**. | The Azure region where the network interface is created. |
| Virtual network | Select **myVNet** or your virtual network. | You can only assign a network interface to a virtual network that exists in the same subscription and location as the network interface. Once a network interface is created, you can't change the virtual network it's assigned to. The virtual machine you add the network interface to must also exist in the same location and subscription as the network interface. |
| Subnet | Select **myBackendSubnet**. | A subnet within the virtual network you selected. You can change the subnet the network interface is assigned to after it's created. |
| IP Version | Select **IPv4** or **IPv4 and IPv6**. | You can choose to create the network interface with an IPv4 address or an IPv4 and IPv6 address. The network and subnet used for the virtual network must also have an IPv6 and IPv6 subnet for the IPv6 address to be assigned. An IPv6 configuration is assigned to a secondary IP configuration for the network interface. To learn more about IP configurations, see [View network interface settings](#view-network-interface-settings).|
| Private IP address assignment | Select **Dynamic** or **Static**. | **Dynamic:** If dynamic is selected, Azure automatically assigns the next available address from the address space of the subnet you selected. </br> **Static:** When selecting this option, you must manually assign an available IP address from within the address space of the subnet you selected. Static and dynamic addresses don't change until you change them or the network interface is deleted. You can change the assignment method after the network interface is created. The Azure DHCP server assigns this address to the network interface within the operating system of the virtual machine. |

:::image type="content" source="./media/virtual-network-network-interface/create-network-interface.png" alt-text="Screenshot of create network interface in Azure portal.":::

5. Select **Review + create**.

6. Select **Create**.

The portal doesn't provide the option to assign a public IP address to the network interface when you create it. The portal does create a public IP address and assign it to a network interface when you create a virtual machine in the portal. To learn how to add a public IP address to the network interface after creating it, see [Manage IP addresses](./ip-services/virtual-network-network-interface-addresses.md). If you want to create a network interface with a public IP address, you must use the Azure CLI, or PowerShell to create the network interface.

The portal doesn't provide the option to assign the network interface to application security groups when creating a network interface, but the Azure CLI and PowerShell do. You can assign an existing network interface to an application security group using the portal however, as long as the network interface is attached to a virtual machine. To learn how to assign a network interface to an application security group, see [Add to or remove from application security groups](#add-or-remove-from-application-security-groups).

# [**PowerShell**](#tab/network-interface-powershell)

In this example, you'll create an Azure Public IP address and associate it with the network interface. 

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a primary public IP address.

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

Use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) and [New-AzNetworkInterfaceIpConfig](/powershell/module/az.network/new-aznetworkinterfaceipconfig) to create the network interface for the virtual machine. To create a network interface without the public IP address, omit the **`-PublicIpAddress`** parameter for **`New-AzNetworkInterfaceIPConfig`**.

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

# [**Azure CLI**](#tab/network-interface-cli)

In this example, you'll create an Azure Public IP address and associate it with the network interface. 

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create)to create a primary public IP address.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myPublicIP \
    --sku Standard \
    --version IPv4 \
    --zone 1 2 3
```

Use [az network nic create](/cli/azure/network/nic#az-network-nic-create) to create the network interface. To create a network interface without the public IP address, omit the **`--public-ip-address`** parameter for **`az network nic create`**.

```azurecli-interactive
  az network nic create \
    --resource-group myResourceGroup \
    --name myNIC \
    --private-ip-address-version IPv4 \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --public-ip-address myPublicIP
```

---

>[!NOTE]
> Azure assigns a MAC address to the network interface only after the network interface is attached to a virtual machine and the virtual machine is started the first time. You cannot specify the MAC address that Azure assigns to the network interface. The MAC address remains assigned to the network interface until the network interface is deleted or the private IP address assigned to the primary IP configuration of the primary network interface is changed. To learn more about IP addresses and IP configurations, see [Manage IP addresses](./ip-services/virtual-network-network-interface-addresses.md)

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## View network interface settings

You can view and change most settings for a network interface after it's created. The portal doesn't display the DNS suffix or application security group membership for the network interface. You can use Azure PowerShell or Azure CLI to view the DNS suffix and application security group membership.

# [**Portal**](#tab/network-interface-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Network interface**. Select **Network interfaces** in the search results.

3. Select the network interface you want to view or change settings for from the list.

4. The following items are listed for the network interface you selected:

    - **Overview:** The overview provides essential information about the network interface. IP addresses for IPv4 and IPv6 and network security group membership are displayed. The accelerated networking feature for network interfaces can be set in the overview. For more information about accelerated networking, see [What is Accelerated Networking?](accelerated-networking-overview.md)
    
    The following screenshot displays the overview settings for a network interface named **myNIC**:

    :::image type="content" source="./media/virtual-network-network-interface/nic-overview.png" alt-text="Screenshot of network interface overview.":::

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

# [**PowerShell**](#tab/network-interface-powershell)

Use [Get-AzNetworkInterface](/powershell/module/az.network/get-aznetworkinterface) to view network interfaces in the subscription or view settings for a network interface.

>[!NOTE]
> Removal of the parameters **`-Name`** and **`-ResourceGroupName`** will return all of the network interfaces in the subscription.

```azurepowershell
Get-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup
```

# [**Azure CLI**](#tab/network-interface-cli)

Use [az network nic list](/cli/azure/network/nic#az-network-nic-list) to view network interfaces in the subscription.

```azurecli
az network nic list 
```

Use [az network nic show](/azure/network/nic#az-network-nic-show) to view the settings for a network interface.

```azurecli
az network nic show --name myNIC --resource-group myResourceGroup
```

---

## Change DNS servers

The DNS server is assigned by the Azure DHCP server to the network interface within the virtual machine operating system. To learn more about name resolution settings for a network interface, see [Name resolution for virtual machines](virtual-networks-name-resolution-for-vms-and-role-instances.md). The network interface can inherit the settings from the virtual network, or use its own unique settings that override the setting for the virtual network.

# [**Portal**](#tab/network-interface-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Network interface**. Select **Network interfaces** in the search results.

3. Select the network interface you want to view or change settings for from the list.

4. In **Settings**, select **DNS servers**.

5. Select either:
   
    - **Inherit from virtual network**: Choose this option to inherit the DNS server setting defined for the virtual network the network interface is assigned to. At the virtual network level, either a custom DNS server or the Azure-provided DNS server is defined. The Azure-provided DNS server can resolve hostnames for resources assigned to the same virtual network. FQDN must be used to resolve for resources assigned to different virtual networks.
   
    - **Custom**: You can configure your own DNS server to resolve names across multiple virtual networks. Enter the IP address of the server you want to use as a DNS server. The DNS server address you specify is assigned only to this network interface and overrides any DNS setting for the virtual network the network interface is assigned to.
     
    >[!NOTE]
    >If the VM uses a NIC that's part of an availability set, all the DNS servers that are specified for each of the VMs from all NICs that are part of the availability set are inherited.

5. Select **Save**.

# [**PowerShell**](#tab/network-interface-powershell)

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

# [**Azure CLI**](#tab/network-interface-cli)

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

---

## Enable or disable IP forwarding

IP forwarding enables the virtual machine network interface to:

- Receive network traffic not destined for one of the IP addresses assigned to any of the IP configurations assigned to the network interface.

- Send network traffic with a different source IP address than the one assigned to one of a network interface's IP configurations.

The setting must be enabled for every network interface that is attached to the virtual machine that receives traffic that the virtual machine needs to forward. A virtual machine can forward traffic whether it has multiple network interfaces or a single network interface attached to it. While IP forwarding is an Azure setting, the virtual machine must also run an application able to forward the traffic, such as firewall, WAN optimization, and load balancing applications. 

When a virtual machine is running network applications, the virtual machine is often referred to as a network virtual appliance. You can view a list of ready to deploy network virtual appliances in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?page=1&subcategories=appliances). IP forwarding is typically used with user-defined routes. To learn more about user-defined routes, see [User-defined routes](virtual-networks-udr-overview.md).

# [**Portal**](#tab/network-interface-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Network interface**. Select **Network interfaces** in the search results.

3. Select the network interface you want to view or change settings for from the list.

4. In **Settings**, select **IP configurations**.

5. Select **Enabled** or **Disabled** (default setting) to change the setting.

6. Select **Save**.

# [**PowerShell**](#tab/network-interface-powershell)

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

# [**Azure CLI**](#tab/network-interface-cli)

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

## Change subnet assignment

You can change the subnet, but not the virtual network, that a network interface is assigned to.

# [**Portal**](#tab/network-interface-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Network interface**. Select **Network interfaces** in the search results.

3. Select the network interface you want to view or change settings for from the list.

4. In **Settings**, select **IP configurations**.

5.  If any private IP addresses for any IP configurations listed have **(Static)** next to them, you must change the IP address assignment method to dynamic. All private IP addresses must be assigned with the dynamic assignment method to change the subnet assignment for the network interface. Skip to step 6 if your private IPs are set to dynamic.

    Complete the following steps to change the assignment method to dynamic:
   
    - Select the IP configuration you want to change the IPv4 address assignment method for from the list of IP configurations.
   
    - Select **Dynamic** for the private IP address in **Assignment**.
   
    - Select **Save**.

6. Select the subnet you want to move the network interface to from the **Subnet** drop-down list.

5. Select **Save**. 

New dynamic addresses are assigned from the subnet address range for the new subnet. After assigning the network interface to a new subnet, you can assign a static IPv4 address from the new subnet address range if you choose. To learn more about adding, changing, and removing IP addresses for a network interface, see [Manage IP addresses](./ip-services/virtual-network-network-interface-addresses.md).

# [**PowerShell**](#tab/network-interface-powershell)

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

# [**Azure CLI**](#tab/network-interface-cli)

Use [az network nic ip-config update](/cli/azure/network/nic#az-network-nic-ip-config-update) to change the subnet of the network interface.

```azurecli
az network nic ip-config update \
    --name ipv4config \
    --nic-name myNIC \
    --resource-group myResourceGroup \
    --subnet mySubnet \
    --vnet-name myVNet
```

---

## Add or remove from application security groups

You can only add a network interface, or remove a network interface from an application security group using the portal if the network interface is attached to a virtual machine. 

You can use PowerShell or the Azure CLI to add a network interface to, or remove a network interface from an application security group regardless of virtual machine configuration. Learn more about [Application security groups](./network-security-groups-overview.md#application-security-groups) and how to [create an application security group](manage-network-security-group.md).

# [**Portal**](#tab/network-interface-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

3. Select the virtual machine you want to view or change settings for from the list.

4. In **Settings**, select **Networking**.

5. Select the **Application security groups** tab.

6. Select **Configure the application security groups**.

    :::image type="content" source="./media/virtual-network-network-interface/application-security-group.png" alt-text="Screenshot of application security group configuration.":::

7. Select the application security groups that you want to add the network interface to, or unselect the application security groups that you want to remove the network interface from.

8. Select **Save**.

# [**PowerShell**](#tab/network-interface-powershell)

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

# [**Azure CLI**](#tab/network-interface-cli)

Use [az network nic ip-config update](/cli/azure/network/nic#az-network-nic-ip-config-update) to set the application security group.

```azurecli
az network nic ip-config update \
    --name ipv4config \
    --nic-name myNIC \
    --resource-group myResourceGroup \
    --application-security-groups myASG
```

---

Only network interfaces that exist in the same virtual network can be added to the same application security group. The application security group must exist in the same location as the network interface.

## Associate or dissociate a network security group

# [**Portal**](#tab/network-interface-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Network interface**. Select **Network interfaces** in the search results.

3. Select the network interface you want to view or change settings for from the list.

4. In **Settings**, select **Network security group**.

5. Select the network security group in the pull-down box.

6. Select **Save**.

# [**PowerShell**](#tab/network-interface-powershell)

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

# [**Azure CLI**](#tab/network-interface-cli)

Use [az network nic update](/cli/azure/network/nic#az-network-nic-update) to set the network security group for the network interface.

```azurecli
az network nic update \
    --name myNIC \
    --resource-group myResourceGroup \
    --network-security-group myNSG
```

---

## Delete a network interface

You can delete a network interface if it't not attached to a virtual machine. If a network interface is attached to a virtual machine, you must first place the virtual machine in the stopped (deallocated) state, then detach the network interface from the virtual machine. 

To detach a network interface from a virtual machine, complete the steps in [Detach a network interface from a virtual machine](virtual-network-network-interface-vm.md#remove-a-network-interface-from-a-vm). You can't detach a network interface from a virtual machine if it's the only network interface attached to the virtual machine however. A virtual machine must always have at least one network interface attached to it. 

# [**Portal**](#tab/network-interface-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Network interface**. Select **Network interfaces** in the search results.

3. Select the network interface you want to view or change settings for from the list.

4. In **Overview**, select **Delete**.

# [**PowerShell**](#tab/network-interface-powershell)

Use [Remove-AzNetworkInterface](/powershell/module/az.network/remove-aznetworkinterface) to delete the network interface.

```azurepowershell
Remove-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup
```

# [**Azure CLI**](#tab/network-interface-cli)

Use [az network nic delete](/cli/azure/network/nic#az-network-nic-delete) to delete the network interface.

```azurecli
az network nic delete --name myNIC --resource-group myResourceGroup
```

---

## Resolve connectivity issues

If you're experiencing communication problems with a virtual machine, network security group rules or effective routes may be causing the problem. You have the following options to help resolve the issue:

### View effective security rules

The effective security rules for each network interface attached to a virtual machine are a combination of the rules you've created in a network security group and [default security rules](./network-security-groups-overview.md#default-security-rules). Understanding the effective security rules for a network interface may help you determine why you're unable to communicate to or from a virtual machine. You can view the effective rules for any network interface that is attached to a running virtual machine.

# [**Portal**](#tab/network-interface-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

3. Select the virtual machine you want to view or change settings for from the list.

4. In **Settings**, select **Networking**.

5. Select the name of the network interface.

6. Select **Effective security rules**.

7. Review the list of effective security rules to determine if the correct rules exist for your required inbound and outbound communication. For more information about security rules, see [Network security group overview](./network-security-groups-overview.md).

# [**PowerShell**](#tab/network-interface-powershell)

Use [Get-AzEffectiveNetworkSecurityGroup](/powershell/module/az.network/get-azeffectivenetworksecuritygroup) to view the list of effective security rules.

```azurepowershell
Get-AzEffectiveNetworkSecurityGroup -NetworkInterfaceName myNIC -ResourceGroupName myResourceGroup
```

# [**Azure CLI**](#tab/network-interface-cli)

Use [az network nic list-effective-nsg](/cli/azure/network/nic#az-network-nic-list-effective-nsg) to view the list of effective security rules.

```azurecli
az network nic list-effective-nsg --name myNIC --resource-group myResourceGroup
```

---

### View effective routes

The effective routes for the network interface or interfaces attached to a virtual machine are a combination of:

- Default routes

- User created routes

- Routes propagated from on-premises networks via BGP through an Azure virtual network gateway. 

Understanding the effective routes for a network interface may help you determine why you're unable to communicate to or from a virtual machine. You can view the effective routes for any network interface that is attached to a running virtual machine.

# [**Portal**](#tab/network-interface-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Network interface**. Select **Network interfaces** in the search results.

3. Select the network interface you want to view or change settings for from the list.

4. In **Help**, select **Effective routes**.

5. Review the list of effective routes to determine if the correct routes exist for your required inbound and outbound communication. For more information about routing, see [Routing overview](virtual-networks-udr-overview.md).

# [**PowerShell**](#tab/network-interface-powershell)

Use [Get-AzEffectiveRouteTable](/powershell/module/az.network/get-azeffectiveroutetable) to view a list of the effective routes.

```azurepowershell
Get-AzEffectiveRouteTable -NetworkInterfaceName myNIC -ResourceGroupName myResourceGroup
```

# [**Azure CLI**](#tab/network-interface-cli)

Use [az network nic show-effective-route-table](/cli/azure/network/nic#az-network-nic-show-effective-route-table) to view a list of the effective routes.

```azurecli
az network nic show-effective-route-table --name myNIC --resource-group myResourceGroup
```

---

The next hop feature of Azure Network Watcher can also help you determine if routes are preventing communication between a virtual machine and an endpoint. To learn more, see [Next hop](../network-watcher/diagnose-vm-network-routing-problem.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Permissions

To perform tasks on network interfaces, your account must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) role that is assigned the appropriate permissions listed in the following table:

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

## Next steps

- Create a VM with multiple NICs using the [Azure CLI](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [PowerShell](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json)

- Create a single NIC VM with multiple IPv4 addresses using the [Azure CLI](./ip-services/virtual-network-multiple-ip-addresses-cli.md) or [PowerShell](./ip-services/virtual-network-multiple-ip-addresses-powershell.md)

- Create a single NIC VM with a private IPv6 address (behind an Azure Load Balancer) using the [Azure CLI](../load-balancer/load-balancer-ipv6-internet-cli.md?toc=%2fazure%2fvirtual-network%2ftoc.json), [PowerShell](../load-balancer/load-balancer-ipv6-internet-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json), or [Azure Resource Manager template](../load-balancer/load-balancer-ipv6-internet-template.md?toc=%2fazure%2fvirtual-network%2ftoc.json)

