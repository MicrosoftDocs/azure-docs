---
title: 'Tutorial: Create cross-region load balancer using Azure PowerShell'
description: Get started with this tutorial creating a cross region load balancer with Azure PowerShell.
author: asudbring
ms.author: allesu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 09/01/2020
---

# Tutorial: Create cross-region load balancer using Azure PowerShell

Get started creating a cross-region load balancer using Azure PowerShell. This article shows you how to create a cross-region load balancer associated with two regional load balancers.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create two standard public load balancers and virtual machines in two Azure regions.
> * Install IIS and change default web page on virtual machines in both regions.
> * Create the cross-region load balancer.
> * Add regional load balancers to cross-region load balancer.
> * Test load balancer from two regions

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription.
- Azure PowerShell module installed locally or use the Azure Cloud Shell.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Sign in to Azure PowerShell

Use [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=latest) to sign in to Azure PowerShell.

```azurepowershell-interactive
Connect-AzAccount
```

## Create standard load balancer in region 1

### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

* Named **myResourceGroupLB-R1**.
* In the **eastus** location.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-R1'
$loc = 'eastus'

New-AzResourceGroup -Name $rg -Location $loc
```
## Create a public IP address

To access your web app on the Internet, you need a public IP address for the load balancer. 

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to:

* Create a standard zone redundant public IP address named **myPublicIP-R1**.
* In **myResourceGroupLB-R1**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-R1'
$loc = 'eastus'
$pubIP = 'myPublicIP-R1'
$sku = 'Standard'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku
```

To create a zonal public IP address in zone 1, use the following command:

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-R1'
$loc = 'eastus'
$pubIP = 'myPublicIP-R1'
$sku = 'Standard'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku -zone 1
```

## Create standard load balancer

This section details how you can create and configure the following components of the load balancer:

  * A frontend IP pool that receives the incoming network traffic on the load balancer.
  * A backend IP pool where the frontend pool sends the load balanced network traffic.
  * A health probe that determines health of the backend VM instances.
  * A load balancer rule that defines how traffic is distributed to the VMs.

### Create frontend IP

Create a front-end IP with [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig):

* Named **myFrontEnd-R1**.
* Attached to public IP **myPublicIP-R1**.

```azurepowershell-interactive
## Variables for the commands ##
$fe = 'myFrontEnd-R1'
$rg = 'MyResourceGroupLB-R1'
$loc = 'eastus'
$pubIP = 'myPublicIP-R1'

$publicIp = 
Get-AzPublicIpAddress -Name $pubIP -ResourceGroupName $rg

$feip = 
New-AzLoadBalancerFrontendIpConfig -Name $fe -PublicIpAddress $publicIp
```

### Configure back-end address pool

Create a back-end address pool with [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig): 

* Named **myBackEndPool-R1**.
* The VMs attach to this back-end pool in the remaining steps.

```azurepowershell-interactive
## Variable for the command ##
$be = 'myBackEndPool-R1'

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
* Listening on **Port 80** in the frontend pool **myFrontEnd-R1**.
* Sending load-balanced network traffic to the backend address pool **myBackEndPool-R1** using **Port 80**. 
* Using health probe **myHealthProbe**.
* Protocol **TCP**.

```azurepowershell-interactive
## Variables for the command ##
$lbr = 'myHTTPRule'
$pro = 'tcp'
$port = '80'

## $feip and $bePool are the variables from previous steps. ##

$rule = 
New-AzLoadBalancerRuleConfig -Name $lbr -Protocol $pro -Probe $probe -FrontendPort $port -BackendPort $port -FrontendIpConfiguration $feip -BackendAddressPool $bePool -DisableOutboundSNAT
```

### Create load balancer resource

Create a public load Balancer with [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer):

* Named **myLoadBalancer-R1**
* In **eastus**.
* In resource group **myResourceGroupLB-R1**.

```azurepowershell-interactive
## Variables for the command ##
$lbn = 'myLoadBalancer-R1'
$rg = 'myResourceGroupLB-R1'
$loc = 'eastus'
$sku = 'Standard'

## $feip, $bepool, $probe, $rule are variables with configuration information from previous steps. ##

$lb = 
New-AzLoadBalancer -ResourceGroupName $rg -Name $lbn -SKU $sku -Location $loc -FrontendIpConfiguration $feip -BackendAddressPool $bepool -Probe $probe -LoadBalancingRule $rule
```

## Configure virtual network

Before you deploy VMs and test your load balancer, create the supporting virtual network resources.

### Create a virtual network

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork):

* Named **myVNet-R1**.
* In resource group **myResourceGroupLB-R1**.
* Subnet named **myBackendSubnet-R1**.
* Virtual network **10.0.0.0/16**.
* Subnet **10.0.0.0/24**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'myResourceGroupLB-R1'
$loc = 'eastus'
$sub = 'myBackendSubnet-R1'
$spfx = '10.0.0.0/24'
$vnm = 'myVNet-R1'
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

$rule1 = 
New-AzNetworkSecurityRuleConfig -Name $rnm -Description $des -Access $acc -Protocol $pro -Direction $dir -Priority $pri -SourceAddressPrefix $spfx -SourcePortRange $spr -DestinationAddressPrefix $dpfx -DestinationPortRange $dpr
```

#### Create a network security group

Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup):

* Named **myNSG-R1**.
* In resource group **myResourceGroupLB-R1**.
* In location **eastus**.
* With security rules created in previous steps stored in a variable.

```azurepowershell
## Variables for command ##
$rg = 'myResourceGroup-R1'
$loc = 'eastus'
$nmn = 'myNSG-R1'

