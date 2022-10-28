---
title: Manage a NAT gateway
titleSuffix: Azure Virtual Network NAT
description: Learn how to create and remove a NAT gateway resource from a virtual network subnet. Add and remove public IP addresses and prefixes used for outbound connectivity.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: nat
ms.topic: how-to
ms.date: 10/31/2022
ms.custom: template-how-to
---

# Manage NAT gateway

Learn how to create and remove a NAT gateway resource from a virtual network subnet. A NAT gateway enables outbound connectivity for resources in an Azure Virtual Network. You may wish to change the IP address or prefix your resources use for outbound connectivity to the internet. The public and public IP address prefixes associated with the NAT gateway can be changed after deployment.

This article explains how to manage the following aspects of NAT gateway:

- Create a NAT gateway and associate it with an existing subnet.

- Remove a NAT gateway from an existing subnet and delete the resource.

- Add or remove a public IP address or public IP prefix.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure Virtual Network. For information about creating an Azure Virtual Network, see [Quickstart: Create a virtual network using the Azure portal](/azure/virtual-network/quick-create-portal).
    
    - The example virtual network used in this article is named **myVNet**. Replace the example value with the name of your virtual network. 
    
    - The example subnet used in this article is named **mySubnet**. Replace the example value with the name of your subnet.
    
    - The example nat gateway used in this article is named **myNATgateway**.
    
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

- This how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name Az.Network` if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a NAT gateway and associate it with an existing subnet

You can create a NAT gateway resource and add it to an existing subnet with the Azure portal, PowerShell, and the Azure CLI.

# [**Portal**](#tab/manage-nat-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

3. Select **+ Create**.

4. Enter or select the following information in the **Basics** tab of **Create network address translation (NAT) gateway**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select your resource group or select **Create new** to create a new resource group. |
    | **Instance details** |   |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select your region. **East US 2** is used in this example. |
    | Availability zone | Select an availability zone. **No Zone** is used in this example. </br> For more information about NAT gateway availability, see [NAT gateway and availability zones](nat-availability-zones.md). |
    | TCP idle timeout (minutes) | Select an idle timeout. The default of **4** is used in this example. |

5. Select the **Outbound IP** tab, or select **Next: Outbound IP**. 

6. You can select an existing public IP address or prefix or both to associate with the NAT gateway and enable outbound connectivity. 

    - To create a new public IP for the NAT gateway, select **Create a new public IP address**. Enter **myPublicIP-NAT** in **Name**. Select **OK**.
    
    - To create a new public IP prefix for the NAT gateway, select **Create a new public IP prefix**. Enter **myPublicIPPrefix-NAT** in **Name**. Select a **Prefix size**. Select **OK**.

8. Select the **Subnet** tab, or select **Next: Subnet**.

9. Select your virtual network or select **Create new** to create a new virtual network. In this example, select **myVNet** or your existing virtual network in the pull-down box.

10. Select the checkbox next to **mySubnet** or your existing subnet.

11. Select **Review + create**.

12. Select **Create**.

# [**PowerShell**](#tab/manage-nat-powershell)

### Public IP address

To create a NAT gateway with a public IP address, continue with the following steps.

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP address for the NAT gateway.

```azurepowershell
## Create public IP address for NAT gateway ##
$ip = @{
    Name = 'myPublicIP-NAT'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
}
New-AzPublicIpAddress @ip
```

Use [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway) to create a NAT gateway resource and associate the public IP you created previously. You'll use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to configure the NAT gateway for your virtual network subnet.

```azurepowershell
## Place the virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Place the public IP address you created previously into a variable. ##
$pip = @{
    Name = 'myPublicIP-NAT'
    ResourceGroupName = 'myResourceGroup'
}
$publicIP = Get-AzPublicIPAddress @pip

