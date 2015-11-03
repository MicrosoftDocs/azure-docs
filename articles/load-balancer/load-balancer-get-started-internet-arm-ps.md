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
   ms.date="10/21/2015"
   ms.author="joaoma" />

# Create an Internet facing load balancer in Resource Manager using PowerShell

[AZURE.INCLUDE [load-balancer-get-started-internet-arm-selectors-include.md](../../includes/load-balancer-get-started-internet-arm-selectors-include.md)]

[AZURE.INCLUDE [load-balancer-get-started-internet-intro-include.md](../../includes/load-balancer-get-started-internet-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)] This article covers the Resource Manager deployment model.

[AZURE.INCLUDE [load-balancer-get-started-internet-scenario-include.md](../../includes/load-balancer-get-started-internet-scenario-include.md)]

The steps below will show how to create an internet facing load balancer using Azure Resource Manager with PowerShell. With Azure Resource Manager, the items to create an internet facing load balancer are configured individually and then put together to create a resource. 

We will cover in this page the sequence of individual tasks it has to be done to create a load balancer and explain in detail what is being done to accomplish the goal to create a load balancer.

## What is required to create an internet facing load balancer?

You need to create and configure the following objects to deploy a load balancer.

- Front end IP configuration - contains public IP addresses for incoming network traffic. 

- Back end address pool - contains network interfaces (NICs) to receive traffic from the load balancer. 

- Load balancing rules - contains rules mapping a public port on the load balancer to ports on the NICs in the back end address pool.

- Inbound NAT rules - contains rules mapping a public port on the load balncer to a port in an individual NIC in the back end address pool.

- Probes - contains health probes used to check availability of VMs linked to the NICs in the back end address pool.

You can get more information about load balancer components with Azure resource manager at [Azure Resource Manager support for Load Balancer](load-balancer-arm.md).


## Setup PowerShell to use Resource Manager
Make sure you have the latest production version of the Azure module for PowerShell, and have PowerShell setup correctly to access your Azure subscription.

### Step 1

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](powershell-install-configure.md) and follow the instructions all the way to the end to sign into Azure and select your subscription.
2. From an Azure PowerShell prompt, run the  **Switch-AzureMode** cmdlet to switch to Resource Manager mode, as shown below.

		Switch-AzureMode AzureResourceManager
	
	Expected output:

		WARNING: The Switch-AzureMode cmdlet is deprecated and will be removed in a future release.


>[AZURE.WARNING] The Switch-AzureMode cmdlet will be deprecated soon. When that happens, all Resource Manager cmdlets will be renamed.



### Step 2

 If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](powershell-install-configure.md) and follow the instructions all the way to the end to sign into Azure and select your subscription.
 From an Azure PowerShell prompt, run the  **Switch-AzureMode** cmdlet to switch to Resource Manager mode, as shown below.

		Switch-AzureMode AzureResourceManager
	
	Expected output:

		WARNING: The Switch-AzureMode cmdlet is deprecated and will be removed in a future release.


>[AZURE.WARNING] The Switch-AzureMode cmdlet will be deprecated soon. When that happens, all Resource Manager cmdlets will be renamed.


### Step 3

Log in to your Azure account.


    PS C:\> Add-AzureAccount

You will be prompted to Authenticate with your credentials.


### Step 4

Choose which of your Azure subscriptions to use. 

    PS C:\> Select-AzureSubscription -SubscriptionName "MySubscription"

To see a list of available subscriptions, use the ‘Get-AzureSubscription’ cmdlet.

## Create a resource group

Create a new resource group named *NRP-RG* in the *West US* Azure location.

    PS C:\> New-AzureResourceGroup -Name NRP-RG -location "West US"

## Create a virtual network and a public IP address for the front end IP pool

### Step 1

Create a subnet and a virtual network.

	$backendSubnet = New-AzureVirtualNetworkSubnetConfig -Name LB-Subnet-BE -AddressPrefix 10.0.2.0/24
	New-AzurevirtualNetwork -Name NRPVNet -ResourceGroupName NRP-RG -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $backendSubnet

### Step 2

Create a public IP address (PIP) named *PublicIP* to be used by a frontend IP pool with DNS name *loadbalancernrp.westus.cloudapp.azure.com*. The command below uses the static allocation type.

	$publicIP = New-AzurePublicIpAddress -Name PublicIp -ResourceGroupName NRP-RG -Location "West US" –AllocationMethod Static -DomainNameLabel loadbalancernrp 

