---
title: Quickstart for deploying Azure App Configuration using an ARM template | Microsoft Docs
description: Quickstart for deploying an Azure App Configuration store using an ARM template
services: azure-app-configuration
author: jpconnock

ms.service: azure-app-configuration
ms.topic: quickstart
ms.date: 1/05/2020
ms.author: jeconnoc

#Customer intent: As an application developer, I want to learn how to deploy an Azure App Configuration store using an ARM template.
---
# Quickstart: Deploy an Azure App Configuration store using an ARM template

Azure App Configuration stores provide the ability to define Azure resources as well as application settings and feature flags in a single, centrally managed store. In this quickstart, you will use an ARM template to quickly deploy a virtual machine using the definition found in an Azure App Configuration store.  

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [.NET Core SDK](https://dotnet.microsoft.com/download)

>[!TIP]
> The Azure Cloud Shell is a free interactive shell that you can use to run the command line instructions in this article.  It has common Azure tools preinstalled, including the .NET Core SDK. If you are logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com.  You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

## Create an App Configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

6. Select **Configuration Explorer** > **Create** to add the following key-value pairs:

| Key | Value | Label | 
    |---|---|
    | adminUsername | *username for the virtual machine* |
    | dnsLabelPrefix | *unique DNS name* |
    | windowsOSVersion | 2019-Datacenter |

    Leave **Content Type** empty for now.

>[!Important]
> The DNS name must contain fewer than 64 characters, start with a lower-case letter, and contain only alpha-numeric characters.

7. Save the following code to your working directory in a file called *azuredeploy.parameters.json*.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "adminPassword": {
      "value": "MUST_BE_REPLACED"
    },
    "appConfigStoreName": {
      "value": "MUST_BE_REPLACED"
    }
  }
}
```
8. Update the *value* of the *adminPassword* to the secure password of your choice.  This password provides access to the virtual machine(s) created by the template. The password must be 8-123 characters long and satisfy at least 3 of the following requirements:
- Contains an uppercase character
- Contains a lowercase character
- Contains a numeric digit
- Contains a special character.  
In addition, control characters are prohibited.
9. Update the value of the *appConfigStoreName* to match the resource name of the store you created in step 3.
10. Save the following code in your working directory to a file called *azuredeploy.json*.  This file does not need to be modified to complete this quickstart.  It defines the virtual machine and its associated storage account using the key-value pairs created in step 6.
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
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
    "appConfigRef": "[resourceId('Microsoft.AppConfiguration/configurationStores', parameters('appConfigStoreName'))]",
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
          "vmSize": "Standard_DS1_v2"
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
11. In your working directory, issue the following command after replacing *yourGroup* with the name of the resource group containing your Azure App Config store.
```powershell
az group deployment create -g yourGroup --template-file azuredeploy.json --parameters azuredeploy.parameters.json
```

The deployment will take some time to complete.  Once the deployment is complete, verify success by finding the newly created virtual machine in your [Azure Portal](https://portal.azure.com) and comparing the virtual machine's DNS name with the unique DNS name you created in step 6.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and used it to deploy a virtual machine.  To learn how to use Azure App Configuration to deploy and configure an ASP.NET Core application, continue to the next quickstart.

> [!div class="nextstepaction"]
> [Create an ASP.NET Core application with Azure App Configuration](./quickstart-aspnet-core-app.md)