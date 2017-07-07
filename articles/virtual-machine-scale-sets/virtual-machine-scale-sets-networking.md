---
title: Azure virtual machine scale sets overview | Microsoft Docs
description: Learn more about Azure virtual machine scale sets
services: virtual-machine-scale-sets
documentationcenter: ''
author: gbowerman
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 76ac7fd7-2e05-4762-88ca-3b499e87906e
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 07/06/2017
ms.author: guybo

---
# Networking for Azure virtual Machine scale sets

When you deploy an Azure virtual machine scale set through the portal, certain network properties are defaulted, for example an Azure Load Balancer with inbound NAT rules. This article describes how to use some of the more advanced networking features that you can configure with scale sets.

You can configure all of the features covered in this article using Azure Resource Manager templates. Azure CLI examples are alose included for selected features below. Use a July 2017 or later CLI verion. Additional CLI, and PowerShell, examples will be added soon.

## Accelerated Networking
Azure [Accelerated Networking](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-create-vm-accelerated-networking) improves  network performance by enabling single root I/O virtualization (SR-IOV) to a VM. To use accelerated networking with scale sets, set enableAcceleratedNetworking to _true_ in your scale set's networkInterfaceConfigurations settings. For example:
```json
"networkProfile": {
    "networkInterfaceConfigurations": [
    {
      "name": "niconfig1",
      "properties": {
        "primary": true,
        "enableAcceleratedNetworking" : true,
        "ipConfigurations": [
          ...
        ]
      }
    }
   ]
}
```

## Create a scale set that references an existing Azure Load Balancer
When a scale set is created using the Azure portal, a new load balancer is created for most configuration options. If you create a scale set which needs to reference an existing load balancer, you can do this using CLI. The following example script creates a load balancer and then creates a scale set which references it:
```bash
az network lb create -g lbtest -n mylb --vnet-name myvnet --subnet mysubnet --public-ip-address-allocation Static --backend-pool-name mybackendpool

az vmss create -g lbtest -n myvmss --image Canonical:UbuntuServer:16.04-LTS:latest --admin-username negat --ssh-key-value /home/myuser/.ssh/id_rsa.pub --upgrade-policy-mode Automatic --instance-count 3 --vnet-name myvnet --subnet mysubnet --lb mylb --backend-pool-name mybackendpool

```

## Configurable DNS Settings
By default, scale sets take on the specific DNS settings of the VNET and subnet they were created in. You can however, configure the DNS settings for a scale set directly. The DNS settings will then apply to all VMs in the scale set.

### Creating a scale set with configurable DNS servers
To create a scale set with a custom DNS configuration using CLI 2.0, add the --dns-servers argument to the _vmss create_ command, followed by space separated server ip addresses. For example:
```bash
--dns-servers 10.0.0.6 10.0.0.5
```
To configure custom DNS servers in an Azure template, add a dnsSettings property to the scale set networkInterfaceConfigurations section. For example:
```json
"dnsSettings":{
    "dnsServers":["10.0.0.6", "10.0.0.5"]
}
```

### Creating a scale set with configurable domain name
To create a VM scale set with a custom DNS name using CLI 2.0, add the _--vm-domain-name_ argument to the _vmss create_ command, followed by a string representing the domain name.

To set the domain name in an Azure template, add a dnsSettings property to the scale set networkInterfaceConfigurations section. For example:

```json
"networkProfile": {
  "networkInterfaceConfigurations": [
    {
    "name": "nic1",
    "properties": {
      "primary": "true",
      "ipConfigurations": [
      {
        "name": "ip1",
        "properties": {
          "subnet": {
            "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/virtualNetworks/', variables('vnetName'), '/subnets/subnet1')]"
          },
          "publicIPAddressconfiguration": {
            "name": "publicip",
            "properties": {
            "idleTimeoutInMinutes": 10,
              "dnsSettings": {
                "domainNameLabel": "[parameters('vmssDnsName')]"
              }
            }
          }
        }
      }
    ]
    }
}
```

The output, in terms of individual an virtual machine dns name would look like this: 
```
<vmname><vmindex>.<specifiedVmssDomainNameLabel>
```

## IPv6 support for private IPs and Load Balancer pools
You can configure IPv6 public IP addresses on an Azure Load Balancer, and route connections to virtual machine scale set backend pools. To use IPv6, first create an IPv6 public address resource. For example:
```json
{
    "apiVersion": "2016-03-30",
    "type": "Microsoft.Network/publicIPAddresses",
    "name": "[parameters('ipv6PublicIPAddressName')]",
    "location": "[parameters('location')]",
    "properties": {
        "publicIPAddressVersion": "IPv6",
        "publicIPAllocationMethod": "Dynamic",
        "dnsSettings": {
            "domainNameLabel": "[parameters('dnsNameforIPv6LbIP')]"
        }
    }
}
```
Next, configure your load balancer front end IP Configurations for IPv4 and IPv6 as needed:

