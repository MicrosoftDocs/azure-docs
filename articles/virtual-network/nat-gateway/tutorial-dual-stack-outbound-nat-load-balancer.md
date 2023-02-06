---
title: 'Tutorial: Configure dual-stack outbound connectivity with a NAT gateway and a public load balancer'
description: Learn how to configure outbound connectivity for a dual stack network with a NAT gateway and a public load balancer.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: nat
ms.topic: tutorial
ms.date: 02/05/2023
ms.custom: template-tutorial
---

# Tutorial: Configure dual stack outbound connectivity with a NAT gateway and a public load balancer

In this tutorial, you'll learn how to configure NAT gateway and a public load balancer to a dual stack subnet in order to allow for outbound connectivity for v4 workloads using NAT gateway and v6 workloads using Public Load balancer.

NAT gateway supports the use of IPv4 public IP addresses for outbound connectivity whereas load balancer supports both IPv4 and IPv6 public IP addresses. When NAT gateway with an IPv4 public IP is present with a load balancer using an IPv4 public IP address, NAT gateway takes precedence over load balancer for providing outbound connectivity. When a NAT gateway is deployed in a dual-stack network with a IPv6 load balancer, IPv4 outbound traffic is handled by the NAT gateway, and IPv6 outbound traffic is handled by the load balancer.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a NAT gateway with an IPv4 public address
> * Add IPv6 to the virtual network
> * Create a public load balancer with an IPv6 public address
> * Create a dual-stack virtual machine
> * Validate outbound connectivity from your dual stack virtual machine

## Prerequisites

# [**Portal**](#tab/dual-stack-outbound-portal)

