---
title: Configure load balancing and outbound rules using Azure PowerShell
titlesuffix: Azure Load Balancer
description: This article shows how to configure load balancing and outbound rules in a Standard Load Balancer using the Azure PowerShell.
services: load-balancer
author: asudbring
ms.service: load-balancer
ms.topic: article
ms.date: 09/24/2019
ms.author: allensu

---
# Configure load balancing and outbound rules in Standard load balancer using Azure PowerShell

This article shows you how to configure outbound rules in Standard load balancer using Azure PowerShell.  

When you are done, the load balancer resource contains two frontends and rules associated with them: one for inbound and another for outbound.  Each frontend has a reference to a public IP address and this scenario uses a different public IP address for inbound versus outbound.   The load balancing rule provides only inbound load balancing and the outbound rule controls the outbound NAT provided for the VM.  This article uses two separate backend pools, one for inbound and one for outbound, to illustrate capability and allow for flexibility for this scenario.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Connect to Azure account
Sign in to your Azure subscription with the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) command and follow the on-screen directions:
    
```azurepowershell-interactive
Connect-AzAccount
```
## Create resource group

Create a resource group with [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup?view=azps-2.6.0). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myresourcegroupoutbound* in the *eastus2* location:

```azurepowershell-interactive
New-AzResourceGroup -Name myresourcegroupoutbound -Location eastus
```
## Create virtual network
Create a virtual network named *myvnetoutbound* with a subnet named *mysubnetoutbound* in the *myresourcegroupoutbound* using [New-AzVirtualNetwork](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetwork?view=azps-2.6.0) and [New-AzVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetworksubnetconfig?view=azps-2.6.0):

```azurepowershell-interactive
$subnet = New-AzVirtualNetworkSubnetConfig -Name mysubnetoutbound -AddressPrefix "192.168.0.0/24"

New-AzVirtualNetwork -Name myvnetoutbound -ResourceGroupName myresourcegroupoutbound -Location eastus -AddressPrefix "192.168.0.0/16" -Subnet $subnet
```

## Create inbound public IP address 

To access your web app on the Internet, you need a public IP address for the load balancer. A Standard load balancer only supports Standard public IP addresses. Use [New-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipaddress?view=azps-2.6.0) to create a Standard Public IP address named *mypublicipinbound* in *myresourcegroupoutbound*.

```azurepowershell-interactive
$pubIPin = New-AzPublicIpAddress -ResourceGroupName myresourcegroupoutbound -Name mypublicipinbound -AllocationMethod Static -Sku Standard -Location eastus
```

## Create outbound public IP address 

Create a Standard IP address for load balancer's frontend outbound configuration using [New-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipaddress?view=azps-2.6.0).

```azurepowershell-interactive
$pubIPout = New-AzPublicIpAddress -ResourceGroupName myresourcegroupoutbound -Name mypublicipoutbound -AllocationMethod Static -Sku Standard -Location eastus
```

## Create Azure load balancer

This section details how you can create and configure the following components of the load balancer:
  - A frontend IP that receives the incoming network traffic on the load balancer.
  - A backend pool where the frontend IP sends the load balanced network traffic.
  - A backend pool for outbound connectivity. 
  - A health probe that determines health of the backend VM instances.
  - A load balancer inbound rule that defines how traffic is distributed to the VMs.
  - A load balancer outbound rule that defines how traffic is distributed from the VMs.

### Create inbound frontend IP
Create the outbound frontend IP configuration for the load balancer with [New-AzLoadBalancerFrontendIpConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancerfrontendipconfig?view=azps-2.6.0) that includes an inbound frontend IP configuration named *myfrontendinbound* that is associated to the public IP address *mypublicipinbound*

```azurepowershell-interactive
$frontendIPin = New-AzLoadBalancerFrontendIPConfig -Name "myfrontendinbound" -PublicIpAddress $pubIPin
```
### Create outbound frontend IP
Create the outbound frontend IP configuration for the load balancer with [New-AzLoadBalancerFrontendIpConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancerfrontendipconfig?view=azps-2.6.0) that includes an outbound frontend IP configuration named *myfrontendoutbound* that is associated to the public IP address *mypublicipoutbound*:

```azurepowershell-interactive
$frontendIPout = New-AzLoadBalancerFrontendIPConfig -Name "myfrontendoutbound" -PublicIpAddress $pubIPout
```
### Create inbound backend pool
Create the backend inbound pool for the load balancer with [New-AzLoadBalancerBackendAddressPoolConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig?view=azps-2.6.0) named *bepoolinbound*:

```azurepowershell-interactive
$bepoolin = New-AzLoadBalancerBackendAddressPoolConfig -Name bepoolinbound
``` 

