---
title: Control routing and virtual appliances in Azure - PowerShell | Microsoft Docs
description: Learn how to control routing and virtual appliances using PowerShell.
services: virtual-network
documentationcenter: na
author: jimdial
manager: carmonm
editor: ''
tags: azure-resource-manager

ms.assetid: 9582fdaa-249c-4c98-9618-8c30d496940f
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/23/2016
ms.author: jdial

---
# Create User-Defined Routes (UDR) using PowerShell

> [!div class="op_single_selector"]
> * [PowerShell](virtual-network-create-udr-arm-ps.md)
> * [Azure CLI](virtual-network-create-udr-arm-cli.md)
> * [Template](virtual-network-create-udr-arm-template.md)
> * [PowerShell (Classic)](virtual-network-create-udr-classic-ps.md)
> * [CLI (Classic)](virtual-network-create-udr-classic-cli.md)


[!INCLUDE [virtual-network-create-udr-intro-include.md](../../includes/virtual-network-create-udr-intro-include.md)]

> [!IMPORTANT]
> Before you work with Azure resources, it's important to understand that Azure currently has two deployment models: Azure Resource Manager and classic. Make sure you understand [deployment models and tools](../azure-resource-manager/resource-manager-deployment-model.md) before you work with any Azure resource. You can view the documentation for different tools by clicking the tabs at the top of this article.
>

This article covers the Resource Manager deployment model. You can also [create UDRs in the classic deployment model](virtual-network-create-udr-classic-ps.md).

[!INCLUDE [virtual-network-create-udr-scenario-include.md](../../includes/virtual-network-create-udr-scenario-include.md)]

