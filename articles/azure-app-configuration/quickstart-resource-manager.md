---
title: Apply App Configuration key-values using Azure Resource Manager quickstart
description: This quickstart demonstrates how to use the Azure PowerShell module to deploy an Azure App Configuration store and use the values in the store to deploy a VM.
author: mamccrea
ms.author: mamccrea
ms.date: 02/19/2020
ms.topic: quickstart
ms.service: azure-app-configuration
ms.custom: mvc
---

# Quickstart: Apply App Configuration key-values using Azure Resource Manager

The Azure PowerShell module is used to create and manage Azure resources using PowerShell cmdlets or scripts. This quickstart details using the Azure PowerShell module and Azure Resource Manager templates to deploy an Azure App Configuration store and use the key-values in the store to deploy a VM.

You use the prerequisite template to create an App Configuration store, and then add key-values into the store using the Azure portal or Azure CLI. The primary template references existing key-value configurations from an existing configuration store. The retrieved values are used to set properties of the resources created by the template, like a VM in this example.

## Before you begin

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

* If you don't have an Azure subscription, create a [free account.](https://azure.microsoft.com/free/)

* This quickstart requires the Azure PowerShell module. Run `Get-Module -ListAvailable Az` to find the version that is installed on your local machine. If you need to install or upgrade, see [Install Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-Az-ps).

## Sign in to Azure

Sign in to your Azure subscription with the `Connect-AzAccount` command, and enter your Azure credentials in the pop-up browser:

```powershell
# Connect to your Azure account
Connect-AzAccount
```

If you have more than one subscription, select the subscription you would like to use for this quickstart by running the following cmdlets. Don't forget to replace `<your subscription name>` with the name of your subscription:

```powershell
# List all available subscriptions.
Get-AzSubscription

# Select the Azure subscription you want to use to create the resource group and resources.
Get-AzSubscription -SubscriptionName "<your subscription name>" | Select-AzSubscription
```

## Create a resource group

