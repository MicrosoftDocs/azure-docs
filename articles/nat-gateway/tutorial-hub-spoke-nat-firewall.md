---
title: 'Integrate NAT Gateway with Azure Firewall in Hub and Spoke Network'
titleSuffix: Azure NAT Gateway
description: Learn to integrate NAT gateway with Azure Firewall in a hub and spoke network for scalable outbound connectivity. Step-by-step tutorial with Portal, PowerShell, and CLI examples.
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: tutorial
ms.date: 08/11/2026
ms.custom: template-tutorial
# Customer intent: As a network administrator, I want to integrate a NAT gateway with Azure Firewall in a hub and spoke network, so that I can ensure scalable outbound connectivity for my workloads while optimizing resource usage.
---

# Integrate NAT gateway with Azure Firewall in a hub and spoke network for outbound connectivity

In this tutorial, you learn how to integrate a NAT gateway with Azure Firewall in a hub and spoke network for enhanced outbound connectivity and scalability.

Azure Firewall provides [2,496 SNAT ports per public IP address](../firewall/integrate-with-nat-gateway.md) configured per backend Virtual Machine Scale Set instance (minimum of two instances). You can associate up to 250 public IP addresses to Azure Firewall. Depending on your architecture requirements and traffic patterns, you might require more SNAT ports than what Azure Firewall can provide. You might also require the use of fewer public IPs while also requiring more SNAT ports. A better method for outbound connectivity is to use NAT gateway. NAT gateway provides 64,512 SNAT ports per public IP address and can be used with up to 16 public IP addresses. 

NAT gateway can be integrated with Azure Firewall by configuring NAT gateway directly to the Azure Firewall subnet. This association provides a more scalable method of outbound connectivity. For production deployments, a hub and spoke network is recommended, where the firewall is in its own virtual network. The workload servers are peered virtual networks in the same region as the hub virtual network where the firewall resides. In this architectural setup, NAT gateway can provide outbound connectivity from the hub virtual network for all spoke virtual networks peered.

:::image type="content" source="./media/tutorial-hub-spoke-nat-firewall/resources-diagram.png" alt-text="Diagram of Azure resources created in tutorial." lightbox="./media/tutorial-hub-spoke-nat-firewall/resources-diagram.png":::

>[!NOTE]
> While you can deploy NAT Gateway in a hub and spoke virtual network architecture as described in this tutorial, NAT Gateway isn't supported in the hub virtual network of a vWAN architecture. To use in a vWAN architecture, NAT Gateway must be configured directly to the spoke virtual networks associated with the secured virtual hub (vWAN). For more information about Azure Firewall architecture options, see [What are the Azure Firewall Manager architecture options?](/azure/firewall-manager/vhubs-and-vnets)

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