## $rule1 contains configuration information from the previous steps. ##
$nsg = 
New-AzNetworkSecurityGroup -ResourceGroupName $rg -Location $loc -Name $nmn -SecurityRules $rule1
```

### Create network interfaces

Create three network interfaces with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface):

#### VM1 - Region 1

* Named **myNicVM1-R1**.
* In resource group **myResourceGroupLB-R1**.
* In location **eastus**.
* In virtual network **myVNet-R1**.
* In subnet **myBackendSubnet-R1**.
* In network security group **myNSG-R1**.
* Attached to load balancer **myLoadBalancer-R1** in **myBackEndPool-R1**.

```azurepowershell-interactive
## Variables for command ##
$rg = 'myResourceGroupLB-R1'
$loc = 'eastus'
$nic1 = 'myNicVM1-R1'
$vnt = 'myVNet-R1'
$lb = 'myLoadBalancer-R1'
$ngn = 'myNSG-R1'

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

#### VM2 - Region 1

* Named **myNicVM2-R1**.
* In resource group **myResourceGroupLB-R1**.
* In location **eastus**.
* In virtual network **myVNet-R1**.
* In subnet **myBackendSubnet-R1**.
* In network security group **myNSG-R1**.
* Attached to load balancer **myLoadBalancer-R1** in **myBackEndPool-R1**.

```azurepowershell-interactive
## Variables for command ##
$rg = 'myResourceGroupLB-R1'
$loc = 'eastus'
$nic2 = 'myNicVM2-R1'
$vnt = 'myVNet-R1'
$lb = 'myLoadBalancer-R1'
$ngn = 'myNSG-R1'

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


#### VM1 - Region 1

* Named **myVM1-R1**.
* In resource group **myResourceGroupLB-R1**.
* Attached to network interface **myNicVM1-R1**.
* Attached to load balancer **myLoadBalancer-R1**.
* In **Zone 1**.
* In the **eastus** location.

```azurepowershell-interactive
## Variables used for command. ##
$rg = 'myResourceGroupLB-R1'
$vm = 'myVM1-R1'
$siz = 'Standard_DS1_v2'
$pub = 'MicrosoftWindowsServer'
$off = 'WindowsServer'
$sku = '2019-Datacenter'
$ver = 'latest'
$zn = '1'
$loc = 'eastus'

## Create a virtual machine configuration. $cred and $nicVM1 are variables with configuration from the previous steps. ##

$vmConfig = 
New-AzVMConfig -VMName $vm -VMSize $siz | Set-AzVMOperatingSystem -Windows -ComputerName $vm -Credential $cred | Set-AzVMSourceImage -PublisherName $pub -Offer WindowsServer -Skus $sku -Version $ver | Add-AzVMNetworkInterface -Id $nicVM1.Id

## Create the virtual machine ##
New-AzVM -ResourceGroupName $rg -Zone $zn -Location $loc -VM $vmConfig
```

#### VM2 - Region 1

* Named **myVM2-R1**.
* In resource group **myResourceGroupLB-R1**.
* Attached to network interface **myNicVM2-R1**.
* Attached to load balancer **myLoadBalancer-R1**.
* In **Zone 2**.
* In the **eastus** location.

```azurepowershell-interactive
## Variables used for command. ##
$rg = 'myResourceGroupLB-R1'
$vm = 'myVM2-R1'
$siz = 'Standard_DS1_v2'
$pub = 'MicrosoftWindowsServer'
$off = 'WindowsServer'
$sku = '2019-Datacenter'
$ver = 'latest'
$zn = '2'
$loc = 'eastus'

## Create a virtual machine configuration. $cred and $nicVM2 are variables with configuration from the previous steps. ##

$vmConfig = 
New-AzVMConfig -VMName $vm -VMSize $siz | Set-AzVMOperatingSystem -Windows -ComputerName $vm -Credential $cred | Set-AzVMSourceImage -PublisherName $pub -Offer WindowsServer -Skus $sku -Version $ver | Add-AzVMNetworkInterface -Id $nicVM2.Id

## Create the virtual machine ##
New-AzVM -ResourceGroupName $rg -Zone $zn -Location $loc -VM $vmConfig
```

## Create outbound rule configuration
Load balancer outbound rules configure outbound source network address translation (SNAT) for VMs in the backend pool. 

For more information on outbound connections, see [Outbound connections in Azure](load-balancer-outbound-connections.md).

### Create outbound public IP address

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to:

* Create a standard zone redundant public IP address named **myPublicIPOutbound-R1**.
* In **myResourceGroupLB-R1**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-R1'
$loc = 'eastus'
$pubIP = 'myPublicIPOutbound-R1'
$sku = 'Standard'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku
```

To create a zonal public IP address in zone 1, use the following command:

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-R1'
$loc = 'eastus'
$pubIP = 'myPublicIPOutbound-R1'
$sku = 'Standard'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku -zone 1
```
### Create outbound frontend IP configuration

Create a new frontend IP configuration with [Add-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/add-azloadbalancerfrontendipconfig):

* Named **myFrontEndOutbound-R1**.
* Associated with public IP address **myPublicIPOutbound-R1**.

```azurepowershell-interactive
## Variables for the command ##
$fen = 'myFrontEndOutbound-R1'
$lbn = 'myLoadBalancer-R1'

## Get the load balancer configuration  and apply the frontend config##
Get-AzLoadBalancer -Name $lbn -ResourceGroupName $rg | Add-AzLoadBalancerFrontendIPConfig -Name $fen -PublicIpAddress $publicIP | Set-AzLoadBalancer
```

### Create outbound pool

Create a new outbound pool with [Add-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/add-azloadbalancerbackendaddresspoolconfig). 

Apply the pool and frontend IP address to the load balancer with [Set-AzLoadBalancer](/powershell/module/az.network/set-azloadbalancer):

* Named **myBackEndPoolOutbound-R1**.

```azurepowershell-interactive
## Variables for the command ##
$ben = 'myBackEndPoolOutbound-R1'
$lbn = 'myLoadBalancer-R1'
$rg = 'myResourceGroupLB-R1'

