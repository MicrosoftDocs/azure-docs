<properties
   pageTitle="Load balancing on multiple IP configurations"
   description="Load balancing across primary and secondary ip configurations"
   services="load-balancer"
   documentationCenter="na"
   authors="anavinahar"
   manager="narayan"
   editor="na" />
<tags
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="11/01/2016"
   ms.author="annahar" />

# Load balancing on multiple IP configurations

This article describes how to use Azure Load Balancer with Multiple IPs per NIC. The scenario has two VMs with a single NIC each and multiple IP configurations on each NIC. Both websites are hosted on these VMs and each web server instance is bound to one of the IP configurations. We will use Azure Load Balancer to expose two frontend IP addresses, one for each website, and distribute them to the respective IP configuration for the website. The scenario will use the same port number across both frontends as well as both backend pool IP addresses. Load balancing across both primary and secondary IP configurations is achieved through this scenario in addition to cost savings via port resusibility.

The websites we configure will reside at these following Fully Qualified Domain Names (FDQN):

www.contoso.com

www.fabrikam.com 

You could host your domains using [Azure DNS](../dns/dns-overview.md). The final step in this scenario is the DNS set up. 

![LB scenario image](./media/load-balancer-multiple-ip/lb-multi-ip.PNG)


## Limitations

At this time, load balancing on secondary IP configurations is limited to PowerShell.

This limitation is temporary, and may change at any time. Make sure to revisit this page to verify future changes.


## Steps to load balance on multiple IP configurations 

Follow the steps below to achieve the scenario outlined in this article:

1. Install Azure PowerShell. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for information about installing the latest version of Azure PowerShell, selecting your subscription, and signing in to your account.

2. Follow step 2 to [Create a Resource Group](../virtual-machines/virtual-machines-windows-ps-create.md). Be sure to use:
    
        $location = "westcentralus".
        $myResourceGroup = "contosofabrikam"

3. [Create an Availability Set](../virtual-machines/virtual-machines-windows-create-availability-set.md) to contain your VMs to allow them to be added to an Azure Load Balancer pool later on. For this scenario use the following:

        New-AzureRmAvailabilitySet -ResourceGroupName "contosofabrikam" -Name "myAvailset" -Location "West Central US"

4. Follow instructions steps 3 through 5 in [Create a Windows VM](../virtual-machines/virtual-machines-windows-ps-create.md) article to prepare the creation of a VM with a single NIC. Execute step 6.1, and use the following instead of step 6.2:

        $availset = Get-AzureRmAvailabilitySet -ResourceGroupName “contosofabrikam” -Name "myAvailset"

        New-AzureRmVMConfig -VMName “VM1” -VMSize “Standard_DS1_v2” -AvailabilitySetId $availset.Id

5. Then complete [Create a Windows VM](../virtual-machines/virtual-machines-windows-ps-create.md) steps 6.3 through 6.8. 

6. Next, we will add a second IP configuration to each of the VMs following instructions in the Add IP addresses to an existing VM section of [Assign multiple IP addresses to virtual machines](../virtual-network/virtual-network-multiple-ip-addresses-powershell.md) article. Use

        $NicName = “VM1-NIC”

        $RgName = “contosofabrikam”

        $NicLocation = “West Central US”
        
        $IPConfigName4 = "VM1-ipconfig2"

        $mySubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name "mySubnet" -VirtualNetwork $myVnet

    Note that $Subnet1 should be replaced by $mySubnet if you have been following along from the [Create a Windows VM](../virtual-machines/virtual-machines-windows-ps-create.md) article. You do not need to associate the secondary IP configurations with public IPs for the purpose of this tutorial so edit the command to remove the public IP association part.

7. Complete steps 4 through 6 again for VM2. Be sure to replace the VM name to VM2 when doing this. 

