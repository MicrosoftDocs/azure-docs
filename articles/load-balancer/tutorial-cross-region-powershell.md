---
title: 'Tutorial: Create a cross-region load balancer using Azure PowerShell'
titleSuffix: Azure Load Balancer
description: Get started with this tutorial deploying a cross-region Azure Load Balancer using Azure PowerShell.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 10/09/2020
#Customer intent: As a administrator, I want to deploy a cross-region load balancer for global high availability of my application or service.
---

# Tutorial: Create a cross-region Azure Load Balancer using Azure PowerShell

A cross-region load balancer ensures a service is available globally across multiple Azure regions. If one region fails, the traffic is routed to the next closest healthy regional load balancer.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create cross-region load balancer.
> * Create a load balancer rule.
> * Create a backend pool containing two regional load balancers.
> * Test the load balancer.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure subscription.
- Two **standard** sku Azure Load Balancers with backend pools deployed in two different Azure regions.
    - For information on creating a regional standard load balancer and virtual machines for backend pools, see [Quickstart: Create a public load balancer to load balance VMs using Azure PowerShell](quickstart-load-balancer-standard-public-powershell.md).
        - Append the name of the load balancers and virtual machines in each region with a **-R1** and **-R2**. 
- Azure PowerShell installed locally or Azure Cloud Shell.


If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create cross-region load balancer


### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).


```azurepowershell-interactive
$rg = @{
    Name = 'MyResourceGroupLB-CR'
    Location = 'westus'
}
New-AzResourceGroup @rg

```

### Create cross-region load balancer resources

In this section you'll create the resources needed for the cross-region load balancer.

A global standard sku public IP is used for the frontend of the cross-region load balancer.

* Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create the public IP address.

* Create a front-end IP configuration with [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig).

* Create a back-end address pool with [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig).

* Create a load balancer rule with [Add-AzLoadBalancerRuleConfig](/powershell/module/az.network/add-azloadbalancerruleconfig).

* Create a cross-region load Balancer with [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer).

```azurepowershell-interactive
## Variables for the command ##
$rg = 'MyResourceGroupLB-CR'
$loc = 'westus'
$pubIP = 'myPublicIP-CR'
$sku = 'Standard'
$all = 'static'
$tir = 'Global'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku -Tier $tir
```

### Create frontend IP configuration



* Named **myFrontEnd-CR**.
* Attached to public IP **myPublicIP-CR**.

```azurepowershell-interactive
## Variables for the commands ##
$fe = 'myFrontEnd-CR'
$rg = 'MyResourceGroupLB-CR'
$loc = 'westus'
$pubIP = 'myPublicIP-CR'

$publicIp = 
Get-AzPublicIpAddress -Name $pubIP -ResourceGroupName $rg

$feip = 
New-AzLoadBalancerFrontendIpConfig -Name $fe -PublicIpAddress $publicIp
```

### Create back-end address pool



* Named **myBackEndPool-CR**.
* The regional load balancers attach to this back-end pool in the remaining steps.

```azurepowershell-interactive
## Variable for the command ##
$be = 'myBackEndPool-CR'

$bepool = 
New-AzLoadBalancerBackendAddressPoolConfig -Name $be
```
### Create the load balancer rule

A load balancer rule defines:

* Frontend IP configuration for the incoming traffic.
* The backend IP pool to receive the traffic.
* The required source and destination port. 

Create a load balancer rule with [Add-AzLoadBalancerRuleConfig](/powershell/module/az.network/add-azloadbalancerruleconfig): 

* Named **myHTTPRule-CR**
* Listening on **Port 80** in the frontend pool **myFrontEnd-CR**.
* Sending load-balanced network traffic to the backend address pool **myBackEndPool-CR** using **Port 80**. 
* Protocol **TCP**.

```azurepowershell-interactive
## Variables for the command ##
$lbr = 'myHTTPRule-CR'
$pro = 'tcp'
$port = '80'

## $feip and $bePool are the variables from previous steps. ##

$rule = 
New-AzLoadBalancerRuleConfig -Name $lbr -Protocol $pro -FrontendPort $port -BackendPort $port -FrontendIpConfiguration $feip -BackendAddressPool $bePool
```

### Create the load balancer resource

In this section you'll combine all of the variables from the previous steps and create a cross-region load balancer.



* Named **myLoadBalancer-CR**
* In **westus**.
* In resource group **myResourceGroupLB-CR**.

```azurepowershell-interactive
## Variables for the command ##
$lbn = 'myLoadBalancer-CR'
$rg = 'myResourceGroupLB-CR'
$loc = 'westus'
$sku = 'Standard'
$tir = 'Global'

## $feip, $bepool, $probe, $rule are variables with configuration information from previous steps. ##

$lb = 
New-AzLoadBalancer -ResourceGroupName $rg -Name $lbn -SKU $sku -Location $loc -FrontendIpConfiguration $feip -BackendAddressPool $bepool -LoadBalancingRule $rule -Tier $tir
```

## Configure backend pool

In this section, you'll add two regional standard load balancers to the backend pool of the cross-region load balancer.

> [!IMPORTANT]
> To complete these steps, ensure that two regional load balancers with backend pools have been deployed in your subscription.  For more information, see, **[Quickstart: Create a public load balancer to load balance VMs using Azure PowerShell](quickstart-load-balancer-standard-public-powershell.md)**.

**FINISH INSTRUCTIONS HERE WHEN POWERSHELL IS DONE**

## Test the load balancer

In this section, you'll test the cross-region load balancer. You'll connect to the public IP address in a web browser.  You'll stop the virtual machines in one of the regional load balancer backend pools and observe the failover.

1. Use [Get-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/get-azpublicipaddress) to get the public IP address of the load balancer:

```azurepowershell-interactive
  ## Variables for command. ##
  $rg = 'myResourceGroupLB-CR'
  $ipn = 'myPublicIP-CR'
    
  Get-AzPublicIPAddress -ResourceGroupName $rg -Name $ipn | select IpAddress
```
2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

3. Stop the virtual machines in the backend pool of one of the regional load balancers.

4. Refresh the web browser and observe the failover of the connection to the other regional load balancer.

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, load balancer, and the remaining resources.

```azurepowershell-interactive
## Variable for command. ##
$rg = 'myResourceGroupLB-CR'

Remove-AzResourceGroup -Name $rg
```

## Next steps

In this tutorial, you:

* Created a cross-region load balancer.
* Added regional load balancers to the backend pool of the cross-region load balancer.
* Created a load-balancing rule.
* Tested the load balancer.


Advance to the next article to learn how to...
> [!div class="nextstepaction"]
> [Load balancer VMs across availability zones](tutorial-load-balancer-standard-public-zone-redundant-portal.md)
