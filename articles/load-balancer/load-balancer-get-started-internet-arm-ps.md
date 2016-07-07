<properties 
   pageTitle="Create an Internet facing load balancer in Resource Manager using PowerShell | Microsoft Azure"
   description="Learn how to create an Internet facing load balancer in Resource Manager using PowerShell"
   services="load-balancer"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/05/2016"
   ms.author="joaoma" />

# Get started creating an Internet facing load balancer in Resource Manager using PowerShell

[AZURE.INCLUDE [load-balancer-get-started-internet-arm-selectors-include.md](../../includes/load-balancer-get-started-internet-arm-selectors-include.md)]

[AZURE.INCLUDE [load-balancer-get-started-internet-intro-include.md](../../includes/load-balancer-get-started-internet-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)] This article covers the Resource Manager deployment model. You can also [Learn how to create an Internet facing load balancer using classic deployment model](load-balancer-get-started-internet-classic-cli.md).

[AZURE.INCLUDE [load-balancer-get-started-internet-scenario-include.md](../../includes/load-balancer-get-started-internet-scenario-include.md)]

The steps below will show how to create an Internet facing load balancer using Azure Resource Manager with PowerShell. With Azure Resource Manager, the items to create an Internet facing load balancer are configured individually and then put together to create a resource. 

This will cover the sequence of individual tasks it has to be done to create a load balancer and explain in detail what is being done to accomplish the goal.

## What is required to create an Internet facing load balancer?

You need to create and configure the following objects to deploy a load balancer:

- Front end IP configuration - contains public IP addresses for incoming network traffic. 

- Back end address pool - contains network interfaces (NICs) for the virtual machines to receive network traffic from the load balancer. 

- Load balancing rules - contains rules mapping a public port on the load balancer to port in the back end address pool.

- Inbound NAT rules - contains rules mapping a public port on the load balancer to a port for a specific virtual machine in the back end address pool.

- Probes - contains health probes used to check availability of virtual machines instances in the back end address pool.

You can get more information about load balancer components with Azure resource manager at [Azure Resource Manager support for Load Balancer](load-balancer-arm.md).


## Setup PowerShell to use Resource Manager

Make sure you have the latest production version of the Azure Resource Manager (ARM) module for PowerShell.

### Step 1

		Login-AzureRmAccount

You will be prompted to Authenticate with your credentials.<BR>

### Step 2

Check the subscriptions for the account 

		Get-AzureRmSubscription 

### Step 3 

Choose which of your Azure subscriptions to use. <BR>

		Select-AzureRmSubscription -SubscriptionId 'GUID of subscription'

### Step 4

Create a new resource group (skip this step if using an existing resource group)


    	New-AzureRmResourceGroup -Name NRP-RG -location "West US"


## Create a virtual network and a public IP address for the front-end IP pool

### Step 1

Create a subnet and a virtual network.

    $backendSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name LB-Subnet-BE -AddressPrefix 10.0.2.0/24
    New-AzureRmvirtualNetwork -Name NRPVNet -ResourceGroupName NRP-RG -Location 'West US' -AddressPrefix 10.0.0.0/16 -Subnet $backendSubnet

### Step 2

Create an Azure Public IP address (PIP) resource, named *PublicIP*, to be used by a fronteend IP pool with DNS name *loadbalancernrp.westus.cloudapp.azure.com*. The command below uses the static allocation type.

	$publicIP = New-AzureRmPublicIpAddress -Name PublicIp -ResourceGroupName NRP-RG -Location 'West US' –AllocationMethod Static -DomainNameLabel loadbalancernrp 

>[AZURE.IMPORTANT] The load balancer will use the domain label of the public IP as prefix for its FQDN. This is a change from classic deployment model which uses the cloud service as the load balancer FQDN. 
>In this example, the FQDN will be *loadbalancernrp.westus.cloudapp.azure.com*.

## Create a Front-End IP pool and a Back-End Address Pool

### Step 1 

Create a front-end IP pool named *LB-Frontend* that uses the *PublicIp* PIP.

	$frontendIP = New-AzureRmLoadBalancerFrontendIpConfig -Name LB-Frontend -PublicIpAddress $publicIP 

### Step 2 

Create a back-end address pool named *LB-backend*. 

	$beaddresspool = New-AzureRmLoadBalancerBackendAddressPoolConfig -Name LB-backend

