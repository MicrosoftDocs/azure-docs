---
title: 'Quickstart: Create a public load balancer - Azure PowerShell'
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a load balancer using Azure PowerShell
services: load-balancer
documentationcenter: na
author: asudbring
manager: KumudD
Customer intent: I want to create a load balancer so that I can load balance internet traffic to VMs.
ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/13/2020
ms.author: allensu
ms:custom: seodec18
---

# Quickstart: Create a public load balancer to load balance VMs using Azure PowerShell

Get started with Azure Load Balancer by using Azure PowerShell to create a public load balancer and three virtual machines.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
New-AzResourceGroup -Name 'CreatePubLBQS-rg' -Location 'eastus'
```
---

# [**Standard SKU**](#tab/option-1-create-load-balancer-standard)

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads. For more information about skus, see **[Azure Load Balancer SKUs](skus.md)**.

## Create a public IP address

To access your web app on the Internet, you need a public IP address for the load balancer. 

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to:

```azurepowershell-interactive
$puplicip = @{
    Name = 'myPublicIP'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'static'
}
New-AzPublicIpAddress @publicip
```

To create a zonal public IP address in zone 1, use the following command:

```azurepowershell-interactive
$publicip = @{
    Name = 'myPublicIP'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'static'
    Zone = '1'
}
New-AzPublicIpAddress @publicip
```

## Create standard load balancer

This section details how you can create and configure the following components of the load balancer:

* Create a front-end IP with [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig) for the frontend IP pool. This IP receives the incoming traffic on the load balancer

* Create a back-end address pool with [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig) for traffic sent from the frontend of the load balancer. This pool is where your backend virtual machines are deployed.

* Create a health probe with [Add-AzLoadBalancerProbeConfig](/powershell/module/az.network/add-azloadbalancerprobeconfig) that determines the health of the backend VM instances.

* Create a load balancer rule with [Add-AzLoadBalancerRuleConfig](/powershell/module/az.network/add-azloadbalancerruleconfig) that defines how traffic is distributed to the VMs.

* Create a public load balancer with [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer).


```azurepowershell-interactive
## Place public IP created in previous steps into variable. ##
$publicIp = Get-AzPublicIpAddress -Name 'myPublicIP' -ResourceGroupName 'CreatePubLBQS-rg'

## Create load balancer frontend configuration and place in variable. ##
$feip = New-AzLoadBalancerFrontendIpConfig -Name 'myFrontEnd' -PublicIpAddress $publicIp

## Create backend address pool configuration and place in variable. ##
$bepool = New-AzLoadBalancerBackendAddressPoolConfig -Name 'myBackEndPool'

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
@lbrule = @{
    Name = 'myHTTPRule'
    Protocol = 'tcp'
    FrontendPort = '80'
    BackendPort = '80'
    IdleTimeoutInMinutes = '15'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bePool
}
$rule = New-AzLoadBalancerRuleConfig @lbrule -EnableTcpReset -DisableOutboundSNAT

## Create the load balancer resource. ##
$loadbalancer = @{
    ResourceGroupName = 'CreatePubLBQS-rg'
    Name = 'myLoadBalancer'
    Location = 'eastus'
    Sku = 'Standard'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bePool
    LoadBalancingRule = $rule
    Probe = $healthprobe
}
New-AzLoadBalancer @loadbalancer
```

## Configure virtual network

Before you deploy VMs and test your load balancer, create the supporting virtual network resources.

Create a virtual network for the backend virtual machines.

Create a network security group to define inbound connections to your virtual network.

### Create virtual network and network security group

* Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork).

* Create a network security group rule with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig).

* Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup).


```azurepowershell-interactive
## Create backend subnet config ##
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name 'myBackendSubnet' -AddressPrefix '10.0.0.0/24'

## Create the virtual network ##
$vnet = @{
    Name = 'myVNet'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'eastus'
    AddressPrefix = '10.0.0.0/16'
    Subnet = $subnetConfig
}
New-AzVirtualNetwork @vnet