## Get the load balancer configuration and create the outbound backend address pool##
Get-AzLoadBalancer -Name $lbn -ResourceGroupName $rg | Add-AzLoadBalancerBackendAddressPoolConfig -Name $ben | Set-AzLoadBalancer
```
### Create outbound rule and apply to load balancer

Create a new outbound rule for the outbound backend pool with [Add-AzLoadBalancerOutboundRuleConfig](/powershell/module/az.network/new-azloadbalanceroutboundruleconfig). 

Apply the rule to the load balancer with [Set-AzLoadBalancer](/powershell/module/az.network/set-azloadbalancer):

* Named **myOutboundRule**.
* Associated with load balancer **myLoadBalancer-R1**.
* Associated with frontend **myFrontEndOutbound-R1**.
* Protocol **All**.
* Idle timeout of **15**.
* **10000** outbound ports.
* Associated with backend pool **myBackEndPoolOutbound-R1**.
* In resource group **myResourceGroupLB-R1**.

```azurepowershell-interactive
## Variables for the commands ##
$rg = 'myResourceGroupLB-R1'
$lbn = 'myLoadBalancer-R1'
$brn = 'myOutboundRule'
$pro = 'All'
$idl = '15'
$por = '10000'

## Get the load balancer configuration ##
$lb = 
Get-AzLoadBalancer -Name $lbn -ResourceGroupName $rg 

## Apply the outbound rule configuration to the load balancer. ##
$lb | Add-AzLoadBalancerOutBoundRuleConfig -Name $brn -FrontendIPConfiguration $lb.FrontendIpConfigurations[1] -BackendAddressPool $lb.BackendAddressPools[1] -Protocol $pro -IdleTimeoutInMinutes $idl -AllocatedOutboundPort $por | Set-AzLoadBalancer
```

### Add virtual machines to outbound pool

Add the virtual machine network interfaces to the outbound pool of the load balancer with [Add-AzNetworkInterfaceIpConfig](/powershell/module/az.network/add-aznetworkinterfaceipconfig):


#### VM1 - Region 1
* In backend address pool **myBackEndPoolOutbound-R1**.
* In resource group **myResourceGroupLB-R1**.
* Associated with network interface **myNicVM1-R1** and **ipconfig1**.
* Associated with load balancer **myLoadBalancer-R1**.

```azurepowershell-interactive
## Variables for the commands ##
$rg = 'myResourceGroupLB-R1'
$lbn = 'myLoadBalancer-R1'
$bep = 'myBackEndPoolOutbound-R1'
$nic1 = 'myNicVM1-R1'
$ipc = 'ipconfig1'

## Get the load balancer configuration ##
$lb = 
Get-AzLoadBalancer -Name $lbn -ResourceGroupName $rg

## Get the network interface configuration ##
$nic = 
Get-AzNetworkInterface -Name $nic1 -ResourceGroupName $rg

## Apply the backend to the network interface ##
$nic | Set-AzNetworkInterfaceIpConfig -Name $ipc -LoadBalancerBackendAddressPoolId $lb.BackendAddressPools[0].id,$lb.BackendAddressPools[1].id | Set-AzNetworkInterface
```

#### VM2 - Region 1
* In backend address pool **myBackEndPoolOutbound-R1**.
* In resource group **myResourceGroupLB-R1**.
* Associated with network interface **myNicVM2-R1** and **ipconfig1**.
* Associated with load balancer **myLoadBalancer-R1**.

```azurepowershell-interactive
## Variables for the commands ##
$rg = 'myResourceGroupLB-R1'
$lbn = 'myLoadBalancer-R1'
$bep = 'myBackEndPoolOutbound-R1'
$nic2 = 'myNicVM2-R1'
$ipc = 'ipconfig1'

## Get the load balancer configuration ##
$lb = 
Get-AzLoadBalancer -Name $lbn -ResourceGroupName $rg

## Get the network interface configuration ##
$nic = 
Get-AzNetworkInterface -Name $nic2 -ResourceGroupName $rg

## Apply the backend to the network interface ##
$nic | Set-AzNetworkInterfaceIpConfig -Name $ipc -LoadBalancerBackendAddressPoolId $lb.BackendAddressPools[0].id,$lb.BackendAddressPools[1].id | Set-AzNetworkInterface
```

## Install IIS on virtual machines in region 1

Use [Set-AzVMExtension](https://docs.microsoft.com/powershell/module/az.compute/set-azvmextension?view=latest) to install the Custom Script Extension. 

The extension runs PowerShell Add-WindowsFeature Web-Server to install the IIS webserver and then updates the Default.htm page to show the hostname of the VM:

### VM1 - Region 1

```azurepowershell-interactive
## Variables for command. ##
$rg = 'myResourceGroupLB-R1'
$enm = 'IIS'
$vmn = 'myVM1-R1'
$loc = 'eastus'
$pub = 'Microsoft.Compute'
$ext = 'CustomScriptExtension'
$typ = '1.8'

Set-AzVMExtension -ResourceGroupName $rg -ExtensionName $enm -VMName $vmn -Location $loc -Publisher $pub -ExtensionType $ext -TypeHandlerVersion $typ -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
```

### VM2 - Region 1

```azurepowershell-interactive
## Variables for command. ##
$rg = 'myResourceGroupLB-R1'
$enm = 'IIS'
$vmn = 'myVM2-R1'
$loc = 'eastus'
$pub = 'Microsoft.Compute'
$ext = 'CustomScriptExtension'
$typ = '1.8'

Set-AzVMExtension -ResourceGroupName $rg -ExtensionName $enm -VMName $vmn -Location $loc -Publisher $pub -ExtensionType $ext -TypeHandlerVersion $typ -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
```

## Create standard load balancer in region 2

### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

* Named **myResourceGroupLB-R2**.
* In the **westus** location.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-R2'
$loc = 'westus'

New-AzResourceGroup -Name $rg -Location $loc
```
## Create a public IP address

To access your web app on the Internet, you need a public IP address for the load balancer. 

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to:

