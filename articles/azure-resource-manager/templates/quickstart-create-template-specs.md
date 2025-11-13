---
title: Create and deploy template spec
description: Learn how to create a template spec from ARM template. Then, deploy the template spec to a resource group in your subscription.
ms.date: 08/05/2025
ms.topic: quickstart
ms.custom: mode-api, devx-track-azurecli, devx-track-arm-template
ms.devlang: azurecli
---

# Quickstart: Create and deploy template spec

This quickstart shows you how to package an Azure Resource Manager template (ARM template) into a [template spec](template-specs.md). Then, you deploy that template spec. Your template spec contains an ARM template that deploys a storage account.

> [!TIP]
> [Bicep](../bicep/overview.md) is recommended since it offers the same capabilities as ARM templates, and the syntax is easier to use. To learn more, see [Quickstart: Create and deploy a template spec with Bicep](../bicep/quickstart-create-template-specs.md).

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

> [!NOTE]
> To use template spec with Azure PowerShell, you must install [version 5.0.0 or later](/powershell/azure/install-azure-powershell). To use it with the Azure CLI, use [version 2.14.2 or later](/cli/azure/install-azure-cli).

## Create template

You create a template spec from an ARM template. Copy the following template, and save as **C:\Templates\createStorageV1.json**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string",
      "defaultValue": "[uniqueString(resourceGroup().id)]"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2025-06-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "properties": {
        "accessTier": "Hot"
      }
    }
  ]
}
```

## Create template spec

The template spec is a resource type named `Microsoft.Resources/templateSpecs`. To create a template spec, use PowerShell, the Azure CLI, the Azure portal, or an ARM template.

# [PowerShell](#tab/azure-powershell)

1. Create a new resource group to contain the template spec.

    ```azurepowershell
    New-AzResourceGroup `
      -Name templateSpecRG `
      -Location westus2
    ```

1. Create the template spec in that resource group. Give the new template spec the name **storageSpec**.

    ```azurepowershell
    New-AzTemplateSpec `
      -Name storageSpec `
      -Version "1.0" `
      -ResourceGroupName templateSpecRG `
      -Location westus2 `
      -TemplateFile "C:\Templates\createStorageV1.json"
    ```

# [CLI](#tab/azure-cli)

1. Create a new resource group to contain the template spec.

    ```azurecli
    az group create \
      --name templateSpecRG \
      --location westus2
    ```

1. Create the template spec in that resource group. Give the new template spec the name **storageSpec**.

    ```azurecli
    az ts create \
      --name storageSpec \
      --version "1.0" \
      --resource-group templateSpecRG \
      --location "westus2" \
      --template-file "C:\Templates\createStorageV1.json"
    ```

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **template specs**. Select **Template specs** from the available options.

    :::image type="content" source="./media/quickstart-create-template-specs/search-template-spec.png" alt-text="Screenshot of search bar with 'template specs' query.":::

1. Select **Import template**, and then follow the instructions to import **C:\Templates\createStorageV1.json** that you saved earlier.

1. Provide the following values:

    - **Name**: enter a name for the template spec. For example, **storageSpec**.
    - **Subscription**: select an Azure subscription used for creating the template spec.
    - **Resource Group**: select **Create new**, and then enter a new resource group name. For example, **templateSpecRG**.
    - **Location**: select a location for the resource group. For example, **West US 2**.
    - **Version**: enter a version for the template spec. Use **1.0**.

1. Select **Review + Create**, and then select **Create**.

# [ARM Template](#tab/azure-resource-manager)

> [!NOTE]
> We recommend using PowerShell or CLI instead of an ARM template to create your template spec. These tools automatically convert linked templates into artifacts associated with the main template. If you use an ARM template, you'll need to manually add linked templates as artifacts, which can be more complex.