The sample PowerShell commands below expect a simple environment already created based on the scenario above. If you want to run the commands as they are displayed in this document, first build the test environment by deploying [this template](http://github.com/telmosampaio/azure-templates/tree/master/IaaS-NSG-UDR-Before), click **Deploy to Azure**, replace the default parameter values if necessary, and follow the instructions in the portal.

[!INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

## Create the UDR for the front-end subnet
To create the route table and route needed for the front-end subnet based on the scenario above, complete the following steps:

1. Create a route used to send all traffic destined to the back-end subnet (192.168.2.0/24) to be routed to the **FW1** virtual appliance (192.168.0.4).

	```powershell
	$route = New-AzureRmRouteConfig -Name RouteToBackEnd `
	-AddressPrefix 192.168.2.0/24 -NextHopType VirtualAppliance `
	-NextHopIpAddress 192.168.0.4
	```

2. Create a route table named **UDR-FrontEnd** in the **westus** region that contains the route.

	```powershell
	$routeTable = New-AzureRmRouteTable -ResourceGroupName TestRG -Location westus `
	-Name UDR-FrontEnd -Route $route
	```

3. Create a variable that contains the VNet where the subnet is. In our scenario, the VNet is named **TestVNet**.

	```powershell
	$vnet = Get-AzureRmVirtualNetwork -ResourceGroupName TestRG -Name TestVNet
	```

4. Associate the route table created above to the **FrontEnd** subnet.

	```powershell
	Set-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name FrontEnd `
	-AddressPrefix 192.168.1.0/24 -RouteTable $routeTable
	```

	> [!WARNING]
	> The output for the command above shows the content for the virtual network configuration object, which only exists on the computer where you are running PowerShell. You need to run the **Set-AzureVirtualNetwork** cmdlet to save these settings to Azure.
	> 

5. Save the new subnet configuration in Azure.

	```powershell
	Set-AzureRmVirtualNetwork -VirtualNetwork $vnet
	```

	Expected output:
   
        Name              : TestVNet
        ResourceGroupName : TestRG
        Location          : westus
        Id                : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet
        Etag              : W/"[Id]"
        ProvisioningState : Succeeded
        Tags              : 
                            Name         Value
                            ===========  =====
                            displayName  VNet 
   
        AddressSpace      : {
                              "AddressPrefixes": [
                                "192.168.0.0/16"
                              ]
                            }
        DhcpOptions       : {
                              "DnsServers": null
                            }
        NetworkInterfaces : null
        Subnets           : [
                                ...,
                              {
                                "Name": "FrontEnd",
                                "Etag": "W/\"[Id]\"",
                                "Id": "/subscriptions/[Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd",
                                "AddressPrefix": "192.168.1.0/24",
                                "IpConfigurations": [
                                  {
                                    "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/NICWEB2/ipConfigurations/ipconfig1"
                                  },
                                  {
                                    "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/NICWEB1/ipConfigurations/ipconfig1"
                                  }
                                ],
                                "NetworkSecurityGroup": {
                                  "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkSecurityGroups/NSG-FrontEnd"
                                },
                                "RouteTable": {
                                  "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/routeTables/UDR-FrontEnd"
                                },
                                "ProvisioningState": "Succeeded"
                              },
                                ...
                            ]    

## Create the UDR for the back-end subnet

To create the route table and route needed for the back-end subnet based on the scenario above, follow the steps below.

1. Create a route used to send all traffic destined to the front-end subnet (192.168.1.0/24) to be routed to the **FW1** virtual appliance (192.168.0.4).

	```powershell
	$route = New-AzureRmRouteConfig -Name RouteToFrontEnd `
	-AddressPrefix 192.168.1.0/24 -NextHopType VirtualAppliance `
	-NextHopIpAddress 192.168.0.4
	```

2. Create a route table named **UDR-BackEnd** in the **uswest** region that contains the route created above.

	```
	$routeTable = New-AzureRmRouteTable -ResourceGroupName TestRG -Location westus `
	-Name UDR-BackEnd -Route $route
	```

3. Associate the route table created above to the **BackEnd** subnet.

	```powershell
	Set-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name BackEnd `
	-AddressPrefix 192.168.2.0/24 -RouteTable $routeTable
	```

4. Save the new subnet configuration in Azure.

	```powershell
	Set-AzureRmVirtualNetwork -VirtualNetwork $vnet
	```

    Expected output:
   
        Name              : TestVNet
        ResourceGroupName : TestRG
        Location          : westus
        Id                : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet
        Etag              : W/"[Id]"
        ProvisioningState : Succeeded
        Tags              : 
                            Name         Value
                            ===========  =====
                            displayName  VNet 
   
        AddressSpace      : {
                              "AddressPrefixes": [
                                "192.168.0.0/16"
                              ]
                            }
        DhcpOptions       : {
                              "DnsServers": null
                            }
        NetworkInterfaces : null
        Subnets           : [
                              ...,
                              {
                                "Name": "BackEnd",
                                "Etag": "W/\"[Id]\"",
                                "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/BackEnd",
                                "AddressPrefix": "192.168.2.0/24",
                                "IpConfigurations": [
                                  {
                                    "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/NICSQL2/ipConfigurations/ipconfig1"
                                  },
                                  {
                                    "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/NICSQL1/ipConfigurations/ipconfig1"
                                  }
                                ],
                                "NetworkSecurityGroup": {
                                  "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkSecurityGroups/NSG-BacEnd"
                                },
                                "RouteTable": {
                                  "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/routeTables/UDR-BackEnd"
                                },
                                "ProvisioningState": "Succeeded"
                              }
                            ]

## Enable IP forwarding on FW1
To enable IP forwarding in the NIC used by **FW1**, follow the steps below.

1. Create a variable that contains the settings for the NIC used by FW1. In our scenario, the NIC is named **NICFW1**.

	```powershell
	$nicfw1 = Get-AzureRmNetworkInterface -ResourceGroupName TestRG -Name NICFW1
	```

2. Enable IP forwarding, and save the NIC settings.

	```powershell
	$nicfw1.EnableIPForwarding = 1
	Set-AzureRmNetworkInterface -NetworkInterface $nicfw1
	```
   
    Expected output:
   
        Name                 : NICFW1
        ResourceGroupName    : TestRG
        Location             : westus
        Id                   : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/NICFW1
        Etag                 : W/"[Id]"
        ProvisioningState    : Succeeded
        Tags                 : 
                               Name         Value                  
                               ===========  =======================
                               displayName  NetworkInterfaces - DMZ
   
        VirtualMachine       : {
                                 "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/FW1"
                               }
        IpConfigurations     : [
                                 {
                                   "Name": "ipconfig1",
                                   "Etag": "W/\"[Id]\"",
                                   "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/NICFW1/ipConfigurations/ipconfig1",
                                   "PrivateIpAddress": "192.168.0.4",
                                   "PrivateIpAllocationMethod": "Static",
                                   "Subnet": {
                                     "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/DMZ"
                                   },
                                   "PublicIpAddress": {
                                     "Id": "/subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/publicIPAddresses/PIPFW1"
                                   },
                                   "LoadBalancerBackendAddressPools": [],
                                   "LoadBalancerInboundNatRules": [],
                                   "ProvisioningState": "Succeeded"
                                 }
                               ]
        DnsSettings          : {
                                 "DnsServers": [],
                                 "AppliedDnsServers": [],
                                 "InternalDnsNameLabel": null,
                                 "InternalFqdn": null
                               }
        EnableIPForwarding   : True
        NetworkSecurityGroup : null
        Primary              : True