## Create rule for network security group and place in variable. ##
$nsgrule = @{
    Name = 'myNSGRuleHTTP'
    Description = 'Allow HTTP'
    Protocol = '*'
    SourcePortRange = '*'
    DestinationPortRange = '80'
    SourceAddressPrefix = 'Internet'
    DestinationAddressPrefix = '*'
    Access = 'Allow'
    Priority = '2000'
    Direction = 'Inbound'
}
$rule1 = New-AzNetworkSecurityRuleConfig @nsgrule

## Create network security group ##
$nsg = {
    Name = 'myNSG'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'eastus'
    SecurityRules $rule1
}
New-AzNetworkSecurityGroup $nsg
```

## Create virtual machines

In this section you'll create the virtual machines for the backend pool of the load balancer.

* Create three network interfaces with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface).

* Set an administrator username and password for the VMs with [Get-Credential](/powershell/reference/5.1/microsoft.powershell.security/Get-Credential).

* Create the virtual machines with:
    * [New-AzVM](/powershell/module/az.compute/new-azvm)
    * [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig)
    * [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem)
    * [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage)
    * [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)


```azurepowershell-interactive
# Set the administrator and password for the VMs. ##
$cred = Get-Credential

## Place the virtual network into a variable. ##
$vnet = Get-AzVirtualNetwork -Name 'myVNet' -ResourceGroupName 'CreatePubLBQS-rg'

## Place the load balancer into a variable. ##
$lb = @{
    Name = 'myLoadBalancer'
    ResourceGroupName = 'CreatePubLBQS-rg'
}
$bepool = Get-AzLoadBalancer @lb  | Get-AzLoadBalancerBackendAddressPoolConfig

## Place the network security group into a variable. ##
$nsg = Get-AzNetworkSecurityGroup -Name 'myNSG' -ResourceGroupName 'CreatePubLBQS-rg'

## VM 1 ##
## Command to create network interface for VM1 ##
$nic1 = @{
    Name = 'myNicVM1'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'eastus'
    Subnet = $vnet.Subnets[0]
    NetworkSecurityGroup = $nsg
    LoadBalancerBackendAddressPool = $bepool
}
$nicVM1 = New-AzNetworkInterface $nic1 

## Create a virtual machine configuration for VM1 ##
$vmsz = @{
    VMName = 'myVM1'
    VMSize = 'Standard_DS1_v2'
}
$vmos = @{
    ComputerName = 'myVM1'
    Credential = $cred
}
$vmimage = @{
    PublisherName = 'MicrosoftWindowsServer'
    Offer = WindowsServer
    Skus = '2019-Datacenter'
    Version = 'latest'    
}
$vmConfig = 
New-AzVMConfig $vmsz | Set-AzVMOperatingSystem $vmos -Windows | Set-AzVMSourceImage $vmimage | Add-AzVMNetworkInterface -Id $nicVM1.Id

## Create the virtual machine for VM1 ##
$vm = @{
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'eastus'
    Zone = '1'
    VM = $vmConfig    
}
New-AzVM @vm

## VM 2 ##
## Command to create network interface for VM2 ##
$nic2 = @{
    Name = 'myNicVM2'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'eastus'
    Subnet = $vnet.Subnets[0]
    NetworkSecurityGroup = $nsg
    LoadBalancerBackendAddressPool = $bepool
}
$nicVM2 = New-AzNetworkInterface $nic2 

## Create a virtual machine configuration for VM2 ##
$vmsz = @{
    VMName = 'myVM2'
    VMSize = 'Standard_DS1_v2'
}
$vmos = @{
    ComputerName = 'myVM2'
    Credential = $cred
}
$vmimage = @{
    PublisherName = 'MicrosoftWindowsServer'
    Offer = WindowsServer
    Skus = '2019-Datacenter'
    Version = 'latest'    
}
$vmConfig = 
New-AzVMConfig $vmsz | Set-AzVMOperatingSystem $vmos -Windows | Set-AzVMSourceImage $vmimage | Add-AzVMNetworkInterface -Id $nicVM2.Id

