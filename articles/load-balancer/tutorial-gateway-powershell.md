---
title: 'Tutorial: Create a gateway load balancer - Azure PowerShell'
titleSuffix: Azure Load Balancer
description: Use this tutorial to learn how to create a gateway load balancer using Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 06/27/2023
ms.custom: template-tutorial, ignite-fall-2021, devx-track-azurepowershell, engagement-fy23
---

# Tutorial: Create a gateway load balancer using Azure PowerShell

Azure Load Balancer consists of Standard, Basic, and Gateway SKUs. Gateway Load Balancer is used for transparent insertion of Network Virtual Appliances (NVA). Use Gateway Load Balancer for scenarios that require high performance and high scalability of NVAs.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create virtual network.
> * Create network security group.
> * Create a gateway load balancer.
> * Chain a load balancer frontend to gateway load balancer.

## Prerequisites

- An Azure account with an active subscription.[Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing public standard SKU Azure Load Balancer. For more information on creating a load balancer, see **[Create a public load balancer using Azure PowerShell](quickstart-load-balancer-standard-public-powershell.md)**.
    - For the purposes of this tutorial, the existing load balancer in the examples is named **myLoadBalancer**.
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
New-AzResourceGroup -Name 'TutorGwLB-rg' -Location 'eastus'

```

## Create virtual network

A virtual network is needed for the resources that are in the backend pool of the gateway load balancer. Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the virtual network. Use [New-AzBastion](/powershell/module/az.network/new-azbastion) to deploy a bastion host for secure management of resources in virtual network.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

>

```azurepowershell-interactive
## Create backend subnet config ##
$subnet = @{
    Name = 'myBackendSubnet'
    AddressPrefix = '10.1.0.0/24'
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet 

## Create Azure Bastion subnet. ##
$bastsubnet = @{
    Name = 'AzureBastionSubnet' 
    AddressPrefix = '10.1.1.0/24'
}
$bastsubnetConfig = New-AzVirtualNetworkSubnetConfig @bastsubnet

## Create the virtual network ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'TutorGwLB-rg'
    Location = 'eastus'
    AddressPrefix = '10.1.0.0/16'
    Subnet = $subnetConfig,$bastsubnetConfig
}
$vnet = New-AzVirtualNetwork @net

## Create public IP address for bastion host. ##
$ip = @{
    Name = 'myBastionIP'
    ResourceGroupName = 'TutorGwLB-rg'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'Static'
}
$publicip = New-AzPublicIpAddress @ip

## Create bastion host ##
$bastion = @{
    ResourceGroupName = 'TutorGwLB-rg'
    Name = 'myBastion'
    PublicIpAddress = $publicip
    VirtualNetwork = $vnet
}
New-AzBastion @bastion -AsJob

```

## Create NSG

Use the following example to create a network security group. You'll configure the NSG rules needed for network traffic in the virtual network created previously.

Use [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) to create rules for the NSG. Use [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) to create the NSG.

```azurepowershell-interactive
## Create rule for network security group and place in variable. ##
$nsgrule1 = @{
    Name = 'myNSGRule-AllowAll'
    Description = 'Allow all'
    Protocol = '*'
    SourcePortRange = '*'
    DestinationPortRange = '*'
    SourceAddressPrefix = '0.0.0.0/0'
    DestinationAddressPrefix = '0.0.0.0/0'
    Access = 'Allow'
    Priority = '100'
    Direction = 'Inbound'
}
$rule1 = New-AzNetworkSecurityRuleConfig @nsgrule1

$nsgrule2 = @{
    Name = 'myNSGRule-AllowAll-TCP-Out'
    Description = 'Allow all TCP Out'
    Protocol = 'TCP'
    SourcePortRange = '*'
    DestinationPortRange = '*'
    SourceAddressPrefix = '0.0.0.0/0'
    DestinationAddressPrefix = '0.0.0.0/0'
    Access = 'Allow'
    Priority = '100'
    Direction = 'Outbound'
}
$rule2 = New-AzNetworkSecurityRuleConfig @nsgrule2

## Create network security group ##
$nsg = @{
    Name = 'myNSG'
    ResourceGroupName = 'TutorGwLB-rg'
    Location = 'eastus'
    SecurityRules = $rule1,$rule2
}
New-AzNetworkSecurityGroup @nsg
```

## Create Gateway Load Balancer

In this section, you'll create the configuration and deploy the gateway load balancer. Use [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig) to create the frontend IP configuration of the load balancer. 

You'll use [New-AzLoadBalancerTunnelInterface](/powershell/module/az.network/new-azloadbalancerfrontendipconfig) to create two tunnel interfaces for the load balancer. 

Create a backend pool with [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig) for the NVAs. 

A health probe is required to monitor the health of the backend instances in the load balancer. Use [New-AzLoadBalancerProbeConfig](/powershell/module/az.network/new-azloadbalancerprobeconfig) to create the health probe.

Traffic destined for the backend instances is routed with a load-balancing rule. Use [New-AzLoadBalancerRuleConfig](/powershell/module/az.network/new-azloadbalancerruleconfig)  to create the load-balancing rule.

To create the deploy the load balancer, use [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer).

```azurepowershell-interactive
## Place virtual network configuration in a variable for later use. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'TutorGwLB-rg'
}
$vnet = Get-AzVirtualNetwork @net

