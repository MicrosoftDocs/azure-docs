---
title: 'Integrate NAT Gateway with Azure Firewall in Hub and Spoke Network'
titleSuffix: Azure NAT Gateway
description: Learn to integrate NAT gateway with Azure Firewall in a hub and spoke network for scalable outbound connectivity. Step-by-step tutorial with Portal, PowerShell, and CLI examples.
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: tutorial
ms.date: 05/29/2025
ms.custom: template-tutorial
---

# Integrate NAT gateway with Azure Firewall in a hub and spoke network for outbound connectivity

In this tutorial, you learn how to integrate a NAT gateway with Azure Firewall in a hub and spoke network for enhanced outbound connectivity and scalability.

Azure Firewall provides [2,496 SNAT ports per public IP address](../firewall/integrate-with-nat-gateway.md) configured per backend Virtual Machine Scale Set instance (minimum of two instances). You can associate up to 250 public IP addresses to Azure Firewall. Depending on your architecture requirements and traffic patterns, you might require more SNAT ports than what Azure Firewall can provide. You might also require the use of fewer public IPs while also requiring more SNAT ports. A better method for outbound connectivity is to use NAT gateway. NAT gateway provides 64,512 SNAT ports per public IP address and can be used with up to 16 public IP addresses. 

NAT gateway can be integrated with Azure Firewall by configuring NAT gateway directly to the Azure Firewall subnet. This association provides a more scalable method of outbound connectivity. For production deployments, a hub and spoke network is recommended, where the firewall is in its own virtual network. The workload servers are peered virtual networks in the same region as the hub virtual network where the firewall resides. In this architectural setup, NAT gateway can provide outbound connectivity from the hub virtual network for all spoke virtual networks peered.

:::image type="content" source="./media/tutorial-hub-spoke-nat-firewall/resources-diagram.png" alt-text="Diagram of Azure resources created in tutorial." lightbox="./media/tutorial-hub-spoke-nat-firewall/resources-diagram.png":::

>[!NOTE]
>Azure NAT Gateway isn't currently supported in secured virtual hub network (vWAN) architectures. You must deploy using a hub virtual network architecture as described in this tutorial. For more information about Azure Firewall architecture options, see [What are the Azure Firewall Manager architecture options?](/azure/firewall-manager/vhubs-and-vnets).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a hub virtual network and deploy an Azure Firewall and Azure Bastion during deployment
> * Create a NAT gateway and associate it with the firewall subnet in the hub virtual network
> * Create a spoke virtual network
> * Create a virtual network peering
> * Create a route table for the spoke virtual network
> * Create a firewall policy for the hub virtual network
> * Create a virtual machine to test the outbound connectivity through the NAT gateway

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 

### [PowerShell](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

### [CLI](#tab/cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Create the hub virtual network

The hub virtual network contains the firewall subnet that is associated with the Azure Firewall and NAT gateway. Use the following example to create the hub virtual network.

### [Portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**.</br> Enter **test-rg**.</br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **vnet-hub**. |
    | Region | Select **(US) South Central US**. |

1. Select **Next** to proceed to the **Security** tab.