## Create LB rules, NAT rules, a probe, and a load balancer

The example below creates the following items:

- a NAT rule to translate all incoming traffic on port 3441 to port 3389
- a NAT rule to translate all incoming traffic on port 3442 to port 3389.
- a load balancer rule to balance all incoming traffic on port 80 to port 80 on the addresses in the back end pool.
- a probe rule which will check the health status on a page named *HealthProbe.aspx*.
- a load balancer that uses all the objects above.


### Step 1

Create the NAT rules.

	$inboundNATRule1= New-AzureRmLoadBalancerInboundNatRuleConfig -Name RDP1 -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3441 -BackendPort 3389

	$inboundNATRule2= New-AzureRmLoadBalancerInboundNatRuleConfig -Name RDP2 -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3442 -BackendPort 3389

### Step 2

Create a load balancer rule.

	$lbrule = New-AzureRmLoadBalancerRuleConfig -Name HTTP -FrontendIpConfiguration $frontendIP -BackendAddressPool  $beAddressPool -Probe $healthProbe -Protocol Tcp -FrontendPort 80 -BackendPort 80

### Step 3

Create a health probe. There are two ways to configure a probe:
 
HTTP probe
	
	$healthProbe = New-AzureRmLoadBalancerProbeConfig -Name HealthProbe -RequestPath 'HealthProbe.aspx' -Protocol http -Port 80 -IntervalInSeconds 15 -ProbeCount 2
or

TCP probe
	
	$healthProbe = New-AzureRmLoadBalancerProbeConfig -Name HealthProbe -Protocol Tcp -Port 80 -IntervalInSeconds 15 -ProbeCount 2

### Step 4

Create the load balancer using the objects created above.

	$NRPLB = New-AzureRmLoadBalancer -ResourceGroupName NRP-RG -Name NRP-LB -Location 'West US' -FrontendIpConfiguration $frontendIP -InboundNatRule $inboundNATRule1,$inboundNatRule2 -LoadBalancingRule $lbrule -BackendAddressPool $beAddressPool -Probe $healthProbe

## Create NICs

You need to create Network Interfaces (or modify existing ones) and associate them to NAT rules, load balancer rules, and probes.

### Step 1 

Get the Virtual Network and Virtual Network Subnet, where the NICs ned to be created.

	$vnet = Get-AzureRmVirtualNetwork -Name NRPVNet -ResourceGroupName NRP-RG
	$backendSubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name LB-Subnet-BE -VirtualNetwork $vnet 

### Step 2

Create a NIC named *lb-nic1-be*, and associate it with the first NAT rule, and the first (and only) back end address pool.
	
	$backendnic1= New-AzureRmNetworkInterface -ResourceGroupName NRP-RG -Name lb-nic1-be -Location 'West US' -PrivateIpAddress 10.0.2.6 -Subnet $backendSubnet -LoadBalancerBackendAddressPool $nrplb.BackendAddressPools[0] -LoadBalancerInboundNatRule $nrplb.InboundNatRules[0]

### Step 3

Create a NIC named *lb-nic2-be*, and associate it with the second NAT rule, and the first (and only) back-end address pool. 

	$backendnic2= New-AzureRmNetworkInterface -ResourceGroupName NRP-RG -Name lb-nic2-be -Location 'West US' -PrivateIpAddress 10.0.2.7 -Subnet $backendSubnet -LoadBalancerBackendAddressPool $nrplb.BackendAddressPools[0] -LoadBalancerInboundNatRule $nrplb.InboundNatRules[1]

### Step 4

Check the NICs.


	$backendnic1

