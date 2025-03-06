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

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 

### [Portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

### [PowerShell](#tab/powershell)


### [CLI](#tab/cli)

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

```powershell
# Create resource group
New-AzResourceGroup -Name test-rg -Location "South Central US"

# Create hub virtual network
$hubVnet = New-AzVirtualNetwork -ResourceGroupName test-rg -Location "South Central US" -Name vnet-hub -AddressPrefix 10.0.0.0/16

# Create AzureFirewallSubnet
Add-AzVirtualNetworkSubnetConfig -Name AzureFirewallSubnet -AddressPrefix 10.0.1.0/24 -VirtualNetwork $hubVnet

# Create the virtual network
$hubVnet | Set-AzVirtualNetwork

# Create public IP for Azure Bastion
$publicIpBastion = New-AzPublicIpAddress -ResourceGroupName test-rg -Location "South Central US" -Name public-ip-bastion -AllocationMethod Static -Sku Standard

# Create Azure Bastion
New-AzBastion -ResourceGroupName test-rg -Name bastion -PublicIpAddress $publicIpBastion -VirtualNetworkName vnet-hub

# Create public IP for Azure Firewall
$publicIpFirewall = New-AzPublicIpAddress -ResourceGroupName test-rg -Location "South Central US" -Name public-ip-firewall -AllocationMethod Static -Sku Standard

# Create Azure Firewall
$firewall = New-AzFirewall -ResourceGroupName test-rg -Location "South Central US" -Name firewall -VirtualNetworkName vnet-hub -PublicIpAddress $publicIpFirewall

# Create firewall policy
$firewallPolicy = New-AzFirewallPolicy -ResourceGroupName test-rg -Location "South Central US" -Name firewall-policy

# Associate firewall policy with firewall
Set-AzFirewall -ResourceGroupName test-rg -Name firewall -FirewallPolicy $firewallPolicy
```

### [CLI](#tab/cli)

```bash
# Create resource group
az group create --name test-rg --location "South Central US"

# Create hub virtual network
az network vnet create --resource-group test-rg --name vnet-hub --address-prefix 10.0.0.0/16 --subnet-name AzureFirewallSubnet --subnet-prefix 10.0.1.0/24

# Create public IP for Azure Bastion
az network public-ip create --resource-group test-rg --name public-ip-bastion --allocation-method Static --sku Standard

# Create Azure Bastion
az network bastion create --resource-group test-rg --name bastion --public-ip-address public-ip-bastion --vnet-name vnet-hub

# Create public IP for Azure Firewall
az network public-ip create --resource-group test-rg --name public-ip-firewall --allocation-method Static --sku Standard

# Create Azure Firewall
az network firewall create --resource-group test-rg --name firewall --vnet-name vnet-hub --public-ip-address public-ip-firewall

# Create firewall policy
az network firewall policy create --resource-group test-rg --name firewall-policy

# Associate firewall policy with firewall
az network firewall update --resource-group test-rg --name firewall --firewall-policy firewall-policy
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

```powershell
# Create public IP for NAT gateway
$publicIpNat = New-AzPublicIpAddress -ResourceGroupName test-rg -Location "South Central US" -Name public-ip-nat -AllocationMethod Static -Sku Standard

# Create NAT gateway
$natGateway = New-AzNatGateway -ResourceGroupName test-rg -Location "South Central US" -Name nat-gateway -PublicIpAddress $publicIpNat -IdleTimeoutInMinutes 4

# Associate NAT gateway with AzureFirewallSubnet
Set-AzVirtualNetworkSubnetConfig -VirtualNetwork $hubVnet -Name AzureFirewallSubnet -NatGateway $natGateway

# Update the virtual network
$hubVnet | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

```bash
# Create public IP for NAT gateway
az network public-ip create --resource-group test-rg --name public-ip-nat --allocation-method Static --sku Standard

# Create NAT gateway
az network nat gateway create --resource-group test-rg --name nat-gateway --public-ip-address public-ip-nat --idle-timeout 4

# Associate NAT gateway with AzureFirewallSubnet
az network vnet subnet update --resource-group test-rg --vnet-name vnet-hub --name AzureFirewallSubnet --nat-gateway nat-gateway
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

```powershell
# Create spoke virtual network
$spokeVnet = New-AzVirtualNetwork -ResourceGroupName test-rg -Location "South Central US" -Name vnet-spoke -AddressPrefix 10.1.0.0/16

# Create subnet in spoke virtual network
Add-AzVirtualNetworkSubnetConfig -Name subnet-private -AddressPrefix 10.1.0.0/24 -VirtualNetwork $spokeVnet

# Create the virtual network
$spokeVnet | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

```bash
# Create spoke virtual network
az network vnet create --resource-group test-rg --name vnet-spoke --address-prefix 10.1.0.0/16 --subnet-name subnet-private --subnet-prefix 10.1.0.0/24
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

```powershell
# Create peering from hub to spoke
Add-AzVirtualNetworkPeering -Name vnet-hub-to-vnet-spoke -VirtualNetwork $hubVnet -RemoteVirtualNetworkId $spokeVnet.Id -AllowForwardedTraffic

# Create peering from spoke to hub
Add-AzVirtualNetworkPeering -Name vnet-spoke-to-vnet-hub -VirtualNetwork $spokeVnet -RemoteVirtualNetworkId $hubVnet.Id -AllowForwardedTraffic
```

### [CLI](#tab/cli)

```bash
# Create peering from hub to spoke
az network vnet peering create --resource-group test-rg --vnet-name vnet-hub --name vnet-hub-to-vnet-spoke --remote-vnet vnet-spoke --allow-forwarded-traffic

