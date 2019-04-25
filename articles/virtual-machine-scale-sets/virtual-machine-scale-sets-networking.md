---
title: Networking for Azure virtual machine scale sets | Microsoft Docs
description: Configuration networking properties for Azure virtual machine scale sets.
services: virtual-machine-scale-sets
documentationcenter: ''
author: mayanknayar
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 76ac7fd7-2e05-4762-88ca-3b499e87906e
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/17/2017
ms.author: manayar

---
# Networking for Azure virtual machine scale sets

When you deploy an Azure virtual machine scale set through the portal, certain network properties are defaulted, for example an Azure Load Balancer with inbound NAT rules. This article describes how to use some of the more advanced networking features that you can configure with scale sets.

You can configure all of the features covered in this article using Azure Resource Manager templates. Azure CLI and PowerShell examples are also included for selected features.

## Accelerated Networking
Azure Accelerated Networking improves network performance by enabling single root I/O virtualization (SR-IOV) to a virtual machine. To learn more about using Accelerated networking, see Accelerated networking for [Windows](../virtual-network/create-vm-accelerated-networking-powershell.md) or [Linux](../virtual-network/create-vm-accelerated-networking-cli.md) virtual machines. To use accelerated networking with scale sets, set enableAcceleratedNetworking to **true** in your scale set's networkInterfaceConfigurations settings. For example:
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
When a scale set is created using the Azure portal, a new load balancer is created for most configuration options. If you create a scale set, which needs to reference an existing load balancer, you can do this using the CLI. The following example script creates a load balancer and then creates a scale set, which references it:
```bash
az network lb create \
    -g lbtest \
    -n mylb \
    --vnet-name myvnet \
    --subnet mysubnet \
    --public-ip-address-allocation Static \
    --backend-pool-name mybackendpool

az vmss create \
    -g lbtest \
    -n myvmss \
    --image Canonical:UbuntuServer:16.04-LTS:latest \
    --admin-username negat \
    --ssh-key-value /home/myuser/.ssh/id_rsa.pub \
    --upgrade-policy-mode Automatic \
    --instance-count 3 \
    --vnet-name myvnet \
    --subnet mysubnet \
    --lb mylb \
    --backend-pool-name mybackendpool
```

## Create a scale set that references an Application Gateway
To create a scale set that uses an application gateway, reference the backend address pool of the application gateway in the ipConfigurations section of your scale set as in this ARM template config:
```json
"ipConfigurations": [{
  "name": "{config-name}",
  "properties": {
  "subnet": {
    "id": "{subnet-id}"
  },
  "ApplicationGatewayBackendAddressPools": [{
    "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/applicationGateways/{gateway-name}/backendAddressPools/{pool-name}"
  }]
}]
```

>[!NOTE]
> Note that the application gateway must be in the same virtual network as the scale set but must be in a different subnet from the scale set.


## Configurable DNS Settings
By default, scale sets take on the specific DNS settings of the VNET and subnet they were created in. You can however, configure the DNS settings for a scale set directly.

### Creating a scale set with configurable DNS servers
To create a scale set with a custom DNS configuration using the Azure CLI, add the **--dns-servers** argument to the **vmss create** command, followed by space separated server ip addresses. For example:
```bash
--dns-servers 10.0.0.6 10.0.0.5
```
To configure custom DNS servers in an Azure template, add a dnsSettings property to the scale set networkInterfaceConfigurations section. For example:
```json
"dnsSettings":{
    "dnsServers":["10.0.0.6", "10.0.0.5"]
}
```

### Creating a scale set with configurable virtual machine domain names
To create a scale set with a custom DNS name for virtual machines using the CLI, add the **--vm-domain-name** argument to the **virtual machine scale set create** command, followed by a string representing the domain name.

To set the domain name in an Azure template, add a **dnsSettings** property to the scale set **networkInterfaceConfigurations** section. For example:

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

The output, for an individual virtual machine dns name would be in the following form: 
```
<vm><vmindex>.<specifiedVmssDomainNameLabel>
```

## Public IPv4 per virtual machine
In general, Azure scale set virtual machines do not require their own public IP addresses. For most scenarios, it is more economical and secure to associate a public IP address to a load balancer or to an individual virtual machine (aka a jumpbox), which then routes incoming connections to scale set virtual machines as needed (for example, through inbound NAT rules).

However, some scenarios do require scale set virtual machines to have their own public IP addresses. An example is gaming, where a console needs to make a direct connection to a cloud virtual machine, which is doing game physics processing. Another example is where virtual machines need to make external connections to one another across regions in a distributed database.

### Creating a scale set with public IP per virtual machine
To create a scale set that assigns a public IP address to each virtual machine with the CLI, add the **--public-ip-per-vm** parameter to the **vmss create** command. 

