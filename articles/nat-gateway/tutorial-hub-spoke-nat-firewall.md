---
title: 'Tutorial: Integrate NAT gateway with Azure Firewall in a hub and spoke network'
titleSuffix: Azure NAT Gateway
description: Learn how to integrate a NAT gateway and Azure Firewall in a hub and spoke network.
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: tutorial
ms.date: 03/05/2025
ms.custom: template-tutorial
---

# Tutorial: Integrate NAT gateway with Azure Firewall in a hub and spoke network for outbound connectivity

In this tutorial, you learn how to integrate a NAT gateway with an Azure Firewall in a hub and spoke network

Azure Firewall provides [2,496 SNAT ports per public IP address](../firewall/integrate-with-nat-gateway.md) configured per backend Virtual Machine Scale Set instance (minimum of two instances). You can associate up to 250 public IP addresses to Azure Firewall. Depending on your architecture requirements and traffic patterns, you may require more SNAT ports than what Azure Firewall can provide. You may also require the use of fewer public IPs while also requiring more SNAT ports. A better method for outbound connectivity is to use NAT gateway. NAT gateway provides 64,512 SNAT ports per public IP address and can be used with up to 16 public IP addresses. 

NAT gateway can be integrated with Azure Firewall by configuring NAT gateway directly to the Azure Firewall subnet in order to provide a more scalable method of outbound connectivity. For production deployments, a hub and spoke network is recommended, where the firewall is in its own virtual network. The workload servers are peered virtual networks in the same region as the hub virtual network where the firewall resides. In this architectural setup, NAT gateway can provide outbound connectivity from the hub virtual network for all spoke virtual networks peered.

:::image type="content" source="./media/tutorial-hub-spoke-nat-firewall/resources-diagram.png" alt-text="Diagram of Azure resources created in tutorial." lightbox="./media/tutorial-hub-spoke-nat-firewall/resources-diagram.png":::

>[!NOTE]
>Azure NAT Gateway is not currently supported in secured virtual hub network (vWAN) architectures. You must deploy using a hub virtual network architecture as described in this tutorial. For more information about Azure Firewall architecture options, see [What are the Azure Firewall Manager architecture options?](/azure/firewall-manager/vhubs-and-vnets).

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

1. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **test-rg**. </br> Select **OK**. |
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
    | Azure Bastion public IP address | Select **Create a public IP address**. </br> Enter **public-ip-bastion** in Name. </br> Select **OK**. |

1. Select **Enable Azure Firewall** in the **Azure Firewall** section of the **Security** tab.

    Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability. For more information about Azure Firewall, see [Azure Firewall](/azure/firewall/overview).

1. Enter or select the following information in **Azure Firewall**:

    | Setting | Value |
    |---|---|
    | Azure Firewall name | Enter **firewall**. |
    | Tier | Select **Standard**. |
    | Policy | Select **Create new**. </br> Enter **firewall-policy** in Name. </br> Select **OK**. |
    | Azure Firewall public IP address | Select **Create a public IP address**. </br> Enter **public-ip-firewall** in Name. </br> Select **OK**. |

1. Select **Next** to proceed to the **IP addresses** tab.

16. Select **Review + create**.

17. Select **Create**.

It takes a few minutes for the bastion host and firewall to deploy. When the virtual network is created as part of the deployment, you can proceed to the next steps.

### [PowerShell](#tab/powershell)

Use [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) to create a resource group.

```powershell
# Create resource group
$rgParams = @{
    Name = 'test-rg'
    Location = 'South Central US'
}
New-AzResourceGroup @rgParams
```

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the hub virtual network.

