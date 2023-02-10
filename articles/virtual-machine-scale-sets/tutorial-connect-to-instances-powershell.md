---
title: Connect to instances using Azure PowerShell
description: Learn how to use Azure PowerShell to connect to instances in your Virtual Machine Scale Set.
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.date: 12/16/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurepowershell

---

# Tutorial: Connect to Virtual Machine Scale Set instances using Azure PowerShell
A Virtual Machine Scale Set allows you to deploy and manage a set of virtual machines. Throughout the lifecycle of a Virtual Machine Scale Set, you may need to run one or more management tasks. In this tutorial you learn how to:

> [!div class="checklist"]
> * List connection information
> * Connect to individual instances using Remote Desktop Connection

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## List instances in a scale set
If you don't have a scale set already created, see [Tutorial: Create and manage a Virtual Machine Scale Set with Azure PowerShell](tutorial-create-and-manage-powershell.md).

List all the instances in your Virtual Machine Scale Set using [Get-AzVM](/powershell/module/az.compute/get-azvm).

```azurepowershell-interactive
Get-AzVM -ResourceGroup myResourceGroup
```

```output
ResourceGroupName Name                  Location    VmSize             OsType    NIC 
----------------- ----                  --------    ------             ------    --- 
myResourceGroup   myScaleSet_Instance1   eastus     Standard_DS1_v2    Windows    myScaleSet-instance1-nic      
myResourceGroup   myScaleSet_Instance2   eastus     Standard_DS1_v2    Windows    myScaleSet-instance2-nic    
```

## Get NIC information
Using the NIC name, get the private IP address of the NIC, the backend address pool name and load balancer name with [Get-AzNetworkInterface](/powershell/module/az.network/get-aznetworkinterface).

```azurepowershell-interactive
Get-AzNetworkInterface -Name myScaleSet-instance1-nic
```

```output
Name                        : myScaleSet-instance1-nic
ResourceGroupName           : myResourceGroup
Location                    : eastus
Id                          : /subscriptions//resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myScaleSet-instance1-nic
ProvisioningState           : Succeeded
Tags                        : 
VirtualMachine              : {
                                "Id": "/subscriptions//resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myScaleSet_Instance1"
                              }
IpConfigurations            : [
                                {
                                  "Name": "myScaleSet",
                              "/subscriptions//resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myScaleSet-instance1-nic/ipConfigurations/myScaleSet",
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
```


## Get backend pool details
Using the backend pool name, load balancer name and private IP address, get the port for associated with private IP address of the instance you want to connect to using [Get-AzLoadBalancerBackendAddressInboundNatRulePortMapping](/powershell/module/az.network/add-azloadbalancerinboundnatruleconfig).

```azurepowershell-interactive
Get-AzLoadBalancerBackendAddressInboundNatRulePortMapping `
  -ResourceGroupName myResourceGroup `
  -LoadBalancerName myScaleSet `
  -Name myScaleSet `
  -IpAddress 192.168.1.5
```

If you run the above command and find your load balancer doesn't have any inbound NAT rules, you can add inbound NAT rules using [Add-AzLoadBalancerInboundNatRuleConfig](/powershell/module/az.network/add-azloadbalancerinboundnatruleconfig). Once complete, run [Get-AzLoadBalancerBackendAddressInboundNatRulePortMapping](/powershell/module/az.network/add-azloadbalancerinboundnatruleconfig) again.

```azurepowershell-interactive 
$slb = Get-AzLoadBalancer -Name "myScaleSet" -ResourceGroupName "MyResourceGroup"
$slb | Add-AzLoadBalancerInboundNatRuleConfig -Name "myNatRule" -FrontendIPConfiguration $slb.FrontendIpConfigurations[0] -Protocol "Tcp" -IdleTimeoutInMinutes 10 -FrontendPortRangeStart 50000 -FrontendPortRangeEnd 50099 -BackendAddressPool $slb.BackendAddressPools[0] -BackendPort 3389
$slb | Set-AzLoadBalancer
```

```output
InboundNatRuleName : myNatRule
Protocol           : Tcp
FrontendPort       : 50001
BackendPort        : 3389
```

## Get public IP of load balancer
Get the public IP of the load balancer using [GetAzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress).

```azurepowershell-interactive
Get-AzPublicIpAddress -ResourceGroup myResourceGroup    
```

```output
Name                     : myScaleSet
ResourceGroupName        : myResourceGroup
Location                 : eastus
Id                       : /subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/publicIPAddresses/myScaleSet
ProvisioningState        : Succeeded
PublicIpAllocationMethod : Static
IpAddress                : 40.88.43.135
PublicIpAddressVersion   : IPv4
IdleTimeoutInMinutes     : 4
IpConfiguration          : {
                             "Id": "/subscriptions//resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myScaleSet/frontendIPConfigurations/myScaleSet"
                           }
DnsSettings              : {
                             "DomainNameLabel": "myscaleset-Instance1",
                             "Fqdn": "myscaleset-Instance1.eastus.cloudapp.azure.com"
                           }
Zones                    : {}
Sku                      : {
                             "Name": "Standard",
                             "Tier": "Regional"
                           }
```

## Connect to your instance
Remote Desktop to your machine using the Public IP address of the load balancer and the Port mapping to the machine instance you want to connect to.

:::image type="content" source="media/virtual-machine-scale-sets-connect-to-instances/tutorial-connect-to-instances-powershell-rdp.png" alt-text="Screenshot of remote desktop application from Windows machine.":::

## Next steps
In this tutorial, you learned how to list the instances in your scale set and connect via SSH to an individual instance.

> [!div class="checklist"]
> * List and view instances in a scale set
> * Gather networking information for individual instances in a scale set
> * Connect to individual VM instances inside a scale set


> [!div class="nextstepaction"]
> [Modify a scale set](tutorial-modify-scale-sets-powershell.md)
