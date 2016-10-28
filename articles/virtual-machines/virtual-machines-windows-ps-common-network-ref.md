<properties
	pageTitle="Common network PowerShell commands for VMs | Microsoft Azure"
	description="Common PowerShell commands to get you started creating a virtual network and its associated resources for VMs."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="davidmu1"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/27/2016"
	ms.author="davidmu"/>

# Common network Azure PowerShell commands for VMs

If you want to create a virtual machine, you need to create a [virtual network](../virtual-network/virtual-networks-overview.md) or know about an existing virtual network in which the VM can be added. Typically, when you create a VM, you also need to consider creating the resources described in this article.

See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for information about installing the latest version of Azure PowerShell, selecting your subscription, and signing in to your account.

## Create network resources

Task | Command 
-------------- | -------------------------
Create subnet configurations | $subnet1 = [New-AzureRmVirtualNetworkSubnetConfig](https://msdn.microsoft.com/library/mt619412.aspx) -Name "subnet_name" -AddressPrefix XX.X.X.X/XX<BR>$subnet2 = New-AzureRmVirtualNetworkSubnetConfig -Name "subnet_name" -AddressPrefix XX.X.X.X/XX<BR><BR>A typical network might have a subnet for an [internet facing load balancer](../load-balancer/load-balancer-internet-overview.md) and a separate subnet for an [internal load balancer](../load-balancer/load-balancer-internal-overview.md). |
Create a virtual network | $vnet = [New-AzureRmVirtualNetwork](https://msdn.microsoft.com/library/mt603657.aspx) -Name "virtual_network_name" -ResourceGroupName "resource_group_name" -Location "location_name" -AddressPrefix XX.X.X.X/XX -Subnet $subnet1, $subnet2
Test for a unique domain name | [Test-AzureRmDnsAvailability](https://msdn.microsoft.com/library/mt619419.aspx) -DomainQualifiedName "domain_name" -Location "location_name"<BR><BR>You can specify a DNS domain name for a [public IP resource](../virtual-network/virtual-network-ip-addresses-overview-arm.md), which creates a mapping for domainname.location.cloudapp.azure.com to the public IP address in the Azure-managed DNS servers. The name can contain only letters, numbers, and hyphens. The first and last character must be a letter or number and the domain name must be unique within its Azure location. If **True** is returned, your proposed name is globally unique.
Create a public IP address | $pip = [New-AzureRmPublicIpAddress](https://msdn.microsoft.com/library/mt603620.aspx) -Name "ip_address_name" -ResourceGroupName "resource_group_name" -DomainNameLabel "domain_name" -Location "location_name" -AllocationMethod Dynamic<BR><BR>The public IP address uses the domain name that you previously tested and is used by the frontend configuration of the load balancer.
Create a frontend IP configuration | $frontendIP = [New-AzureRmLoadBalancerFrontendIpConfig](https://msdn.microsoft.com/library/mt603510.aspx) -Name "frontend_ip_name" -PublicIpAddress $pip<BR><BR>The frontend configuration includes the public IP address that you previously created for incoming network traffic.
Create a backend address pool | $beAddressPool = [New-AzureRmLoadBalancerBackendAddressPoolConfig](https://msdn.microsoft.com/library/mt603791.aspx) -Name "backend_pool_name"<BR><BR>Provides internal addresses for the backend of the load balancer that are accessed through a network interface.
Create a probe | $healthProbe = [New-AzureRmLoadBalancerProbeConfig](https://msdn.microsoft.com/library/mt603847.aspx) -Name "probe_name" -RequestPath 'HealthProbe.aspx' -Protocol http -Port 80 -IntervalInSeconds 15 -ProbeCount 2<BR><BR>Contains health probes used to check availability of virtual machines instances in the backend address pool.
Create a load balancing rule | $lbRule = [New-AzureRmLoadBalancerRuleConfig](https://msdn.microsoft.com/library/mt619391.aspx) -Name HTTP -FrontendIpConfiguration $frontendIP -BackendAddressPool $beAddressPool -Probe $healthProbe -Protocol Tcp -FrontendPort 80 -BackendPort 80<BR><BR>Contains rules that assign a public port on the load balancer to a port in the backend address pool.
Create an inbound NAT rule | $inboundNATRule = [New-AzureRmLoadBalancerInboundNatRuleConfig](https://msdn.microsoft.com/library/mt603606.aspx) -Name "rule_name" -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3441 -BackendPort 3389<BR><BR>Contains rules mapping a public port on the load balancer to a port for a specific virtual machine in the backend address pool.
Create a load balancer | $loadBalancer = [New-AzureRmLoadBalancer](https://msdn.microsoft.com/library/mt619450.aspx) -ResourceGroupName "resource_group_name" -Name "load_balancer_name" -Location "location_name" -FrontendIpConfiguration $frontendIP -InboundNatRule $inboundNATRule -LoadBalancingRule $lbRule -BackendAddressPool $beAddressPool -Probe $healthProbe
Create a network interface | $nic1= [New-AzureRmNetworkInterface](https://msdn.microsoft.com/library/mt619370.aspx) -ResourceGroupName "resource_group_name" -Name "network_interface_name" -Location "location_name" -PrivateIpAddress XX.X.X.X -Subnet subnet2 -LoadBalancerBackendAddressPool $loadBalancer.BackendAddressPools[0] -LoadBalancerInboundNatRule $loadBalancer.InboundNatRules[0]<BR><BR>Create a network interface using the public IP address and virtual network subnet that you previously created.
	
## Get information about network resources

Task | Command 
-------------- | -------------------------
List virtual networks | [Get-AzureRmVirtualNetwork](https://msdn.microsoft.com/library/mt603515.aspx) -ResourceGroupName "resource_group_name"<BR><BR>Lists all the virtual networks in the resource group.
Get information about a virtual network | Get-AzureRmVirtualNetwork -Name "virtual_network_name" -ResourceGroupName "resource_group_name"
List subnets in a virtual network | Get-AzureRmVirtualNetwork -Name "virtual_network_name" -ResourceGroupName "resource_group_name" &#124; Select Subnets
Get information about a subnet | [Get-AzureRmVirtualNetworkSubnetConfig](https://msdn.microsoft.com/library/mt603817.aspx) -Name "subnet_name" -VirtualNetwork $vnet<BR><BR>Gets information about the subnet in the specified virtual network. The $vnet value represents the object returned by Get-AzureRmVirtualNetwork.
List IP addresses | [Get-AzureRmPublicIpAddress](https://msdn.microsoft.com/library/mt619342.aspx) -ResourceGroupName "resource_group_name"<BR><BR>Lists the public IP addresses in the resource group.
List load balancers | [Get-AzureRmLoadBalancer](https://msdn.microsoft.com/library/mt603668.aspx) -ResourceGroupName "resource_group_name"<BR><BR>Lists all the load balancers in the resource group.
List network interfaces | [Get-AzureRmNetworkInterface](https://msdn.microsoft.com/library/mt619434.aspx) -ResourceGroupName "resource_group_name"<BR><BR>Lists all the network interfaces in the resource group.
Get information about a network interface | Get-AzureRmNetworkInterface -Name "network_interface_name" -ResourceGroupName "resource_group_name"<BR><BR>Gets information about a specific network interface.
Get the IP configuration of a network interface | [Get-AzureRmNetworkInterfaceIPConfig](https://msdn.microsoft.com/library/mt732618.aspx) -Name "ipconfiguration_name" -NetworkInterface $nic<BR><BR>Gets information about the IP configuration of the specified network interface. The $nic value represents the object returned by Get-AzureRmNetworkInterface.

## Manage network resources

Task | Command 
-------------- | -------------------------
Add a subnet to a virtual network | [Add-AzureRmVirtualNetworkSubnetConfig](https://msdn.microsoft.com/library/mt603722.aspx) -AddressPrefix XX.X.X.X/XX -Name "subnet_name" -VirtualNetwork $vnet<BR><BR>Adds a subnet to an existing virtual network. The $vnet value represents the object returned by Get-AzureRmVirtualNetwork.
Delete a virtual network | [Remove-AzureRmVirtualNetwork](https://msdn.microsoft.com/library/mt619338.aspx) -Name "virtual_network_name" -ResourceGroupName "resource_group_name"<BR><BR>Removes the specified virtual network from the resource group.
Delete a network interface | [Remove-AzureRmNetworkInterface](https://msdn.microsoft.com/library/mt603836.aspx) -Name "network_interface_name" -ResourceGroupName "resource_group_name"<BR><BR>Removes the specified network interface from the resource group.
Delete a load balancer | [Remove-AzureRmLoadBalancer](https://msdn.microsoft.com/library/mt603862.aspx) -Name "load_balancer_name" -ResourceGroupName "resource_group_name"<BR><BR>Removes the specified load balancer from the resource group.
Delete a public IP address | [Remove-AzureRmPublicIpAddress](https://msdn.microsoft.com/library/mt619352.aspx)-Name "ip_address_name" -ResourceGroupName "resource_group_name"<BR><BR>Removes the specified public IP address from the resource group.

## Next Steps

- Use the network interface that you just created when you [create a VM](virtual-machines-windows-ps-create.md).
- Learn about how you can [create a VM with multiple network interfaces](../virtual-network/virtual-networks-multiple-nics.md).