```powershell
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

```powershell
# Create subnet for Azure Firewall
$subnetParams = @{
    Name = 'AzureFirewallSubnet'
    AddressPrefix  = '10.0.1.64/64'
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

```powershell
# Create the virtual network
$hubVnet | Set-AzVirtualNetwork
```

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP for Azure Bastion.

```powershell
# Create public IP for Azure Bastion
$publicIpBastionParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'public-ip-bastion'
    AllocationMethod  = 'Static'
    Sku = 'Standard'
}
$publicIpBastion = New-AzPublicIpAddress @publicIpBastionParams
```

Use [New-AzBastion](/powershell/module/az.network/new-azbastion) to create Azure Bastion.

```powershell
# Create Azure Bastion
$bastionParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'bastion'
    PublicIpAddress = $publicIpBastion
    VirtualNetwork = $hubVnet
}
New-AzBastion @bastionParams
```

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP for Azure Firewall.

```powershell
# Create public IP for Azure Firewall
$publicIpFirewallParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'public-ip-firewall'
    AllocationMethod  = 'Static'
    Sku = 'Standard'
}
$publicIpFirewall = New-AzPublicIpAddress @publicIpFirewallParams
```

Use [New-AzFirewall](/powershell/module/az.network/new-azfirewall) to create Azure Firewall.

```powershell
# Create Azure Firewall
$firewallParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'firewall'
    VirtualNetwork = $hubVnet
    PublicIpAddress = $publicIpFirewall
}
$firewall = New-AzFirewall @firewallParams
```

Use [New-AzFirewallPolicy](/powershell/module/az.network/new-azfirewallpolicy) to create a firewall policy.

```powershell
# Create firewall policy
$firewallPolicyParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'firewall-policy'
}
$firewallPolicy = New-AzFirewallPolicy @firewallPolicyParams
```

Use [Set-AzFirewall](/powershell/module/az.network/set-azfirewall) to associate the firewall policy with the firewall.

```powershell
# Associate firewall policy with firewall
$firewallUpdateParams = @{
    ResourceGroupName = 'test-rg'
    Name = 'firewall'
    FirewallPolicy = $firewallPolicy
}
Set-AzFirewall @firewallUpdateParams
```

### [CLI](#tab/cli)

Use [az group create](/cli/azure/group#az_group_create) to create a resource group.

```bash
az group create \
  --name test-rg \
  --location "South Central US"
```

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create the hub virtual network.

```bash
az network vnet create \
  --resource-group test-rg \
  --name vnet-hub \
  --address-prefix 10.0.0.0/16 \
  --subnet-name AzureFirewallSubnet \
  --subnet-prefix 10.0.1.0/24
```

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP for Azure Bastion.

```bash
az network public-ip create \
  --resource-group test-rg \
  --name public-ip-bastion \
  --allocation-method Static \
  --sku Standard
```

Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create Azure Bastion.

```bash
az network bastion create \
  --resource-group test-rg \
  --name bastion \
  --public-ip-address public-ip-bastion \
  --vnet-name vnet-hub
```

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP for Azure Firewall.

```bash
az network public-ip create \
  --resource-group test-rg \
  --name public-ip-firewall \
  --allocation-method Static \
  --sku Standard
```

Use [az network firewall create](/cli/azure/network/firewall#az-network-firewall-create) to create Azure Firewall.

```bash
az network firewall create \
  --resource-group test-rg \
  --name firewall \
  --vnet-name vnet-hub \
  --public-ip-address public-ip-firewall
```

Use [az network firewall policy create](/cli/azure/network/firewall/policy#az-network-firewall-policy-create) to create a firewall policy.

```bash
az network firewall policy create \
  --resource-group test-rg \
  --name firewall-policy
```

Use [az network firewall update](/cli/azure/network/firewall#az-network-firewall-update) to associate the firewall policy with the firewall.

```bash
az network firewall update \
  --resource-group test-rg \
  --name firewall \
  --firewall-policy firewall-policy
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

```powershell
# Create public IP for NAT gateway
$publicIpNatParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'public-ip-nat'
    AllocationMethod = 'Static'
    Sku = 'Standard'
}
$publicIpNat = New-AzPublicIpAddress @publicIpNatParams
```

Use [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway) to create the NAT gateway.

```powershell
# Create NAT gateway
$natGatewayParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'nat-gateway'
    PublicIpAddress = $publicIpNat
    IdleTimeoutInMinutes = 4
}
$natGateway = New-AzNatGateway @natGatewayParams
```

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to associate NAT gateway with AzureFirewallSubnet.

```powershell
# Associate NAT gateway with AzureFirewallSubnet
$subnetParams = @{
    VirtualNetwork = $hubVnet
    Name = 'AzureFirewallSubnet'
    NatGateway = $natGateway
}
Set-AzVirtualNetworkSubnetConfig @subnetParams
```

Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to update the virtual network.

```powershell
# Update the virtual network
$hubVnet | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP for NAT gateway.

```bash
az network public-ip create \
  --resource-group test-rg \
  --name public-ip-nat \
  --allocation-method Static \
  --sku Standard
```

Use [az network nat gateway create](/cli/azure/network/nat/gateway#az-network-nat-gateway-create) to create a NAT gateway.

```bash
az network nat gateway create \
  --resource-group test-rg \
  --name nat-gateway \
  --public-ip-address public-ip-nat \
  --idle-timeout 4
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to associate NAT gateway with AzureFirewallSubnet.

```bash
az network vnet subnet update \
  --resource-group test-rg \
  --vnet-name vnet-hub \
  --name AzureFirewallSubnet \
  --nat-gateway nat-gateway
```

---

## Create spoke virtual network

The spoke virtual network contains the test virtual machine used to test the routing of the internet traffic to the NAT gateway. Use the following example to create the spoke network.

### [Portal](#tab/portal)

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

```powershell
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

```powershell
# Create subnet in spoke virtual network
$subnetParams = @{
    Name = 'subnet-private'
    AddressPrefix = '10.1.0.0/24'
    VirtualNetwork = $spokeVnet
}
Add-AzVirtualNetworkSubnetConfig @subnetParams
```

Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to update the spoke virtual network.

```powershell
# Create the virtual network
$spokeVnet | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create the spoke virtual network.

```bash
az network vnet create \
  --resource-group test-rg \
  --name vnet-spoke \
  --address-prefix 10.1.0.0/16 \
  --subnet-name subnet-private \
  --subnet-prefix 10.1.0.0/24
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
    | Allow 'vnet-hub' to access 'vnet-spoke-2' | Leave the default of **Selected**. |
    | Allow 'vnet-hub' to receive forwarded traffic from 'vnet-spoke' | Select the checkbox. |
    | Allow gateway or route server in 'vnet-hub' to forward traffic to 'vnet-spoke' | Leave the default of **Unselected**. |
    | Enable 'vnet-hub' to use 'vnet-spoke's' remote gateway or route server | Leave the default of **Unselected**. |

1. Select **Add**.

1. Select **Refresh** and verify **Peering status** is **Connected**.

### [PowerShell](#tab/powershell)

Use [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) to create a peering from the hub to the spoke.

```powershell
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

```powershell
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

```bash
az network vnet peering create \
  --resource-group test-rg \
  --vnet-name vnet-hub \
  --name vnet-hub-to-vnet-spoke \
  --remote-vnet vnet-spoke \
  --allow-forwarded-traffic
```

Use [az network vnet peering create](/cli/azure/network/vnet/peering#az-network-vnet-peering-create) to create peering from spoke to hub.

```bash
az network vnet peering create \
  --resource-group test-rg \
  --vnet-name vnet-spoke \
  --name vnet-spoke-to-vnet-hub \
  --remote-vnet vnet-hub \
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

```powershell
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

```powershell
# Create route table
$routeTableParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'route-table-spoke'
}
$routeTable = New-AzRouteTable @routeTableParams
```

Use [Add-AzRouteConfig](/powershell/module/az.network/add-azrouteconfig) to create a route in the route table.

```powershell
# Create route
$routeConfigParams = @{
    Name = 'route-to-hub'
    AddressPrefix = '0.0.0.0/0'
    NextHopType = 'VirtualAppliance'
    NextHopIpAddress = '10.0.1.68'
    RouteTable = $routeTable
}
Add-AzRouteConfig @routeConfigParams
```

Use [Set-AzRouteTable](/powershell/module/az.network/set-azroutetable) to update the route table.

```powershell
# Update the route table
$routeTable | Set-AzRouteTable
```

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to associate the route table with the spoke subnet.

```powershell
# Associate route table with subnet
$subnetConfigParams = @{
    VirtualNetwork = $spokeVnet
    Name = 'subnet-private'
    RouteTable = $routeTable
}
Set-AzVirtualNetworkSubnetConfig @subnetConfigParams
```

Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to update the spoke virtual network.

```powershell
# Update the virtual network
$spokeVnet | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

Use [az network route-table create](/cli/azure/network/route-table#az-network-route-table-create) to create a route table.

```bash
az network route-table create \
  --resource-group test-rg \
  --name route-table-spoke \
  --location "South Central US"
```

Use [az network route-table route create](/cli/azure/network/route-table/route#az-network-route-table-route-create) to create a route.

```bash
az network route-table route create \
  --resource-group test-rg \
  --route-table-name route-table-spoke \
  --name route-to-hub \
  --address-prefix 0.0.0.0/0 \
  --next-hop-type VirtualAppliance \
  --next-hop-ip-address 10.0.1.68
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to associate the route table with the subnet.

```bash
az network vnet subnet update \
  --resource-group test-rg \
  --vnet-name vnet-spoke \
  --name subnet-private \
  --route-table route-table-spoke
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

Use [New-AzFirewallPolicyNetworkRuleCollection](/powershell/module/az.network/new-azfirewallpolicynetworkrulecollection) to create a network rule collection.

```powershell
# Create network rule collection
$networkRuleCollectionParams = @{
    Name = 'spoke-to-internet'
    Priority = 100
    RuleCollectionType = 'NetworkRuleCollection'
    ActionType = 'Allow'
    RuleCollectionGroup = 'DefaultNetworkRuleCollectionGroup'
}
$networkRuleCollection = New-AzFirewallPolicyNetworkRuleCollection @networkRuleCollectionParams
```

Use [New-AzFirewallPolicyNetworkRule](/powershell/module/az.network/new-azfirewallpolicynetworkrule) to create a network rule.

```powershell
# Create network rule
$networkRuleParams = @{
    Name = 'allow-web'
    SourceAddress = '10.1.0.0/24'
    DestinationAddress = '*'
    DestinationPort = '80,443'
    Protocol = 'TCP'
}
$networkRule = New-AzFirewallPolicyNetworkRule @networkRuleParams
# Add network rule to collection
$networkRuleCollection.Rules.Add($networkRule)
```

Use [Set-AzFirewallPolicy](/powershell/module/az.network/set-azfirewallpolicy) to update the firewall policy.

```powershell
# Update firewall policy
$firewallPolicyParams = @{
    ResourceGroupName = 'test-rg'
    Name = 'firewall-policy'
    NetworkRuleCollection = $networkRuleCollection
}
Set-AzFirewallPolicy @firewallPolicyParams
```

### [CLI](#tab/cli)

Use [az network firewall policy rule-collection-group collection rule add](/cli/azure/network/firewall/policy/rule-collection-group/collection#az-network-firewall-policy-rule-collection-group-collection-rule-add) to create a network rule collection.

```bash
az network firewall policy rule-collection-group collection rule add \
  --policy-name firewall-policy \
  --resource-group test-rg \
  --rule-collection-group-name DefaultNetworkRuleCollectionGroup \
  --name spoke-to-internet \
  --rule-name allow-web \
  --rule-type NetworkRule \
  --priority 100 \
  --action Allow \
  --source-addresses 10.1.0.0/24 \
  --destination-addresses '*' \
  --destination-ports 80 443 \
  --protocols TCP
```

---

## Create test virtual machine

An Ubuntu virtual machine is used to test the outbound internet traffic through the NAT gateway. Use the following example to create an Ubuntu virtual machine.

### [Portal](#tab/portal)

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
    | Configure network security group | Select **Create new**. </br> Enter **nsg-1** for the name. </br> Leave the rest at the defaults and select **OK**. |

1. Leave the rest of the settings at the defaults and select **Review + create**.

1. Review the settings and select **Create**.

Wait for the virtual machine to finishing deploying before proceeding to the next steps.

>[!NOTE]
>Virtual machines in a virtual network with a bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in bastion hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](../virtual-network/ip-services/remove-public-ip-address-vm.md).

### [PowerShell](#tab/powershell)

Use [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) to create a credential object for the virtual machine.

```powershell
# Create credential object
$cred = Get-Credential
```

Use [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) to create a network security group.

```powershell
# Create network security group
$nsgParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'nsg-1'
}
$nsg = New-AzNetworkSecurityGroup @nsgParams
```

Use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) to create a network interface.

```powershell
# Create network interface
$nicParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    Name = 'vm-spoke-nic'
    SubnetId = $spokeVnet.Subnets[0].Id
    NetworkSecurityGroupId = $nsg.Id
}
$nic = New-AzNetworkInterface @nicParams
```

Use [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) to create a virtual machine configuration.

```powershell
# Create virtual machine configuration
$vmConfigParams = @{
    VMName = 'vm-spoke'
    VMSize = 'Standard_DS1_v2'
}

$vmOSConfig = @{
    ComputerName = 'vm-spoke'
    Credential = $cred
}

$vmSourceImage = @{
    PublisherName = 'Canonical'
    Offer = 'UbuntuServer'
    Skus = '24_04-lts-gen2'
    Version = 'latest'
}
$vmConfig = New-AzVMConfig @vmConfigParams | Set-AzVMOperatingSystem @vmOSconfig -Linux | Set-AzVMSourceImage @vmSourceImage | Add-AzVMNetworkInterface -Id $nic.Id
```

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create the virtual machine.

```powershell
# Create virtual machine
$vmParams = @{
    ResourceGroupName = 'test-rg'
    Location = 'South Central US'
    VM = $vmConfig
}
New-AzVM @vmParams
```

### [CLI](#tab/cli)

Use [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create) to create a network security group.

```bash
az network nsg create \
  --resource-group test-rg \
  --name nsg-1 \
  --location "South Central US"
```

Use [az network nic create](/cli/azure/network/nic#az-network-nic-create) to create a network interface.

```bash
az network nic create \
  --resource-group test-rg \
  --name vm-spoke-nic \
  --vnet-name vnet-spoke \
  --subnet subnet-private \
  --network-security-group nsg-1
```

Use [az vm create](/cli/azure/vm#az-vm-create) to create a virtual machine.

```bash
az vm create \
  --resource-group test-rg \
  --name vm-spoke \
  --location "South Central US" \
  --nics vm-spoke-nic \
  --image UbuntuLTS \
  --admin-username azureuser \
  --admin-password <password>
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

```powershell
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

```bash
az network public-ip show \
  --resource-group test-rg \
  --name public-ip-nat \
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

```powershell
# Remove resource group
$rgParams = @{
    Name = 'test-rg'
}
Remove-AzResourceGroup @rgParams
```

### [CLI](#tab/cli)

Use [az group delete](/cli/azure/group#az_group_delete) to remove the resource group.

```bash
az group delete \
  --name test-rg \
  --yes \
  --no-wait
```

---

## Next steps

Advance to the next article to learn how to integrate a NAT gateway with an Azure Load Balancer:
> [!div class="nextstepaction"]
> [Integrate NAT gateway with an internal load balancer](tutorial-nat-gateway-load-balancer-internal-portal.md)
