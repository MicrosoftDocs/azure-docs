---
title: Configure load balancing and outbound rules by using Azure PowerShell
titleSuffix: Azure Load Balancer
description: This article shows how to configure load balancing and outbound rules in Standard Load Balancer by using Azure PowerShell.
services: load-balancer
author: asudbring
ms.service: load-balancer
ms.topic: article
ms.date: 09/24/2019
ms.author: allensu

---
# Configure load balancing and outbound rules in Standard Load Balancer by using Azure PowerShell

This article shows you how to configure outbound rules in Standard Load Balancer by using Azure PowerShell.  

When you finish this article's scenario, the load balancer resource contains two front ends and their associated rules. You have one front end for inbound traffic and another front end for outbound traffic.  

Each front end references a public IP address. In this scenario, the public IP address for inbound traffic is different from the address for outbound traffic.   The load-balancing rule provides only inbound load balancing. The outbound rule controls the outbound network address translation (NAT) for the VM.  

The scenario uses two back-end pools: one for inbound traffic and one for outbound traffic. These pools illustrate capability and provide flexibility for the scenario.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Connect to your Azure account
Sign in to your Azure subscription by using the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) command. Then follow the on-screen directions.
    
```azurepowershell-interactive
Connect-AzAccount
```
## Create a resource group

Create a resource group by using [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup?view=azps-2.6.0). An Azure resource group is a logical container into which Azure resources are deployed. The resources are then managed from the group.

The following example creates a resource group named *myresourcegroupoutbound* in the *eastus2* location:

```azurepowershell-interactive
New-AzResourceGroup -Name myresourcegroupoutbound -Location eastus
```
## Create a virtual network
Create a virtual network named *myvnetoutbound*. Name its subnet *mysubnetoutbound*. Place it in *myresourcegroupoutbound* by using [New-AzVirtualNetwork](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetwork?view=azps-2.6.0) and [New-AzVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetworksubnetconfig?view=azps-2.6.0).

```azurepowershell-interactive
$subnet = New-AzVirtualNetworkSubnetConfig -Name mysubnetoutbound -AddressPrefix "192.168.0.0/24"

New-AzVirtualNetwork -Name myvnetoutbound -ResourceGroupName myresourcegroupoutbound -Location eastus -AddressPrefix "192.168.0.0/16" -Subnet $subnet
```

## Create an inbound public IP address 

To access your web app on the internet, you need a public IP address for the load balancer. Standard Load Balancer supports only standard public IP addresses. 

Use [New-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipaddress?view=azps-2.6.0) to create a standard public IP address named *mypublicipinbound* in *myresourcegroupoutbound*.

```azurepowershell-interactive
$pubIPin = New-AzPublicIpAddress -ResourceGroupName myresourcegroupoutbound -Name mypublicipinbound -AllocationMethod Static -Sku Standard -Location eastus
```

## Create an outbound public IP address 

Create a standard IP address for the load balancer's front-end outbound configuration by using [New-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipaddress?view=azps-2.6.0).

```azurepowershell-interactive
$pubIPout = New-AzPublicIpAddress -ResourceGroupName myresourcegroupoutbound -Name mypublicipoutbound -AllocationMethod Static -Sku Standard -Location eastus
```

## Create an Azure load balancer

This section explains how to create and configure the following components of the load balancer:
  - A front-end IP that receives the incoming network traffic on the load balancer
  - A back-end pool where the front-end IP sends the load-balanced network traffic
  - A back-end pool for outbound connectivity
  - A health probe that determines the health of the back-end VM instances
  - A load-balancer inbound rule that defines how traffic is distributed to the VMs
  - A load-balancer outbound rule that defines how traffic is distributed from the VMs

### Create an inbound front-end IP
Create the inbound front-end IP configuration for the load balancer by using [New-AzLoadBalancerFrontendIpConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancerfrontendipconfig?view=azps-2.6.0). The load balancer should include an inbound front-end IP configuration named *myfrontendinbound*. Associate this configuration with the public IP address *mypublicipinbound*.

```azurepowershell-interactive
$frontendIPin = New-AzLoadBalancerFrontendIPConfig -Name "myfrontendinbound" -PublicIpAddress $pubIPin
```
### Create an outbound front-end IP
Create the outbound front-end IP configuration for the load balancer by using [New-AzLoadBalancerFrontendIpConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancerfrontendipconfig?view=azps-2.6.0). This load balancer should include an outbound front-end IP configuration named *myfrontendoutbound*. Associate this configuration with the public IP address *mypublicipoutbound*.

```azurepowershell-interactive
$frontendIPout = New-AzLoadBalancerFrontendIPConfig -Name "myfrontendoutbound" -PublicIpAddress $pubIPout
```
### Create an inbound back-end pool
Create the back-end inbound pool for the load balancer by using [New-AzLoadBalancerBackendAddressPoolConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig?view=azps-2.6.0). Name the pool *bepoolinbound*.

