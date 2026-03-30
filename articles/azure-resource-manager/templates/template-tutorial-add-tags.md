---
title: Tutorial - Add tags to resources in your Azure Resource Manager template
description: Learn how to add tags to resources that you deploy in your Azure Resource Manager template. Tags help you to logically organize resources.
ms.date: 10/29/2025
ms.topic: tutorial
ms.custom: devx-track-arm-template
---

# Tutorial: Add tags to resources in your Azure Resource Manager template

In this tutorial, you learn how to add tags to resources in your Azure Resource Manager template (ARM template). [Tags](../management/tag-resources.md) are metadata elements made up of key-value pairs that help you identify resources and show up in cost reports. This instruction takes **8 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about Quickstart Templates](template-tutorial-quickstart-template.md), but it's not required.

You need to have [Visual Studio Code](https://code.visualstudio.com/), and either Azure PowerShell or the Azure CLI. For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

Your previous template deployed a storage account, an App Service plan, and a web app:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storagePrefix": {
      "type": "string",
      "minLength": 3,
      "maxLength": 11
    },
    "storageSKU": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_RAGRS",
        "Standard_ZRS",
        "Premium_LRS",
        "Premium_ZRS",
        "Standard_GZRS",
        "Standard_RAGZRS"
      ]
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "appServicePlanName": {
      "type": "string",
      "defaultValue": "exampleplan"
    },
    "webAppName": {
      "type": "string",
      "metadata": {
        "description": "Base name of the resource such as web app name and app service plan "
      },
      "minLength": 2
    },
    "linuxFxVersion": {
      "type": "string",
      "defaultValue": "php|7.0",
      "metadata": {
        "description": "The Runtime stack of current web app"
      }
    }
  },
  "variables": {
    "uniqueStorageName": "[concat(parameters('storagePrefix'), uniqueString(resourceGroup().id))]",
    "webAppPortalName": "[concat(parameters('webAppName'), uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2025-06-01",
      "name": "[variables('uniqueStorageName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('storageSKU')]"
      },
      "kind": "StorageV2",
      "properties": {
        "supportsHttpsTrafficOnly": true
      }
    },
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2025-03-01",
      "name": "[parameters('appServicePlanName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "B1",
        "tier": "Basic",
        "size": "B1",
        "family": "B",
        "capacity": 1
      },
      "kind": "linux",
      "properties": {
        "perSiteScaling": false,
        "reserved": true,
        "targetWorkerCount": 0,
        "targetWorkerSizeId": 0
      }
    },
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2025-03-01",
      "name": "[variables('webAppPortalName')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', parameters('appServicePlanName'))]"
      ],
      "kind": "app",
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('appServicePlanName'))]",
        "siteConfig": {
          "linuxFxVersion": "[parameters('linuxFxVersion')]"
        }
      }
    }
  ],
  "outputs": {
    "storageEndpoint": {
      "type": "object",
      "value": "[reference(variables('uniqueStorageName')).primaryEndpoints]"
    }
  }
}
```

After you deploy these resources, you might need to track costs and find resources that belong to a category. You can add tags to help solve these issues.

## Add tags

You tag resources to add values that help you identify their use. You can add tags that list the environment and the project. You can also add them to identify a cost center or the team that owns the resource. Add any values that make sense for your organization.

The following example shows the changes to the template. Copy the whole file, and replace your template with its contents:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storagePrefix": {
      "type": "string",
      "minLength": 3,
      "maxLength": 11
    },
    "storageSKU": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_RAGRS",
        "Standard_ZRS",
        "Premium_LRS",
        "Premium_ZRS",
        "Standard_GZRS",
        "Standard_RAGZRS"
      ]
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "appServicePlanName": {
      "type": "string",
      "defaultValue": "exampleplan"
    },
    "webAppName": {
      "type": "string",
      "metadata": {
        "description": "Base name of the resource such as web app name and app service plan "
      },
      "minLength": 2
    },
    "linuxFxVersion": {
      "type": "string",
      "defaultValue": "php|7.0",
      "metadata": {
        "description": "The Runtime stack of current web app"
      }
    },
    "resourceTags": {
      "type": "object",
      "defaultValue": {
        "Environment": "Dev",
        "Project": "Tutorial"
      }
    }
  },
  "variables": {
    "uniqueStorageName": "[concat(parameters('storagePrefix'), uniqueString(resourceGroup().id))]",
    "webAppPortalName": "[concat(parameters('webAppName'), uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2025-06-01",
      "name": "[variables('uniqueStorageName')]",
      "location": "[parameters('location')]",
      "tags": "[parameters('resourceTags')]",
      "sku": {
        "name": "[parameters('storageSKU')]"
      },
      "kind": "StorageV2",
      "properties": {
        "supportsHttpsTrafficOnly": true
      }
    },
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2025-03-01",
      "name": "[parameters('appServicePlanName')]",
      "location": "[parameters('location')]",
      "tags": "[parameters('resourceTags')]",
      "sku": {
        "name": "B1",
        "tier": "Basic",
        "size": "B1",
        "family": "B",
        "capacity": 1
      },
      "kind": "linux",
      "properties": {
        "perSiteScaling": false,
        "reserved": true,
        "targetWorkerCount": 0,
        "targetWorkerSizeId": 0
      }
    },
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2025-03-01",
      "name": "[variables('webAppPortalName')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[parameters('appServicePlanName')]"
      ],
      "tags": "[parameters('resourceTags')]",
      "kind": "app",
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('appServicePlanName'))]",
        "siteConfig": {
          "linuxFxVersion": "[parameters('linuxFxVersion')]"
        }
      }
    }
  ],
  "outputs": {
    "storageEndpoint": {
      "type": "object",
      "value": "[reference(variables('uniqueStorageName')).primaryEndpoints]"
    }
  }
}
```

## Deploy template

It's time to deploy the template and look at the results.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the `templateFile` variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addtags `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storagePrefix "store" `
  -storageSKU Standard_LRS `
  -webAppName demoapp
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you need to have the [latest version](/cli/azure/install-azure-cli) of the Azure CLI.

```azurecli
az deployment group create \
  --name addtags \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS webAppName=demoapp
```

---

> [!NOTE]
> If the deployment fails, use the `verbose` switch to get information about the resources you're creating. Use the `debug` switch to get more information for debugging.

## Verify deployment

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. Select the resource group you deployed to.
1. Select one of the resources, such as the storage account resource. You see that it now has tags.

   :::image type="content" source="./media/template-tutorial-add-tags/show-tags.png" alt-text="Screenshot of Azure portal showing tags on a storage account resource.":::

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to delete the resource group.

1. From the Azure portal, select **Resource groups** from the left menu.
2. Type the resource group name in the **Filter for any field...** text field.
3. Check the box next to **myResourceGroup** and select **myResourceGroup** or your resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you add tags to the resources. In the next tutorial, you learn how to use parameter files to simplify passing in values to the template.

> [!div class="nextstepaction"]
> [Use parameter file](template-tutorial-use-parameter-file.md)
