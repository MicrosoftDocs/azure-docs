---
title: Create an Azure internal Load Balancer by using PowerShell
titleSuffix: Azure Load Balancer
description: Learn how to create an internal load balancer by using the Azure PowerShell module with Azure Resource Manager
services: load-balancer
documentationcenter: na
author: asudbring
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: allensu
---

# Create an internal load balancer by using the Azure PowerShell module

> [!div class="op_single_selector"]
> * [Azure portal](../load-balancer/load-balancer-get-started-ilb-arm-portal.md)
> * [PowerShell](../load-balancer/load-balancer-get-started-ilb-arm-ps.md)
> * [Azure CLI](../load-balancer/load-balancer-get-started-ilb-arm-cli.md)
> * [Template](../load-balancer/load-balancer-get-started-ilb-arm-template.md)

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [load-balancer-get-started-ilb-intro-include.md](../../includes/load-balancer-get-started-ilb-intro-include.md)]

[!INCLUDE [load-balancer-get-started-ilb-scenario-include.md](../../includes/load-balancer-get-started-ilb-scenario-include.md)]

[!INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

## Get started with the configuration

This article explains how to create an internal load balancer by using Azure Resource Manager with the Azure PowerShell module. In the Resource Manager deployment model, the objects that are needed to create an internal load balancer are configured individually. After the objects are created and configured, they are combined to create a load balancer.

To deploy a load balancer, the following objects must be created:

* Front-end IP pool: The private IP address for all incoming network traffic.
* Back-end address pool: The network interfaces to receive the load-balanced traffic from the front-end IP address.
* Load balancing rules: The port (source and local) configuration for the load balancer.
* Probe configuration: The health status probes for virtual machines.
* Inbound NAT rules: The port rules for direct access to virtual machines.

For more information about load balancer components, see [Azure Load Balancer components](components.md).

The following steps explain how to configure a load balancer between two virtual machines.

## Set up PowerShell to use Resource Manager

Make sure you have the latest production version of the Azure PowerShell module. PowerShell must be correctly configured to access your Azure subscription.

### Step 1: Start PowerShell

Start the PowerShell module for Azure Resource Manager.

```azurepowershell-interactive
Connect-AzAccount
```

### Step 2: View your subscriptions

Check your available Azure subscriptions.

```azurepowershell-interactive
Get-AzSubscription
```

Enter your credentials when you're prompted for authentication.

### Step 3: Select the subscription to use

Choose which of your Azure subscriptions to use for deploying the load balancer.

```azurepowershell-interactive
Select-AzSubscription -Subscriptionid "GUID of subscription"
```

### Step 4: Choose the resource group for the load balancer

Create a new resource group for the load balancer. Skip this step if you're using an existing resource group.

```azurepowershell-interactive
New-AzResourceGroup -Name NRP-RG -location "West US"
```

Azure Resource Manager requires that all resource groups specify a location. The location is used as the default for all resources in the resource group. Always use the same resource group for all commands related to creating the load balancer.

In the example, we created a resource group named **NRP-RG** with the location West US.

## Create the virtual network and IP address for the front-end IP pool

Create a subnet for the virtual network and assign it to the variable **$backendSubnet**.

```azurepowershell-interactive
$backendSubnet = New-AzVirtualNetworkSubnetConfig -Name LB-Subnet-BE -AddressPrefix 10.0.2.0/24
```

Create a virtual network.

```azurepowershell-interactive
$vnet= New-AzVirtualNetwork -Name NRPVNet -ResourceGroupName NRP-RG -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $backendSubnet
```

The virtual network is created. The **LB-Subnet-BE** subnet is added to the **NRPVNet** virtual network. These values are assigned to the **$vnet** variable.

## Create the front-end IP pool and back-end address pool

Create a front-end IP pool for the incoming traffic and a back-end address pool to receive the load-balanced traffic.

### Step 1: Create a front-end IP pool

Create a front-end IP pool with the private IP address 10.0.2.5 for the subnet 10.0.2.0/24. This address is the incoming network traffic endpoint.

```azurepowershell-interactive
$frontendIP = New-AzLoadBalancerFrontendIpConfig -Name LB-Frontend -PrivateIpAddress 10.0.2.5 -SubnetId $vnet.subnets[0].Id
```

### Step 2: Create a back-end address pool

Create a back-end address pool to receive incoming traffic from the front-end IP pool:

```powershell
$beaddresspool= New-AzLoadBalancerBackendAddressPoolConfig -Name "LB-backend"
```

## Create the configuration rules, probe, and load balancer

After the front-end IP pool and the back-end address pool are created, specify the rules for the load balancer resource.

### Step 1: Create the configuration rules

The example creates the following four rule objects:

* An inbound NAT rule for the Remote Desktop Protocol (RDP): Redirects all incoming traffic on port 3441 to port 3389.
* A second inbound NAT rule for RDP: Redirects all incoming traffic on port 3442 to port 3389.
* A health probe rule: Checks the health status of the HealthProbe.aspx path.
* A load balancer rule: Load-balances all incoming traffic on public port 80 to local port 80 in the back-end address pool.

```azurepowershell-interactive
$inboundNATRule1= New-AzLoadBalancerInboundNatRuleConfig -Name "RDP1" -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3441 -BackendPort 3389

$inboundNATRule2= New-AzLoadBalancerInboundNatRuleConfig -Name "RDP2" -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3442 -BackendPort 3389

$healthProbe = New-AzLoadBalancerProbeConfig -Name "HealthProbe" -RequestPath "HealthProbe.aspx" -Protocol http -Port 80 -IntervalInSeconds 15 -ProbeCount 2

$lbrule = New-AzLoadBalancerRuleConfig -Name "HTTP" -FrontendIpConfiguration $frontendIP -BackendAddressPool $beAddressPool -Probe $healthProbe -Protocol Tcp -FrontendPort 80 -BackendPort 80
```

### Step 2: Create the load balancer

Create the load balancer and combine the rule objects (inbound NAT for RDP, load balancer, and health probe):

```azurepowershell-interactive
$NRPLB = New-AzLoadBalancer -ResourceGroupName "NRP-RG" -Name "NRP-LB" -Location "West US" -FrontendIpConfiguration $frontendIP -InboundNatRule $inboundNATRule1,$inboundNatRule2 -LoadBalancingRule $lbrule -BackendAddressPool $beAddressPool -Probe $healthProbe
```

## Create the network interfaces

After creating the internal load balancer, define the network interfaces (NICs) that will receive the incoming load-balanced network traffic, NAT rules, and probe. Each network interface is configured individually and is assigned later to a virtual machine.

### Step 1: Create the first network interface

Get the resource virtual network and subnet. These values are used to create the network interfaces:

```azurepowershell-interactive
$vnet = Get-AzVirtualNetwork -Name NRPVNet -ResourceGroupName NRP-RG

$backendSubnet = Get-AzVirtualNetworkSubnetConfig -Name LB-Subnet-BE -VirtualNetwork $vnet
```

Create the first network interface with the name **lb-nic1-be**. Assign the interface to the load balancer back-end pool. Associate the first NAT rule for RDP with this NIC:

```azurepowershell-interactive
$backendnic1= New-AzNetworkInterface -ResourceGroupName "NRP-RG" -Name lb-nic1-be -Location "West US" -PrivateIpAddress 10.0.2.6 -Subnet $backendSubnet -LoadBalancerBackendAddressPool $nrplb.BackendAddressPools[0] -LoadBalancerInboundNatRule $nrplb.InboundNatRules[0]
```

### Step 2: Create the second network interface

Create the second network interface with the name **lb-nic2-be**. Assign the second interface to the same load balancer back-end pool as the first interface. Associate the second NIC with the second NAT rule for RDP:

```azurepowershell-interactive
$backendnic2= New-AzNetworkInterface -ResourceGroupName "NRP-RG" -Name lb-nic2-be -Location "West US" -PrivateIpAddress 10.0.2.7 -Subnet $backendSubnet -LoadBalancerBackendAddressPool $nrplb.BackendAddressPools[0] -LoadBalancerInboundNatRule $nrplb.InboundNatRules[1]
```

Review the configuration:

    $backendnic1

The settings should be as follows:

    Name                 : lb-nic1-be
    ResourceGroupName    : NRP-RG
    Location             : westus
    Id                   : /subscriptions/[Id]/resourceGroups/NRP-RG/providers/Microsoft.Network/networkInterfaces/lb-nic1-be
    Etag                 : W/"d448256a-e1df-413a-9103-a137e07276d1"
    ProvisioningState    : Succeeded
    Tags                 :
    VirtualMachine       : null
    IpConfigurations     : [
                         {
                           "PrivateIpAddress": "10.0.2.6",
                           "PrivateIpAllocationMethod": "Static",
                           "Subnet": {
                             "Id": "/subscriptions/[Id]/resourceGroups/NRP-RG/providers/Microsoft.Network/virtualNetworks/NRPVNet/subnets/LB-Subnet-BE"
                           },
                           "PublicIpAddress": {
                             "Id": null
                           },
                           "LoadBalancerBackendAddressPools": [
                             {
                               "Id": "/subscriptions/[Id]/resourceGroups/NRP-RG/providers/Microsoft.Network/loadBalancers/NRPlb/backendAddressPools/LB-backend"
                             }
                           ],
                           "LoadBalancerInboundNatRules": [
                             {
                               "Id": "/subscriptions/[Id]/resourceGroups/NRP-RG/providers/Microsoft.Network/loadBalancers/NRPlb/inboundNatRules/RDP1"
                             }
                           ],
                           "ProvisioningState": "Succeeded",
                           "Name": "ipconfig1",
                           "Etag": "W/\"d448256a-e1df-413a-9103-a137e07276d1\"",
                           "Id": "/subscriptions/[Id]/resourceGroups/NRP-RG/providers/Microsoft.Network/networkInterfaces/lb-nic1-be/ipConfigurations/ipconfig1"
                         }
                       ]
    DnsSettings          : {
                         "DnsServers": [],
                         "AppliedDnsServers": []
                       }
    AppliedDnsSettings   :
    NetworkSecurityGroup : null
    Primary              : False



### Step 3: Assign the NIC to a VM

Assign the NIC to a virtual machine by using the `Add-AzVMNetworkInterface` command.

For step-by-step instructions to create a virtual machine and assign the NIC, see [Create an Azure VM by using PowerShell](../virtual-machines/virtual-machines-windows-ps-create.md?toc=%2fazure%2fload-balancer%2ftoc.json).

## Add the network interface

After the virtual machine has been created, add the network interface.

### Step 1: Store the load balancer resource

Store the load balancer resource in a variable (if you haven't done that yet). We're using the variable name **$lb**. For the attribute values in the script, use the names for the load balancer resources that were created in the previous steps.

```azurepowershell-interactive
$lb = Get-AzLoadBalancer –name NRP-LB -resourcegroupname NRP-RG
```

### Step 2: Store the back-end configuration

Store the back-end configuration into the **$backend** variable.

```azurepowershell-interactive
$backend = Get-AzLoadBalancerBackendAddressPoolConfig -name LB-backend -LoadBalancer $lb
```

### Step 3: Store the network interface

Store the network interface in another variable. This interface was created in "Create the network interfaces, Step 1." We're using the variable name **$nic1**. Use the same network interface name from the previous example.

```azurepowershell-interactive
$nic = Get-AzNetworkInterface –name lb-nic1-be -resourcegroupname NRP-RG
```

### Step 4: Change the back-end configuration

Change the back-end configuration on the network interface.

```azurepowershell-interactive
$nic.IpConfigurations[0].LoadBalancerBackendAddressPools=$backend
```

### Step 5: Save the network interface object

Save the network interface object.

```azurepowershell-interactive
Set-AzNetworkInterface -NetworkInterface $nic
```

After the interface is added to the back-end pool, network traffic is load-balanced according to the rules. These rules were configured in "Create the configuration rules, probe, and load balancer."

## Update an existing load balancer

### Step 1: Assign the load balancer object to a variable

Assign the load balancer object (from the previous example) to the **$slb** variable by using the `Get-AzLoadBalancer` command:

```azurepowershell-interactive
$slb = Get-AzLoadBalancer -Name NRP-LB -ResourceGroupName NRP-RG
```

### Step 2: Add a NAT rule

Add a new inbound NAT rule to an existing load balancer. Use port 81 for the front-end pool and port 8181 for the back-end pool:

```azurepowershell-interactive
$slb | Add-AzLoadBalancerInboundNatRuleConfig -Name NewRule -FrontendIpConfiguration $slb.FrontendIpConfigurations[0] -FrontendPort 81  -BackendPort 8181 -Protocol Tcp
```

### Step 3: Save the configuration

Save the new configuration by using the `Set-AzureLoadBalancer` command:

```azurepowershell-interactive
$slb | Set-AzLoadBalancer
```

## Remove an existing load balancer

Delete the **NRP-LB** load balancer in the **NRP-RG** resource group by using the `Remove-AzLoadBalancer` command:

```azurepowershell-interactive
Remove-AzLoadBalancer -Name NRP-LB -ResourceGroupName NRP-RG
```

> [!NOTE]
> Use the optional **-Force** switch to prevent the confirmation prompt for the deletion.

## Next steps

* [Configure load balancer distribution mode](load-balancer-distribution-mode.md)
* [Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