# Create peering from spoke to hub
az network vnet peering create --resource-group test-rg --vnet-name vnet-spoke --name vnet-spoke-to-vnet-hub --remote-vnet vnet-hub --allow-forwarded-traffic
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

```powershell
# Get the private IP address of the firewall
$firewall = Get-AzFirewall -ResourceGroupName test-rg -Name firewall
$firewall.PrivateIpAddress
```

### [CLI](#tab/cli)

```bash
# Get the private IP address of the firewall
az network firewall show --resource-group test-rg --name firewall --query "ipConfigurations[0].privateIpAddress" --output tsv
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

```powershell
# Create route table
$routeTable = New-AzRouteTable -ResourceGroupName test-rg -Location "South Central US" -Name route-table-spoke

# Create route
Add-AzRouteConfig -Name route-to-hub -AddressPrefix 0.0.0.0/0 -NextHopType VirtualAppliance -NextHopIpAddress 10.0.1.68 -RouteTable $routeTable

# Update the route table
$routeTable | Set-AzRouteTable

# Associate route table with subnet
Set-AzVirtualNetworkSubnetConfig -VirtualNetwork $spokeVnet -Name subnet-private -RouteTable $routeTable

# Update the virtual network
$spokeVnet | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

```bash
# Create route table
az network route-table create --resource-group test-rg --name route-table-spoke --location "South Central US"

# Create route
az network route-table route create --resource-group test-rg --route-table-name route-table-spoke --name route-to-hub --address-prefix 0.0.0.0/0 --next-hop-type VirtualAppliance --next-hop-ip-address 10.0.1.68

# Associate route table with subnet
az network vnet subnet update --resource-group test-rg --vnet-name vnet-spoke --name subnet-private --route-table route-table-spoke
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

```powershell
# Create network rule collection
$networkRuleCollection = New-AzFirewallPolicyNetworkRuleCollection -Name spoke-to-internet -Priority 100 -RuleCollectionType NetworkRuleCollection -ActionType Allow -RuleCollectionGroup DefaultNetworkRuleCollectionGroup

# Create network rule
$networkRule = New-AzFirewallPolicyNetworkRule -Name allow-web -SourceAddress 10.1.0.0/24 -DestinationAddress * -DestinationPort 80,443 -Protocol TCP

# Add network rule to collection
$networkRuleCollection.Rules.Add($networkRule)

# Update firewall policy
Set-AzFirewallPolicy -ResourceGroupName test-rg -Name firewall-policy -NetworkRuleCollection $networkRuleCollection
```

### [CLI](#tab/cli)

```bash
# Create network rule collection
az network firewall policy rule-collection-group collection rule add --policy-name firewall-policy --resource-group test-rg --rule-collection-group-name DefaultNetworkRuleCollectionGroup --name spoke-to-internet --rule-name allow-web --rule-type NetworkRule --priority 100 --action Allow --source-addresses 10.1.0.0/24 --destination-addresses '*' --destination-ports 80 443 --protocols TCP
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

```powershell
# Create network security group
$nsg = New-AzNetworkSecurityGroup -ResourceGroupName test-rg -Location "South Central US" -Name nsg-1

# Create network interface
$nic = New-AzNetworkInterface -ResourceGroupName test-rg -Location "South Central US" -Name vm-spoke-nic -SubnetId $spokeVnet.Subnets[0].Id -NetworkSecurityGroupId $nsg.Id

# Create virtual machine
$vmConfig = New-AzVMConfig -VMName vm-spoke -VMSize Standard_DS1_v2 | Set-AzVMOperatingSystem -Linux -ComputerName vm-spoke -Credential (Get-Credential) | Set-AzVMSourceImage -PublisherName Canonical -Offer UbuntuServer -Skus 24_04-lts-gen2 -Version latest | Add-AzVMNetworkInterface -Id $nic.Id

New-AzVM -ResourceGroupName test-rg -Location "South Central US" -VM $vmConfig
```

### [CLI](#tab/cli)

```bash
# Create network security group
az network nsg create --resource-group test-rg --name nsg-1 --location "South Central US"

# Create network interface
az network nic create --resource-group test-rg --name vm-spoke-nic --vnet-name vnet-spoke --subnet subnet-private --network-security-group nsg-1

# Create virtual machine
az vm create --resource-group test-rg --name vm-spoke --location "South Central US" --nics vm-spoke-nic --image UbuntuLTS --admin-username azureuser --admin-password <password>
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

```powershell
# Get the public IP address of the NAT gateway
$publicIpNat = Get-AzPublicIpAddress -ResourceGroupName test-rg -Name public-ip-nat
$publicIpNat.IpAddress
```

### [CLI](#tab/cli)

```bash
# Get the public IP address of the NAT gateway
az network public-ip show --resource-group test-rg --name public-ip-nat --query "ipAddress" --output tsv
```

---

### Test NAT gateway from spoke

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-spoke**.

1. In **Overview**, select **Connect** then **Connect via Bastion**.

1. Enter the username and password entered during VM creation. Select **Connect**.

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

### [CLI](#tab/cli)

---

## Next steps

Advance to the next article to learn how to integrate a NAT gateway with an Azure Load Balancer:
> [!div class="nextstepaction"]
> [Integrate NAT gateway with an internal load balancer](tutorial-nat-gateway-load-balancer-internal-portal.md)
