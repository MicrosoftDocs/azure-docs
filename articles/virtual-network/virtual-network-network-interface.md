---
title: Create, change, or delete an Azure network interface
titlesuffix: Azure Virtual Network
description: Learn how to create, delete, and view and change settings for network interfaces by using the Azure portal, Azure PowerShell, or Azure CLI.
author: asudbring
ms.service: virtual-network
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: how-to
ms.date: 03/20/2023
ms.author: allensu
---

# Create, change, or delete a network interface

A network interface (NIC) enables an Azure virtual machine (VM) to communicate with internet, Azure, and on-premises resources. This article explains how to create, view and change settings for, and delete a NIC.

A VM you create in the Azure portal has one NIC with default settings. You can create NICs with custom settings instead, and add one or more NICs to a VM when or after you create it. You can also change settings for an existing NIC.

## Prerequisites

# [Portal](#tab/azure-portal)

You need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing Azure virtual network. To create one, see [Quickstart: Create a virtual network by using the Azure portal](quick-create-portal.md).

To run the procedures in this article, sign in to the [Azure portal](https://portal.azure.com) with your Azure account. You can replace the placeholders in the examples with your own values.

# [Azure CLI](#tab/azure-cli)

To run the commands in this article, you need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing Azure virtual network. To create one, see [Quickstart: Create a virtual network by using Azure CLI](quick-create-cli.md).

You can run the commands either in the [Azure Cloud Shell](/azure/cloud-shell/overview) or from Azure CLI on your computer.

- Azure Cloud Shell is a free interactive shell that has common Azure tools preinstalled and configured to use with your account. To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

- If you [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands, you need Azure CLI version 2.31.0 or later. Run [az version](/cli/azure/reference-index?#az-version) to find your installed version, and run [az upgrade](/cli/azure/reference-index?#az-upgrade) to upgrade.
  
  If you're prompted, install the Azure CLI extension on first use. For more information, [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

  Run [az login](/cli/azure/reference-index#az-login) to connect to Azure. For more information, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

In the following procedures, you can replace the example placeholder names with your own values.

# [PowerShell](#tab/azure-powershell)

To run the commands in this article, you need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing Azure virtual network. To create one, see [Quickstart: Create a virtual network by using Azure PowerShell](quick-create-powershell.md).

You can run the commands either in the [Azure Cloud Shell](/azure/cloud-shell/overview) or from PowerShell on your computer.

- Azure Cloud Shell is a free interactive shell that has common Azure tools preinstalled and configured to use with your account. To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

- If you [install Azure PowerShell locally](/powershell/azure/install-Az-ps) to run the commands, you need Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

  Also make sure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use `Get-InstalledModule -Name "Az.Network"`. To update, use the command `Update-Module -Name Az.Network`.

  Then run `Connect-AzAccount` to connect to Azure. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

In the following procedures, you can replace the example placeholder names with your own values.

---

### Permissions

To work with NICs, your account must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that's assigned the appropriate actions from the following list:

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

## Create a network interface

You can create a NIC in the Azure portal or by using Azure CLI or Azure PowerShell.

- The portal doesn't provide the option to assign a public IP address to a NIC when you create it. If you want to create a NIC with a public IP address, use Azure CLI or PowerShell. To add a public IP address to a NIC after you create it, see [Configure IP addresses for an Azure network interface](./ip-services/virtual-network-network-interface-addresses.md).

- The portal does create a NIC with default settings and a public IP address when you create a VM. To create a NIC with custom settings and attach it to a VM, or to add a NIC to an existing VM, use PowerShell or Azure CLI.

- The portal doesn't provide the option to assign a NIC to application security groups when you create the NIC, but Azure CLI and PowerShell do. However, if an existing NIC is attached to a VM, you can use the portal to assign that NIC to an application security group. For more information, see [Add to or remove from application security groups](#add-or-remove-from-application-security-groups).

To create a NIC, use the following procedure.

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select *network interfaces*.
1. On the **Network interfaces** page, select **Create**.
1. On the **Create network interface** screen, enter or select values for the NIC settings.

   :::image type="content" source="./media/virtual-network-network-interface/create-network-interface.png" alt-text="Screenshot of the Create network interface screen in the Azure portal.":::

1. Select **Review + create**, and when validation passes, select **Create**.

# [Azure CLI](#tab/azure-cli)

The following example creates an Azure public IP address and associates it with the NIC. 

1. Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a primary public IP address.

   ```azurecli-interactive
     az network public-ip create \
       --resource-group myResourceGroup \
       --name myPublicIP \
       --sku Standard \
       --version IPv4 \
       --zone 1 2 3
   ```

1. Use [az network nic create](/cli/azure/network/nic#az-network-nic-create) to create the NIC. To create a NIC without a public IP address, omit the `--public-ip-address` parameter for `az network nic create`.

```azurecli-interactive
  az network nic create \
    --resource-group myResourceGroup \
    --name myNIC \
    --private-ip-address-version IPv4 \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --public-ip-address myPublicIP
```

# [PowerShell](#tab/azure-powershell)

The following example creates an Azure public IP address and associates it with the NIC. 

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

1. Use [New-AzNetworkInterfaceIpConfig](/powershell/module/az.network/new-aznetworkinterfaceipconfig) and [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) to create the NIC. To create a NIC without a public IP address, omit the `-PublicIpAddress` parameter for `New-AzNetworkInterfaceIPConfig`.

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

You can configure the following settings for a NIC:

| Setting | Value | Details |
| ------- | --------- | ------- |
| **Subscription** | Select your subscription. | You can assign a NIC only to a virtual network in the same subscription and location.|
| **Resource group** | Select your resource group or create a new one. | A resource group is a logical container for grouping Azure resources. A NIC can exist in the same or a different resource group from the VM you attach it to or the virtual network you connect it to.|
| **Name** | Enter a name for the NIC. | The name must be unique within the resource group. For information about creating a naming convention to make managing several NICs easier, see [Resource naming](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging#resource-naming). You can't change the name after you create the NIC. |
| **Region** | Select your region.| The Azure region where you create the NIC. |
| **Virtual network** | Select your virtual network. | You can assign a NIC only to a virtual network in the same subscription and location as the NIC. Once you create a NIC, you can't change the virtual network it's assigned to. The VM you add the NIC to must also be in the same location and subscription as the NIC. |
| **Subnet** | Select a subnet within the virtual network you selected. | You can change the subnet the NIC is assigned to after you create the NIC. |
| **IP version** | Select **IPv4** or<br>**IPv4 and IPv6**. | You can choose to create the NIC with an IPv4 address or IPv4 and IPv6 addresses. To assign an IPv6 address, the network and subnet you use for the NIC must also have an IPv6 address space. An IPv6 configuration is assigned to a secondary IP configuration for the NIC.|
| **Private IP address assignment** | Select **Dynamic** or **Static**. | The Azure DHCP server assigns the private IP address to the NIC in the VM's operating system.<br><br>- If you select **Dynamic**, Azure automatically assigns the next available address from the address space of the subnet you selected. <br><br>- If you select **Static**, you must manually assign an available IP address from within the address space of the subnet you selected.<br><br>Static and dynamic addresses don't change until you change them or delete the NIC. You can change the assignment method after the NIC is created. |

>[!NOTE]
>Azure assigns a MAC address to the NIC only after the NIC is attached to a VM and the VM starts for the first time. You can't specify the MAC address that Azure assigns to the NIC.
>
>The MAC address remains assigned to the NIC until the NIC is deleted or the private IP address assigned to the primary IP configuration of the primary NIC changes. For more information, see [Configure IP addresses for an Azure network interface](./ip-services/virtual-network-network-interface-addresses.md).

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## View network interface settings

You can view most settings for a NIC after you create it. The portal doesn't display the DNS suffix or application security group membership for the NIC. You can use Azure PowerShell or Azure CLI to view the DNS suffix and application security group membership.

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Network interfaces**.
1. On the **Network interfaces** page, select the NIC you want to view.
1. On the **Overview** page for the NIC, view essential information such as IPv4 and IPv6 IP addresses and network security group (NSG) membership.

   You can select **Edit accelerated networking** to set accelerated networking for NICs. For more information about accelerated networking, see [What is Accelerated Networking?](accelerated-networking-overview.md)

   :::image type="content" source="./media/virtual-network-network-interface/nic-overview.png" alt-text="Screenshot of network interface Overview.":::

1. Select **IP configurations** in the left navigation, and on the **IP configurations** page, view the **IP forwarding**, **Subnet**, and public and private IPv4 and IPv6 IP configurations. For more information about IP configurations and how to add and remove IP addresses, see [Configure IP addresses for an Azure network interface](./ip-services/virtual-network-network-interface-addresses.md). 

   :::image type="content" source="./media/virtual-network-network-interface/ip-configurations.png" alt-text="Screenshot of network interface IP configurations.":::    

1. Select **DNS servers** in the left navigation, and on the **DNS servers** page, view any DNS server that Azure DHCP assigns the NIC to. Also note whether the NIC inherits the setting from the virtual network or has a custom setting that overrides the virtual network setting.

   :::image type="content" source="./media/virtual-network-network-interface/dns-servers.png" alt-text="Screenshot of DNS server configuration."::: 

1. Select **Network security group** from the left navigation, and on the **Network security group** page, see any NSG that's associated to the NIC. An NSG contains inbound and outbound rules to filter network traffic for the NIC.

   :::image type="content" source="./media/virtual-network-network-interface/network-security-group.png" alt-text="Screenshot of network security group configuration.":::

1. Select **Properties** in the left navigation. On the **Properties** page, view settings for the NIC, such as the MAC address and subscription information. The MAC address is blank if the NIC isn't attached to a VM.

   :::image type="content" source="./media/virtual-network-network-interface/nic-properties.png" alt-text="Screenshot of network interface properties.":::

1. Select **Effective security rules** in the left navigation. The **Effective security rules** page lists security rules if the NIC is attached to a running VM and associated with an NSG. For more information about NSGs, see [Network security groups](./network-security-groups-overview.md).

   :::image type="content" source="./media/virtual-network-network-interface/effective-security-rules.png" alt-text="Screenshot of effective security rules.":::

1. Select **Effective routes** in the left navigation. The **Effective routes** page lists routes if the NIC is attached to a running VM.

   The routes are a combination of the Azure default routes, any user-defined routes, and any Border Gateway Protocol (BGP) routes that exist for the subnet the NIC is assigned to. For more information about Azure default routes and user-defined routes, see [Virtual network traffic routing](virtual-networks-udr-overview.md).

   :::image type="content" source="./media/virtual-network-network-interface/effective-routes.png" alt-text="Screenshot of effective routes.":::

# [Azure CLI](#tab/azure-cli)

Use [az network nic list](/cli/azure/network/nic#az-network-nic-list) to view all NICs in the subscription.

```azurecli-interactive
az network nic list 
```

Use [az network nic show](/cli/azure/network/nic#az-network-nic-show) to view the settings for a NIC.

```azurecli-interactive
az network nic show --name myNIC --resource-group myResourceGroup
```

# [PowerShell](#tab/azure-powershell)

Use [Get-AzNetworkInterface](/powershell/module/az.network/get-aznetworkinterface) to view NICs in the subscription or view settings for a NIC.

>[!NOTE]
> Remove the  `-Name` and `-ResourceGroupName` parameters to return all the NICs in the subscription.

```azurepowershell-interactive
Get-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup
```

---

## Change network interface settings

You can change most settings for a NIC after you create it.

<a name="change-dns-servers"></a>
### Add or change DNS servers

Azure DHCP assigns the DNS server to the NIC within the VM operating system. The NIC can inherit the settings from the virtual network, or use its own unique settings that override the setting for the virtual network. For more information about name resolution settings for a NIC, see [Name resolution for virtual machines](virtual-networks-name-resolution-for-vms-and-role-instances.md).

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Network interfaces**.
1. On the **Network interfaces** page, select the NIC you want to change from the list.
1. On the NIC's page, select **DNS servers** from the left navigation.
1. On the **DNS servers** page, select one of the following settings:
   
   - **Inherit from virtual network**: Choose this option to inherit the DNS server setting from the virtual network the NIC is assigned to. Either a custom DNS server or the Azure-provided DNS server is defined at the virtual network level.
   
     The Azure-provided DNS server can resolve hostnames for resources assigned to the same virtual network. The fully qualified domain name (FQDN) must be used for resources assigned to different virtual networks.

     >[!NOTE]
     >If a VM uses a NIC that's part of an availability set, the DNS servers for all NICs for all VMs that are part of the availability set are inherited.

   - **Custom**: You can configure your own DNS server to resolve names across multiple virtual networks. Enter the IP address of the server you want to use as a DNS server. The DNS server address you specify is assigned only to this NIC and overrides any DNS setting for the virtual network the NIC is assigned to.

1. Select **Save**.

# [Azure CLI](#tab/azure-cli)

Use [az network nic update](/cli/azure/network/nic#az-network-nic-update) to change the DNS server setting from inherited to a custom setting. Replace the DNS server IP addresses with your custom IP addresses.

```azurecli-interactive
az network nic update \
    --name myNIC \
    --resource-group myResourceGroup \
    --dns-servers 192.168.1.100 192.168.1.101
```

To remove the DNS servers and change the setting to virtual network setting inheritance, use the following command:

```azurecli-interactive
az network nic update \
    --name myNIC \
    --resource-group myResourceGroup \
    --dns-servers null
```

# [PowerShell](#tab/azure-powershell)

Use [Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface) to change the DNS server setting from inherited to a custom setting. Replace the DNS server IP addresses with your custom IP addresses.

```azurepowershell-interactive
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

```azurepowershell-interactive
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

IP forwarding enables a NIC attached to a VM to:

- Receive network traffic not destined for any of the IP addresses assigned in any of the NIC's IP configurations.
- Send network traffic with a different source IP address than is assigned in any of the NIC's IP configurations.

You must enable IP forwarding for every NIC attached to the VM that needs to forward traffic. A VM can forward traffic whether it has multiple NICs or a single NIC attached to it.

IP forwarding is typically used with user-defined routes. For more information, see [User-defined routes](virtual-networks-udr-overview.md).

While IP forwarding is an Azure setting, the VM must also run an application that's able to forward the traffic, such as a firewall, WAN optimization, or load balancing application. A VM that runs network applications is often called a network virtual appliance (NVA). You can view a list of ready-to-deploy NVAs in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?search=network%20virtual%20appliances). 

# [Portal](#tab/azure-portal)

1. On the NIC's page, select **IP configurations** in the left navigation.
1. On the **IP configurations** page, under **IP forwarding settings**, select **Enabled** or **Disabled**, the default, to change the setting.
1. Select **Save**.

# [Azure CLI](#tab/azure-cli)

Use [az network nic update](/cli/azure/network/nic#az-network-nic-update) to enable or disable the IP forwarding setting.

To enable IP forwarding, use the following command:

```azurecli-interactive
az network nic update \
    --name myNIC \
    --resource-group myResourceGroup \
    --ip-forwarding true
```

To disable IP forwarding, use the following command:

```azurecli-interactive
az network nic update \
    --name myNIC \
    --resource-group myResourceGroup \
    --ip-forwarding false
```

# [PowerShell](#tab/azure-powershell)

Use [Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface) to enable or disable the IP forwarding setting.

To enable IP forwarding, use the following command:

```azurepowershell-interactive
## Place the network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup

## Set the IP forwarding setting to enabled. ##
$nic.EnableIPForwarding = 1

## Apply the new configuration to the network interface. ##
$nic | Set-AzNetworkInterface

```

To disable IP forwarding, use the following command:

```azurepowershell-interactive
## Place the network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup

## Set the IP forwarding setting to disabled. ##
$nic.EnableIPForwarding = 0

## Apply the new configuration to the network interface. ##
$nic | Set-AzNetworkInterface

```

---

### Change subnet assignment

You can change the subnet, but not the virtual network, that a NIC is assigned to.

# [Portal](#tab/azure-portal)

1. On the NIC's page, select **IP configurations** in the left navigation.
1. On the **IP configurations** page, under **IP configurations**, if any private IP addresses listed have **(Static)** next to them, change the IP address assignment method to dynamic. All private IP addresses must be assigned with the dynamic assignment method to change the subnet assignment for the NIC.

   To change the assignment method to dynamic:

   1. Select the IP configuration you want to change from the list of IP configurations.
   1. On the IP configuration page, select **Dynamic** under **Assignment**.
   1. Select **Save**.

1. When all private IP addresses are set to **Dynamic**, under **Subnet**, select the subnet you want to move the NIC to.
1. Select **Save**. New dynamic addresses are assigned from the new subnet's address range.

After assigning the NIC to a new subnet, you can assign a static IPv4 address from the new subnet address range if you choose. For more information about adding, changing, and removing IP addresses for a NIC, see [Configure IP addresses for an Azure network interface](./ip-services/virtual-network-network-interface-addresses.md).

# [Azure CLI](#tab/azure-cli)

Use [az network nic ip-config update](/cli/azure/network/nic#az-network-nic-ip-config-update) to change the subnet of the NIC.

```azurecli-interactive
az network nic ip-config update \
    --name ipv4config \
    --nic-name myNIC \
    --resource-group myResourceGroup \
    --subnet mySubnet \
    --vnet-name myVNet
```

# [PowerShell](#tab/azure-powershell)

Use [Set-AzNetworkInterfaceIpConfig](/powershell/module/az.network/set-aznetworkinterfaceipconfig) to change the subnet of the NIC.

```azurepowershell-interactive
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

You can add NICs only to application security groups in the same virtual network and location as the NIC.

You can use the portal to add or remove a NIC for an application security group only if the NIC is attached to a VM. Otherwise, use PowerShell or Azure CLI. For more information, see [Application security groups](./network-security-groups-overview.md#application-security-groups) and [How to create an application security group](manage-network-security-group.md).

# [Portal](#tab/azure-portal)

To add or remove a NIC for an application security group on a VM, follow this procedure:

1. In the [Azure portal](https://portal.azure.com), search for and select *virtual machines*.
1. On the **Virtual machines** page, select the VM you want to configure from the list.
1. On the VM's page, select **Networking** from the left navigation.
1. On the **Networking** page, under the **Application security groups** tab, select **Configure the application security groups**.

   :::image type="content" source="./media/virtual-network-network-interface/application-security-group.png" alt-text="Screenshot of application security group configuration.":::

1. Select the application security groups you want to add the NIC to, or deselect the application security groups you want to remove the NIC from.
1. Select **Save**.

# [Azure CLI](#tab/azure-cli)

Use [az network nic ip-config update](/cli/azure/network/nic#az-network-nic-ip-config-update) to set the application security group.

```azurecli-interactive
az network nic ip-config update \
    --name ipv4config \
    --nic-name myNIC \
    --resource-group myResourceGroup \
    --application-security-groups myASG
```

# [PowerShell](#tab/azure-powershell)

Use [Set-AzNetworkInterfaceIpConfig](/powershell/module/az.network/set-aznetworkinterfaceipconfig) to set the application security group.

```azurepowershell-interactive
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

### Associate or dissociate a network security group

# [Portal](#tab/azure-portal)

1. On the NIC's page, select **Network security group** in the left navigation.
1. On the **Network security group** page, select the network security group you want to associate, or select **None** to dissociate the NSG.
1. Select **Save**.

# [Azure CLI](#tab/azure-cli)

Use [az network nic update](/cli/azure/network/nic#az-network-nic-update) to set the network security group for the NIC.

```azurecli-interactive
az network nic update \
    --name myNIC \
    --resource-group myResourceGroup \
    --network-security-group myNSG
```

# [PowerShell](#tab/azure-powershell)

Use [Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface) to set the network security group for the NIC.

```azurepowershell-interactive
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

You can delete a NIC if it's not attached to a VM. If the NIC is attached to a VM, you must first stop and deallocate the VM, then detach the NIC. 

To detach the NIC from the VM, complete the steps in [Remove a network interface from a VM](virtual-network-network-interface-vm.md#remove-a-network-interface-from-a-vm). A VM must always have at least one NIC attached to it, so you can't delete the only NIC from a VM. 

# [Portal](#tab/azure-portal)

To delete a NIC, on the **Overview** page for the NIC you want to delete, select **Delete** from the top menu bar, and then select **Yes**.

# [Azure CLI](#tab/azure-cli)

Use [az network nic delete](/cli/azure/network/nic#az-network-nic-delete) to delete the NIC.

```azurecli-interactive
az network nic delete --name myNIC --resource-group myResourceGroup
```

# [PowerShell](#tab/azure-powershell)

Use [Remove-AzNetworkInterface](/powershell/module/az.network/remove-aznetworkinterface) to delete the NIC.

```azurepowershell-interactive
Remove-AzNetworkInterface -Name myNIC -ResourceGroupName myResourceGroup
```

---

## Resolve connectivity issues

If you have communication problems with a VM, network security group rules or effective routes might be causing the problems. Use the following options to help resolve the issue.

### View effective security rules

The effective security rules for each NIC attached to a VM are a combination of the rules you created in an NSG and [default security rules](./network-security-groups-overview.md#default-security-rules). Understanding the effective security rules for a NIC might help you determine why you're unable to communicate to or from a VM. You can view the effective rules for any NIC that's attached to a running VM.

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select *virtual machines*.
1. On the **Virtual machines** page, select the VM you want to view settings for.
1. On the VM page, select **Networking** from the left navigation.
1. On the **Networking** page, select the **Network Interface**.
1. On the NIC's page, select **Effective security rules** under **Help** in the left navigation.
1. Review the list of effective security rules to determine if the rules are correct for your required inbound and outbound communications. For more information about security rules, see [Network security group overview](network-security-groups-overview.md).

# [Azure CLI](#tab/azure-cli)

Use [az network nic list-effective-nsg](/cli/azure/network/nic#az-network-nic-list-effective-nsg) to view the list of effective security rules.

```azurecli-interactive
az network nic list-effective-nsg --name myNIC --resource-group myResourceGroup
```

# [PowerShell](#tab/azure-powershell)

Use [Get-AzEffectiveNetworkSecurityGroup](/powershell/module/az.network/get-azeffectivenetworksecuritygroup) to view the list of effective security rules.

```azurepowershell-interactive
Get-AzEffectiveNetworkSecurityGroup -NetworkInterfaceName myNIC -ResourceGroupName myResourceGroup
```

---

### View effective routes

The effective routes for the NIC or NICs attached to a VM are a combination of:

- Default routes
- User-defined routes
- Routes propagated from on-premises networks via BGP through an Azure virtual network gateway.

Understanding the effective routes for a NIC might help you determine why you can't communicate with a VM. You can view the effective routes for any NIC that's attached to a running VM.

# [Portal](#tab/azure-portal)

1. On the page for the NIC that's attached to the VM, select **Effective routes** under **Help** in the left navigation.
1. Review the list of effective routes to see if the routes are correct for your required inbound and outbound communications. For more information about routing, see [Routing overview](virtual-networks-udr-overview.md).

# [Azure CLI](#tab/azure-cli)

Use [az network nic show-effective-route-table](/cli/azure/network/nic#az-network-nic-show-effective-route-table) to view a list of the effective routes.

```azurecli-interactive
az network nic show-effective-route-table --name myNIC --resource-group myResourceGroup
```

# [PowerShell](#tab/azure-powershell)

Use [Get-AzEffectiveRouteTable](/powershell/module/az.network/get-azeffectiveroutetable) to view a list of the effective routes.

```azurepowershell-interactive
Get-AzEffectiveRouteTable -NetworkInterfaceName myNIC -ResourceGroupName myResourceGroup
```

---

The next hop feature of Azure Network Watcher can also help you determine if routes are preventing communication between a VM and an endpoint. For more information, see [Tutorial: Diagnose a virtual machine network routing problem by using the Azure portal](/azure/network-watcher/diagnose-vm-network-routing-problem).

## Next steps

For other network interface tasks, see the following articles:

|Task|Article|
|----|-------|
|Add, change, or remove IP addresses for a network interface.|[Configure IP addresses for an Azure network interface](./ip-services/virtual-network-network-interface-addresses.md)|
|Add or remove network interfaces for VMs.|[Add network interfaces to or remove network interfaces from virtual machines](virtual-network-network-interface-vm.md)|
|Create a VM with multiple NICs|- [How to create a Linux virtual machine in Azure with multiple network interface cards](/azure/virtual-machines/linux/multiple-nics?toc=%2fazure%2fvirtual-network%2ftoc.json)<br>- [Create and manage a Windows virtual machine that has multiple NICs](/azure/virtual-machines/windows/multiple-nics)|
|Create a single NIC VM with multiple IPv4 addresses.|- [Assign multiple IP addresses to virtual machines by using the Azure CLI](./ip-services/virtual-network-multiple-ip-addresses-cli.md)<br>- [Assign multiple IP addresses to virtual machines by using Azure PowerShell](./ip-services/virtual-network-multiple-ip-addresses-powershell.md)|
|Create a single NIC VM with a private IPv6 address behind Azure Load Balancer.|- [Create a public load balancer with IPv6 by using Azure CLI](/azure/load-balancer/load-balancer-ipv6-internet-cli?toc=%2fazure%2fvirtual-network%2ftoc.json)<br>- [Create an internet facing load balancer with IPv6 by using PowerShell](/azure/load-balancer/load-balancer-ipv6-internet-ps?toc=%2fazure%2fvirtual-network%2ftoc.json)<br>- [Deploy an internet-facing load-balancer solution with IPv6 by using a template](/azure/load-balancer/load-balancer-ipv6-internet-template?toc=%2fazure%2fvirtual-network%2ftoc.json)|
