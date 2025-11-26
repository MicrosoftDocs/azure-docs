---
title: Manage a Standard V2 NAT Gateway
titleSuffix: Azure NAT Gateway
description: Learn how to create and remove a NAT gateway v2 resource from a virtual network and virtual network subnet. Add and remove public IP addresses and prefixes used for outbound connectivity.
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: how-to
ms.date: 09/08/2025
ms.custom: template-how-to, devx-track-azurecli, devx-track-azurepowershell
#Customer intent: As a network administrator, I want to learn how to create and remove a NAT gateway resource from a virtual network subnet. I also want to learn how to add and remove public IP addresses and prefixes used for outbound connectivity.
---

# Manage a Standard V2 NAT gateway

Learn how to create and remove a NAT gateway resource from a virtual network subnet. A NAT gateway enables outbound connectivity for resources in an Azure Virtual Network. You can change the public IP addresses and public IP address prefixes associated with the NAT gateway changed after deployment.

> [!IMPORTANT]
> Standard V2 SKU Azure NAT Gateway is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to manage the following aspects of NAT gateway:

- Create a NAT gateway and associate it with an existing subnet.

- Create a NAT gateway and associate it with an existing virtual network.

- Remove a NAT gateway from an existing subnet and delete the NAT gateway.

- Remove a NAT gateway from an existing virtual network and delete the NAT gateway.

- Add or remove a public IP address or public IP prefix.

## Prerequisites

# [**Azure portal**](#tab/manage-nat-portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An existing Azure Virtual Network and subnet. For more information, see [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

  - The example virtual network that is used in this article is named **vnet-1**.

  - The example subnet is named **subnet-1**.

  - The example NAT gateway is named **nat-gateway**.

# [**Azure PowerShell**](#tab/manage-nat-powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An existing Azure Virtual Network and subnet. For more information, see [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

  - The example virtual network that is used in this article is named **vnet-1**.

  - The example subnet is named **subnet-1**.

  - The example NAT gateway is named **nat-gateway**.

To use Azure PowerShell for this article, you need:

- Azure PowerShell installed locally or Azure Cloud Shell.

  If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

  If you run PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

- Ensure that your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name Az.Network`.

- Sign in to Azure PowerShell and select the subscription that you want to use. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

---

## Create a NAT gateway and associate it with an existing subnet

You can create a NAT gateway resource and add it to an existing subnet by using the Azure portal or Azure PowerShell.

# [**Azure portal**](#tab/manage-nat-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **Create**.

1. Enter or select the following information in the **Basics** tab of **Create network address translation (NAT) gateway**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** or your resource group. |
    | **Instance details** |  |
    | NAT gateway name | Enter **nat-gateway**. |
    | Region | Select your region. This example uses **West US**. |
    | SKU | Select **Standard V2**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

1. Select **Next**.

1. In the **Outbound IP** tab, select **+ Add public IP addresses or prefixes**.

1. In **Add public IP addresses or prefixes**, select **Public IP addresses**. You can select an existing public IP address or create a new one.

   - To create a new public IP for the NAT gateway, select **Create a new public IP address**. Enter **public-ip-nat** in **Name**. Select **OK**.

   - To create a new public IP prefix for the NAT gateway, select **Create a new public IP prefix**. Enter **public-ip-prefix-nat** in **Name**. Select a **Prefix size**. Select **OK**.

1. Select **Save**.

1. Select the **Networking** tab, or select **Next**.

1. Select your virtual network. In this example, select **vnet-1** in the dropdown list.

1. Leave the **Default to all subnets** unselected.

1. Select **subnet-1** from the dropdown list.

1. Select **Review + create**.

1. Select **Create**.

# [**Azure PowerShell**](#tab/manage-nat-powershell)

### Public IP address

To create a NAT gateway with a public IP address, run the following PowerShell commands.

Use the [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) cmdlet to create a public IP address for the NAT gateway.

```azurepowershell
## Create public IP address for NAT gateway ##
$ip = @{
    Name = 'public-ip-nat'
    ResourceGroupName = 'test-rg'
    Location = 'eastus'
    Sku = 'StandardV2'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
New-AzPublicIpAddress @ip
```

Use the [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway) cmdlet to create a NAT gateway resource and associate the public IP address that you created. Use the [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) cmdlet to configure the NAT gateway for your virtual network subnet.

```azurepowershell
## Place the virtual network into a variable. ##
$net = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}
$vnet = Get-AzVirtualNetwork @net