- An Azure account with an active subscription. [Create an account for free]
(https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

- An Azure account with an active subscription. [Create an account for free]
(https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

# [**CLI**](#tab/dual-stack-outbound--cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- An Azure account with an active subscription. [Create an account for free]
(https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Create virtual network

In this section, you'll create a virtual network for the virtual machine and load balancer.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorialIPv6NATLB-rg**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **West US 2**. |

1. Select the **IP Addresses** tab, or **Next: IP Addresses**.

1. Leave the default IPv4 address space of **10.1.0.0/16**. If the default is absent or different, enter an IPv4 address space of **10.1.0.0/16**.

1. Select **default** under **Subnet name**. If default is missing, select **+ Add subnet**.

1. In **Subnet name**, enter **myBackendSubnet**.

1. Leave the default IPv4 subnet of **10.1.0.0/24**.

1. Select **Save**. If creating a subnet, select **Add**.

1. Select the **Security** tab or select **Next: Security**.

1. In **BastionHost**, select **Enable**.

1. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | **myBastion** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26**. |
    | Public IP address | Select **Create new**. </br> Enter **myPublicIP-Bastion** in **Name**. </br> Select **OK**. |

1. Select the **Review + create**.

1. Select **Create**.

It will take a few minutes for the bastion host to deploy. You can proceed to the next steps when the virtual network is deployed.

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

## Create a resource group

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
$rsg = @{
    Name = 'TutorialIPv6NATLB-rg'
    Location = 'westus2'
}
New-AzResourceGroup @rsg
```

## Create virtual network

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the virtual network.

Use [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) to create the subnet configurations for the backend and bastion subnets.

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create the public IP address for the bastion host.

Use [New-AzBastion](/powershell/module/az.network/new-azbastion) to create the bastion host.

```azurepowershell-interactive
## Configure the back-end subnet. ##
$sub = @{
    Name = 'myBackendSubnet'
    AddressPrefix = '10.1.0.0/24'
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @sub

## Create the Azure Bastion subnet. ##
$bsub = @{
    Name = 'AzureBastionSubnet'
    AddressPrefix = '10.1.1.0/26'
}
$bastsubnetConfig = New-AzVirtualNetworkSubnetConfig @bsub

## Create the virtual network. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
    Location = 'westus2'
    AddressPrefix = '10.1.0.0/16'
    Subnet = $subnetConfig, $bastsubnetConfig
}
$vnet = New-AzVirtualNetwork @net

## Create the public IP address for the bastion host. ##
$ip = @{
    Name = 'myPublicIP-Bastion'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
    Location = 'westus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    Zone = 1,2,3
}
$publicip = New-AzPublicIpAddress @ip

## Create the bastion host. ##
$bastion = @{
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
    Name = 'myBastion'
    PublicIpAddress = $publicip
    VirtualNetwork = $vnet
}
New-AzBastion @bastion -AsJob
```

# [**CLI**](#tab/dual-stack-outbound--cli)

---
## Create NAT gateway

The NAT gateway provides the outbound connectivity for the IPv4 portion of the virtual network. Use the following example to create a NAT gateway.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialIPv6NATLB-rg**. |
    | **Instance details** |   |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select **West US 2**. |
    | Availability zone | Select a zone or **No Zone**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

1. Select **Next: Outbound IP**.

1. In **Public IP addresses**, select **Create a new public IP address**.

1. Enter **myPublicIP-NAT** in **Name**. Select **OK**.

1. Select **Next: Subnet**.

1. In **Virtual network**, select **myVNet**.

1. In the list of subnets, select the box for **myBackendSubnet**.

1. Select **Review + create**.

1. Select **Create**.

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create the IPv4 public IP address for the NAT gateway.

Use [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway) to create the NAT gateway resource.

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to configure the NAT gateway for your virtual network subnet

```azurepowershell-interactive
## Create public IP address for NAT gateway ##
$ip = @{
    Name = 'myPublicIP-NAT'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
    Location = 'westus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
}
$publicIP = New-AzPublicIpAddress @ip

## Place the virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
}
$vnet = Get-AzVirtualNetwork @net

## Create NAT gateway resource ##
$nat = @{
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
    Name = 'myNATgateway'
    IdleTimeoutInMinutes = '4'
    Sku = 'Standard'
    Location = 'westus2'
    PublicIpAddress = $publicIP
}
$natGateway = New-AzNatGateway @nat

## Create the subnet configuration. ##
$sub = @{
    Name = 'myBackendSubnet'
    VirtualNetwork = $vnet
    NatGateway = $natGateway
}
Set-AzVirtualNetworkSubnetConfig @sub

## Save the configuration to the virtual network. ##
$vnet | Set-AzVirtualNetwork
```

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Add IPv6 to virtual network

The addition of IPv6 to the virtual network must be done after the NAT gateway is associated with **myBackendSubnet**. Use the following example to add and IPv6 address space and subnet to the virtual network you created in the previous steps.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **myVNet**.

1. In **Settings**, select **Address space**.

1. In the box that displays **Add additional address range**, enter **2404:f800:8000:122::/63**.

1. Select **Save**.

1. Select **Subnets** in **Settings**.

1. Select **myBackendSubnet** in the list of subnets.

1. Select the box next to **Add IPv6 address space**.

1. Enter **2404:f800:8000:122::/64** in **IPv6 address space**.

1. Select **Save**.

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to add an IPv6 address space to the virtual network.

```azurepowershell-interactive
## Place your virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
}
$vnet = Get-AzVirtualNetwork @net

## Place address space into a variable. ##
$IPAddressRange = '2404:f800:8000:122::/63'

## Add the address space to the virtual network configuration. ##
$vnet.AddressSpace.AddressPrefixes.Add($IPAddressRange)

## Save the configuration to the virtual network. ##
Set-AzVirtualNetwork -VirtualNetwork $vnet
```

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to add the new IPv6 subnet to the virtual network.

```azurepowershell-interactive
## Place your virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
}
$vnet = Get-AzVirtualNetwork @net

## Create the subnet configuration. ##
$sub = @{
    Name = 'myBackendSubnet'
    AddressPrefix = '10.1.0.0/24','2404:f800:8000:122::/64'
    VirtualNetwork = $vnet
}
Set-AzVirtualNetworkSubnetConfig @sub

