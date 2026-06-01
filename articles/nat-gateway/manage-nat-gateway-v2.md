---
title: Manage a Standard V2 NAT Gateway
titleSuffix: Azure NAT Gateway
description: Learn how to create and remove a NAT gateway v2 resource from a virtual network and virtual network subnet. Add and remove public IP addresses and prefixes used for outbound connectivity.
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: how-to
ms.date: 04/08/2026
ms.custom: template-how-to, devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep, devx-track-terraform
#Customer intent: As a network administrator, I want to learn how to create and remove a NAT gateway resource from a virtual network subnet. I also want to learn how to add and remove public IP addresses and prefixes used for outbound connectivity.
---

# Manage a Standard V2 NAT gateway

Learn how to create and remove a NAT gateway resource from a virtual network subnet. A NAT gateway enables outbound connectivity for resources in an Azure Virtual Network. You can change the public IP addresses and public IP address prefixes associated with the NAT gateway changed after deployment.

This article explains how to manage the following aspects of NAT gateway:

- Create a NAT gateway and associate it with an existing subnet.

- Remove a NAT gateway from an existing subnet and delete the NAT gateway.

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

# [**Azure CLI**](#tab/manage-nat-cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An existing Azure Virtual Network and subnet. For more information, see [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

  - The example virtual network that is used in this article is named **vnet-1**.

  - The example subnet is named **subnet-1**.

  - The example NAT gateway is named **nat-gateway**.

To use Azure CLI for this article, you need:

- Azure CLI version 2.31.0 or later. Azure Cloud Shell uses the latest version.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

# [**Bicep**](#tab/manage-nat-bicep)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An existing Azure Virtual Network and subnet. For more information, see [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

  - The example virtual network that is used in this article is named **vnet-1**.

  - The example subnet is named **subnet-1**.

  - The example NAT gateway is named **nat-gateway**.

# [**Terraform**](#tab/manage-nat-terraform)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An existing Azure Virtual Network and subnet. For more information, see [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

  - The example virtual network that is used in this article is named **vnet-1**.

  - The example subnet is named **subnet-1**.

  - The example NAT gateway is named **nat-gateway**.

- [Installation and configuration of Terraform](/azure/developer/terraform/quickstart-configure).

---

## Create a NAT gateway and associate it with an existing subnet

You can create a NAT gateway resource and add it to an existing subnet by using the Azure portal, Azure PowerShell, Azure CLI, Bicep, or Terraform.

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

# [**Azure CLI**](#tab/manage-nat-cli)

### Public IP address

To create a NAT gateway with a public IP address, use the following commands.

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a StandardV2 public IP address for the NAT gateway.

```azurecli
az network public-ip create \
    --resource-group test-rg \
    --name public-ip-nat \
    --location eastus \
    --sku StandardV2 \
    --allocation-method Static \
    --version IPv4 \
    --zone 1 2 3
```

