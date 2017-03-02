---
title: Common PowerShell commands for Azure Virtual Networks | Microsoft Docs
description: Common PowerShell commands to get you started creating a virtual network and its associated resources for VMs.
services: virtual-machines-windows
documentationcenter: ''
author: davidmu1
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 56e1a73c-8299-4996-bd03-f74585caa1dc
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/02/2017
ms.author: davidmu

---
# Common PowerShell commands for Azure Virtual Machines

If you want to create a virtual machine, you need to create a [virtual network](../virtual-network/virtual-networks-overview.md) or know about an existing virtual network in which the VM can be added. Typically, when you create a VM, you also need to consider creating the resources described in this article.

See [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs) for information about installing the latest version of Azure PowerShell, selecting your subscription, and signing in to your account.

Some variables might be useful for you is you are running more than one of the commands in this article:

- $location - You can use [Get-AzureRmLocation](https://docs.microsoft.com/powershell/resourcemanager/azurerm.resources/v3.5.0/get-azurermlocation) to find a [geographical region](https://azure.microsoft.com/regions/) that works for you.
- $myResourceGroup - Most commands require you to specify the name of the resource group where the network resources are located.

## Create network resources

| Task | Command |
| ---- | ------- |
| Create subnet configurations |$subnet1 = [New-AzureRmVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/New-AzureRmVirtualNetworkSubnetConfig) -Name "mySubnet1" -AddressPrefix XX.X.X.X/XX<BR>$subnet2 = New-AzureRmVirtualNetworkSubnetConfig -Name "mySubnet2" -AddressPrefix XX.X.X.X/XX<BR><BR>A typical network might have a subnet for an [internet facing load balancer](../load-balancer/load-balancer-internet-overview.md) and a separate subnet for an [internal load balancer](../load-balancer/load-balancer-internal-overview.md). |
| Create a virtual network |$vnet = [New-AzureRmVirtualNetwork](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/New-AzureRmVirtualNetwork) -Name "myVNet" -ResourceGroupName $myResourceGroup -Location $location -AddressPrefix XX.X.X.X/XX -Subnet $subnet1, $subnet2 |
| Test for a unique domain name |[Test-AzureRmDnsAvailability](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/Test-AzureRmDnsAvailability) -DomainNameLabel "myDNS" -Location $location<BR><BR>You can specify a DNS domain name for a [public IP resource](../virtual-network/virtual-network-ip-addresses-overview-arm.md), which creates a mapping for domainname.location.cloudapp.azure.com to the public IP address in the Azure-managed DNS servers. The name can contain only letters, numbers, and hyphens. The first and last character must be a letter or number and the domain name must be unique within its Azure location. If **True** is returned, your proposed name is globally unique. |
| Create a public IP address |$pip = [New-AzureRmPublicIpAddress](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/New-AzureRmPublicIpAddress) -Name "myPublicIp" -ResourceGroupName $myResourceGroup -DomainNameLabel "myDNS" -Location $location -AllocationMethod Dynamic<BR><BR>The public IP address uses the domain name that you previously tested and is used by the frontend configuration of the load balancer. |
| Create a frontend IP configuration |$frontendIP = [New-AzureRmLoadBalancerFrontendIpConfig](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/New-AzureRmLoadBalancerFrontendIpConfig) -Name "myFrontendIP" -PublicIpAddress $pip<BR><BR>The frontend configuration includes the public IP address that you previously created for incoming network traffic. |
| Create a backend address pool |$beAddressPool = [New-AzureRmLoadBalancerBackendAddressPoolConfig](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/New-AzureRmLoadBalancerBackendAddressPoolConfig) -Name "myBackendAddressPool"<BR><BR>Provides internal addresses for the backend of the load balancer that are accessed through a network interface. |
| Create a probe |$healthProbe = [New-AzureRmLoadBalancerProbeConfig](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/New-AzureRmLoadBalancerProbeConfig) -Name "myProbe" -RequestPath 'HealthProbe.aspx' -Protocol http -Port 80 -IntervalInSeconds 15 -ProbeCount 2<BR><BR>Contains health probes used to check availability of virtual machines instances in the backend address pool. |
| Create a load balancing rule |$lbRule = [New-AzureRmLoadBalancerRuleConfig](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/New-AzureRmLoadBalancerRuleConfig) -Name HTTP -FrontendIpConfiguration $frontendIP -BackendAddressPool $beAddressPool -Probe $healthProbe -Protocol Tcp -FrontendPort 80 -BackendPort 80<BR><BR>Contains rules that assign a public port on the load balancer to a port in the backend address pool. |
| Create an inbound NAT rule |$inboundNATRule = [New-AzureRmLoadBalancerInboundNatRuleConfig](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/New-AzureRmLoadBalancerInboundNatRuleConfig) -Name "myInboundRule1" -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3441 -BackendPort 3389<BR><BR>Contains rules mapping a public port on the load balancer to a port for a specific virtual machine in the backend address pool. |
| Create a load balancer |$loadBalancer = [New-AzureRmLoadBalancer](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/New-AzureRmLoadBalancer) -ResourceGroupName $myResourceGroup -Name "myLoadBalancer" -Location $location -FrontendIpConfiguration $frontendIP -InboundNatRule $inboundNATRule -LoadBalancingRule $lbRule -BackendAddressPool $beAddressPool -Probe $healthProbe |
| Create a network interface |$nic1= [New-AzureRmNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/New-AzureRmNetworkInterface) -ResourceGroupName $myResourceGroup -Name "myNIC" -Location $location -PrivateIpAddress XX.X.X.X -Subnet $subnet2 -LoadBalancerBackendAddressPool $loadBalancer.BackendAddressPools[0] -LoadBalancerInboundNatRule $loadBalancer.InboundNatRules[0]<BR><BR>Create a network interface using the public IP address and virtual network subnet that you previously created. |

## Get information about network resources

| Task | Command |
| ---- | ------- |
| List virtual networks |[Get-AzureRmVirtualNetwork](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/Get-AzureRmVirtualNetwork) -ResourceGroupName $myResourceGroup<BR><BR>Lists all the virtual networks in the resource group. |
| Get information about a virtual network |Get-AzureRmVirtualNetwork -Name "myVNet" -ResourceGroupName $myResourceGroup |
| List subnets in a virtual network |Get-AzureRmVirtualNetwork -Name "myVNet" -ResourceGroupName $myResourceGroup &#124; Select Subnets |
| Get information about a subnet |[Get-AzureRmVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/Get-AzureRmVirtualNetworkSubnetConfig) -Name "mySubnet1" -VirtualNetwork $vnet<BR><BR>Gets information about the subnet in the specified virtual network. The $vnet value represents the object returned by Get-AzureRmVirtualNetwork. |
| List IP addresses |[Get-AzureRmPublicIpAddress](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/Get-AzureRmPublicIpAddress) -ResourceGroupName $myResourceGroup<BR><BR>Lists the public IP addresses in the resource group. |
| List load balancers |[Get-AzureRmLoadBalancer](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/Get-AzureRmLoadBalancer) -ResourceGroupName $myResourceGroup<BR><BR>Lists all the load balancers in the resource group. |
| List network interfaces |[Get-AzureRmNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/Get-AzureRmNetworkInterface) -ResourceGroupName $myResourceGroup<BR><BR>Lists all the network interfaces in the resource group. |
| Get information about a network interface |Get-AzureRmNetworkInterface -Name "myNIC" -ResourceGroupName $myResourceGroup<BR><BR>Gets information about a specific network interface. |
| Get the IP configuration of a network interface |[Get-AzureRmNetworkInterfaceIPConfig](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/Get-AzureRmNetworkInterfaceIpConfig) -Name "myNICIP" -NetworkInterface $nic<BR><BR>Gets information about the IP configuration of the specified network interface. The $nic value represents the object returned by Get-AzureRmNetworkInterface. |

## Manage network resources

| Task | Command |
| ---- | ------- |
| Add a subnet to a virtual network |[Add-AzureRmVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/Add-AzureRmVirtualNetworkSubnetConfig) -AddressPrefix XX.X.X.X/XX -Name "mySubnet1" -VirtualNetwork $vnet<BR><BR>Adds a subnet to an existing virtual network. The $vnet value represents the object returned by Get-AzureRmVirtualNetwork. |
| Delete a virtual network |[Remove-AzureRmVirtualNetwork](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/Remove-AzureRmVirtualNetwork) -Name "myVNet" -ResourceGroupName $myResourceGroup<BR><BR>Removes the specified virtual network from the resource group. |
| Delete a network interface |[Remove-AzureRmNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/Remove-AzureRmNetworkInterface) -Name "myNIC" -ResourceGroupName $myResourceGroup<BR><BR>Removes the specified network interface from the resource group. |
| Delete a load balancer |[Remove-AzureRmLoadBalancer](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/Remove-AzureRmLoadBalancer) -Name "myLoadBalancer" -ResourceGroupName $myResourceGroup<BR><BR>Removes the specified load balancer from the resource group. |
| Delete a public IP address |[Remove-AzureRmPublicIpAddress](https://docs.microsoft.com/powershell/resourcemanager/AzureRM.Network/v3.4.0/Remove-AzureRmPublicIpAddress)-Name "myIPAddress" -ResourceGroupName $myResourceGroup<BR><BR>Removes the specified public IP address from the resource group. |

## Next Steps
* Use the network interface that you just created when you [create a VM](virtual-machines-windows-ps-create.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
* Learn about how you can [create a VM with multiple network interfaces](../virtual-network/virtual-networks-multiple-nics.md).