## Place the public IP address you created previously into a variable. ##
$pip = @{
    Name = 'public-ip-nat'
    ResourceGroupName = 'test-rg'
}
$publicIPIPv4 = Get-AzPublicIPAddress @pip

## Create NAT gateway resource ##
$nat = @{
    ResourceGroupName = 'test-rg'
    Name = 'nat-gateway'
    IdleTimeoutInMinutes = '4'
    Sku = 'StandardV2'
    Location = 'eastus'
    PublicIpAddress = $publicIPIPv4
    Zone = 1,2,3
}
$natGateway = New-AzNatGateway @nat

## Create the subnet configuration. ##
$sub = @{
    Name = 'subnet-1'
    VirtualNetwork = $vnet
    NatGateway = $natGateway
    AddressPrefix = '10.0.0.0/24'
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
    Name = 'public-ip-prefix-nat'
    ResourceGroupName = 'test-rg'
    Location = 'eastus'
    Sku = 'StandardV2'
    PrefixLength = '31'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
New-AzPublicIpPrefix @ip
```

Use the [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway) cmdlet to create a NAT gateway resource and associate the public IP prefix you created. Use the [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) cmdlet to configure the NAT gateway for your virtual network subnet.

```azurepowershell
## Place the virtual network into a variable. ##
$net = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}
$vnet = Get-AzVirtualNetwork @net

## Place the public IP prefix you created previously into a variable. ##
$pip = @{
    Name = 'public-ip-prefix-nat'
    ResourceGroupName = 'test-rg'
}
$publicIPIPv4prefix = Get-AzPublicIPPrefix @pip

## Create NAT gateway resource ##
$nat = @{
    ResourceGroupName = 'test-rg'
    Name = 'nat-gateway'
    IdleTimeoutInMinutes = '4'
    Sku = 'StandardV2'
    Location = 'eastus'
    PublicIpPrefix = $publicIPIPv4prefix
    Zone = 1,2,3
}
$natGateway = New-AzNatGateway @nat

## Create the subnet configuration. ##
$sub = @{
    Name = 'subnet-1'
    VirtualNetwork = $vnet
    NatGateway = $natGateway
    AddressPrefix = '10.0.0.0/24'
}
Set-AzVirtualNetworkSubnetConfig @sub

## Save the configuration to the virtual network. ##
$vnet | Set-AzVirtualNetwork
```

---

## Create a NAT gateway and associate it with an existing virtual network.

Azure NAT Gateway V2 adds a feature that allows you to associate a NAT gateway with an entire virtual network instead of a specific subnet.

You can create a NAT gateway resource and add it to an existing virtual network by using the Azure portal or Azure PowerShell.

# [**Azure portal**](#tab/manage-nat-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **Create**.

1. Enter or select the following information in the **Basics** tab of **Create network address translation (NAT) gateway**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** or your resource group. |
    | **Instance details** |  |
    | NAT gateway name | Enter **nat-gateway**. |
    | Region | Select your region. This example uses **West US**. |
    | SKU | Select **Standard V2**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

1. Select **Next**.

1. In the **Outbound IP** tab, select **+ Add public IP addresses or prefixes**.

1. In **Add public IP addresses or prefixes**, select **Public IP addresses**. You can select an existing public IP address or create a new one.

   - To create a new public IP for the NAT gateway, select **Create a new public IP address**. Enter **public-ip-nat** in **Name**. Select **OK**.

   - To create a new public IP prefix for the NAT gateway, select **Create a new public IP prefix**. Enter **public-ip-prefix-nat** in **Name**. Select a **Prefix size**. Select **OK**.

1. Select **Save**.

1. Select the **Networking** tab, or select **Next**.

1. Select your virtual network. In this example, select **vnet-1** in the dropdown list.

1. Select the checkbox **Default to all subnets**.

1. Select **Review + create**.

1. Select **Create**.

# [**Azure PowerShell**](#tab/manage-nat-powershell)

Use [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway) to create the NAT gateway resource.

### Public IP address

Use the [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) cmdlet to create a public IP address for the NAT gateway.

```azurepowershell
## Create public IP address for NAT gateway ##
$ip = @{
    Name = 'public-ip-nat'
    ResourceGroupName = 'test-rg'
    Location = 'eastus'
    Sku = 'StandardV2'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
New-AzPublicIpAddress @ip
```

```azurepowershell
## Place the existing virtual network into a variable
$net = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}
$vnet = Get-AzVirtualNetwork @net

