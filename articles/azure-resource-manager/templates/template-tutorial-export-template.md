---
title: Tutorial - Export and use Azure portal templates 
description: Learn how to export a template from the Azure portal to use sample templates from Azure Quickstart Templates.
ms.date: 10/29/2025
ms.topic: tutorial
ms.custom:
---

# Tutorial: Export and use Azure portal templates

In this tutorial series, you create a template to deploy an Azure storage account. In the next two tutorials, you add an **App Service plan** and a **website**. Instead of creating templates from scratch, you learn how to export templates from the Azure portal and how to use sample templates from the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/). You customize those templates for your use. This tutorial focuses on exporting templates and customizing the result for your template. This instruction takes **14 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about outputs](template-tutorial-add-outputs.md), but it's not required.

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

This template works well for deploying storage accounts, but you might want to add more resources to it. You can export a template from an existing resource to quickly get the JSON for that resource.

## Create App Service plan

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource**.
1. In **Search services and Marketplace**, enter **App Service Plan**, and then select **App Service Plan**.
1. Select **Create**.
1. On the **Create App Service Plan** page, enter the following:

    - **Subscription**: Select your Azure subscription from the drop-down menu.
    - **Resource Group**: Select **Create new** and then specify a name. Provide a different resource group name than the one you've been using in this tutorial series.
    - **Name**: enter a name for the App Service Plan.
    - **Operating System**: Select **Linux**.
    - **Region**: Select an Azure location from the drop-down menu, such as **Central US**.
    - **Pricing Tier**: To save costs, select **Change size** to change the **SKU and size** to **first Basic (B1)**, under **Dev / Test** for less demanding workloads.

    :::image type="content" source="./media/template-tutorial-export-template/resource-manager-template-export.png" alt-text="Screenshot of the Create App Service Plan page in the Azure portal.":::
1. Select **Review and create**.
1. Select **Create**. It takes a few moments to create the resource.

## Export template

1. Select **Go to resource**.

    :::image type="content" source="./media/template-tutorial-export-template/resource-manager-template-export-go-to-resource.png" alt-text="Screenshot of the Go to resource button in the Azure portal.":::

1. From the left menu, under **Automation**, select **Export template**.

    :::image type="content" source="./media/template-tutorial-export-template/resource-manager-template-export-template.png" alt-text="Screenshot of the Export template option in the Azure portal.":::

   The export template feature takes the current state of a resource and generates a template to deploy it. Exporting a template can be a helpful way of quickly getting the JSON you need to deploy a resource.

1. Look at the `Microsoft.Web/serverfarms` definition and the parameter definition in the exported template. You don't need to copy these sections. You can just use this exported template as an example of how you want to add this resource to your template.

    :::image type="content" source="./media/template-tutorial-export-template/resource-manager-template-exported-template.png" alt-text="Screenshot of the exported template JSON code in the Azure portal.":::

> [!IMPORTANT]
> Typically, the exported template is more verbose than you might want when creating a template. The SKU object, for example, in the exported template has five properties. This template works, but you could just use the `name` property. You can start with the exported template and then modify it as you like to fit your requirements.

## Revise existing template

The exported template gives you most of the JSON you need, but you have to customize it for your template. Pay particular attention to differences in parameters and variables between your template and the exported template. Obviously, the export process doesn't know the parameters and variables that you've already defined in your template.

The following example shows the additions to your template. It contains the exported code plus some changes. First, it changes the name of the parameter to match your naming convention. Second, it uses your location parameter for the location of the app service plan. Third, it removes some of the properties where the default value is fine.

Copy the whole file, and replace your template with its contents:

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

## Deploy template

Use the Azure CLI or Azure PowerShell to deploy a template.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the `templateFile` variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addappserviceplan `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storagePrefix "store" `
  -storageSKU Standard_LRS
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you need to have the [latest version](/cli/azure/install-azure-cli) of the Azure CLI.

```azurecli
az deployment group create \
  --name addappserviceplan \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS
```

---

> [!NOTE]
> If the deployment fails, use the `verbose` switch to get information about the resources you're creating. Use the `debug` switch to get more information for debugging.

## Verify deployment

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. Select the resource group you deployed to.
1. The resource group contains a storage account and an App Service Plan.

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to delete the resource group.

1. From the Azure portal, select **Resource groups** from the left menu.
2. Type the resource group name in the **Filter for any field...** text field.
3. Check the box next to **myResourceGroup** and select **myResourceGroup** or your resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You learned how to export a template from the Azure portal and how to use the exported template for your template development. You can also use the Azure Quickstart Templates to simplify template development.

> [!div class="nextstepaction"]
> [Use Azure Quickstart Templates](template-tutorial-quickstart-template.md)
