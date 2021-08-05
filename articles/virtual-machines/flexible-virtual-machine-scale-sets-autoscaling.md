---
title: Create a Flexible virtual machine scale set with Autoscaling
description: Learn how to create a Flexible virtual machine scale set with Autoscaling.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 08/05/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Preview: Create a Flexible virtual machine scale set with Autoscaling

**Applies to:** :heavy_check_mark: Flexible scale sets

This article steps through creating a virtual machine scale set with Flexible orchestration and Autoscaling. For more information about Flexible scale sets, see [Flexible orchestration mode for virtual machine scale sets](flexible-virtual-machine-scale-sets.md). 


> [!IMPORTANT]
> Virtual machine scale sets in Flexible orchestration mode is currently in public preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


> [!CAUTION]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.


## Prerequisites 

The following parameters are required: 
- Api-version 2021-03-01 (or greater) 
- Single placement group: false
- orchestrationMode: Flexible 
- virtualMachineProfile.networkProfile.networkApiVersion: 2020-11-01 or later 

## ARM Template Deployment (partial) 

```armasm
resource vmssflex 'Microsoft.Compute/virtualMachineScaleSets@2021-03-01' = { 
  name: '${vmssname}' 
  location: '${region}' 
  zones: zones 
  sku: { 
    name: vmSize 
    tier: 'Standard' 
    capacity: vmCount 
  } 
  properties: { 
    orchestrationMode: 'Flexible' 
    singlePlacementGroup: false 
    platformFaultDomainCount: platformFaultDomainCount 
    virtualMachineProfile: { 
      osProfile: { 
        computerNamePrefix: 'myVm' 
        customData: imdsCustomDataBase64 
        adminUsername: adminUsername 
        adminPassword: adminPasswordOrKey 
        linuxConfiguration: any(authenticationType == 'password' ? null : linuxConfiguration)
      } 
      networkProfile: { 
        networkApiVersion: networkApiVersion 
        networkInterfaceConfigurations: [ 
          { 
            name: '${vmssname}NicConfig01' 
            properties: { 
              primary: true 
              enableAcceleratedNetworking: false 
              ipConfigurations: []
```

## Azure portal

To be determined. 

## CLI

To be determined. 

## PowerShell 

To be determined. 

## Terraform

To be determined. 

## REST API

```rest
PUT /subscriptions/<subscriptionid>/resourcegroups/<resourcegroupname> /providers/Microsoft.Compute/virtualMachineScaleSets/<vmscalesetname>?api-version=2021-03-01
```

```json
{​ 
    "location": "westus2", 
    "sku": {​ 
        "name": "Standard_DS1_v2", 
        "capacity": 0 
    }​, 
    "properties": {​ 
        "singlePlacementGroup": false, 
        "orchestrationMode": "Flexible", 
        "platformFaultDomainCount": 1, 
        "virtualMachineProfile": {​ 
            "osProfile": {​ 
                "adminUsername": "azureuser", 
                "adminPassword": "This!s@Terr!bleP@ssw0rd", 
                "computerNamePrefix": "myVm" 
            }​, 
            "networkProfile": {​ 
                "networkApiVersion": "2020-11-01", 
                "networkInterfaceConfigurations": [ 
                    {​ 
                        "name": "myNic", 
                        "properties": {​ 
                            "ipConfigurations": [ 
                                {​ 
                                    "name": "myIp-defaultIpConfiguration", 
                                    "properties": {​ 
                                        "subnet": {​ 
                                            "id": “<subnetid>” 
                                        }​ 
                                    }​ 
                                }​ 
                            ] 
                        }​ 
                    }​ 
                ] 
            }​, 
            "storageProfile": {​ 
                "osDisk": {​ 
                    "osType": "Linux", 
                    "createOption": "FromImage", 
                    "managedDisk": {​ 
                        "storageAccountType": "Standard_LRS" 
                    }​ 
                }​, 
                "imageReference": {​ 
                    "publisher": "canonical", 
                    "offer": "0001-com-ubuntu-pro-focal", 
                    "sku": "pro-20_04-lts", 
                    "version": "latest" 
                }​ 
            }​ 
        }​ 
    }​ 
}​ 
```


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a Flexible scale with Azure CLI.](flexible-virtual-machine-scale-sets-cli.md)

