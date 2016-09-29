<properties
	pageTitle="Customize exported Resource Manager template | Microsoft Azure"
	description="Add parameters to an exported Azure Resource Manager template and redeploy it through Azure PowerShell or Azure CLI."
	services="azure-resource-manager"
	documentationCenter=""
	authors="tfitzmac"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="azure-resource-manager"
	ms.workload="multiple"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="08/01/2016"
	ms.author="tomfitz"/>

# Customize an exported Azure Resource Manager template

This article shows you how to modify an exported template so that you can pass in additional values as parameters. It builds on the steps performed in the [Export Resource Manager template](resource-manager-export-template.md) article, but it is not essential that you complete that article first. You can find the required template and scripts in this article.

## View an exported template

If you have completed [Export Resource Manager template](resource-manager-export-template.md), open the template that you downloaded. The template is named **template.json**. If you have Visual Studio or Visual Code, you can use either one to edit the template. Otherwise, you can use any JSON editor or text editor.

If you have not completed the previous walkthrough, create a file named **template.json**, and add the following content from the exported template to the file.

```
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "virtualNetworks_VNET_name": {
            "defaultValue": "VNET",
            "type": "String"
        },
        "storageAccounts_storagetf05092016_name": {
            "defaultValue": "storagetf05092016",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "comments": "Generalized from resource in walkthrough.",
            "type": "Microsoft.Network/virtualNetworks",
            "name": "[parameters('virtualNetworks_VNET_name')]",
            "apiVersion": "2015-06-15",
            "location": "northeurope",
            "properties": {
                "addressSpace": {
                    "addressPrefixes": [
                        "10.0.0.0/16"
                    ]
                },
                "subnets": [
                    {
                        "name": "default",
                        "properties": {
                            "addressPrefix": "10.0.0.0/24"
                        }
                    }
                ]
            },
            "dependsOn": []
        },
        {
            "comments": "Generalized from resource in walkthrough.",
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[parameters('storageAccounts_storagetf05092016_name')]",
            "apiVersion": "2015-06-15",
            "location": "northeurope",
            "tags": {},
            "properties": {
                "accountType": "Standard_RAGRS"
            },
            "dependsOn": []
        }
    ]
}
```

The template.json template works fine if you want to create the same type of storage account in the same region with a virtual network that uses the same address prefix and same subnet prefix for every deployment. However, Resource Manager provides options so that you can deploy templates with a lot more flexibility than that. For example, during deployment, you might want to specify the type of storage account to create or the values to use for the virtual network address prefix and subnet prefix.

## Customize the template

In this section, you will add parameters to the exported template so that you can reuse the template when you deploy these resources to other environments. You will also add some features to your template to decrease the likelihood that you'll encounter an error when you deploy your template. You will no longer have to guess a unique name for your storage account. Instead, the template will create a unique name. You will restrict the values that can be specified for the storage account type to only valid options.

1. To be able to pass the values that you might want to specify during deployment, replace the **parameters** section with the following parameter definitions. Notice the values of **allowedValues** for **storageAccount_accountType**. If you accidentally provide an invalid value, that error is recognized before the deployment starts. Also, notice that you are providing only a prefix for the storage account name, and the prefix is limited to 11 characters. When you limit the prefix to 11 characters, you ensure that the complete name will not exceed the maximum number of characters for a storage account. The prefix enables you to apply a naming convention to your storage accounts. You will see how to create a unique name in the next step.

        "parameters": {
          "storageAccount_prefix": {
            "type": "string",
            "maxLength": 11
          },
          "storageAccount_accountType": {
            "defaultValue": "Standard_RAGRS",
            "type": "string",
            "allowedValues": [
              "Standard_LRS",
              "Standard_ZRS",
              "Standard_GRS",
              "Standard_RAGRS",
              "Premium_LRS"
            ]
          },
          "virtualNetwork_name": {
            "type": "string"
          },
          "addressPrefix": {
            "defaultValue": "10.0.0.0/16",
            "type": "string"
          },
          "subnetName": {
            "defaultValue": "subnet-1",
            "type": "string"
          },
          "subnetAddressPrefix": {
            "defaultValue": "10.0.0.0/24",
            "type": "string"
          }
        },