## Create the virtual machine for VM2 ##
$vm = @{
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'eastus'
    Zone = '2'
    VM = $vmConfig    
}
New-AzVM @vm

## VM 3 ##
## Command to create network interface for VM3 ##
$nic3 = @{
    Name = 'myNicVM3'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'eastus'
    Subnet = $vnet.Subnets[0]
    NetworkSecurityGroup = $nsg
    LoadBalancerBackendAddressPool = $bepool
}
$nicVM3 = New-AzNetworkInterface $nic3 

## Create a virtual machine configuration for VM3 ##
$vmsz = @{
    VMName = 'myVM3'
    VMSize = 'Standard_DS1_v2'
}
$vmos = @{
    ComputerName = 'myVM3'
    Credential = $cred
}
$vmimage = @{
    PublisherName = 'MicrosoftWindowsServer'
    Offer = WindowsServer
    Skus = '2019-Datacenter'
    Version = 'latest'    
}
$vmConfig = 
New-AzVMConfig $vmsz | Set-AzVMOperatingSystem $vmos -Windows | Set-AzVMSourceImage $vmimage | Add-AzVMNetworkInterface -Id $nicVM2.Id

## Create the virtual machine for VM3 ##
$vm = @{
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'eastus'
    Zone = '3'
    VM = $vmConfig    
}
New-AzVM @vm
```

## Create outbound rule configuration
Load balancer outbound rules configure outbound source network address translation (SNAT) for VMs in the backend pool. 

For more information on outbound connections, see [Outbound connections in Azure](load-balancer-outbound-connections.md).

### Create outbound public IP address

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a standard zone redundant public IP address named **myPublicIPOutbound**.

```azurepowershell-interactive
$puplicip = @{
    Name = 'myPublicIPOutbound'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'static'
}
New-AzPublicIpAddress @publicip
```

To create a zonal public IP address in zone 1, use the following command:

```azurepowershell-interactive
$publicip = @{
    Name = 'myPublicIPOutbound'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'static'
    Zone = '1'
}
New-AzPublicIpAddress @publicip
```

### Create outbound configuration

* Create a new frontend IP configuration with [Add-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/add-azloadbalancerfrontendipconfig).

* Create a new outbound pool with [Add-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/add-azloadbalancerbackendaddresspoolconfig). 

* Apply the pool and frontend IP address to the load balancer with [Set-AzLoadBalancer](/powershell/module/az.network/set-azloadbalancer).
*  Create a new outbound rule for the outbound backend pool with [Add-AzLoadBalancerOutboundRuleConfig](/powershell/module/az.network/new-azloadbalanceroutboundruleconfig). 



```azurepowershell-interactive
## Place public IP created in previous steps into variable. ##
$publicIp = Get-AzPublicIpAddress -Name 'myPublicIPOutbound' -ResourceGroupName 'CreatePubLBQS-rg'

## Get the load balancer configuration ##
$lbc = @{
    ResourceGroupName = 'CreatePubLBQS-rg'
    Name = 'myLoadBalancer'
}
$lb = Get-AzLoadBalancer $lbc

## Create the frontend configuration ##
$fe = @{
    Name = 'myFrontEndOutbound'
    PublicIPAddress = $publicIP
}
$lb | Add-AzLoadBalancerFrontendIPConfig $fe | Set-AzLoadBalancer

## Create the outbound backend address pool ##
$be = @{
    Name = 'myBackEndPoolOutbound'
}
$lb | Add-AzLoadBalancerBackendAddressPoolConfig $be | Set-AzLoadBalancer

## Apply the outbound rule configuration to the load balancer. ##
$rule = @{
    Name = 'myOutboundRule'
    AllocatedOutboundPort = '10000'
    Protocol = 'All'
    IdleTimeoutInMinutes = '15'
    FrontendIPConfiguration = $lb.FrontendIpConfigurations[1]
    BackendAddressPool = $lb.BackendAddressPools[1]
}
$lb | Add-AzLoadBalancerOutBoundRuleConfig $rule | Set-AzLoadBalancer
```

### Add virtual machines to outbound pool

Add the virtual machine network interfaces to the outbound pool of the load balancer with [Add-AzNetworkInterfaceIpConfig](/powershell/module/az.network/add-aznetworkinterfaceipconfig):

```azurepowershell-interactive
## Get the load balancer configuration ##
$lbc = @{
    ResourceGroupName = 'CreatePubLBQS-rg'
    Name = 'myLoadBalancer'
}
$lb = Get-AzLoadBalancer $lbc