## Place the public IP address you created previously into a variable. ##
$pip = @{
    Name = 'public-ip-nat'
    ResourceGroupName = 'test-rg'
}
$publicIPIPv4 = Get-AzPublicIpAddress @pip

## Create NAT gateway resource ##
$nat = @{
    ResourceGroupName = 'test-rg'
    Name = 'nat-gateway'
    IdleTimeoutInMinutes = '4'
    PublicIpAddress = $publicIPIPv4
    Sku = 'StandardV2'
    Location = 'eastus'
    SourceVirtualNetwork = $vnet
    Zone = 1,2,3
}
$natGateway = New-AzNatGateway @nat
```

### Public IP prefix

Use the [New-AzPublicIpPrefix](/powershell/module/az.network/new-azpublicipprefix) cmdlet to create a public IP prefix for the NAT gateway.

```azurepowershell
## Create public IP prefix for NAT gateway ##
$ip = @{
    Name = 'public-ip-prefix-nat'
    ResourceGroupName = 'test-rg'
    Location = 'eastus'
    Sku = 'StandardV2'
    PrefixLength = '31'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
New-AzPublicIpPrefix @ip
```

```azurepowershell
## Place the existing virtual network into a variable
$net = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}
$vnet = Get-AzVirtualNetwork @net

## Place the public IP prefix you created previously into a variable. ##
$pip = @{
    Name = 'public-ip-prefix-nat'
    ResourceGroupName = 'test-rg'
}
$publicIPIPv4prefix = Get-AzPublicIPPrefix @pip

## Create NAT gateway resource ##
$nat = @{
    ResourceGroupName = 'test-rg'
    Name = 'nat-gateway'
    IdleTimeoutInMinutes = '4'
    PublicIpPrefix = $publicIPIPv4prefix
    Sku = 'StandardV2'
    Location = 'eastus'
    SourceVirtualNetwork = $vnet
    Zone = 1,2,3
}
$natGateway = New-AzNatGateway @nat
```

---

## Remove a NAT gateway from an existing subnet and delete the resource

To remove a NAT gateway from an existing subnet, complete the following steps.

# [**Azure portal**](#tab/manage-nat-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **nat-gateway**.

1. Select **Networking**.

1. To remove NAT gateway from **all** subnets, select **Disassociate**.

1. To remove NAT gateway from only one of multiple subnets, unselect the checkbox next to the subnet in the dropdown and select **Save**.

You can now associate the NAT gateway with a different subnet or virtual network in your subscription. To delete the NAT gateway resource, complete the following steps.

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **nat-gateway**.

1. Select **Delete**.

1. Select **Yes**.

# [**Azure PowerShell**](#tab/manage-nat-powershell)

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to remove the NAT gateway association from the subnet by setting the value to $null. Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to update the virtual network configuration.

```azurepowershell
# Specify the resource group and NAT gateway name
$resourceGroupName = "test-rg"

# Specify the virtual network name and subnet name
$virtualNetworkName = "vnet-1"
$subnetName = "subnet-1"

# Get the virtual network
$vnet = @{
    Name = $virtualNetworkName
    ResourceGroupName = $resourceGroupName
}
$virtualNetwork = Get-AzVirtualNetwork @vnet

# Get the subnet
$subnet = $virtualNetwork.Subnets | Where-Object {$_.Name -eq $subnetName}

# Remove the NAT gateway association from the subnet
$subnet.NatGateway = $null

# Update the subnet configuration
$subConfig = @{
    Name = $subnetName
    VirtualNetwork = $virtualNetwork
    AddressPrefix = $subnet.AddressPrefix         
}
Set-AzVirtualNetworkSubnetConfig @subConfig

