---
title: Networking for Azure Virtual Machine Scale Sets
description: How to configuration some of the more advanced networking properties for Azure Virtual Machine Scale Sets.
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: networking
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurepowershell
---

# Networking for Azure Virtual Machine Scale Sets

When you deploy an Azure Virtual Machine Scale Set through the portal, certain network properties are defaulted, for example an Azure Load Balancer with inbound NAT rules. This article describes how to use some of the more advanced networking features that you can configure with scale sets.

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

## Azure Virtual Machine Scale Sets with Azure Load Balancer
See [Azure Load Balancer and Virtual Machine Scale Sets](../load-balancer/load-balancer-standard-virtual-machine-scale-sets.md) to learn more about how to configure your Standard Load Balancer with Virtual Machine Scale Sets based on your scenario.

## Add a Virtual Machine Scale Set to an Application Gateway

To add a scale set to the backend pool of an Application Gateway, reference the Application Gateway backend pool in your scale set's network profile. This can be done either when creating the scale set (see ARM Template below) or on an existing scale set.  

### Adding Uniform Orchestration Virtual Machine Scale Sets to an Application Gateway

When adding Uniform Virtual Machine Scale Sets to an Application Gateway's backend pool, the process will differ for new or existing scale sets:

- For new scale sets, reference the Application Gateway's backend pool ID in your scale set model's network profile, under one or more network interface IP configurations. When deployed, instances added to your scale set will be placed in the Application Gateway's backend pool. 
- For existing scale sets, first add the Application Gateway's backend pool ID in your scale set model's network profile, then apply the model your existing instances by an upgrade. If the scale set's upgrade policy is `Automatic` or `Rolling`, instances will be updated for you. If it is `Manual`, you need to upgrade the instances manually. 

#### [Portal](#tab/portal1)

1. Create an Application Gateway and backend pool in the same region as your scale set, if you do not already have one
1. Navigate to the Virtual Machine Scale Set in the Portal
1. Under **Settings**, open the **Networking** pane
1. In the Networking pane, select the **Load balancing** tab and click **Add Load Balancing**
1. Select **Application Gateway** from the Load Balancing Options dropdown, and choose an existing Application Gateway
1. Select the target backend pool and click **Save**
1. If your scale set Upgrade Policy is 'Manual', navigate to the **Settings** > **Instances** pane to select and upgrade each of your instances

#### [PowerShell](#tab/powershell1)

```azurepowershell
    $appGW = Get-AzApplicationGateway -Name <appGWName> -ResourceGroup <AppGWResourceGroupName>
    $backendPool = Get-AzApplicationGatewayBackendAddressPool -Name <backendAddressPoolName> -ApplicationGateway $appGW
    $vmss = Get-AzVMSS -Name <VMSSName> -ResourceGroup <VMSSResourceGroupName>

    $backendPoolMembership = New-Object System.Collections.Generic.List[Microsoft.Azure.Management.Compute.Models.SubResource]

    # add existing backend pool membership to new pool membership of first NIC and ip config
    If ($vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0].ApplicationGatewayBackendAddressPools) {
        $backendPoolMembership.AddRange($vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0].ApplicationGatewayBackendAddressPools)
    }

    # add new backend pool to pool membership
    $backendPoolMembership.Add($backendPool.id)

    # set VMSS model to use to backend pool membership 
    $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0].ApplicationGatewayBackendAddressPools = $backendPoolMembership

    # update the VMSS model
    $vmss | Update-AzVMSS

    # update VMSS instances, if necessary
    If ($vmss.UpgradePolicy.Mode -eq 'Manual') {
        $vmss | Get-AzVmssVM | Foreach-Object { $_ | Update-AzVMSSInstance -InstanceId $_.instanceId}
    }

```

#### [CLI](#tab/cli1)