## Save the configuration to the virtual network. ##
Set-AzVirtualNetwork -VirtualNetwork $vnet
```

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Create dual-stack virtual machine

The network configuration of the virtual machine has IPv4 and IPv6 configurations. You'll create the virtual machine with an internal IPv4 address. You'll then add the IPv6 configuration to the network interface of the virtual machine.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In the **Basics** tab of **Create a virtual machine**, enter or select the following information:

    | Setting | Value | 
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialIPv6NATLB-rg**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Leave the default of **No infrastructure redundancy required**. |
    | Security type | Leave the default of **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2**. |
    | Size | Select a size. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Confirm password. |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

1. Select the **Networking** tab, or **Next: Disks** then **Next: Networking**.

1. In the **Networking tab**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet (10.1.0.0/24,2404:f800:8000:122::/64)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **None**. |

1. Select **Review + create**.

1. Select **Create**.

Wait for the virtual machine to finish deploying before continuing on to the next steps.

### Add IPv6 to virtual machine

The support IPv6, the virtual machine must have a IPv6 network configuration added to the network interface. Use the following example to add a IPv6 network configuration to the virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **myVM**.

1. In **Settings** select **Networking**.

1. Select the name of the network interface in the **Network Interface:** field. The name of the network interface is the virtual machine name plus a random number. In this example, it's **myVM202**.

1. In the network interface properties, select **IP configurations** in **Settings**.

1. Select **+ Add**.

1. Enter or select the following information in **Add IP configuration**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **ipv6config**. |
    | IP version | Select **IPv6**. |

1. Leave the rest of the settings at the defaults and select **OK**.

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

## Create NSG

Use [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) and [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) to create the network security group and rules.

```azurepowershell-interactive
## Create rule for network security group and place in variable. ##
$nsgrule1 = @{
    Name = 'myNSGRuleRDP'
    Description = 'Allow RDP'
    Protocol = '*'
    SourcePortRange = '*'
    DestinationPortRange = '3389'
    SourceAddressPrefix = 'Internet'
    DestinationAddressPrefix = '*'
    Access = 'Allow'
    Priority = '200'
    Direction = 'Inbound'
}
$rule1 = New-AzNetworkSecurityRuleConfig @nsgrule1

## Create network security group ##
$nsg = @{
    Name = 'myNSG'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
    Location = 'westus2'
    SecurityRules = $rule1
}
New-AzNetworkSecurityGroup @nsg
```

## Create network interface

Use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) and [New-AzNetworkInterfaceIpConfig](/powershell/module/az.network/new-aznetworkinterfaceipconfig) to create the network interface for the virtual machine.

```azurepowershell-interactive
## Place the virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
}
$vnet = Get-AzVirtualNetwork @net

## Place the network security group into a variable. ##
$ns = @{
    Name = 'myNSG'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
}
$nsg = Get-AzNetworkSecurityGroup @ns

## Create IPv4 configuration for NIC. ##
$IP4c = @{
    Name = 'ipconfig-ipv4'
    Subnet = $vnet.Subnets[0]
    PrivateIpAddressVersion = 'IPv4'
    PublicIPAddress = $pubIPv4
}
$IPv4Config = New-AzNetworkInterfaceIpConfig @IP4c

## Create IPv6 configuration for NIC. ##
$IP6c = @{
    Name = 'ipconfig-ipv6'
    Subnet = $vnet.Subnets[0]
    PrivateIpAddressVersion = 'IPv6'
    PublicIPAddress = $pubIPv6
}
$IPv6Config = New-AzNetworkInterfaceIpConfig @IP6c

## Command to create network interface for VM ##
$nic = @{
    Name = 'myNIC'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
    Location = 'westus2'
    NetworkSecurityGroup = $nsg
    IpConfiguration = $IPv4Config,$IPv6Config 
}
New-AzNetworkInterface @nic
```

## Create virtual machine

Use the following commands to create the virtual machine:
    
* [New-AzVM](/powershell/module/az.compute/new-azvm)
    
* [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig)
    
* [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem)
    
* [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage)
    
* [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)

```azurepowershell-interactive
$cred = Get-Credential

## Place network interface into a variable. ##
$nic = @{
    Name = 'myNIC'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
}
$nicVM = Get-AzNetworkInterface @nic

## Create a virtual machine configuration for VMs ##
$vmsz = @{
    VMName = 'myVM'
    VMSize = 'Standard_DS1_v2'  
}
$vmos = @{
    ComputerName = 'myVM'
    Credential = $cred
}
$vmimage = @{
    PublisherName = 'MicrosoftWindowsServer'
    Offer = 'WindowsServer'
    Skus = '2022-Datacenter'
    Version = 'latest'    
}
$vmConfig = New-AzVMConfig @vmsz `
      | Set-AzVMOperatingSystem @vmos -Windows `
      | Set-AzVMSourceImage @vmimage `
      | Add-AzVMNetworkInterface -Id $nicVM.Id

## Create the virtual machine for VMs ##
$vm = @{
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
    Location = 'westus2'
    VM = $vmConfig
    }
New-AzVM @vm
```

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Create public load balancer