8. Create two public IP addresses and store them in the appropriate variables as shown:

        $publicIP1 = New-AzureRmPublicIpAddress -Name PublicIp1 -ResourceGroupName contosofabrikam -Location 'West Central US' –AllocationMethod Static -DomainNameLabel contoso

        $publicIP2 = New-AzureRmPublicIpAddress -Name PublicIp2 -ResourceGroupName contosofabrikam -Location 'West Central US' –AllocationMethod Static -DomainNameLabel fabrikam

        $publicIP1 = Get-AzureRmPublicIpAddress -Name PublicIp1 -ResourceGroupName contosofabrikam
        $publicIP2 = Get-AzureRmPublicIpAddress -Name PublicIp2 -ResourceGroupName contosofabrikam


9. Create two frontend IP configurations:

        $frontendIP1 = New-AzureRmLoadBalancerFrontendIpConfig -Name contosofe -PublicIpAddress $publicIP1

        $frontendIP2 = New-AzureRmLoadBalancerFrontendIpConfig -Name fabrikamfe -PublicIpAddress $publicIP2

10. Create your backend address pools, a proble and your load balacing rules:

        $beaddresspool1 = New-AzureRmLoadBalancerBackendAddressPoolConfig -Name contosopool

        $beaddresspool2 = New-AzureRmLoadBalancerBackendAddressPoolConfig -Name fabrikampool

        $healthProbe = New-AzureRmLoadBalancerProbeConfig -Name HTTP -RequestPath 'index.html' -Protocol http -Port 80 -IntervalInSeconds 15 -ProbeCount 2

        $lbrule1 = New-AzureRmLoadBalancerRuleConfig -Name HTTP -FrontendIpConfiguration $frontendIP1 -BackendAddressPool $beaddresspool1 -Probe $healthprobe -Protocol Tcp -FrontendPort 80 -BackendPort 80

        $lbrule2 = New-AzureRmLoadBalancerRuleConfig -Name HTTP -FrontendIpConfiguration $frontendIP2 -BackendAddressPool $beaddresspool2 -Probe $healthprobe -Protocol Tcp -FrontendPort 80 -BackendPort 80

11. Once you have these resources created, create your load balancer:

        $mylb = New-AzureRmLoadBalancer -ResourceGroupName contosofabrikam -Name mylb -Location 'West Central US' -FrontendIpConfiguration $frontendIP1 -LoadBalancingRule $lbrule -BackendAddressPool $beAddressPool -Probe $healthProbe

12. Add the second backend address pool and frontend IP configuration to your newly created load balancer:

        $mylb = Get-AzureRmLoadBalancer -Name "mylb" -ResourceGroupName $myResourceGroup | Add-AzureRmLoadBalancerBackendAddressPoolConfig -Name fabrikampool | Set-AzureRmLoadBalancer

        $mylb | Add-AzureRmLoadBalancerFrontendIpConfig -Name fabrikamfe -PublicIpAddress $publicIP2 | Set-AzureRmLoadBalancer

13. The commands below get the NICs and then add both IP configurations of each NIC to the backend address pool of the load balancer:


        $nic1 = Get-AzureRmNetworkInterface -Name “VM1-NIC” -ResourceGroupName “MyResourcegroup”;
        $nic2 = Get-AzureRmNetworkInterface -Name “VM2-NIC” -ResourceGroupName “MyResourcegroup”;


        $nic1.IpConfigurations[0].LoadBalancerBackendAddressPools.Add($mylb.BackendAddressPools[0]);
        $nic1.IpConfigurations[1].LoadBalancerBackendAddressPools.Add($mylb.BackendAddressPools[1]);
        $nic2.IpConfigurations[0].LoadBalancerBackendAddressPools.Add($mylb.BackendAddressPools[0]);
        $nic2.IpConfigurations[1].LoadBalancerBackendAddressPools.Add($mylb.BackendAddressPools[1]);

        $mylb = $mylb | Set-AzureRmLoadBalancer

        $nic1 | Set-AzureRmNetworkInterface

        $nic2 | Set-AzureRmNetworkInterface

14. Finally, you must configure your DNS zones to have A (address) resource records pointing to the respective frontend IP address of the Load Balancer. The DNS hosting for these domain names is outside of the scope of this tutorial. One option is to use Azure DNS to host your domain using Azure.