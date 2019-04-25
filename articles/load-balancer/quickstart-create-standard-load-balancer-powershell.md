---
title: 'Quickstart: Create a Standard Load Balancer - Azure PowerShell'
titlesuffix: Azure Load Balancer
description: This quickstart shows how to create a Standard Load Balancer using PowerShell
services: load-balancer
documentationcenter: na
author: KumudD
manager: twooley
Customer intent: I want to create a Standard Load balancer so that I can load balance internet traffic to VMs.
ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/25/2019
ms.author: kumud
ms:custom: seodec18
---

# <a name="get-started"></a>Quickstart: Create a Standard Load Balancer using Azure PowerShell

This quickstart shows you how to create a Standard Load Balancer using Azure PowerShell. To test the load balancer, you deploy two virtual machines (VMs) running Windows server and load balance a web app between the VMs. To learn more about Standard Load Balancer, see [What is Standard Load Balancer](load-balancer-standard-overview.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

Before you can create your load balancer, you must create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group named *myResourceGroupLB* in the *EastUS* location:

```azurepowershell-interactive
$rg = New-AzResourceGroup `
  -ResourceGroupName "myResourceGroupLB" `
  -Location "EastUS"
```

## Create a public IP address for load balancer

To access your app on the Internet, you need a public IP address for the load balancer. Create a public IP address with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress). The following example creates a public IP address named *myPublicIP* in the *myResourceGroupLB* resource group:

```azurepowershell-interactive
$publicIP = New-AzPublicIpAddress `
-Name "myPublicIP" `
-ResourceGroupName "myResourceGroupLB" `
-Location "EastUS" `
-Sku "Standard" `
-AllocationMethod "Static"
```

## Create Standard Load Balancer

In this section, you configure the front-end IP and the back-end address pool for the load balancer and then create the Standard Load Balancer.

### Create front-end IP

Create a front-end IP with [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig). The following example creates a front-end IP configuration named *myFrontEnd* and attaches the *myPublicIP* address:

```azurepowershell-interactive
$frontendIP = New-AzLoadBalancerFrontendIpConfig `
  -Name "myFrontEnd" `
  -PublicIpAddress $publicIP
```

### Configure back-end address pool

Create a back-end address pool with [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig). The VMs attach to this back-end pool in the remaining steps. The following example creates a back-end address pool named *myBackEndPool*:

```azurepowershell-interactive
$backendPool = New-AzLoadBalancerBackendAddressPoolConfig -Name "myBackEndPool"
```

### Create a health probe
To allow the load balancer to monitor the status of your app, you use a health probe. The health probe dynamically adds or removes VMs from the load balancer rotation based on their response to health checks. By default, a VM is removed from the load balancer distribution after two consecutive failures at 15-second intervals. You create a health probe based on a protocol or a specific health check page for your app.

The following example creates a TCP probe. You can also create custom HTTP probes for more fine grained health checks. When using a custom HTTP probe, you must create the health check page, such as *healthcheck.aspx*. The probe must return an **HTTP 200 OK** response for the load balancer to keep the host in rotation.

To create a TCP health probe, you use [Add-AzLoadBalancerProbeConfig](/powershell/module/az.network/add-azloadbalancerprobeconfig). The following example creates a health probe named *myHealthProbe* that monitors each VM on *HTTP* port *80*:

```azurepowershell-interactive
$probe = New-AzLoadBalancerProbeConfig `
  -Name "myHealthProbe" `
  -RequestPath healthcheck2.aspx `
  -Protocol http `
  -Port 80 `
  -IntervalInSeconds 16 `
  -ProbeCount 2
  ```

### Create a load balancer rule
A load balancer rule is used to define how traffic is distributed to the VMs. You define the front-end IP configuration for the incoming traffic and the back-end IP pool to receive the traffic, along with the required source and destination port. To make sure only healthy VMs receive traffic, you also define the health probe to use.

Create a load balancer rule with [Add-AzLoadBalancerRuleConfig](/powershell/module/az.network/add-azloadbalancerruleconfig). The following example creates a load balancer rule named *myLoadBalancerRule* and balances traffic on *TCP* port *80*:

```azurepowershell-interactive
$lbrule = New-AzLoadBalancerRuleConfig `
  -Name "myLoadBalancerRule" `
  -FrontendIpConfiguration $frontendIP `
  -BackendAddressPool $backendPool `
  -Protocol Tcp `
  -FrontendPort 80 `
  -BackendPort 80 `
  -Probe $probe
```