Use [az network nat gateway create](/cli/azure/network/nat/gateway#az-network-nat-gateway-create) to create a NAT gateway resource and associate the public IP address that you created.

```azurecli
az network nat gateway create \
    --resource-group test-rg \
    --name nat-gateway \
    --location eastus \
    --public-ip-addresses public-ip-nat \
    --idle-timeout 4 \
    --sku StandardV2 \
    --zone 1 2 3
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to associate the NAT gateway with your virtual network subnet.

```azurecli
az network vnet subnet update \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --name subnet-1 \
    --nat-gateway nat-gateway
```

### Public IP prefix

To create a NAT gateway with a public IP prefix, use the following commands.

Use [az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-create) to create a StandardV2 public IP prefix for the NAT gateway.

```azurecli
az network public-ip prefix create \
    --resource-group test-rg \
    --name public-ip-prefix-nat \
    --location eastus \
    --length 31 \
    --sku StandardV2 \
    --version IPv4 \
    --zone 1 2 3
```

Use [az network nat gateway create](/cli/azure/network/nat/gateway#az-network-nat-gateway-create) to create a NAT gateway resource and associate the public IP prefix that you created.

```azurecli
az network nat gateway create \
    --resource-group test-rg \
    --name nat-gateway \
    --location eastus \
    --public-ip-prefixes public-ip-prefix-nat \
    --idle-timeout 4 \
    --sku StandardV2 \
    --zone 1 2 3
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to associate the NAT gateway with your virtual network subnet.

```azurecli
az network vnet subnet update \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --name subnet-1 \
    --nat-gateway nat-gateway
```

# [**Bicep**](#tab/manage-nat-bicep)

```bicep
@description('Name of the NAT gateway')
param natGatewayName string = 'nat-gateway'

@description('Name of the NAT gateway public IP')
param publicIpName string = 'public-ip-nat'

@description('Name of resource group')
param location string = resourceGroup().location

var existingVNetName = 'vnet-1'
var existingSubnetName = 'subnet-1'

resource vnet 'Microsoft.Network/virtualNetworks@2024-05-01' existing = {
  name: existingVNetName
}

resource publicIp 'Microsoft.Network/publicIPAddresses@2024-05-01' = {
  name: publicIpName
  location: location
  sku: {
    name: 'StandardV2'
    tier: 'Regional'
  }
  zones: [
    '1'
    '2'
    '3'
  ]
  properties: {
    publicIPAddressVersion: 'IPv4'
    publicIPAllocationMethod: 'Static'
    idleTimeoutInMinutes: 4
  }
}

resource natGateway 'Microsoft.Network/natGateways@2024-05-01' = {
  name: natGatewayName
  location: location
  sku: {
    name: 'StandardV2'
  }
  zones: [
    '1'
    '2'
    '3'
  ]
  properties: {
    idleTimeoutInMinutes: 4
    publicIpAddresses: [
      {
        id: publicIp.id
      }
    ]
  }
}

resource updatedSubnet 'Microsoft.Network/virtualNetworks/subnets@2024-05-01' = {
  parent: vnet
  name: existingSubnetName
  properties: {
    addressPrefix: vnet.properties.subnets[0].properties.addressPrefix
    natGateway: {
      id: natGateway.id
    }
  }
}
```

# [**Terraform**](#tab/manage-nat-terraform)

### Public IP address

To create a NAT gateway with a public IP address, create a file named *main.tf* with the following Terraform configuration. The configuration creates a StandardV2 public IP address, a StandardV2 NAT gateway, and associates the NAT gateway with an existing subnet.

> [!NOTE]
> The `zones` argument must be omitted when `sku_name` is set to `StandardV2`. StandardV2 NAT gateways are zone-redundant by default.

```hcl
resource "azurerm_public_ip" "nat" {
  name                = "public-ip-nat"
  location            = "eastus2"
  resource_group_name = "test-rg"
  allocation_method   = "Static"
  sku                 = "StandardV2"
  sku_tier            = "Regional"
  ip_version          = "IPv4"
  zones               = ["1", "2", "3"]
}

resource "azurerm_nat_gateway" "nat" {
  name                    = "nat-gateway"
  location                = "eastus2"
  resource_group_name     = "test-rg"
  sku_name                = "StandardV2"
  idle_timeout_in_minutes = 4
}

resource "azurerm_nat_gateway_public_ip_association" "nat" {
  nat_gateway_id       = azurerm_nat_gateway.nat.id
  public_ip_address_id = azurerm_public_ip.nat.id
}

data "azurerm_subnet" "subnet" {
  name                 = "subnet-1"
  virtual_network_name = "vnet-1"
  resource_group_name  = "test-rg"
}

resource "azurerm_subnet_nat_gateway_association" "subnet" {
  subnet_id      = data.azurerm_subnet.subnet.id
  nat_gateway_id = azurerm_nat_gateway.nat.id
}
```

### Public IP prefix

To create a NAT gateway with a public IP prefix, create a file named *main.tf* with the following Terraform configuration.

```hcl
resource "azurerm_public_ip_prefix" "nat" {
  name                = "public-ip-prefix-nat"
  location            = "eastus2"
  resource_group_name = "test-rg"
  prefix_length       = 31
  sku                 = "StandardV2"
  ip_version          = "IPv4"
  zones               = ["1", "2", "3"]
}

resource "azurerm_nat_gateway" "nat" {
  name                    = "nat-gateway"
  location                = "eastus2"
  resource_group_name     = "test-rg"
  sku_name                = "StandardV2"
  idle_timeout_in_minutes = 4
}

resource "azurerm_nat_gateway_public_ip_prefix_association" "nat" {
  nat_gateway_id      = azurerm_nat_gateway.nat.id
  public_ip_prefix_id = azurerm_public_ip_prefix.nat.id
}

data "azurerm_subnet" "subnet" {
  name                 = "subnet-1"
  virtual_network_name = "vnet-1"
  resource_group_name  = "test-rg"
}

resource "azurerm_subnet_nat_gateway_association" "subnet" {
  subnet_id      = data.azurerm_subnet.subnet.id
  nat_gateway_id = azurerm_nat_gateway.nat.id
}
```

Run the following commands to deploy the configuration:

```terraform
terraform init
terraform plan
terraform apply
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

# [**Azure CLI**](#tab/manage-nat-cli)

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to remove the NAT gateway from the subnet.

```azurecli
az network vnet subnet update \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --name subnet-1 \
    --remove natGateway
```

Use [az network nat gateway delete](/cli/azure/network/nat/gateway#az-network-nat-gateway-delete) to delete the NAT gateway resource.

```azurecli
az network nat gateway delete \
    --name nat-gateway \
    --resource-group test-rg
```

# [**Bicep**](#tab/manage-nat-bicep)

Deploy the subnet without the `natGateway` property to remove the NAT gateway association.

```bicep
@description('Name of resource group')
param location string = resourceGroup().location

var existingVNetName = 'vnet-1'
var existingSubnetName = 'subnet-1'

resource vnet 'Microsoft.Network/virtualNetworks@2024-05-01' existing = {
  name: existingVNetName
}

resource updatedSubnet 'Microsoft.Network/virtualNetworks/subnets@2024-05-01' = {
  parent: vnet
  name: existingSubnetName
  properties: {
    addressPrefix: vnet.properties.subnets[0].properties.addressPrefix
  }
}
```

# [**Terraform**](#tab/manage-nat-terraform)

To remove a NAT gateway from a subnet and delete the resource, remove the `azurerm_subnet_nat_gateway_association`, `azurerm_nat_gateway`, and any associated public IP resources from your Terraform configuration, then apply the changes.

If you only want to remove the NAT gateway association from the subnet, remove the `azurerm_subnet_nat_gateway_association` resource from your configuration:

```hcl
# Remove this resource block from your configuration to disassociate the NAT gateway from the subnet
# resource "azurerm_subnet_nat_gateway_association" "subnet" {
#   subnet_id      = data.azurerm_subnet.subnet.id
#   nat_gateway_id = azurerm_nat_gateway.nat.id
# }
```

To delete the NAT gateway and all its associations, remove the NAT gateway and all association resource blocks from your configuration. Run the following commands to apply the changes:

```terraform
terraform plan
terraform apply
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

# [**Azure CLI**](#tab/manage-nat-cli)

### Add public IP address

In this example, the existing public IP address associated with the NAT gateway is named **public-ip-nat**.

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a new IP address for the NAT gateway.

```azurecli
az network public-ip create \
    --resource-group test-rg \
    --name public-ip-nat2 \
    --location eastus \
    --sku StandardV2 \
    --allocation-method Static \
    --version IPv4 \
    --zone 1 2 3
```

Use [az network nat gateway update](/cli/azure/network/nat/gateway#az-network-nat-gateway-update) to add the public IP address that you created to the NAT gateway. The Azure CLI command replaces the values. It doesn't add a new value. To add the new IP address to the NAT gateway, you must also include any other IP addresses associated to the NAT gateway.

```azurecli
az network nat gateway update \
    --name nat-gateway \
    --resource-group test-rg \
    --public-ip-addresses public-ip-nat public-ip-nat2
```

### Remove public IP address

Use [az network nat gateway update](/cli/azure/network/nat/gateway#az-network-nat-gateway-update) to remove a public IP address from the NAT gateway. The Azure CLI command replaces the values. It doesn't remove a value. To remove a public IP address, include any IP address in the command that you want to keep. Omit the value that you want to remove. For example, you have a NAT gateway configured with two public IP addresses. You want to remove one of the IP addresses. The IP addresses associated with the NAT gateway are named public-ip-nat and public-ip-nat2. To remove public-ip-nat2, omit the name of the IP address from the command. The command reapplies the IP addresses listed in the command to the NAT gateway. It removes any IP address not listed.

```azurecli
az network nat gateway update \
    --name nat-gateway \
    --resource-group test-rg \
    --public-ip-addresses public-ip-nat
```

# [**Bicep**](#tab/manage-nat-bicep)

Use the Azure portal, Azure PowerShell, or Azure CLI to add or remove a public IP address from a NAT gateway.

# [**Terraform**](#tab/manage-nat-terraform)

### Add public IP address

To add a public IP address to the NAT gateway, add a new `azurerm_public_ip` resource and a new `azurerm_nat_gateway_public_ip_association` resource to your Terraform configuration.

In this example, the existing public IP address associated with the NAT gateway is named **public-ip-nat**.

```hcl
resource "azurerm_public_ip" "nat2" {
  name                = "public-ip-nat2"
  location            = "eastus2"
  resource_group_name = "test-rg"
  allocation_method   = "Static"
  sku                 = "StandardV2"
  sku_tier            = "Regional"
  ip_version          = "IPv4"
  zones               = ["1", "2", "3"]
}

resource "azurerm_nat_gateway_public_ip_association" "nat2" {
  nat_gateway_id       = azurerm_nat_gateway.nat.id
  public_ip_address_id = azurerm_public_ip.nat2.id
}
```

### Remove public IP address

To remove a public IP address from the NAT gateway, remove the corresponding `azurerm_nat_gateway_public_ip_association` resource block from your configuration. You can also remove the `azurerm_public_ip` resource if it's no longer needed.

Run the following commands to apply the changes:

```terraform
terraform plan
terraform apply
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

# [**Azure CLI**](#tab/manage-nat-cli)

### Add public IP prefix

In this example, the existing public IP prefix associated with the NAT gateway is named **public-ip-prefix-nat**.

Use [az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-create) to create a public IP prefix for the NAT gateway.

```azurecli
az network public-ip prefix create \
    --resource-group test-rg \
    --name public-ip-prefix-nat2 \
    --location eastus \
    --length 31 \
    --sku StandardV2 \
    --version IPv4 \
    --zone 1 2 3
```

Use [az network nat gateway update](/cli/azure/network/nat/gateway#az-network-nat-gateway-update) to add the public IP prefix that you created to the NAT gateway. The Azure CLI command replaces values. It doesn't add a value. To add the new IP address prefix to the NAT gateway, you must also include any other IP prefixes associated to the NAT gateway.

```azurecli
az network nat gateway update \
    --name nat-gateway \
    --resource-group test-rg \
    --public-ip-prefixes public-ip-prefix-nat public-ip-prefix-nat2
```

### Remove public IP prefix

Use [az network nat gateway update](/cli/azure/network/nat/gateway#az-network-nat-gateway-update) to remove a public IP prefix from the NAT gateway. The Azure CLI command replaces the values. It doesn't remove a value. To remove a public IP prefix, include any prefix in the command that you wish to keep. Omit the one you want to remove. For example, you have a NAT gateway configured with two public IP prefixes. You want to remove one of the prefixes. The IP prefixes associated with the NAT gateway are named public-ip-prefix-nat and public-ip-prefix-nat2. To remove public-ip-prefix-nat2, omit the name of the IP prefix from the command. The command reapplies the IP prefixes listed in the command to the NAT gateway. It removes any IP address not listed.

```azurecli
az network nat gateway update \
    --name nat-gateway \
    --resource-group test-rg \
    --public-ip-prefixes public-ip-prefix-nat
```

# [**Bicep**](#tab/manage-nat-bicep)

Use the Azure portal, Azure PowerShell, or Azure CLI to add or remove a public IP prefix from a NAT gateway.

# [**Terraform**](#tab/manage-nat-terraform)

### Add public IP prefix

To add a public IP prefix to the NAT gateway, add a new `azurerm_public_ip_prefix` resource and a new `azurerm_nat_gateway_public_ip_prefix_association` resource to your Terraform configuration.

In this example, the existing public IP prefix associated with the NAT gateway is named **public-ip-prefix-nat**.

```hcl
resource "azurerm_public_ip_prefix" "nat2" {
  name                = "public-ip-prefix-nat2"
  location            = "eastus2"
  resource_group_name = "test-rg"
  prefix_length       = 31
  sku                 = "StandardV2"
  ip_version          = "IPv4"
  zones               = ["1", "2", "3"]
}

resource "azurerm_nat_gateway_public_ip_prefix_association" "nat2" {
  nat_gateway_id      = azurerm_nat_gateway.nat.id
  public_ip_prefix_id = azurerm_public_ip_prefix.nat2.id
}
```

### Remove public IP prefix

To remove a public IP prefix from the NAT gateway, remove the corresponding `azurerm_nat_gateway_public_ip_prefix_association` resource block from your configuration. You can also remove the `azurerm_public_ip_prefix` resource if it's no longer needed.

Run the following commands to apply the changes:

```terraform
terraform plan
terraform apply
```

---

## Next steps

To learn more about Azure NAT Gateway and its capabilities, see the following articles:

- [What is Azure NAT Gateway?](nat-overview.md)
- [Reliability in Azure NAT Gateway](/azure/reliability/reliability-nat-gateway)
- [Design virtual networks with NAT gateway](nat-gateway-resource.md)
