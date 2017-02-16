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

This topic explains how to deploy resources to your Azure subscription. It uses a Resource Manager template, and either Azure PowerShell or Azure CLI.

For an introduction to concepts of Resource Manager, see [Azure Resource Manager overview](resource-group-overview.md).

## Steps for deployment

This topic assumes you are deploying the template from the [Create your first Azure Resource Manager template](/azure/templates/) topic. You can use a different template, but the parameters you pass are different than what is shown in this topic.

After creating your template, you are ready to deploy it. Whether using PowerShell or Azure CLI, you perform the following steps:

1. Log in to your account
2. Select the subscription to use (only necessary if you have multiple subscriptions, and you want to use one that is not the default subscription)
3. Create a resource group
4. Deploy the template
5. Check your deployment status

## PowerShell

1. To install Azure PowerShell, see [Get started with Azure PowerShell cmdlets](/powershell/azureps-cmdlets-docs).

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

## Azure CLI 2.0 (Preview)

1. To install Azure CLI, see [Install Azure CLI 2.0 (Preview)](/cli/azure/install-az-cli2).

2. To quickly get started with deployment, use the following commands:

  ```azurecli
  az login
  az account set --subscription {subscription-id}

  az group create --name ExampleGroup --location "Central US"
  az group deployment create --name ExampleDeployment --resource-group ExampleGroup --template-file c:\MyTemplates\azuredeploy.json
  ```

  The `az account set` command is only needed if you want to use a subscription other than your default subscription. To see all your subscriptions and their IDs, use:

  ```powershell
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

## Next steps

* For more detailed information about deploying templates, see [Deploy resources with Resource Manager templates and Azure PowerShell](/azure/azure-resource-manager/resource-group-template-deploy) or [Deploy resources with Resource Manager templates and Azure CLI](/azure/azure-resource-manager/resource-group-template-deploy-cli).



