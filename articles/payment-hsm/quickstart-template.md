---
title: Azure Quickstart - Create an Azure Payment HSM using an Azure Resource Manager template
description: Quickstart showing how to create Azure Payment HSM using Resource Manager template
services: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.date: 01/30/2024
ms.topic: quickstart
ms.service: payment-hsm
ms.custom: mvc, mode-other, devx-track-arm-template, devx-track-azurepowershell, devx-track-azurecli
#Customer intent: As a security admin who is new to Azure, I want to create a payment HSM using an Azure Resource Manager template.
---

# Quickstart: Create an Azure payment HSM using an ARM template

[!INCLUDE [Payment HSM intro](./includes/about-payment-hsm.md)]

This quickstart describes how to create a payment HSM with the host and management port in same virtual network.  You can instead:
- [Create a payment HSM with host and management port in different virtual network using an ARM template](create-different-vnet.md)
- [Create HSM resource with host and management port with IP addresses in different virtual networks using ARM template](create-different-ip-addresses.md)

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

[!INCLUDE [Create a resource group with the Azure CLI](../../includes/payment-hsm/specialized-service.md)]

- You must register the "Microsoft.HardwareSecurityModules" and "Microsoft.Network" resource providers, as well as the Azure Payment HSM features. Steps for doing so are at [Register the Azure Payment HSM resource provider and resource provider features](register-payment-hsm-resource-providers.md).

  > [!WARNING]
  > You must apply the "FastPathEnabled" feature flag to **every** subscription ID, and add the "fastpathenabled" tag to **every** virtual network. For more information, see [Fastpathenabled](fastpathenabled.md).

  To quickly ascertain if the resource providers and features are already registered, use the Azure CLI [az provider show](/cli/azure/provider#az-provider-show) command. (The output of this command is more readable if you display it in table-format.)

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
      "type": "String",
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
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
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
        "description": "Virtual network name"
      }
    },
    "vnetAddressPrefix": {
      "type": "string",
      "metadata": {
        "description": "Virtual network address prefix"
      }
    },
    "hsmSubnetName": {
      "type": "String",
      "metadata": {
        "description": "Subnet name"
      }
    },
    "hsmSubnetPrefix": {
      "type": "string",
      "metadata": {
        "description": "Subnet prefix"
      }
    }
  },
  "variables": {},
  "resources": [
   {
     "type": "Microsoft.HardwareSecurityModules/dedicatedHSMs",
     "apiVersion": "2021-11-30",
     "name": "[parameters('resourceName')]",
	   "location": "[parameters('location')]",
     "dependsOn": [
      "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), parameters('hsmSubnetName'))]"
     ],
     "sku": {
       "name": "[parameters('skuName')]"
     },
     "properties": {
       "networkProfile": {
         "subnet": {
           "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), parameters('hsmSubnetName'))]"
         }
        },
		"managementNetworkProfile": {
          "subnet": {
            "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), parameters('hsmSubnetName'))]"
          }
        },
        "stampId": "[parameters('stampId')]"
     }
   },
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2020-11-01",
      "name": "[parameters('vnetName')]",
      "location": "[parameters('location')]",
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
      "value": "myHsmVnet"
    },
    "vnetAddressPrefix": {
      "value": "10.0.0.0/16"
    },
    "hsmSubnetName": {
      "value": "myHsmSubnet"
    },
    "hsmSubnetPrefix": {
      "value": "10.0.0.0/24"
    }
  }
}
```

## Deploy the template

# [Azure CLI](#tab/azure-cli)

In this example, you use the Azure CLI to deploy an ARM template to create an Azure payment HSM.  

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

# [Azure PowerShell](#tab/azure-powershell)

In this example, you use the Azure PowerShell to deploy an ARM template to create an Azure payment HSM.  

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
$vnetName = "myVNet" 
$vnetAddressPrefix = "10.0.0.0/16" 
$subnetName = "mySubnet" 
$subnetPrefix = "10.0.0.0/24" 
```

Finally, use the Azure PowerShell [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) cmdlet to deploy your ARM template.

```azurepowershell-interactive
New-AzResourceGroupDeployment -Name $deploymentName -ResourceGroupName $resourceGroupName -TemplateFile $templateFilePath -TemplateParameterFile $templateParametersPath -resourceName $resourceName -vnetName $vnetName -vnetAddressPrefix $vnetAddressPrefix -hsmSubnetName $subnetName -hsmSubnetPrefix $subnetPrefix
```
---

## Validate the deployment

# [Azure CLI](#tab/azure-cli)

You can verify that the payment HSM was created with the Azure CLI [az dedicated-hsm list](/cli/azure/dedicated-hsm#az-dedicated-hsm-list) command. The output is easier to read if you format the results as a table:

```azurecli-interactive
az dedicated-hsm list -o table
```

# [Azure PowerShell](#tab/azure-powershell)

You can verify that the payment HSM was created with the Azure PowerShell [Get-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/get-azdedicatedhsm) cmdlet.

```azurepowershell-interactive
Get-AzDedicatedHsm
```
---

You should see the name of your newly created payment HSM.

## Clean up resources

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [Delete resource group](../../includes/cli-rg-delete.md)]

# [Azure PowerShell](#tab/azure-powershell)

[!INCLUDE [Delete resource group](../../includes/powershell-rg-delete.md)]

---

## Next steps

In this quickstart, you deployed an Azure Resource Manager template to create a payment HSM, verified the deployment, and deleted the payment HSM. To learn more about Azure Payment HSM and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)
