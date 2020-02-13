---
title: Azure PowerShell script sample - Configure IPv6 frontend with Standard Load Balancer(preview)
titlesuffix: Azure Virtual Network
description: Enable IPv6 endpoints using Powershell in Azure Virtual Network
services: virtual-network
documentationcenter: na
author: KumudD
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.workload: infrastructure-services
ms.date: 07/15/2019
ms.author: kumud
---

# Configure IPv6 frontend in virtual network script sample with Standard Load Balancer(preview)

This article shows you how to deploy a dual stack (IPv4 + IPv6) application in Azure that includes a dual stack virtual network with a dual stack subnet, a load balancer with dual (IPv4 + IPv6) front-end configurations, VMs with NICs that have a dual IP configuration, dual network security group rules, and dual public IPs.

You can execute the script from the Azure [Cloud Shell](https://shell.azure.com/powershell), or from a local PowerShell installation. If you use PowerShell locally, this script requires the Azure Az PowerShell module version 1.0.0 or later. To find the installed version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites
Before you deploy a dual stack application in Azure, you must configure your subscription only once for this preview feature using the following Azure PowerShell:

Register as follows:
```azurepowershell
Register-AzProviderFeature -FeatureName AllowIPv6VirtualNetwork -ProviderNamespace Microsoft.Network
Register-AzProviderFeature -FeatureName AllowIPv6CAOnStandardLB -ProviderNamespace Microsoft.Network
```
It takes up to 30 minutes for feature registration to complete. You can check your registration status by running the following Azure PowerShell command:
Check on the registration as follows:
```azurepowershell
Get-AzProviderFeature -FeatureName AllowIPv6VirtualNetwork -ProviderNamespace Microsoft.Network
Get-AzProviderFeature -FeatureName AllowIPv6CAOnStandardLB -ProviderNamespace Microsoft.Network
```
After the registration is complete, run the following command:

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
```

## Sample script

```azurepowershell
#	Deploys Dual-stack (IPv4+IPv6) Azure virtual network with 2 VMs and Standard Load Balancer with IPv4 and IPv6 public IPs

# Create resource group to contain the deployment
  $rg = New-AzResourceGroup `
  -ResourceGroupName "dsRG1"  `
  -Location "east us"

# Create the public IPs needed for the deployment
  $PublicIP_v4 = New-AzPublicIpAddress `
  -Name "dsPublicIP_v4" `
  -ResourceGroupName $rg.ResourceGroupName `
  -Location $rg.Location  `
  -AllocationMethod Static `
  -IpAddressVersion IPv4 `
  -Sku Standard
  
$PublicIP_v6 = New-AzPublicIpAddress `
  -Name "dsPublicIP_v6" `
  -ResourceGroupName $rg.ResourceGroupName `
  -Location $rg.Location  `
  -AllocationMethod Static `
  -IpAddressVersion IPv6 `
  -Sku Standard

$RdpPublicIP_1 = New-AzPublicIpAddress `
  -Name "RdpPublicIP_1" `
  -ResourceGroupName $rg.ResourceGroupName `
  -Location $rg.Location  `
  -AllocationMethod Static `
  -Sku Standard `
  -IpAddressVersion IPv4
  
$RdpPublicIP_2 = New-AzPublicIpAddress `
  -Name "RdpPublicIP_2" `
  -ResourceGroupName $rg.ResourceGroupName `
  -Location $rg.Location  `
  -AllocationMethod Static `
  -Sku Standard `
  -IpAddressVersion IPv4

# Create front-end IP address
$frontendIPv4 = New-AzLoadBalancerFrontendIpConfig `
  -Name "dsLbFrontEnd_v4" `
  -PublicIpAddress $PublicIP_v4

$frontendIPv6 = New-AzLoadBalancerFrontendIpConfig `
  -Name "dsLbFrontEnd_v6" `
  -PublicIpAddress $PublicIP_v6

# Configure back-end address pool  
$backendPoolv4 = New-AzLoadBalancerBackendAddressPoolConfig `
-Name "dsLbBackEndPool_v4"
$backendPoolv6 = New-AzLoadBalancerBackendAddressPoolConfig `
-Name "dsLbBackEndPool_v6"

# Create load balancer rule
$lbrule_v4 = New-AzLoadBalancerRuleConfig `
  -Name "dsLBrule_v4" `
  -FrontendIpConfiguration $frontendIPv4 `
  -BackendAddressPool $backendPoolv4 `
  -Protocol Tcp `
  -FrontendPort 80 `
  -BackendPort 80

$lbrule_v6 = New-AzLoadBalancerRuleConfig `
  -Name "dsLBrule_v6" `
  -FrontendIpConfiguration $frontendIPv6 `
  -BackendAddressPool $backendPoolv6 `
  -Protocol Tcp `
  -FrontendPort 80 `
  -BackendPort 80
  
# Create Standard Load Balancer
$lb = New-AzLoadBalancer `
-ResourceGroupName $rg.ResourceGroupName `
-Location $rg.Location  `
-Name "MyLoadBalancer" `
-Sku "Standard" `
-FrontendIpConfiguration $frontendIPv4,$frontendIPv6 `
-BackendAddressPool $backendPoolv4,$backendPoolv6 `
-LoadBalancingRule $lbrule_v4,$lbrule_v6

# Create availability set
$avset = New-AzAvailabilitySet `
  -ResourceGroupName $rg.ResourceGroupName `
  -Location $rg.Location  `
  -Name "dsAVset" `
  -PlatformFaultDomainCount 2 `
  -PlatformUpdateDomainCount 2 `
  -Sku aligned
  
# Create network security group and rules
$rule1 = New-AzNetworkSecurityRuleConfig `
-Name 'myNetworkSecurityGroupRuleRDP' `
-Description 'Allow RDP' `
-Access Allow `
-Protocol Tcp `
-Direction Inbound `
-Priority 100 `
-SourceAddressPrefix * `
-SourcePortRange * `
-DestinationAddressPrefix * `
-DestinationPortRange 3389

$rule2 = New-AzNetworkSecurityRuleConfig `
  -Name 'myNetworkSecurityGroupRuleHTTP' `
  -Description 'Allow HTTP' `
  -Access Allow `
  -Protocol Tcp `
  -Direction Inbound `
  -Priority 200 `
  -SourceAddressPrefix * `
  -SourcePortRange 80 `
  -DestinationAddressPrefix * `
  -DestinationPortRange 80

$nsg = New-AzNetworkSecurityGroup `
-ResourceGroupName $rg.ResourceGroupName `
-Location $rg.Location  `
-Name "dsNSG1"  `
-SecurityRules $rule1,$rule2

#Create virtual network and subnet
# Create dual stack subnet
$subnet = New-AzVirtualNetworkSubnetConfig `
-Name "dsSubnet" `
-AddressPrefix "10.0.0.0/24","ace:cab:deca:deed::/64"

# Create the virtual network
$vnet = New-AzVirtualNetwork `
-ResourceGroupName $rg.ResourceGroupName `
-Location $rg.Location  `
-Name "dsVnet" `
-AddressPrefix "10.0.0.0/16","ace:cab:deca::/48"  `
-Subnet $subnet
  
#Create network interfaces (NICs)
$Ip4Config=New-AzNetworkInterfaceIpConfig `
-Name dsIp4Config `
-Subnet $vnet.subnets[0] `
-PrivateIpAddressVersion IPv4 `
-LoadBalancerBackendAddressPool $backendPoolv4 `
-PublicIpAddress  $RdpPublicIP_1
  	
$Ip6Config=New-AzNetworkInterfaceIpConfig `
-Name dsIp6Config `
-Subnet $vnet.subnets[0] `
-PrivateIpAddressVersion IPv6 `
-LoadBalancerBackendAddressPool $backendPoolv6
    
$NIC_1 = New-AzNetworkInterface `
-Name "dsNIC1" `
-ResourceGroupName $rg.ResourceGroupName `
-Location $rg.Location  `
-NetworkSecurityGroupId $nsg.Id `
-IpConfiguration $Ip4Config,$Ip6Config 
    
$Ip4Config=New-AzNetworkInterfaceIpConfig `
-Name dsIp4Config `
-Subnet $vnet.subnets[0] `
-PrivateIpAddressVersion IPv4 `
-LoadBalancerBackendAddressPool $backendPoolv4 `
-PublicIpAddress  $RdpPublicIP_2  

$NIC_2 = New-AzNetworkInterface `
-Name "dsNIC2" `
-ResourceGroupName $rg.ResourceGroupName `
-Location $rg.Location  `
-NetworkSecurityGroupId $nsg.Id `
-IpConfiguration $Ip4Config,$Ip6Config 

# Create virtual machines
$cred = get-credential -Message "DUAL STACK VNET SAMPLE:  Please enter the Administrator credential to log into the VMs"

$vmsize = "Standard_A2"
$ImagePublisher = "MicrosoftWindowsServer"
$imageOffer = "WindowsServer"
$imageSKU = "2019-Datacenter"

$vmName= "dsVM1"
$VMconfig1 = New-AzVMConfig -VMName $vmName -VMSize $vmsize -AvailabilitySetId $avset.Id 3> $null | Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent 3> $null | Set-AzVMSourceImage -PublisherName $ImagePublisher -Offer $imageOffer -Skus $imageSKU -Version "latest" 3> $null | Set-AzVMOSDisk -Name "$vmName.vhd" -CreateOption fromImage  3> $null | Add-AzVMNetworkInterface -Id $NIC_1.Id  3> $null 
$VM1 = New-AzVM -ResourceGroupName $rg.ResourceGroupName  -Location $rg.Location  -VM $VMconfig1 

$vmName= "dsVM2"
$VMconfig2 = New-AzVMConfig -VMName $vmName -VMSize $vmsize -AvailabilitySetId $avset.Id 3> $null | Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent 3> $null | Set-AzVMSourceImage -PublisherName $ImagePublisher -Offer $imageOffer -Skus $imageSKU -Version "latest" 3> $null | Set-AzVMOSDisk -Name "$vmName.vhd" -CreateOption fromImage  3> $null | Add-AzVMNetworkInterface -Id $NIC_2.Id  3> $null 
$VM2 = New-AzVM -ResourceGroupName $rg.ResourceGroupName  -Location $rg.Location  -VM $VMconfig2

#End Of Script

```
## Clean up deployment

Run the following command to remove the resource group, VM, and all related resources:

```powershell
Remove-AzResourceGroup -Name <resourcegroupname> -Force
```
## Script explanation

This script uses the following commands to create a resource group, virtual machine, availability set, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) | Creates a subnet configuration. This configuration is used with the virtual network creation process. |
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) | Creates an Azure virtual network and subnet. |
| [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress)  | Creates a public IP address with a static IP address and an associated DNS name. |
| [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer)  | Creates an Azure load balancer. |
| [New-AzLoadBalancerProbeConfig](/powershell/module/az.network/new-azloadbalancerprobeconfig) | Creates a load balancer probe. A load balancer probe is used to monitor each VM in the load balancer set. If any VM becomes inaccessible, traffic is not routed to the VM. |
| [New-AzLoadBalancerRuleConfig](/powershell/module/az.network/new-azloadbalancerruleconfig) | Creates a load balancer rule. In this sample, a rule is created for port 80. As HTTP traffic arrives at the load balancer, it is routed to port 80 one of the VMs in the load balancer set. |
| [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) | Creates a network security group (NSG), which is a security boundary between the internet and the virtual machine. |
| [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) | Creates an NSG rule to allow inbound traffic. In this sample, port 22 is opened for SSH traffic. |
| [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) | Creates a virtual network card and attaches it to the virtual network, subnet, and NSG. |
| [New-AzAvailabilitySet](/powershell/module/az.compute/new-azavailabilityset) | Creates an availability set. Availability sets ensure application uptime by spreading the virtual machines across physical resources such that if failure occurs, the entire set is not affected. |
| [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) | Creates a VM configuration. This configuration includes information such as VM name, operating system, and administrative credentials. The configuration is used during VM creation. |
| [New-AzVM](/powershell/module/az.compute/new-azvm)  | Creates the virtual machine and connects it to the network card, virtual network, subnet, and NSG. This command also specifies the virtual machine image to be used and administrative credentials.  |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/azure/overview).

Additional networking PowerShell script samples can be found in the [Azure Networking Overview documentation](../powershell-samples.md?toc=%2fazure%2fnetworking%2ftoc.json).
