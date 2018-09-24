---
title: Deploy resources with REST API and template | Microsoft Docs
description: Use Azure Resource Manager and Resource Manager REST API to deploy a resources to Azure. The resources are defined in a Resource Manager template.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 1d8fbd4c-78b0-425b-ba76-f2b7fd260b45
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/01/2018
ms.author: tomfitz

---
# Deploy resources with Resource Manager templates and Resource Manager REST API

This article explains how to use the Resource Manager REST API with Resource Manager templates to deploy your resources to Azure.  

> [!TIP]
> For help with debugging an error during deployment, see:
> 
> * [View deployment operations](resource-manager-deployment-operations.md) to learn about getting information that helps you troubleshoot your error
> * [Troubleshoot common errors when deploying resources to Azure with Azure Resource Manager](resource-manager-common-deployment-errors.md) to learn how to resolve common deployment errors
> 
> 

Your template can be either a local file or an external file that is available through a URI. When your template resides in a storage account, you can restrict access to the template and provide a shared access signature (SAS) token during deployment.

## Deploy with the REST API
1. Set [common parameters and headers](/rest/api/azure/), including authentication tokens.

2. If you do not have an existing resource group, create a resource group. Provide your subscription ID, the name of the new resource group, and location that you need for your solution. For more information, see [Create a resource group](/rest/api/resources/resourcegroups/createorupdate).

  ```HTTP
  PUT https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>?api-version=2015-01-01
  {
    "location": "West US",
    "tags": {
      "tagname1": "tagvalue1"
    }
  }
  ```

3. Validate your deployment before executing it by running the [Validate a template deployment](/rest/api/resources/deployments/validate) operation. When testing the deployment, provide parameters exactly as you would when executing the deployment (shown in the next step).

4. Create a deployment. Provide your subscription ID, the name of the resource group, the name of the deployment, and a link to your template. For information about the template file, see [Parameter file](#parameter-file). For more information about the REST API to create a resource group, see [Create a template deployment](https://docs.microsoft.com/rest/api/resources/deployments#Deployments_CreateOrUpdate). Notice the **mode** is set to **Incremental**. To run a complete deployment, set **mode** to **Complete**. Be careful when using the complete mode as you can inadvertently delete resources that are not in your template.

  ```HTTP
  PUT https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>/providers/Microsoft.Resources/deployments/<YourDeploymentName>?api-version=2015-01-01
  {
    "properties": {
      "templateLink": {
        "uri": "http://mystorageaccount.blob.core.windows.net/templates/template.json",
        "contentVersion": "1.0.0.0"
      },
      "mode": "Incremental",
      "parametersLink": {
        "uri": "http://mystorageaccount.blob.core.windows.net/templates/parameters.json",
        "contentVersion": "1.0.0.0"
      }
    }
  }
  ```

    If you want to log response content, request content, or both, include **debugSetting** in the request.

  ```HTTP
  "debugSetting": {
    "detailLevel": "requestContent, responseContent"
  }
  ```

    You can set up your storage account to use a shared access signature (SAS) token. For more information, see [Delegating Access with a Shared Access Signature](https://docs.microsoft.com/rest/api/storageservices/delegating-access-with-a-shared-access-signature).

5. Get the status of the template deployment. For more information, see [Get information about a template deployment](/rest/api/resources/deployments/get).

  ```HTTP
  GET https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>/providers/Microsoft.Resources/deployments/<YourDeploymentName>?api-version=2015-01-01
  ```

## Redeploy when deployment fails

For deployments that fail, you can specify that an earlier deployment from your deployment history is automatically redeployed. To use this option, your deployments must have unique names so they can be identified in the history. If you don't have unique names, the current failed deployment might overwrite the previously successful deployment in the history. You can only use this option with root level deployments. Deployments from a nested template aren't available for redeployment.

To redeploy the last successful deployment if the current deployment fails, use:

```HTTP
"onErrorDeployment": {
  "type": "LastSuccessful",
},
```

To redeploy a specific deployment if the current deployment fails, use:

```HTTP
"onErrorDeployment": {
  "type": "SpecificDeployment",
  "deploymentName": "<deploymentname>"
}
```

The specified deployment must have succeeded.

## Parameter file

If you use a parameter file to pass parameter values during deployment, you need to create a JSON file with a format similar to the following example:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "webSiteName": {
            "value": "ExampleSite"
        },
        "webSiteHostingPlanName": {
            "value": "DefaultPlan"
        },
        "webSiteLocation": {
            "value": "West US"
        },
        "adminPassword": {
            "reference": {
               "keyVault": {
                  "id": "/subscriptions/{guid}/resourceGroups/{group-name}/providers/Microsoft.KeyVault/vaults/{vault-name}"
               }, 
               "secretName": "sqlAdminPassword" 
            }   
        }
   }
}
```

The size of the parameter file can't be more than 64 KB.

If you need to provide a sensitive value for a parameter (such as a password), add that value to a key vault. Retrieve the key vault during deployment as shown in the previous example. For more information, see [Pass secure values during deployment](resource-manager-keyvault-parameter.md). 

## Next steps
* To specify how to handle resource that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
* To learn about handling asynchronous REST operations, see [Track asynchronous Azure operations](resource-manager-async-operations.md).
* For an example of deploying resources through the .NET client library, see [Deploy resources using .NET libraries and a template](../virtual-machines/windows/csharp-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
* To define parameters in template, see [Authoring templates](resource-group-authoring-templates.md#parameters).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](/azure/architecture/cloud-adoption-guide/subscription-governance).

