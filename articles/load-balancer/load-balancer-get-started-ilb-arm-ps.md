<properties 
   pageTitle="Create an internal load balancer using PowerShell in Resource Manager | Microsoft Azure"
   description="Learn how to create an internal load balancer using PowerShell in Resource Manager"
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
   ms.date="02/09/2016"
   ms.author="joaoma" />

# Get started creating an internal load balancer using PowerShell

[AZURE.INCLUDE [load-balancer-get-started-ilb-arm-selectors-include.md](../../includes/load-balancer-get-started-ilb-arm-selectors-include.md)]
<BR>
[AZURE.INCLUDE [load-balancer-get-started-ilb-intro-include.md](../../includes/load-balancer-get-started-ilb-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](load-balancer-get-started-ilb-classic-ps.md).

[AZURE.INCLUDE [load-balancer-get-started-ilb-scenario-include.md](../../includes/load-balancer-get-started-ilb-scenario-include.md)]

[AZURE.INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]


The steps below will show how to create an internal load balancer using Azure Resource Manager with PowerShell. With Azure Resource Manager, the items to create a Internal load balancer are configured individually and then put together to create a resource. 

This article will cover the sequence of individual tasks it has to be done to create an Internal load balancer and explain in detail what is being done to accomplish the goal to create a load balancer.


## What is required to create an internal load balancer?


The following items need to be configured before creating an internal load balancer:

- Front end IP configuration - will configure the private IP address for incoming network traffic 

- Backend address pool - will configure the network interfaces which will receive the load balanced traffic coming from front end IP pool 

- Load balancing rules - source and local port configuration for the load balancer.

- Probes - configures the health status probe for the Virtual Machine instances.

- Inbound NAT rules - configures the port rules to directly access one of the Virtual Machine instances.

You can get more information about load balancer components with Azure resource manager at [Azure Resource Manager support for load balancer](load-balancer-arm.md).

The following steps will show you how to configure a load balancer between 2 virtual machines.


## Step by Step using PowerShell


### Setup PowerShell to use Resource Manager

Make sure you have the latest production version of the Azure module for PowerShell, and have PowerShell setup correctly to access your Azure subscription.

### Step 1

		Login-AzureRmAccount



### Step 2

Check the subscriptions for the account 

		Get-AzureRmSubscription 

You will be prompted to Authenticate with your credentials.<BR>

### Step 3 

Choose which of your Azure subscriptions to use. <BR>


		Select-AzureRmSubscription -Subscriptionid "GUID of subscription"

### Create Resource Group for load balancer

### Step 4

Create a new resource group (skip this step if using an existing resource group)

    	New-AzureRmResourceGroup -Name NRP-RG -location "West US"

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. Make sure all commands to create a load balancer will use the same resource group.

In the example above we created a resource group called "NRP-RG" and location "West US". 

## Create Virtual Network and a private IP address for front end IP pool


### Step 1

Creates a subnet for the virtual network and assigns to variable $backendSubnet

	$backendSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name LB-Subnet-BE -AddressPrefix 10.0.2.0/24

Create a virtual network:

	$vnet= New-AzureRmVirtualNetwork -Name NRPVNet -ResourceGroupName NRP-RG -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $backendSubnet

Creates the virtual network and adds the subnet lb-subnet-be to the virtual network NRPVNet and assigns to variable $vnet 



## Create Front end IP pool and backend address pool

Setting up a front end IP pool for the incoming load balancer network traffic and backend address pool to receive the load balanced traffic.

### Step 1 

Create a front end IP pool using the private IP address 10.0.2.5 for the subnet 10.0.2.0/24 which will be the incoming network traffic endpoint.

	$frontendIP = New-AzureRmLoadBalancerFrontendIpConfig -Name LB-Frontend -PrivateIpAddress 10.0.2.5 -SubnetId $vnet.subnets[0].Id

### step 2 

Set up a back end address pool used to receive incoming traffic from front end IP pool:

	$beaddresspool= New-AzureRmLoadBalancerBackendAddressPoolConfig -Name "LB-backend"


## Create LB rules, NAT rules, probe and load balancer

After creating the front end IP pool and the backend address pool, you will need to create the rules which will belong to the load balancer resource:

### Step 1

	$inboundNATRule1= New-AzureRmLoadBalancerInboundNatRuleConfig -Name "RDP1" -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3441 -BackendPort 3389

	$inboundNATRule2= New-AzureRmLoadBalancerInboundNatRuleConfig -Name "RDP2" -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3442 -BackendPort 3389

	$healthProbe = New-AzureRmLoadBalancerProbeConfig -Name "HealthProbe" -RequestPath "HealthProbe.aspx" -Protocol http -Port 80 -IntervalInSeconds 15 -ProbeCount 2

 	$lbrule = New-AzureRmLoadBalancerRuleConfig -Name "HTTP" -FrontendIpConfiguration $frontendIP -BackendAddressPool $beAddressPool -Probe $healthProbe -Protocol Tcp -FrontendPort 80 -BackendPort 80


The example above is creating the following items:

- NAT rule which all incoming traffic to port 3441 will go to port 3389.
- a second NAT rule which all incoming traffic to port 3442 will go to port 3389.
- a load balancer rule which will load balance all incoming traffic on public port 80 to local port 80 in the back end address pool.
- a probe rule which will check the health status for path "HealthProbe.aspx"



### Step 2

Create the load balancer adding all objects (NAT rules, Load balancer rules, probe configurations) together:

	$NRPLB = New-AzureRmLoadBalancer -ResourceGroupName "NRP-RG" -Name "NRP-LB" -Location "West US" -FrontendIpConfiguration $frontendIP -InboundNatRule $inboundNATRule1,$inboundNatRule2 -LoadBalancingRule $lbrule -BackendAddressPool $beAddressPool -Probe $healthProbe 


## Create network interfaces

After creating the internal load balancer, you need define which network interfaces will be receiving the incoming load balanced network traffic, NAT rules and probe. The network interface in this case is configured individually and can be assigned to a virtual machine later on. 


### Step 1 


Get the resource virtual network and subnet to create network interfaces:

	$vnet = Get-AzureRmVirtualNetwork -Name NRPVNet -ResourceGroupName NRP-RG

	$backendSubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name LB-Subnet-BE -VirtualNetwork $vnet 


In this step, we are creating a network interface which will belong to the load balancer back end pool and associate the first NAT rule for RDP for this network interface:
	
	$backendnic1= New-AzureRmNetworkInterface -ResourceGroupName "NRP-RG" -Name lb-nic1-be -Location "West US" -PrivateIpAddress 10.0.2.6 -Subnet $backendSubnet -LoadBalancerBackendAddressPool $nrplb.BackendAddressPools[0] -LoadBalancerInboundNatRule $nrplb.InboundNatRules[0]

### Step 2

Create a second network interface called LB-Nic2-BE:

In this step, we are creating a second network interface, assigning to the same load balancer back end pool and associating the second NAT rule created for RDP: 

 	$backendnic2= New-AzureRmNetworkInterface -ResourceGroupName "NRP-RG" -Name lb-nic2-be -Location "West US" -PrivateIpAddress 10.0.2.7 -Subnet $backendSubnet -LoadBalancerBackendAddressPool $nrplb.BackendAddressPools[0] -LoadBalancerInboundNatRule $nrplb.InboundNatRules[1]


The end result will show the following:


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



### Step 3 

Use the command Add-AzureRmVMNetworkInterface to assign the NIC to a virtual Machine.

You can find the step by step to create a virtual machine and assign to a NIC following the documentation [Create and preconfigure a Windows Virtual Machine with Resource Manager and Azure PowerShell](../virtual-machines/virtual-machines-windows-create-powershell.md#Example) option 4 or 5.

or if you already have a virtual machine created, you can add the network interface with the following steps:

#### Step 1 

Load the load balancer resource into a variable (if you haven't done that yet). The variable used is called $lb and use the same names from the load balancer resource created above.

	$lb= Get-AzureRmLoadBalancer –name NRP-LB -resourcegroupname NRP-RG

#### Step 2 

Load the backend configuration to a variable. 

	$backend= Get-AzureRmLoadBalancerBackendAddressPoolConfig -name backendpool1 -LoadBalancer $lb

#### Step 3 

Load the already created network interface into a variable. the variable name used is $nic. The network interface name used is the same from the example above. 

	$nic=Get-AzureRmNetworkInterface –name lb-nic1-be -resourcegroupname NRP-RG

#### Step 4

Change the backend configuration on the network interface.

	$nic.IpConfigurations[0].LoadBalancerBackendAddressPools=$backend

#### Step 5 

Save the network interface object.

	Set-AzureRmNetworkInterface -NetworkInterface $nic

After a network interface is added to the load balancer backend pool, it starts receiving network traffic based on the load balancing rules for that load balancer resource.

## Update an existing load balancer


### Step 1

Using the load balancer from the example above, assign load balancer object to variable $slb using Get-AzureRmLoadBalancer

	$slb=get-azureRmLoadBalancer -Name NRPLB -ResourceGroupName NRP-RG

### Step 2

In the following example, you will add a new Inbound NAT rule using port 81 in the front end and port 8181 for the back end pool to an existing load balancer

	$slb | Add-AzureRmLoadBalancerInboundNatRuleConfig -Name NewRule -FrontendIpConfiguration $slb.FrontendIpConfigurations[0] -FrontendPort 81  -BackendPort 8181 -Protocol Tcp


### Step 3

Save the new configuration using Set-AzureLoadBalancer 

	$slb | Set-AzureRmLoadBalancer

## Remove a load balancer

Use the command Remove-AzureRmLoadBalancer to delete a previously created load balancer named "NRP-LB"  in a resource group called "NRP-RG" 

	Remove-AzureRmLoadBalancer -Name NRPLB -ResourceGroupName NRP-RG

>[AZURE.NOTE] You can use the optional switch -Force to avoid the prompt for deletion.



## Next steps

[Configure a Load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
 