## Create NAT gateway resource ##
$nat = @{
    ResourceGroupName = 'myResourceGroupNAT'
    Name = 'myNATgateway'
    IdleTimeoutInMinutes = '10'
    Sku = 'Standard'
    Location = 'eastus2'
    PublicIpAddress = $publicIP
}
$natGateway = New-AzNatGateway @nat

## Create the subnet configuration. ##
$sub = @{
    Name = 'mySubnet'
    VirtualNetwork = $vnet
    NatGateway = $natGateway
}
Set-AzVirtualNetworkSubnetConfig @sub

## Save the configuration to the virtual network. ##
$vnet | Set-AzVirtualNetwork
```

### Public IP prefix

To create a NAT gateway with a public IP prefix, continue with the following steps.

Use [New-AzPublicIpPrefix](/powershell/module/az.network/new-azpublicipprefix) to create a public IP prefix for the NAT gateway.

```azurepowershell
## Create public IP prefix for NAT gateway ##
$ip = @{
    Name = 'myPublicIPPrefix-NAT'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    PrefixLength ='29'
}
New-AzPublicIpPrefix @ip
```

Use [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway) to create a NAT gateway resource and associate the public IP prefix you created previously. You'll use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to configure the NAT gateway for your virtual network subnet.

```azurepowershell
## Place the virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Place the public IP prefix you created previously into a variable. ##
$pip = @{
    Name = 'myPublicIPPrefix-NAT'
    ResourceGroupName = 'myResourceGroup'
}
$publicIPprefix = Get-AzPublicIPPrefix @pip

## Create NAT gateway resource ##
$nat = @{
    ResourceGroupName = 'myResourceGroupNAT'
    Name = 'myNATgateway'
    IdleTimeoutInMinutes = '10'
    Sku = 'Standard'
    Location = 'eastus2'
    PublicIpPrefix = $publicIPprefix
}
$natGateway = New-AzNatGateway @nat

## Create the subnet configuration. ##
$sub = @{
    Name = 'mySubnet'
    VirtualNetwork = $vnet
    NatGateway = $natGateway
}
Set-AzVirtualNetworkSubnetConfig @sub

## Save the configuration to the virtual network. ##
$vnet | Set-AzVirtualNetwork
```

# [**Azure CLI**](#tab/manage-nat-cli)

### Public IP address

To create a NAT gateway with a public IP address, continue with the following steps.

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP address for the NAT gateway.

```azurecli
az network public-ip create \
    --resource-group myResourceGroup \
    --location eastus2 \
    --name myPublicIP-NAT \
    --sku standard
```

Use [az network nat gateway create](/cli/azure/network/nat/gateway#az-network-nat-gateway-create) to create a NAT gateway resource and associate the public IP you created previously.

```azurecli
az network nat gateway create \
    --resource-group myResourceGroup \
    --name myNATgateway \
    --public-ip-addresses myPublicIP-NAT \
    --idle-timeout 10

```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to associate the NAT gateway with your virtual network subnet.

```azurecli
az network vnet subnet update \
    --resource-group myResourceGroup \
    --vnet-name myVNet \
    --name mySubnet \
    --nat-gateway myNATgateway
```

### Public IP prefix

To create a NAT gateway with a public IP prefix, continue with the following steps.

Use [az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-create) to create a public IP prefix for the NAT gateway.

```azurecli
az network public-ip prefix create \
    --length 29 \
    --resource-group myResourceGroup \
    --location eastus2 \
    --name myPublicIPprefix-NAT
```

Use [az network nat gateway create](/cli/azure/network/nat/gateway#az-network-nat-gateway-create) to create a NAT gateway resource and associate the public IP prefix you created previously.

```azurecli
az network nat gateway create \
    --resource-group myResourceGroup \
    --name myNATgateway \
    --public-ip-prefixes myPublicIPprefix-NAT \
    --idle-timeout 10

```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to associate the NAT gateway with your virtual network subnet.
```azurecli
az network vnet subnet update \
    --resource-group myResourceGroup \
    --vnet-name myVNet \
    --name mySubnet \
    --nat-gateway myNATgateway