```azurepowershell-interactive
$bepoolin = New-AzLoadBalancerBackendAddressPoolConfig -Name bepoolinbound
``` 

### Create an outbound back-end pool
Use the following command to create another back-end address pool to define outbound connectivity for a pool of VMs by using [New-AzLoadBalancerBackendAddressPoolConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig?view=azps-2.6.0). Name this pool *bepooloutbound*. 

By creating a separate outbound pool, you provide maximum flexibility. But you can omit this step and use only the inbound *bepoolinbound* if you prefer.  

```azurepowershell-interactive
$bepoolout = New-AzLoadBalancerBackendAddressPoolConfig -Name bepooloutbound
``` 

### Create a health probe

A health probe checks all VM instances to make sure they can send network traffic. The VM instance that fails the probe checks is removed from the load balancer until it goes back online and a probe check determines that it's healthy. 

To monitor the health of the VMs, create a health probe by using [New-AzLoadBalancerProbeConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancerprobeconfig?view=azps-2.6.0). 

```azurepowershell-interactive
$probe = New-AzLoadBalancerProbeConfig -Name http -Protocol "http" -Port 80 -IntervalInSeconds 15 -ProbeCount 2 -RequestPath /
```
### Create a load-balancer rule

A load-balancer rule defines the front-end IP configuration for the incoming traffic and the back-end pool to receive the traffic. It also defines the required source and destination port. 

Create a load-balancer rule named *myinboundlbrule* by using [New-AzLoadBalancerRuleConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancerruleconfig?view=azps-2.6.0). This rule will listen to port 80 in the front-end pool *myfrontendinbound*. It will also use port 80 to send load-balanced network traffic to the back-end address pool *bepoolinbound*. 

```azurepowershell-interactive
$inboundRule = New-AzLoadBalancerRuleConfig -Name inboundlbrule -FrontendIPConfiguration $frontendIPin -BackendAddressPool $bepoolin -Probe $probe -Protocol "Tcp" -FrontendPort 80 -BackendPort 80 -IdleTimeoutInMinutes 15 -EnableFloatingIP -LoadDistribution SourceIP -DisableOutboundSNAT
```

>[!NOTE]
>This load-balancing rule disables automatic outbound secure NAT (SNAT) because of the **-DisableOutboundSNAT** parameter. Outbound NAT is provided only by the outbound rule.

### Create an outbound rule

An outbound rule defines the front-end public IP, which is represented by the front-end *myfrontendoutbound*. This front end will be used for all outbound NAT traffic as well as the back-end pool to which the rule applies.  

Use the following command to create an outbound rule *myoutboundrule* for outbound network translation of all VMs (in NIC IP configurations) in the *bepool* back-end pool.  The command changes the outbound idle time-out from 4 to 15 minutes. It allocates 10,000 SNAT ports instead of 1,024. For more information, see [New-AzLoadBalancerOutboundRuleConfig](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalanceroutboundruleconfig?view=azps-2.7.0).

```azurepowershell-interactive
 $outboundRule = New-AzLoadBalancerOutBoundRuleConfig -Name outboundrule -FrontendIPConfiguration $frontendIPout -BackendAddressPool $bepoolout -Protocol All -IdleTimeoutInMinutes 15 -AllocatedOutboundPort 10000
```
If you don't want to use a separate outbound pool, you can change the address pool argument in the preceding command to specify *$bepoolin* instead.  We recommend using separate pools to make the resulting configuration flexible and readable.

### Create a load balancer

Use the following command to create a load balancer for the inbound IP address by using [New-AzLoadBalancer](https://docs.microsoft.com/powershell/module/az.network/new-azloadbalancer?view=azps-2.6.0). Name the load balancer *lb*. It should include an inbound front-end IP configuration. Its back-end pool *bepoolinbound* should be associated with the public IP address *mypublicipinbound* that you created in the preceding step.

```azurepowershell-interactive
New-AzLoadBalancer -Name lb -Sku Standard -ResourceGroupName myresourcegroupoutbound -Location eastus -FrontendIpConfiguration $frontendIPin,$frontendIPout -BackendAddressPool $bepoolin,$bepoolout -Probe $probe -LoadBalancingRule $inboundrule -OutboundRule $outboundrule 
```

At this point, you can continue adding your VMs to both *bepoolinbound* and *bepooloutbound* back-end pools by updating the IP configuration of the respective NIC resources. Update the resource configuration by using [Add-AzNetworkInterfaceIpConfig](https://docs.microsoft.com/cli/azure/network/lb/rule?view=azure-cli-latest).

## Clean up resources

When you no longer need the resource group, load balancer, and related resources, you can remove them by using [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.7.0).

```azurepowershell-interactive 
  Remove-AzResourceGroup -Name myresourcegroupoutbound
```

## Next steps
In this article, you created a standard load balancer, configured both inbound and outbound load-balancer traffic rules, and configured a health probe for the VMs in the back-end pool. 

To learn more, continue to the [tutorials for Azure Load Balancer](tutorial-load-balancer-standard-public-zone-redundant-portal.md).