### Create the NAT rules

Create NAT rules with [Add-AzLoadBalancerRuleConfig](/powershell/module/az.network/new-azloadbalancerinboundnatruleconfig). The following example creates NAT rules named *myLoadBalancerRDP1* and *myLoadBalancerRDP2* to allow RDP connections to the back-end servers with port 4221 and 4222:

```azurepowershell-interactive
$natrule1 = New-AzLoadBalancerInboundNatRuleConfig `
-Name 'myLoadBalancerRDP1' `
-FrontendIpConfiguration $frontendIP `
-Protocol tcp `
-FrontendPort 4221 `
-BackendPort 3389

$natrule2 = New-AzLoadBalancerInboundNatRuleConfig `
-Name 'myLoadBalancerRDP2' `
-FrontendIpConfiguration $frontendIP `
-Protocol tcp `
-FrontendPort 4222 `
-BackendPort 3389

$natrule3 = New-AzLoadBalancerInboundNatRuleConfig `
-Name 'myLoadBalancerRDP3' `
-FrontendIpConfiguration $frontendIP `
-Protocol tcp `
-FrontendPort 4223 `
-BackendPort 3389
```

### Create load balancer

Create the Standard Load Balancer with [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer). The following example creates a public Standard Load Balancer named myLoadBalancer using the front-end IP configuration, back-end pool, health probe, load balancing rule, and NAT rules that you created in the preceding steps:

```azurepowershell-interactive
$lb = New-AzLoadBalancer `
-ResourceGroupName 'myResourceGroupLB' `
-Name 'MyLoadBalancer' `
-Location 'eastus' `
-FrontendIpConfiguration $frontendIP `
-BackendAddressPool $backendPool `
-Probe $probe `
-LoadBalancingRule $lbrule `
-InboundNatRule $natrule1,$natrule2,$natrule3  `
-sku Standard
```

## Create network resources
Before you deploy some VMs and can test your balancer, you must create supporting network resources - virtual network and virtual NICs. 

### Create public IP address for the VMs
To access your virtual machines using a RDP connection, create a IPV4 public IP addresses for the virtual machines with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress).

```azurepowershell
$RdpPublicIP_1 = New-AzPublicIpAddress `
  -Name "RdpPublicIP_1" `
  -ResourceGroupName $rg.ResourceGroupName `
  -Location $rg.Location  `
  -SKU Standard `
  -AllocationMethod static `
  -IpAddressVersion IPv4

$RdpPublicIP_2 = New-AzPublicIpAddress `
  -Name "RdpPublicIP_2" `
  -ResourceGroupName $rg.ResourceGroupName `
  -Location $rg.Location  `
  -SKU Standard `
  -AllocationMethod static `
  -IpAddressVersion IPv4

$RdpPublicIP_3 = New-AzPublicIpAddress `
  -Name "RdpPublicIP_3" `
  -ResourceGroupName $rg.ResourceGroupName `
  -Location $rg.Location  `
  -SKU Standard `
  -AllocationMethod static `
  -IpAddressVersion IPv4
```


### Create a virtual network
Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual network named *myVnet* with *mySubnet*:

```azurepowershell-interactive
# Create subnet config
$subnetConfig = New-AzVirtualNetworkSubnetConfig `
  -Name "mySubnet" `
  -AddressPrefix 10.0.2.0/24

# Create the virtual network
$vnet = New-AzVirtualNetwork `
  -ResourceGroupName "myResourceGroupLB" `
  -Location "EastUS" `
  -Name "myVnet" `
  -AddressPrefix 10.0.0.0/16 `
  -Subnet $subnetConfig
```

### Create network security group
Create network security group to define inbound connections to your virtual network.

#### Create a network security group rule for port 3389
Create a network security group rule to allow RDP connections through port 3389 with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig).

```azurepowershell-interactive

