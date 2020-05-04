---
title: Automated VM deployment with Azure App Configuration quickstart
description: This quickstart demonstrates how to use the Azure PowerShell module and Azure Resource Manager templates to deploy an Azure App Configuration store. Then use the values in the store to deploy a VM.
author: lisaguthrie 
ms.author: lcozzens
ms.date: 04/14/2020
ms.topic: quickstart
ms.service: azure-app-configuration
ms.custom: [mvc, subject-armqs]
---

# Quickstart: Automated VM deployment with App Configuration and Resource Manager template

The Azure PowerShell module is used to create and manage Azure resources using PowerShell cmdlets or scripts. This quickstart shows you how to use Azure PowerShell and Azure Resource Manager templates to deploy an Azure App Configuration store. Then you learn how to use the key-values in the store to deploy a VM.

You use the prerequisite template to create an App Configuration store, and then add key-values into the store using the Azure portal or Azure CLI. The primary template references existing key-value configurations from an existing configuration store. The retrieved values are used to set properties of the resources created by the template, like a VM in this example.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Before you begin

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

* If you don't have an Azure subscription, create a [free account.](https://azure.microsoft.com/free/)

* This quickstart requires the Azure PowerShell module. Run `Get-Module -ListAvailable Az` to find the version that is installed on your local machine. If you need to install or upgrade, see [Install Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-Az-ps).

## Sign in to Azure

Sign in to your Azure subscription with the `Connect-AzAccount` command, and enter your Azure credentials in the pop-up browser:

```azurepowershell-interactive
# Connect to your Azure account
Connect-AzAccount
```

If you have more than one subscription, select the subscription you'd like to use for this quickstart by running the following cmdlets. Don't forget to replace `<your subscription name>` with the name of your subscription:

```azurepowershell-interactive
# List all available subscriptions.
Get-AzSubscription

# Select the Azure subscription you want to use to create the resource group and resources.
Get-AzSubscription -SubscriptionName "<your subscription name>" | Select-AzSubscription
```

## Create a resource group

