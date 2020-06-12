---
title: Deploy resources with REST API and template
description: Use Azure Resource Manager and Resource Manager REST API to deploy resources to Azure. The resources are defined in a Resource Manager template.
ms.topic: conceptual
ms.date: 06/04/2020
---
# Deploy resources with ARM templates and Resource Manager REST API

This article explains how to use the Resource Manager REST API with Azure Resource Manager (ARM) templates to deploy your resources to Azure.

You can either include your template in the request body or link to a file. When using a file, it can be a local file or an external file that is available through a URI. When your template is in a storage account, you can restrict access to the template and provide a shared access signature (SAS) token during deployment.

## Deployment scope

You can target your deployment to a management group, an Azure subscription, or a resource group. In most cases, you'll target deployments to a resource group. Use management group or subscription deployments to apply policies and role assignments across the specified scope. You also use subscription deployments to create a resource group and deploy resources to it. Depending on the scope of the deployment, you use different commands.

* To deploy to a **resource group**, use [Deployments - Create](/rest/api/resources/deployments/createorupdate). The request is sent to:

  ```HTTP
  PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2019-10-01
  ```

* To deploy to a **subscription**, use [Deployments - Create At Subscription Scope](/rest/api/resources/deployments/createorupdateatsubscriptionscope). The request is sent to:

  ```HTTP
  PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2019-10-01
  ```

  For more information about subscription level deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

* To deploy to a **management group**, use [Deployments - Create At Management Group Scope](/rest/api/resources/deployments/createorupdateatmanagementgroupscope). The request is sent to:

  ```HTTP
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{groupId}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2019-10-01
  ```

  For more information about management group level deployments, see [Create resources at the management group level](deploy-to-management-group.md).

* To deploy to a **tenant**, use [Deployments - Create Or Update At Tenant Scope](/rest/api/resources/deployments/createorupdateattenantscope). The request is sent to:

  ```HTTP
  PUT https://management.azure.com/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2019-10-01
  ```

  For more information about tenant level deployments, see [Create resources at the tenant level](deploy-to-tenant.md).

The examples in this article use resource group deployments.

## Deploy with the REST API

1. Set [common parameters and headers](/rest/api/azure/), including authentication tokens.

1. If you don't have an existing resource group, create a resource group. Provide your subscription ID, the name of the new resource group, and location that you need for your solution. For more information, see [Create a resource group](/rest/api/resources/resourcegroups/createorupdate).

   ```HTTP
   PUT https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>?api-version=2019-10-01
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

1. Before deploying your template, you can preview the changes the template will make to your environment. Use the [what-if operation](template-deploy-what-if.md) to verify that the template makes the changes that you expect. What-if also validates the template for errors.

1. To deploy a template, provide your subscription ID, the name of the resource group, the name of the deployment in the request URI.

   ```HTTP
   PUT https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>/providers/Microsoft.Resources/deployments/<YourDeploymentName>?api-version=2019-10-01
   ```

   In the request body, provide a link to your template and parameter file. For more information about the parameter file, see [Create Resource Manager parameter file](parameter-files.md).

   Notice the **mode** is set to **Incremental**. To run a complete deployment, set **mode** to **Complete**. Be careful when using the complete mode as you can inadvertently delete resources that aren't in your template.

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

    You can set up your storage account to use a shared access signature (SAS) token. For more information, see [Delegating Access with a Shared Access Signature](/rest/api/storageservices/delegating-access-with-a-shared-access-signature).

    If you need to provide a sensitive value for a parameter (such as a password), add that value to a key vault. Retrieve the key vault during deployment as shown in the previous example. For more information, see [Pass secure values during deployment](key-vault-parameter.md).

1. Instead of linking to files for the template and parameters, you can include them in the request body. The following example shows the request body with the template and parameter inline:

   ```json
   {
      "properties": {
      "mode": "Incremental",
      "template": {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
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
            "apiVersion": "2018-02-01",
            "name": "[variables('storageAccountName')]",
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
   GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2019-10-01
   ```

## Next steps

- To roll back to a successful deployment when you get an error, see [Rollback on error to successful deployment](rollback-on-error.md).
- To specify how to handle resources that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
- To learn about handling asynchronous REST operations, see [Track asynchronous Azure operations](../management/async-operations.md).
- To learn more about templates, see [Understand the structure and syntax of ARM templates](template-syntax.md).