1. Select **Enable Azure Bastion** in the **Azure Bastion** section of the **Security** tab.

    Azure Bastion uses your browser to connect to VMs in your virtual network over secure shell (SSH) or remote desktop protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](/azure/bastion/bastion-overview)

    >[!NOTE]
    >[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

1. Enter or select the following information in **Azure Bastion**:

    | Setting | Value |
    |---|---|
    | Azure Bastion host name | Enter **bastion**. |
    | Azure Bastion public IP address | Select **Create a public IP address**.</br> Enter **public-ip-bastion** in Name.</br> Select **OK**. |

1. Select **Enable Azure Firewall** in the **Azure Firewall** section of the **Security** tab.

    Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability. For more information about Azure Firewall, see [Azure Firewall](/azure/firewall/overview).

1. Enter or select the following information in **Azure Firewall**:

    | Setting | Value |
    |---|---|
    | Azure Firewall name | Enter **firewall**. |
    | Tier | Select **Standard**. |
    | Policy | Select **Create new**.</br> Enter **firewall-policy** in Name.</br> Select **OK**. |
    | Azure Firewall public IP address | Select **Create a public IP address**.</br> Enter **public-ip-firewall** in Name.</br> Select **OK**. |

1. Select **Next** to proceed to the **IP addresses** tab.

16. Select **Review + create**.

17. Select **Create**.

It takes a few minutes for the bastion host and firewall to deploy. When the virtual network is created as part of the deployment, you can proceed to the next steps.

### [PowerShell](#tab/powershell)

Use [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) to create a resource group.

```azurepowershell
# Create resource group
$rgParams = @{
    Name = 'test-rg'
    Location = 'South Central US'
}
New-AzResourceGroup @rgParams
```

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the hub virtual network.

```azurepowershell
# Create hub virtual network
$vnetParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'vnet-hub'
    AddressPrefix = '10.0.0.0/16'
}
$hubVnet = New-AzVirtualNetwork @vnetParams
```

Use [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) to create a subnet for Azure Firewall and Azure Bastion.

```azurepowershell
# Create default subnet
$subnetParams = @{
    Name = 'subnet-1'
    AddressPrefix = '10.0.0.0/24'
    VirtualNetwork = $hubVnet
}
Add-AzVirtualNetworkSubnetConfig @subnetParams

# Create subnet for Azure Firewall
$subnetParams = @{
    Name = 'AzureFirewallSubnet'
    AddressPrefix  = '10.0.1.64/26'
    VirtualNetwork = $hubVnet
}
Add-AzVirtualNetworkSubnetConfig @subnetParams

# Create subnet for Azure Bastion
$subnetParams = @{
    Name = 'AzureBastionSubnet'
    AddressPrefix  = '10.0.1.0/26'
    VirtualNetwork = $hubVnet
}
Add-AzVirtualNetworkSubnetConfig @subnetParams
```

Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to update the virtual network.

```azurepowershell
# Create the virtual network
$hubVnet | Set-AzVirtualNetwork
```

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP for Azure Bastion.

```azurepowershell
# Create public IP for Azure Bastion
$publicIpBastionParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'public-ip-bastion'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    Zone = 1, 2, 3
}
$publicIpBastion = New-AzPublicIpAddress @publicIpBastionParams
```

Use [New-AzBastion](/powershell/module/az.network/new-azbastion) to create Azure Bastion.

```azurepowershell
# Create Azure Bastion
$bastionParams = @{
    ResourceGroupName = "test-rg"
    Name = "bastion"
    VirtualNetworkName = "vnet-hub"
    PublicIpAddressName = "public-ip-bastion"
    PublicIPAddressRgName = "test-rg"
    VirtualNetworkRgName = "test-rg"
}
New-AzBastion @bastionParams
```

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP for Azure Firewall.

```azurepowershell
# Create public IP for Azure Firewall
$publicIpFirewallParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'public-ip-firewall'
    AllocationMethod  = 'Static'
    Sku = 'Standard'
    Zone = 1, 2, 3
}
$publicIpFirewall = New-AzPublicIpAddress @publicIpFirewallParams
```

Use [New-AzFirewallPolicy](/powershell/module/az.network/new-azfirewallpolicy) to create a firewall policy.

```azurepowershell
# Create firewall policy
$firewallPolicyParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'firewall-policy'
}
$firewallPolicy = New-AzFirewallPolicy @firewallPolicyParams
```

Use [New-AzFirewall](/powershell/module/az.network/new-azfirewall) to create Azure Firewall.

```azurepowershell
# Create Azure Firewall
    $firewallParams = @{
        ResourceGroupName = 'test-rg'
        Location = 'South Central US'
        Name = 'firewall'
        VirtualNetworkName = 'vnet-hub'
        PublicIpName = 'public-ip-firewall'
        FirewallPolicyId = $firewallPolicy.Id
    }
    $firewall = New-AzFirewall @firewallParams
```

### [CLI](#tab/cli)

Use [az group create](/cli/azure/group#az_group_create) to create a resource group.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
LOCATION="southcentralus"

az group create \
	--name $RESOURCE_GROUP \
	--location $LOCATION
```

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create the hub virtual network.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
VNET_HUB_NAME="vnet-hub"
VNET_HUB_ADDRESS_PREFIX="10.0.0.0/16"
SUBNET_1_NAME="subnet-1"
SUBNET_1_PREFIX="10.0.0.0/24"

az network vnet create \
	--resource-group $RESOURCE_GROUP \
	--name $VNET_HUB_NAME \
	--address-prefix $VNET_HUB_ADDRESS_PREFIX \
	--subnet-name $SUBNET_1_NAME \
	--subnet-prefix $SUBNET_1_PREFIX
```

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create a subnet for Azure Bastion.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
VNET_HUB_NAME="vnet-hub"
BASTION_SUBNET_NAME="AzureBastionSubnet"
BASTION_SUBNET_PREFIX="10.0.1.0/26"

az network vnet subnet create \
	--resource-group $RESOURCE_GROUP \
	--vnet-name $VNET_HUB_NAME \
	--name $BASTION_SUBNET_NAME \
	--address-prefix $BASTION_SUBNET_PREFIX
```

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create a subnet for Azure Firewall.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
VNET_HUB_NAME="vnet-hub"
FIREWALL_SUBNET_NAME="AzureFirewallSubnet"
FIREWALL_SUBNET_PREFIX="10.0.1.64/26"

az network vnet subnet create \
	--resource-group $RESOURCE_GROUP \
	--vnet-name $VNET_HUB_NAME \
	--name $FIREWALL_SUBNET_NAME \
	--address-prefix $FIREWALL_SUBNET_PREFIX
```

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP for Azure Bastion.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
BASTION_PUBLIC_IP_NAME="public-ip-bastion"
ALLOCATION_METHOD="Static"
SKU="Standard"

az network public-ip create \
	--resource-group $RESOURCE_GROUP \
	--name $BASTION_PUBLIC_IP_NAME \
	--allocation-method $ALLOCATION_METHOD \
	--sku $SKU
```

Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create Azure Bastion.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
BASTION_NAME="bastion"
BASTION_PUBLIC_IP_NAME="public-ip-bastion"
VNET_HUB_NAME="vnet-hub"

az network bastion create \
	--resource-group $RESOURCE_GROUP \
	--name $BASTION_NAME \
	--public-ip-address $BASTION_PUBLIC_IP_NAME \
	--vnet-name $VNET_HUB_NAME
```

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP for Azure Firewall.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
FIREWALL_PUBLIC_IP_NAME="public-ip-firewall"
ALLOCATION_METHOD="Static"
SKU="Standard"

az network public-ip create \
	--resource-group $RESOURCE_GROUP \
	--name $FIREWALL_PUBLIC_IP_NAME \
	--allocation-method $ALLOCATION_METHOD \
	--sku $SKU
```

Use [az network firewall policy create](/cli/azure/network/firewall/policy#az-network-firewall-policy-create) to create a firewall policy.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
FIREWALL_POLICY_NAME="firewall-policy"

az network firewall policy create \
	--resource-group $RESOURCE_GROUP \
	--name $FIREWALL_POLICY_NAME
```

Use [az network firewall create](/cli/azure/network/firewall#az-network-firewall-create) to create Azure Firewall.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
FIREWALL_NAME="firewall"
VNET_HUB_NAME="vnet-hub"
FIREWALL_POLICY_NAME="firewall-policy"
FIREWALL_PUBLIC_IP_NAME="public-ip-firewall"

az network firewall create \
	--resource-group $RESOURCE_GROUP \
	--name $FIREWALL_NAME \
	--vnet-name $VNET_HUB_NAME \
	--firewall-policy $FIREWALL_POLICY_NAME \
	--public-ip $FIREWALL_PUBLIC_IP_NAME
```

---

## Create the NAT gateway

All outbound internet traffic traverses the NAT gateway to the internet. Use the following example to create a NAT gateway for the hub and spoke network and associate it with the **AzureFirewallSubnet**.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

2. Select **+ Create**.

3. In the **Basics** tab of **Create network address translation (NAT) gateway** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | NAT gateway name | Enter **nat-gateway**. |
    | Region | Select **South Central US**. |
    | Availability zone | Select a **Zone** or **No zone**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |
    
    For more information about availability zones, see [NAT gateway and availability zones](nat-availability-zones.md).

5. Select **Next: Outbound IP**.

6. In **Outbound IP** in **Public IP addresses**, select **Create a new public IP address**.

7. Enter **public-ip-nat** in **Name**.

8. Select **OK**.

9. Select **Next: Subnet**.

10. In **Virtual Network** select **vnet-hub**.

11. Select **AzureFirewallSubnet** in **Subnet name**.

12. Select **Review + create**. 

13. Select **Create**.

### [PowerShell](#tab/powershell)

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP for the NAT gateway.

```azurepowershell
# Create public IP for NAT gateway
$publicIpNatParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'southcentralus'
    Name = 'public-ip-nat'
    AllocationMethod = 'Static'
    Sku = 'Standard'
}
$publicIpNat = New-AzPublicIpAddress @publicIpNatParams
```

Use [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway) to create the NAT gateway.

```azurepowershell
$natGatewayParams = @{
    ResourceGroupName = 'test-rg'
    Name = 'nat-gateway'
    PublicIpAddress = $publicIpNat
    Sku = 'Standard'
    IdleTimeoutInMinutes = 4
    Location = 'South Central US'
}
$natGateway = New-AzNatGateway @natGatewayParams
```

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to associate NAT gateway with AzureFirewallSubnet.

```azurepowershell
# Get the AzureFirewallSubnet from the hub virtual network
$subnetParams = @{
    VirtualNetwork = $hubVnet
    Name = 'AzureFirewallSubnet'
}
$subnet = Get-AzVirtualNetworkSubnetConfig @subnetParams

$subnet.NatGateway = $natGateway

# Associate NAT gateway with AzureFirewallSubnet
$subnetParams = @{
    VirtualNetwork = $hubVnet
    Name = 'AzureFirewallSubnet'
    AddressPrefix = '10.0.1.64/26'
    NatGateway = $natGateway
}
Set-AzVirtualNetworkSubnetConfig @subnetParams
```

Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to update the virtual network.

```azurepowershell
# Update the virtual network
$hubVnet | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP for NAT gateway.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
NAT_PUBLIC_IP_NAME="public-ip-nat"
ALLOCATION_METHOD="Static"
SKU="Standard"

az network public-ip create \
	--resource-group $RESOURCE_GROUP \
	--name $NAT_PUBLIC_IP_NAME \
	--allocation-method $ALLOCATION_METHOD \
	--sku $SKU
```

Use [az network nat gateway create](/cli/azure/network/nat/gateway#az-network-nat-gateway-create) to create a NAT gateway.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
NAT_GATEWAY_NAME="nat-gateway"
NAT_PUBLIC_IP_NAME="public-ip-nat"
IDLE_TIMEOUT="4"

az network nat gateway create \
	--resource-group $RESOURCE_GROUP \
	--name $NAT_GATEWAY_NAME \
	--public-ip-address $NAT_PUBLIC_IP_NAME \
	--idle-timeout $IDLE_TIMEOUT
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to associate NAT gateway with AzureFirewallSubnet.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
VNET_HUB_NAME="vnet-hub"
FIREWALL_SUBNET_NAME="AzureFirewallSubnet"
NAT_GATEWAY_NAME="nat-gateway"

az network vnet subnet update \
	--resource-group $RESOURCE_GROUP \
	--vnet-name $VNET_HUB_NAME \
	--name $FIREWALL_SUBNET_NAME \
	--nat-gateway $NAT_GATEWAY_NAME
```

---

## Create spoke virtual network

The spoke virtual network contains the test virtual machine used to test the routing of the internet traffic to the NAT gateway. Use the following example to create the spoke network.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Name | Enter **vnet-spoke**. |
    | Region | Select **South Central US**. |

1. Select **Next** to proceed to the **Security** tab.

1. Select **Next** to proceed to the **IP addresses** tab.

1. In the **IP Addresses** tab in **IPv4 address space**, select **Delete address space** to delete the address space that is auto populated.

1. Select **+ Add IPv4 address space**.

1. In **IPv4 address space** enter **10.1.0.0**. Leave the default of **/16 (65,536 addresses)** in the mask selection.

1. Select **+ Add a subnet**.

1. In **Add a subnet** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet purpose | Leave the default **Default**. |
    | Name | Enter **subnet-private**. |
    | **IPv4** |   |
    | IPv4 address range| Leave the default of **10.1.0.0/16**. |
    | Starting address | Leave the default of **10.1.0.0**. |
    | Size | Leave the default of **/24(256 addresses)**. |

1. Select **Add**.

1. Select **Review + create**.

1. Select **Create**.

### [PowerShell](#tab/powershell)

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the spoke virtual network.

```azurepowershell
# Create spoke virtual network
$vnetParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'vnet-spoke'
    AddressPrefix = '10.1.0.0/16'
}
$spokeVnet = New-AzVirtualNetwork @vnetParams
```

Use [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) to create a subnet for the spoke virtual network.

```azurepowershell
# Create subnet in spoke virtual network
$subnetParams = @{
    Name = 'subnet-private'
    AddressPrefix = '10.1.0.0/24'
    VirtualNetwork = $spokeVnet
}
Add-AzVirtualNetworkSubnetConfig @subnetParams
```

Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to update the spoke virtual network.

```azurepowershell
# Create the virtual network
$spokeVnet | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create the spoke virtual network.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
VNET_SPOKE_NAME="vnet-spoke"
VNET_SPOKE_ADDRESS_PREFIX="10.1.0.0/16"
SPOKE_SUBNET_NAME="subnet-private"
SPOKE_SUBNET_PREFIX="10.1.0.0/24"

az network vnet create \
	--resource-group $RESOURCE_GROUP \
	--name $VNET_SPOKE_NAME \
	--address-prefix $VNET_SPOKE_ADDRESS_PREFIX \
	--subnet-name $SPOKE_SUBNET_NAME \
	--subnet-prefix $SPOKE_SUBNET_PREFIX
```

---

## Create peering between the hub and spoke

A virtual network peering is used to connect the hub to the spoke and the spoke to the hub. Use the following example to create a two-way network peering between the hub and spoke.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-hub**.

1. Select **Peerings** in **Settings**.

1. Select **+ Add**.

1. Enter or select the following information in **Add peering**:

    | Setting | Value |
    | ------- | ----- 
    | **Remote virtual network summary** |   |
    | Peering link name | Enter **vnet-spoke-to-vnet-hub**. |
    | Virtual network deployment model | Leave the default of **Resource manager**. |
    | Subscription | Select your subscription. |
    | Virtual network | Select **vnet-spoke (test-rg)**. |
    | **Remote virtual network peering settings** |   |
    | Allow 'vnet-spoke' to access 'vnet-hub' | Leave the default of **Selected**. |
    | Allow 'vnet-spoke' to receive forwarded traffic from 'vnet-hub' | Select the checkbox. |
    | Allow gateway or route server in 'vnet-spoke' to forward traffic to 'vnet-hub' | Leave the default of **Unselected**. |
    | Enable 'vnet-spoke' to use 'vnet-hub's' remote gateway or route server | Leave the default of **Unselected**. |
    | **Local virtual network summary** |   |
    | Peering link name | Enter **vnet-hub-to-vnet-spoke**. |
    | **Local virtual network peering settings** |   |
    | Allow 'vnet-hub' to access 'vnet-spoke' | Leave the default of **Selected**. |
    | Allow 'vnet-hub' to receive forwarded traffic from 'vnet-spoke' | Select the checkbox. |
    | Allow gateway or route server in 'vnet-hub' to forward traffic to 'vnet-spoke' | Leave the default of **Unselected**. |
    | Enable 'vnet-hub' to use 'vnet-spoke's' remote gateway or route server | Leave the default of **Unselected**. |

1. Select **Add**.

1. Select **Refresh** and verify **Peering status** is **Connected**.

### [PowerShell](#tab/powershell)

Use [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) to create a peering from the hub to the spoke.

```azurepowershell
# Create peering from hub to spoke
$peeringParams = @{
    Name = 'vnet-hub-to-vnet-spoke'
    VirtualNetwork = $hubVnet
    RemoteVirtualNetworkId = $spokeVnet.Id
    AllowForwardedTraffic = $true
}
Add-AzVirtualNetworkPeering @peeringParams
```

Use [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) to create a peering from the spoke to the hub.

```azurepowershell
# Create peering from spoke to hub
$peeringParams = @{
    Name = 'vnet-spoke-to-vnet-hub'
    VirtualNetwork = $spokeVnet
    RemoteVirtualNetworkId = $hubVnet.Id
    AllowForwardedTraffic = $true
}
Add-AzVirtualNetworkPeering @peeringParams
```

### [CLI](#tab/cli)

Use [az network vnet peering create](/cli/azure/network/vnet/peering#az-network-vnet-peering-create) to create peering from hub to spoke.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
VNET_HUB_NAME="vnet-hub"
HUB_TO_SPOKE_PEERING_NAME="vnet-hub-to-vnet-spoke"
VNET_SPOKE_NAME="vnet-spoke"

az network vnet peering create \
	--resource-group $RESOURCE_GROUP \
	--vnet-name $VNET_HUB_NAME \
	--name $HUB_TO_SPOKE_PEERING_NAME \
	--remote-vnet $VNET_SPOKE_NAME \
	--allow-forwarded-traffic
```

Use [az network vnet peering create](/cli/azure/network/vnet/peering#az-network-vnet-peering-create) to create peering from spoke to hub.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
VNET_SPOKE_NAME="vnet-spoke"
SPOKE_TO_HUB_PEERING_NAME="vnet-spoke-to-vnet-hub"
VNET_HUB_NAME="vnet-hub"

az network vnet peering create \
	--resource-group $RESOURCE_GROUP \
	--vnet-name $VNET_SPOKE_NAME \
	--name $SPOKE_TO_HUB_PEERING_NAME \
	--remote-vnet $VNET_HUB_NAME \
	--allow-forwarded-traffic
```

---

## Create spoke network route table

A route table forces all traffic leaving the spoke virtual network to the hub virtual network. The route table is configured with the private IP address of the Azure Firewall as the virtual appliance.

### Obtain private IP address of firewall

The private IP address of the firewall is needed for the route table created later in this article. Use the following example to obtain the firewall private IP address.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Firewall**. Select **Firewalls** in the search results.

2. Select **firewall**.

3. In the **Overview** of **firewall**, note the IP address in the field **Firewall private IP**. The IP address in this example is **10.0.1.68**.

### [PowerShell](#tab/powershell)

Use [Get-AzFirewall](/powershell/module/az.network/get-azfirewall) to obtain the private IP address of the firewall.

```azurepowershell
# Get the private IP address of the firewall
$firewallParams = @{
    ResourceGroupName = 'test-rg'
    Name = 'firewall'
}
$firewall = Get-AzFirewall @firewallParams
$firewall.IpConfigurations[0].PrivateIpAddress
```

### [CLI](#tab/cli)

```bash
# Get the private IP address of the firewall
az network firewall show \
	--resource-group test-rg \
	--name firewall \
	--query "ipConfigurations[0].privateIpAddress" \
	--output tsv
```

---

### Create route table

Create a route table to force all inter-spoke and internet egress traffic through the firewall in the hub virtual network.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

2. Select **+ Create**.

3. In **Create Route table** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Region | Select **South Central US**. |
    | Name | Enter **route-table-spoke**. |
    | Propagate gateway routes | Select **No**. |

4. Select **Review + create**. 

5. Select **Create**.

6. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

7. Select **route-table-spoke**.

8. In **Settings** select **Routes**.

9. Select **+ Add** in **Routes**.

10. Enter or select the following information in **Add route**:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **route-to-hub**. |
    | Destination type | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **0.0.0.0/0**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.0.1.68**. |

11. Select **Add**.

12. Select **Subnets** in **Settings**.

13. Select **+ Associate**.

14. Enter or select the following information in **Associate subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **vnet-spoke (test-rg)**. |
    | Subnet | Select **subnet-private**. |

15. Select **OK**.

### [PowerShell](#tab/powershell)

Use [New-AzRouteTable](/powershell/module/az.network/new-azroutetable) to create the route table.

```azurepowershell
# Create route table
$routeTableParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'route-table-spoke'
}
$routeTable = New-AzRouteTable @routeTableParams
```

Use [Add-AzRouteConfig](/powershell/module/az.network/add-azrouteconfig) to create a route in the route table.

```azurepowershell
# Create route
$routeConfigParams = @{
    Name = 'route-to-hub'
    AddressPrefix = '0.0.0.0/0'
    NextHopType = 'VirtualAppliance'
    NextHopIpAddress = $firewall.IpConfigurations[0].PrivateIpAddress
    RouteTable = $routeTable
}
Add-AzRouteConfig @routeConfigParams
```

Use [Set-AzRouteTable](/powershell/module/az.network/set-azroutetable) to update the route table.

```azurepowershell
# Update the route table
$routeTable | Set-AzRouteTable
```

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to associate the route table with the spoke subnet.

```azurepowershell
# Associate route table with subnet
$subnetConfigParams = @{
    VirtualNetwork = $spokeVnet
    Name = 'subnet-private'
    AddressPrefix = '10.1.0.0/24'
    RouteTable = $routeTable
}
Set-AzVirtualNetworkSubnetConfig @subnetConfigParams
```

Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to update the spoke virtual network.

```azurepowershell
# Update the virtual network
$spokeVnet | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

Use [az network route-table create](/cli/azure/network/route-table#az-network-route-table-create) to create a route table.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
ROUTE_TABLE_NAME="route-table-spoke"
LOCATION="southcentralus"

az network route-table create \
	--resource-group $RESOURCE_GROUP \
	--name $ROUTE_TABLE_NAME \
	--location $LOCATION
```

Use [az network route-table route create](/cli/azure/network/route-table/route#az-network-route-table-route-create) to create a route.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
ROUTE_TABLE_NAME="route-table-spoke"
ROUTE_NAME="route-to-hub"
ADDRESS_PREFIX="0.0.0.0/0"
NEXT_HOP_TYPE="VirtualAppliance"
NEXT_HOP_IP="10.0.1.68"

az network route-table route create \
	--resource-group $RESOURCE_GROUP \
	--route-table-name $ROUTE_TABLE_NAME \
	--name $ROUTE_NAME \
	--address-prefix $ADDRESS_PREFIX \
	--next-hop-type $NEXT_HOP_TYPE \
	--next-hop-ip-address $NEXT_HOP_IP
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to associate the route table with the subnet.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
VNET_SPOKE_NAME="vnet-spoke"
SPOKE_SUBNET_NAME="subnet-private"
ROUTE_TABLE_NAME="route-table-spoke"

az network vnet subnet update \
	--resource-group $RESOURCE_GROUP \
	--vnet-name $VNET_SPOKE_NAME \
	--name $SPOKE_SUBNET_NAME \
	--route-table $ROUTE_TABLE_NAME
```

---

## Configure firewall

Traffic from the spoke through the hub must be allowed through and firewall policy and a network rule. Use the following example to create the firewall policy and network rule.

### Configure network rule

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Firewall**. Select **Firewall Policies** in the search results.

2. Select **firewall-policy**.

3. Expand **Settings** then select **Network rules**.

4. Select **+ Add a rule collection**.

5. In **Add a rule collection** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **spoke-to-internet**. |
    | Rule collection type | Select **Network**. |
    | Priority | Enter **100**. |
    | Rule collection action | Select **Allow**. |
    | Rule collection group | Select **DefaultNetworkRuleCollectionGroup**. |
    | Rules |    |
    | Name | Enter **allow-web**. |
    | Source type | **IP Address**. |
    | Source | Enter **10.1.0.0/24**. |
    | Protocol | Select **TCP**. |
    | Destination Ports | Enter **80**,**443**. |
    | Destination Type | Select **IP Address**. |
    | Destination | Enter * |

6. Select **Add**.

### [PowerShell](#tab/powershell)

Use [Get-AzFirewallPolicy](/powershell/module/az.network/get-azfirewallpolicy) to get the existing firewall policy.

```powershell
# Get the existing firewall policy
$firewallPolicyParams = @{
    Name = 'firewall-policy'
    ResourceGroupName = 'test-rg'
}
$firewallPolicy = Get-AzFirewallPolicy @firewallPolicyParams
```

Use [New-AzFirewallPolicyNetworkRule](/powershell/module/az.network/new-azfirewallpolicynetworkrule) to create a network rule.

```powershell
# Create a network rule for web traffic
$networkRuleParams = @{
    Name = 'allow-internet'
    SourceAddress = '10.1.0.0/24'
    Protocol = 'TCP'
    DestinationAddress = '*'
    DestinationPort = '*'
}
$networkRule = New-AzFirewallPolicyNetworkRule @networkRuleParams
```

Use [New-AzFirewallPolicyFilterRuleCollection](/powershell/module/az.network/new-azfirewallpolicyfilterrulecollection) to create a rule collection for the network rule.

```powershell
# Create a rule collection for the network rule
$ruleCollectionParams = @{
    Name = 'spoke-to-internet'
    Priority = 100
    Rule = $networkRule
    ActionType = 'Allow'
}
$ruleCollection = New-AzFirewallPolicyFilterRuleCollection @ruleCollectionParams
```

Use [New-AzFirewallPolicyRuleCollectionGroup](/powershell/module/az.network/new-azfirewallpolicyrulecollectiongroup) to create a rule collection group.

```powershell
$newRuleCollectionGroupParams = @{
        Name = 'DefaultNetworkRuleCollectionGroup'
        Priority = 200
        FirewallPolicyObject = $firewallPolicy
        RuleCollection = $ruleCollection
    }
New-AzFirewallPolicyRuleCollectionGroup @newRuleCollectionGroupParams
```

### [CLI](#tab/cli)

Use [az network firewall policy rule-collection-group create](/cli/azure/network/firewall/policy/rule-collection-group#create-a-rule-collection-group) to create a rule collection group.

```azurecli
# Variables
RULE_COLLECTION_GROUP_NAME="DefaultNetworkRuleCollectionGroup"
FIREWALL_POLICY_NAME="firewall-policy"
RESOURCE_GROUP="test-rg"
PRIORITY="200"

az network firewall policy rule-collection-group create \
	--name $RULE_COLLECTION_GROUP_NAME \
	--policy-name $FIREWALL_POLICY_NAME \
	--resource-group $RESOURCE_GROUP \
	--priority $PRIORITY
```

Use [az network firewall policy rule-collection-group collection add-filter-collection](/cli/azure/network/firewall/policy/rule-collection-group/collection#add-a-filter-collection) to create a network rule collection.

```azurecli
# Variables
COLLECTION_NAME="spoke-to-internet"
ACTION="Allow"
RULE_NAME="allow-web"
RULE_TYPE="NetworkRule"
SOURCE_ADDRESSES="10.1.0.0/24"
IP_PROTOCOLS="TCP"
DESTINATION_ADDRESSES="*"
DESTINATION_PORTS="*"
COLLECTION_PRIORITY="100"
FIREWALL_POLICY_NAME="firewall-policy"
RESOURCE_GROUP="test-rg"
RULE_COLLECTION_GROUP_NAME="DefaultNetworkRuleCollectionGroup"

az network firewall policy rule-collection-group collection add-filter-collection \
	--name $COLLECTION_NAME \
	--action $ACTION \
	--rule-name $RULE_NAME \
	--rule-type $RULE_TYPE \
	--source-addresses $SOURCE_ADDRESSES \
	--ip-protocols $IP_PROTOCOLS \
	--destination-addresses $DESTINATION_ADDRESSES \
	--destination-ports $DESTINATION_PORTS \
	--collection-priority $COLLECTION_PRIORITY \
	--policy-name $FIREWALL_POLICY_NAME \
	--resource-group $RESOURCE_GROUP \
	--rule-collection-group-name $RULE_COLLECTION_GROUP_NAME
```

---

## Create test virtual machine

An Ubuntu virtual machine is used to test the outbound internet traffic through the NAT gateway. Use the following example to create an Ubuntu virtual machine.

### [Portal](#tab/portal)

1. In the portal, search for and select **Virtual machines**.

1. In **Virtual machines**, select **+ Create**, then **Azure virtual machine**.

1. On the **Basics** tab of **Create a virtual machine**, enter, or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **vm-spoke**. |
    | Region | Select **(US) South Central US**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Leave the default of **Standard**. |
    | Image | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |  |
    | Authentication type | Select **Password**. |
    | Username | Enter **azureuser**. |
    | Password | Enter a password. |
    | Confirm password | Reenter the password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select the **Networking** tab at the top of the page or select **Next:Disks**, then **Next:Networking**.

1. Enter or select the following information in the **Networking** tab:

    | Setting | Value |
    |---|---|
    | **Network interface** |  |
    | Virtual network | Select **vnet-spoke**. |
    | Subnet | Select **subnet-private (10.1.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**.</br> Enter **nsg-1** for the name.</br> Leave the rest at the defaults and select **OK**. |

1. Leave the rest of the settings at the defaults and select **Review + create**.

1. Review the settings and select **Create**.

Wait for the virtual machine to finishing deploying before proceeding to the next steps.

>[!NOTE]
>Virtual machines in a virtual network with a bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in bastion hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](../virtual-network/ip-services/remove-public-ip-address-vm.md).

### [PowerShell](#tab/powershell)

Use [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) to create the network security group.

```azurepowershell
$nsgParams = @{
    ResourceGroupName = "test-rg"
    Name = "nsg-1"
    Location = "southcentralus"
}
New-AzNetworkSecurityGroup @nsgParams
```

Use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) to create the network interface.

```azurepowershell
$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-1"
    SubnetId = (Get-AzVirtualNetwork -ResourceGroupName "test-rg" -Name "vnet-spoke").Subnets[0].Id
    NetworkSecurityGroupId = (Get-AzNetworkSecurityGroup -ResourceGroupName "test-rg" -Name "nsg-1").Id
    Location = "southcentralus"
}
New-AzNetworkInterface @nicParams
```

Use [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) to set a user name and password for the VM and store them in the `$cred` variable.

```azurepowershell
$cred = Get-Credential
```

> [!NOTE]
> A username is required for the VM. The password is optional and isn't used if set. SSH key configuration is recommended for Linux VMs.

Use [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) to define a VM.

```azurepowershell
$vmConfigParams = @{
    VMName = "vm-spoke"
    VMSize = "Standard_DS4_v2"
    }
$vmConfig = New-AzVMConfig @vmConfigParams
```

Use [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem) and [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage) to create the rest of the VM configuration. The following example creates an Ubuntu Server virtual machine:

```azurepowershell
$osParams = @{
    VM = $vmConfig
    ComputerName = "vm-spoke"
    Credential = $cred
    }
$vmConfig = Set-AzVMOperatingSystem @osParams -Linux -DisablePasswordAuthentication

$imageParams = @{
    VM = $vmConfig
    PublisherName = "Canonical"
    Offer = "ubuntu-24_04-lts"
    Skus = "server"
    Version = "latest"
    }
$vmConfig = Set-AzVMSourceImage @imageParams
```

Use [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface) to attach the NIC that you previously created to the VM.

```azurepowershell
# Get the network interface object
$nicParams = @{
    ResourceGroupName = "test-rg"
    Name = "nic-1"
    }
$nic = Get-AzNetworkInterface @nicParams

$vmConfigParams = @{
    VM = $vmConfig
    Id = $nic.Id
    }
$vmConfig = Add-AzVMNetworkInterface @vmConfigParams
```

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create the VM. The command generates SSH keys for the virtual machine for sign-in. Make note of the location of the private key. The private key is needed in later steps for connecting to the virtual machine with Azure Bastion.

```azurepowershell
$vmParams = @{
    VM = $vmConfig
    ResourceGroupName = "test-rg"
    Location = "southcentralus"
    SshKeyName = "ssh-key"
    }
New-AzVM @vmParams -GenerateSshKey
```

### [CLI](#tab/cli)

Use [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create) to create a network security group.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
NSG_NAME="nsg-1"
LOCATION="southcentralus"

az network nsg create \
	--resource-group $RESOURCE_GROUP \
	--name $NSG_NAME \
	--location $LOCATION
```

Use [az network nic create](/cli/azure/network/nic#az-network-nic-create) to create a network interface.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
NIC_NAME="vm-spoke-nic"
VNET_SPOKE_NAME="vnet-spoke"
SPOKE_SUBNET_NAME="subnet-private"
NSG_NAME="nsg-1"

az network nic create \
	--resource-group $RESOURCE_GROUP \
	--name $NIC_NAME \
	--vnet-name $VNET_SPOKE_NAME \
	--subnet $SPOKE_SUBNET_NAME \
	--network-security-group $NSG_NAME
```

Use [az vm create](/cli/azure/vm#az-vm-create) to create a virtual machine.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
VM_NAME="vm-spoke"
LOCATION="southcentralus"
NIC_NAME="vm-spoke-nic"
VM_IMAGE="Ubuntu2204"
ADMIN_USERNAME="azureuser"

az vm create \
	--resource-group $RESOURCE_GROUP \
	--name $VM_NAME \
	--location $LOCATION \
	--nics $NIC_NAME \
	--image $VM_IMAGE \
	--admin-username $ADMIN_USERNAME \
	--generate-ssh-keys
```

---

## Test NAT gateway

You connect to the Ubuntu virtual machines you created in the previous steps to verify that the outbound internet traffic is leaving the NAT gateway.

### Obtain NAT gateway public IP address

Obtain the NAT gateway public IP address for verification of the steps later in the article.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses** in the search results.

1. Select **public-ip-nat**.

1. Make note of value in **IP address**. The example used in this article is **203.0.113.0.25**.

### [PowerShell](#tab/powershell)

Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to obtain the public IP address of the NAT gateway.

```azurepowershell
# Get the public IP address of the NAT gateway
$publicIpNatParams = @{
    ResourceGroupName = 'test-rg'
    Name = 'public-ip-nat'
}
$publicIpNat = Get-AzPublicIpAddress @publicIpNatParams
$publicIpNat.IpAddress
```

### [CLI](#tab/cli)

Use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show) to obtain the public IP address of the NAT gateway.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"
NAT_PUBLIC_IP_NAME="public-ip-nat"

az network public-ip show \
	--resource-group $RESOURCE_GROUP \
	--name $NAT_PUBLIC_IP_NAME \
	--query "ipAddress" \
	--output tsv
```

---

### Test NAT gateway from spoke

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-spoke**.

1. In **Overview**, select **Connect** then **Connect via Bastion**.

1. Select **SSH** as the connection type. Upload your SSH private key file. Select **Connect**.

1. In the bash prompt, enter the following command:

    ```bash
    curl ifconfig.me
    ```

1. Verify the IP address returned by the command matches the public IP address of the NAT gateway.

    ```output
    azureuser@vm-1:~$ curl ifconfig.me
    203.0.113.0.25
    ```

1. Close the Bastion connection to **vm-spoke**.

### [Portal](#tab/portal)

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

### [PowerShell](#tab/powershell)

Use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group.

```azurepowershell
# Remove resource group
$rgParams = @{
    Name = 'test-rg'
}
Remove-AzResourceGroup @rgParams
```

### [CLI](#tab/cli)

Use [az group delete](/cli/azure/group#az_group_delete) to remove the resource group.

```azurecli
# Variables
RESOURCE_GROUP="test-rg"

az group delete \
	--name $RESOURCE_GROUP \
	--yes \
	--no-wait
```

---

## Next steps

Advance to the next article to learn how to integrate a NAT gateway with an Azure Load Balancer:
> [!div class="nextstepaction"]
> [Integrate NAT gateway with an internal load balancer](tutorial-nat-gateway-load-balancer-internal-portal.md)