* Create a standard zone redundant public IP address named **myPublicIP-R2**.
* In **myResourceGroupLB-R2**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-R2'
$loc = 'westus'
$pubIP = 'myPublicIP-R2'
$sku = 'Standard'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku
```

To create a zonal public IP address in zone 1, use the following command:

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-R2'
$loc = 'westus'
$pubIP = 'myPublicIP-R2'
$sku = 'Standard'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku -zone 1
```

## Create standard load balancer

This section details how you can create and configure the following components of the load balancer:

  * A frontend IP pool that receives the incoming network traffic on the load balancer.
  * A backend IP pool where the frontend pool sends the load balanced network traffic.
  * A health probe that determines health of the backend VM instances.
  * A load balancer rule that defines how traffic is distributed to the VMs.

### Create frontend IP

Create a front-end IP with [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig):

* Named **myFrontEnd-R2**.
* Attached to public IP **myPublicIP-R2**.

```azurepowershell-interactive
## Variables for the commands ##
$fe = 'myFrontEnd-R2'
$rg = 'MyResourceGroupLB-R2'
$loc = 'westus'
$pubIP = 'myPublicIP-R2'

$publicIp = 
Get-AzPublicIpAddress -Name $pubIP -ResourceGroupName $rg

$feip = 
New-AzLoadBalancerFrontendIpConfig -Name $fe -PublicIpAddress $publicIp
```

### Configure back-end address pool

Create a back-end address pool with [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig): 

* Named **myBackEndPool-R2**.
* The VMs attach to this back-end pool in the remaining steps.

```azurepowershell-interactive
## Variable for the command ##
$be = 'myBackEndPool-R2'

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
* Listening on **Port 80** in the frontend pool **myFrontEnd-R2**.
* Sending load-balanced network traffic to the backend address pool **myBackEndPool-R2** using **Port 80**. 
* Using health probe **myHealthProbe**.
* Protocol **TCP**.

```azurepowershell-interactive
## Variables for the command ##
$lbr = 'myHTTPRule'
$pro = 'tcp'
$port = '80'

## $feip and $bePool are the variables from previous steps. ##

$rule = 
New-AzLoadBalancerRuleConfig -Name $lbr -Protocol $pro -Probe $probe -FrontendPort $port -BackendPort $port -FrontendIpConfiguration $feip -BackendAddressPool $bePool -DisableOutboundSNAT
```

### Create load balancer resource

Create a public load Balancer with [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer):

* Named **myLoadBalancer-R2**
* In **westus**.
* In resource group **myResourceGroupLB-R12*.

```azurepowershell-interactive
## Variables for the command ##
$lbn = 'myLoadBalancer-R2'
$rg = 'myResourceGroupLB-R2'
$loc = 'westus'
$sku = 'Standard'

## $feip, $bepool, $probe, $rule are variables with configuration information from previous steps. ##

$lb = 
New-AzLoadBalancer -ResourceGroupName $rg -Name $lbn -SKU $sku -Location $loc -FrontendIpConfiguration $feip -BackendAddressPool $bepool -Probe $probe -LoadBalancingRule $rule
```

## Configure virtual network

Before you deploy VMs and test your load balancer, create the supporting virtual network resources.

### Create a virtual network

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork):

* Named **myVNet-R2**.
* In resource group **myResourceGroupLB-R2**.
* Subnet named **myBackendSubnet-R2**.
* Virtual network **10.1.0.0/16**.
* Subnet **10.1.0.0/24**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'myResourceGroupLB-R2'
$loc = 'westus'
$sub = 'myBackendSubnet-R2'
$spfx = '10.1.0.0/24'
$vnm = 'myVNet-R2'
$vpfx = '10.1.0.0/16'


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

$rule1 = 
New-AzNetworkSecurityRuleConfig -Name $rnm -Description $des -Access $acc -Protocol $pro -Direction $dir -Priority $pri -SourceAddressPrefix $spfx -SourcePortRange $spr -DestinationAddressPrefix $dpfx -DestinationPortRange $dpr
```

#### Create a network security group

Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup):

* Named **myNSG-R2**.
* In resource group **myResourceGroupLB-R2**.
* In location **westus**.
* With security rules created in previous steps stored in a variable.

```azurepowershell
## Variables for command ##
$rg = 'myResourceGroup-R2'
$loc = 'westus'
$nmn = 'myNSG-R2'

## $rule1 contains configuration information from the previous steps. ##
$nsg = 
New-AzNetworkSecurityGroup -ResourceGroupName $rg -Location $loc -Name $nmn -SecurityRules $rule1
```

### Create network interfaces

Create three network interfaces with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface):

#### VM1 - Region 2

* Named **myNicVM1-R2**.
* In resource group **myResourceGroupLB-R2**.
* In location **westus**.
* In virtual network **myVNet-R2**.
* In subnet **myBackendSubnet-R2**.
* In network security group **myNSG-R2**.
* Attached to load balancer **myLoadBalancer-R2** in **myBackEndPool-R2**.

```azurepowershell-interactive
## Variables for command ##
$rg = 'myResourceGroupLB-R2'
$loc = 'westus'
$nic1 = 'myNicVM1-R2'
$vnt = 'myVNet-R2'
$lb = 'myLoadBalancer-R2'
$ngn = 'myNSG-R2'

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

#### VM2 - Region 2

* Named **myNicVM2-R2**.
* In resource group **myResourceGroupLB-R2**.
* In location **westus**.
* In virtual network **myVNet-R2**.
* In subnet **myBackendSubnet-R2**.
* In network security group **myNSG-R2**.
* Attached to load balancer **myLoadBalancer-R2** in **myBackEndPool-R2**.

```azurepowershell-interactive
## Variables for command ##
$rg = 'myResourceGroupLB-R2'
$loc = 'eastus'
$nic2 = 'myNicVM2-R2'
$vnt = 'myVNet-R2'
$lb = 'myLoadBalancer-R2'
$ngn = 'myNSG-R2'

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


#### VM1 - Region 2