## Add VM1 ##
## Get the network interface configuration ##
$nic1 = {
    ResourceGroupName = 'CreatePubLBQS-rg'
    Name = 'myNicVM1'
}
$nic = Get-AzNetworkInterface $nic1

## Apply the backend to the network interface ##
$be = @{
    Name = 'ipconfig1'
    LoadBalancerBackendAddressPoolId = $lb.BackendAddressPools[0].id,$lb.BackendAddressPools[1].id
}
$nic | Set-AzNetworkInterfaceIpConfig $be | Set-AzNetworkInterface

## Add VM2 ##
## Get the network interface configuration ##
$nic2 = {
    ResourceGroupName = 'CreatePubLBQS-rg'
    Name = 'myNicVM2'
}
$nic = Get-AzNetworkInterface $nic2

## Apply the backend to the network interface ##
$be = @{
    Name = 'ipconfig1'
    LoadBalancerBackendAddressPoolId = $lb.BackendAddressPools[0].id,$lb.BackendAddressPools[1].id
}
$nic | Set-AzNetworkInterfaceIpConfig $be | Set-AzNetworkInterface

## Add VM3 ##
## Get the network interface configuration ##
$nic3 = {
    ResourceGroupName = 'CreatePubLBQS-rg'
    Name = 'myNicVM3'
}
$nic = Get-AzNetworkInterface $nic3

## Apply the backend to the network interface ##
$be = @{
    Name = 'ipconfig1'
    LoadBalancerBackendAddressPoolId = $lb.BackendAddressPools[0].id,$lb.BackendAddressPools[1].id
}
$nic | Set-AzNetworkInterfaceIpConfig $be | Set-AzNetworkInterface
```

# [**Basic SKU**](#tab/option-1-create-load-balancer-basic)

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads. For more information about skus, see **[Azure Load Balancer SKUs](skus.md)**.

## Create a public IP address in the Basic SKU

To access your web app on the Internet, you need a public IP address for the load balancer. 

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to:

* Create a standard zone redundant public IP address named **myPublicIP**.
* In **CreatePubLBQS-rg**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'CreatePubLBQS-rg'
$loc = 'eastus'
$pubIP = 'myPublicIP'
$sku = 'Basic'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku
```

## Create basic load balancer

This section details how you can create and configure the following components of the load balancer:

  * A frontend IP pool that receives the incoming network traffic on the load balancer.
  * A backend IP pool where the frontend pool sends the load balanced network traffic.
  * A health probe that determines health of the backend VM instances.
  * A load balancer rule that defines how traffic is distributed to the VMs.

### Create frontend IP

Create a front-end IP with [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig):

* Named **myFrontEnd**.
* Attached to public IP **myPublicIP**.

```azurepowershell-interactive
## Variables for the commands ##
$fe = 'myFrontEnd'
$rg = 'CreatePubLBQS-rg'
$loc = 'eastus'
$pubIP = 'myPublicIP'

$publicIp = 
Get-AzPublicIpAddress -Name $pubIP -ResourceGroupName $rg

$feip = 
New-AzLoadBalancerFrontendIpConfig -Name $fe -PublicIpAddress $publicIp
```

### Configure back-end address pool

Create a back-end address pool with [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig): 

* Named **myBackEndPool**.
* The VMs attach to this back-end pool in the remaining steps.

```azurepowershell-interactive
## Variable for the command ##
$be = 'myBackEndPool'

$bepool = 
New-AzLoadBalancerBackendAddressPoolConfig -Name $be
```

### Create the health probe

A health probe checks all virtual machine instances to ensure they can send network traffic. 