The public load balancer has a front-end IPv6 address and outbound rule for the backend pool of the load balancer. The outbound rule controls the behavior of the external IPv6 connections for virtual machines in the backend pool. Use the following example to create an IPv6 public load balancer.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create load balancer**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialIPv6NATLB-rg**. |
    | **Instance details** |  |
    | Name | Enter **myLoadBalancer**. |
    | Region | Select **West US 2**. |
    | SKU | Leave the default of **Standard**. |
    | Type | Select **Public**. |

1. Select **Next: Frontend IP configuration**.

1. Select **+ Add a frontend IP configuration**. 

1. Enter or select the following information in **Add frontend IP configuration**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myFrontend-IPv6**. |
    | IP version | Select **IPv6**. |
    | IP type | Select **IP address**. |
    | Public IP address | Select **Create new**. </br> In **Name** enter **myPublicIP-IPv6**. </br> Select **OK**. |

1. Select **Add**.

1. Select **Next: Backend pools**.

1. Select **+ Add a backend pool**.

1. Enter or select the following information in **Add backend pool**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myBackendPool**. |
    | Virtual network | Select **myVNet (TutorialIPv6NATLB-rg)**. |
    | Backend Pool Configuration | Leave the default of **NIC**. |

1. Select **Save**.

1. Select **Next: Inbound rules** then **Next: Outbound rules**.

1. Select **Add an outbound rule**.

1. Enter or select the following information in **Add outbound rule**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myOutboundRule**. |
    | IP Version | Select **IPv6**. |
    | Frontend IP address | Select **myFrontend-IPv6**. |
    | Protocol | Leave the default of **All**. |
    | Idle timeout (minutes) | Leave the default of **4**. |
    | TCP Reset | Leave the default of **Enabled**. |
    | Backend pool | Select **myBackendPool**. |
    | **Port allocation** |   |
    | Port allocation | Select **Manually choose number of outbound ports**. |
    | **Outbound ports** |  |
    | Choose by | Select **Ports per instance**. |
    | Ports per instance | Enter **20000**. |

1. Select **Add**.

1. Select **Review + create**.

1. Select **Create**.

Wait for the load balancer to finish deploying before proceeding to the next steps.

### Add virtual machine to load balancer

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. Select **myLoadBalancer**.

1. In **Settings** select **Backend pools**.

1. Select **myBackendPool**.

1. In **Virtual network** select **myVNet (TutorialIPv6NATLB-rg)**.

1. In **IP configurations** select **+ Add**.

1. Select the checkbox for **myVM** that corresponds with the **IP configuration** of **ipv6config**. Don't select **ipconfig1**.

1. Select **Add**.

1. Select **Save**. 

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

## Create a public IP address

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IPv6 address.

```azurepowershell-interactive
$publicip = @{
    Name = 'myPublicIP-IPv6'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'static'
    IpAddressVersion = 'IPv6'
    Zone = 1,2,3
}
New-AzPublicIpAddress @publicip
```

## Create the load balancer

Use [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig) to create a front-end IP with for the frontend IP pool. This IP receives the incoming traffic on the load balancer

Use [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig) to create a back-end address pool for traffic sent from the frontend of the load balancer. This pool is where your backend virtual machines are deployed

Use [New-AzLoadBalancerOutboundRuleConfig](/powershell/module/az.network/new-azloadbalanceroutboundruleconfig) to create an outbound rule for the virtual machines in the backend pool. The outbound rule will enable the outbound IPv6 traffic for the virtual machines.

Use [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer) to create the public load balancer

```azurepowershell-interactive
## Place public IP created in previous steps into variable. ##
$pip = @{
    Name = 'myPublicIP-IPv6'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
}
$publicIp = Get-AzPublicIpAddress @pip

## Create load balancer frontend configuration and place in variable. ##
$fip = @{
    Name = 'myFrontEnd'
    PublicIpAddress = $publicIp 
}
$feip = New-AzLoadBalancerFrontendIpConfig @fip

## Create backend address pool configuration and place in variable. ##
$bepool = New-AzLoadBalancerBackendAddressPoolConfig -Name 'myBackEndPool'

## Create the load balancer outbound rule and place in variable. ##
$lbrule = @{
    Name = 'myOutboundRule'
    AllocatedOutboundPort = '20000'
    Protocol = '*'
    IdleTimeoutInMinutes = '4'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bePool
}
$rule = New-AzLoadBalancerOutboundRuleConfig @lbrule -EnableTcpReset

## Create the load balancer resource. ##
$loadbalancer = @{
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
    Name = 'myLoadBalancer'
    Location = 'westus2'
    Sku = 'Standard'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bePool
    LoadBalancingRule = $rule
    Probe = $healthprobe
}
New-AzLoadBalancer @loadbalancer
```