```

---

## Remove a NAT gateway from an existing subnet and delete the resource

To remove a NAT gateway from an existing subnet, complete the following steps.

# [**Portal**](#tab/manage-nat-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

3. Select **myNATgateway** or the name of your NAT gateway.

4. Select **Subnets** in **Settings**.

5. Select **Disassociate** to remove the NAT gateway from the configured subnet.

You can now associate the NAT gateway with a different subnet or virtual network in your subscription. To delete the NAT gateway resource, complete the following steps.

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

2. Select **myNATgateway** or the name of your NAT gateway.

3. Select **Delete**.

4. Select **Yes**.

# [**PowerShell**](#tab/manage-nat-powershell)

Removing the NAT gateway from a subnet with Azure PowerShell is currently unsupported.

# [**Azure CLI**](#tab/manage-nat-cli)

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to remove the NAT gateway from the subnet.

```azurecli
az network vnet subnet update \
      --resource-group myResourceGroup \
      --vnet-name myVNet \
      --name mySubnet \
      --remove natGateway
```

Use [az network nat gateway delete](/cli/azure/network/nat/gateway#az-network-nat-gateway-delete) to delete the NAT gateway resource.

```azurecli
az network nat gateway delete \
    --name myNATgateway \
    --resource-group myResourceGroup
```

---

> [!NOTE]
> The public IP address or prefix associated with the NAT gateway aren't deleted when you delete the NAT gateway resource. 

## Add or remove a public IP address

Complete the following steps to add or remove a public IP address from a NAT gateway.

# [**Portal**](#tab/manage-nat-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

3. Select **+ Create**.

4. Enter or select the following information in **Create public IP address**.

    | Setting | Value |
    | ------- | ----- |
    | IP version | Select **IPv4**. |
    | SKU | Select **Standard**. |
    | Tier | Select **Regional**. |
    | **IPv4 IP Address Configuration** |   |
    | Name | Enter **myPublicIP-NAT2**. |
    | Routing preference | Leave the default of **Microsoft network**. |
    | Subscription | Select your subscription. |
    | Resource group | Select your resource group. **myResourceGroup** is used in this example. |
    | Location | Select a location. **East US 2** is used in this example. |
    | Availability zone | Leave the default of **Zone-redundant**. |

5. Select **Create**.
   
6. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

7. Select **myNATgateway** or the name of your NAT gateway.

8. Select **Outbound IP** in **Settings**.

9. The IP addresses and prefixes associated with the NAT gateway are displayed. Select **Change** next to **Public IP addresses**.

10. Select the pull-down box next to **Public IP addresses**. Select the checkbox next to the IP address you created previously to add the IP address to the NAT gateway. To remove an address, uncheck the box next to its name.

7. Select **OK**.

8. Select **Save**.

# [**PowerShell**](#tab/manage-nat-powershell)

### Add public IP address

The public IP that you want to add to the NAT gateway must be added to an array object along with the current IP addresses. The PowerShell cmdlets do a full replace and not add when they're executed. 

For the purposes of this example, the existing IP address associated with the NAT gateway is named **myPublicIP-NAT**. Replace this value with the existing IP associated with your NAT gateway. If you have multiple IPs already configured, they must also be added to the array.

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a new IP address for the NAT gateway.

```azurepowershell
## Create public IP address for NAT gateway ##
$ip = @{
    Name = 'myPublicIP-NAT2'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
}
New-AzPublicIpAddress @ip
```

Use [Set-AzNatGateway](/powershell/module/az.network/set-aznatgateway) to add the public IP address to the NAT gateway.

```azurepowershell
## Place NAT gateway into a variable. ##
$ng = @{
    Name = 'myNATgateway'
    ResourceGroupName = 'myResourceGroup'
}
$nat = Get-AzNatGateway @ng

