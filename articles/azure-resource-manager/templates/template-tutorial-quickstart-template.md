---
title: Tutorial - Use Azure Quickstart Templates
description: Learn how to use Azure Quickstart Templates to complete your template development.
ms.date: 10/29/2025
ms.topic: tutorial
ms.custom:
---

# Tutorial: Use Azure Quickstart Templates

[Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/) is a repository of community contributed templates. You can use the sample templates in your template development. In this tutorial, you find a website resource definition and add it to your own template. This instruction takes **12 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about exported templates](template-tutorial-export-template.md), but it's not required.

You need to have [Visual Studio Code](https://code.visualstudio.com/), and either Azure PowerShell or the Azure CLI. For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

At the end of the previous tutorial, your template had the following JSON file:

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
    }
  },
  "variables": {
    "uniqueStorageName": "[concat(parameters('storagePrefix'), uniqueString(resourceGroup().id))]"
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

This template works for deploying storage accounts and app service plans, but you might want to add a website to it. You can use pre-built templates to quickly discover the JSON required for deploying a resource.

## Find template

1. Open [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/)
1. Select the tile with the title **Deploy a basic Linux web app**. If you have trouble finding it, here's the [direct link](https://azure.microsoft.com/resources/templates/webapp-basic-linux/).
1. Select **Browse on GitHub**.
1. Select _azuredeploy.json_.
1. Review the template. Look for the `Microsoft.Web/sites` resource.

    ![Resource Manager template quickstart web site](./media/template-tutorial-quickstart-template/resource-manager-template-quickstart-template-web-site.png)

## Revise existing template

Merge the quickstart template with the existing template:

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

The web app name needs to be unique across Azure. To prevent having duplicate names, the `webAppPortalName` variable is updated from `"webAppPortalName": "[concat(parameters('webAppName'), '-webapp')]"` to `"webAppPortalName": "[concat(parameters('webAppName'), uniqueString(resourceGroup().id))]"`.

Add a comma at the end of the `Microsoft.Web/serverfarms` definition to separate the resource definition from the `Microsoft.Web/sites` definition.

There are a couple of important features to note in this new resource.

It has an element named `dependsOn` that's set to the app service plan. This setting is required because the app service plan needs to exist before the web app is created. The `dependsOn` element tells Resource Manager how to order the resources for deployment.

The `serverFarmId` property uses the [resourceId](template-functions-resource.md#resourceid) function. This function gets the unique identifier for a resource. In this case, it gets the unique identifier for the app service plan. The web app is associated with one specific app service plan.

## Deploy template

Use the Azure CLI or Azure PowerShell to deploy a template.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the **templateFile** variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addwebapp `
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
  --name addwebapp \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS webAppName=demoapp
```

---

> [!NOTE]
> If the deployment fails, use the `verbose` switch to get information about the resources you're creating. Use the `debug` switch to get more information for debugging.

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to delete the resource group.

1. From the Azure portal, select **Resource groups** from the left menu.
2. Type the resource group name in the **Filter for any field...** text field.
3. Check the box next to **myResourceGroup** and select **myResourceGroup** or your resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You learned how to use a quickstart template for your template development. In the next tutorial, you add tags to the resources.

> [!div class="nextstepaction"]
> [Add tags](template-tutorial-add-tags.md)