A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.

Create a health probe with [Add-AzLoadBalancerProbeConfig](/powershell/module/az.network/add-azloadbalancerprobeconfig):

* Monitors the health of the virtual machines.
* Named **myHealthProbe**.
* Protocol **TCP**.
* Monitoring **Port 80**.

```azurepowershell-interactive
## Variables for the command ##
$hp = 'myHealthProbe'
$pro = 'http'
$port = '80'
$int = '360'
$cnt = '5'

$probe = 
New-AzLoadBalancerProbeConfig -Name $hp -Protocol $pro -Port $port -RequestPath / -IntervalInSeconds $int -ProbeCount $cnt
```

### Create the load balancer rule

A load balancer rule defines:

* Frontend IP configuration for the incoming traffic.
* The backend IP pool to receive the traffic.
* The required source and destination port. 

Create a load balancer rule with [Add-AzLoadBalancerRuleConfig](/powershell/module/az.network/add-azloadbalancerruleconfig): 

* Named **myHTTPRule**
* Listening on **Port 80** in the frontend pool **myFrontEnd**.
* Sending load-balanced network traffic to the backend address pool **myBackEndPool** using **Port 80**. 
* Using health probe **myHealthProbe**.
* Protocol **TCP**.
* Idle timeout of **15 minutes**.


```azurepowershell-interactive
## Variables for the command ##
$lbr = 'myHTTPRule'
$pro = 'tcp'
$port = '80'
$idl = '15'

## $feip and $bePool are the variables from previous steps. ##

$rule = 
New-AzLoadBalancerRuleConfig -Name $lbr -Protocol $pro -Probe $probe -FrontendPort $port -BackendPort $port -FrontendIpConfiguration $feip -BackendAddressPool $bePool -IdleTimeoutInMinutes $idl
```

### Create load balancer resource

Create a public load Balancer with [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer):

* Named **myLoadBalancer**
* In **eastus**.
* In resource group **CreatePubLBQS-rg**.

```azurepowershell-interactive
## Variables for the command ##
$lbn = 'myLoadBalancer'
$rg = 'CreatePubLBQS-rg'
$loc = 'eastus'
$sku = 'Basic'

## $feip, $bepool, $probe, $rule are variables with configuration information from previous steps. ##

$lb = 
New-AzLoadBalancer -ResourceGroupName $rg -Name $lbn -SKU $sku -Location $loc -FrontendIpConfiguration $feip -BackendAddressPool $bepool -Probe $probe -LoadBalancingRule $rule
```

## Configure virtual network in the Basic SKU

Before you deploy VMs and test your load balancer, create the supporting virtual network resources.

### Create a virtual network

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork):

* Named **myVNet**.
* In resource group **CreatePubLBQS-rg**.
* Subnet named **myBackendSubnet**.
* Virtual network **10.0.0.0/16**.
* Subnet **10.0.0.0/24**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'CreatePubLBQS-rg'
$loc = 'eastus'
$sub = 'myBackendSubnet'
$spfx = '10.0.0.0/24'
$vnm = 'myVNet'
$vpfx = '10.0.0.0/16'


## Create backend subnet config ##
$subnetConfig = 
New-AzVirtualNetworkSubnetConfig -Name $sub -AddressPrefix $spfx

## Create the virtual network ##
$vnet = 
New-AzVirtualNetwork -ResourceGroupName $rg -Location $loc -Name $vnm -AddressPrefix $vpfx -Subnet $subnetConfig
```

### Create network security group
Create network security group to define inbound connections to your virtual network.

#### Create a network security group rule for port 80
Create a network security group rule with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig):

* Named **myNSGRuleHTTP**.
* Description of **Allow HTTP**.
* Access of **Allow**.
* Protocol **(*)**.
* Direction **Inbound**.
* Priority **2000**.
* Source of the **Internet**.
* Source port range of **(*)**.
* Destination address prefix of **(*)**.
* Destination **Port 80**.

```azurepowershell-interactive
## Variables for command ##
$rnm = 'myNSGRuleHTTP'
$des = 'Allow HTTP'
$acc = 'Allow'
$pro = '*'
$dir = 'Inbound'
$pri = '2000'
$spfx = 'Internet'
$spr = '*'
$dpfx = '*'
$dpr = '80'