>[AZURE.IMPORTANT] The load balancer will use the domain label of the public IP as its FQDN. This a change from classic deployment which uses the cloud service as the load balancer FQDN. 
>In this example, the FQDN will be *loadbalancernrp.westus.cloudapp.azure.com*.

## Create a front end IP pool and a backend address pool

### Step 1 

Create a front end IP pool named *LB-Frontend* that uses the *PublicIp* PIP.

	$frontendIP = New-AzureLoadBalancerFrontendIpConfig -Name LB-Frontend -PublicIpAddress $publicIP 

### step 2 

Create a back end address pool named *LB-backend*.

	$beaddresspool= New-AzureLoadBalancerBackendAddressPoolConfig -Name "LB-backend"

## Create LB rules, NAT rules, a probe, and a load balancer

The example below creates the following items:

- a NAT rule to translate all incoming traffic on port 3441 to port 3389.
- a NAT rule to translate all incoming traffic on port 3442 to port 3389.
- a load balancer rule to balance all incoming traffic on port 80 to port 80 on the addresses in the back end pool.
- a probe rule which will check the health status on a page named *HealthProbe.aspx*.
- a load balancer that uses all the objects above.

### Step 1

Create the NAT rules.

	$inboundNATRule1= New-AzureLoadBalancerInboundNatRuleConfig -Name "RDP1" -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3441 -BackendPort 3389

	$inboundNATRule2= New-AzureLoadBalancerInboundNatRuleConfig -Name "RDP2" -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3442 -BackendPort 3389

### Step 2

Create a load balancer rule.

	$lbrule = New-AzureLoadBalancerRuleConfig -Name "HTTP" -FrontendIpConfiguration $frontendIP -BackendAddressPool  $beAddressPool -Probe $healthProbe -Protocol Tcp -FrontendPort 80 -BackendPort 80

### Step 3

Create a health probe.

	$healthProbe = New-AzureLoadBalancerProbeConfig -Name "HealthProbe" -RequestPath "HealthProbe.aspx" -Protocol http -Port 80 -IntervalInSeconds 15 -ProbeCount 2

### Step 4

Create the load balancer using the objects created above.

	$NRPLB = New-AzureLoadBalancer -ResourceGroupName "NRP-RG" -Name "NRP-LB" -Location "West US" -FrontendIpConfiguration $frontendIP -InboundNatRule $inboundNATRule1,$inboundNatRule2 -LoadBalancingRule $lbrule -BackendAddressPool $beAddressPool -Probe $healthProbe 

## Create NICs

You need to create NICs (or modify existing ones) and associate them to NAT rules, load balancer rules, and probes.

### Step 1 

Get the VNet and subnet where the NICs ned to be created.

	$vnet = Get-AzureVirtualNetwork -Name NRPVNet -ResourceGroupName NRP-RG
	$backendSubnet = Get-AzureVirtualNetworkSubnetConfig -Name LB-Subnet-BE -VirtualNetwork $vnet 

### Step 2

Create a NIC named *lb-nic1-be*, and associate it with the first NAT rule, and the first (and only) back end address pool.
	
	$backendnic1= New-AzureNetworkInterface -ResourceGroupName "NRP-RG" -Name lb-nic1-be -Location "West US" -PrivateIpAddress 10.0.2.6 -Subnet $backendSubnet -LoadBalancerBackendAddressPool $nrplb.BackendAddressPools[0] -LoadBalancerInboundNatRule $nrplb.InboundNatRules[0]

### Step 3

Create a NIC named *lb-nic2-be*, and associate it with the second NAT rule, and the first (and only) back end address pool. 

	$backendnic2= New-AzureNetworkInterface -ResourceGroupName "NRP-RG" -Name lb-nic2-be -Location "West US" -PrivateIpAddress 10.0.2.7 -Subnet $backendSubnet -LoadBalancerBackendAddressPool $nrplb.BackendAddressPools[0] -LoadBalancerInboundNatRule $nrplb.InboundNatRules[1]

### Step 4

Check the NICs.


	PS C:\> $backendnic1

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

Use the `Add-AzureVMNetworkInterface` cmdlet to assign the NICs to different VMs.

You can find guidance on how to create a virtual machine, and assign a NIC in [Create and preconfigure a Windows Virtual Machine with Resource Manager and Azure PowerShell](virtual-machines-ps-create-preconfigure-windows-resource-manager-vms.md#Example), using option 5 in the example. 

## Next steps

[Get started configuring an internal load balancer](load-balancer-internal-getstarted.md)

[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)