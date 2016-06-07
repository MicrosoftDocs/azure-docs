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
	ms.date="06/07/2016"
	ms.author="davidmu"/>

# Common network Azure PowerShell commands for VMs

If you want to create a virtual machine, you need to create a [virtual network](../virtual-network/virtual-networks-overview.md) or know about an existing virtual network in which the VM can be added. Typically, when you create a VM, you also need to consider creating the resources described in this article.

See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for information about how to install the latest version of Azure PowerShell, select the subscription that you want to use, and sign in to your Azure account.

Resource | Command 
-------------- | -------------------------
Subnet | &nbsp;&nbsp;&nbsp;&nbsp;**$internetSubnet = [New-AzureRmVirtualNetworkSubnetConfig](https://msdn.microsoft.com/library/mt619412.aspx) -Name internetSubnet -AddressPrefix 10.0.1.0/24**<P>&nbsp;&nbsp;&nbsp;&nbsp;**$internalSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name internalSubnet -AddressPrefix 10.0.2.0/24**</P><P>A typical network might have a subnet for a [internet facing load balancer](../load-balancer/load-balancer-internet-overview.md) and a separate subnet for an [internal load balancer](../load-balancer/load-balancer-internal-overview.md). |
Virtual network | Create a virtual network:<P>&nbsp;&nbsp;&nbsp;&nbsp;**$rgName = "[resource-group-name](../powershell-azure-resource-manager.md)"**</P><P>&nbsp;&nbsp;&nbsp;&nbsp;**$locName = "[location-name](https://msdn.microsoft.com/library/azure/dn495177.aspx)"**</P><P>&nbsp;&nbsp;&nbsp;&nbsp;**$vnetName = "virtual-network-name"**</P><P>&nbsp;&nbsp;&nbsp;&nbsp;**$vnet = [New-AzureRmVirtualNetwork](https://msdn.microsoft.com/library/mt603657.aspx) -Name $vnetName -ResourceGroupName $rgName -Location $locName -AddressPrefix 10.0.0.0/16 -Subnet $internetSubnet,$internalSubnet**</P><P>Get a list of virtual networks:</P><P>&nbsp;&nbsp;&nbsp;&nbsp;**[Get-AzureRmVirtualNetwork](https://msdn.microsoft.com/library/mt603515.aspx) -ResourceGroupName $rgName &#124; Sort Name &#124; Select Name**</P><P>List the subnets in a virtual network:</P><P>&nbsp;&nbsp;&nbsp;&nbsp;**Get-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName &#124; Select Subnets**</P><P>You should see something like this that shows the list of subnets:</P><P>&nbsp;&nbsp;&nbsp;&nbsp;Subnets</P><P>&nbsp;&nbsp;&nbsp;&nbsp;-------</P><P>&nbsp;&nbsp;&nbsp;&nbsp;{internetSubnet, internalSubnet}</P><P>The subnet index for the internetSubnet is 0 and the subnet index for the internalSubnet is 1.</P>
Domain name label | &nbsp;&nbsp;&nbsp;&nbsp;**$domName = "domain-name"**<P>&nbsp;&nbsp;&nbsp;&nbsp;**[Test-AzureRmDnsAvailability](https://msdn.microsoft.com/library/mt619419.aspx) -DomainQualifiedName $domName -Location $locName**</P><P>You can specify a DNS domain name label for a [public IP resource](../virtual-network/virtual-network-ip-addresses-overview-arm.md), which creates a mapping for domainnamelabel.location.cloudapp.azure.com to the public IP address in the Azure-managed DNS servers. The label can contain only letters, numbers, and hyphens. The first and last character must be a letter or number and the domain name label must be unique within its Azure location. You should always test whether your domain name label is globally unique. If **True** is returned, your proposed name is globally unique.</P>
Public IP address | &nbsp;&nbsp;&nbsp;&nbsp;**$ipName = "public-ip-address-name"**<P>&nbsp;&nbsp;&nbsp;&nbsp;**$pip = [New-AzureRmPublicIpAddress](https://msdn.microsoft.com/library/mt603620.aspx) -Name $ipName -ResourceGroupName $rgName -DomainNameLabel $domName -Location $locName -AllocationMethod Dynamic**</P><P>The public IP address uses the domain name label that you previously created and is used by the frontend configuration of the load balancer.</P>
Frontend IP configuration | &nbsp;&nbsp;&nbsp;&nbsp;**$feConfigName = "frontend-ip-config-name"**</P><P>&nbsp;&nbsp;&nbsp;&nbsp;**$frontendIP = [New-AzureRmLoadBalancerFrontendIpConfig](https://msdn.microsoft.com/library/mt603510.aspx) -Name $feConfigName -PublicIpAddress $pip**</P><P>The frontend configuration includes the public IP address that you previously created for incoming network traffic.</P>
Backend address pool | &nbsp;&nbsp;&nbsp;&nbsp;**$bePoolName = "back-end-pool-name"**<P>&nbsp;&nbsp;&nbsp;&nbsp;**$beAddressPool = [New-AzureRmLoadBalancerBackendAddressPoolConfig](https://msdn.microsoft.com/library/mt603791.aspx) -Name $bePoolName**</P><P>Provides internal addresses for the backend of the load balancer that are accessed through a network interface.</P>
Probe | &nbsp;&nbsp;&nbsp;&nbsp;**$probeName = "health-probe-name"**<P>&nbsp;&nbsp;&nbsp;&nbsp;**$healthProbe = [New-AzureRmLoadBalancerProbeConfig](https://msdn.microsoft.com/library/mt603847.aspx) -Name $probeName -RequestPath 'HealthProbe.aspx' -Protocol http -Port 80 -IntervalInSeconds 15 -ProbeCount 2**</P><P>Contains health probes used to check availability of virtual machines instances in the backend address pool.</P>
Load balancing rule | &nbsp;&nbsp;&nbsp;&nbsp;**$lbRule = [New-AzureRmLoadBalancerRuleConfig](https://msdn.microsoft.com/library/mt619391.aspx) -Name HTTP -FrontendIpConfiguration $frontendIP -BackendAddressPool  $beAddressPool -Probe $healthProbe -Protocol Tcp -FrontendPort 80 -BackendPort 80**<P>Contains rules mapping a public port on the load balancer to a port in the backend address pool.</P>
Inbound NAT rule | &nbsp;&nbsp;&nbsp;&nbsp;**$ruleName = "NAT-rule-name"**<P>&nbsp;&nbsp;&nbsp;&nbsp;**$inboundNATRule = [New-AzureRmLoadBalancerInboundNatRuleConfig](https://msdn.microsoft.com/library/mt603606.aspx) -Name $ruleName -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3441 -BackendPort 3389**<P>Contains rules mapping a public port on the load balancer to a port for a specific virtual machine in the backend address pool.</P>
Load balancer | &nbsp;&nbsp;&nbsp;&nbsp;**$lbName = "load-balancer-name"**<P>&nbsp;&nbsp;&nbsp;&nbsp;**$loadBalancer = [New-AzureRmLoadBalancer](https://msdn.microsoft.com/library/mt619450.aspx) -ResourceGroupName $rgName -Name $lbName -Location $locName -FrontendIpConfiguration $frontendIP -InboundNatRule $inboundNATRule -LoadBalancingRule $lbRule -BackendAddressPool $beAddressPool -Probe $healthProbe**</P>
Network interface | &nbsp;&nbsp;&nbsp;&nbsp;**$vnet = [Get-AzureRmVirtualNetwork](https://msdn.microsoft.com/library/mt603515.aspx) -Name $vnetName -ResourceGroupName $rgName**<P>&nbsp;&nbsp;&nbsp;&nbsp;**$internalSubnet = [Get-AzureRmVirtualNetworkSubnetConfig](https://msdn.microsoft.com/library/mt603817.aspx) -Name "internalSubnet" -VirtualNetwork $vnet**</P><P>&nbsp;&nbsp;&nbsp;&nbsp;**$nicName = "network-interface-name"**</P><P>&nbsp;&nbsp;&nbsp;&nbsp;**$nic1= [New-AzureRmNetworkInterface](https://msdn.microsoft.com/library/mt619370.aspx) -ResourceGroupName $rgName -Name $nicName -Location $locName -PrivateIpAddress 10.0.2.6 -Subnet $internalSubnet -LoadBalancerBackendAddressPool $loadBalancer.BackendAddressPools[0] -LoadBalancerInboundNatRule $loadBalancer.InboundNatRules[0]**</P><P>Create a network interface using the public IP address and virtual network subnet that you previously created.
	
## Next Steps

- Use the network interface that you just created when you [create a VM](virtual-machines-windows-ps-create.md).
- Learn about how you can [create a VM with multiple network interfaces](../virtual-network/virtual-networks-multiple-nics.md).