$rule2 = 
New-AzNetworkSecurityRuleConfig -Name $rnm -Description $des -Access $acc -Protocol $pro -Direction $dir -Priority $pri -SourceAddressPrefix $spfx -SourcePortRange $spr -DestinationAddressPrefix $dpfx -DestinationPortRange $dpr
```

#### Create a network security group

Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup):

* Named **myNSG**.
* In resource group **CreatePubLBQS-rg**.
* In location **eastus**.
* With security rules created in previous steps stored in a variable.

```azurepowershell
## Variables for command ##
$rg = 'CreatePubLBQS-rg'
$loc = 'eastus'
$nmn = 'myNSG'

## $rule1 and $rule2 are variables with configuration information from the previous steps. ##
$nsg = 
New-AzNetworkSecurityGroup -ResourceGroupName $rg -Location $loc -Name $nmn -SecurityRules $rule1,$rule2
```

### Create network interfaces

Create three network interfaces with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface):

#### VM 1

* Named **myNicVM1**.
* In resource group **CreatePubLBQS-rg**.
* In location **eastus**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.
* Attached to load balancer **myLoadBalancer** in **myBackEndPool**.

```azurepowershell-interactive
## Variables for command ##
$rg = 'CreatePubLBQS-rg'
$loc = 'eastus'
$nic1 = 'myNicVM1'
$vnt = 'myVNet'
$lb = 'myLoadBalancer'
$ngn = 'myNSG'

## Command to get virtual network configuration. ##
$vnet = 
Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rg

## Command to get load balancer configuration
$bepool = 
Get-AzLoadBalancer -Name $lb -ResourceGroupName $rg | Get-AzLoadBalancerBackendAddressPoolConfig

## Command to get network security group configuration ##
$nsg = 
Get-AzNetworkSecurityGroup -Name $ngn -ResourceGroupName $rg

## Command to create network interface for VM1 ##
$nicVM1 = 
New-AzNetworkInterface -ResourceGroupName $rg -Location $loc -Name $nic1 -LoadBalancerBackendAddressPool $bepool -NetworkSecurityGroup $nsg -Subnet $vnet.Subnets[0]
```

#### VM 2

* Named **myNicVM2**.
* In resource group **CreatePubLBQS-rg**.
* In location **eastus**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.
* Attached to load balancer **myLoadBalancer** in **myBackEndPool**.

```azurepowershell-interactive
## Variables for command ##
$rg = 'CreatePubLBQS-rg'
$loc = 'eastus'
$nic2 = 'myNicVM2'
$vnt = 'myVNet'
$lb = 'myLoadBalancer'
$ngn = 'myNSG'

## Command to get virtual network configuration. ##
$vnet = 
Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rg

## Command to get load balancer configuration
$bepool = 
Get-AzLoadBalancer -Name $lb -ResourceGroupName $rg | Get-AzLoadBalancerBackendAddressPoolConfig

## Command to get network security group configuration ##
$nsg = 
Get-AzNetworkSecurityGroup -Name $ngn -ResourceGroupName $rg

## Command to create network interface for VM2 ##
$nicVM2 = 
New-AzNetworkInterface -ResourceGroupName $rg -Location $loc -Name $nic2 -LoadBalancerBackendAddressPool $bepool -NetworkSecurityGroup $nsg -Subnet $vnet.Subnets[0]
```

#### VM 3

* Named **myNicVM3**.
* In resource group **CreatePubLBQS-rg**.
* In location **eastus**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.
* Attached to load balancer **myLoadBalancer** in **myBackEndPool**.

```azurepowershell-interactive
## Variables for command ##
$rg = 'CreatePubLBQS-rg'
$loc = 'eastus'
$nic3 = 'myNicVM3'
$vnt = 'myVNet'
$lb = 'myLoadBalancer'
$ngn = 'myNSG'