* Named **myVM1-R2**.
* In resource group **myResourceGroupLB-R2**.
* Attached to network interface **myNicVM1-R2**.
* Attached to load balancer **myLoadBalancer-R2**.
* In **Zone 1**.
* In the **westus** location.

```azurepowershell-interactive
## Variables used for command. ##
$rg = 'myResourceGroupLB-R2'
$vm = 'myVM1-R2'
$siz = 'Standard_DS1_v2'
$pub = 'MicrosoftWindowsServer'
$off = 'WindowsServer'
$sku = '2019-Datacenter'
$ver = 'latest'
$zn = '1'
$loc = 'westus'

## Create a virtual machine configuration. $cred and $nicVM1 are variables with configuration from the previous steps. ##

$vmConfig = 
New-AzVMConfig -VMName $vm -VMSize $siz | Set-AzVMOperatingSystem -Windows -ComputerName $vm -Credential $cred | Set-AzVMSourceImage -PublisherName $pub -Offer WindowsServer -Skus $sku -Version $ver | Add-AzVMNetworkInterface -Id $nicVM1.Id

## Create the virtual machine ##
New-AzVM -ResourceGroupName $rg -Zone $zn -Location $loc -VM $vmConfig
```

#### VM2 - Region 2

* Named **myVM2-R2**.
* In resource group **myResourceGroupLB-R2**.
* Attached to network interface **myNicVM2-R2**.
* Attached to load balancer **myLoadBalancer-R2**.
* In **Zone 2**.
* In the **westus** location.

```azurepowershell-interactive
## Variables used for command. ##
$rg = 'myResourceGroupLB-R2'
$vm = 'myVM2-R2'
$siz = 'Standard_DS1_v2'
$pub = 'MicrosoftWindowsServer'
$off = 'WindowsServer'
$sku = '2019-Datacenter'
$ver = 'latest'
$zn = '2'
$loc = 'westus'

## Create a virtual machine configuration. $cred and $nicVM2 are variables with configuration from the previous steps. ##

$vmConfig = 
New-AzVMConfig -VMName $vm -VMSize $siz | Set-AzVMOperatingSystem -Windows -ComputerName $vm -Credential $cred | Set-AzVMSourceImage -PublisherName $pub -Offer WindowsServer -Skus $sku -Version $ver | Add-AzVMNetworkInterface -Id $nicVM2.Id

## Create the virtual machine ##
New-AzVM -ResourceGroupName $rg -Zone $zn -Location $loc -VM $vmConfig
```

## Create outbound rule configuration
Load balancer outbound rules configure outbound source network address translation (SNAT) for VMs in the backend pool. 

For more information on outbound connections, see [Outbound connections in Azure](load-balancer-outbound-connections.md).

### Create outbound public IP address

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to:

* Create a standard zone redundant public IP address named **myPublicIPOutbound-R2**.
* In **myResourceGroupLB-R2**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-R2'
$loc = 'westus'
$pubIP = 'myPublicIPOutbound-R2'
$sku = 'Standard'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku
```

To create a zonal public IP address in zone 1, use the following command:

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-R1'
$loc = 'eastus'
$pubIP = 'myPublicIPOutbound-R1'
$sku = 'Standard'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku -zone 1
```
### Create outbound frontend IP configuration

Create a new frontend IP configuration with [Add-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/add-azloadbalancerfrontendipconfig):

* Named **myFrontEndOutbound-R2**.
* Associated with public IP address **myPublicIPOutbound-R2**.

```azurepowershell-interactive
## Variables for the command ##
$fen = 'myFrontEndOutbound-R2'
$lbn = 'myLoadBalancer-R2'

## Get the load balancer configuration  and apply the frontend config##
Get-AzLoadBalancer -Name $lbn -ResourceGroupName $rg | Add-AzLoadBalancerFrontendIPConfig -Name $fen -PublicIpAddress $publicIP | Set-AzLoadBalancer
```

### Create outbound pool

Create a new outbound pool with [Add-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/add-azloadbalancerbackendaddresspoolconfig). 

Apply the pool and frontend IP address to the load balancer with [Set-AzLoadBalancer](/powershell/module/az.network/set-azloadbalancer):

* Named **myBackEndPoolOutbound-R2**.

```azurepowershell-interactive
## Variables for the command ##
$ben = 'myBackEndPoolOutbound-R2'
$lbn = 'myLoadBalancer-R2'
$rg = 'myResourceGroupLB-R2'

## Get the load balancer configuration and create the outbound backend address pool##
Get-AzLoadBalancer -Name $lbn -ResourceGroupName $rg | Add-AzLoadBalancerBackendAddressPoolConfig -Name $ben | Set-AzLoadBalancer
```
### Create outbound rule and apply to load balancer

Create a new outbound rule for the outbound backend pool with [Add-AzLoadBalancerOutboundRuleConfig](/powershell/module/az.network/new-azloadbalanceroutboundruleconfig). 

Apply the rule to the load balancer with [Set-AzLoadBalancer](/powershell/module/az.network/set-azloadbalancer):

* Named **myOutboundRule**.
* Associated with load balancer **myLoadBalancer-R2**.
* Associated with frontend **myFrontEndOutbound-R2**.
* Protocol **All**.
* Idle timeout of **15**.
* **10000** outbound ports.
* Associated with backend pool **myBackEndPoolOutbound-R2**.
* In resource group **myResourceGroupLB-R2**.

```azurepowershell-interactive
## Variables for the commands ##
$rg = 'myResourceGroupLB-R2'
$lbn = 'myLoadBalancer-R2'
$brn = 'myOutboundRule'
$pro = 'All'
$idl = '15'
$por = '10000'

## Get the load balancer configuration ##
$lb = 
Get-AzLoadBalancer -Name $lbn -ResourceGroupName $rg 

## Apply the outbound rule configuration to the load balancer. ##
$lb | Add-AzLoadBalancerOutBoundRuleConfig -Name $brn -FrontendIPConfiguration $lb.FrontendIpConfigurations[1] -BackendAddressPool $lb.BackendAddressPools[1] -Protocol $pro -IdleTimeoutInMinutes $idl -AllocatedOutboundPort $por | Set-AzLoadBalancer
```

