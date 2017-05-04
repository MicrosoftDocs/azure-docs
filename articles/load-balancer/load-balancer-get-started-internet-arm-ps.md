---
title: Create an Azure Internet-facing load balancer - PowerShell | Microsoft Docs
description: Learn how to create an Internet-facing load balancer in Resource Manager by using PowerShell
services: load-balancer
documentationcenter: na
author: kumudd
manager: timlt
tags: azure-resource-manager

ms.assetid: 8257f548-7019-417f-b15f-d004a1eec826
ms.service: load-balancer
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/23/2017
ms.author: kumud
---

# <a name="get-started"></a>Creating an Internet-facing load balancer in Resource Manager by using PowerShell

> [!div class="op_single_selector"]
> * [Portal](../load-balancer/load-balancer-get-started-internet-portal.md)
> * [PowerShell](../load-balancer/load-balancer-get-started-internet-arm-ps.md)
> * [Azure CLI](../load-balancer/load-balancer-get-started-internet-arm-cli.md)
> * [Template](../load-balancer/load-balancer-get-started-internet-arm-template.md)

[!INCLUDE [load-balancer-get-started-internet-intro-include.md](../../includes/load-balancer-get-started-internet-intro-include.md)]

[!INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)]

This article covers the Resource Manager deployment model. You can also [learn how to create an Internet-facing load balancer by using the classic deployment model](load-balancer-get-started-internet-classic-cli.md).

[!INCLUDE [load-balancer-get-started-internet-scenario-include.md](../../includes/load-balancer-get-started-internet-scenario-include.md)]

## Deploying the solution by using Azure PowerShell

The following procedures explain how to create an Internet-facing load balancer by using Azure Resource Manager with PowerShell. With Azure Resource Manager, each resource is created and configured individually, and then put together to create a load balancer.

You must create and configure the following objects to deploy a load balancer:

* Front-end IP configuration: contains public IP (PIP) addresses for incoming network traffic.
* Back-end address pool: contains network interfaces (NICs) for the virtual machines to receive network traffic from the load balancer.
* Load-balancing rules: contains rules that map a public port on the load balancer to a port in the back-end address pool.
* Inbound NAT rules: contains rules that map a public port on the load balancer to a port for a specific virtual machine in the back-end address pool.
* Probes: contains health probes used to check availability of virtual machine instances in the back-end address pool.

For more information, see [Azure Resource Manager support for Load Balancer](load-balancer-arm.md).

## Set up PowerShell to use Resource Manager

Make sure you have the latest production version of the Azure Resource Manager module for PowerShell:

1. Sign in to Azure.

    ```powershell
    Login-AzureRmAccount
    ```

    Enter your credentials when prompted.

2. Check the subscriptions for the account.

    ```powershell
    Get-AzureRmSubscription
    ```

3. Choose which of your Azure subscriptions to use.

    ```powershell
    Select-AzureRmSubscription -SubscriptionId 'GUID of subscription'
    ```

