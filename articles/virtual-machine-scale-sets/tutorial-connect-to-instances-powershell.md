---
title: Connect to instances using the Azure CLI
description: Learn how to use the Azure CLI to connect to instances in your Virtual Machine Scale Set.
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.date: 11/29/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurecli

---

# Tutorial: Connect to Virtual Machine Scale Set instances using Azure PowerShell

A Virtual Machine Scale Set allows you to deploy and manage a set of virtual machines. Throughout the lifecycle of a Virtual Machine Scale Set, you may need to run one or more management tasks. In this tutorial you learn how to:

> [!div class="checklist"]
> * List connection information
> * Connect to individual instances using SSH

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

This article requires version 2.0.29 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 


## List instances in a scale set

If you do not have a scale set already created, see [Tutorial: Create and manage a Virtual Machine Scale Set with Azure PowerShell](tutorial-create-and-manage-powershell.md)

List all the instances in your Virtual Machine Scale Set using [get-AzVM](/powershell).

```azurepowershell-interactive
get-AzVM -ResourceGroup myResourceGroup
```

```output
ResourceGroupName Name                  Location    VmSize             OsType    NIC 
----------------- ----                  --------    ------             ------    --- 
myResourceGroup   myScaleSet_9d3fcd1e   eastus     Standard_DS1_v2    Windows    myScaleSet-568e204e       
myResourceGroup   myScaleSet_cf374a15   eastus     Standard_DS1_v2    Windows    myScaleSet-a79ac820     
```


## Get NIC information


Using the NIC name, get the private IP address of the NIC, the Inbound NAT rule name and load balancer name using [get-AzNetworkInterface](/powershell).

```azurecli-interactive
Get-AzNetworkInterface -Name myScaleSet-568e204e
```

```output
Name                        : myScaleSet-568e204e
ResourceGroupName           : myResourceGroup
Location                    : eastus
Id                          : /subscriptions//resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myScaleSet-568e204e
ProvisioningState           : Succeeded
Tags                        : 
VirtualMachine              : {
                                "Id": "/subscriptions//resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myScaleSet_9d3fcd1e"
                              }
IpConfigurations            : [
                                {
                                  "Name": "myScaleSet",
                              "/subscriptions//resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myScaleSet-568e204e/ipConfigurations/myScaleSet",
                                  "PrivateIpAddress": "192.168.1.5",
                                  "PrivateIpAllocationMethod": "Dynamic",
                                  "Subnet": {
                                    "Id": "/subscriptions//resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myScaleSet/subnets/myScaleSet",
                                    "IpAllocations": []
                                  },
                                  "ProvisioningState": "Succeeded",
                                  "PrivateIpAddressVersion": "IPv4",
                                  "LoadBalancerBackendAddressPools": [
                                    {
                                      "Id": 
                              40.88.43.135"/subscriptions//resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myScaleSet/backendAddressPools/myScaleSet",
                                      "LoadBalancerBackendAddresses": []
                                    }
                                  ],
                                  "LoadBalancerInboundNatRules": [],
                                  "Primary": true,
                                  "ApplicationGatewayBackendAddressPools": [],
                                  "ApplicationSecurityGroups": [],
                                  "VirtualNetworkTaps": []
                                }
                              ]
DnsSettings                 : {
                                "DnsServers": [],
                                "AppliedDnsServers": [],
                              }
EnableIPForwarding          : False
EnableAcceleratedNetworking : False
VnetEncryptionSupported     : False
DisableTcpStateTracking     : False
AuxiliaryMode               : 
NetworkSecurityGroup        : null
TapConfigurations           : []
Primary                     : True
MacAddress                  : 60-45-BD-A7-67-09
ExtendedLocation            : null
```

## (Optional) Add InboundNatRules

In the above output, we can see that we do not have any inbound NAT rules associated with our load balancer. To add inbound NAT rules, use [Add-AzLoadBalancerInboundNatRuleConfig](/powershell)

```azurepowershell-interactive 
$slb = Get-AzLoadBalancer -Name "myScaleSet" -ResourceGroupName "MyResourceGroup"
$slb | Add-AzLoadBalancerInboundNatRuleConfig -Name "NewNatRuleV2" -FrontendIPConfiguration $slb.FrontendIpConfigurations[0] -Protocol "Tcp" -IdleTimeoutInMinutes 10 -FrontendPortRangeStart 50000 -FrontendPortRangeEnd 50099 -BackendAddressPool $slb.BackendAddressPools[0] -BackendPort 3389
$slb | Set-AzLoadBalancer
```


## Get backend pool details
Using the backend pool name and load balancer name, get the port for the private IP address of the instance you want to connect to.

```azurepowershell-interactive
Get-AzLoadBalancerBackendAddressInboundNatRulePortMapping `
    -ResourceGroupName myResourceGroup `
    -LoadBalancerName myScaleSet `
    -Name myScaleSet `
    -IpAddress 192.168.1.5
```


```output
InboundNatRuleName : NewNatRuleV2
Protocol           : Tcp
FrontendPort       : 50001
BackendPort        : 3389
```

## Get public IP of load balancer

Get the public IP of the load balancer using [GetAzPublicIpAddress](/powershell)

```azurepowershell-interactive
Get-AzPublicIpAddress -ResourceGroup myResourceGroup    
```

```output
Name                     : myScaleSet
ResourceGroupName        : myResourceGroup
Location                 : eastus
Id                       : /subscriptions//resourceGroups/myResourceGroup/providers/Microsoft.Network/publicIPAddresses/myScaleSet
ProvisioningState        : Succeeded
PublicIpAllocationMethod : Static
IpAddress                : 40.88.43.135
PublicIpAddressVersion   : IPv4
IdleTimeoutInMinutes     : 4
IpConfiguration          : {
                             "Id": "/subscriptions//resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myScaleSet/frontendIPConfigurations/myScaleSet"
                           }
DnsSettings              : {
                             "DomainNameLabel": "myscaleset-9a39b8",
                             "Fqdn": "myscaleset-9a39b8.eastus.cloudapp.azure.com"
                           }
Zones                    : {}
Sku                      : {
                             "Name": "Standard",
                             "Tier": "Regional"
                           }
```

## Connect to your instance

Remote Desktop to your machine using the Public IP address of the load balancer and the Port mapping to the machine instance you want to connect to.

:::image type="content" source="media/virtual-machine-scale-sets-connect-to-instances/tutorial-connect-to-instances-powershell-rdp.png" alt-text="Image of remote desktop application from Windows machine.":::

## Next steps
In this tutorial, you learned how to list the instances in your scale set and connect via SSH to an individual instance.

> [!div class="checklist"]
> * List and view instances in a scale set
> * Gather networking information for individual instances in a scale set
> * Connect to individual VM instances inside a scale set


> [!div class="nextstepaction"]
> [Use data disks with scale sets](tutorial-use-disks-cli.md)