## Place the existing public IP address associated with the NAT gateway into a variable. ##
$ip = @{
    Name = 'myPublicIP-NAT'
    ResourceGroupName = 'myResourceGroup'
}
$publicIP1 = Get-AzPublicIPaddress @ip

## Place the public IP address you created previously into a variable. ##
$ip = @{
    Name = 'myPublicIP-NAT2'
    ResourceGroupName = 'myResourceGroup'
}
$publicIP2 = Get-AzPublicIPaddress @ip

## Place the public IP address variables into an array. ##
$pipArray = $publicIP1,$publicIP2

## Add the IP address to the NAT gateway. ##
$nt = @{
    NatGateway = $nat
    PublicIpAddress = $pipArray
}
Set-AzNatGateway @nt
```

### Remove public IP address

To remove a public IP from a NAT gateway, you must create an array object that **doesn't** contain the IP address you wish to remove. For example, you have a NAT gateway configured with two public IP addresses. You wish to remove one of the IP addresses. The IP addresses associated with the NAT gateway are named **myPublicIP-NAT** and **myPublicIP-NAT2**. To remove **myPublicIP-NAT2**, you create an array object for the PowerShell command that **only** contains **myPublicIP-NAT**. When you apply the command, the array is reapplied to the NAT gateway, and **myPublicIP-NAT** is the only public IP associated.

Use [Set-AzNatGateway](/powershell/module/az.network/set-aznatgateway) to remove a public IP address from the NAT gateway.

```azurepowershell
## Place NAT gateway into a variable. ##
$ng = @{
    Name = 'myNATgateway'
    ResourceGroupName = 'myResourceGroup'
}
$nat = Get-AzNatGateway @ng

## Place the existing public IP prefix associated with the NAT gateway into a variable. ##
$ip = @{
    Name = 'myPublicIP-NAT'
    ResourceGroupName = 'myResourceGroup'
}
$prefixIP1 = Get-AzPublicIPAddress @ip

## Place the secondary public IP address into a variable. ##
$ip = @{
    Name = 'myPublicIP-NAT2'
    ResourceGroupName = 'myResourceGroup'
}
$publicIP2 = Get-AzPublicIPAddress @ip

## Place ONLY the public IP you wish to keep in the array. ##
$pipArray = $publicIP1

## Add the IP address prefix to the NAT gateway. ##
$nt = @{
    NatGateway = $nat
    PublicIpAddress = $pipArray
}
Set-AzNatGateway @nt
```

# [**Azure CLI**](#tab/manage-nat-cli)

### Add public IP address

For the purposes of this example, the existing public IP address associated with the NAT gateway is named **myPublicIP-NAT**.

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a new IP address for the NAT gateway.

```azurecli
az network public-ip create \
    --resource-group myResourceGroup \
    --location eastus2 \
    --name myPublicIP-NAT2 \
    --sku standard
```

Use [az network nat gateway update](/cli/azure/network/nat/gateway#az-network-nat-gateway-update) to add the public IP address you created previously to the NAT gateway. The Azure CLI command performs a replacement of the values, not an addition. To add the new IP address to the NAT gateway, you must also include any other IP addresses associated to the NAT gateway, or they'll be removed.

```azurecli
az network nat gateway update \
    --name myNATgateway \
    --resource-group myResourceGroup \
    --public-ip-addresses myPublicIP-NAT myPublicIP-NAT2
```

### Remove public IP address

Use [az network nat gateway update](/cli/azure/network/nat/gateway#az-network-nat-gateway-update) to remove a public IP address from the NAT gateway. The Azure CLI command performs a replacement of the values, not a subtraction. To remove a public IP address, you must include any IP address in the command that you wish to keep, and omit the one you wish to remove. For example, you have a NAT gateway configured with two public IP addresses. You wish to remove one of the IP addresses. The IP addresses associated with the NAT gateway are named **myPublicIP-NAT** and **myPublicIP-NAT2**. To remove **myPublicIP-NAT2**, you must omit the name of the IP from the command. The command will reapply the IPs listed in the command to the NAT gateway. Any IP not listed will be removed.

```azurecli
az network nat gateway update \
    --name myNATgateway \
    --resource-group myResourceGroup \
    --public-ip-addresses myPublicIP-NAT