## Command to get virtual network configuration. ##
$vnet = 
Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rg

## Command to get load balancer configuration
$bepool = 
Get-AzLoadBalancer -Name $lb -ResourceGroupName $rg | Get-AzLoadBalancerBackendAddressPoolConfig

## Command to get network security group configuration ##
$nsg = 
Get-AzNetworkSecurityGroup -Name $ngn -ResourceGroupName $rg

## Command to create network interface for VM3 ##
$nicVM3 = 
New-AzNetworkInterface -ResourceGroupName $rg -Location $loc -Name $nic3 -LoadBalancerBackendAddressPool $bepool -NetworkSecurityGroup $nsg -Subnet $vnet.Subnets[0]
```

### Create availability set for virtual machines

Use [New-AzAvailabilitySet](/powershell/module/az.compute/new-azvm) to create an availability set for the virtual machines:

* Named **myAvSet**.
* In resource group **CreatePubLBQS-rg**.
* In the **eastus** location.

```azurepowershell-interactive
## Variables used for the command. ##
$rg = 'CreatePubLBQS-rg'
$avs = 'myAvSet'
$loc = 'eastus'

New-AzAvailabilitySet -ResourceGroupName $rg -Name $avs -Location $loc
```

### Create virtual machines

Set an administrator username and password for the VMs with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```azurepowershell
$cred = Get-Credential
```

Create the virtual machines with:

* [New-AzVM](/powershell/module/az.compute/new-azvm)
* [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig)
* [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem)
* [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage)
* [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)


#### VM1

* Named **myVM1**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM1**.
* Attached to load balancer **myLoadBalancer**.
* In the **eastus** location.
* In the **myAvSet** availability set.

```azurepowershell-interactive
## Variables used for command. ##
$rg = 'CreatePubLBQS-rg'
$vm = 'myVM1'
$siz = 'Standard_DS1_v2'
$pub = 'MicrosoftWindowsServer'
$off = 'WindowsServer'
$sku = '2019-Datacenter'
$ver = 'latest'
$loc = 'eastus'
$avs = 'myAvSet'

## Create a virtual machine configuration. $cred and $nicVM1 are variables with configuration from the previous steps. ##

$vmConfig = 
New-AzVMConfig -VMName $vm -VMSize $siz | Set-AzVMOperatingSystem -Windows -ComputerName $vm -Credential $cred | Set-AzVMSourceImage -PublisherName $pub -Offer WindowsServer -Skus $sku -Version $ver | Add-AzVMNetworkInterface -Id $nicVM1.Id

## Create the virtual machine ##
New-AzVM -ResourceGroupName $rg -Location $loc -VM $vmConfig -AvailabilitySetName $avs
```


#### VM2

* Named **myVM2**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM2**.
* Attached to load balancer **myLoadBalancer**.
* In the **eastus** location.
* In the **myAvSet** availability set.

```azurepowershell-interactive
## Variables used for command. ##
$rg = 'CreatePubLBQS-rg'
$vm = 'myVM2'
$siz = 'Standard_DS1_v2'
$pub = 'MicrosoftWindowsServer'
$off = 'WindowsServer'
$sku = '2019-Datacenter'
$ver = 'latest'
$loc = 'eastus'
$avs = 'myAvSet'

## Create a virtual machine configuration. $cred and $nicVM2 are variables with configuration from the previous steps. ##

$vmConfig = 
New-AzVMConfig -VMName $vm -VMSize $siz | Set-AzVMOperatingSystem -Windows -ComputerName $vm -Credential $cred | Set-AzVMSourceImage -PublisherName $pub -Offer WindowsServer -Skus $sku -Version $ver | Add-AzVMNetworkInterface -Id $nicVM2.Id

