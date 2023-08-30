---
title: Create and deploy template spec
description: Learn how to create a template spec from ARM template. Then, deploy the template spec to a resource group in your subscription.
ms.date: 05/22/2023
ms.topic: quickstart
ms.custom: mode-api, devx-track-azurecli, devx-track-arm-template
ms.devlang: azurecli
---

# Quickstart: Create and deploy template spec

This quickstart shows you how to package an Azure Resource Manager template (ARM template) into a [template spec](template-specs.md). Then, you deploy that template spec. Your template spec contains an ARM template that deploys a storage account.

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [Quickstart: Create and deploy a template spec with Bicep](../bicep/quickstart-create-template-specs.md).

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

> [!NOTE]
> To use template spec with Azure PowerShell, you must install [version 5.0.0 or later](/powershell/azure/install-azure-powershell). To use it with Azure CLI, use [version 2.14.2 or later](/cli/azure/install-azure-cli).

## Create template

You create a template spec from a local template. Copy the following template and save it locally to a file named **azuredeploy.json**. This quickstart assumes you've saved to a path **c:\Templates\azuredeploy.json** but you can use any path.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json":::

## Create template spec

The template spec is a resource type named `Microsoft.Resources/templateSpecs`. To create a template spec, use PowerShell, Azure CLI, the portal, or an ARM template.

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
      -TemplateFile "c:\Templates\azuredeploy.json"
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
      --template-file "c:\Templates\azuredeploy.json"
    ```

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **template specs**. Select **Template specs** from the available options.

    :::image type="content" source="./media/quickstart-create-template-specs/search-template-spec.png" alt-text="Screenshot of search bar with 'template specs' query.":::

1. Select **Import template**.

    :::image type="content" source="./media/quickstart-create-template-specs/import-template.png" alt-text="Screenshot of 'Import template' button in Template specs page.":::

1. Select the folder icon.

    :::image type="content" source="./media/quickstart-create-template-specs/open-folder.png" alt-text="Screenshot of folder icon to open file explorer.":::

1. Navigate to the local template you saved and select it. Select **Open**.
1. Select **Import**.

    :::image type="content" source="./media/quickstart-create-template-specs/select-import.png" alt-text="Screenshot of 'Import' button after selecting a template file.":::

1. Provide the following values:

    - **Name**: enter a name for the template spec.  For example, **storageSpec**
    - **Subscription**: select an Azure subscription used for creating the template spec.
    - **Resource Group**: select **Create new**, and then enter a new resource group name.  For example, **templateSpecRG**.
    - **Location**: select a location for the resource group. For example,  **West US 2**.
    - **Version**: enter a version for the template spec. Use **1.0**.

1. Select **Review + Create**.
1. Select **Create**.

# [ARM Template](#tab/azure-resource-manager)

> [!NOTE]
> Instead of using an ARM template, we recommend that you use PowerShell or CLI to create your template spec. Those tools automatically convert linked templates to artifacts connected to your main template. When you use an ARM template to create the template spec, you must manually add those linked templates as artifacts, which can be complicated.

1. When you use an ARM template to create the template spec, the template is embedded in the resource definition. There are some changes you need to make to your local template. Copy the following template and save it locally as **azuredeploy.json**.

    > [!NOTE]
    > In the embedded template, all [template expressions](template-expressions.md) must be escaped with a second left bracket. Use `"[[` instead of `"[`. JSON arrays still use a single left bracket.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {},
      "functions": [],
      "variables": {},
      "resources": [
        {
          "type": "Microsoft.Resources/templateSpecs",
          "apiVersion": "2021-05-01",
          "name": "storageSpec",
          "location": "westus2",
          "properties": {
            "displayName": "Storage template spec"
          },
          "tags": {},
          "resources": [
            {
              "type": "versions",
              "apiVersion": "2021-05-01",
              "name": "1.0",
              "location": "westus2",
              "dependsOn": [ "storageSpec" ],
              "properties": {
                "mainTemplate": {
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
                      "defaultValue": "[[resourceGroup().location]",
                      "metadata": {
                        "description": "Location for all resources."
                      }
                    }
                  },
                  "variables": {
                    "storageAccountName": "[[concat('store', uniquestring(resourceGroup().id))]"
                  },
                  "resources": [
                    {
                      "type": "Microsoft.Storage/storageAccounts",
                      "apiVersion": "2022-09-01",
                      "name": "[[variables('storageAccountName')]",
                      "location": "[[parameters('location')]",
                      "sku": {
                        "name": "[[parameters('storageAccountType')]"
                      },
                      "kind": "StorageV2",
                      "properties": {}
                    }
                  ],
                  "outputs": {
                    "storageAccountName": {
                      "type": "string",
                      "value": "[[variables('storageAccountName')]"
                    }
                  }
                }
              },
              "tags": {}
            }
          ]
        }
      ],
      "outputs": {}
    }
    ```

1. Use Azure CLI or PowerShell to create a new resource group.

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

1. Deploy your template with Azure CLI or PowerShell.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName templateSpecRG `
      -TemplateFile "c:\Templates\azuredeploy.json"
    ```

    ```azurecli
    az deployment group create \
      --resource-group templateSpecRG \
      --template-file "c:\Templates\azuredeploy.json"
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

1. You provide parameters exactly as you would for an ARM template. Redeploy the template spec with a parameter for the storage account type.

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
    > There is a known issue with getting a template spec ID and assigning it to a variable in Windows PowerShell.

1. Deploy the template spec.

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-spec $id
    ```

1. You provide parameters exactly as you would for an ARM template. Redeploy the template spec with a parameter for the storage account type.

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-spec $id \
      --parameters storageAccountType='Standard_GRS'
    ```

# [Portal](#tab/azure-portal)

1. Select the template spec you created.

    :::image type="content" source="./media/quickstart-create-template-specs/select-template-spec.png" alt-text="Screenshot of Template specs list with one item selected.":::

1. Select **Deploy**.

    :::image type="content" source="./media/quickstart-create-template-specs/deploy-template-spec.png" alt-text="Screenshot of 'Deploy' button in the selected Template spec.":::

1. Provide the following values:

    - **Subscription**: select an Azure subscription for creating the resource.
    - **Resource group**: select **Create new** and then enter **storageRG**.
    - **Storage Account Type**: select **Standard_GRS**.

1. Select **Review + create**.
1. Select **Create**.

# [ARM Template](#tab/azure-resource-manager)

1. Copy the following template and save it locally to a file named **storage.json**.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {},
      "functions": [],
      "variables": {},
      "resources": [
        {
          "type": "Microsoft.Resources/deployments",
          "apiVersion": "2021-04-01",
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
      ],
      "outputs": {}
    }
    ```

1. Use Azure CLI or PowerShell to create a new resource group for the storage account.

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

1. Deploy your template with Azure CLI or PowerShell.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName storageRG `
      -TemplateFile "c:\Templates\storage.json"
    ```

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-file "c:\Templates\storage.json"
    ```

---

## Grant access

If you want to let other users in your organization deploy your template spec, you need to grant them read access. You can assign the Reader role to an Azure AD group for the resource group that contains template specs you want to share. For more information, see [Tutorial: Grant a group access to Azure resources using Azure PowerShell](../../role-based-access-control/tutorial-role-assignments-group-powershell.md).

## Update template

Let's suppose you've identified a change you want to make to the template in your template spec. The following template is similar to your earlier template except it adds a prefix for the storage account name. Copy the following template and update your azuredeploy.json file.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/templatespecs/azuredeploy2.json":::

## Update template spec version

Rather than creating a new template spec for the revised template, add a new version named `2.0` to the existing template spec. Users can choose either version to deploy.

# [PowerShell](#tab/azure-powershell)

1. Create a new version for the template spec.

   ```powershell
   New-AzTemplateSpec `
     -Name storageSpec `
     -Version "2.0" `
     -ResourceGroupName templateSpecRG `
     -Location westus2 `
     -TemplateFile "c:\Templates\azuredeploy.json"
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
     --template-file "c:\Templates\azuredeploy.json"
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

1. In your template spec, select **Create new version**.

   :::image type="content" source="./media/quickstart-create-template-specs/select-versions.png" alt-text="Screenshot of 'Create new version' button in Template spec details.":::

1. Name the new version `2.0` and optionally add notes. Select **Edit template**.

   :::image type="content" source="./media/quickstart-create-template-specs/add-version-name.png" alt-text="Screenshot of naming the new version and selecting 'Edit template' button.":::

1. Replace the contents of the template with your updated template. Select **Review + Save**.
1. Select **Save changes**.

1. To deploy the new version, select **Versions**

   :::image type="content" source="./media/quickstart-create-template-specs/see-versions.png" alt-text="Screenshot of 'Versions' tab in Template spec details.":::

1. For the version you want to deploy, select the three dots and **Deploy**.

   :::image type="content" source="./media/quickstart-create-template-specs/deploy-version.png" alt-text="Screenshot of 'Deploy' option in the context menu of a specific version.":::

1. Fill in the fields as you did when deploying the earlier version.
1. Select **Review + create**.
1. Select **Create**.

# [ARM Template](#tab/azure-resource-manager)

1. Again, you must make some changes to your local template to make it work with template specs. Copy the following template and save it locally as azuredeploy.json.

   ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {},
      "functions": [],
      "variables": {},
      "resources": [
        {
          "type": "Microsoft.Resources/templateSpecs",
          "apiVersion": "2021-05-01",
          "name": "storageSpec",
          "location": "westus2",
          "properties": {
            "displayName": "Storage template spec"
          },
          "tags": {},
          "resources": [
            {
              "type": "versions",
              "apiVersion": "2021-05-01",
              "name": "2.0",
              "location": "westus2",
              "dependsOn": [ "storageSpec" ],
              "properties": {
                "mainTemplate": {
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
                      "defaultValue": "[[resourceGroup().location]",
                      "metadata": {
                        "description": "Location for all resources."
                      }
                    },
                    "namePrefix": {
                      "type": "string",
                      "maxLength": 11,
                      "defaultValue": "store",
                      "metadata": {
                        "description": "Prefix for storage account name"
                      }
                    }
                  },
                  "variables": {
                    "storageAccountName": "[[concat(parameters('namePrefix'), uniquestring(resourceGroup().id))]"
                  },
                  "resources": [
                    {
                      "type": "Microsoft.Storage/storageAccounts",
                      "apiVersion": "2021-04-01",
                      "name": "[[variables('storageAccountName')]",
                      "location": "[[parameters('location')]",
                      "sku": {
                        "name": "[[parameters('storageAccountType')]"
                      },
                      "kind": "StorageV2",
                      "properties": {}
                    }
                  ],
                  "outputs": {
                    "storageAccountName": {
                      "type": "string",
                      "value": "[[variables('storageAccountName')]"
                    }
                  }
                }
              },
              "tags": {}
            }
          ]
        }
      ],
      "outputs": {}
    }
    ```

1. To add the new version to your template spec, deploy your template with Azure CLI or PowerShell.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName templateSpecRG `
      -TemplateFile "c:\Templates\azuredeploy.json"
    ```

    ```azurecli
    az deployment group create \
      --resource-group templateSpecRG \
      --template-file "c:\Templates\azuredeploy.json"
    ```

1. Copy the following template and save it locally to a file named **storage.json**.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {},
      "functions": [],
      "variables": {},
      "resources": [
        {
          "type": "Microsoft.Resources/deployments",
          "apiVersion": "2021-04-01",
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
      ],
      "outputs": {}
    }
    ```

1. Deploy your template with Azure CLI or PowerShell.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName storageRG `
      -TemplateFile "c:\Templates\storage.json"
    ```

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-file "c:\Templates\storage.json"
    ```

---

## Clean up resources

To clean up the resource you deployed in this quickstart, delete both resource groups that you created.

1. From the Azure portal, select Resource group from the left menu.

1. Enter the resource group name (templateSpecRG and storageRG) in the Filter by name field.

1. Select the resource group name.

1. Select Delete resource group from the top menu.

## Next steps

To learn about creating a template spec that includes linked templates, see [Create a template spec of a linked template](template-specs-create-linked.md).