### Add virtual machine to load balancer

[Set-AzNetworkInterface]() to add the virtual machine network interface to the load balancer.

```azurepowershell-interactive
## Place the network interface configuration into a variable. ##
$nc = @{
    Name = 'myNIC'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
}
$nic = Get-AzNetworkInterface @nc

## Place the load balancer backend pool into a variable. ##
$lb = @{
    Name = 'myLoadBalancer'
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
}
$bepool = Get-AzLoadBalancer @lb  | Get-AzLoadBalancerBackendAddressPoolConfig

## Add the IPv6 IP configuration to the backend address pool. ##
$nic.IpConfigurations[1].LoadBalancerBackendAddressPools = $bepool

## Set the network interface and save the configuration. ##
$nic = Set-AzNetworkInterface
```

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Validate outbound connectivity

You'll connect to the virtual machine with Azure Bastion to verify the IPv4 and IPv6 outbound traffic.

### Obtain IPv4 and IPv6 public IP addresses

Before you can validate outbound connectivity, make not of the IPv4, and IPv6 public IP addresses you created previously. Use the following example to obtain the public IP addresses.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

1. Select **myPublicIP-NAT**.

1. Make note of the address in **IP address**. In this example, it's **20.230.191.5**.

1. Return to **Public IP addresses**.

1. Select **myPublicIP-IPv6**.

1. Make note of the address in **IP address**. In this example, it's **2603:1030:c02:8::14**.

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to obtain the IPv4 and IPv6 public IP addresses.

### IPv4

```azurepowershell-interactive
$ip = @{
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
    Name = 'myPublicIP-NAT'
}  
Get-AzPublicIPAddress @ip | select IpAddress
```

### IPv6

```azurepowershell-interactive
$ip = @{
    ResourceGroupName = 'TutorialIPv6NATLB-rg'
    Name = 'myPublicIP-IPv6'
}  
Get-AzPublicIPAddress @ip | select IpAddress
```

Make note of both IP addresses. You will use them later to verify the outbound connectivity for each stack.

# [**CLI**](#tab/dual-stack-outbound--cli)

---

### Test connectivity

# [**Portal**](#tab/dual-stack-outbound-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **myVM**.

1. In the **Overview** of **myVM**, select **Connect** then **Bastion**. 

1. Enter the username and password you created when you created the virtual machine.

1. Select **Connect**.

1. On the desktop of **myVM**, open **Microsoft Edge**.

1. To confirm the IPv4 address, enter **http://v4.testmyipv6.com** in the address bar.

1. You should see the IPv4 address of **20.230.191.5** displayed.

    :::image type="content" source="./media/tutorial-dual-stack-outbound-nat-load-balancer/portal-verify-ipv4.png" alt-text="Screenshot of outbound IPv4 public IP address.":::

1. In the address bar, enter **http://v6.testmyipv6.com**

1. You should see the IPv6 address of **2603:1030:c02:8::14** displayed.

    :::image type="content" source="./media/tutorial-dual-stack-outbound-nat-load-balancer/portal-verify-ipv6.png" alt-text="Screenshot of outbound IPv6 public IP address.":::

1. Close the bastion connection to **myVM**.

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

# [**CLI**](#tab/dual-stack-outbound--cli)

---
## Clean up resources

When your finished with the resources created in this article, delete the resource group and all of the resources it contains.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **TutorialIPv6NATLB-rg**. Select **TutorialIPv6NATLB-rg** in the search results in **Resource groups**.

1. Select **Delete resource group**.

1. Enter **TutorialIPv6NATLB-rg** for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

# [**PowerShell**](#tab/dual-stack-outbound-powershell)

# [**CLI**](#tab/dual-stack-outbound--cli)

---

## Next steps

Advance to the next article to learn how to:
> [!div class="nextstepaction"]
> [Integrate NAT gateway in a hub and spoke network](tutorial-hub-spoke-route-nat.md)
