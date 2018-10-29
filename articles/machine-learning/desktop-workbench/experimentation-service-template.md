---
title: Create Azure Machine Learning Experimentation with an Azure Resource Manager template | Microsoft Docs
description: This article provides an example to create an Azure Machine Learning Experimentation account using an Azure Resource Manager template.
services: machine-learning
author: hning86
ms.author: haining
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 11/14/2017

ROBOTS: NOINDEX
---
# Configure the Azure Machine Learning Experimentation Service

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]

## Overview
Azure Machine Learning Experimentation Service account, workspace, and project are Azure Resources. As such, they can be deployed using Resources Manager templates. Resource Manager templates are JSON files that define the resources you need to deploy for your solution. To understand the concepts associated with deploying and managing your Azure solutions, see [Azure Resource Manager overview](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).

## Deploy a template
Deploying a template requires only a couple of steps in the Azure Command Line Interface or in the Azure portal.

### Deploy a template from the command line
Using the command-line interface, a single command can deploy a template to an existing resource group.
See following for information about creating a template.

```sh
# Login and validate your are in the right subscription context
az login

# Create a new resource group (you can use an existing one)
az group create --name <resource group name> --location <supported Azure region>
az group deployment create -n testdeploy -g <resource group name> --template-file <template-file.json> --parameters <parameters.json>
```

### Deploy a template from the Azure portal
If you prefer, you can also use Azure portal to create and deploy a template. Do as follows:

1. Navigate to [Azure portal](https://portal.azure.com).
2. Select **All Services** and search for "templates."
3. Select **Templates**.
4. Click on **+ Add** and copy your template information. 
5. Select the template created in step #4 and click **Deploy**.


## Create a template from an existing Azure resource in the Azure portal
If you already have an Azure Machine experimentation account available, in [Azure portal](https://portal.azure.com), you can generate a template from that resource. 

1. Navigate to an Azure Experimentation Account in [Azure portal](https://portal.azure.com).
2. Under **settings**, click on **Automation script**.
3. Download the template. 

Alternatively, you can manually edit the template files. See following for an example of a template and parameters files. 

### Template file example
Create a file called "template-file.json" with below content. 

```json
{
    "contentVersion": "1.0.0.0",
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "parameters": {
        "accountName": {
            "type": "string",
            "metadata": {
                "description": "Name of the machine learning experimentation team account"
            }
        },
        "location": {
            "type": "string",
            "metadata": {
                "description": "Location of the machine learning experimentation account and other dependent resources."
            }
        },
        "storageAccountSku": {
            "type": "string",
            "defaultValue": "Standard_LRS",
            "metadata": {
                "description": "Sku of the storage account"
            }
        }
    },
    "variables": {
        "mlexpVersion": "2017-05-01-preview",
        "stgResourceId": "[resourceId('Microsoft.Storage/storageAccounts', parameters('accountName'))]"
    },
    "resources": [
        {
            "name": "[parameters('accountName')]",
            "type": "Microsoft.Storage/storageAccounts",
            "location": "[parameters('location')]",
            "apiVersion": "2016-12-01",
            "tags": {
                "mlteamAccount": "[parameters('accountName')]"
            },
            "sku": {
                "name": "[parameters('storageAccountSku')]"
            },
            "kind": "Storage",
            "properties": {
                "encryption": {
                    "services": {
                        "blob": {
                            "enabled": true
                        }
                    },
                    "keySource": "Microsoft.Storage"
                }
            }
        },
        {
            "apiVersion": "[variables('mlexpVersion')]",
            "type": "Microsoft.MachineLearningExperimentation/accounts",
            "name": "[parameters('accountName')]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[resourceId('Microsoft.Storage/storageAccounts', parameters('accountName'))]"
            ],
            "properties": {
                "storageAccount": {
                    "storageAccountId": "[variables('stgResourceId')]",
                    "accessKey": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('accountName')), '2016-12-01').keys[0].value]"
                }
            }
        }
    ]
}
```

### Parameters 
Create a file with below content and save it as <parameters.json>. 

There are three values that you can change. 
* AccountName: The name of the experimentation account.
* Location: One of the supported Azure regions.
* Storage Account SKU: Azure ML only supports standard storage, not premium. For more information about storage, see [storage introduction](https://docs.microsoft.com/azure/storage/common/storage-introduction). 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
     "accountName": {
         "value": "MyExperimentationAccount"
     },
     "location": {
         "value": "eastus2"
     },
     "storageAccountSku": {
         "value": "Standard_LRS"
     }
  }
}
```

## Next steps
* [Create and Install Azure Machine Learning](quickstart-installation.md)
