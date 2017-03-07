---
title: Deploy resources with Azure CLI and template | Microsoft Docs
description: Use Azure Resource Manager and Azure CLI to deploy a resources to Azure. The resources are defined in a Resource Manager template.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 493b7932-8d1e-4499-912c-26098282ec95
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/06/2017
ms.author: tomfitz

---
# Deploy resources with Resource Manager templates and Azure CLI
> [!div class="op_single_selector"]
> * [PowerShell](resource-group-template-deploy.md)
> * [Azure CLI](resource-group-template-deploy-cli.md)
> * [Portal](resource-group-template-deploy-portal.md)
> * [REST API](resource-group-template-deploy-rest.md)
> 
> 

This topic explains how to use [Azure CLI 2.0](/cli/azure/install-az-cli2) with Resource Manager templates to deploy your resources to Azure.  Your template can be either a local file or an external file that is available through a URI. When your template resides in a storage account, you can restrict access to the template and provide a shared access signature (SAS) token during deployment.

## Deploy

1. To quickly get started with deployment, use the following commands:

  ```azurecli
  az login
  az account set --subscription {subscription-id}

  az group create --name ExampleGroup --location "Central US"
  az group deployment create --name ExampleDeployment --resource-group ExampleGroup --template-file c:\MyTemplates\azuredeploy.json --parameters '{"storageNamePrefix":{"value":"contoso"},"storageSKU":{"value":"Standard_GRS"}}'
  ```

  The `az account set` command is only needed if you want to use a subscription other than your default subscription. To see all your subscriptions and their IDs, use:

  ```azurecli
  az account list
  ```
2. The deployment can take a few minutes to complete. When it finishes, you see a message similar to:

  ```azurecli
  "provisioningState": "Succeeded",
  ```

3. The first example used a local template. To deploy an external template, use the **template-uri** parameter:
   
   ```azurecli
   az group deployment create --name ExampleDeployment --resource-group ExampleGroup --template-uri "https://raw.githubusercontent.com/exampleuser/MyTemplates/master/example.json" --parameters '{"storageNamePrefix":{"value":"contoso"},"storageSKU":{"value":"Standard_GRS"}}'
   ```

4. To first example used inline parameter values. To use a parameter file, use:

   ```azurecli
   az group deployment create --name ExampleDeployment --resource-group ExampleGroup --template-file c:\MyTemplates\azuredeploy.json --parameters 
   ```


[!INCLUDE [resource-manager-deployments](../../includes/resource-manager-deployments.md)]

## Deploy template from storage with SAS token
You can add your templates to a storage account and link to them during deployment with a SAS token.

> [!IMPORTANT]
> By following the steps below, the blob containing the template is accessible to only the account owner. However, when you create a SAS token for the blob, the blob is accessible to anyone with that URI. If another user intercepts the URI, that user is able to access the template. Using a SAS token is a good way of limiting access to your templates, but you should not include sensitive data like passwords directly in the template.
> 
> 

### Add private template to storage account
The following steps set up a storage account for templates:

1. Create a resource group.
   
   ```
   azure group create -n "ManageGroup" -l "westus"
   ```
2. Create a storage account. The storage account name must be unique across Azure, so provide your own name for the account.
   
   ```
   azure storage account create -g ManageGroup -l "westus" --sku-name LRS --kind Storage storagecontosotemplates
   ```
3. Set variables for the storage account and key.
   
   ```
   export AZURE_STORAGE_ACCOUNT=storagecontosotemplates
   export AZURE_STORAGE_ACCESS_KEY={storage_account_key}
   ```
4. Create a container. The permission is set to **Off** which means the container is only accessible to the owner.
   
   ```
   azure storage container create --container templates -p Off 
   ```
5. Add your template to the container.
   
   ```
   azure storage blob upload --container templates -f c:\MyTemplates\azuredeploy.json
   ```

### Provide SAS token during deployment
To deploy a private template in a storage account, retrieve a SAS token and include it in the URI for the template.

1. Create a SAS token with read permissions and an expiry time to limit access. Set the expiry time to allow enough time to complete the deployment. Retrieve the full URI of the template including the SAS token.
   
   ```
   expiretime=$(date -I'minutes' --date "+30 minutes")
   fullurl=$(azure storage blob sas create --container templates --blob azuredeploy.json --permissions r --expiry $expiretimetime --json  | jq ".url")
   ```
2. Deploy the template by providing the URI that includes the SAS token.
   
   ```
   azure group deployment create --template-uri $fullurl -g ExampleResourceGroup
   ```

For an example of using a SAS token with linked templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).

## Parameters

You have the following options for providing parameter values: 
   
- Use inline parameters. Each parameter is in the format: `"ParameterName": { "value": "ParameterValue" }`. The following example shows the parameters with escape characters.

   ```   
   azure group deployment create -f <PathToTemplate> -p "{\"ParameterName\":{\"value\":\"ParameterValue\"}}" -g ExampleResourceGroup -n ExampleDeployment
   ```
- Use a parameter file.

  ```    
  azure group deployment create -f "c:\MyTemplates\example.json" -e "c:\MyTemplates\example.params.json" -g ExampleResourceGroup -n ExampleDeployment
  ```
      

[!INCLUDE [resource-manager-parameter-file](../../includes/resource-manager-parameter-file.md)]

## Debug

7. If you want to log additional information about the deployment that may help you troubleshoot any deployment errors, use the **debug-setting** parameter. You can specify that request content, response content, or both be logged with the deployment operation.
   
   ```
   azure group deployment create --debug-setting All -f <PathToTemplate> -e <PathToParameterFile> -g examplegroup -n exampleDeployment
   ```

## Next steps
* For an example of deploying resources through the .NET client library, see [Deploy resources using .NET libraries and a template](../virtual-machines/virtual-machines-windows-csharp-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
* To define parameters in template, see [Authoring templates](resource-group-authoring-templates.md#parameters).
* For guidance on deploying your solution to different environments, see [Development and test environments in Microsoft Azure](solution-dev-test-environments.md).
* For details about using a KeyVault reference to pass secure values, see [Pass secure values during deployment](resource-manager-keyvault-parameter.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).
* For a four part series about automating deployment, see [Automating application deployments to Azure Virtual Machines](../virtual-machines/virtual-machines-windows-dotnet-core-1-landing.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). This series covers application architecture, access and security, availability and scale, and application deployment.