### Add virtual machines to outbound pool

Add the virtual machine network interfaces to the outbound pool of the load balancer with [Add-AzNetworkInterfaceIpConfig](/powershell/module/az.network/add-aznetworkinterfaceipconfig):


#### VM1 - Region 2
* In backend address pool **myBackEndPoolOutbound-R2**.
* In resource group **myResourceGroupLB-R2**.
* Associated with network interface **myNicVM1-R2* and **ipconfig1**.
* Associated with load balancer **myLoadBalancer-R2**.

```azurepowershell-interactive
## Variables for the commands ##
$rg = 'myResourceGroupLB-R2'
$lbn = 'myLoadBalancer-R2'
$bep = 'myBackEndPoolOutbound-R2'
$nic1 = 'myNicVM1-R2'
$ipc = 'ipconfig1'

## Get the load balancer configuration ##
$lb = 
Get-AzLoadBalancer -Name $lbn -ResourceGroupName $rg

## Get the network interface configuration ##
$nic = 
Get-AzNetworkInterface -Name $nic1 -ResourceGroupName $rg

## Apply the backend to the network interface ##
$nic | Set-AzNetworkInterfaceIpConfig -Name $ipc -LoadBalancerBackendAddressPoolId $lb.BackendAddressPools[0].id,$lb.BackendAddressPools[1].id | Set-AzNetworkInterface
```

#### VM2 - Region 2
* In backend address pool **myBackEndPoolOutbound-R2**.
* In resource group **myResourceGroupLB-R2**.
* Associated with network interface **myNicVM2-R2** and **ipconfig1**.
* Associated with load balancer **myLoadBalancer-R2**.

```azurepowershell-interactive
## Variables for the commands ##
$rg = 'myResourceGroupLB-R2'
$lbn = 'myLoadBalancer-R2'
$bep = 'myBackEndPoolOutbound-R2'
$nic2 = 'myNicVM2-R2'
$ipc = 'ipconfig1'

## Get the load balancer configuration ##
$lb = 
Get-AzLoadBalancer -Name $lbn -ResourceGroupName $rg

## Get the network interface configuration ##
$nic = 
Get-AzNetworkInterface -Name $nic2 -ResourceGroupName $rg

## Apply the backend to the network interface ##
$nic | Set-AzNetworkInterfaceIpConfig -Name $ipc -LoadBalancerBackendAddressPoolId $lb.BackendAddressPools[0].id,$lb.BackendAddressPools[1].id | Set-AzNetworkInterface
```

## Install IIS on virtual machines in region 2