4. Create a resource group. (Skip this step if you're using an existing resource group.)

    ```powershell
    New-AzureRmResourceGroup -Name NRP-RG -location "West US"
    ```

## Create a virtual network and a public IP address for the front-end IP pool

1. Create a subnet and a virtual network.

    ```powershell
    $backendSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name LB-Subnet-BE -AddressPrefix 10.0.2.0/24
    New-AzureRmvirtualNetwork -Name NRPVNet -ResourceGroupName NRP-RG -Location 'West US' -AddressPrefix 10.0.0.0/16 -Subnet $backendSubnet
    ```

2. Create an Azure public IP address resource, named **PublicIP**, to be used by a front-end IP pool with the DNS name **loadbalancernrp.westus.cloudapp.azure.com**. The following command uses the static allocation type.

    ```powershell
    $publicIP = New-AzureRmPublicIpAddress -Name PublicIp -ResourceGroupName NRP-RG -Location 'West US' -AllocationMethod Static -DomainNameLabel loadbalancernrp
    ```

   > [!IMPORTANT]
   > The load balancer uses the domain label of the public IP as a prefix for its FQDN. This is different from the classic deployment model, which uses the cloud service as the load balancer FQDN.
   > In this example, the FQDN is **loadbalancernrp.westus.cloudapp.azure.com**.

## Create a front-end IP pool and a back-end address pool

1. Create a front-end IP pool named **LB-Frontend** that uses the **PublicIp** resource.

    ```powershell
    $frontendIP = New-AzureRmLoadBalancerFrontendIpConfig -Name LB-Frontend -PublicIpAddress $publicIP
    ```

2. Create a back-end address pool named **LB-backend**.

    ```powershell
    $beaddresspool = New-AzureRmLoadBalancerBackendAddressPoolConfig -Name LB-backend
    ```

## Create NAT rules, a load balancer rule, a probe, and a load balancer

This example creates the following items:

* A NAT rule to translate all incoming traffic on port 3441 to port 3389
* A NAT rule to translate all incoming traffic on port 3442 to port 3389
* A probe rule to check the health status on a page named **HealthProbe.aspx**
* A load balancer rule to balance all incoming traffic on port 80 to port 80 on the addresses in the back-end pool
* A load balancer that uses all these objects

Use these steps:

1. Create the NAT rules.

    ```powershell
    $inboundNATRule1= New-AzureRmLoadBalancerInboundNatRuleConfig -Name RDP1 -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3441 -BackendPort 3389

    $inboundNATRule2= New-AzureRmLoadBalancerInboundNatRuleConfig -Name RDP2 -FrontendIpConfiguration $frontendIP -Protocol TCP -FrontendPort 3442 -BackendPort 3389
    ```

2. Create a health probe. There are two ways to configure a probe:

    HTTP probe

    ```powershell
    $healthProbe = New-AzureRmLoadBalancerProbeConfig -Name HealthProbe -RequestPath 'HealthProbe.aspx' -Protocol http -Port 80 -IntervalInSeconds 15 -ProbeCount 2
    ```

    TCP probe

    ```powershell
    $healthProbe = New-AzureRmLoadBalancerProbeConfig -Name HealthProbe -Protocol Tcp -Port 80 -IntervalInSeconds 15 -ProbeCount 2
    ```

3. Create a load balancer rule.

    ```powershell
    $lbrule = New-AzureRmLoadBalancerRuleConfig -Name HTTP -FrontendIpConfiguration $frontendIP -BackendAddressPool  $beAddressPool -Probe $healthProbe -Protocol Tcp -FrontendPort 80 -BackendPort 80
    ```

4. Create the load balancer by using the previously created objects.

    ```powershell
    $NRPLB = New-AzureRmLoadBalancer -ResourceGroupName NRP-RG -Name NRP-LB -Location 'West US' -FrontendIpConfiguration $frontendIP -InboundNatRule $inboundNATRule1,$inboundNatRule2 -LoadBalancingRule $lbrule -BackendAddressPool $beAddressPool -Probe $healthProbe
    ```

## Create NICs

Create network interfaces (or modify existing ones) and then associate them to NAT rules, load balancer rules, and probes:

1. Get the virtual network and a virtual network subnet, where the NICs need to be created.

    ```powershell
    $vnet = Get-AzureRmVirtualNetwork -Name NRPVNet -ResourceGroupName NRP-RG
    $backendSubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name LB-Subnet-BE -VirtualNetwork $vnet
    ```

2. Create a NIC named **lb-nic1-be**, and associate it with the first NAT rule and the first (and only) back-end address pool.

    ```powershell
    $backendnic1= New-AzureRmNetworkInterface -ResourceGroupName NRP-RG -Name lb-nic1-be -Location 'West US' -PrivateIpAddress 10.0.2.6 -Subnet $backendSubnet -LoadBalancerBackendAddressPool $nrplb.BackendAddressPools[0] -LoadBalancerInboundNatRule $nrplb.InboundNatRules[0]
    ```

3. Create a NIC named **lb-nic2-be**, and associate it with the second NAT rule and the first (and only) back-end address pool.

    ```powershell
    $backendnic2= New-AzureRmNetworkInterface -ResourceGroupName NRP-RG -Name lb-nic2-be -Location 'West US' -PrivateIpAddress 10.0.2.7 -Subnet $backendSubnet -LoadBalancerBackendAddressPool $nrplb.BackendAddressPools[0] -LoadBalancerInboundNatRule $nrplb.InboundNatRules[1]
    ```

4. Check the NICs.

        $backendnic1

    Expected output:

        Name                 : lb-nic1-be
        ResourceGroupName    : NRP-RG
        Location             : westus
        Id                   : /subscriptions/f50504a2-1865-4541-823a-b32842e3e0ee/resourceGroups/NRP-RG/providers/Microsoft.Network/networkInterfaces/lb-nic1-be
        Etag                 : W/"d448256a-e1df-413a-9103-a137e07276d1"
        ResourceGuid         : 896cac4f-152a-40b9-b079-3e2201a5906e
        ProvisioningState    : Succeeded
        Tags                 :
        VirtualMachine       : null
        IpConfigurations     : [
                            {
                            "Name": "ipconfig1",
                            "Etag": "W/\"d448256a-e1df-413a-9103-a137e07276d1\"",
                            "Id": "/subscriptions/f50504a2-1865-4541-823a-b32842e3e0ee/resourceGroups/NRP-RG/providers/Microsoft.Network/networkInterfaces/lb-nic1-be/ipConfigurations/ipconfig1",
                            "PrivateIpAddress": "10.0.2.6",
                            "PrivateIpAllocationMethod": "Static",
                            "Subnet": {
                                "Id": "/subscriptions/f50504a2-1865-4541-823a-b32842e3e0ee/resourceGroups/NRP-RG/providers/Microsoft.Network/virtualNetworks/NRPVNet/subnets/LB-Subnet-BE"
                            },
                            "ProvisioningState": "Succeeded",
                            "PrivateIpAddressVersion": "IPv4",
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
                            "Primary": true,
                            "ApplicationGatewayBackendAddressPools": []
                            }
                        ]
        DnsSettings          : {
                            "DnsServers": [],
                            "AppliedDnsServers": [],
                            "InternalDomainNameSuffix": "prcwibzcuvie5hnxav0yjks2cd.dx.internal.cloudapp.net"
                        }
        EnableIPForwarding   : False
        NetworkSecurityGroup : null
        Primary              :

5. Use the `Add-AzureRmVMNetworkInterface` cmdlet to assign the NICs to different VMs.

## Create a virtual machine

For guidance on creating a virtual machine and assigning a NIC, see [Create an Azure VM using PowerShell](../virtual-machines/virtual-machines-windows-ps-create.md?toc=%2fazure%2fload-balancer%2ftoc.json).

## Add the network interface to the load balancer

1. Retrieve the load balancer from Azure.

    Load the load balancer resource into a variable (if you haven't done that yet). The variable is called **$lb**. Use the same names from the load balancer resource that you created earlier.

    ```powershell
    $lb= get-azurermloadbalancer -name NRP-LB -resourcegroupname NRP-RG
    ```

2. Load the back-end configuration to a variable.

    ```powershell
    $backend=Get-AzureRmLoadBalancerBackendAddressPoolConfig -name LB-backend -LoadBalancer $lb
    ```

3. Load the already created network interface into a variable. The variable name is **$nic**. The network interface name is the same one from the earlier example.

    ```powershell
    $nic =get-azurermnetworkinterface -name lb-nic1-be -resourcegroupname NRP-RG
    ```

4. Change the back-end configuration on the network interface.

    ```powershell
    $nic.IpConfigurations[0].LoadBalancerBackendAddressPools=$backend
    ```

5. Save the network interface object.

    ```powershell
    Set-AzureRmNetworkInterface -NetworkInterface $nic
    ```

    After a network interface is added to the load balancer back-end pool, it starts receiving network traffic based on the load-balancing rules for that load balancer resource.

## Update an existing load balancer

1. By using the load balancer from the earlier example, assign a load balancer object to the variable **$slb** by using `Get-AzureLoadBalancer`.

    ```powershell
    $slb = get-AzureRmLoadBalancer -Name NRP-LB -ResourceGroupName NRP-RG
    ```

2. In the following example, you add an inbound NAT rule--by using port 81 in the front-end pool and port 8181 for the back-end pool--to an existing load balancer.

    ```powershell
    $slb | Add-AzureRmLoadBalancerInboundNatRuleConfig -Name NewRule -FrontendIpConfiguration $slb.FrontendIpConfigurations[0] -FrontendPort 81  -BackendPort 8181 -Protocol TCP
    ```

3. Save the new configuration by using `Set-AzureLoadBalancer`.

    ```powershell
    $slb | Set-AzureRmLoadBalancer
    ```

## Remove a load balancer

Use the command `Remove-AzureLoadBalancer` to delete a previously created load balancer named **NRP-LB** in a resource group called **NRP-RG**.

```powershell
Remove-AzureRmLoadBalancer -Name NRP-LB -ResourceGroupName NRP-RG
```

> [!NOTE]
> You can use the optional switch **-Force** to avoid the prompt for deletion.

## Next steps

[Get started configuring an internal load balancer](load-balancer-get-started-ilb-arm-ps.md)

[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