### Create outbound backend pool
Create an additional backend address pool to define outbound connectivity for a pool of VMs with [New-AzLoadBalancerBackendAddressPoolConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig?view=azps-2.6.0) named *bepooloutbound*. Creating a separate outbound pool provides maximum flexibility, but you can omit this step and only use the inbound *bepoolinbound* as well.  :

```azurepowershell-interactive
$bepoolout = New-AzLoadBalancerBackendAddressPoolConfig -Name bepooloutbound
``` 

### Create health probe

A health probe checks all virtual machine instances to make sure they can send network traffic. The virtual machine instance with failed probe checks is removed from the load balancer until it goes back online and a probe check determines that it's healthy. Create a health probe with [New-AzLoadBalancerProbeConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancerprobeconfig?view=azps-2.6.0) to monitor the health of the virtual machines. 

```azurepowershell-interactive
$probe = New-AzLoadBalancerProbeConfig -Name http -Protocol "http" -Port 80 -IntervalInSeconds 15 -ProbeCount 2 -RequestPath /
```
### Create load balancing rule

A load balancer rule defines the frontend IP configuration for the incoming traffic and the backend pool to receive the traffic, along with the required source and destination port. Create a load balancer rule *myinboundlbrule* with [New-AzLoadBalancerRuleConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancerruleconfig?view=azps-2.6.0) for listening to port 80 in the frontend pool *myfrontendinbound* and sending load-balanced network traffic to the backend address pool *bepoolinbound* also using port 80. 

>[!NOTE]
>This load balancing rule disables automatic outbound (S)NAT as a result of this rule with the **-DisableOutboundSNAT** parameter. Outbound NAT is only provided by the outbound rule.

```azurepowershell-interactive
$inboundRule = New-AzLoadBalancerRuleConfig -Name inboundlbrule -FrontendIPConfiguration $frontendIPin -BackendAddressPool $bepoolin -Probe $probe -Protocol "Tcp" -FrontendPort 80 -BackendPort 80 -IdleTimeoutInMinutes 15 -EnableFloatingIP -LoadDistribution SourceIP -DisableOutboundSNAT
```

### Create outbound rule

An outbound rule defines the frontend public IP, represented by the frontend *myfrontendoutbound*, which will be used for all outbound NAT traffic as well as the backend pool to which this rule applies.  Create an outbound rule *myoutboundrule* for outbound network translation of all virtual machines (NIC IP configurations) in *bepool* backend pool.  The command below also changes the outbound idle timeout from 4 to 15 minutes and allocates 10000 SNAT ports instead of 1024.  Review [New-AzLoadBalancerOutboundRuleConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalanceroutboundruleconfig?view=azps-2.7.0) for more details.

```azurepowershell-interactive
 $outboundRule = New-AzLoadBalancerOutBoundRuleConfig -Name outboundrule -FrontendIPConfiguration $frontendIPout -BackendAddressPool $bepoolout -Protocol All -IdleTimeoutInMinutes 15 -AllocatedOutboundPort 10000
```
If you don't want to use a separate outbound pool, you can change the address pool argument in the preceding command to specify *$bepoolin* instead.  We recommend using separate pools for flexibility and readability of the resulting configuration.

### Create load balancer

Create a load balancer with the inbound IP address using [New-AzLoadBalancer](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancer?view=azps-2.6.0) named *lb* that includes an inbound frontend IP configuration and a backend pool *bepoolinbound* that is associated with the public IP address *mypublicipinbound* that you created in the preceding step.

```azurepowershell-interactive
New-AzLoadBalancer -Name lb -Sku Standard -ResourceGroupName myresourcegroupoutbound -Location eastus -FrontendIpConfiguration $frontendIPin,$frontendIPout -BackendAddressPool $bepoolin,$bepoolout -Probe $probe -LoadBalancingRule $inboundrule -OutboundRule $outboundrule 
```

At this point, you can continue with adding your VMs to the backend pool *bepoolinbound* __and__ *bepooloutbound* by updating the IP configuration of the respective NIC resources using [Add-AzNetworkInterfaceIpConfig](https://docs.microsoft.com/cli/azure/network/lb/rule?view=azure-cli-latest).

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.7.0) command to remove the resource group, load balancer, and all related resources.

```azurepowershell-interactive 
  Remove-AzResourceGroup -Name myresourcegroupoutbound
```

## Next steps
In this article, you created Standard load balancer, configured both inbound load balancer traffic rules, configured and health probe for the VMs in the backend pool. To learn more about Azure Load Balancer, continue to the tutorials for Azure load balancer.

> [!div class="nextstepaction"]
> [Azure Load Balancer tutorials](tutorial-load-balancer-standard-public-zone-redundant-portal.md)