```azurecli-interactive
appGWName=<appGwName>
appGWResourceGroup=<appGWRGName> 
backendPoolName=<backendPoolName>
backendPoolId=$(az network application-gateway address-pool show --gateway-name $appGWName -g $appGWResourceGroup -n $backendPoolName --query id -otsv)

vmssName=<vmssName>
vmssResourceGroup=<vmssRGName>

# add app gw backend pool to first nic's first ip config
az vmss update -n $vmssName -g $vmssResourceGroup --add "virtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].ipConfigurations[0].applicationGatewayBackendAddressPools" "id=$backendPoolId"

# update instances
az vmss update-instances --instance-ids * --name $vmssName --resource-group $vmssResourceGroup
```

#### [ARM template](#tab/arm1)

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

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->

### Adding Flexible Orchestration Virtual Machine Scale Sets to an Application Gateway

When adding a Flexible scale set to an Application Gateway, the process is the same as adding standalone VMs to an Application Gateway's backend pool--you update the virtual machine's network interface IP configuration to be part of the backend pool. This can be done either [through the Application Gateway's configuration](/azure/application-gateway/create-multiple-sites-portal#add-backend-servers-to-backend-pools) or by configuring the virtual machine's network interface configuration. 

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
To create a scale set with a custom DNS name for virtual machines using the CLI, add the **--vm-domain-name** argument to the **Virtual Machine Scale Set create** command, followed by a string representing the domain name.

To set the domain name in an Azure template, add a **dnsSettings** property to the scale set **networkInterfaceConfigurations** section. For example:

```json
"networkProfile": {
  "networkInterfaceConfigurations": [
    {
    "name": "nic1",
    "properties": {
      "primary": true,
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

```output
<vm><vmindex>.<specifiedVmssDomainNameLabel>
```

## Public IPv4 per virtual machine
In general, Azure scale set virtual machines do not require their own public IP addresses. For most scenarios, it is more economical and secure to associate a public IP address to a load balancer or to an individual virtual machine (also known as a jumpbox), which then routes incoming connections to scale set virtual machines as needed (for example, through inbound NAT rules).

However, some scenarios do require scale set virtual machines to have their own public IP addresses. An example is gaming, where a console needs to make a direct connection to a cloud virtual machine, which is doing game physics processing. Another example is where virtual machines need to make external connections to one another across regions in a distributed database.

### Creating a scale set with public IP per virtual machine
To create a scale set that assigns a public IP address to each virtual machine with the CLI, add the **--public-ip-per-vm** parameter to the **vmss create** command.

To create a scale set using an Azure template, make sure the API version of the Microsoft.Compute/virtualMachineScaleSets resource is at least **2017-03-30**, and add a **publicIpAddressConfiguration** JSON property to the scale set ipConfigurations section. For example:

```json
"publicIpAddressConfiguration": {
    "name": "pub1",
    "sku": {
      "name": "Standard"
    },
    "properties": {
      "idleTimeoutInMinutes": 15
    }
}
```
Note when Virtual Machine Scale Sets with public IPs per instance are created with a load balancer in front, the of the instance IPs is determined by the SKU of the Load Balancer (i.e. Basic or Standard).  If the Virtual Machine Scale Set is created without a load balancer, the SKU of the instance IPs can be set directly by using the SKU section of the template as shown above.

Example template using a Basic Load Balancer: [vmss-public-ip-linux](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vmss-public-ip-linux)

Alternatively, a [Public IP Prefix](../virtual-network/ip-services/public-ip-address-prefix.md) (a contiguous block of Standard SKU Public IPs) can be used to generate instance-level IPs in a Virtual Machine Scale Set. The zonal properties of the prefix will be passed to the instance IPs, though they will not be shown in the output.

Example template using a Public IP Prefix: [vmms-with-public-ip-prefix](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vmss-with-public-ip-prefix)

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
Every NIC attached to a VM in a scale set can have one or more IP configurations associated with it. Each configuration is assigned one private IP address. Each configuration may also have one public IP address resource associated with it. To understand how many IP addresses can be assigned to a NIC, and how many public IP addresses you can use in an Azure subscription, refer to [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

## Multiple NICs per virtual machine
You can have up to 8 NICs per virtual machine, depending on machine size. The maximum number of NICs per machine is available in the [VM size article](../virtual-machines/sizes.md). All NICs connected to a VM instance must connect to the same virtual network. The NICs can connect to different subnets, but all subnets must be part of the same virtual network.

The following example is a scale set network profile showing multiple NIC entries, and multiple public IPs per virtual machine:

```json
"networkProfile": {
    "networkInterfaceConfigurations": [
        {
        "name": "nic1",
        "properties": {
            "primary": true,
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
            "primary": false,
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
[Network Security Groups](../virtual-network/network-security-groups-overview.md) allow you to filter traffic to and from Azure resources in an Azure virtual network using security rules. [Application Security Groups](../virtual-network/network-security-groups-overview.md#application-security-groups) enable you to handle network security of Azure resources and group them as an extension of your application's structure.

Network Security Groups can be applied directly to a scale set, by adding a reference to the network interface configuration section of the scale set virtual machine properties.

Application Security Groups can also be specified directly to a scale set, by adding a reference to the network interface ip configurations section of the scale set virtual machine properties.

For example:

```json
"networkProfile": {
    "networkInterfaceConfigurations": [
        {
            "name": "nic1",
            "properties": {
                "primary": true,
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

```azurecli
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

```azurecli
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

## Make networking updates to specific instances

You can make networking updates to specific Virtual Machine Scale Set instances.

You can `PUT` against the instance to update the network configuration. This can be used to do things like add or remove network interface cards (NICs), or remove an instance from a backend pool.

```
PUT https://management.azure.com/subscriptions/.../resourceGroups/vmssnic/providers/Microsoft.Compute/virtualMachineScaleSets/vmssnic/virtualMachines/1/?api-version=2019-07-01
```

The following example shows how to add a second IP Configuration to your NIC.

1. `GET` the details for a specific Virtual Machine Scale Set instance.

    ```
    GET https://management.azure.com/subscriptions/.../resourceGroups/vmssnic/providers/Microsoft.Compute/virtualMachineScaleSets/vmssnic/virtualMachines/1/?api-version=2019-07-01
    ```

    *The following was simplified to show only networking parameters for this example.*

    ```json
    {
      ...
      "properties": {
        ...
        "networkProfileConfiguration": {
          "networkInterfaceConfigurations": [
            {
              "name": "vmssnic-vnet-nic01",
              "properties": {
                "primary": true,
                "enableAcceleratedNetworking": false,
                "networkSecurityGroup": {
                  "id": "/subscriptions/123a1a12-a123-1ab1-12a1-12a1a1234ab1/resourceGroups/vmssnic/providers/Microsoft.Network/networkSecurityGroups/basicNsgvmssnic-vnet-nic01"
                },
                "dnsSettings": {
                  "dnsServers": []
                },
                "enableIPForwarding": false,
                "ipConfigurations": [
                  {
                    "name": "vmssnic-vnet-nic01-defaultIpConfiguration",
                    "properties": {
                      "publicIPAddressConfiguration": {
                        "name": "publicIp-vmssnic-vnet-nic01",
                        "properties": {
                          "idleTimeoutInMinutes": 15,
                          "ipTags": [],
                          "publicIPAddressVersion": "IPv4"
                        }
                      },
                      "primary": true,
                      "subnet": {
                        "id": "/subscriptions/123a1a12-a123-1ab1-12a1-12a1a1234ab1/resourceGroups/vmssnic/providers/Microsoft.Network/virtualNetworks/vmssnic-vnet/subnets/default"
                      },
                      "privateIPAddressVersion": "IPv4"
                    }
                  }
                ]
              }
            }
          ]
        },
        ...
      }
    }
    ```

2. `PUT` against the instance, updating to add the additional IP configuration. This is similar for adding additional `networkInterfaceConfiguration`.


    ```
    PUT https://management.azure.com/subscriptions/.../resourceGroups/vmssnic/providers/Microsoft.Compute/virtualMachineScaleSets/vmssnic/virtualMachines/1/?api-version=2019-07-01
    ```

    *The following was simplified to show only networking parameters for this example.*

    ```json
      {
      ...
      "properties": {
        ...
        "networkProfileConfiguration": {
          "networkInterfaceConfigurations": [
            {
              "name": "vmssnic-vnet-nic01",
              "properties": {
                "primary": true,
                "enableAcceleratedNetworking": false,
                "networkSecurityGroup": {
                  "id": "/subscriptions/123a1a12-a123-1ab1-12a1-12a1a1234ab1/resourceGroups/vmssnic/providers/Microsoft.Network/networkSecurityGroups/basicNsgvmssnic-vnet-nic01"
                },
                "dnsSettings": {
                  "dnsServers": []
                },
                "enableIPForwarding": false,
                "ipConfigurations": [
                  {
                    "name": "vmssnic-vnet-nic01-defaultIpConfiguration",
                    "properties": {
                      "publicIPAddressConfiguration": {
                        "name": "publicIp-vmssnic-vnet-nic01",
                        "properties": {
                          "idleTimeoutInMinutes": 15,
                          "ipTags": [],
                          "publicIPAddressVersion": "IPv4"
                        }
                      },
                      "primary": true,
                      "subnet": {
                        "id": "/subscriptions/123a1a12-a123-1ab1-12a1-12a1a1234ab1/resourceGroups/vmssnic/providers/Microsoft.Network/virtualNetworks/vmssnic-vnet/subnets/default"
                      },
                      "privateIPAddressVersion": "IPv4"
                    }
                  },
                  {
                    "name": "my-second-config",
                    "properties": {
                      "subnet": {
                        "id": "/subscriptions/123a1a12-a123-1ab1-12a1-12a1a1234ab1/resourceGroups/vmssnic/providers/Microsoft.Network/virtualNetworks/vmssnic-vnet/subnets/default"
                      },
                      "privateIPAddressVersion": "IPv4"
                    }
                  }
                ]
              }
            }
          ]
        },
        ...
      }
    }
    ```


## Explicit network outbound connectivity for Flexible scale sets 

In order to enhance default network security, [Virtual Machine Scale Sets with Flexible orchestration](..\virtual-machines\flexible-virtual-machine-scale-sets.md) will require that instances created implicitly via the autoscaling profile have outbound connectivity defined explicitly through one of the following methods: 

- For most scenarios, we recommend [NAT Gateway attached to the subnet](../virtual-network/nat-gateway/quickstart-create-nat-gateway-portal.md).
- For scenarios with high security requirements or when using Azure Firewall or Network Virtual Appliance (NVA), you can specify a custom User Defined Route as next hop through firewall. 
- Instances are in the backend pool of a Standard SKU Azure Load Balancer. 
- Attach a Public IP Address to the instance network interface. 

With single instance VMs and Virtual Machine Scale Sets with Uniform orchestration, outbound connectivity is provided automatically. 

Common scenarios that will require explicit outbound connectivity include: 

- Windows VM activation will require that you have defined outbound connectivity from the VM instance to the Windows Activation Key Management Service (KMS). See [Troubleshoot Windows VM activation problems](/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems) for more information.  
- Access to storage accounts or Key Vault. Connectivity to Azure services can also be established via [Private Link](../private-link/private-link-overview.md). 

See [Default outbound access in Azure](../virtual-network/ip-services/default-outbound-access.md) for more details on defining secure outbound connections.


## Next steps
For more information about Azure virtual networks, see [Azure virtual networks overview](../virtual-network/virtual-networks-overview.md).
