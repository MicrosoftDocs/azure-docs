---
title: Manage a NAT gateway
titleSuffix: Azure NAT Gateway
description: Learn how to create and remove a NAT gateway resource from a virtual network subnet. Add and remove public IP addresses and prefixes used for outbound connectivity.
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: how-to
ms.date: 02/16/2024
ms.custom: template-how-to, devx-track-azurecli, devx-track-azurepowershell
#Customer intent: As a network administrator, I want to learn how to create and remove a NAT gateway resource from a virtual network subnet. I also want to learn how to add and remove public IP addresses and prefixes used for outbound connectivity.
---

# Manage NAT gateway

Learn how to create and remove a NAT gateway resource from a virtual network subnet. A NAT gateway enables outbound connectivity for resources in an Azure Virtual Network. You can change the public IP addresses and public IP address prefixes associated with the NAT gateway changed after deployment.

This article explains how to manage the following aspects of NAT gateway:

- Create a NAT gateway and associate it with an existing subnet.

- Remove a NAT gateway from an existing subnet and delete the NAT gateway.

- Add or remove a public IP address or public IP prefix.

## Prerequisites

# [**Azure portal**](#tab/manage-nat-portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure Virtual Network with a subnet. For more information, see [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

  - The example virtual network that is used in this article is named *myVNet*.

  - The example subnet is named *mySubnet*.

  - The example NAT gateway is named *myNATgateway*.

# [**Azure PowerShell**](#tab/manage-nat-powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure Virtual Network with a subnet. For more information, see [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

  - The example virtual network that is used in this article is named *myVNet*.

  - The example subnet is named *mySubnet*.

  - The example NAT gateway is named *myNATgateway*.

To use Azure PowerShell for this article, you need:

- Azure PowerShell installed locally or Azure Cloud Shell.

  If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

  If you run PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

- Ensure that your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name Az.Network`.

- Sign in to Azure PowerShell and select the subscription that you want to use. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

# [**Azure CLI**](#tab/manage-nat-cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure Virtual Network with a subnet. For more information, see [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

  - The example virtual network that is used in this article is named *myVNet*.

  - The example subnet is named *mySubnet*.

  - The example NAT gateway is named *myNATgateway*.

To use Azure CLI for this article, you need:

- Azure CLI version 2.31.0 or later. Azure Cloud Shell uses the latest version.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

# [**Bicep**](#tab/manage-nat-bicep)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure Virtual Network with a subnet. For more information, see [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

  - The example virtual network that is used in this article is named *myVNet*.

  - The example subnet is named *mySubnet*.

  - The example NAT gateway is named *myNATgateway*.

---

## Create a NAT gateway and associate it with an existing subnet

You can create a NAT gateway resource and add it to an existing subnet by using the Azure portal, Azure PowerShell, Azure CLI, or Bicep.

# [**Azure portal**](#tab/manage-nat-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the Azure portal, enter *NAT gateway*. Select **NAT gateways** in the search results.

1. Select **Create**.

1. Enter the following information in the **Basics** tab of **Create network address translation (NAT) gateway**.

   - Select your **Subscription**.
   - Select your resource group or select **Create new** to create a new resource group.
   - **NAT gateway name**. Enter *myNATgateway*.
   - Select your **Region**. This example uses **East US 2**.
   - Select an **Availability zone**. This example uses **No Zone**. For more information about NAT gateway availability, see [NAT gateway and availability zones](nat-availability-zones.md). |
   - Select a **TCP idle timeout (minutes)**. This example uses the default of **4**.

1. Select the **Outbound IP** tab, or select **Next: Outbound IP**.

1. You can select an existing public IP address or prefix or both to associate with the NAT gateway and enable outbound connectivity.

   - To create a new public IP for the NAT gateway, select **Create a new public IP address**. Enter *myPublicIP-NAT* in **Name**. Select **OK**.

   - To create a new public IP prefix for the NAT gateway, select **Create a new public IP prefix**. Enter *myPublicIPPrefix-NAT* in **Name**. Select a **Prefix size**. Select **OK**.

1. Select the **Subnet** tab, or select **Next: Subnet**.

1. Select your virtual network. In this example, select **myVNet** in the dropdown list.

1. Select the checkbox next to **mySubnet**.

1. Select **Review + create**.

1. Select **Create**.

# [**Azure PowerShell**](#tab/manage-nat-powershell)

### Public IP address

To create a NAT gateway with a public IP address, run the following PowerShell commands.

Use the [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) cmdlet to create a public IP address for the NAT gateway.

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

Use the [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway) cmdlet to create a NAT gateway resource and associate the public IP address that you created. Use the [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) cmdlet to configure the NAT gateway for your virtual network subnet.

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
    AddressPrefix = '10.0.2.0/24'
}
Set-AzVirtualNetworkSubnetConfig @sub

## Save the configuration to the virtual network. ##
$vnet | Set-AzVirtualNetwork
```