This tutorial uses Azure Firewall Standard with IPv4 and a StandardV2 NAT gateway. Choose a region that supports StandardV2 NAT Gateway and use the same region for the firewall, NAT gateway, and virtual networks. The examples use **West US**. For unsupported regions, see [NAT Gateway SKU limitations](nat-sku.md#known-limitations).

# [Portal](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn). 

# [PowerShell](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

If you run the commands locally, [install or update to the current Azure PowerShell release](/powershell/azure/install-azure-powershell), including the **Az.Network** module, before you begin. The examples use the **StandardV2** SKU. Use [Get-Module](/powershell/module/microsoft.powershell.core/get-module) with `-ListAvailable Az.Network` to check your installed network module. Sign in with [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

---

## Create a resource group

Create a resource group to contain all resources for this quickstart.

# [**Portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal enter **Resource group**. Select **Resource groups** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create a resource group**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription|
    | Resource group | test-rg |
    | Region | **West US** |

1. Select **Review + create**.

1. Select **Create**.

# [**Powershell**](#tab/powershell)

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named **test-rg** in the **westus** location:

```azurepowershell-interactive
$rsg = @{
    Name = 'test-rg'
    Location = 'westus'
}
New-AzResourceGroup @rsg
```

---

## Create the hub virtual network

The hub virtual network contains the firewall subnet that is associated with the Azure Firewall and NAT gateway. Use the following example to create the hub virtual network.

# [**Portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the Azure portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **Create**.

1. Enter or select the following information in the **Basics** tab of **Create virtual network**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** or your resource group. |
    | **Instance details** |  |
    | Name | Enter **vnet-hub**. |
    | Region | Select your region. This example uses **West US**. |

1. Select the **IP Addresses** tab, or select **Next: Security**, then **Next: IP Addresses**.

1. In **Subnets** select the **default** subnet.

1. Enter or select the following information in **Edit subnet**.

    | Setting | Value |
    | ------- | ----- |
    | Subnet purpose | Leave the default. |
    | Name | Enter **subnet-1**. |

1. Leave the rest of the settings as default, then select **Save**.

1. Select **+ Add a subnet**.

1. In **Add a subnet** enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Subnet purpose | Select **Azure Bastion**. |

1. Leave the rest of the settings as default, then select **Add**.

1. Select **+ Add a subnet**.

1. In **Add a subnet** enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Subnet purpose | Select **Azure Firewall**. |

1. Leave the rest of the settings as default, then select **Add**.

1. Select **Review + create**, then select **Create**.

# [**PowerShell**](#tab/powershell)

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the hub virtual network.

```azurepowershell
# Create hub virtual network
$vnetParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'westus'
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

---

## Create Azure Bastion host

Azure Bastion provides secure RDP and SSH connectivity to virtual machines over TLS without requiring public IP addresses on the VMs.

# [**Portal**](#tab/portal)

1. In the search box at the top of the Azure portal, enter **Bastion**. Select **Bastions** in the search results.

1. Select **Create**.

1. Enter or select the following information in the **Basics** tab of **Create a Bastion**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** or your resource group. |
    | **Instance details** |  |
    | Name | Enter **bastion**. |
    | Region | Select your region. This example uses **West US**. |
    | Tier | Select **Basic**. |
    | Virtual network | Select **vnet-hub**. |
    | Subnet | Select **AzureBastionSubnet**. |
    | Public IP address | Create a new Standard, static public IP address named **public-ip-bastion**. |

    Bastion Basic supports connecting to the test VM in the peered spoke virtual network. Bastion Developer doesn't support connections to peered virtual networks. For more information, see [Bastion SKU comparison](../bastion/bastion-sku-comparison.md).

1. Select **Review + create**, then select **Create**.

# [**Powershell**](#tab/powershell)

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP for Azure Bastion.

```azurepowershell
# Create public IP for Azure Bastion
$publicIpBastionParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'westus'
    Name = 'public-ip-bastion'
    Sku = 'Standard'
    AllocationMethod = 'Static'
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
    Sku = "Basic"
}
New-AzBastion @bastionParams
```

---

## Create Azure Firewall

The portal steps create Azure Firewall Standard and a StandardV2 NAT gateway in the hub virtual network. The PowerShell steps create the firewall first and configure the NAT gateway in the next section.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Firewall**. Select **Firewalls** in the search results.

1. Select **+ Create**.

1. On the **Basics** tab of **Create a firewall**, use the following table to configure the firewall:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Name | Enter **firewall**. |
    | Region | Select **West US**. |
    | Firewall SKU | Select **Standard**. |
    | Firewall management | Select **Use a Firewall Policy to manage this firewall**. |
    | Firewall policy | Select **Add new**.</br>Name: Enter **firewall-policy**.</br>Region: Select **West US**.</br>Policy tier: **Standard**.</br>Select **OK**. |
    | **Choose a virtual network** |   |
    | Virtual network | Select **Use existing**. |
    | Virtual network | Select **vnet-hub**. |
    | **Public IP address** |   |
    | Public IP address | Select **Add new**.</br>Name: Enter **public-ip-firewall**.</br>SKU: **Standard**.</br>Assignment: **Static**.</br>Select **OK**. |

1. Clear **Enable Firewall Management NIC** for this tutorial, and then select **Next: Advanced**.

1. On the **Advanced** tab, select **Enable NAT gateway**. Under **StandardV2 NAT gateway**, select **Create new**.

    NAT Gateway is optional when you create a firewall. This tutorial enables it to provide outbound SNAT through the NAT gateway's public IP address. In a region that doesn't support StandardV2 NAT Gateway, the form displays a validation error. Choose a supported region on **Basics** to continue with this tutorial.

1. In **Create a new StandardV2 NAT Gateway**, enter **nat-gateway** for **Name**.

1. Under **Public IPv4 addresses**, select **Create a public IP address**. Enter **public-ip-nat** for **Name**.
1. Confirm that **SKU** is **StandardV2** and **Assignment** is **Static**, and then select **OK**.

1. Confirm that **(New) public-ip-nat** is selected under **Public IPv4 addresses**. Leave the IPv6 address and public IP prefix fields unselected for this IPv4 tutorial.

    :::image type="content" source="media/tutorial-hub-spoke-nat-firewall/create-nat-gateway.png" alt-text="Screenshot showing nat-gateway configured with the new public-ip-nat IPv4 address." lightbox="media/tutorial-hub-spoke-nat-firewall/create-nat-gateway.png":::

1. Select **Add**. On **Advanced**, confirm that **Enable NAT gateway** is selected and **StandardV2 NAT gateway** shows **(New) nat-gateway**.

    :::image type="content" source="media/tutorial-hub-spoke-nat-firewall/firewall-advanced-nat-gateway.png" alt-text="Screenshot showing the Advanced tab with NAT Gateway enabled and the new nat-gateway selected." lightbox="media/tutorial-hub-spoke-nat-firewall/firewall-advanced-nat-gateway.png":::

1. Select **Review + create**. Confirm the summary shows **West US**, the **Standard** firewall SKU, **vnet-hub**, **public-ip-firewall**, and the new **StandardV2 NAT gateway**.

1. Select **Create**.

    The deployment creates the firewall, NAT gateway, and their public IP addresses. It also associates the NAT gateway with **AzureFirewallSubnet**. Deployment takes a few minutes.

    Keep the firewall's own public IP address. Outbound SNAT uses the NAT gateway public IP, while inbound DNAT uses the firewall public IP. Workload routes still point to the firewall's private IP address.

1. After deployment completes, go to the **test-rg** resource group, and select the **firewall** resource.

1. Note the firewall private and public IP addresses. You use these addresses later.

# [**PowerShell**](#tab/powershell)

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP for Azure Firewall.

```azurepowershell
# Create public IP for Azure Firewall
$publicIpFirewallParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'westus'
    Name = 'public-ip-firewall'
    AllocationMethod  = 'Static'
    Sku = 'Standard'
}
$publicIpFirewall = New-AzPublicIpAddress @publicIpFirewallParams
```

Use [New-AzFirewallPolicy](/powershell/module/az.network/new-azfirewallpolicy) to create a firewall policy.

```azurepowershell
# Create firewall policy
$firewallPolicyParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'westus'
    Name = 'firewall-policy'
}
$firewallPolicy = New-AzFirewallPolicy @firewallPolicyParams
```

Use [New-AzFirewall](/powershell/module/az.network/new-azfirewall) to create Azure Firewall.

```azurepowershell
# Create Azure Firewall
    $firewallParams = @{
        ResourceGroupName = 'test-rg'
        Location = 'westus'
        Name = 'firewall'
        VirtualNetworkName = 'vnet-hub'
        PublicIpName = 'public-ip-firewall'
        FirewallPolicyId = $firewallPolicy.Id
    }
    $firewall = New-AzFirewall @firewallParams