$rule1 = New-AzNetworkSecurityRuleConfig `
-Name 'myNetworkSecurityGroupRuleRDP' `
-Description 'Allow RDP' `
-Access Allow `
-Protocol Tcp `
-Direction Inbound `
-Priority 1000 `
-SourceAddressPrefix Internet `
-SourcePortRange * `
-DestinationAddressPrefix * `
-DestinationPortRange 3389
```

#### Create a network security group rule for port 80
Create a network security group rule to allow inbound connections through port 80 with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig).

```azurepowershell-interactive
$rule2 = New-AzNetworkSecurityRuleConfig `
-Name 'myNetworkSecurityGroupRuleHTTP' `
-Description 'Allow HTTP' `
-Access Allow `
-Protocol Tcp `
-Direction Inbound `
-Priority 2000 `
-SourceAddressPrefix Internet `
-SourcePortRange * `
-DestinationAddressPrefix * `
-DestinationPortRange 80
```

#### Create a network security group

Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup).

```azurepowershell-interactive
$nsg = New-AzNetworkSecurityGroup `
-ResourceGroupName 'myResourceGroupLB' `
-Location 'EastUS' `
-Name 'myNetworkSecurityGroup' `
-SecurityRules $rule1,$rule2
```

### Create NICs
Create virtual NICs created with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface). The following example creates two virtual NICs. (One virtual NIC for each VM you create for your app in the following steps). You can create additional virtual NICs and VMs at any time and add them to the load balancer:

```azurepowershell-interactive
# Create NIC for VM1
$Ip4Config=New-AzNetworkInterfaceIpConfig `
  -Name dsIp4Config `
  -Subnet $vnet.subnets[0] `
  -LoadBalancerBackendAddressPool $backendPool `
  -PublicIpAddress  $RdpPublicIP_1


$NIC_1 = New-AzNetworkInterface `
-ResourceGroupName 'myResourceGroupLB' `
-Location 'EastUS' `
-Name 'dsNIC1' `
-NetworkSecurityGroupId $nsg.Id `
-IpConfiguration $Ip4Config 

# Create NIC for VM2

$Ip4Config=New-AzNetworkInterfaceIpConfig `
  -Name dsIp4Config `
  -Subnet $vnet.subnets[0] `
  -LoadBalancerBackendAddressPool $backendPool `
  -PublicIpAddress  $RdpPublicIP_2


$NIC_2 = New-AzNetworkInterface `
-ResourceGroupName 'myResourceGroupLB' `
-Location 'EastUS' `
-Name 'dsNIC2' `
-NetworkSecurityGroupId $nsg.Id `
-IpConfiguration $Ip4Config 

# Create NIC for VM3

$Ip4Config=New-AzNetworkInterfaceIpConfig `
  -Name dsIp4Config `
  -Subnet $vnet.subnets[0] `
  -LoadBalancerBackendAddressPool $backendPool `
  -PublicIpAddress  $RdpPublicIP_3


$NIC_3 = New-AzNetworkInterface `
-ResourceGroupName 'myResourceGroupLB' `
-Location 'EastUS' `
-Name 'dsNIC3' `
-NetworkSecurityGroupId $nsg.Id `
-IpConfiguration $Ip4Config 

```

### Create virtual machines

Set an administrator username and password for the VMs with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```azurepowershell-interactive
$cred = Get-Credential
```

Now you can create the VMs with [New-AzVM](/powershell/module/az.compute/new-azvm). The following example creates two VMs and the required virtual network components if they do not already exist. In this example, the NICs (*VM1* and *VM2*) created in the preceding step are automatically assigned to virtual machines *VM1* and *VM2* since they have identical names and are assigned the same virtual network (*myVnet*) and subnet (*mySubnet*). In addition, since the NICs are associated to the load balancer's backend pool, the VMs are automatically added to the backend pool.