## Create load balancer frontend configuration and place in variable. ## 
$fe = @{
    Name = 'myFrontend'
    SubnetId = $vnet.subnets[0].id
}
$feip = New-AzLoadBalancerFrontendIpConfig @fe

## Create backend address pool configuration and place in variable. ## 
$int1 = @{
    Type = 'Internal'
    Protocol = 'Vxlan'
    Identifier = '800'
    Port = '10800'
}
$tunnelInterface1 = New-AzLoadBalancerBackendAddressPoolTunnelInterfaceConfig @int1

$int2 = @{
    Type = 'External'
    Protocol = 'Vxlan'
    Identifier = '801'
    Port = '10801'
}
$tunnelInterface2 = New-AzLoadBalancerBackendAddressPoolTunnelInterfaceConfig @int2

$pool = @{
    Name = 'myBackendPool'
    TunnelInterface = $tunnelInterface1,$tunnelInterface2
}
$bepool = New-AzLoadBalancerBackendAddressPoolConfig @pool

## Create the health probe and place in variable. ## 
$probe = @{
    Name = 'myHealthProbe'
    Protocol = 'http'
    Port = '80'
    IntervalInSeconds = '360'
    ProbeCount = '5'
    RequestPath = '/'
}
$healthprobe = New-AzLoadBalancerProbeConfig @probe

## Create the load balancer rule and place in variable. ## 
$para = @{
    Name = 'myLBRule'
    Protocol = 'All'
    FrontendPort = '0'
    BackendPort = '0'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bepool
    Probe = $healthprobe
}
$rule = New-AzLoadBalancerRuleConfig @para

## Create the load balancer resource. ## 
$lb = @{
    ResourceGroupName = 'TutorGwLB-rg'
    Name = 'myLoadBalancer-gw'
    Location = 'eastus'
    Sku = 'Gateway'
    LoadBalancingRule = $rule
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bepool
    Probe = $healthprobe
}
New-AzLoadBalancer @lb

```

## Add network virtual appliances to the Gateway Load Balancer backend pool
Deploy NVAs through the Azure Marketplace. Once deployed, add the virtual machines to the backend pool with [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)

## Chain load balancer frontend to Gateway Load Balancer

In this example, you'll chain the frontend of a standard load balancer to the gateway load balancer. 

You'll add the frontend to the frontend IP of an existing load balancer in your subscription.

Use [Set-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/set-azloadbalancerfrontendipconfig) to chain the gateway load balancer frontend to your existing load balancer.

```azurepowershell-interactive
## Place the gateway load balancer configuration into a variable. ##
$par1 = @{
    ResourceGroupName = 'TutorGwLB-rg'
    Name = 'myLoadBalancer-gw'
}
$gwlb = Get-AzLoadBalancer @par1

## Place the existing load balancer into a variable. ##
$par2 = @{
    ResourceGroupName = 'CreatePubLBQS-rg'
    Name = 'myLoadBalancer'
}
$lb = Get-AzLoadBalancer @par2

## Place the existing public IP for the existing load balancer into a variable.
$par3 = @{
    ResourceGroupName = 'CreatePubLBQS-rg'
    Name = 'myPublicIP'
}
$publicIP = Get-AzPublicIPAddress @par3

## Chain the gateway load balancer to your existing load balancer frontend. ##
$par4 = @{
    Name = 'myFrontEndIP'
    PublicIPAddress = $publicIP
    LoadBalancer = $lb
    GatewayLoadBalancerId = $gwlb.FrontendIpConfigurations.Id
}
$config = Set-AzLoadBalancerFrontendIpConfig @par4

$config | Set-AzLoadBalancer

```

## Chain virtual machine to Gateway Load Balancer

Alternatively, you can chain a VM's NIC IP configuration to the gateway load balancer. 

You'll add the gateway load balancer's frontend to an existing VM's NIC IP configuration.

Use [Set-AzNetworkInterfaceIpConfig](/powershell/module/az.network/set-aznetworkinterfaceipconfig) to chain the gateway load balancer frontend to your existing VM's NIC IP configuration.

```azurepowershell-interactive
 ## Place the gateway load balancer configuration into a variable. ##
$par1 = @{
    ResourceGroupName = 'TutorGwLB-rg'
    Name = 'myLoadBalancer-gw'
}
$gwlb = Get-AzLoadBalancer @par1

## Place the existing NIC into a variable. ##
$par2 = @{
    ResourceGroupName = 'MyResourceGroup'
    Name = 'myNic'
}
$nic = Get-AzNetworkInterface @par2

## Chain the gateway load balancer to your existing VM NIC. ##
$par3 = @{
    Name = 'myIPconfig'
    NetworkInterface = $nic
    GatewayLoadBalancerId = $gwlb.FrontendIpConfigurations.Id
}
$config = Set-AzNetworkInterfaceIpConfig @par3

$config | Set-AzNetworkInterface

```

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, load balancer, and the remaining resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'TutorGwLB-rg'
```

## Next steps

Create Network Virtual Appliances in Azure. 

When creating the NVAs, choose the resources created in this tutorial:

* Virtual network

* Subnet

* Network security group

* Gateway Load Balancer

Advance to the next article to learn how to create a cross-region Azure Load Balancer.
> [!div class="nextstepaction"]
> [Cross-region load balancer](tutorial-cross-region-powershell.md)