1. When you use an ARM template to create the template spec, the template is embedded in the resource definition. Copy the following template, and save it locally as _createTemplateSpec.json_:

    > [!NOTE]
    > In the embedded template, all [template expressions](template-expressions.md) must be escaped with a second left bracket. Use `"[[` instead of `"[`. JSON arrays still use a single left bracket. See the **name** and **location** properties in the example below:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": [
        {
          "type": "Microsoft.Resources/templateSpecs",
          "apiVersion": "2022-02-01",
          "name": "storageSpec",
          "location": "westus2",
          "properties": {
            "displayName": "Storage template spec"
          }
        },
        {
          "type": "Microsoft.Resources/templateSpecs/versions",
          "apiVersion": "2022-02-01",
          "name": "[format('{0}/{1}', 'storageSpec', '1.0')]",
          "location": "westus2",
          "properties": {
            "mainTemplate": {
              "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
              "contentVersion": "1.0.0.0",
              "parameters": {
                "storageAccountName": {
                  "type": "string",
                  "defaultValue": "[uniqueString(resourceGroup().id)]"
                },
                "location": {
                  "type": "string",
                  "defaultValue": "[resourceGroup().location]"
                }
              },
              "resources": [
                {
                  "type": "Microsoft.Storage/storageAccounts",
                  "apiVersion": "2025-06-01",
                  "name": "[[parameters('storageAccountName')]",
                  "location": "[[parameters('location')]",
                  "sku": {
                    "name": "Standard_LRS"
                  },
                  "kind": "StorageV2",
                  "properties": {
                    "accessTier": "Hot"
                  }
                }
              ]
            }
          },
          "dependsOn": [
            "storageSpec"
          ]
        }
      ]
    }
    ```

1. Use the Azure CLI or PowerShell to create a new resource group.

    ```azurepowershell
    New-AzResourceGroup `
      -Name templateSpecRG `
      -Location westus2
    ```

    ```azurecli
    az group create \
      --name templateSpecRG \
      --location westus2
    ```

1. Deploy your template with the Azure CLI or PowerShell.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName templateSpecRG `
      -TemplateFile "C:\Templates\createTemplateSpec.json"
    ```

    ```azurecli
    az deployment group create \
      --resource-group templateSpecRG \
      --template-file "C:\Templates\createTemplateSepc.json"
    ```

1. Verify the deployment with the Azure CLI or PowerShell.

    ```azurepowershell
    Get-AzTemplateSpec `
      -ResourceGroupName templateSpecRG `
      -Name storageSpec
    ```

    ```azurecli
    az ts show \
      --resource-group templateSpecRG \
      --name storageSpec
    ```

---

## Deploy template spec

To deploy a template spec, use the same deployment commands as you would use to deploy a template. Pass in the resource ID of the template spec to deploy.

# [PowerShell](#tab/azure-powershell)

1. Create a resource group to contain the new storage account.

    ```azurepowershell
    New-AzResourceGroup `
      -Name storageRG `
      -Location westus2
    ```

1. Get the resource ID of the template spec.

    ```azurepowershell
    $id = (Get-AzTemplateSpec -ResourceGroupName templateSpecRG -Name storageSpec -Version "1.0").Versions.Id
    ```

1. Deploy the template spec.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -TemplateSpecId $id `
      -ResourceGroupName storageRG
    ```

1. Provide parameters exactly as you would for an ARM template. Redeploy the template spec with a parameter for the storage account type.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -TemplateSpecId $id `
      -ResourceGroupName storageRG `
      -storageAccountType Standard_GRS
    ```

# [CLI](#tab/azure-cli)

1. Create a resource group to contain the new storage account.

    ```azurecli
    az group create \
      --name storageRG \
      --location westus2
    ```

1. Get the resource ID of the template spec.

    ```azurecli
    id=$(az ts show --name storageSpec --resource-group templateSpecRG --version "1.0" --query "id")
    ```

    > [!NOTE]
    > There's a known issue with getting a template spec ID and assigning it to a variable in Windows PowerShell.

1. Deploy the template spec.

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-spec $id
    ```

1. Provide parameters exactly as you would for an ARM template. Redeploy the template spec with a parameter for the storage account type.

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-spec $id \
      --parameters storageAccountType='Standard_GRS'
    ```

# [Portal](#tab/azure-portal)

1. Select the template spec you created. Use the search box to find the template spec if there are many.

    :::image type="content" source="./media/quickstart-create-template-specs/select-template-spec.png" alt-text="Screenshot of a template specs list with one item selected.":::

1. Select **Deploy**.

    :::image type="content" source="./media/quickstart-create-template-specs/deploy-template-spec.png" alt-text="Screenshot of the **Deploy** button in the selected template spec.":::

1. Provide the following values:

    - **Subscription**: select an Azure subscription for creating the resource.
    - **Resource group**: select **Create new** and then enter **storageRG**.