Use [Set-AzVMExtension](https://docs.microsoft.com/powershell/module/az.compute/set-azvmextension?view=latest) to install the Custom Script Extension. 

The extension runs PowerShell Add-WindowsFeature Web-Server to install the IIS webserver and then updates the Default.htm page to show the hostname of the VM:

### VM1 - Region 2

```azurepowershell-interactive
## Variables for command. ##
$rg = 'myResourceGroupLB-R2'
$enm = 'IIS'
$vmn = 'myVM1-R2'
$loc = 'westus'
$pub = 'Microsoft.Compute'
$ext = 'CustomScriptExtension'
$typ = '1.8'

Set-AzVMExtension -ResourceGroupName $rg -ExtensionName $enm -VMName $vmn -Location $loc -Publisher $pub -ExtensionType $ext -TypeHandlerVersion $typ -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
```

### VM2 - Region 2

```azurepowershell-interactive
## Variables for command. ##
$rg = 'myResourceGroupLB-R2'
$enm = 'IIS'
$vmn = 'myVM2-R2'
$loc = 'westus'
$pub = 'Microsoft.Compute'
$ext = 'CustomScriptExtension'
$typ = '1.8'

Set-AzVMExtension -ResourceGroupName $rg -ExtensionName $enm -VMName $vmn -Location $loc -Publisher $pub -ExtensionType $ext -TypeHandlerVersion $typ -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
```


## Create the cross-region load balancer

### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

* Named **myResourceGroup-CR**.
* In the **centralus** location.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroup-CR'
$loc = 'centralus'

New-AzResourceGroup -Name $rg -Location $loc
```
## Create a public IP address

To access your web app on the Internet, you need a public IP address for the load balancer. 

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to:

* Create a standard zone redundant public IP address named **myPublicIP-CR**.
* In **myResourceGroup-CR**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-CR'
$loc = 'centralus'
$pubIP = 'myPublicIP-CR'
$sku = 'Standard'
$all = 'static'
$tir = 'Global'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku -Tier $tir
```
## Create cross-region frontend

Create a cross-region frontend with [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig):

* Named **myFrontEnd-CR**.
* Attached to public IP **myPublicIP-CR**.

```azurepowershell-interactive
## Variables for the commands ##
$fe = 'myFrontEnd-CR'
$rg = 'MyResourceGroupLB-CR'
$loc = 'centralus'
$pubIP = 'myPublicIP-CR'

$publicIp = 
Get-AzPublicIpAddress -Name $pubIP -ResourceGroupName $rg

$feip = 
New-AzLoadBalancerFrontendIpConfig -Name $fe -PublicIpAddress $publicIp
```
### Configure back-end address pool

Create a back-end address pool with [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig): 

* Named **myBackEndPool-CR**.
* The VMs attach to this back-end pool in the remaining steps.

```azurepowershell-interactive
## Variable for the command ##
$be = 'myBackEndPool-CR'
$rg = 'myResourceGroup-CR'
$rlb1 = 'myLoadBalancer-R1'
$rlb2 = 'myLoadBalancer_R1'

$bepool = 
New-AzLoadBalancerBackendAddressPoolConfig -Name $be -ResourceGroupName $rg -LoadBalancerName $rlb1,$rlb2
```
### Create the load balancer rule

A load balancer rule defines:

* Frontend IP configuration for the incoming traffic.
* The backend IP pool to receive the traffic.
* The required source and destination port. 

Create a load balancer rule with [Add-AzLoadBalancerRuleConfig](/powershell/module/az.network/add-azloadbalancerruleconfig): 

* Named **myHTTPRule**
* Listening on **Port 80** in the frontend pool **myFrontEnd-CR**.
* Sending load-balanced network traffic to the backend address pool **myBackEndPool-CR** using **Port 80**. 
* Protocol **TCP**.

```azurepowershell-interactive
## Variables for the command ##
$lbr = 'myHTTPRule'
$pro = 'tcp'
$port = '80'

## $feip and $bePool are the variables from previous steps. ##

$rule = 
New-AzLoadBalancerRuleConfig -Name $lbr -Protocol $pro -FrontendPort $port -BackendPort $port -FrontendIpConfiguration $feip -BackendAddressPool $bePool
```
### Create the cross-region load balancer resource

Create a public load Balancer with [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer):

* Named **myLoadBalancer-CR**
* In **centralus**.
* In resource group **myResourceGroupLB-CR**.

```azurepowershell-interactive
## Variables for the command ##
$lbn = 'myLoadBalancer-R1'
$rg = 'myResourceGroupLB-R1'
$loc = 'eastus'
$sku = 'Standard'
$tir = 'Global'

## $feip, $bepool, $probe, $rule are variables with configuration information from previous steps. ##

$lb = 
New-AzLoadBalancer -ResourceGroupName $rg -Name $lbn -SKU $sku -Location $loc -FrontendIpConfiguration $feip -BackendAddressPool $bepool -LoadBalancingRule $rule -Tier $tir
```

## Create test virtual machine in region 1

### Create a public IP address

To access the test VM in region 1 from the internet, create a public ip address.

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to:

* Create a standard zone redundant public IP address named **myTestVMIP-R1**.
* In **myResourceGroup-R1**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-R1'
$loc = 'eastus'
$pubIP = 'myTestVMIP-R1'
$sku = 'Standard'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku -Tier $tir
```

### Create network security group
Create network security group to define inbound connections to your virtual network.

#### Create a network security group rule for port 3389
Create a network security group rule with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig):

* Named **myNSGRuleRDP**.
* Description of **Allow RDP**.
* Access of **Allow**.
* Protocol **(*)**.
* Direction **Inbound**.
* Priority **2000**.
* Source of the **Internet**.
* Source port range of **(*)**.
* Destination address prefix of **(*)**.
* Destination **Port 3389**.

```azurepowershell-interactive
## Variables for command ##
$rnm = 'myNSGRuleRDP'
$des = 'Allow RDP'
$acc = 'Allow'
$pro = '*'
$dir = 'Inbound'
$pri = '2000'
$spfx = 'Internet'
$spr = '*'
$dpfx = '*'
$dpr = '3389'

$rule1 = 
New-AzNetworkSecurityRuleConfig -Name $rnm -Description $des -Access $acc -Protocol $pro -Direction $dir -Priority $pri -SourceAddressPrefix $spfx -SourcePortRange $spr -DestinationAddressPrefix $dpfx -DestinationPortRange $dpr
```

#### Create a network security group

Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup):

* Named **myTestNSG-R1**.
* In resource group **myResourceGroupLB-R1**.
* In location **eastus**.
* With security rules created in previous steps stored in a variable.

```azurepowershell
## Variables for command ##
$rg = 'myResourceGroup-R1'
$loc = 'eastus'
$nmn = 'myTestNSG-R1'

## $rule1 contains configuration information from the previous steps. ##
$nsg = 
New-AzNetworkSecurityGroup -ResourceGroupName $rg -Location $loc -Name $nmn -SecurityRules $rule1
```

### Create network interface

Create a network interface with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface):

#### TestVM - Region 1

* Named **myNicTestVM-R1**.
* In resource group **myResourceGroupLB-R1**.
* In location **eastus**.
* In virtual network **myVNet-R1**.
* In subnet **myBackendSubnet-R1**.
* In network security group **myTestNSG-R1**.


```azurepowershell-interactive
## Variables for command ##
$rg = 'myResourceGroupLB-R1'
$loc = 'eastus'
$nic1 = 'myNicTestVM-R1'
$vnt = 'myVNet-R1'
$pub = 'myTestVMIP-R1
$ngn = 'myNSG-R1'

## Command to get virtual network configuration. ##
$vnet = 
Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rg

## Command to get load balancer configuration
$bepool = 
Get-AzLoadBalancer -Name $lb -ResourceGroupName $rg | Get-AzLoadBalancerBackendAddressPoolConfig

## Command to get network security group configuration ##
$nsg = 
Get-AzNetworkSecurityGroup -Name $ngn -ResourceGroupName $rg

## Command to get public IP configuration ##

$publicIP = 
Get-AzPublicIPAddress -ResourceGroupName $rg -Name $pub

## Command to create network interface for VM1 ##
$nicVM1 = 
New-AzNetworkInterface -ResourceGroupName $rg -Location $loc -Name $nic1 -LoadBalancerBackendAddressPool $bepool -NetworkSecurityGroup $nsg -Subnet $vnet.Subnets[0] --PublicIpAddressId $publicIP.id
```
### Create region 1 test virtual machine

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


#### TestVM - Region 1

* Named **myTestVM-R1**.
* In resource group **myResourceGroupLB-R1**.
* Attached to network interface **myNicTestVM-R1**.
* In the **eastus** location.

```azurepowershell-interactive
## Variables used for command. ##
$rg = 'myResourceGroupLB-R1'
$vm = 'myTestVM-R1'
$siz = 'Standard_DS1_v2'
$pub = 'MicrosoftWindowsServer'
$off = 'WindowsServer'
$sku = '2019-Datacenter'
$ver = 'latest'
$zn = '1'
$loc = 'eastus'

## Create a virtual machine configuration. $cred and $nicVM1 are variables with configuration from the previous steps. ##

$vmConfig = 
New-AzVMConfig -VMName $vm -VMSize $siz | Set-AzVMOperatingSystem -Windows -ComputerName $vm -Credential $cred | Set-AzVMSourceImage -PublisherName $pub -Offer WindowsServer -Skus $sku -Version $ver | Add-AzVMNetworkInterface -Id $nicVM1.Id

## Create the virtual machine ##
New-AzVM -ResourceGroupName $rg -Zone $zn -Location $loc -VM $vmConfig
```

## Create test virtual machine in region 2

### Create a public IP address

To access the test VM in region 1 from the internet, create a public ip address.

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to:

* Create a standard zone redundant public IP address named **myTestVMIP-R2**.
* In **myResourceGroup-R2**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-R2'
$loc = 'westus'
$pubIP = 'myTestVMIP-R2'
$sku = 'Standard'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku -Tier $tir
```

### Create network security group
Create network security group to define inbound connections to your virtual network.

#### Create a network security group rule for port 3389
Create a network security group rule with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig):