Create an Azure resource group with [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```azurepowershell-interactive
$resourceGroup = "StreamAnalyticsRG"
$location = "WestUS2"
New-AzResourceGroup `
    -Name $resourceGroup `
    -Location $location
```

## Deploy an Azure App Configuration store

Before you can apply key-values to the VM, you must have an existing Azure App Configuration store. This section details how to deploy an Azure App Configuration store using an Azure Resource Manager template. If you already have an app config store, you can move to the next section of this article. 

1. Copy and paste the following json code into a new file named *prereq.azuredeploy.json*.

   ```json
   {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "configStoreName": {
        "type": "string",
        "metadata": {
          "description": "Specifies the name of the app configuration store."
        }
      },
      "location": {
        "type": "string",
        "defaultValue": "[resourceGroup().location]",
        "metadata": {
          "description": "Specifies the Azure location where the app configuration store should be created."
        }
      },
      "skuName": {
        "type": "string",
        "defaultValue": "standard",
        "metadata": {
          "description": "Specifies the SKU of the app configuration store."
        }
      }
    },
    "resources": [
      {
        "type": "Microsoft.AppConfiguration/configurationStores",
        "name": "[parameters('configStoreName')]",
        "apiVersion": "2019-10-01",
        "location": "[parameters('location')]",
        "sku": {
          "name": "[parameters('skuName')]"
        }
      }
    ]
   }
   ```

1. Copy and paste the following json code into a new file named *prereq.azuredeploy.parameters.json*. Replace **GET-UNIQUE** with a unique name for your Configuration Store.

   ```json
   {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "configStoreName": {
        "value": "GET-UNIQUE"
      }
    }
   }
   ```

1. In your PowerShell window, run the following command to deploy the Azure App Configuration store. Don't forget to replace the resource group name, template file path, and template parameter file path.

   ```azurepowershell
   New-AzResourceGroupDeployment `
       -ResourceGroupName "<your resource group>" `
       -TemplateFile "<path to prereq.azuredeploy.json>" `
       -TemplateParameterFile "<path to prereq.azuredeploy.parameters.json>"
   ```

## Add VM configuration key-values

You can create an App Configuration store using an Azure Resource Manager template, but you need to add key-values using the Azure portal or Azure CLI. In this quickstart, you add key-values using the Azure portal.

1. Once the deployment is complete, navigate to the newly created App Configuration store in [Azure portal](https://portal.azure.com).

1. Select **Settings** > **Access Keys**. Make a note of the primary read-only key connection string. You'll use this connection string later to configure your application to communicate with the App Configuration store that you created.

1. Select Configuration **Explorer** > **Create** to add the following key-value pairs:

   |Key|Value|
   |-|-|
   |windowsOsVersion|2019-Datacenter|
   |diskSizeGB|1023|
  
   Enter *template* for **Label**, but keep **Content Type** empty.

## Deploy VM using stored key-values

Now that you've added key-values to the store, you're ready to deploy a VM using an Azure Resource Manager template. The template references the **windowsOsVersion** and **diskSizeGB** keys you created.

> [!WARNING]
> ARM templates can't reference keys in an App Configuration store that has Private Link enabled.

1. Copy and paste the following json code into a new file named *azuredeploy.json*, or download the file from [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/101-app-configuration/azuredeploy.json).

   ```json
   {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "adminUsername": {
            "type": "string",
            "metadata": {
                "description": "Admin user name."
            }
        },
        "adminPassword": {
            "type": "securestring",
            "metadata": {
                "description": "Password for the Virtual Machine."
            }
        },
        "appConfigStoreName": {
            "type": "string",
            "metadata": {
                "description": "App configuration store name."
            }
        },
        "appConfigStoreResourceGroup": {
            "type": "string",
            "metadata": {
                "description": "Name of the resource group for the app config store."
            }
        },
        "domainNameLabel": {
            "type": "string",
            "metadata": {
                "description": "The DNS label for the public IP address. It must be lowercase. It should match the following regular expression, or it will raise an error: ^[a-z][a-z0-9-]{1,61}[a-z0-9]$."
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
                "description": "Location for all resources."
            }
        },
        "vmSize": {
            "type": "string",
            "defaultValue": "Standard_D2_v3",
            "metadata": {
                "description": "Size of the VM"
            }
        },
        "vmSkuKey": {
            "type": "string",
            "metadata": {
                "description": "Name of the key in the app config store for the VM windows sku"
            }
        },
        "diskSizeKey": {
            "type": "string",
            "metadata": {
                "description": "Name of the key in the app config store for the VM disk size"
            }
        },
        "storageAccountName": {
            "type": "string",
            "metadata": {
                "description": "The name of the storage account."
            }
        }
    },
    "variables": {
        "nicName": "myVMNic",
        "addressPrefix": "10.0.0.0/16",
        "subnetName": "Subnet",
        "subnetPrefix": "10.0.0.0/24",
        "publicIPAddressName": "myPublicIP",
        "vmName": "SimpleWinVM",
        "virtualNetworkName": "MyVNET",
        "subnetRef": "[resourceId('Microsoft.Network/virtualNetworks/subnets', variables('virtualNetworkName'), variables('subnetName'))]",
        "appConfigRef": "[resourceId(parameters('appConfigStoreResourceGroup'), 'Microsoft.AppConfiguration/configurationStores', parameters('appConfigStoreName'))]",
        "windowsOSVersionParameters": {
            "key": "[parameters('vmSkuKey')]",
            "label": "template"
        },
        "diskSizeGBParameters": {
            "key": "[parameters('diskSizeKey')]",
            "label": "template"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2018-11-01",
            "name": "[parameters('storageAccountName')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Standard_LRS"
            },
            "kind": "Storage",
            "properties": {
            }
        },
        {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2018-11-01",
            "name": "[variables('publicIPAddressName')]",
            "location": "[parameters('location')]",
            "properties": {
                "publicIPAllocationMethod": "Dynamic",
                "dnsSettings": {
                    "domainNameLabel": "[parameters('domainNameLabel')]"
                }
            }
        },
        {
            "type": "Microsoft.Network/virtualNetworks",
            "apiVersion": "2018-11-01",
            "name": "[variables('virtualNetworkName')]",
            "location": "[parameters('location')]",
            "properties": {
                "addressSpace": {
                    "addressPrefixes": [
                        "[variables('addressPrefix')]"
                    ]
                },
                "subnets": [
                    {
                        "name": "[variables('subnetName')]",
                        "properties": {
                            "addressPrefix": "[variables('subnetPrefix')]"
                        }
                    }
                ]
            }
        },
        {
            "type": "Microsoft.Network/networkInterfaces",
            "apiVersion": "2018-11-01",
            "name": "[variables('nicName')]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[resourceId('Microsoft.Network/publicIPAddresses/', variables('publicIPAddressName'))]",
                "[resourceId('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]"
            ],
            "properties": {
                "ipConfigurations": [
                    {
                        "name": "ipconfig1",
                        "properties": {
                            "privateIPAllocationMethod": "Dynamic",
                            "publicIPAddress": {
                                "id": "[resourceId('Microsoft.Network/publicIPAddresses',variables('publicIPAddressName'))]"
                            },
                            "subnet": {
                                "id": "[variables('subnetRef')]"
                            }
                        }
                    }
                ]
            }
        },
        {
            "type": "Microsoft.Compute/virtualMachines",
            "apiVersion": "2018-10-01",
            "name": "[variables('vmName')]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]",
                "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
            ],
            "properties": {
                "hardwareProfile": {
                    "vmSize": "[parameters('vmSize')]"
                },
                "osProfile": {
                    "computerName": "[variables('vmName')]",
                    "adminUsername": "[parameters('adminUsername')]",
                    "adminPassword": "[parameters('adminPassword')]"
                },
                "storageProfile": {
                    "imageReference": {
                        "publisher": "MicrosoftWindowsServer",
                        "offer": "WindowsServer",
                        "sku": "[listKeyValue(variables('appConfigRef'), '2019-10-01', variables('windowsOSVersionParameters')).value]",
                        "version": "latest"
                    },
                    "osDisk": {
                        "createOption": "FromImage"
                    },
                    "dataDisks": [
                        {
                            "diskSizeGB": "[listKeyValue(variables('appConfigRef'), '2019-10-01', variables('diskSizeGBParameters')).value]",
                            "lun": 0,
                            "createOption": "Empty"
                        }
                    ]
                },
                "networkProfile": {
                    "networkInterfaces": [
                        {
                            "id": "[resourceId('Microsoft.Network/networkInterfaces',variables('nicName'))]"
                        }
                    ]
                },
                "diagnosticsProfile": {
                    "bootDiagnostics": {
                        "enabled": true,
                        "storageUri": "[reference(resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))).primaryEndpoints.blob]"
                    }
                }
            }
        }
    ],
    "outputs": {
        "hostname": {
            "type": "string",
            "value": "[reference(variables('publicIPAddressName')).dnsSettings.fqdn]"
        }
    }
   }
   ```

1. Copy and paste the following json code into a new file named *azuredeploy.parameters.json*, or download the file from [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/101-app-configuration/azuredeploy.parameters.json).

   ```json
   {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "adminPassword": {
        "value": "GEN-PASSWORD"
      },
      "appConfigStoreName":{
        "value": "GEN-APPCONFIGSTORE-NAME"
      },
      "appConfigStoreResourceGroup": {
         "value": "GEN-APPCONFIGSTORE-RESOURCEGROUP-NAME"
      },
      "vmSkuKey":{
        "value": "GEN-APPCONFIGSTORE-WINDOWSOSVERSION"
      },
      "diskSizeKey" :{
         "value": "GEN-APPCONFIGSTORE-DISKSIZEGB"
      },
      "adminUsername":{
        "value": "GEN-UNIQUE"
      },
      "storageAccountName":{
        "value": "GEN-UNIQUE"
      },
      "domainNameLabel":{
        "value": "GEN-UNIQUE"
      }
    }
   }
   ```

   Replace the parameter values in the template with the following values:

   |Parameter|Value|
   |-|-|
   |adminPassword|An administrator password for the VM.|
   |appConfigStoreName|The name of your Azure App Configuration store.|
   |appConfigStoreResourceGroup|The resource group that contains your App Configuration store.|
   |vmSkuKey|*windowsOSVersion*|
   |diskSizeKey|*diskSizeGB*|
   |adminUsername|An administrator username for the VM.|
   |storageAccountName|A unique name for a storage account associated with the VM.|
   |domainNameLabel|A unique domain name.|

1. In your PowerShell window, run the following command to deploy the VM. Don't forget to replace the resource group name, template file path, and template parameter file path.

   ```azurepowershell
   New-AzResourceGroupDeployment `
       -ResourceGroupName "<your resource group>"
       -TemplateFile "<path to azuredeploy.json>" `
       -TemplateParameterFile "<path to azuredeploy.parameters.json>"
   ```

Congratulations! You've deployed a VM using configurations stored in Azure App Configuration.

## Clean up resources

When no longer needed, delete the resource group, the App Configuration store, VM, and all related resources. If you're planning to use the App Configuration store or VM in future, you can skip deleting it. If you aren't going to continue to use this job, delete all resources created by this quickstart by running the following cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup `
  -Name $resourceGroup
```

## Next steps

In this quickstart, you deployed a VM using an Azure Resource Manager template and key-values from Azure App Configuration.

To learn about creating other applications with Azure App Configuration, continue to the following article:

> [!div class="nextstepaction"]
> [Quickstart: Create an ASP.NET Core app with Azure App Configuration](quickstart-aspnet-core-app.md)
