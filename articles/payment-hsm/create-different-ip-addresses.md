---
title: Create an Azure Payment HSM with host and management port with IP addresses in different virtual networks using ARM template	
description: Create an Azure Payment HSM with host and management port with IP addresses in different virtual networks using ARM template	
services: payment-hsm
ms.service: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: tutorial
ms.custom: devx-track-azurepowershell, devx-track-arm-template, devx-track-azurecli
ms.date: 05/25/2023
---

# Create a payment HSM with host and management port with IP addresses in different virtual networks using ARM template

[!INCLUDE [Payment HSM intro](./includes/about-payment-hsm.md)]

This tutorial describes how to use an Azure Resource Manager template (ARM template) to create an Azure payment HSM with host and management port with IP addresses in different virtual networks. You can instead:

- [Create a payment HSM with the host and management port in the same virtual network using Azure CLI or PowerShell](create-payment-hsm.md)
- [Create a payment HSM with the host and management port in the same virtual network using an ARM template](quickstart-template.md)
- [Create a payment HSM with the host and management port in different virtual networks using Azure CLI or PowerShell](create-different-vnet.md)
- [Create a payment HSM with the host and management port in different virtual networks using an ARM template](create-different-vnet-template.md)
- [Create HSM resource with host and management port with IP addresses in different virtual networks using ARM template](create-different-ip-addresses.md)

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

[!INCLUDE [Specialized service](./includes/specialized-service.md)]