```

---

## Add or remove a public IP prefix

Complete the following steps to add or remove a public IP prefix from a NAT gateway.

# [**Portal**](#tab/manage-nat-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Public IP prefix**. Select **Public IP Prefixes** in the search results.

3. Select **+ Create**.

4. Enter or select the following information in the **Basics** tab of **Create a public IP prefix**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select your resource group. **myResourceGroup** is used in this example. |
    | **Instance details** |   |
    | Name | Enter **myPublicIPPrefix-NAT**. |
    | Region | Select your region. **East US 2** is used in this example. |
    | IP version | Select **IPv4**. |
    | Prefix ownership | Select **Microsoft owned**. |
    | Prefix size | Select a prefix size. **/28 (16 addresses)** is used in this example. |
 
5. Select **Review + create**.    

6. Select **Create**.
   
7. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

8. Select **myNATgateway** or the name of your NAT gateway.

9. Select **Outbound IP** in **Settings**.

10. The IP addresses and prefixes associated with the NAT gateway are displayed. Select **Change** next to **Public IP prefixes**.

11. Select the pull-down box next to **Public IP Prefixes**. Select the checkbox next to the IP address prefix you created previously to add the prefix to the NAT gateway. To remove a prefix, uncheck the box next to its name.

7. Select **OK**.

8. Select **Save**.

# [**PowerShell**](#tab/manage-nat-powershell)

### Add public IP prefix

The public IP prefix that you want to add to the NAT gateway must be added to an array object along with the current IP prefixes. The PowerShell cmdlets do a full replace and not add when they're executed. 

For the purposes of this example, the existing public IP prefix associated with the NAT gateway is named **myPublicIPprefix-NAT**. Replace this value with the existing IP prefix associated with your NAT gateway. If you have multiple prefixes already configured, they must also be added to the array.

Use [New-AzPublicIpPrefix](/powershell/module/az.network/new-azpublicipprefix) to create a new public IP prefix for the NAT gateway.

```azurepowershell
## Create public IP prefix for NAT gateway ##
$ip = @{
    Name = 'myPublicIPPrefix-NAT2'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    PrefixLength = '29'
}
New-AzPublicIpPrefix @ip
```

Use [Set-AzNatGateway](/powershell/module/az.network/set-aznatgateway) to add the public IP prefix to the NAT gateway.

```azurepowershell
## Place NAT gateway into a variable. ##
$ng = @{
    Name = 'myNATgateway'
    ResourceGroupName = 'myResourceGroup'
}
$nat = Get-AzNatGateway @ng

## Place the existing public IP prefix associated with the NAT gateway into a variable. ##
$ip = @{
    Name = 'myPublicIPprefix-NAT'
    ResourceGroupName = 'myResourceGroup'
}
$prefixIP1 = Get-AzPublicIPPrefix @ip

## Place the public IP prefix you created previously into a variable. ##
$ip = @{
    Name = 'myPublicIPprefix-NAT2'
    ResourceGroupName = 'myResourceGroup'
}
$prefixIP2 = Get-AzPublicIPprefix @ip

## Place the public IP address variables into an array. ##
$preArray = $prefixIP1,$prefixIP2