```json
"frontendIPConfigurations": [
    {
        "name": "LoadBalancerFrontEndIPv6",
        "properties": {
            "publicIPAddress": {
                "id": "[resourceId('Microsoft.Network/publicIPAddresses',parameters('ipv6PublicIPAddressName'))]"
            }
        }
    }
]
```
Define the required backend pools:
```json
"backendAddressPools": [
    {
        "name": "BackendPoolIPv4"
    },
    {
        "name": "BackendPoolIPv6"
    }
]
```
Define any load balancer rules:
```json
{
    "name": "LBRuleIPv6-46000",
    "properties": {
        "frontendIPConfiguration": {
            "id": "[variables('ipv6FrontEndIPConfigID')]"
        },
        "backendAddressPool": {
            "id": "[variables('ipv6LbBackendPoolID')]"
        },
        "protocol": "tcp",
        "frontendPort": 46000,
        "backendPort": 60001,
        "probe": {
            "id": "[variables('ipv4ipv6lbProbeID')]"
        }
    }
}
```
Lastly, reference the IPv6 pool in the VMSS IPConfigurations section of the scale set network properties:
```json
{
    "name": "ipv6IPConfig",
    "properties": {
        "privateIPAddressVersion": "IPv6",
        "loadBalancerBackendAddressPools": [
            {
                "id": "[variables('ipv6LbBackendPoolID')]"
            }
        ]
    }
}
```
Notes:

1.	VMSS Network Profile -> NetworkInterfaceConfiguration supports 2 networkInterfaceIPConfigurations (one for IPv4, one for IPv6).
2.	The networkInterfaceIPConfiguration has an enum – privateIPAddressVersion = IPv4 or IPv6 – in order to identify which one is IPv4 and which one is IPv6.
3.	The subnet on an IPv6 ipconfiguration is null.
4.	The virtualMachineScaleSet API version must be at least 2017-03-30.
5.	The load balancer needs to have both an IPv4 and  IPv6 configuration – 2 public IP’s (distinguished by publicIPAddressVersion = IPv4|IPv6), 2 backend address pools, and load balancer rules. The IPv4 NIC ipconfig refers to IPv4 load balancer backend pools and IPv6 refers to ipv6 pools.

## Public IPv4 per VM
In general Azure scale set VMs do not require their own public IP addresses, because rather than each VM directly facing the internet, it is more economical and secure to associate a public IP address to a load balancer or an individual VM (aka a jumpbox), which then routes incoming connections to scale set VMs as needed (for example, through inbound NAT rules).

However some scenarios do require scale set VMs to have their own public IP addresses. An example of this is gaming, where a console needs to make a direct connection to a cloud virtual machine which is doing game physics processing. Another example is where virtual machines need to make external connections to one another across regions in a distributed database.

### Creating a scale set with public IP per VM
To create a scale set that assigns a public IP address to each virtual machine with CLI 2.0, add the _--public-ip-per-vm_ parameter to the _vmss create_ command. 

To create a scale set using an Azure template, make sure the API version of the Microsoft.Compute/virtualMachineScaleSets resource is at least 2017-03-30, and add a _publicipaddressconfiguration_ JSON property to the scale set ipConfigurations section. For example:

```json
"publicipaddressconfiguration": {
    "name": "pub1",
    "properties": {
      "idleTimeoutInMinutes": 15
    }
}
```
Example template: [azuredeploypip.json](https://github.com/gbowerman/azure-myriad/blob/master/preview/network/azuredeploypip.json)

### Querying the public IP address of the VMs in a scale set
To list the public IP addresses assigned to scale set virtual machines using CLI 2.0, use the _az vmss list-instance-public-ips_ command.

You can also query the public IP addresses assigned to scale set virtual machines using the [Azure Resource Explorer](https://resources.azure.com), or the Azure REST API with version _2017-03-30_ or higher.

To view public IP addresses for a scale set using the Resource Explorer, look at the _publicipaddresses_ section under your scale set. For example:
https://resources.azure.com/subscriptions/_your_sub_id_/resourceGroups/_your_rg_/providers/Microsoft.Compute/virtualMachineScaleSets/_your_vmss_/publicipaddresses

```
GET https://management.azure.com/subscriptions/{your sub ID}/resourceGroups/{RG name}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMSS name}/publicipaddresses?api-version=2017-03-30
```

Example output:
```json
{
  "value": [
    {
      "name": "pub1",
      "id": "/subscriptions/your-subscription-id/resourceGroups/your-rg/providers/Microsoft.Compute/virtualMachineScaleSets/pipvmss/virtualMachines/0/networkInterfaces/pipvmssnic/ipConfigurations/yourvmssipconfig/publicIPAddresses/pub1",
      "etag": "W/\"a64060d5-4dea-4379-a11d-b23cd49a3c8d\"",
      "properties": {
        "provisioningState": "Succeeded",
        "resourceGuid": "ee8cb20f-af8e-4cd6-892f-441ae2bf701f",
        "ipAddress": "13.84.190.11",
        "publicIPAddressVersion": "IPv4",
        "publicIPAllocationMethod": "Dynamic",
        "idleTimeoutInMinutes": 15,
        "ipConfiguration": {
          "id": "/subscriptions/your-subscription-id/resourceGroups/your-rg/providers/Microsoft.Compute/virtualMachineScaleSets/yourvmss/virtualMachines/0/networkInterfaces/yourvmssnic/ipConfigurations/yourvmssipconfig"
        }
      }
    },
    {
      "name": "pub1",
      "id": "/subscriptions/your-subscription-id/resourceGroups/your-rg/providers/Microsoft.Compute/virtualMachineScaleSets/yourvmss/virtualMachines/3/networkInterfaces/yourvmssnic/ipConfigurations/yourvmssipconfig/publicIPAddresses/pub1",
      "etag": "W/\"5f6ff30c-a24c-4818-883c-61ebd5f9eee8\"",
      "properties": {
        "provisioningState": "Succeeded",
        "resourceGuid": "036ce266-403f-41bd-8578-d446d7397c2f",
        "ipAddress": "13.84.159.176",
        "publicIPAddressVersion": "IPv4",
        "publicIPAllocationMethod": "Dynamic",
        "idleTimeoutInMinutes": 15,
        "ipConfiguration": {
          "id": "/subscriptions/your-subscription-id/resourceGroups/your-rg/providers/Microsoft.Compute/virtualMachineScaleSets/yourvmss/virtualMachines/3/networkInterfaces/yourvmssnic/ipConfigurations/yourvmssipconfig"
        }
      }
    }
```

## Multiple IP addresses per NIC
You can have up to 50 public IP addresses per NIC.

## Multiple NICs per VM
You can have up to 8 NICs per VM depending on VM size. The following is an example scale set networkProfile showing multiple nic entries (also showing multiple public IP per VM):
```json
"networkProfile": {
    "networkInterfaceConfigurations": [
        {
        "name": "nic1",
        "properties": {
            "primary": "true",
            "ipConfigurations": [
            {
                "name": "ip1",
                "properties": {
                "subnet": {
                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/virtualNetworks/', variables('vnetName'), '/subnets/subnet1')]"
                },
                "publicipaddressconfiguration": {
                    "name": "pub1",
                    "properties": {
                    "idleTimeoutInMinutes": 15
                    }
                },
                "loadBalancerInboundNatPools": [
                    {
                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/loadBalancers/', variables('lbName'), '/inboundNatPools/natPool1')]"
                    }
                ],
                "loadBalancerBackendAddressPools": [
                    {
                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/loadBalancers/', variables('lbName'), '/backendAddressPools/addressPool1')]"
                    }
                ]
                }
            }
            ]
        }
        },
        {
        "name": "nic2",
        "properties": {
            "primary": "false",
            "ipConfigurations": [
            {
                "name": "ip1",
                "properties": {
                "subnet": {
                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/virtualNetworks/', variables('vnetName'), '/subnets/subnet1')]"
                },
                "publicipaddressconfiguration": {
                    "name": "pub1",
                    "properties": {
                    "idleTimeoutInMinutes": 15
                    }
                },
                "loadBalancerInboundNatPools": [
                    {
                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/loadBalancers/', variables('lbName'), '/inboundNatPools/natPool1')]"
                    }
                ],
                "loadBalancerBackendAddressPools": [
                    {
                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/loadBalancers/', variables('lbName'), '/backendAddressPools/addressPool1')]"
                    }
                ]
                }
            }
            ]
        }
        }
    ]
}
```

## NSG for VMSS
Network Security Groups can be applied directly to a scale set, by adding a refernce to the network interface configuration section of the scale set virtual machine properties.

For example: 
```
"networkProfile": {
    "networkInterfaceConfigurations": [
        {
            "name": "nic1",
            "properties": {
                "primary": "true",
                "ipConfigurations": [
                    {
                        "name": "ip1",
                        "properties": {
                            "subnet": {
                                "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/virtualNetworks/', variables('vnetName'), '/subnets/subnet1')]"
                            }
                "loadBalancerInboundNatPools": [
                                {
                                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/loadBalancers/', variables('lbName'), '/inboundNatPools/natPool1')]"
                                }
                            ],
                            "loadBalancerBackendAddressPools": [
                                {
                                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/loadBalancers/', variables('lbName'), '/backendAddressPools/addressPool1')]"
                                }
                            ]
                        }
                    }
                ],
                "networkSecurityGroup": {
                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/networkSecurityGroups/', variables('nsgName'))]"
                }
            }
        }
    ]
}
```