```

---

## Create the NAT gateway

Associate the NAT gateway with **AzureFirewallSubnet** so outbound internet traffic from the firewall uses it. If you followed the portal steps, the firewall deployment created this association. If you're using PowerShell, create and associate the NAT gateway in this section.

# [**Portal**](#tab/portal)

Don't create another NAT gateway. Verify the resources and association created in the preceding section:

1. Open **test-rg**, and select **nat-gateway**. Confirm that its SKU is **StandardV2** and its location matches the firewall.
1. Open **vnet-hub**, select **Subnets**, and select **AzureFirewallSubnet**.
1. Confirm that **NAT gateway** is set to **nat-gateway**. Leave the subnet settings unchanged.
1. Open **public-ip-nat** and confirm that it uses the **StandardV2** SKU. This address is separate from **public-ip-firewall**, which uses the **Standard** SKU.

# [**PowerShell**](#tab/powershell)

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a zone redundant IPv4 public IP address for the NAT gateway.

```azurepowershell
## Create public IP address for NAT gateway ##
$ip = @{
    Name = 'public-ip-nat'
    ResourceGroupName = 'test-rg'
    Location = 'westus'
    Sku = 'StandardV2'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
$publicIPIPv4 = New-AzPublicIpAddress @ip
```

> [!NOTE]
> A Standard V2 Public IP address can only be associated with a Standard V2 NAT Gateway and not any other services.

Use [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway) to create the NAT gateway resource.

A StandardV2 NAT Gateway is zone redundant by default. Omit the optional `Zone` parameter rather than assigning this gateway to a single zone.

```azurepowershell
## Create NAT gateway resource ##
$nat = @{
    ResourceGroupName = 'test-rg'
    Name = 'nat-gateway'
    IdleTimeoutInMinutes = '4'
    Sku = 'StandardV2'
    Location = 'westus'
    PublicIpAddress = $publicIPIPv4
}
$natGateway = New-AzNatGateway @nat
```

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to associate NAT gateway with AzureFirewallSubnet.

```azurepowershell
# Get the hub virtual network
$vnetHub = Get-AzVirtualNetwork -ResourceGroupName 'test-rg' -Name 'vnet-hub'

# Associate NAT gateway with AzureFirewallSubnet
$subnetParams = @{
    VirtualNetwork = $vnetHub
    Name = 'AzureFirewallSubnet'
    AddressPrefix = '10.0.1.64/26'
    NatGateway = $natGateway
}
Set-AzVirtualNetworkSubnetConfig @subnetParams

# Update the virtual network
$vnetHub | Set-AzVirtualNetwork
```

---

## Create spoke virtual network

The spoke virtual network contains the test virtual machine used to test the routing of the internet traffic to the NAT gateway. Use the following example to create the spoke network.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Name | Enter **vnet-spoke**. |
    | Region | Select **West US**. |

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

# [**PowerShell**](#tab/powershell)

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the spoke virtual network.

```azurepowershell
# Create spoke virtual network
$vnetParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'westus'
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

---

## Create peering between the hub and spoke

A virtual network peering is used to connect the hub to the spoke and the spoke to the hub. Use the following example to create a two-way network peering between the hub and spoke.

# [**Portal**](#tab/portal)

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

# [**PowerShell**](#tab/powershell)

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

---

## Create spoke network route table

The route table sends traffic matching the default route from the spoke subnet to Azure Firewall in the hub virtual network. The next hop is the firewall's private IP address.

### Obtain private IP address of firewall

The private IP address of the firewall is needed for the route table created later in this article. Use the following example to obtain the firewall private IP address.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Firewall**. Select **Firewalls** in the search results.

1. Select **firewall**.

1. In the **Overview** of **firewall**, note the IP address in the field **Firewall private IP**. The IP address in this example is **10.0.1.68**.

# [**PowerShell**](#tab/powershell)

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

---

### Create route table

Create a default route for outbound internet traffic through the firewall. This route doesn't override more-specific routes, such as virtual network peering routes. You need to add more routes if you extend this topology to inspect traffic between spokes.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **+ Create**.

1. In **Create Route table** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Region | Select **West US**. |
    | Name | Enter **route-table-spoke**. |
    | Propagate gateway routes | Select **No**. |

1. Select **Review + create**. 

1. Select **Create**.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **route-table-spoke**.

1. In **Settings** select **Routes**.

1. Select **+ Add** in **Routes**.

1. Enter or select the following information in **Add route**:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **route-to-hub**. |
    | Destination type | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **0.0.0.0/0**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter the firewall's private IP address that you recorded earlier. Don't use the NAT gateway's public IP address. |

1. Select **Add**.

1. Select **Subnets** in **Settings**.

1. Select **+ Associate**.

1. Enter or select the following information in **Associate subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **vnet-spoke (test-rg)**. |
    | Subnet | Select **subnet-private**. |

1. Select **OK**.

# [**PowerShell**](#tab/powershell)

Use [New-AzRouteTable](/powershell/module/az.network/new-azroutetable) to create the route table.

```azurepowershell
# Create route table
$routeTableParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'westus'
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

---

## Configure firewall

Allow traffic from the spoke through the hub by using a network rule in the firewall policy. Use the following example to configure the network rule.

### Configure network rule

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Firewall**. Select **Firewall Policies** in the search results.

1. Select **firewall-policy**.

1. Expand **Settings** then select **Network rules**.

1. Select **+ Add a rule collection**.

1. In **Add a rule collection** enter or select the following information:

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

1. Select **Add**.

# [**PowerShell**](#tab/powershell)

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
    DestinationPort = '80', '443'
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

---

## Create test virtual machine

An Ubuntu virtual machine is used to test the outbound internet traffic through the NAT gateway. Use the following example to create an Ubuntu virtual machine.

# [**Portal**](#tab/portal)

1. In the portal, search for and select **Virtual machines**.

1. In **Virtual machines**, select **+ Create**, then **Azure virtual machine**.

1. On the **Basics** tab of **Create a virtual machine**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **vm-spoke**. |
    | Region | Select **West US**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Leave the default of **Standard**. |
    | Image | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |  |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter **azureuser**. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter **vm-spoke-key**. |
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

1. The **Generate new key pair** dialog box appears. Select **Download private key and create resource**.

The private key downloads to your local machine. You need the downloaded private key for **vm-spoke-key** when you connect to the virtual machine with Azure Bastion later in this tutorial.

Wait for the virtual machine to finish deploying before proceeding to the next steps.

>[!NOTE]
>Virtual machines in a virtual network with a bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in bastion hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](../virtual-network/ip-services/remove-public-ip-address-vm.md).

# [**PowerShell**](#tab/powershell)

Use [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) to create the network security group.

```azurepowershell
$nsgParams = @{
    ResourceGroupName = "test-rg"
    Name = "nsg-1"
    Location = "westus"
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
    Location = "westus"
}
New-AzNetworkInterface @nicParams
```

Use [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) to set a user name and password for the VM and store them in the `$cred` variable.

```azurepowershell
$cred = Get-Credential
```

> [!NOTE]
> A username is required for the VM. The password is optional and won't be used if set. SSH key configuration is recommended for Linux VMs.

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
    Location = "westus"
    SshKeyName = "vm-spoke-key"
    }
New-AzVM @vmParams -GenerateSshKey
```

---

## Test NAT gateway

You connect to the Ubuntu virtual machines you created in the previous steps to verify that the outbound internet traffic is leaving the NAT gateway.

### Obtain NAT gateway public IP address

Obtain the NAT gateway public IP address for verification of the steps later in the article.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses** in the search results.

1. Select **public-ip-nat**.

1. Make note of the value in **IP address**. The example used in this article is **203.0.113.25**.

# [**PowerShell**](#tab/powershell)

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

---

### Test NAT gateway from spoke

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-spoke**.

1. In **Overview**, select **Connect** then **Connect via Bastion**.

1. Select **SSH** as the connection type. Upload your SSH private key file. Select **Connect**.

1. In the bash prompt, enter the following command:

    ```bash
    curl -4 https://ifconfig.me/ip
    ```

1. Verify the IP address returned by the command matches the public IP address of the NAT gateway.

    ```output
    azureuser@vm-spoke:~$ curl -4 https://ifconfig.me/ip
    203.0.113.25
    ```

1. Close the Bastion connection to **vm-spoke**.

## Clean up resources

When you no longer need the resources that you created, delete the resource group and all of the resources it contains.

# [**Portal**](#tab/portal)

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

# [**PowerShell**](#tab/powershell)

Use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group.

```azurepowershell
# Remove resource group
$rgParams = @{
    Name = 'test-rg'
}
Remove-AzResourceGroup @rgParams
```

---

## Next steps

Advance to the next article to learn how to integrate a NAT gateway with an Azure Load Balancer:
> [!div class="nextstepaction"]
> [Integrate NAT gateway with an internal load balancer](tutorial-nat-gateway-load-balancer-internal-portal.md)