```azurepowershell-interactive
$vmsize = "Standard_DS1_v2"
$ImagePublisher = "MicrosoftWindowsServer"
$imageOffer = "WindowsServer"
$imageSKU = "2016-Datacenter"

$vmName= "VM1"
$VMconfig1 = New-AzVMConfig -VMName $vmName -VMSize $vmsize | Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent 3> $null | Set-AzVMSourceImage -PublisherName $ImagePublisher -Offer $imageOffer -Skus $imageSKU -Version "latest" 3> $null | Set-AzVMOSDisk -Name "$vmName.vhd" -CreateOption fromImage  3> $null | Add-AzVMNetworkInterface -Id $NIC_1.Id  3> $null 
$VM1 = New-AzVM -ResourceGroupName $rg.ResourceGroupName  -Location $rg.Location -Zone 1 -VM $VMconfig1 

$vmName= "VM2"
$VMconfig2 = New-AzVMConfig -VMName $vmName -VMSize $vmsize | Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent 3> $null | Set-AzVMSourceImage -PublisherName $ImagePublisher -Offer $imageOffer -Skus $imageSKU -Version "latest" 3> $null | Set-AzVMOSDisk -Name "$vmName.vhd" -CreateOption fromImage  3> $null | Add-AzVMNetworkInterface -Id $NIC_2.Id  3> $null 
$VM2 = New-AzVM -ResourceGroupName $rg.ResourceGroupName  -Location $rg.Location -Zone 2 -VM $VMconfig2


$vmName= "VM3"
$VMconfig3 = New-AzVMConfig -VMName $vmName -VMSize $vmsize  | Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent 3> $null | Set-AzVMSourceImage -PublisherName $ImagePublisher -Offer $imageOffer -Skus $imageSKU -Version "latest" 3> $null | Set-AzVMOSDisk -Name "$vmName.vhd" -CreateOption fromImage  3> $null | Add-AzVMNetworkInterface -Id $NIC_3.Id  3> $null 
$VM3 = New-AzVM -ResourceGroupName $rg.ResourceGroupName  -Location $rg.Location -Zone 3 -VM $VMconfig3


```

It takes a few minutes to create and configure the two VMs.

### Install IIS with Custom web page

Install IIS with a custom web page on both back-end VMs as follows:

1. Get the Public IP address of the Load Balancer. Using `Get-AzPublicIPAddress`, obtain the Public IP address of the Load Balancer.

```azurepowershell
Get-AzPublicIpAddress -Name RdpPublicIP_1 -ResourceGroupName myResourceGroupLB | Select IpAddress
```
2. Create a remote desktop connection to VM1 using the Public Ip address that you obtained from the previous step. 

```azurepowershell-interactive

mstsc /v:PublicIpAddress  

```

3. Enter the credentials for *VM1* to start the RDP session.
4. Launch Windows PowerShell on VM1 and using the following commands to install IIS server and update the default htm file.

```azurepowershell-interactive
# Install IIS
Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
# Remove default htm file
remove-item  C:\inetpub\wwwroot\iisstart.htm
    
#Add custom htm file
Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from host " + $env:computername)
```
5. Close the RDP connection with *myVM1*.
6. Repeat steps 1 to 5 to install IIS server on *VM2* and *VM3* using IP addresses *RdpPublicIP_2* and *RdpPublicIP_3* respectively.

## Test load balancer
Obtain the public IP address of your load balancer with [Get-AzPublicIPAddress](/powershell/module/az.network/get-azpublicipaddress). The following example obtains the IP address for *myPublicIP* created earlier:

```azurepowershell-interactive
Get-AzPublicIPAddress `
  -ResourceGroupName "myResourceGroupLB" `
  -Name "myPublicIP" | select IpAddress
```

You can then enter the public IP address in to a web browser. The website is displayed, including the hostname of the VM that the load balancer distributed traffic to as in the following example:

![Test load balancer](media/quickstart-create-basic-load-balancer-powershell/load-balancer-test.png)

To see the load balancer distribute traffic across all two VMs running your app, you can force-refresh your web browser. 

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, VM, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroupLB
```

## Next steps

In this quickstart, you created a Standard Load Balancer, attached VMs to it, configured the load balancer traffic rule, health probe, and then tested the load balancer. To learn more about Azure Load Balancer, continue to the tutorials for Azure Load Balancer.

> [!div class="nextstepaction"]
> [Azure Load Balancer tutorials](tutorial-load-balancer-basic-internal-portal.md)
