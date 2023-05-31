---
title: Create a template spec with linked templates
description: Learn how to create a template spec with linked templates.
ms.topic: conceptual
ms.date: 05/22/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.devlang: azurecli
---

# Tutorial: Create a template spec with linked templates

Learn how to create a [template spec](template-specs.md) with a main template and a [linked template](linked-templates.md#linked-template). You use template specs to share ARM templates with other users in your organization. This article shows you how to create a template spec to package a main template and its linked templates using the `relativePath` property of the [deployment resource](/azure/templates/microsoft.resources/deployments).

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

> [!NOTE]
> To use template specs with Azure PowerShell, you must install [version 5.0.0 or later](/powershell/azure/install-azure-powershell). To use it with Azure CLI, use [version 2.14.2 or later](/cli/azure/install-azure-cli).

## Create linked templates

Create the main template and the linked template.

To link a template, add a [deployments resource](/azure/templates/microsoft.resources/deployments) to your main template. In the `templateLink` property, specify the relative path of the linked template in accordance with the path of the parent template.

The linked template is called **linkedTemplate.json**, and is stored in a subfolder called **artifacts** in the path where the main template is stored.  You can use one of the following values for the relativePath:

- `./artifacts/linkedTemplate.json`
- `/artifacts/linkedTemplate.json`
- `artifacts/linkedTemplate.json`

The `relativePath` property is always relative to the template file where `relativePath` is declared, so if there is another linkedTemplate2.json that is called from linkedTemplate.json and linkedTemplate2.json is stored in the same artifacts subfolder, the relativePath specified in linkedTemplate.json is just `linkedTemplate2.json`.

1. Create the main template with the following JSON. Save the main template as **azuredeploy.json** to your local computer. This tutorial assumes you've saved to a path **c:\Templates\linkedTS\azuredeploy.json** but you can use any path.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "location": {
          "type": "string",
          "defaultValue": "westus2",
          "metadata":{
            "description": "Specify the location for the resources."
          }
        },
        "storageAccountType": {
          "type": "string",
          "defaultValue": "Standard_LRS",
          "metadata":{
            "description": "Specify the storage account type."
          }
        }
      },
      "variables": {
        "appServicePlanName": "[format('plan{0}', uniquestring(resourceGroup().id))]"
      },
      "resources": [
        {
          "type": "Microsoft.Web/serverfarms",
          "apiVersion": "2022-09-01",
          "name": "[variables('appServicePlanName')]",
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
          "type": "Microsoft.Resources/deployments",
          "apiVersion": "2022-09-01",
          "name": "createStorage",
          "properties": {
            "mode": "Incremental",
            "templateLink": {
              "relativePath": "artifacts/linkedTemplate.json"
            },
            "parameters": {
              "storageAccountType": {
                "value": "[parameters('storageAccountType')]"
              }
            }
          }
        }
      ]
    }
    ```

    > [!NOTE]
    > The apiVersion of `Microsoft.Resources/deployments` must be 2020-06-01 or later.

1. Create a directory called **artifacts** in the folder where the main template is saved.
1. Create the linked template with the following JSON:

    ```json
    {
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
        "storageAccountName": "[format('store{0}', uniquestring(resourceGroup().id))]"
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
    }
    ```

1. Save the template as **linkedTemplate.json** in the **artifacts** folder.

## Create template spec

Templates specs are stored in resource Groups.  Create a resource group, and then create a template spec with the following script. The template spec name is **webSpec**.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup `
  -Name templateSpecRG `
  -Location westus2

New-AzTemplateSpec `
  -Name webSpec `
  -Version "1.0.0.0" `
  -ResourceGroupName templateSpecRG `
  -Location westus2 `
  -TemplateFile "c:\Templates\linkedTS\azuredeploy.json"
```

# [CLI](#tab/azure-cli)

```azurecli
az group create \
  --name templateSpecRG \
  --location westus2

az ts create \
  --name webSpec \
  --version "1.0.0.0" \
  --resource-group templateSpecRG \
  --location "westus2" \
  --template-file "<path-to-main-template>"
```

---

When you are done, you can view the template spec from the Azure portal or by using the following cmdlet:

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Get-AzTemplateSpec -ResourceGroupName templatespecRG -Name webSpec
```

# [CLI](#tab/azure-cli)

```azurecli
az ts show --name webSpec --resource-group templateSpecRG --version "1.0.0.0"
```

---

## Deploy template spec

You can now deploy the template spec. Deploying the template spec is just like deploying the template it contains, except that you pass in the resource ID of the template spec. You use the same deployment commands, and if needed, pass in parameter values for the template spec.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup `
  -Name webRG `
  -Location westus2

$id = (Get-AzTemplateSpec -ResourceGroupName templateSpecRG -Name webSpec -Version "1.0.0.0").Versions.Id

New-AzResourceGroupDeployment `
  -TemplateSpecId $id `
  -ResourceGroupName webRG
```

# [CLI](#tab/azure-cli)

```azurecli
az group create \
  --name webRG \
  --location westus2

id = $(az ts show --name webSpec --resource-group templateSpecRG --version "1.0.0.0" --query "id")

az deployment group create \
  --resource-group webRG \
  --template-spec $id
```

> [!NOTE]
> There is a known issue with getting a template spec ID and assigning it to a variable in Windows PowerShell.

---

## Next steps

To learn about deploying a template spec as a linked template, see [Tutorial: Deploy a template spec as a linked template](template-specs-deploy-linked-template.md).