To create a scale set using an Azure template, make sure the API version of the Microsoft.Compute/virtualMachineScaleSets resource is at least **2017-03-30**, and add a **publicIpAddressConfiguration** JSON property to the scale set ipConfigurations section. For example:

```json
"publicIpAddressConfiguration": {
    "name": "pub1",
    "properties": {
      "idleTimeoutInMinutes": 15
    }
}
```
Example template: [201-vmss-public-ip-linux](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-public-ip-linux)

### Querying the public IP addresses of the virtual machines in a scale set
To list the public IP addresses assigned to scale set virtual machines using the CLI, use the **az vmss list-instance-public-ips** command.

To list scale set public IP addresses using PowerShell, use the _Get-AzPublicIpAddress_ command. For example:
```powershell
Get-AzPublicIpAddress -ResourceGroupName myrg -VirtualMachineScaleSetName myvmss
```

You can also query the public IP addresses by referencing the resource ID of the public IP address configuration directly. For example:
```powershell
Get-AzPublicIpAddress -ResourceGroupName myrg -Name myvmsspip
```

You can also display the public IP addresses assigned to the scale set virtual machines by querying the [Azure Resource Explorer](https://resources.azure.com) or the Azure REST API with version **2017-03-30** or higher.

To query the [Azure Resource Explorer](https://resources.azure.com):

1. Open [Azure Resource Explorer](https://resources.azure.com) in a web browser.
1. Expand *subscriptions* on the left side by clicking the *+* next to it. If you only have one item under *subscriptions*, it may already be expanded.
1. Expand your subscription.
1. Expand your resource group.
1. Expand *providers*.
1. Expand *Microsoft.Compute*.
1. Expand *virtualMachineScaleSets*.
1. Expand your scale set.
1. Click on *publicipaddresses*.

To query the Azure REST API:

```bash
GET https://management.azure.com/subscriptions/{your sub ID}/resourceGroups/{RG name}/providers/Microsoft.Compute/virtualMachineScaleSets/{scale set name}/publicipaddresses?api-version=2017-03-30
```

Example output from the [Azure Resource Explorer](https://resources.azure.com) and Azure REST API:
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
Every NIC attached to a VM in a scale set can have one or more IP configurations associated with it. Each configuration is assigned one private IP address. Each configuration may also have one public IP address resource associated with it. To understand how many IP addresses can be assigned to a NIC, and how many public IP addresses you can use in an Azure subscription, refer to [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

## Multiple NICs per virtual machine
You can have up to 8 NICs per virtual machine, depending on machine size. The maximum number of NICs per machine is available in the [VM size article](../virtual-machines/windows/sizes.md). All NICs connected to a VM instance must connect to the same virtual network. The NICs can connect to different subnets, but all subnets must be part of the same virtual network.

The following example is a scale set network profile showing multiple NIC entries, and multiple public IPs per virtual machine:

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

## NSG & ASGs per scale set
[Network Security Groups](../virtual-network/security-overview.md) allow you to filter traffic to and from Azure resources in an Azure virtual network using security rules. [Application Security Groups](../virtual-network/security-overview.md#application-security-groups) enable you to handle network security of Azure resources and group them as an extension of your application's structure.

Network Security Groups can be applied directly to a scale set, by adding a reference to the network interface configuration section of the scale set virtual machine properties.

Application Security Groups can also be specified directly to a scale set, by adding a reference to the network interface ip configurations section of the scale set virtual machine properties.

For example: 
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
                            "applicationSecurityGroups": [
                                {
                                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/applicationSecurityGroups/', variables('asgName'))]"
                                }
                            ],
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

To verify your Network Security Group is associated with your scale set, use the `az vmss show` command. The below example uses `--query` to filter the results and only show the relevant section of the output.

```bash
az vmss show \
    -g myResourceGroup \
    -n myScaleSet \
    --query virtualMachineProfile.networkProfile.networkInterfaceConfigurations[].networkSecurityGroup

[
  {
    "id": "/subscriptions/.../resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/nsgName",
    "resourceGroup": "myResourceGroup"
  }
]
```

To verify your Application Security Group is associated with your scale set, use the `az vmss show` command. The below example uses `--query` to filter the results and only show the relevant section of the output.

```bash
az vmss show \
    -g myResourceGroup \
    -n myScaleSet \
    --query virtualMachineProfile.networkProfile.networkInterfaceConfigurations[].ipConfigurations[].applicationSecurityGroups

[
  [
    {
      "id": "/subscriptions/.../resourceGroups/myResourceGroup/providers/Microsoft.Network/applicationSecurityGroups/asgName",
      "resourceGroup": "myResourceGroup"
    }
  ]
]
```



## Next steps
For more information about Azure virtual networks, see [Azure virtual networks overview](../virtual-network/virtual-networks-overview.md).