# Update the virtual network
Set-AzVirtualNetwork -VirtualNetwork $virtualNetwork

```

Use [Remove-AzNatGateway](/powershell/module/az.network/remove-aznatgateway) to delete the NAT gateway resource.

```azurepowershell
# Specify the resource group and NAT gateway name
$resourceGroupName = "test-rg"
$natGatewayName = "nat-gateway"

$nat = @{
    Name = $natGatewayName
    ResourceGroupName = $resourceGroupName
}
Remove-AzNatGateway @nat
```

---

## Remove a NAT gateway from an existing virtual network and delete the NAT gateway

To remove a NAT gateway from an existing virtual network, complete the following steps.

# [**Azure portal**](#tab/manage-nat-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **nat-gateway**.

1. Select **Networking**.

1. To remove NAT gateway from the network, select **X Disassociate**.

You can now associate the NAT gateway with a different subnet or virtual network in your subscription. To delete the NAT gateway resource, complete the following steps.

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **nat-gateway**.

1. Select **Delete**.

1. Select **Yes**.

# [**Azure PowerShell**](#tab/manage-nat-powershell)

Use [Set-AzNatGateway](/powershell/module/az.network/set-aznatgateway) to remove the NAT gateway association from the virtual network by setting the value to $null.

```azurepowershell
## Place NAT gateway into a variable. ##
$ng = @{
    Name = 'nat-gateway'
    ResourceGroupName = 'test-rg'
}
$nat = Get-AzNatGateway @ng