### Public IP prefix

To create a NAT gateway with a public IP prefix, use these commands.

Use the [New-AzPublicIpPrefix](/powershell/module/az.network/new-azpublicipprefix) cmdlet to create a public IP prefix for the NAT gateway.

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

Use the [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway) cmdlet to create a NAT gateway resource and associate the public IP prefix you created. Use the [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) cmdlet to configure the NAT gateway for your virtual network subnet.

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

To create a NAT gateway with a public IP address, use the following commands.

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP address for the NAT gateway.

```azurecli
az network public-ip create \
    --resource-group myResourceGroup \
    --location eastus2 \
    --name myPublicIP-NAT \
    --sku standard
```

Use [az network nat gateway create](/cli/azure/network/nat/gateway#az-network-nat-gateway-create) to create a NAT gateway resource and associate the public IP address that you created.

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

To create a NAT gateway with a public IP prefix, use the following commands.

Use [az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-create) to create a public IP prefix for the NAT gateway.

```azurecli
az network public-ip prefix create \
    --length 29 \
    --resource-group myResourceGroup \
    --location eastus2 \
    --name myPublicIPprefix-NAT
```

Use [az network nat gateway create](/cli/azure/network/nat/gateway#az-network-nat-gateway-create) to create a NAT gateway resource and associate the public IP prefix that you created.

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

# [**Bicep**](#tab/manage-nat-bicep)

```bicep

@description('Name of the NAT gateway')
param natgatewayname string = 'nat-gateway'

@description('Name of the NAT gateway public IP')
param publicipname string = 'public-ip-nat'

@description('Name of resource group')
param location string = resourceGroup().location

var existingVNetName = 'vnet-1'
var existingSubnetName = 'subnet-1'

resource vnet 'Microsoft.Network/virtualNetworks@2023-05-01' existing = {
  name: existingVNetName
}
output vnetid string = vnet.id

resource publicip 'Microsoft.Network/publicIPAddresses@2023-06-01' = {
  name: publicipname
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    publicIPAddressVersion: 'IPv4'
    publicIPAllocationMethod: 'Static'
    idleTimeoutInMinutes: 4
  }
}

resource natgateway 'Microsoft.Network/natGateways@2023-06-01' = {
  name: natgatewayname
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    idleTimeoutInMinutes: 4
    publicIpAddresses: [
      {
        id: publicip.id
      }
    ]
  }
}
output natgatewayid string = natgateway.id

resource updatedsubnet01 'Microsoft.Network/virtualNetworks/subnets@2023-06-01' = {
  parent: vnet
  name: existingSubnetName
  properties: {
    addressPrefix: vnet.properties.subnets[0].properties.addressPrefix
    natGateway: {
      id: natgateway.id
    }
  }
}

```

---

## Remove a NAT gateway from an existing subnet and delete the resource

To remove a NAT gateway from an existing subnet, complete the following steps.

# [**Azure portal**](#tab/manage-nat-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the Azure portal, enter *NAT gateway*. Select **NAT gateways** in the search results.

1. Select **myNATgateway**.

1. Under **Settings**, select **Subnets**.

1. Select **Disassociate** to remove the NAT gateway from the configured subnet.

You can now associate the NAT gateway with a different subnet or virtual network in your subscription. To delete the NAT gateway resource, complete the following steps.

1. In the search box at the top of the Azure portal, enter *NAT gateway*. Select **NAT gateways** in the search results.

1. Select **myNATgateway**.

1. Select **Delete**.

1. Select **Yes**.

# [**Azure PowerShell**](#tab/manage-nat-powershell)

Removing the NAT gateway from a subnet by using Azure PowerShell isn't currently supported.

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

# [**Bicep**](#tab/manage-nat-bicep)

Use the Azure portal, Azure PowerShell, or Azure CLI to remove a NAT gateway from a subnet and delete the resource.

---

> [!NOTE]
> When you delete a NAT gateway, the public IP address or prefix associated with it isn't deleted.

## Add or remove a public IP address

Complete the following steps to add or remove a public IP address from a NAT gateway.

# [**Azure portal**](#tab/manage-nat-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the Azure portal, enter *Public IP address*. Select **Public IP addresses** in the search results.

1. Select **Create**.

1. Enter the following information in **Create public IP address**.

   | Setting | Value |
   | ------- | ----- |
   | Subscription | Select your subscription. |
   | Resource group | Select your resource group. The example uses **myResourceGroup**. |
   | Region | Select a region. This example uses **East US 2**. |
   | Name | Enter *myPublicIP-NAT2*. |
   | IP version | Select **IPv4**. |
   | SKU | Select **Standard**. |
   | Availability zone | Select the default of **Zone-redundant**. |
   | Tier | Select **Regional**. |

1. Select **Review + create** and then select **Create**.

1. In the search box at the top of the Azure portal, enter *NAT gateway*. Select **NAT gateways** in the search results.

1. Select **myNATgateway**.

1. Under **Settings**, select **Outbound IP**.

1. The IP addresses and prefixes associated with the NAT gateway are displayed. Next to **Public IP addresses**, select **Change**.

1. Next to **Public IP addresses**, select the dropdown for IP addresses. Select the IP address that you created to add to the NAT gateway. To remove an address, unselect it.

1. Select **OK**.

1. Select **Save**.

# [**PowerShell**](#tab/manage-nat-powershell)

### Add public IP address

To add a public IP address to the NAT gateway, add it to an array object along with the current IP addresses. The PowerShell cmdlets replace all the addresses.

In this example, the existing IP address associated with the NAT gateway is named *myPublicIP-NAT*. Replace this value with an array that contains both myPublicIP-NAT and a new IP address. If you have multiple IP addresses already configured, you must also add them to the array.

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

To remove a public IP from a NAT gateway, create an array object that *doesn't* contain the IP address you want to remove. For example, you have a NAT gateway configured with two public IP addresses. You want to remove one of the IP addresses. The IP addresses associated with the NAT gateway are named myPublicIP-NAT and myPublicIP-NAT2. To remove myPublicIP-NAT2, create an array object for the PowerShell command that contains *only* myPublicIP-NAT. When you apply the command, the array is reapplied to the NAT gateway, and myPublicIP-NAT is the only associated public IP address.

Use [Set-AzNatGateway](/powershell/module/az.network/set-aznatgateway) to remove a public IP address from the NAT gateway.

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

## Place the second public IP address into a variable. ##
$ip = @{
    Name = 'myPublicIP-NAT2'
    ResourceGroupName = 'myResourceGroup'
}
$publicIP2 = Get-AzPublicIPAddress @ip

## Place ONLY the public IP you wish to keep in the array. ##
$pipArray = $publicIP1

## Add the public IP address to the NAT gateway. ##
$nt = @{
    NatGateway = $nat
    PublicIpAddress = $pipArray
}
Set-AzNatGateway @nt
```

# [**Azure CLI**](#tab/manage-nat-cli)

### Add public IP address

In this example, the existing public IP address associated with the NAT gateway is named *myPublicIP-NAT*.

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a new IP address for the NAT gateway.

```azurecli
az network public-ip create \
    --resource-group myResourceGroup \
    --location eastus2 \
    --name myPublicIP-NAT2 \
    --sku standard
```

Use [az network nat gateway update](/cli/azure/network/nat/gateway#az-network-nat-gateway-update) to add the public IP address that you created to the NAT gateway. The Azure CLI command replaces the values. It doesn't add a new value. To add the new IP address to the NAT gateway, you must also include any other IP addresses associated to the NAT gateway.

```azurecli
az network nat gateway update \
    --name myNATgateway \
    --resource-group myResourceGroup \
    --public-ip-addresses myPublicIP-NAT myPublicIP-NAT2
```

### Remove public IP address

Use [az network nat gateway update](/cli/azure/network/nat/gateway#az-network-nat-gateway-update) to remove a public IP address from the NAT gateway. The Azure CLI command replaces the values. It doesn't remove a value. To remove a public IP address, include any IP address in the command that you want to keep. Omit the value that you want to remove. For example, you have a NAT gateway configured with two public IP addresses. You want to remove one of the IP addresses. The IP addresses associated with the NAT gateway are named myPublicIP-NAT and myPublicIP-NAT2. To remove myPublicIP-NAT2, omit the name of the IP address from the command. The command reapplies the IP addresses listed in the command to the NAT gateway. It removes any IP address not listed.

```azurecli
az network nat gateway update \
    --name myNATgateway \
    --resource-group myResourceGroup \
    --public-ip-addresses myPublicIP-NAT
```

# [**Bicep**](#tab/manage-nat-bicep)

Use the Azure portal, Azure PowerShell, or Azure CLI to add or remove a public IP address from a NAT gateway.

---

## Add or remove a public IP prefix

Complete the following steps to add or remove a public IP prefix from a NAT gateway.

# [**Azure portal**](#tab/manage-nat-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the Azure portal, enter *Public IP prefix*. Select **Public IP Prefixes** in the search results.

1. Select **Create**.

1. Enter the following information in the **Basics** tab of **Create a public IP prefix**.

   | Setting | Value |
   | ------- | ----- |
   | **Project details** |  |
   | Subscription | Select your subscription. |
   | Resource group | Select your resource group. This example uses **myResourceGroup**. |
   | **Instance details** |   |
   | Name | Enter *myPublicIPPrefix-NAT*. |
   | Region | Select your region. This example uses **East US 2**. |
   | IP version | Select **IPv4**. |
   | Prefix ownership | Select **Microsoft owned**. |
   | Prefix size | Select a prefix size. This example uses **/28 (16 addresses)**. |

1. Select **Review + create**, then select **Create**.

1. In the search box at the top of the Azure portal, enter *NAT gateway*. Select **NAT gateways** in the search results.

1. Select **myNATgateway**.

1. Under **Settings**, select **Outbound IP**.

1. The page displays the IP addresses and prefixes associated with the NAT gateway. Next to **Public IP prefixes**, select **Change**.

1. Next to **Public IP Prefixes**, select the dropdown box. Select the IP address prefix that you created to add the prefix to the NAT gateway. To remove a prefix, unselect it.

1. Select **OK**.

1. Select **Save**.

# [**Azure PowerShell**](#tab/manage-nat-powershell)

### Add public IP prefix

To add a public IP prefix to the NAT gateway, add it to an array object along with the current IP prefixes. The PowerShell cmdlets replace all the IP prefixes.

In this example, the existing public IP prefix associated with the NAT gateway is named *myPublicIPprefix-NAT*. Replace this value with an array that contains both myPublicIPprefix-NAT and a new IP address prefix. If you have multiple IP prefixes already configured, you must also add them to the array.

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

To remove a public IP prefix from a NAT gateway, create an array object that *doesn't* contain the IP address prefix that you want to remove. For example, you have a NAT gateway configured with two public IP prefixes. You want to remove one of the IP prefixes. The IP prefixes associated with the NAT gateway are named myPublicIPprefix-NAT and myPublicIPprefix-NAT2. To remove myPublicIPprefix-NAT2, create an array object for the PowerShell command that contains *only* myPublicIPprefix-NAT. When you apply the command, the array is reapplied to the NAT gateway, and myPublicIPprefix-NAT is the only prefix associated.

Use the [Set-AzNatGateway](/powershell/module/az.network/set-aznatgateway) cmdlet to remove a public IP prefix from the NAT gateway.

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

In this example, the existing public IP prefix associated with the NAT gateway is named *myPublicIPprefix-NAT*.

Use [az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-create) to create a public IP prefix for the NAT gateway.

```azurecli
az network public-ip prefix create \
    --length 29 \
    --resource-group myResourceGroup \
    --location eastus2 \
    --name myPublicIPprefix-NAT2
```

Use [az network nat gateway update](/cli/azure/network/nat/gateway#az-network-nat-gateway-update) to add the public IP prefix that you created to the NAT gateway. The Azure CLI command replaces values. It doesn't add a value. To add the new IP address prefix to the NAT gateway, you must also include any other IP prefixes associated to the NAT gateway.

```azurecli
az network nat gateway update \
    --name myNATgateway \
    --resource-group myResourceGroup \
    --public-ip-prefixes myPublicIPprefix-NAT myPublicIPprefix-NAT2
```

### Remove public IP prefix

Use [az network nat gateway update](/cli/azure/network/nat/gateway#az-network-nat-gateway-update) to remove a public IP prefix from the NAT gateway. The Azure CLI command replaces the values. It doesn't remove a value. To remove a public IP prefix, include any prefix in the command that you wish to keep. Omit the one you want to remove. For example, you have a NAT gateway configured with two public IP prefixes. You want to remove one of the prefixes. The IP prefixes associated with the NAT gateway are named myPublicIPprefix-NAT and myPublicIPprefix-NAT2. To remove myPublicIPprefix-NAT2, omit the name of the IP prefix from the command. The command reapplies the IP prefixes listed in the command to the NAT gateway. It removes any IP address not listed.

```azurecli
az network nat gateway update \
    --name myNATgateway \
    --resource-group myResourceGroup \
    --public-ip-prefixes myPublicIPprefix-NAT
```

# [**Bicep**](#tab/manage-nat-bicep)

Use the Azure portal, Azure PowerShell, or Azure CLI to add or remove a public IP prefix from a NAT gateway.

---

## Next steps

To learn more about Azure Virtual Network NAT and its capabilities, see the following articles:

- [What is Azure NAT Gateway?](nat-overview.md)
- [NAT gateway and availability zones](nat-availability-zones.md)
- [Design virtual networks with NAT gateway](nat-gateway-resource.md)