1. Select **Review + create**, and then select **Create**.

# [ARM Template](#tab/azure-resource-manager)

1. Copy the following template, and save it locally as _deployTemplateSpecV1.json_:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": [
        {
          "type": "Microsoft.Resources/deployments",
          "apiVersion": "2025-04-01",
          "name": "demo",
          "properties": {
            "templateLink": {
              "id": "[resourceId('templateSpecRG', 'Microsoft.Resources/templateSpecs/versions', 'storageSpec', '1.0')]"
            },
            "parameters": {
            },
            "mode": "Incremental"
          }
        }
      ]
    }
    ```

    In the template, **templateSpecRG** is the name of the resource group that contains the template spec, **storageSpec** is the name of the template spec, and **1.0** is the version of the template spec.

1. Use the Azure CLI or PowerShell to create a new resource group for the storage account.

    ```azurepowershell
    New-AzResourceGroup `
      -Name storageRG `
      -Location westus2
    ```

    ```azurecli
    az group create \
      --name storageRG \
      --location westus2
    ```

1. Deploy your template with the Azure CLI or PowerShell.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName storageRG `
      -TemplateFile "C:\Templates\deployTemplateSpecV1.json"
    ```

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-file "C:\Templates\deployTemplateSpecV1.json"
    ```

1. Verify the deployment with the Azure CLI or PowerShell.

    ```azurepowershell
    Get-AzResource `
      -ResourceGroupName storageRG 
    ```

    ```azurecli
    az resource list \
      --resource-group storageRG 
    ```

---

## Grant access

To let other users in your organization deploy your template spec, grant them read access. Assign the Reader role to a Microsoft Entra group for the resource group that contains the template specs you want to share. For more information, see [Tutorial: Grant a group access to Azure resources using Azure PowerShell](../../role-based-access-control/tutorial-role-assignments-group-powershell.md).

## Update template

To make a change to the template in your template spec, revise the template. The following template is similar to your earlier template except it adds a prefix for the storage account name. Copy the following template and save it as **createStorageV2.json** file.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string",
      "defaultValue": "[format('store{0}', uniqueString(resourceGroup().id))]"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2025-06-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "properties": {
        "accessTier": "Hot"
      }
    }
  ]
}
```

## Update template spec version

Instead of creating a new template spec for the revised template, add a new version named `2.0` to the existing template spec. You can deploy either version.

# [PowerShell](#tab/azure-powershell)

1. Create a new version for the template spec.

   ```powershell
   New-AzTemplateSpec `
     -Name storageSpec `
     -Version "2.0" `
     -ResourceGroupName templateSpecRG `
     -Location westus2 `
     -TemplateFile "C:\Templates\createStorageV2.json"
   ```

1. To deploy the new version, get the resource ID for the `2.0` version.

   ```powershell
   $id = (Get-AzTemplateSpec -ResourceGroupName templateSpecRG -Name storageSpec -Version "2.0").Versions.Id
   ```

1. Deploy that version. Provide a prefix for the storage account name.

   ```powershell
   New-AzResourceGroupDeployment `
     -TemplateSpecId $id `
     -ResourceGroupName storageRG `
     -namePrefix "demoaccount"
   ```

# [CLI](#tab/azure-cli)

1. Create a new version for the template spec.

   ```azurecli
   az ts create \
     --name storageSpec \
     --version "2.0" \
     --resource-group templateSpecRG \
     --location "westus2" \
     --template-file "C:\Templates\createStorageV2.json"
   ```

1. To deploy the new version, get the resource ID for the `2.0` version.

   ```azurecli
   id=$(az ts show --name storageSpec --resource-group templateSpecRG --version "2.0" --query "id")
   ```

1. Deploy that version. Provide a prefix for the storage account name.

   ```azurecli
   az deployment group create \
      --resource-group storageRG \
      --template-spec $id \
      --parameters namePrefix='demoaccount'
   ```

# [Portal](#tab/azure-portal)

1. Open the template spec **storageSpec**, and select **Create new version**.

   :::image type="content" source="./media/quickstart-create-template-specs/select-versions.png" alt-text="Screenshot of the **Create new version** button in template spec details.":::

1. Select **1.0** as the base template, and then select **Create**.
1. Name the new version `2.0` and optionally add notes. Select **Edit template**.

   :::image type="content" source="./media/quickstart-create-template-specs/add-version-name.png" alt-text="Screenshot of naming the new version and selecting the **Edit template** button.":::

