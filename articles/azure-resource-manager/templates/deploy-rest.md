---
title: Deploy resources with REST API and template
description: Use Azure Resource Manager and Resource Manager REST API to deploy resources to Azure. The resources are defined in a Resource Manager template.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 03/20/2024
---

# Deploy resources with ARM templates and Azure Resource Manager REST API

This article explains how to use the Azure Resource Manager REST API with Azure Resource Manager templates (ARM templates) to deploy your resources to Azure.

You can either include your template in the request body or link to a file. When using a file, it can be a local file or an external file that is available through a URI. When your template is in a storage account, you can restrict access to the template and provide a shared access signature (SAS) token during deployment.

[!INCLUDE [permissions](../../../includes/template-deploy-permissions.md)]

## Deployment scope

You can target your deployment to a resource group, Azure subscription, management group, or tenant. Depending on the scope of the deployment, you use different commands.

- To deploy to a **resource group**, use [Deployments - Create](/rest/api/resources/deployments/createorupdate). The request is sent to:

  ```HTTP
  PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2020-10-01
  ```

- To deploy to a **subscription**, use [Deployments - Create At Subscription Scope](/rest/api/resources/deployments/createorupdateatsubscriptionscope). The request is sent to:

  ```HTTP
  PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2020-10-01
  ```

  For more information about subscription level deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

- To deploy to a **management group**, use [Deployments - Create At Management Group Scope](/rest/api/resources/deployments/createorupdateatmanagementgroupscope). The request is sent to:

  ```HTTP
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{groupId}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2020-10-01
  ```

  For more information about management group level deployments, see [Create resources at the management group level](deploy-to-management-group.md).

- To deploy to a **tenant**, use [Deployments - Create Or Update At Tenant Scope](/rest/api/resources/deployments/createorupdateattenantscope). The request is sent to:

  ```HTTP
  PUT https://management.azure.com/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2020-10-01
  ```

  For more information about tenant level deployments, see [Create resources at the tenant level](deploy-to-tenant.md).

The examples in this article use resource group deployments.

## Deploy with the REST API

1. Set [common parameters and headers](/rest/api/azure/), including authentication tokens.

1. If you're deploying to a resource group that doesn't exist, create the resource group. Provide your subscription ID, the name of the new resource group, and location that you need for your solution. For more information, see [Create a resource group](/rest/api/resources/resourcegroups/createorupdate).

   ```HTTP
   PUT https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>?api-version=2020-06-01
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

1. Before deploying your template, you can preview the changes the template will make to your environment. Use the [what-if operation](./deploy-what-if.md) to verify that the template makes the changes that you expect. What-if also validates the template for errors.

1. To deploy a template, provide your subscription ID, the name of the resource group, the name of the deployment in the request URI.

   ```HTTP
   PUT https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>/providers/Microsoft.Resources/deployments/<YourDeploymentName>?api-version=2020-10-01
   ```

   In the request body, provide a link to your template and parameter file. For more information about the parameter file, see [Create Resource Manager parameter file](parameter-files.md).

   Notice the `mode` is set to **Incremental**. To run a complete deployment, set `mode` to **Complete**. Be careful when using the complete mode as you can inadvertently delete resources that aren't in your template.

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

    If you want to log response content, request content, or both, include `debugSetting` in the request.

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

    You can set up your storage account to use a shared access signature (SAS) token. For more information, see [Delegate access with a shared access signature](/rest/api/storageservices/delegate-access-with-shared-access-signature).

    If you need to provide a sensitive value for a parameter (such as a password), add that value to a key vault. Retrieve the key vault during deployment as shown in the previous example. For more information, see [Use Azure Key Vault to pass secure parameter value during deployment](key-vault-parameter.md).

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
          "storageAccountName": "[format('{0}standardsa', uniquestring(resourceGroup().id))]"
        },
        "resources": [
          {
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2022-09-01",
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
   GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2020-10-01
   ```

## Deploy with ARMClient

ARMClient is a simple command line tool to invoke the Azure Resource Manager API. To install the tool, see [ARMClient](https://github.com/projectkudu/ARMClient).

To list your subscriptions:

```cmd
armclient GET /subscriptions?api-version=2021-04-01
```

To list your resource groups:

```cmd
armclient GET /subscriptions/<subscription-id>/resourceGroups?api-version=2021-04-01
```

Replace **&lt;subscription-id>** with your Azure subscription ID.

To create a resource group in the *Central US* region:

```cmd
armclient PUT /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>?api-version=2021-04-01  "{location: 'central us', properties: {}}"
```

Alternatively, you can put the body into a JSON file called **CreateRg.json**:

```json
{
  "location": "Central US",
  "properties": { }
}
```

```cmd
armclient PUT /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>?api-version=2021-04-01 '@CreateRg.json'
```

For more information, see [ARMClient: a command line tool for the Azure API](http://blog.davidebbo.com/2015/01/azure-resource-manager-client.html).

## Deployment name

You can give your deployment a name such as `ExampleDeployment`.

Every time you run a deployment, an entry is added to the resource group's deployment history with the deployment name. If you run another deployment and give it the same name, the earlier entry is replaced with the current deployment. If you want to maintain unique entries in the deployment history, give each deployment a unique name.

To create a unique name, you can assign a random number. Or, add a date value.

If you run concurrent deployments to the same resource group with the same deployment name, only the last deployment is completed. Any deployments with the same name that haven't finished are replaced by the last deployment. For example, if you run a deployment named `newStorage` that deploys a storage account named `storage1`, and at the same time run another deployment named `newStorage` that deploys a storage account named `storage2`, you deploy only one storage account. The resulting storage account is named `storage2`.

However, if you run a deployment named `newStorage` that deploys a storage account named `storage1`, and immediately after it completes you run another deployment named `newStorage` that deploys a storage account named `storage2`, then you have two storage accounts. One is named `storage1`, and the other is named `storage2`. But, you only have one entry in the deployment history.

When you specify a unique name for each deployment, you can run them concurrently without conflict. If you run a deployment named `newStorage1` that deploys a storage account named `storage1`, and at the same time run another deployment named `newStorage2` that deploys a storage account named `storage2`, then you have two storage accounts and two entries in the deployment history.

To avoid conflicts with concurrent deployments and to ensure unique entries in the deployment history, give each deployment a unique name.

## Next steps

- To roll back to a successful deployment when you get an error, see [Rollback on error to successful deployment](rollback-on-error.md).
- To specify how to handle resources that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
- To learn about handling asynchronous REST operations, see [Track asynchronous Azure operations](../management/async-operations.md).
- To learn more about templates, see [Understand the structure and syntax of ARM templates](./syntax.md).
