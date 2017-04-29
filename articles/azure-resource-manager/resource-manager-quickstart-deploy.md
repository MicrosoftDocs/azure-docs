---
title: Deploy resources to Azure | Microsoft Docs
description: Use Azure PowerShell or Azure CLI to deploy resources to Azure. The resources are defined in a Resource Manager template.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/16/2017
ms.author: tomfitz

---
# Deploy resources to Azure

This topic shows how to deploy resources to your Azure subscription. You can use either Azure PowerShell or Azure CLI to deploy a Resource Manager template that defines the infrastructure for your solution.

For an introduction to concepts of Resource Manager, see [Azure Resource Manager overview](resource-group-overview.md).

## Steps for deployment

This topic assumes you are deploying the [example storage template](#example-storage-template) in this topic. You can use a different template, but the parameters you pass are different than what is shown in this topic.

After creating a template, the general steps for deploying your template are:

1. Log in to your account
2. Select the subscription to use (only necessary if you have multiple subscriptions, and you want to use one that is not the default subscription)
3. Create a resource group
4. Deploy the template
5. Check your deployment status

The following sections show how to perform those steps with [PowerShell](#powershell) or [Azure CLI](#azure-cli).

## PowerShell

1. To install Azure PowerShell, see [Get started with Azure PowerShell cmdlets](/powershell/azure/overview).

2. To quickly get started with deployment, use the following cmdlets:

  ```powershell
  Login-AzureRmAccount
  Set-AzureRmContext -SubscriptionID {subscription-id}

  New-AzureRmResourceGroup -Name ExampleGroup -Location "Central US"
  New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleGroup -TemplateFile c:\MyTemplates\azuredeploy.json 
  ```

  The `Set-AzureRmContext` cmdlet is only needed if you want to use a subscription other than your default subscription. To see all your subscriptions and their IDs, use:

  ```powershell
  Get-AzureRmSubscription
  ```

3. The deployment can take a few minutes to complete. When it finishes, you see a message similar to:

  ```powershell
  DeploymentName          : ExampleDeployment
  CorrelationId           : 07b3b233-8367-4a0b-b9bc-7aa189065665
  ResourceGroupName       : ExampleGroup
  ProvisioningState       : Succeeded
  ...
  ```

4. To see that your resource group and storage account were deployed to your subscription, use:

  ```powershell
  Get-AzureRmResourceGroup -Name ExampleGroup
  Find-AzureRmResource -ResourceGroupNameEquals ExampleGroup
  ```

5. You can specify template parameters as PowerShell parameters when deploying a template. The earlier example did not include any template parameters, so the default values in the template were used. To deploy another storage account, and provide parameter values for the storage name prefix and the storage account SKU, use:

  ```powershell
  New-AzureRmResourceGroupDeployment -Name ExampleDeployment2 -ResourceGroupName ExampleGroup -TemplateFile c:\MyTemplates\azuredeploy.json -storageNamePrefix "contoso" -storageSKU "Standard_GRS"
  ```

  You now have two storage accounts in your resource group. 

## Azure CLI

1. To install Azure CLI, see [Install Azure CLI 2.0](/cli/azure/install-az-cli2).

2. To quickly get started with deployment, use the following commands:

  ```azurecli
  az login
  az account set --subscription {subscription-id}

  az group create --name ExampleGroup --location "Central US"
  az group deployment create --name ExampleDeployment --resource-group ExampleGroup --template-file c:\MyTemplates\azuredeploy.json
  ```

  The `az account set` command is only needed if you want to use a subscription other than your default subscription. To see all your subscriptions and their IDs, use:

  ```azurecli
  az account list
  ```

3. The deployment can take a few minutes to complete. When it finishes, you see a message similar to:

  ```azurecli
  "provisioningState": "Succeeded",
  ```

4. To see that your resource group and storage account were deployed to your subscription, use:

  ```azurecli
  az group show --name ExampleGroup
  az resource list --resource-group ExampleGroup
  ```

5. You can specify template parameters as PowerShell parameters when deploying a template. The earlier example did not include any template parameters, so the default values in the template were used. To deploy another storage account, and provide parameter values for the storage name prefix and the storage account SKU, use:

  ```azurecli
  az group deployment create --name ExampleDeployment2 --resource-group ExampleGroup --template-file c:\MyTemplates\azuredeploy.json --parameters '{"storageNamePrefix":{"value":"contoso"},"storageSKU":{"value":"Standard_GRS"}}'
  ```

  You now have two storage accounts in your resource group. 

## Example storage template

Use the following example template to deploy a storage account to your subscription:

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageNamePrefix": {
      "type": "string",
      "maxLength": 11,
      "defaultValue": "storage",
      "metadata": {
        "description": "The value to use for starting the storage account name."
      }
    },
    "storageSKU": {
      "type": "string",
      "allowedValues": [
        "Standard_LRS",
        "Standard_ZRS",
        "Standard_GRS",
        "Standard_RAGRS",
        "Premium_LRS"
      ],
      "defaultValue": "Standard_LRS",
      "metadata": {
        "description": "The type of replication to use for the storage account."
      }
    }
  },
  "variables": {
    "storageName": "[concat(parameters('storageNamePrefix'), uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "name": "[variables('storageName')]",
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2016-05-01",
      "sku": {
        "name": "[parameters('storageSKU')]"
      },
      "kind": "Storage",
      "location": "[resourceGroup().location]",
      "tags": {},
      "properties": {
      }
    }
  ],
  "outputs": {  }
}
```

## Next steps

* For detailed information about using PowerShell to deploy templates, see [Deploy resources with Resource Manager templates and Azure PowerShell](/azure/azure-resource-manager/resource-group-template-deploy).
* For detailed information about using Azure CLI to deploy templates, see [Deploy resources with Resource Manager templates and Azure CLI](/azure/azure-resource-manager/resource-group-template-deploy-cli).