1. Replace the contents of the template with the updated template. Select **Review + Save**.
1. Select **Save changes**.

1. To deploy the new version, select **Versions**.

   :::image type="content" source="./media/quickstart-create-template-specs/see-versions.png" alt-text="Screenshot of the **Versions** tab in template spec details.":::

1. Open the new version, and then select **Deploy**.
1. Fill in the fields like you did when deploying the earlier version.
1. Select **Review + create**, and then select **Create**.

# [ARM Template](#tab/azure-resource-manager)

1. Again, you must make some changes to your local template to make it work with template specs. Copy the following template, and save it locally as _createTemplateSpec.json_:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": [
        {
          "type": "Microsoft.Resources/templateSpecs",
          "apiVersion": "2022-02-01",
          "name": "storageSpec",
          "location": "westus2",
          "properties": {
            "displayName": "Storage template spec"
          }
        },
        {
          "type": "Microsoft.Resources/templateSpecs/versions",
          "apiVersion": "2022-02-01",
          "name": "[format('{0}/{1}', 'storageSpec', '2.0')]",
          "location": "westus2",
          "properties": {
            "mainTemplate": {
              "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
              "contentVersion": "1.0.0.0",
              "parameters": {
                "storageAccountName": {
                  "type": "string",
                  "defaultValue": "[format('store{0}', uniqueString(resourceGroup().id))]"
                },
                "location": {
                  "type": "string",
                  "defaultValue": "[resourceGroup().location]"
                }
              },
              "resources": [
                {
                  "type": "Microsoft.Storage/storageAccounts",
                  "apiVersion": "2025-06-01",
                  "name": "[[parameters('storageAccountName')]",
                  "location": "[[parameters('location')]",
                  "sku": {
                    "name": "Standard_LRS"
                  },
                  "kind": "StorageV2",
                  "properties": {
                    "accessTier": "Hot"
                  }
                }
              ]
            }
          },
          "dependsOn": [
            "storageSpec"
          ]
        }
      ]
    }
    ```

1. To add the new version to your template spec, deploy your template with the Azure CLI or PowerShell.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName templateSpecRG `
      -TemplateFile "C:\Templates\createTemplateSpec.json"
    ```

    ```azurecli
    az deployment group create \
      --resource-group templateSpecRG \
      --template-file "C:\Templates\createTemplateSpec.json"
    ```

1. verify the deployment with the Azure CLI or PowerShell.

    ```azurepowershell
    Get-AzTemplateSpec `
      -ResourceGroupName templateSpecRG `
      -Name storageSpec
    ```

    ```azurecli
    az ts show \
      --resource-group templateSpecRG \
      --name storageSpec
    ```

    You should see the new version `2.0` in the list of versions.

1. Copy the following template, and save it locally as _deployTemplateSpecV2.json_:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": [
        {
          "type": "Microsoft.Resources/deployments",
          "apiVersion": "2025-04-01",
          "name": "demo",
          "properties": {
            "templateLink": {
              "id": "[resourceId('templateSpecRG', 'Microsoft.Resources/templateSpecs/versions', 'storageSpec', '2.0')]"
            },
            "parameters": {
            },
            "mode": "Incremental"
          }
        }
      ]
    }
    ```

1. Deploy your template with the Azure CLI or PowerShell.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName storageRG `
      -TemplateFile "C:\Templates\deployTemplateSpecV2.json"
    ```

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-file "C:\Templates\deployTemplateSpecV2.json"
    ```

1. Verify the deployment with the Azure CLI or PowerShell.

    ```azurepowershell
    Get-AzResource `
      -ResourceGroupName storageRG 
    ```

    ```azurecli
    az resource list \
      --resource-group storageRG 
    ```

    You should see the new storage account with a name that starts with `store` and a unique string based on the resource group ID.
---

## Clean up resources

To clean up the resource you deployed in this quickstart, delete both resource groups that you created.

1. From the Azure portal, select Resource group from the left menu.
1. Enter the resource group name (templateSpecRG and storageRG) in the Filter by name field.
1. Select the resource group name.
1. Select Delete resource group from the top menu.

## Next steps

To learn about creating a template spec that includes linked templates, see how to [create a template spec of a linked template](template-specs-create-linked.md).
