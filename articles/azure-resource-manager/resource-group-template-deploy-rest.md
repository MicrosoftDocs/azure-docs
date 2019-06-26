---
title: Deploy resources with REST API and template | Microsoft Docs
description: Use Azure Resource Manager and Resource Manager REST API to deploy resources to Azure. The resources are defined in a Resource Manager template.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 06/04/2019
ms.author: tomfitz
---
# Deploy resources with Resource Manager templates and Resource Manager REST API

This article explains how to use the Resource Manager REST API with Resource Manager templates to deploy your resources to Azure.  

You can either include your template in the request body or link to a file. When using a file, it can be a local file or an external file that is available through a URI. When your template is in a storage account, you can restrict access to the template and provide a shared access signature (SAS) token during deployment.

## Deployment scope

You can target your deployment to a management group, an Azure subscription, or a resource group. In most cases, you'll target deployments to a resource group. Use management group or subscription deployments to apply policies and role assignments across the specified scope. You also use subscription deployments to create a resource group and deploy resources to it. Depending on the scope of the deployment, you use different commands.

To deploy to a **resource group**, use [Deployments - Create](/rest/api/resources/deployments/createorupdate). The request is sent to:

```HTTP
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2019-05-01
```

To deploy to a **subscription**, use [Deployments - Create At Subscription Scope](/rest/api/resources/deployments/createorupdateatsubscriptionscope). The request is sent to:

```HTTP
PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2019-05-01
```

To deploy to a **management group**, use [Deployments - Create At Management Group Scope](/rest/api/resources/deployments/createorupdateatmanagementgroupscope). The request is sent to:

```HTTP
PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{groupId}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2019-05-01
```

The examples in this article use resource group deployments. For more information about subscription deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

## Deploy with the REST API

1. Set [common parameters and headers](/rest/api/azure/), including authentication tokens.

1. If you don't have an existing resource group, create a resource group. Provide your subscription ID, the name of the new resource group, and location that you need for your solution. For more information, see [Create a resource group](/rest/api/resources/resourcegroups/createorupdate).

   ```HTTP
   PUT https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>?api-version=2019-05-01
   ```

   With a request body like:

   ```json
   {
    "location": "West US",
    "tags": {
      "tagname1": "tagvalue1"
    }
   }
   ```

1. Validate your deployment before executing it by running the [Validate a template deployment](/rest/api/resources/deployments/validate) operation. When testing the deployment, provide parameters exactly as you would when executing the deployment (shown in the next step).

1. To deploy a template, provide your subscription ID, the name of the resource group, the name of the deployment in the request URI. 

   ```HTTP
   PUT https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>/providers/Microsoft.Resources/deployments/<YourDeploymentName>?api-version=2019-05-01
   ```

   In the request body, provide a link to your template and parameter file. Notice the **mode** is set to **Incremental**. To run a complete deployment, set **mode** to **Complete**. Be careful when using the complete mode as you can inadvertently delete resources that aren't in your template.

   ```json
   {
    "properties": {
      "templateLink": {
        "uri": "http://mystorageaccount.blob.core.windows.net/templates/template.json",
        "contentVersion": "1.0.0.0"
      },
      "parametersLink": {
        "uri": "http://mystorageaccount.blob.core.windows.net/templates/parameters.json",
        "contentVersion": "1.0.0.0"
      },
      "mode": "Incremental"
    }
   }
   ```

    If you want to log response content, request content, or both, include **debugSetting** in the request.

   ```json
   {
    "properties": {
      "templateLink": {
        "uri": "http://mystorageaccount.blob.core.windows.net/templates/template.json",
        "contentVersion": "1.0.0.0"
      },
      "parametersLink": {
        "uri": "http://mystorageaccount.blob.core.windows.net/templates/parameters.json",
        "contentVersion": "1.0.0.0"
      },
      "mode": "Incremental",
      "debugSetting": {
        "detailLevel": "requestContent, responseContent"
      }
    }
   }
   ```

    You can set up your storage account to use a shared access signature (SAS) token. For more information, see [Delegating Access with a Shared Access Signature](https://docs.microsoft.com/rest/api/storageservices/delegating-access-with-a-shared-access-signature).

1. Instead of linking to files for the template and parameters, you can include them in the request body. The following example shows the request body with the template and parameter inline:

   ```json
   {
	  "properties": {
      "mode": "Incremental",
      "template": {
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
          "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'standardsa')]"
        },
        "resources": [
          {
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[variables('storageAccountName')]",
            "apiVersion": "2018-02-01",
            "location": "[parameters('location')]",
            "sku": {
              "name": "[parameters('storageAccountType')]"
            },
            "kind": "StorageV2",
            "properties": {}
          }
        ],
        "outputs": {
          "storageAccountName": {
            "type": "string",
            "value": "[variables('storageAccountName')]"
          }
        }
      },
      "parameters": {
        "location": {
          "value": "eastus2"
        }
      }
    }
   }
   ```

1. To get the status of the template deployment, use [Deployments - Get](/rest/api/resources/deployments/get).

   ```HTTP
   GET https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>/providers/Microsoft.Resources/deployments/<YourDeploymentName>?api-version=2018-05-01
   ```

## Redeploy when deployment fails

This feature is also known as *Rollback on error*. When a deployment fails, you can automatically redeploy an earlier, successful deployment from your deployment history. To specify redeployment, use the `onErrorDeployment` property in the request body. This functionality is useful if you've got a known good state for your infrastructure deployment and want to revert to this state. There are a number of caveats and restrictions:

- The redeployment is run exactly as it was run previously with the same parameters. You cannot change the parameters.
- The previous deployment is run using the [complete mode](./deployment-modes.md#complete-mode). Any resources not included in the previous deployment are deleted, and any resource configurations are set to their previous state. Make sure you fully understand the [deployment modes](./deployment-modes.md).
- The redeployment only affects the resources, any data changes aren't affected.
- This feature is only supported on Resource Group deployments, not subscription level deployments. For more information about subscription level deployment, see [Create resource groups and resources at the subscription level](./deploy-to-subscription.md).

To use this option, your deployments must have unique names so they can be identified in the history. If you don't have unique names, the current failed deployment might overwrite the previously successful deployment in the history. You can only use this option with root level deployments. Deployments from a nested template aren't available for redeployment.

To redeploy the last successful deployment if the current deployment fails, use:

```json
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
    },
    "onErrorDeployment": {
      "type": "LastSuccessful",
    }
  }
}
```

To redeploy a specific deployment if the current deployment fails, use:

```json
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
    },
    "onErrorDeployment": {
      "type": "SpecificDeployment",
      "deploymentName": "<deploymentname>"
    }
  }
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

- To specify how to handle resources that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
- To learn about handling asynchronous REST operations, see [Track asynchronous Azure operations](resource-manager-async-operations.md).
- To learn more about templates, see [Understand the structure and syntax of Azure Resource Manager templates](resource-group-authoring-templates.md).