## Add the IP address prefix to the NAT gateway. ##
$nt = @{
    NatGateway = $nat
    PublicIpPrefix = $preArray
}
Set-AzNatGateway @nt
```

### Remove public IP prefix

To remove a public IP prefix from a NAT gateway, you must create an array object that **doesn't** contain the IP address prefix you wish to remove. For example, you have a NAT gateway configured with two public IP prefixes. You wish to remove one of the IP prefixes. The IP prefixes associated with the NAT gateway are named **myPublicIPprefix-NAT** and **myPublicIPprefix-NAT2**. To remove **myPublicIPprefix-NAT2**, you create an array object for the PowerShell command that **only** contains **myPublicIPprefix-NAT**. When you apply the command, the array is reapplied to the NAT gateway, and **myPublicIPprefix-NAT** is the only prefix associated.

Use [Set-AzNatGateway](/powershell/module/az.network/set-aznatgateway) to remove a public IP prefix from the NAT gateway.

```azurepowershell
## Place NAT gateway into a variable. ##
$ng = @{
    Name = 'myNATgateway'
    ResourceGroupName = 'myResourceGroup'
}
$nat = Get-AzNatGateway @ng

## Place the existing public IP prefix associated with the NAT gateway into a variable. ##
$ip = @{
    Name = 'myPublicIPprefix-NAT'
    ResourceGroupName = 'myResourceGroup'
}
$prefixIP1 = Get-AzPublicIPPrefix @ip

## Place the secondary public IP prefix into a variable. ##
$ip = @{
    Name = 'myPublicIPprefix-NAT2'
    ResourceGroupName = 'myResourceGroup'
}
$prefixIP2 = Get-AzPublicIPprefix @ip

## Place ONLY the prefix you wish to keep in the array. DO NOT ADD THE SECONDARY VARIABLE ##
$preArray = $prefixIP1

## Add the IP address prefix to the NAT gateway. ##
$nt = @{
    NatGateway = $nat
    PublicIpPrefix = $preArray
}
Set-AzNatGateway @nt
```

# [**Azure CLI**](#tab/manage-nat-cli)

### Add public IP prefix

For the purposes of this example, the existing public IP prefix associated with the NAT gateway is named **myPublicIPprefix-NAT**.

Use [az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-create) to create a public IP prefix for the NAT gateway.

```azurecli
az network public-ip prefix create \
    --length 29 \
    --resource-group myResourceGroup \
    --location eastus2 \
    --name myPublicIPprefix-NAT2
```

Use [az network nat gateway update](/cli/azure/network/nat/gateway#az-network-nat-gateway-update) to add the public IP prefix you created previously to the NAT gateway. The Azure CLI command is a replacement of the values, not an addition. To add the new IP address prefix to the NAT gateway, you must also include any other IP prefixes associated to the NAT gateway, or they'll be removed.

```azurecli
az network nat gateway update \
    --name myNATgateway \
    --resource-group myResourceGroup \
    --public-ip-prefixes myPublicIPprefix-NAT myPublicIPprefix-NAT2
```

### Remove public IP prefix

Use [az network nat gateway update](/cli/azure/network/nat/gateway#az-network-nat-gateway-update) to remove a public IP prefix from the NAT gateway. The Azure CLI command is a replacement of the values and not subtraction. To remove a public IP prefix, you must include any prefix in the command that you wish to keep, and omit the one you wish to remove. For example, you have a NAT gateway configured with two public IP prefixes. You wish to remove one of the prefixes. The IP prefixes associated with the NAT gateway are named **myPublicIPprefix-NAT** and **myPublicIPprefix-NAT2**. To remove **myPublicIPprefix-NAT2**, you must omit the name of the IP prefix from the command. The command will reapply the IPs listed in the command to the NAT gateway. Any IP not listed will be removed.

```azurecli
az network nat gateway update \
    --name myNATgateway \
    --resource-group myResourceGroup \
    --public-ip-prefixes myPublicIPprefix-NAT
```
---

## Next steps
To learn more about Azure Virtual Network NAT and its capabilities, see the following articles:

- [What is Azure Virtual Network NAT?](nat-overview.md)

- [NAT gateway and availability zones](nat-availability-zones.md)

- [Design virtual networks with NAT gateway](nat-gateway-resource.md)

