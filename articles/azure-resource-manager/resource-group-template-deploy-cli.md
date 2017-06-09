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
ms.date: 05/15/2017
ms.author: tomfitz

---
# Deploy resources with Resource Manager templates and Azure CLI

This topic explains how to use Azure CLI 2.0 with Resource Manager templates to deploy your resources to Azure. If you are not familiar with the concepts of deploying and managing your Azure solutions, see [Azure Resource Manager overview](resource-group-overview.md).  

The Resource Manager template you deploy can either be a local file on your machine, or an external file that is located in a repository like GitHub. The template you deploy in this article is available in the [Sample template](#sample-template) section, or as a [storage account template in GitHub](https://github.com/Azure/azure-quickstart-templates/blob/master/101-storage-account-create/azuredeploy.json).

[!INCLUDE [sample-cli-install](../../includes/sample-cli-install.md)]

<a id="deploy-local-template" />

## Deploy a template from your local machine

When deploying resources to Azure, you:

1. Log in to your Azure account
2. Create a resource group that serves as the container for the deployed resources. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters. It cannot end in a period.
3. Deploy to the resource group the template that defines the resources to create

A template can include parameters that enable you to customize the deployment. For example, you can provide values that are tailored for a particular environment (such as dev, test, and production). The sample template defines a parameter for the storage account SKU. 

The following example creates a resource group, and deploys a template from your local machine:

```azurecli
az login

az group create --name ExampleGroup --location "Central US"
az group deployment create \
    --name ExampleDeployment \
    --resource-group ExampleGroup \
    --template-file storage.json \
    --parameters "{\"storageAccountType\":{\"value\":\"Standard_GRS\"}}"
```

The deployment can take a few minutes to complete. When it finishes, you see a message that includes the result:

```azurecli
"provisioningState": "Succeeded",
```

## Deploy a template from an external source

Instead of storing Resource Manager templates on your local machine, you may prefer to store them in an external location. You can store templates in a source control repository (such as GitHub). Or, you can store them in an Azure storage account for shared access in your organization.

To deploy an external template, use the **template-uri** parameter. Use the URI in the example to deploy the sample template from GitHub.
   
```azurecli
az group deployment create \
    --name ExampleDeployment \
    --resource-group ExampleGroup \
    --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json" \
    --parameters "{\"storageAccountType\":{\"value\":\"Standard_GRS\"}}"
```

The preceding example requires a publicly accessible URI for the template, which works for most scenarios because your template should not include sensitive data. If you need to specify sensitive data (like an admin password), pass that value as a secure parameter. However, if you do not want your template to be publicly accessible, you can protect it by storing it in a private storage container. For information about deploying a template that requires a shared access signature (SAS) token, see [Deploy private template with SAS token](resource-manager-cli-sas-token.md).

## Parameter files

Rather than passing parameters as inline values in your script, you may find it easier to use a JSON file that contains the parameter values. The parameter file must be in the following format:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
     "storageAccountType": {
         "value": "Standard_GRS"
     }
  }
}
```

Notice that the parameters section includes a parameter name that matches the parameter defined in your template (storageAccountType). The parameter file contains a value for the parameter. This value is automatically passed to the template during deployment. You can create multiple parameter files for different deployment scenarios, and then pass in the appropriate parameter file. 

Copy the preceding example and save it as a file named `storage.parameters.json`.

To pass a local parameter file, use `@` to specify a local file named storage.parameters.json.

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

If no errors are detected, the command returns information about the test deployment. In particular, notice that the **error** value is null.

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
      'storageAccountType' at line '13' and column '20' is not valid. The parameter value is not part of the allowed 
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

[!INCLUDE [resource-manager-deployments](../../includes/resource-manager-deployments.md)]

To use complete mode, use the `mode` parameter:

```azurecli
az group deployment create \
    --name ExampleDeployment \
    --mode Complete \
    --resource-group ExampleGroup \
    --template-file storage.json \
    --parameters "{\"storageAccountType\":{\"value\":\"Standard_GRS\"}}"
```

## Sample template

The following template is used for the examples in this topic. Copy and save it as a file named storage.json. To understand how to create this template, see [Create your first Azure Resource Manager template](resource-manager-create-first-template.md).  

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountType": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_ZRS",
        "Premium_LRS"
      ],
      "metadata": {
        "description": "Storage Account type"
      }
    }
  },
  "variables": {
    "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'standardsa')]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[variables('storageAccountName')]",
      "apiVersion": "2016-01-01",
      "location": "[resourceGroup().location]",
      "sku": {
          "name": "[parameters('storageAccountType')]"
      },
      "kind": "Storage", 
      "properties": {
      }
    }
  ],
  "outputs": {
      "storageAccountName": {
          "type": "string",
          "value": "[variables('storageAccountName')]"
      }
  }
}
```

## Next steps
* The examples in this article deploy resources to a resource group in your default subscription. To use a different subscription, see [Manage multiple Azure subscriptions](/cli/azure/manage-azure-subscriptions-azure-cli).
* For a complete sample script that deploys a template, see [Resource Manager template deployment script](resource-manager-samples-cli-deploy.md).
* To understand how to define parameters in your template, see [Understand the structure and syntax of Azure Resource Manager templates](resource-group-authoring-templates.md).
* For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](resource-manager-common-deployment-errors.md).
* For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](resource-manager-cli-sas-token.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).
