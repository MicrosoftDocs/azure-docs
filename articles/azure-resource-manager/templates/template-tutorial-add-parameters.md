---
title: Tutorial - Add parameters to your Azure Resource Manager template
description: Learn how to add parameters to your Azure Resource Manager template to make it reusable.
ms.date: 10/29/2025
ms.topic: tutorial
ms.custom: devx-track-arm-template
---

# Tutorial: Add parameters to your ARM template

In the [previous tutorial](template-tutorial-add-resource.md), you learned how to add an [Azure storage account](../../storage/common/storage-account-create.md) to the template and deploy it. In this tutorial, you learn how to improve the Azure Resource Manager template (ARM template) by adding parameters. This instruction takes **14 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about resources](template-tutorial-add-resource.md), but it's not required.

You need to have [Visual Studio Code](https://code.visualstudio.com/), and either Azure PowerShell or the Azure CLI. For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

At the end of the previous tutorial, your template has the following JSON file:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2025-06-01",
      "name": "{provide-unique-name}",
      "location": "eastus",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "properties": {
        "supportsHttpsTrafficOnly": true
      }
    }
  ]
}
```

You may notice that there's a problem with this template. The storage account name is hard-coded. You can only use this template to deploy the same storage account every time. To deploy a storage account with a different name, you need to create a new template, which obviously isn't a practical way to automate your deployments.

## Make template reusable

To make your template reusable, let's add a parameter that you can use to pass in a storage account name. The JSON file in the following example shows the changes in your template. The `storageName` parameter is identified as a string. The storage account name is all lowercase letters or numbers and has a limit of 24 characters.

Copy the whole file, and replace your template with its contents:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageName": {
      "type": "string",
      "minLength": 3,
      "maxLength": 24
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2025-06-01",
      "name": "[parameters('storageName')]",
      "location": "eastus",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "properties": {
        "supportsHttpsTrafficOnly": true
      }
    }
  ]
}
```

## Deploy template

Let's deploy the template. The following example deploys the template with the Azure CLI or Azure PowerShell. Notice that you provide the storage account name as one of the values in the deployment command. For the storage account name, provide the same name that you used in the previous tutorial.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you set the `templateFile` variable to the path of the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addnameparameter `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storageName "{your-unique-name}"
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you need to have the [latest version](/cli/azure/install-azure-cli) of the Azure CLI.

```azurecli
az deployment group create \
  --name addnameparameter \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storageName={your-unique-name}
```

---

## Understand resource updates

After you deploy a storage account with the same name you used earlier, you may wonder how the redeployment affects the resource.

If the resource already exists, and there's no change in the properties, there's no need for further action. If the resource exists and a property changes, it updates. If the resource doesn't exist, it's created.

This way of handling updates means your template can include all of the resources you need for an Azure solution. You can safely redeploy the template and know that resources change or are created only when needed. If you add files to your storage account, for example, you can redeploy the storage account without losing the files.

## Customize by environment

Parameters let you customize the deployment by providing values that are tailored for a particular environment. You can pass different values, for example, based on whether you're deploying to a development, testing, or production environment.

The previous template always deploys a standard locally redundant storage (LRS) **Standard_LRS** account. You might want the flexibility to deploy different stock keeping units (SKUs) depending on the environment. The following example shows the changes to add a parameter for SKU. Copy the whole file, and paste it over your template:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageName": {
      "type": "string",
      "minLength": 3,
      "maxLength": 24
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
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2025-06-01",
      "name": "[parameters('storageName')]",
      "location": "eastus",
      "sku": {
        "name": "[parameters('storageSKU')]"
      },
      "kind": "StorageV2",
      "properties": {
        "supportsHttpsTrafficOnly": true
      }
    }
  ]
}
```

The `storageSKU` parameter has a default value. Use this value when the deployment doesn't specify it. It also has a list of allowed values. These values match the values that are needed to create a storage account. You want your template users to pass SKUs that work.

## Redeploy template

You're ready to deploy again. Because the default SKU is set to **Standard_LRS**, you've already provided a parameter value.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addskuparameter `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storageName "{your-unique-name}"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az deployment group create \
  --name addskuparameter \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storageName={your-unique-name}
```

---

> [!NOTE]
> If the deployment fails, use the `verbose` switch to get information about the resources being created. Use the `debug` switch to get more information for debugging.

To see the flexibility of your template, let's deploy it again. This time set the SKU parameter to standard geo-redundant storage (GRS) **Standard_GRS**. You can either pass in a new name to create a different storage account or use the same name to update your existing storage account. Both options work.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name usenondefaultsku `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storageName "{your-unique-name}" `
  -storageSKU Standard_GRS
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az deployment group create \
  --name usenondefaultsku \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storageSKU=Standard_GRS storageName={your-unique-name}
```

---

Finally, let's run one more test and see what happens when you pass in an SKU that isn't one of the allowed values. In this case, we test the scenario where your template user thinks **basic** is one of the SKUs.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name testskuparameter `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storageName "{your-unique-name}" `
  -storageSKU basic
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az deployment group create \
  --name testskuparameter \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storageSKU=basic storageName={your-unique-name}
```

---

The command fails at once with an error message that gives the allowed values. The ARM processor finds the error before the deployment starts.

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to clean up your deployed resources by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Type the resource group name in the **Filter for any field ...** text field.
3. Check the box next to myResourceGroup and select **myResourceGroup** or your resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You improved the template you created in the [first tutorial](template-tutorial-create-first-template.md) by adding parameters. In the next tutorial, you learn about template functions.

> [!div class="nextstepaction"]
> [Add template functions](template-tutorial-add-functions.md)