* Named **myNSGRuleRDP**.
* Description of **Allow RDP**.
* Access of **Allow**.
* Protocol **(*)**.
* Direction **Inbound**.
* Priority **2000**.
* Source of the **Internet**.
* Source port range of **(*)**.
* Destination address prefix of **(*)**.
* Destination **Port 3389**.

```azurepowershell-interactive
## Variables for command ##
$rnm = 'myNSGRuleRDP'
$des = 'Allow RDP'
$acc = 'Allow'
$pro = '*'
$dir = 'Inbound'
$pri = '2000'
$spfx = 'Internet'
$spr = '*'
$dpfx = '*'
$dpr = '3389'

$rule1 = 
New-AzNetworkSecurityRuleConfig -Name $rnm -Description $des -Access $acc -Protocol $pro -Direction $dir -Priority $pri -SourceAddressPrefix $spfx -SourcePortRange $spr -DestinationAddressPrefix $dpfx -DestinationPortRange $dpr
```

#### Create a network security group

Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup):

* Named **myTestNSG-R2**.
* In resource group **myResourceGroupLB-R2**.
* In location **westus**.
* With security rules created in previous steps stored in a variable.

```azurepowershell
## Variables for command ##
$rg = 'myResourceGroup-R2'
$loc = 'westus'
$nmn = 'myTestNSG-R2'

## $rule1 contains configuration information from the previous steps. ##
$nsg = 
New-AzNetworkSecurityGroup -ResourceGroupName $rg -Location $loc -Name $nmn -SecurityRules $rule1
```

### Create network interface

Create a network interface with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface):

#### TestVM - Region 2

* Named **myNicTestVM-R2**.
* In resource group **myResourceGroupLB-R2**.
* In location **westus**.
* In virtual network **myVNet-R2**.
* In subnet **myBackendSubnet-R2**.
* In network security group **myTestNSG-R2**.


```azurepowershell-interactive
## Variables for command ##
$rg = 'myResourceGroupLB-R2'
$loc = 'westus'
$nic1 = 'myNicTestVM-R2'
$vnt = 'myVNet-R2'
$pub = 'myTestVMIP-R2'
$ngn = 'myNSG-R2'

## Command to get virtual network configuration. ##
$vnet = 
Get-AzVirtualNetwork -Name $vnt -ResourceGroupName $rg

## Command to get load balancer configuration
$bepool = 
Get-AzLoadBalancer -Name $lb -ResourceGroupName $rg | Get-AzLoadBalancerBackendAddressPoolConfig

## Command to get network security group configuration ##
$nsg = 
Get-AzNetworkSecurityGroup -Name $ngn -ResourceGroupName $rg

## Command to get public IP configuration ##

$publicIP = 
Get-AzPublicIPAddress -ResourceGroupName $rg -Name $pub

## Command to create network interface for VM1 ##
$nicVM1 = 
New-AzNetworkInterface -ResourceGroupName $rg -Location $loc -Name $nic1 -LoadBalancerBackendAddressPool $bepool -NetworkSecurityGroup $nsg -Subnet $vnet.Subnets[0] --PublicIpAddressId $publicIP.id
```
### Create region 2 test virtual machine

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


#### TestVM - Region 2

* Named **myTestVM-R2**.
* In resource group **myResourceGroupLB-R2**.
* Attached to network interface **myNicTestVM-R2**.
* In the **westus** location.

```azurepowershell-interactive
## Variables used for command. ##
$rg = 'myResourceGroupLB-R2'
$vm = 'myTestVM-R2'
$siz = 'Standard_DS1_v2'
$pub = 'MicrosoftWindowsServer'
$off = 'WindowsServer'
$sku = '2019-Datacenter'
$ver = 'latest'
$zn = '1'
$loc = 'westus'

## Create a virtual machine configuration. $cred and $nicVM1 are variables with configuration from the previous steps. ##

$vmConfig = 
New-AzVMConfig -VMName $vm -VMSize $siz | Set-AzVMOperatingSystem -Windows -ComputerName $vm -Credential $cred | Set-AzVMSourceImage -PublisherName $pub -Offer WindowsServer -Skus $sku -Version $ver | Add-AzVMNetworkInterface -Id $nicVM1.Id

## Create the virtual machine ##
New-AzVM -ResourceGroupName $rg -Zone $zn -Location $loc -VM $vmConfig
```

## Test the cross-region load balancer





## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!---Required:
To avoid any costs associated with following the tutorial procedure, a
Clean up resources (H2) should come just before Next steps (H2)
--->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

<!--- Required:
Tutorials should always have a Next steps H2 that points to the next
logical tutorial in a series, or, if there are no other tutorials, to
some other cool thing the customer can do. A single link in the blue box
format should direct the customer to the next article - and you can
shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also
section". --->