Expected output:

	Name                 : lb-nic1-be
	ResourceGroupName    : NRP-RG
	Location             : westus
	Id                   : /subscriptions/f50504a2-1865-4541-823a-b32842e3e0ee/resourceGroups/NRP-RG/providers/Microsoft.Network/networkInterfaces/lb-nic1-be
	Etag                 : W/"d448256a-e1df-413a-9103-a137e07276d1"
	ProvisioningState    : Succeeded
	Tags                 :
	VirtualMachine       : null
	IpConfigurations     : [
                         {
                           "PrivateIpAddress": "10.0.2.6",
                           "PrivateIpAllocationMethod": "Static",
                           "Subnet": {
                             "Id": "/subscriptions/f50504a2-1865-4541-823a-b32842e3e0ee/resourceGroups/NRP-RG/providers/Microsoft.Network/virtualNetworks/NRPVNet/subnets/LB-Subnet-BE"
                           },
                           "PublicIpAddress": {
                             "Id": null
                           },
                           "LoadBalancerBackendAddressPools": [
                             {
                               "Id": "/subscriptions/f50504a2-1865-4541-823a-b32842e3e0ee/resourceGroups/NRP-RG/providers/Microsoft.Network/loadBalancers/NRPlb/backendAddressPools/LB-backend"
                             }
                           ],
                           "LoadBalancerInboundNatRules": [
                             {
                               "Id": "/subscriptions/f50504a2-1865-4541-823a-b32842e3e0ee/resourceGroups/NRP-RG/providers/Microsoft.Network/loadBalancers/NRPlb/inboundNatRules/RDP1"
                             }
                           ],
                           "ProvisioningState": "Succeeded",
                           "Name": "ipconfig1",
                           "Etag": "W/\"d448256a-e1df-413a-9103-a137e07276d1\"",
                           "Id": "/subscriptions/f50504a2-1865-4541-823a-b32842e3e0ee/resourceGroups/NRP-RG/providers/Microsoft.Network/networkInterfaces/lb-nic1-be/ipConfigurations/ipconfig1"
                         }
                       ]
	DnsSettings          : {
                         "DnsServers": [],
                         "AppliedDnsServers": []
                       }
	AppliedDnsSettings   :
	NetworkSecurityGroup : null
	Primary              : False



### Step 5

Use the `Add-AzureRmVMNetworkInterface` cmdlet to assign the NICs to different VMs.

You can find guidance on how to create a virtual machine, and assign a NIC in [Create and preconfigure a Windows Virtual Machine with Resource Manager and Azure PowerShell](../virtual-machines/virtual-machines-windows-create-powershell.md#Example), using option 5 in the example. 


or if you already have a virtual machine created, you can add the network interface with the following steps:

#### Step 1 

Load the load balancer resource into a variable (if you haven't done that yet). The variable used is called $lb and use the same names from the load balancer resource created above.

	$lb= get-azurermloadbalancer –name NRP-LB -resourcegroupname NRP-RG

#### Step 2 

Load the backend configuration to a variable. 

	$backend=Get-AzureRmLoadBalancerBackendAddressPoolConfig -name backendpool1 -LoadBalancer $lb

#### Step 3 

Load the already created network interface into a variable. the variable name used is $nic. The network interface name used is the same from the example above.  

	$nic =get-azurermnetworkinterface –name lb-nic1-be -resourcegroupname NRP-RG

#### Step 4

Change the backend configuration on the network interface.

	$nic.IpConfigurations[0].LoadBalancerBackendAddressPools=$backend

#### Step 5 

Save the network interface object.

	Set-AzureRmNetworkInterface -NetworkInterface $nic

After a network interface is added to the load balancer backend pool, it  starts receiving network traffic based on the load balancing rules for that load balancer resource.

## Update an existing load balancer


### Step 1

Using the load balancer from the example above, assign load balancer object to variable $slb using Get-AzureLoadBalancer

	$slb = get-AzureRmLoadBalancer -Name NRPLB -ResourceGroupName NRP-RG

### Step 2

In the following example, you will add a new Inbound NAT rule using port 81 in the front end and port 8181 for the back end pool to an existing load balancer

	$slb | Add-AzureRmLoadBalancerInboundNatRuleConfig -Name NewRule -FrontendIpConfiguration $slb.FrontendIpConfigurations[0] -FrontendPort 81  -BackendPort 8181 -Protocol TCP


### Step 3

Save the new configuration using Set-AzureLoadBalancer 

	$slb | Set-AzureRmLoadBalancer

## Remove a Load Balancer

Use the command `Remove-AzureLoadBalancer` to delete a previously created load balancer named "NRP-LB"  in a resource group called "NRP-RG" 

	Remove-AzureRmLoadBalancer -Name NRPLB -ResourceGroupName NRP-RG

>[AZURE.NOTE] You can use the optional switch -Force to avoid the prompt for deletion.

## Next steps

[Get started configuring an internal load balancer](load-balancer-get-started-ilb-arm-ps.md)

[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