- You must register the "Microsoft.HardwareSecurityModules" and "Microsoft.Network" resource providers, as well as the Azure Payment HSM features. Steps for doing so are at [Register the Azure Payment HSM resource provider and resource provider features](register-payment-hsm-resource-providers.md).

  To quickly ascertain if the resource providers and features are already registered, use the Azure CLI [az provider show](/cli/azure/provider#az-provider-show) command. (You will find the output of this command more readable if you display it in table-format.)

  ```azurecli-interactive
  az provider show --namespace "Microsoft.HardwareSecurityModules" -o table
  
  az provider show --namespace "Microsoft.Network" -o table
  
  az feature registration show -n "FastPathEnabled"  --provider-namespace "Microsoft.Network" -o table
  
  az feature registration show -n "AzureDedicatedHsm"  --provider-namespace "Microsoft.HardwareSecurityModules" -o table
  ```

  You can continue with this quick start if all four of these commands return "Registered".
- You must have an Azure subscription. You can [create a free account](https://azure.microsoft.com/free/) if you don't have one.

[!INCLUDE [Azure CLI prepare your environment](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Review the template

The template used in this quickstart is azuredeploy.json:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "resourceName": {
      "type": "string",
      "metadata": {
        "description": "Azure Payment HSM resource name"
      }
    },
    "stampId": {
      "type": "string",
      "defaultValue": "stamp1",
      "metadata": {
        "description": "stamp id"
      }
    },
    "skuName": {
      "type": "string",
      "defaultValue": "payShield10K_LMK1_CPS60",
      "metadata": {
        "description": "PayShield SKU name. It must be one of the following: payShield10K_LMK1_CPS60, payShield10K_LMK1_CPS250, payShield10K_LMK1_CPS2500, payShield10K_LMK2_CPS60, payShield10K_LMK2_CPS250, payShield10K_LMK2_CPS2500"
      }
    },
    "vnetName": {
      "type": "string",
      "metadata": {
        "description": "Host port virtual network name"
      }
    },
    "vnetAddressPrefix": {
      "type": "string",
      "metadata": {
        "description": "Host port virtual network address prefix"
      }
    },
    "hsmSubnetName": {
      "type": "string",
      "metadata": {
        "description": "Host port subnet name"
      }
    },
    "hsmSubnetPrefix": {
      "type": "string",
      "metadata": {
        "description": "Host port subnet prefix"
      }
    },
    "hostPrivateIpAddress": {
      "type": "string"
    },
    "managementVnetName": {
      "type": "string",
      "metadata": {
        "description": "Management port virtual network name"
      }
    },
    "managementVnetAddressPrefix": {
      "type": "string",
      "metadata": {
        "description": "Management port virtual network address prefix"
      }
    },
    "managementHsmSubnetName": {
      "type": "string",
      "metadata": {
        "description": "Management port subnet name"
      }
    },
    "managementHsmSubnetPrefix": {
      "type": "string",
      "metadata": {
        "description": "Management port subnet prefix"
      }
    },
    "managementPrivateIpAddress": {
      "type": "string"
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.HardwareSecurityModules/dedicatedHSMs",
      "apiVersion": "2021-11-30",
      "name": "[parameters('resourceName')]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), parameters('hsmSubnetName'))]",
        "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('managementVnetName'), parameters('managementHsmSubnetName'))]"
      ],
      "sku": {
        "name": "[parameters('skuName')]"
      },
      "properties": {
        "networkProfile": {
          "subnet": {
            "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), parameters('hsmSubnetName'))]"
          },
          "NetworkInterfaces": [{
              "privateIpaddress": "[parameters('hostPrivateIpAddress')]"
            }
          ]
        },
        "managementNetworkProfile": {
          "subnet": {
            "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('managementVnetName'), parameters('managementHsmSubnetName'))]"
          },
          "NetworkInterfaces": [{
              "privateIpaddress": "[parameters('managementPrivateIpAddress')]"
            }
          ]
        },
        "stampId": "[parameters('stampId')]"
      }
    },
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2020-11-01",
      "name": "[parameters('vnetName')]",
      "location": "[resourceGroup().location]",
      "tags": {
        "fastpathenabled": "true"
      },
      "properties": {
        "addressSpace": {
          "addressPrefixes": [
            "[parameters('vnetAddressPrefix')]"
          ]
        },
        "subnets": [
          {
            "name": "[parameters('hsmSubnetName')]",
            "properties": {
              "addressPrefix": "[parameters('hsmSubnetPrefix')]",
              "serviceEndpoints": [],
              "delegations": [
                {
                  "name": "Microsoft.HardwareSecurityModules.dedicatedHSMs",
                  "properties": {
                    "serviceName": "Microsoft.HardwareSecurityModules/dedicatedHSMs"
                  }
                }
              ],
              "privateEndpointNetworkPolicies": "Enabled",
              "privateLinkServiceNetworkPolicies": "Enabled"
            }
          }
        ],
        "virtualNetworkPeerings": [],
        "enableDdosProtection": false
      }
    },
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2020-11-01",
      "name": "[parameters('managementVnetName')]",
      "location": "[resourceGroup().location]",
      "tags": {
        "fastpathenabled": "true"
      },
      "properties": {
        "addressSpace": {
          "addressPrefixes": [
            "[parameters('managementVnetAddressPrefix')]"
          ]
        },
        "subnets": [
          {
            "name": "[parameters('managementHsmSubnetName')]",
            "properties": {
              "addressPrefix": "[parameters('managementHsmSubnetPrefix')]",
              "serviceEndpoints": [],
              "delegations": [
                {
                  "name": "Microsoft.HardwareSecurityModules.dedicatedHSMs",
                  "properties": {
                    "serviceName": "Microsoft.HardwareSecurityModules/dedicatedHSMs"
                  }
                }
              ],
              "privateEndpointNetworkPolicies": "Enabled",
              "privateLinkServiceNetworkPolicies": "Enabled"
            }
          }
        ],
        "virtualNetworkPeerings": [],
        "enableDdosProtection": false
      }
    },
    {
      "type": "Microsoft.Network/virtualNetworks/subnets",
      "apiVersion": "2020-11-01",
      "name": "[concat(parameters('vnetName'), '/', parameters('hsmSubnetName'))]",
      "dependsOn": [
        "[resourceId('Microsoft.Network/virtualNetworks', parameters('vnetName'))]"
      ],
      "properties": {
        "addressPrefix": "[parameters('hsmSubnetPrefix')]",
        "serviceEndpoints": [],
        "delegations": [
          {
            "name": "Microsoft.HardwareSecurityModules.dedicatedHSMs",
            "properties": {
              "serviceName": "Microsoft.HardwareSecurityModules/dedicatedHSMs"
            }
          }
        ],
        "privateEndpointNetworkPolicies": "Enabled",
        "privateLinkServiceNetworkPolicies": "Enabled"
      }
    },
    {
      "type": "Microsoft.Network/virtualNetworks/subnets",
      "apiVersion": "2020-11-01",
      "name": "[concat(parameters('managementVnetName'), '/', parameters('managementHsmSubnetName'))]",
      "dependsOn": [
        "[resourceId('Microsoft.Network/virtualNetworks', parameters('managementVnetName'))]"
      ],
      "properties": {
        "addressPrefix": "[parameters('managementHsmSubnetPrefix')]",
        "serviceEndpoints": [],
        "delegations": [
          {
            "name": "Microsoft.HardwareSecurityModules.dedicatedHSMs",
            "properties": {
              "serviceName": "Microsoft.HardwareSecurityModules/dedicatedHSMs"
            }
          }
        ],
        "privateEndpointNetworkPolicies": "Enabled",
        "privateLinkServiceNetworkPolicies": "Enabled"
      }
    }
  ]
}
```

The Azure resource defined in the template is:

* **Microsoft.HardwareSecurityModules.dedicatedHSMs**: Create an Azure payment HSM.

The corresponding azuredeploy.parameters.json file is:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "resourceName": {
      "value": "myhsm1"
    },
    "stampId": {
      "value": "stamp1"
    },
    "skuName": {
      "value": "payShield10K_LMK1_CPS60"
    },
    "vnetName": {
      "value": "hsmHostVnet"
    },
    "vnetAddressPrefix": {
      "value": "10.0.0.0/16"
    },
    "hsmSubnetName": {
      "value": "hostSubnet"
    },
    "hsmSubnetPrefix": {
      "value": "10.0.0.0/24"
    },    
    "hostPrivateIpAddress": {
      "value": "10.0.0.5"
    },
    "managementVnetName": {
      "value": "hsmMgmtVNet"
    },
    "managementVnetAddressPrefix": {
      "value": "10.1.0.0/16"
    },
    "managementHsmSubnetName": {
      "value": "mgmtSubnet"
    },
    "managementHsmSubnetPrefix": {
      "value": "10.1.0.0/24"
    },    
    "managementPrivateIpAddress": {
      "value": "10.1.0.6"
    }
  }
}
```