## Create the virtual machine ##
New-AzVM -ResourceGroupName $rg -Location $loc -VM $vmConfig -AvailabilitySetName $avs
```

#### VM3

* Named **myVM3**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM3**.
* Attached to load balancer **myLoadBalancer**.
* In the **eastus** location.
* In the **myAvSet** availability set.

```azurepowershell-interactive
## Variables used for command. ##
$rg = 'CreatePubLBQS-rg'
$vm = 'myVM3'
$siz = 'Standard_DS1_v2'
$pub = 'MicrosoftWindowsServer'
$off = 'WindowsServer'
$sku = '2019-Datacenter'
$ver = 'latest'
$loc = 'eastus'
$avs = 'myAvSet'

## Create a virtual machine configuration. $cred and $nicVM3 are variables with configuration from the previous steps. ##

$vmConfig = 
New-AzVMConfig -VMName $vm -VMSize $siz | Set-AzVMOperatingSystem -Windows -ComputerName $vm -Credential $cred | Set-AzVMSourceImage -PublisherName $pub -Offer WindowsServer -Skus $sku -Version $ver | Add-AzVMNetworkInterface -Id $nicVM3.Id

## Create the virtual machine ##
New-AzVM -ResourceGroupName $rg -Location $loc -VM $vmConfig -AvailabilitySetName $avs
```

It takes a few minutes to create and configure the three VMs.

---

## Install IIS

Use [Set-AzVMExtension](https://docs.microsoft.com/powershell/module/az.compute/set-azvmextension) to install the Custom Script Extension. 

The extension runs PowerShell Add-WindowsFeature Web-Server to install the IIS webserver and then updates the Default.htm page to show the hostname of the VM:

### VM1 

```azurepowershell-interactive
## Variables for command. ##
$rg = 'CreatePubLBQS-rg'
$enm = 'IIS'
$vmn = 'myVM1'
$loc = 'eastus'
$pub = 'Microsoft.Compute'
$ext = 'CustomScriptExtension'
$typ = '1.8'

Set-AzVMExtension -ResourceGroupName $rg -ExtensionName $enm -VMName $vmn -Location $loc -Publisher $pub -ExtensionType $ext -TypeHandlerVersion $typ -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
```

### VM2 

```azurepowershell-interactive
## Variables for command. ##
$rg = 'CreatePubLBQS-rg'
$enm = 'IIS'
$vmn = 'myVM2'
$loc = 'eastus'
$pub = 'Microsoft.Compute'
$ext = 'CustomScriptExtension'
$typ = '1.8'

Set-AzVMExtension -ResourceGroupName $rg -ExtensionName $enm -VMName $vmn -Location $loc -Publisher $pub -ExtensionType $ext -TypeHandlerVersion $typ -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
```

### VM3

```azurepowershell-interactive
## Variables for command. ##
$rg = 'CreatePubLBQS-rg'
$enm = 'IIS'
$vmn = 'myVM3'
$loc = 'eastus'
$pub = 'Microsoft.Compute'
$ext = 'CustomScriptExtension'
$typ = '1.8'

Set-AzVMExtension -ResourceGroupName $rg -ExtensionName $enm -VMName $vmn -Location $loc -Publisher $pub -ExtensionType $ext -TypeHandlerVersion $typ -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
```

## Test the load balancer

Use [Get-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/get-azpublicipaddress) to get the public IP address of the load balancer:

```azurepowershell-interactive
  ## Variables for command. ##
  $rg = 'CreatePubLBQS-rg'
  $ipn = 'myPublicIP'
    
  Get-AzPublicIPAddress -ResourceGroupName $rg -Name $ipn | select IpAddress
```

Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

   ![IIS Web server](./media/tutorial-load-balancer-standard-zonal-portal/load-balancer-test.png)

To see the load balancer distribute traffic across all three VMs, you can customize the default page of each VM's IIS Web server and then force-refresh your web browser from the client machine.

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, load balancer, and the remaining resources.

```azurepowershell-interactive
## Variable for command. ##
$rg = 'CreatePubLBQS-rg'

Remove-AzResourceGroup -Name $rg
```

## Next steps

In this quickstart

* You created a standard or basic public load balancer
* Attached virtual machines. 
* Configured the load balancer traffic rule and health probe.
* Tested the load balancer.

To learn more about Azure Load Balancer, continue to..
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)


