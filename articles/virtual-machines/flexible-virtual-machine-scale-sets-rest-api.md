---
title: Create virtual machines in a Flexible scale set using an ARM template
description: Learn how to create a virtual machine scale set in Flexible orchestration mode using an ARM template.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 08/05/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Preview: Create virtual machines in a Flexible scale set using an ARM template

**Applies to:** :heavy_check_mark: Flexible scale sets


This article steps through using an ARM template to create a virtual machine scale set in Flexible orchestration mode. For more information about Flexible scale sets, see [Flexible orchestration mode for virtual machine scale sets](flexible-virtual-machine-scale-sets.md). 


> [!IMPORTANT]
> Virtual machine scale sets in Flexible orchestration mode is currently in public preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


> [!CAUTION]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.


## Register for Flexible orchestration mode

Before you can deploy virtual machine scale sets in Flexible orchestration mode, you must first [register your subscription for the preview feature](flexible-virtual-machine-scale-sets.md#register-for-flexible-orchestration-mode). The registration may take several minutes to complete.

## ARM template 

An [ARM template](../azure/azure-resource-manager/templates/overview.md) is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment.

ARM templates let you deploy groups of related resources. In a single template, you can create the virtual machine scale set, install applications, and configure autoscale rules. With the use of variables and parameters, this template can be reused to update existing, or create additional, scale sets. You can deploy templates through the Azure portal, Azure CLI, or Azure PowerShell, or from continuous integration / continuous delivery (CI/CD) pipelines.


```armasm
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "0.4.451.19169",
      "templateHash": "8572588880309981021"
    }
  },
  "parameters": {
    "vmssname": {
      "type": "string",
      "defaultValue": "myVmssFlex"
    },
    "region": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "zones": {
      "type": "array",
      "defaultValue": []
    },
    "vmSize": {
      "type": "string",
      "defaultValue": "Standard_DS1_v2"
    },
    "platformFaultDomainCount": {
      "type": "int",
      "defaultValue": 1,
      "allowedValues": [
        1,
        2,
        3,
        5
      ]
    },
    "vmCount": {
      "type": "int",
      "defaultValue": 3,
      "maxValue": 500
    },
    "subnetId": {
      "type": "string"
    },
    "adminUsername": {
      "type": "string",
      "defaultValue": "azureuser"
    },
    "authenticationType": {
      "type": "string",
      "defaultValue": "password",
      "allowedValues": [
        "password",
        "sshPublicKey"
      ]
    },
    "adminPasswordOrKey": {
      "type": "secureString",
      "defaultValue": "[newGuid()]"
    }
  },
  "functions": [],
  "variables": {
    "networkApiVersion": "2020-11-01",
    "linuxConfiguration": {
      "disablePasswordAuthentication": true,
      "provisionVMAgent": true,
      "ssh": {
        "publicKeys": [
          {
            "path": "[format('/home/{0}/.ssh/authorized_keys', parameters('adminUsername'))]",
            "keyData": "[parameters('adminPasswordOrKey')]"
          }
        ]
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachineScaleSets",
      "apiVersion": "2021-03-01",
      "name": "[parameters('vmssname')]",
      "location": "[parameters('region')]",
      "zones": "[parameters('zones')]",
      "sku": {
        "name": "[parameters('vmSize')]",
        "tier": "Standard",
        "capacity": "[parameters('vmCount')]"
      },
      "properties": {
        "orchestrationMode": "Flexible",
        "singlePlacementGroup": false,
        "platformFaultDomainCount": "[parameters('platformFaultDomainCount')]",
        "virtualMachineProfile": {
          "osProfile": {
            "computerNamePrefix": "myVm",
            "adminUsername": "[parameters('adminUsername')]",
            "adminPassword": "[parameters('adminPasswordOrKey')]",
            "linuxConfiguration": "[if(equals(parameters('authenticationType'), 'password'), null(), variables('linuxConfiguration'))]"
          },
          "networkProfile": {
            "networkApiVersion": "[variables('networkApiVersion')]",
            "networkInterfaceConfigurations": [
              {
                "name": "[format('{0}NicConfig01', parameters('vmssname'))]",
                "properties": {
                  "primary": true,
                  "enableAcceleratedNetworking": false,
                  "ipConfigurations": [
                    {
                      "name": "[format('{0}IpConfig', parameters('vmssname'))]",
                      "properties": {
                        "privateIPAddressVersion": "IPv4",
                        "subnet": {
                          "id": "[parameters('subnetId')]"
                        }
                      }
                    }
                  ]
                }
              }
            ]
          },
          "diagnosticsProfile": {
            "bootDiagnostics": {
              "enabled": true
            }
          },
          "storageProfile": {
            "osDisk": {
              "osType": "Linux",
              "createOption": "FromImage",
              "caching": "ReadWrite",
              "diskSizeGB": 256,
              "managedDisk": {
                "storageAccountType": "Premium_LRS"
              }
            },
            "imageReference": {
              "publisher": "Canonical",
              "offer": "UbuntuServer",
              "sku": "18.04-LTS",
              "version": "latest"
            }
          }
        }
      }
    }
  ],
  "outputs": {
    "vmssid": {
      "type": "string",
      "value": "[resourceId('Microsoft.Compute/virtualMachineScaleSets', parameters('vmssname'))]"
    }
  }
}
```

## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a Flexible scale set in the Azure portal.](flexible-virtual-machine-scale-sets-portal.md)