Create an Azure resource group with [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```powershell
$resourceGroup = "StreamAnalyticsRG"
$location = "WestUS2"
New-AzResourceGroup `
    -Name $resourceGroup `
    -Location $location
```

## Deploy an Azure App Configuration store

Before you can apply key-values to the VM, you must have an existing Azure App Configuration store. This section details how to deploy an Azure App Configuration store using an Azure Resource Manager template. If you already have an app config store, you can move to the next section of this article. 

1. In your PowerShell window, run the [az login](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest) command to sign in to your Azure account.

    When you successfully sign in, Azure CLI returns a list of your subscriptions. Copy the subscription you're using for this quickstart and run the [az account set](https://docs.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli?view=azure-cli-latest#change-the-active-subscription) command to select that subscription. Choose the same subscription you selected in the previous section with PowerShell. Make sure to replace `<your subscription name>` with the name of your subscription.

    ```azurecli
    az login

    az account set --subscription "<your subscription>"
    ```

2. Copy and paste the following json code into a new file named *prereq.azuredeploy.json*, or download the file from [Azure Quickstart templates](replace-templatepath).

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
        "defaultValue": "free",
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

4. Copy and paste the following json code into a new file named *prereq.azuredeploy.parameters.json*, or download the file from [Azure Quickstart templates](replace-templatepath). Replace **GET-UNIQUE** with a unique name for your Configuration Store.

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

5. In your PowerShell window, run the following command to deploy the Azure App Configuration store. Don't forget to replace the resource group name, template file path, and template parameter file path.

   ```azurepowershell
   New-AzResourceGroupDeployment -ResourceGroupName "<your resource group>" -TemplateFile "<path to prereq.azuredeploy.json>" -TemplateParameterFile "<path to prereq.azuredeploy.parameters.json>"
   ```

## Add VM configuration key-values

You can create an App Configuration store using an Azure Resource Manager template, but you need to add key-values using the Azure portal or Azure CLI. In this quickstart, you add key-values using the Azure portal.

1. Once the deployment is complete, navigate to the newly created App Configuration store in [Azure portal](https://portal.azure.com).

2. Select **Settings** > **Access Keys**. Make a note of the primary read-only key connection string. You'll use this connection string later to configure your application to communicate with the App Configuration store that you created.

3. Select Configuration **Explorer** > **Create** to add the following key-value pairs:

   |Key|Value|
   |-|-|
   |windowsOsVersion|sku|
   |vmSize|osVersion|
  
   Leave **Label** and **Content Type** empty.

## Deploy VM using stored key-values

Now that you've added key-values to the store, you're ready to deploy a VM using an Azure Resource Manager template that references the **windowsOsVersion** and **vmSize** keys you created.

1. In your PowerShell window, run the [az login](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest) command to sign in to your Azure account.

    When you successfully sign in, Azure CLI returns a list of your subscriptions. Copy the subscription you're using for this quickstart and run the [az account set](https://docs.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli?view=azure-cli-latest#change-the-active-subscription) command to select that subscription. Choose the same subscription you selected in the previous section with PowerShell. Make sure to replace `<your subscription name>` with the name of your subscription.

    ```azurecli
    az login

    az account set --subscription "<your subscription>"
    ```

2. Copy and paste the following json code into a new file named *azuredeploy.json*, or download the file from [Azure Quickstart templates](replace-templatepath).

   ```json
   {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "resourceGroup": {
        "type": "string",
        "metadata": {
          "description": "Resource group name."
        }
      },
      "appConfigStoreName": {
        "type": "string",
        "metadata": {
          "description": "App configuration store name."
        }
      },
      "adminPassword": {
        "type": "securestring",
        "metadata": {
          "description": "Password for the Virtual Machine."
        }
      },
      "location": {
        "type": "string",
        "defaultValue": "[resourceGroup().location]",
        "metadata": {
          "description": "Location for all resources."
        },
        "vmSize": {
          "type": "string",
          "defaultValue": "Standard_DS1_v2",
          "metadata": {
              "description": "The size of the VM"
          }
        }
      }
    },
    "variables": {
      "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'sawinvm')]",
      "nicName": "myVMNic",
      "addressPrefix": "10.0.0.0/16",
      "subnetName": "Subnet",
      "subnetPrefix": "10.0.0.0/24",
      "publicIPAddressName": "myPublicIP",
      "vmName": "SimpleWinVM",
      "virtualNetworkName": "MyVNET",
      "subnetRef": "[resourceId('Microsoft.Network/virtualNetworks/subnets', variables('virtualNetworkName'), variables('subnetName'))]",
      "appConfigRef": "[resourceId('Microsoft.AppConfiguration/configurationStores', parameters('appConfigStoreName', 'resourceGroup'))]",
      "appConfigApiVersion": "2019-02-01-preview",
      "label": "template",
      "adminUsernameParameters": {
        "key": "adminUsername",
        "label": "[variables('label')]"
      },
      "dnsLabelPrefixParameters": {
        "key": "dnsLabelPrefix",
        "label": "[variables('label')]"
      },
      "windowsOSVersionParameters": {
        "key": "windowsOSVersion",
        "label": "[variables('label')]"
      }
    },
    "resources": [
      {
        "type": "Microsoft.Storage/storageAccounts",
        "apiVersion": "2018-11-01",
        "name": "[variables('storageAccountName')]",
        "location": "[parameters('location')]",
        "sku": {
          "name": "Standard_LRS"
        },
        "kind": "Storage",
        "properties": {}
      },
      {
        "type": "Microsoft.Network/publicIPAddresses",
        "apiVersion": "2018-11-01",
        "name": "[variables('publicIPAddressName')]",
        "location": "[parameters('location')]",
        "properties": {
          "publicIPAllocationMethod": "Dynamic",
          "dnsSettings": {
            "domainNameLabel": "[listKeyValue(variables('appConfigRef'), variables('appConfigApiVersion'), variables('dnsLabelPrefixParameters')).value]"
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
          "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
          "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
        ],
        "properties": {
          "hardwareProfile": {
            "vmSize": "[variables('vmSize')[copyIndex()]]"
          },
          "osProfile": {
            "computerName": "[variables('vmName')]",
            "adminUsername": "[listKeyValue(variables('appConfigRef'), variables('appConfigApiVersion'), variables('adminUsernameParameters')).value]",
            "adminPassword": "[parameters('adminPassword')]"
          },
          "storageProfile": {
            "imageReference": {
              "publisher": "MicrosoftWindowsServer",
              "offer": "WindowsServer",
              "sku": "[listKeyValue(variables('appConfigRef'), variables('appConfigApiVersion'), variables('windowsOSVersionParameters')).value]",
              "version": "latest"
            },
            "osDisk": {
              "createOption": "FromImage"
            },
            "dataDisks": [
              {
                "diskSizeGB": 1023,
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
              "storageUri": "[reference(resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))).primaryEndpoints.blob]"
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

4. Copy and paste the following json code into a new file named *azuredeploy.parameters.json*, or download the file from [Azure Quickstart templates](replace-templatepath). Replace **GEN-PASSWORD** with a password for your VM and **GET-PREREQ-configStoreName** with the name of the Azure App Configuration store you created in the first section of this quickstart.

   ```json
   {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "adminPassword": {
        "value": "GEN-PASSWORD"
      },
      "appConfigStoreName": {
        "value": "GET-PREREQ-configStoreName"
      }
    }
   }
   ```

5. In your PowerShell window, run the following command to deploy the Azure App Configuration store. Don't forget to replace the resource group name, template file path, and template parameter file path.

   ```azurepowershell
   New-AzResourceGroupDeployment -ResourceGroupName "<your resource group>" -TemplateFile "<path to prereq.azuredeploy.json>" -TemplateParameterFile "<path to prereq.azuredeploy.parameters.json>"
   ```

Congratulations! You've deployed a VM using configurations stored in Azure App Configuration.

## Clean up resources

When no longer needed, delete the resource group, the App Configuration store, VM, and all related resources. If you're planning to use the App Configuration store or VM in future, you can skip deleting it. If you aren't going to continue to use this job, delete all resources created by this quickstart by running the following cmdlet:

```powershell
Remove-AzResourceGroup `
  -Name $resourceGroup
```

## Next steps

In this quickstart, you deployed a VM using an Azure Resource Manager template and key-values from Azure App Configuration.

To learn about creating other applications with Azure App Configuration, continue to the following article:

> [!div class="nextstepaction"]
> [Quickstart: Create an ASP.NET Core app with Azure App Configuration](quickstart-aspnet-core-app.md)