2. The **variables** section of your template is currently empty. Replace this section with the following code. In the **variables** section, you, as the template author, can create values that simplify the syntax for the rest of your template. The  **storageAccount_name** variable concatenates the prefix from the parameter to a unique string that is generated based on the identifier of the resource group.

        "variables": {
          "storageAccount_name": "[concat(parameters('storageAccount_prefix'), uniqueString(resourceGroup().id))]"
        },

3. To use the parameters and variable in the resource definitions, replace the **resources** section with the following definitions. Notice that very little has actually changed in the resource definitions other than the value that's assigned to the resource property. The properties are exactly the same as the properties from the exported template. You are simply assigning properties to parameter values instead of hard-coded values. The location of the resources is set to use the same location as the resource group through the **resourceGroup().location** expression. The variable that you created for the storage account name is referenced through the **variables** expression.

        "resources": [
          {
            "type": "Microsoft.Network/virtualNetworks",
            "name": "[parameters('virtualNetwork_name')]",
            "apiVersion": "2015-06-15",
            "location": "[resourceGroup().location]",
            "properties": {
              "addressSpace": {
                "addressPrefixes": [
                  "[parameters('addressPrefix')]"
                ]
              },
              "subnets": [
                {
                  "name": "[parameters('subnetName')]",
                  "properties": {
                    "addressPrefix": "[parameters('subnetAddressPrefix')]"
                  }
                }
              ]
            },
            "dependsOn": []
          },
          {
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[variables('storageAccount_name')]",
            "apiVersion": "2015-06-15",
            "location": "[resourceGroup().location]",
            "tags": {},
            "properties": {
                "accountType": "[parameters('storageAccount_accountType')]"
            },
            "dependsOn": []
          }
        ]

## Fix the parameters file

The downloaded parameter file no longer matches the parameters in your template. You do not have to use a parameter file, but it can simplify the process when you redeploy an environment. You will use the default values that are defined in the template for many of the parameters so that your parameter file only needs two values.

Replace the contents of the parameters.json file with:

```
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccount_prefix": {
      "value": "storage"
    },
    "virtualNetwork_name": {
      "value": "VNET"
    }
  }
}
```

The updated parameter file provides values only for parameters that do not have a default value. You can provide values for the other parameters when you want a value that is different from the default value.

## Deploy your template

You can use either Azure PowerShell or the Azure command-line-interface (CLI) to deploy the customized template and parameter files. If needed, install either [Azure PowerShell](powershell-install-configure.md) or [Azure CLI](xplat-cli-install.md). You can use the scripts that you downloaded with your template when you exported the original template, or you can write your own script to deploy the template.
Both options are shown in this article.

2. To deploy by using your own script, use one of the following.

     For PowerShell, run:

        # login
        Add-AzureRmAccount

        # create a new resource group
        New-AzureRmResourceGroup -Name ExportGroup -Location "West Europe"

        # deploy the template to the resource group
        New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExportGroup -TemplateFile {path-to-file}\template.json -TemplateParameterFile {path-to-file}\parameters.json

     For Azure CLI, run:

        azure login

        azure group create -n ExportGroup -l "West Europe"

        azure group deployment create -f {path-to-file}\azuredeploy.json -e {path-to-file}\parameters.json -g ExportGroup -n ExampleDeployment

3. If you have downloaded the exported template and scripts, find the **deploy.ps1** file (for PowerShell) or **deploy.sh** file (for Azure CLI).

     For PowerShell, run:

        Get-Item deploy.ps1 | Unblock-File

        .\deploy.ps1

     For Azure CLI, run:

        .\deploy.sh

## Next steps

- The [Resource Manager Template Walkthrough](resource-manager-template-walkthrough.md) builds on what you have learned in this article by creating a template for a more complicated solution. It helps you understand more about the resources that are available and how to determine the values to provide.
- To see how to export a template through PowerShell, see [Using Azure PowerShell with Azure Resource Manager](powershell-azure-resource-manager.md).
- To see how to export a template through Azure CLI, see [Use the Azure CLI for Mac, Linux, and Windows with Azure Resource Manager](xplat-cli-azure-resource-manager.md).
- To learn about how templates are structured, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