## Deploy the template

# [Azure CLI](#tab/azure-cli)

In this example, you will use the Azure CLI to deploy an ARM template to create an Azure payment HSM.  

First, save the "azuredeploy.json" and "azuredeploy.parameters.json" files locally, for use in the next step. The contents of these files can be found in the [Review the template](#review-the-template) section.  

> [!NOTE]
> The steps below assume that the "azuredeploy.json" and "azuredeploy.parameters.json" file are in the directory from which you are running the commands. If the files are in another directory, you must adjust the file paths accordingly.

Next, create an Azure resource group.  

[!INCLUDE [Create a resource group with the Azure CLI](../../includes/cli-rg-create.md)]

Finally, use the Azure CLI [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) command to deploy your ARM template.

```azurecli-interactive
az deployment group create --resource-group "MyResourceGroup" --name myPHSMDeployment --template-file "azuredeploy.json"
```

When prompted, supply the following values for the parameters:

- **resourceName**: myPaymentHSM
- **vnetName**: myVNet
- **vnetAddressPrefix**: 10.0.0.0/16
- **hsmSubnetName**: mySubnet
- **hsmSubnetPrefix**: 10.0.0.0/24
- **hostPrivateIpAddress**: 10.0.0.5
- **managementVnetName**: MGMTVNet
- **managementVnetAddressPrefix**: 10.1.0.0/16
- **managementHsmSubnetName**: MGMTSubnet
- **managementHsmSubnetPrefix**: 10.1.0.0/24
- **managementPrivateIpAddress**: 10.1.0.6

# [Azure PowerShell](#tab/azure-powershell)

In this example, you will use the Azure PowerShell to deploy an ARM template to create an Azure payment HSM.  

First, save the "azuredeploy.json" and "azuredeploy.parameters.json" files locally, for use in the next step. The contents of these files can be found in the [Review the template](#review-the-template) section.  

> [!NOTE]
> The steps below assume that the "azuredeploy.json" and "azuredeploy.parameters.json" file are in the directory from which you are running the commands. If the files are in another directory, you must adjust the file paths accordingly.

Next, create an Azure resource group.  

[!INCLUDE [Create a resource group with Azure PowerShell](../../includes/powershell-rg-create.md)]

Now, set the following variables for use in the deploy step:

```powershell-interactive
$deploymentName = "myPHSMDeployment"
$resourceGroupName = "myResourceGroup"
$templateFilePath = "azuredeploy.json" 
$templateParametersPath = "azuredeploy.parameters.json" 
$resourceName = "myPaymentHSM" 
$skuName = "payShield10K_LMK1_CPS250" 
$stampId = "stamp1" 
$hostVnetName = "myVNet" 
$hostVnetAddressPrefix = "10.0.0.0/16" 
$hostSubnetName = "mySubnet" 
$hostSubnetPrefix = "10.0.0.0/24"
$hostPrivateIpAddress = "10.0.0.5" 
$mgmtVnetName = "MGMTVNet" 
$mgmtVnetAddressPrefix = "10.1.0.0/16" 
$mgmtSubnetName = "MGMTSubnet" 
$mgmtSubnetPrefix = "10.1.0.0/24"
$mgmtPrivateIpAddress = "10.1.0.6"  
```

Finally, use the Azure PowerShell [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) cmdlet to deploy your ARM template.

```azurepowershell-interactive
New-AzResourceGroupDeployment -Name $deploymentName -ResourceGroupName $resourceGroupName -TemplateFile $templateFilePath -TemplateParameterFile $templateParametersPath -resourceName $resourceName -skuName $skuName -stampId $stampId -vnetName $hostVnetName -vnetAddressPrefix $hostVnetAddressPrefix -hsmSubnetName $hostSubnetName -hsmSubnetPrefix $hostSubnetPrefix -hostPrivateIpAddress $hostPrivateIpAddress -managementVnetName $mgmtVnetName -managementVnetAddressPrefix $mgmtVnetAddressPrefix -managementHsmSubnetName $mgmtSubnetName -managementHsmSubnetPrefix $mgmtSubnetPrefix -managementPrivateIpAddress $mgmtPrivateIpAddress
```

---

## Next steps

Advance to the next article to learn how to view your payment HSM.
> [!div class="nextstepaction"]
> [View your payment HSMs](view-payment-hsms.md)


More resources:

- Read an [Overview of Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)
