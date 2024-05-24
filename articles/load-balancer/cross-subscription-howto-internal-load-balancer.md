---
title: Create a cross-subscription internal load balancer
titleSuffix: Azure Load Balancer
description: 
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: 
ms.date: 05/24/2024
ms.author: mbender
ms.custom:
#CustomerIntent: As a < type of user >, I want < what? > so that < why? > .
---

# Create a cross-subscription internal load balancer

In this how-to guide, you learn how to create a cross-subscription internal load balancer. You'll gather the necessary information for the virtual network, create a load balancer with a backend pool, health probe, and load balancing rules. And you'll finish by attaching a network interface card to the load balancer.

A [cross-subscription internal load balancer (ILB)](./cross-subscription-load-balancer-overview.md#cross-subscription-load-balancer) can reference a virtual network that resides in a different subscription other than the load balancers. 

## Prerequisites

# [Azure PowerShell](#tab/azurepowershell)

- Two Azure subscriptions. One subscription for the virtual network and another subscription for the load balancer.
- An Azure account with active subscriptions. [Create an account for free](https://azure.microsoft.com/free/)
- An existing resource group for all resources.
- An existing [Virtual Network](../virtual-network/quick-create-powershell.md). deployed in one of the subscriptions. For this example, the virtual network is in **Azure Subscription A**.

> [!IMPORTANT]
> All of the code samples will use example names and placeholders. Be sure to replace these with the values from your environment.
> The values needing replacement will be enclosed in angle brackets, like this: `<example value>`.
> 
  
# [Azure CLI](#tab/azurecli/)

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- Two Azure subscriptions. One subscription for the virtual network (**Azure Subscription A**) and another subscription for the load balancer(**Azure Subscription B**).
- An Azure account with active subscriptions. [Create an account for free](https://azure.microsoft.com/free/)
- An existing resource group for all resources.
- An existing [Virtual Network](../virtual-network/quick-create-cli.md). deployed in one of the subscriptions. For this example, the virtual network is in **Azure Subscription A**.

> [!IMPORTANT]
> All of the code samples will use example names and placeholders. Be sure to replace these with the values from your environment.
> The values needing replacement will be enclosed in angle brackets, like this: `<example value>`.

---

## Sign in to Azure

# [Azure PowerShell](#tab/azurepowershell)

Azure account with [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount), and change your subscription context with [`Set-AzContext`](/powershell/module/az.accounts/set-azcontext) to **Azure Subscription A**. then get the virtual network information with [`Get-AzVirtualNetwork`](/powershell/module/az.network/get-azvirtualnetwork). You'll need the Azure subscription ID, resource group name, and virtual network name from your environment.

With Azure PowerShell, you'll sign int your Azu switch the context to **Azure Subscription A** with [`Set-AzContext`](/powershell/module/az.accounts/set-azcontext) and 

```azurepowershell

# Sign in to Azure
Connect-AzAccount

# Set the subscription context to Azure Subscription A
Set-AzContext -Subscription '<Azure Subscription A>'     
$net = @{
    Name = 'vnet name'
    ResourceGroupName = '<Resource Group Subscription A>'
}

# Get the Virtual Network information with Get-AzVirtualNetwork
$vnet = Get-AzVirtualNetwork @net
```
# [Azure CLI](#tab/azurecli/)

```azurecli

# Sign in to Azure CLI and change subscription to Azure Subscription A
Az login
Az account set –subscription <Azure Subscription A>
```

---

## Create a resource group

In this section, you create a resource group in **Azure Subscription B**. This resource group is for all of your resources associate with your load balancer.

# [Azure PowerShell](#tab/azurepowershell)

With Azure PowerShell, you switch the context back to **Azure Subscription B** with [`Set-AzContext`](/powershell/module/az.accounts/set-azcontext) and then create a resource group with [`New-AzResourceGroup`](/powershell/module/az.resources/new-azresourcegroup).

```azurepowershell

# Set the subscription context to Azure Subscription B
Set-AzContext -Subscription '<Azure Subscription B>'  

# Create a resource group wi   
$rg = @{
    Name = '<Resource Group Subscription A>'
    Location = 'eastus'
}
New-AzResourceGroup @rg
```

# [Azure CLI](#tab/azurecli/)

An Azure resource group is a logical container into which Azure resources are deployed and managed.
Create a resource group with az group create:
•	Named myResourceGroupLB-CR.
•	In the westus location. Note the location should be the same as the public IP address created in subscription A
az group create --name myResourceGroupLB --location westus

---

## Create a load balancer 

In this section, you create a load balancer in **Azure Subscription B**. You'll create a load balancer with a frontend IP, backend address pool, health probe, and load balancing rule.

# [Azure PowerShell](#tab/azurepowershell)


Create a load balancer with [`New-AzLoadBalancer`](/powershell/module/az.network/new-azloadbalancer) and then add a frontend IP configuration with [`Add-AzLoadBalancerFrontendIpConfig`](/powershell/module/az.network/add-azloadbalancerfrontendipconfig).

```azurepowershell
$loadbalancer = @{
    ResourceGroupName = 'resource group B'
    Name = 'LB Name'
    Location = 'eastus'
    Sku = 'Standard'
}
$LB = New-AzLoadBalancer @loadbalancer
 
$LBinfo = @{
    ResourceGroupName = 'resource group B'
    Name = 'my-lb’
}

## Create load balancer frontend configuration and place in variable.
$fip = @{
 Name = 'myFrontEnd'
SubnetId = $vnet.subnets[0].Id 
}
$LB = $LB | Add-AzLoadBalancerFrontendIpConfig @fip
$LB = $LB | Set-AzLoadBalancer
```

## Configure the backend address pool and syncMode property

# [Azure PowerShell](#tab/azurepowershell)

Create a backend address pool with [`New-AzLoadBalancerBackendAddressPool`](/powershell/module/az.network/new-azloadbalancerbackendaddresspool) for traffic sent from the frontend of the load balancer. This pool is where your backend virtual machines are deployed.

```azurepowershell

## Create backend address pool configuration and place in variable. 
 
$be = @{
    ResourceGroupName= "resource group B"
    Name= "myBackEndPool"
    LoadBalancerName= "LB Name"
    VirtualNetwork=$vnet.id
    SyncMode= "Automatic"
}
 
#creates the backend pool
$backend = New-AzLoadBalancerBackendAddressPool @be
$LB = Get-AzLoadBalancer @LBinfo
```
# [Azure CLI](#tab/azurecli/)

In order to utilize the cross-subscription feature of Azure load balancer, backend pools need to have the syncMode property enabled and a virtual network reference. This section will update the backend pool created prior by attaching the cross-subscription VNet and enabling the syncMode property. 

az network lb address-pool update --lb-name myLoadBalancer --resource-group myResourceGroupLB -n myResourceGroupLB --vnet ‘/subscriptions/subscription A ID/resourceGroups/{resource group name} /providers/Microsoft.Network/virtualNetwork/{VNet name}’ --sync-mode Automatic

---

## Create a health probe and load balancer rule

Create a health probe with Add-AzLoadBalancerProbeConfig that determines the health of the backend VM instances.

```azurepowershell
## Create the health probe and place in variable. ##
$probe = @{
    Name = 'myHealthProbe2'
    Protocol = 'tcp'
    Port = '80'
    IntervalInSeconds = '360'
    ProbeCount = '5'
}
```

```azurepowershell
## Create the load balancer rule and place in variable. ##
$lbrule = @{
    Name = 'myHTTPRule2'
    Protocol = 'tcp'
    FrontendPort = '80'
    BackendPort = '80'
    IdleTimeoutInMinutes = '15'
    FrontendIpConfiguration = $LB.FrontendIpConfigurations[0]
    BackendAddressPool = $backend
}
## Set the load balancer resource. ##
$LB | Add-AzLoadBalancerProbeConfig @probe
$LB | Add-AzLoadBalancerRuleConfig  @lbrule
$LB | Set-AzLoadBalancer
```
# [Azure CLI](#tab/azurecli/)

### Create the health probe
A health probe checks all virtual machine instances to ensure they can send network traffic.
A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.
Create a health probe with az network lb probe create:

```azurecli
az network lb probe create --resource-group myResourceGroupLB --lb-name myLoadBalancer --name myHealthProbe --protocol tcp --port 80
```

### Create the load balancer rule
A load balancer rule defines:
•	Frontend IP configuration for the incoming traffic
•	The backend IP pool to receive the traffic
•	The required source and destination port
Create a load balancer rule with az network lb rule create:

```azurecli
az network lb rule create --resource-group myResourceGroupLB --lb-name myLoadBalancer --name myHTTPRule --protocol tcp --frontend-port 80 --backend-port 80 --frontend-ip-name myFrontEnd --backend-pool-name myBackEndPool --probe-name myHealthProbe --disable-outbound-snat true --idle-timeout 15 --enable-tcp
```

---

## Attach network interface cards to the load balancer

# [Azure PowerShell](#tab/azurepowershell)
In this section, you attach network interface cards to the load balancer. You create a network interface with [`New-AzNetworkInterface`](/powershell/module/az.network/new-aznetworkinterface) and then create an IP configuration for the network interface card with [`New-AzNetworkInterfaceIpConfig`](/powershell/module/az.network/new-aznetworkinterfaceipconfig).

```azurepowershell

# Set the subscription context to **Azure Subscription A**
Set-AzContext -Subscription 'Sub A' 

# Create a network interface card
$IP1 = @{
    Name = 'ipconfig-a'
    subnetID= $vnet.subnets[0].Id
    PrivateIpAddressVersion = 'IPv4'
-LoadBalancerBackendAddressPool $lb-be-info
}
$IP1Config = New-AzNetworkInterfaceIpConfig @IP1 -Primary
$nic = @{
    Name = 'nic-a'
    ResourceGroupName = '<Resoure Group Subscription A>'
    Location = 'eastus’
    IpConfiguration = $IP1Config
}
New-AzNetworkInterface @nic
```

# [Azure CLI](#tab/azurecli)

This step is only performed with Azure PowerShell. It's unnecessary with Azure CLI.

---

## Next steps

> [!div class="nextstepaction"]
> 