## Remove the NAT gateway association from the virtual network. ##
$nat.SourceVirtualNetwork = $null
Set-AzNatGateway @nat
```

Use [Remove-AzNatGateway](/powershell/module/az.network/remove-aznatgateway) to delete the NAT gateway resource.

```azurepowershell
# Specify the resource group and NAT gateway name
$nat = @{
    Name = 'nat-gateway'
    ResourceGroupName = 'test-rg'
}
Remove-AzNatGateway @nat
```

---

> [!NOTE]
> When you delete a NAT gateway, the public IP address or prefix associated with it isn't deleted.

## Add or remove a public IP address

Complete the following steps to add or remove a public IP address from a NAT gateway.

# [**Azure portal**](#tab/manage-nat-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the Azure portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

1. Select **Create**.

1. Enter the following information in **Create public IP address**.

   | Setting | Value |
   | ------- | ----- |
   | Subscription | Select your subscription. |
   | Resource group | Select your resource group. The example uses **test-rg**. |
   | Region | Select a region. This example uses **East US 2**. |
   | Name | Enter **public-ip-nat2**. |
   | IP version | Select **IPv4**. |
   | SKU | Select **Standard V2**. |
   | Availability zone | Select the default of **Zone-redundant**. |
   | Tier | Select **Regional**. |

1. Select **Review + create** and then select **Create**.

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **nat-gateway**.

1. Under **Settings**, select **Outbound IP**.

1. The IP addresses and prefixes associated with the NAT gateway are displayed. Select the IP address you want to remove and select **Remove**.

1. To add a public IP address, select **Edit**.

1. Select the public IP address that you created to add it to the NAT gateway.

1. Select **OK**.

1. Select **Save**.

# [**PowerShell**](#tab/manage-nat-powershell)

### Add public IP address

To add a public IP address to the NAT gateway, add it to an array object along with the current IP addresses. The PowerShell cmdlets replace all the addresses.

In this example, the existing IP address associated with the NAT gateway is named **public-ip-nat**. Replace this value with an array that contains both **public-ip-nat** and a new IP address. If you have multiple IP addresses already configured, you must also add them to the array.

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a new IP address for the NAT gateway.

```azurepowershell
## Create public IP address for NAT gateway ##
$ip = @{
    Name = 'public-ip-nat2'
    ResourceGroupName = 'test-rg'
    Location = 'eastus'
    Sku = 'StandardV2'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
New-AzPublicIpAddress @ip
```

Use [Set-AzNatGateway](/powershell/module/az.network/set-aznatgateway) to add the public IP address to the NAT gateway.

```azurepowershell
## Place NAT gateway into a variable. ##
$ng = @{
    Name = 'nat-gateway'
    ResourceGroupName = 'test-rg'
}
$nat = Get-AzNatGateway @ng

## Place the existing public IP address associated with the NAT gateway into a variable. ##
$ip = @{
    Name = 'public-ip-nat'
    ResourceGroupName = 'test-rg'
}
$publicIPIPv4-1 = Get-AzPublicIPaddress @ip

## Place the public IP address you created previously into a variable. ##
$ip = @{
    Name = 'public-ip-nat2'
    ResourceGroupName = 'test-rg'
}
$publicIPIPv4-2 = Get-AzPublicIPaddress @ip

## Place the public IP address variables into an array. ##
$pipArray = $publicIIPv4-1,$publicIIPv4-2

## Add the IP address to the NAT gateway. ##
$nt = @{
    NatGateway = $nat
    PublicIpAddress = $pipArray
}
Set-AzNatGateway @nt
```

### Remove public IP address

To remove a public IP from a NAT gateway, create an array object that **doesn't** contain the IP address you want to remove. For example, you have a NAT gateway configured with two public IP addresses. You want to remove one of the IP addresses. The IP addresses associated with the NAT gateway are named public-ip-nat and public-ip-nat2. To remove public-ip-nat2, create an array object for the PowerShell command that contains **only** public-ip-nat. When you apply the command, the array is reapplied to the NAT gateway, and public-ip-nat is the only associated public IP address.

Use [Set-AzNatGateway](/powershell/module/az.network/set-aznatgateway) to remove a public IP address from the NAT gateway.

```azurepowershell
## Place NAT gateway into a variable. ##
$ng = @{
    Name = 'nat-gateway'
    ResourceGroupName = 'test-rg'
}
$nat = Get-AzNatGateway @ng

## Place the existing public IP address associated with the NAT gateway into a variable. ##
$ip = @{
    Name = 'public-ip-nat'
    ResourceGroupName = 'test-rg'
}
$publicIPIPv4-1 = Get-AzPublicIPaddress @ip

## Place the second public IP address into a variable. ##
$ip = @{
    Name = 'public-ip-nat2'
    ResourceGroupName = 'test-rg'
}
$publicIPIPv4-2 = Get-AzPublicIPAddress @ip

## Place ONLY the public IP you wish to keep in the array. ##
$pipArray = $publicIPIPv4-1

## Add the public IP address to the NAT gateway. ##
$nt = @{
    NatGateway = $nat
    PublicIpAddress = $pipArray
}
Set-AzNatGateway @nt
```

---

## Add or remove a public IP prefix

Complete the following steps to add or remove a public IP prefix from a NAT gateway.

# [**Azure portal**](#tab/manage-nat-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the Azure portal, enter **Public IP prefix**. Select **Public IP Prefixes** in the search results.

1. Select **Create**.

1. Enter the following information in the **Basics** tab of **Create a public IP prefix**.

   | Setting | Value |
   | ------- | ----- |
   | **Project details** |  |
   | Subscription | Select your subscription. |
   | Resource group | Select your resource group. This example uses **test-rg**. |
   | **Instance details** |   |
   | Name | Enter **public-ip-prefix-nat**. |
   | Region | Select your region. This example uses **East US 2**. |
   | Sku | Select **Standard V2**. |
   | IP version | Select **IPv4**. |
   | Prefix ownership | Select **Microsoft owned**. |
   | Prefix size | Select a prefix size. This example uses **/28 (16 addresses)**. |

1. Select **Review + create**, then select **Create**.

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **nat-gateway**.

1. Under **Settings**, select **Outbound IP**.

1. The page displays the IP addresses and prefixes associated with the NAT gateway. Select the prefix you want to remove and select **Remove**.

1. To add a public IP prefix, select **Edit**. Select the public IP prefix that you created to add it to the NAT gateway.

1. Select **OK**.

1. Select **Save**.

# [**Azure PowerShell**](#tab/manage-nat-powershell)

### Add public IP prefix

To add a public IP prefix to the NAT gateway, add it to an array object along with the current IP prefixes. The PowerShell cmdlets replace all the IP prefixes.

In this example, the existing public IP prefix associated with the NAT gateway is named **public-ip-prefix-nat**. Replace this value with an array that contains both **public-ip-prefix-nat** and a new IP address prefix. If you have multiple IP prefixes already configured, you must also add them to the array.

Use [New-AzPublicIpPrefix](/powershell/module/az.network/new-azpublicipprefix) to create a new public IP prefix for the NAT gateway.

```azurepowershell
## Create public IP prefix for NAT gateway ##
$ip = @{
    Name = 'public-ip-prefix-nat2'
    ResourceGroupName = 'test-rg'
    Location = 'eastus2'
    Sku = 'StandardV2'
    PrefixLength = '29'
    Zone = 1,2,3
    IpAddressVersion = 'IPv4'
}
New-AzPublicIpPrefix @ip
```

Use [Set-AzNatGateway](/powershell/module/az.network/set-aznatgateway) to add the public IP prefix to the NAT gateway.

```azurepowershell
## Place NAT gateway into a variable. ##
$ng = @{
    Name = 'nat-gateway'
    ResourceGroupName = 'test-rg'
}
$nat = Get-AzNatGateway @ng

## Place the existing public IP prefix associated with the NAT gateway into a variable. ##
$ip = @{
    Name = 'public-ip-prefix-nat'
    ResourceGroupName = 'test-rg'
}
$publicIPIPv4prefix-1 = Get-AzPublicIPPrefix @ip

## Place the public IP prefix you created previously into a variable. ##
$ip = @{
    Name = 'public-ip-prefix-nat2'
    ResourceGroupName = 'test-rg'
}
$publicIPIPv4prefix-2 = Get-AzPublicIPprefix @ip

## Place the public IP address variables into an array. ##
$preArray = $publicIPIPv4prefix-1,$publicIPIPv4prefix-2

## Add the IP address prefix to the NAT gateway. ##
$nt = @{
    NatGateway = $nat
    PublicIpPrefix = $preArray
}
Set-AzNatGateway @nt
```

### Remove public IP prefix

To remove a public IP prefix from a NAT gateway, create an array object that **doesn't** contain the IP address prefix that you want to remove. For example, you have a NAT gateway configured with two public IP prefixes. You want to remove one of the IP prefixes. The IP prefixes associated with the NAT gateway are named public-ip-prefix-nat and public-ip-prefix-nat2. To remove public-ip-prefix-nat2, create an array object for the PowerShell command that contains **only** public-ip-prefix-nat. When you apply the command, the array is reapplied to the NAT gateway, and public-ip-prefix-nat is the only prefix associated.

Use the [Set-AzNatGateway](/powershell/module/az.network/set-aznatgateway) cmdlet to remove a public IP prefix from the NAT gateway.

```azurepowershell
## Place NAT gateway into a variable. ##
$ng = @{
    Name = 'nat-gateway'
    ResourceGroupName = 'test-rg'
}
$nat = Get-AzNatGateway @ng

## Place the existing public IP prefix associated with the NAT gateway into a variable. ##
$ip = @{
    Name = 'public-ip-prefix-nat'
    ResourceGroupName = 'test-rg'
}
$publicIPIPv4prefix-1 = Get-AzPublicIPPrefix @ip

## Place the secondary public IP prefix into a variable. ##
$ip = @{
    Name = 'public-ip-prefix-nat2'
    ResourceGroupName = 'test-rg'
}
$publicIPIPv4prefix-2 = Get-AzPublicIPrefix @ip

## Place ONLY the prefix you wish to keep in the array. DO NOT ADD THE SECONDARY VARIABLE ##
$preArray = $publicIPIPv4prefix-1

## Add the IP address prefix to the NAT gateway. ##
$nt = @{
    NatGateway = $nat
    PublicIpPrefix = $preArray
}
Set-AzNatGateway @nt
```

---

## Next steps

To learn more about Azure NAT Gateway and its capabilities, see the following articles:

- [What is Azure NAT Gateway?](nat-overview.md)
- [NAT gateway and availability zones](nat-availability-zones.md)
- [Design virtual networks with NAT gateway](nat-gateway-resource.md)
