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
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/27/2017
ms.author: tomfitz

---
# Deploy resources with Resource Manager templates and Azure CLI

This topic explains how to use Azure CLI 2.0 with Resource Manager templates to deploy your resources to Azure. The Resource Manager template you deploy can either be a local file on your machine, or an external file that is located in a repository like GitHub.

You can get the template (storage.json) used in these examples from the [Create your first Azure Resource Manager template](resource-manager-create-first-template.md#final-template) article. To use the template with these examples, create a JSON file and add the copied content.

[!INCLUDE [sample-cli-install](../../includes/sample-cli-install.md)]

<a id="deploy-local-template" />

## Deploy a template from your local machine

To quickly get started with deployment, use the following commands to deploy a local template with inline parameters:

```azurecli
az login

az group create --name ExampleGroup --location "Central US"
az group deployment create \
    --name ExampleDeployment \
    --resource-group ExampleGroup \
    --template-file storage.json \
    --parameters "{\"storageNamePrefix\":{\"value\":\"contoso\"},\"storageSKU\":{\"value\":\"Standard_GRS\"}}"
```

The deployment can take a few minutes to complete. When it finishes, you see a message that includes the result:

```azurecli
"provisioningState": "Succeeded",
```

The preceding example created the resource group in your default subscription. To use a different subscription, add the [az account set](/cli/azure/account#set) command after logging in.

## Deploy a template from an external source

Instead of storing Resource Manager templates on your local machine, you may prefer to store them in an external location. You can store templates in a source control repository (such as GitHub). Or, you can store them in an Azure Storage account for shared access in your organization. You can deploy directly from any external source that is accessible by URI. 

To deploy an external template, use the **template-uri** parameter. The template can be at any publicly accessible URI (such as a file in storage account).
   
```azurecli
az group deployment create \
    --name ExampleDeployment \
    --resource-group ExampleGroup \
    --template-uri "https://raw.githubusercontent.com/exampleuser/MyTemplates/master/storage.json" \
    --parameters "{\"storageNamePrefix\":{\"value\":\"contoso\"},\"storageSKU\":{\"value\":\"Standard_GRS\"}}"
```

You can protect your template by requiring a shared access signature (SAS) token for access. For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](resource-manager-cli-sas-token.md).

## Parameter files

The preceding examples show how to pass parameters as inline values during template deployment.  You may find it easier to create a JSON file containing the parameters and use that during deployment. 

The parameter file must be in the following format:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
     "storageNamePrefix": {
         "value": "contoso"
     },
     "storageSKU": {
         "value": "Standard_GRS"
     }
  }
}
```

To pass a local parameter file, use:

```azurecli
az group deployment create \
    --name ExampleDeployment \
    --resource-group ExampleGroup \
    --template-file storage.json \
    --parameters @storage.parameters.json
```

## Test a template deployment

To test your template and parameter values without actually deploying any resources, use [az group deployment validate](/cli/azure/group/deployment#validate). 

```azurecli
az group deployment validate \
    --resource-group ExampleGroup \
    --template-file storage.json \
    --parameters @storage.parameters.json
```

If no errors are detected with the template or the parameters, the command returns information about the test deployment. In particular, notice that the **error** value is null.

```azurecli
{
  "error": null,
  "properties": {
      ...
```

If an error is detected, the command returns an error message. For example, attempting to pass an incorrect value for the storage account SKU, returns the following error:

```azurecli
{
  "error": {
    "code": "InvalidTemplate",
    "details": null,
    "message": "Deployment template validation failed: 'The provided value 'badSKU' for the template parameter 
      'storageSKU' at line '13' and column '20' is not valid. The parameter value is not part of the allowed 
      value(s): 'Standard_LRS,Standard_ZRS,Standard_GRS,Standard_RAGRS,Premium_LRS'.'.",
    "target": null
  },
  "properties": null
}
```

If your template has a syntax error, the command returns an error indicating it could not parse the template. The message indicates the line number and position of the parsing error.

```azurecli
{
  "error": {
    "code": "InvalidTemplate",
    "details": null,
    "message": "Deployment template parse failed: 'After parsing a value an unexpected character was encountered:
      \". Path 'variables', line 31, position 3.'.",
    "target": null
  },
  "properties": null
}
```

## Debug

To see information about the operations for a failed deployment, use:
   
```azurecli
az group deployment operation list --resource-group ExampleGroup --name vmlinux --query "[*].[properties.statusMessage]"
```

For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](resource-manager-common-deployment-errors.md).


## Export Resource Manager template
For an existing resource group (deployed through Azure CLI or one of the other methods like the portal), you can view the Resource Manager template for the resource group. Exporting the template offers two benefits:

1. You can easily automate future deployments of the solution because all the infrastructure is defined in the template.
2. You can become familiar with template syntax by looking at the JavaScript Object Notation (JSON) that represents your solution.

To view the template for a resource group, run the [az group export](/cli/azure/group#export) command.

```azurecli
az group export --name ExampleGroup
```

For more information, see [Export an Azure Resource Manager template from existing resources](resource-manager-export-template.md).


[!INCLUDE [resource-manager-deployments](../../includes/resource-manager-deployments.md)]

To use complete mode, use the `mode` parameter:

```azurecli
az group deployment create \
    --name ExampleDeployment \
    --mode Complete \
    --resource-group ExampleGroup \
    --template-file storage.json \
    --parameters "{\"storageNamePrefix\":{\"value\":\"contoso\"},\"storageSKU\":{\"value\":\"Standard_GRS\"}}"
```


## Next steps
* For a complete sample script that deploys a template, see [Resource Manager template deployment script](resource-manager-samples-cli-deploy.md).
* To define parameters in template, see [Authoring templates](resource-group-authoring-templates.md#parameters).
* For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](resource-manager-common-deployment-errors.md).
* For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](resource-manager-cli-sas-token.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).
